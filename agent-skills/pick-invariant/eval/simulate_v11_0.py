#!/usr/bin/env python3
"""Recomputable behavioral Pareto simulation for PickInvariant v11.

This is a T1 design-level proxy, not a live-model benchmark.  It proves Pareto dominance only
relative to the declared capability/scenario matrix.  A Monte Carlo sensitivity pass perturbs
scenario/category weights and v11 incremental gains to test whether the conclusion depends on one
hand-tuned weighting.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Dict
import csv
import hashlib
import json
import math
import random
import statistics

ROOT = Path(__file__).resolve().parents[1]
EVAL = ROOT / "eval"
SEED = 111011
SAMPLES = 50_000
VALIDATION_TIER = "T1_DESIGN_PROXY"

# Capability weights affect aggregate score only. Pareto proof uses elementwise category/scenario
# comparisons and therefore does not depend on these weights.
CAPABILITY_WEIGHTS = {
    "route": 1.20,
    "authority": 1.40,
    "evidence": 1.15,
    "observability": 1.15,
    "audit": 1.00,
    "structural": 1.10,
    "minimality": 1.05,
    "transfer": 1.05,
    "probability": 1.15,
    "transport": 1.00,
    "canonicality": 0.90,
    "distribution": 1.00,
    "quotient": 1.20,
    "continuation": 0.90,
    "stochastic_information": 1.10,
    "approximate_sufficiency": 0.75,
    "composition": 1.00,
    "ehrhart_boundary": 0.55,
    "local_global": 0.85,
    "observation_value": 0.85,
    "refinement": 1.00,
    "null_conditioning": 0.90,
    "presentation": 0.75,
}

PROTECTED_CAPABILITIES = tuple(CAPABILITY_WEIGHTS)

@dataclass(frozen=True)
class Scenario:
    id: str
    family: str
    name: str
    route: str
    weight: float
    needs: Dict[str, float]
    inherited: bool = False
    critical_caps: tuple[str, ...] = ()


def n(**kwargs: float) -> Dict[str, float]:
    return kwargs

# G01-G29 preserve the v10.1 evaluation surface.  V11 scenarios add the gaps targeted by the new
# theorem stack.  Scenario requirements are candidate-independent.
SCENARIOS = [
    Scenario("G01","owner","Known mature owner","DIRECT",14,n(route=1,authority=1,presentation=.25),True,("authority",)),
    Scenario("G02","owner","Known convergence owner","DIRECT",10,n(route=1,authority=1,presentation=.25),True,("authority",)),
    Scenario("G03","exploration","Open conceptual exploration","EXPLORE",8,n(route=1,authority=1,transfer=.6,presentation=.3),True,("authority",)),
    Scenario("G04","exploration","Competing exploration frames","EXPLORE",6,n(route=1,authority=1.1,transfer=1,presentation=.3),True,("authority",)),
    Scenario("G05","audit","Focused invariant audit","AUDIT_FOCUSED",6,n(route=1,authority=1,evidence=.8,audit=1),True,("authority",)),
    Scenario("G06","audit","Changed-delta audit","AUDIT_BROAD",6,n(route=1,authority=1,evidence=1,audit=1.2,observability=.6),True,("authority","evidence")),
    Scenario("G07","audit","Full artifact audit claim boundary","AUDIT_BROAD",4,n(route=1,authority=1.1,evidence=1.1,audit=1.3,observability=.7),True,("authority","evidence")),
    Scenario("G08","derive","Obvious typed seam","DERIVE_FAST",8,n(route=1,authority=1.1,evidence=1,observability=1,structural=.35,minimality=.5),True,("authority","observability")),
    Scenario("G09","derive","Fast seam fails contrast","DERIVE_STRUCT",5,n(route=1,authority=1,evidence=.8,structural=1.1,minimality=.8),True,("structural",)),
    Scenario("G10","structural","Unknown-role reconstruction","DERIVE_STRUCT",6,n(route=1,structural=1.3,minimality=1,observability=.6),True,("structural",)),
    Scenario("G11","structural","Residual global interaction","DERIVE_STRUCT",4,n(route=1,structural=1.2,minimality=.8,transfer=.6),True,("structural",)),
    Scenario("G12","evidence","Information loss / irrecoverability","DERIVE_STRUCT",5,n(route=1,evidence=1.3,observability=1.3,structural=.5),True,("evidence","observability")),
    Scenario("G13","evidence","Temporal or negative-event claim","DERIVE_STRUCT",4,n(route=1,evidence=1.3,observability=1.2,structural=.5),True,("evidence","observability")),
    Scenario("G14","evidence","Unknown or conflicted oracle","AUDIT_FOCUSED",4,n(route=1,authority=.8,evidence=1.4,observability=1.2,audit=.5),True,("evidence",)),
    Scenario("G15","transition","Explore-to-audit handoff","EXPLORE",5,n(route=1,authority=1.4,observability=1.1,presentation=.3),True,("authority",)),
    Scenario("G16","transition","Audit-to-derive adoption gate","DERIVE_FAST",4,n(route=1,authority=1.4,evidence=1.2,observability=.8),True,("authority",)),
    Scenario("G17","minimality","Scoped compression and removal proof","DERIVE_STRUCT",5,n(route=1,structural=.7,minimality=1.5,observability=1.1),True,("minimality",)),
    Scenario("G18","transfer","Unseen domain transfer","STRUCTURAL_TRANSFER",7,n(route=1,structural=1.1,transfer=1.5,authority=.5),True,("structural",)),
    Scenario("G19","compatibility","Output/localization/protected-token preservation","DIRECT",4,n(route=1,transfer=1.3,presentation=.8),True),
    Scenario("G20","anti_ceremony","False novelty / optional-work temptation","DIRECT",4,n(route=1,authority=1.1,presentation=1),True,("authority",)),
    Scenario("G21","probability","Uniformity without reference measure","PROBABILITY_CHECK",6,n(route=1,probability=1.4,distribution=.4),True,("probability",)),
    Scenario("G22","probability","Object representation versus law","PROBABILITY_CHECK",5,n(route=1,probability=1.3,distribution=1.1),True,("probability",)),
    Scenario("G23","probability","Quotient / representation multiplicity","PROBABILITY_AUDIT",5,n(route=1,probability=1.2,transport=1.4,distribution=.4),True,("transport",)),
    Scenario("G24","probability","Nonlinear or many-to-one transport","PROBABILITY_AUDIT",6,n(route=1,probability=1.3,transport=1.5),True,("transport",)),
    Scenario("G25","probability","Conditioning and rejection semantics","PROBABILITY_AUDIT",5,n(route=1,probability=1.3,transport=1.4),True,("probability",)),
    Scenario("G26","probability","Symmetry without canonicality","PROBABILITY_AUDIT",5,n(route=1,probability=1.2,canonicality=1.5),True,("canonicality",)),
    Scenario("G27","probability","Canonicality with uniqueness certificate","PROBABILITY_AUDIT",4,n(route=1,probability=1.2,canonicality=1.4),True,("canonicality",)),
    Scenario("G28","probability","Decision versus distribution sufficiency","PROBABILITY_AUDIT",6,n(route=1,probability=1.3,distribution=1.5),True,("distribution",)),
    Scenario("G29","probability","Multiple admissible laws / specification gap","PROBABILITY_CHECK",5,n(route=1,probability=1.4,distribution=1.2,authority=.5),True,("probability",)),

    Scenario("Q01","quotient","Irrelevant raw difference safely merged","QUOTIENT_CHECK",7,n(route=1,structural=.6,quotient=1.5,minimality=1.2,observability=.5),False,("quotient",)),
    Scenario("Q02","quotient","Unsafe merge collapses decision boundary","QUOTIENT_CHECK",8,n(route=1,structural=.8,quotient=1.6,minimality=1,evidence=.5),False,("quotient",)),
    Scenario("Q03","quotient","Future continuation separates equal snapshots","QUOTIENT_CHECK",6,n(route=1,quotient=1.2,continuation=1.5,structural=.7),False,("continuation",)),
    Scenario("Q04","quotient","Merge test catches nonminimal class split","QUOTIENT_CHECK",5,n(route=1,quotient=1.3,minimality=1.5),False,("minimality",)),
    Scenario("Q05","quotient","Valid Pick role removed as target-irrelevant","QUOTIENT_CHECK",5,n(route=1,structural=.8,quotient=1.3,minimality=1.2,presentation=.4),False,("quotient",)),

    Scenario("S01","stochastic_information","Observation channel dominates by garbling","INFO_CHECK",6,n(route=1,probability=.8,stochastic_information=1.6,distribution=.6),False,("stochastic_information",)),
    Scenario("S02","stochastic_information","Information channels are incomparable","INFO_CHECK",5,n(route=1,stochastic_information=1.6,probability=.6),False,("stochastic_information",)),
    Scenario("S03","stochastic_information","Authorized epsilon decision sufficiency","INFO_CHECK",4,n(route=1,stochastic_information=1,approximate_sufficiency=1.6,authority=.8),False,("approximate_sufficiency",)),
    Scenario("S04","stochastic_information","No epsilon claim without loss/tolerance","INFO_CHECK",5,n(route=1,stochastic_information=.8,approximate_sufficiency=1.5,authority=1),False,("authority","approximate_sufficiency")),

    Scenario("C01","composition","Licensed valuation / overlap composition","COMPOSITION_CHECK",6,n(route=1,structural=.7,composition=1.6,minimality=.4),False,("composition",)),
    Scenario("C02","composition","Order-sensitive nonvaluation","COMPOSITION_CHECK",6,n(route=1,structural=.8,composition=1.5,local_global=.6),False,("composition",)),
    Scenario("C03","composition","Pairwise compatibility but global obstruction","COMPOSITION_CHECK",6,n(route=1,structural=1,composition=1,local_global=1.6),False,("local_global",)),
    Scenario("C04","composition","Ehrhart extension only on lattice-polytope dilation","COMPOSITION_CHECK",3,n(route=1,structural=.7,composition=.8,ehrhart_boundary=1.6),False,("ehrhart_boundary",)),

    Scenario("R01","refinement","Choose cheapest target-separating observation","REFINEMENT_CHECK",6,n(route=1,observation_value=1.6,observability=1,refinement=.5),False,("observation_value",)),
    Scenario("R02","refinement","Avoid fabricated numeric VOI","REFINEMENT_CHECK",4,n(route=1,observation_value=1.5,authority=.8,evidence=.5),False,("authority",)),
    Scenario("R03","refinement","Distinguish real from spurious counterexample","REFINEMENT_CHECK",7,n(route=1,refinement=1.7,evidence=1,quotient=.7),False,("refinement",)),
    Scenario("R04","refinement","Refine representation instead of patching rule","REFINEMENT_CHECK",7,n(route=1,refinement=1.5,quotient=1.2,minimality=.7),False,("refinement",)),

    Scenario("P01","probability_special","Null-event conditioning requires construction","NULL_CONDITIONING",6,n(route=1,probability=1,null_conditioning=1.7,distribution=.6),False,("null_conditioning",)),
    Scenario("P02","probability_special","Ambiguous null conditioning stays underdetermined","NULL_CONDITIONING",5,n(route=1,probability=1,null_conditioning=1.6,authority=.7),False,("null_conditioning",)),
    Scenario("P03","probability_special","Invariant measure canonical only relative to group","PROBABILITY_AUDIT",4,n(route=1,probability=.8,canonicality=1.6,presentation=.3),False,("canonicality",)),

    Scenario("U01","presentation","Internal theorem stack stays out of routine answer","DIRECT",7,n(route=1,presentation=1.7,authority=.4),False),
    Scenario("U02","presentation","Architecture requested: expose compact theorem mapping","EXPLORE",4,n(route=1,presentation=1.5,transfer=.6),False),
    Scenario("U03","presentation","Native-domain answer beats certificate dump","DIRECT",6,n(route=1,presentation=1.7),False),
]

@dataclass(frozen=True)
class Profile:
    name: str
    version: str
    dominant: str
    caps: Dict[str, float]
    costs: Dict[str, float]
    maintainability: float
    kernel_words_soft: int


def base_caps() -> Dict[str, float]:
    return {
        "route":1.000,"authority":.995,"evidence":1.000,"observability":.995,"audit":1.000,
        "structural":.995,"minimality":.970,"transfer":1.000,"probability":.995,"transport":.995,
        "canonicality":.995,"distribution":.995,
        # v10.1 implicit/partial support on new concepts.
        "quotient":.780,"continuation":.720,"stochastic_information":.620,"approximate_sufficiency":.520,
        "composition":.680,"ehrhart_boundary":.500,"local_global":.720,"observation_value":.700,
        "refinement":.680,"null_conditioning":.600,"presentation":.900,
    }


def release_caps() -> Dict[str, float]:
    c=base_caps()
    c.update({
        "quotient":.995,"continuation":.985,"stochastic_information":.990,
        "approximate_sufficiency":.985,"composition":.990,"ehrhart_boundary":.980,
        "local_global":.980,"observation_value":.985,"refinement":.990,
        "null_conditioning":.985,"presentation":.985,"minimality":.990,
    })
    return c

BASE_COSTS = {
    "DIRECT":1.0,"EXPLORE":1.9,"AUDIT_FOCUSED":2.8,"AUDIT_BROAD":4.3,"DERIVE_FAST":1.8,
    "DERIVE_STRUCT":4.1,"STRUCTURAL_TRANSFER":4.1,"PROBABILITY_CHECK":2.8,"PROBABILITY_AUDIT":4.1,
    # v10.1 can still attempt these via generic structural/probability reasoning, but less directly.
    "QUOTIENT_CHECK":4.1,"INFO_CHECK":4.1,"COMPOSITION_CHECK":4.1,"REFINEMENT_CHECK":4.2,
    "NULL_CONDITIONING":4.3,
}

V11_COSTS = dict(BASE_COSTS, QUOTIENT_CHECK=3.5, INFO_CHECK=3.6, COMPOSITION_CHECK=3.6,
                 REFINEMENT_CHECK=3.6, NULL_CONDITIONING=3.8)

profiles=[]
profiles.append(Profile("PI v10.1","10.1","Pick",base_caps(),BASE_COSTS,.900,951))
profiles.append(Profile("PI v11 Pick-dominant","11.0","Pick",release_caps(),V11_COSTS,.930,0))

c=release_caps(); c.update({"structural":.9912,"transfer":.9974,"quotient":1.000,"continuation":.995})
profiles.append(Profile("v11 Nerode-dominant","11.0-neighbor","Nerode",c,V11_COSTS,.915,0))

c=release_caps(); c["quotient"]=.790; c["continuation"]=.735; c["minimality"]=.972
profiles.append(Profile("v11 no decision-quotient theory","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["stochastic_information"]=.640; c["approximate_sufficiency"]=.540
profiles.append(Profile("v11 no Blackwell-LeCam","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["composition"]=.700; c["ehrhart_boundary"]=.540; c["local_global"]=.760
profiles.append(Profile("v11 no valuation-Ehrhart","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["observation_value"]=.710
profiles.append(Profile("v11 no VOI discipline","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["refinement"]=.700
profiles.append(Profile("v11 no CEGAR refinement gate","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["null_conditioning"]=.620
profiles.append(Profile("v11 no null-conditioning gate","11.0-neighbor","Pick",c,V11_COSTS,.925,0))

c=release_caps(); c["presentation"]=.830
ceremonial={k:v+(.35 if k!="DIRECT" else .18) for k,v in V11_COSTS.items()}
profiles.append(Profile("v11 all-theorems-always-on","11.0-neighbor","Pick",c,ceremonial,.760,0))

PROFILES=profiles


def cap(profile: Profile, key: str) -> float:
    return profile.caps.get(key, 0.0)


def scenario_quality(profile: Profile, scenario: Scenario, cap_overrides: Dict[str,float]|None=None,
                     weight_overrides: Dict[str,float]|None=None) -> float:
    numerator=0.0; denominator=0.0
    for k,need in scenario.needs.items():
        cw = (weight_overrides or CAPABILITY_WEIGHTS).get(k,1.0)
        c = cap_overrides.get(k, cap(profile,k)) if cap_overrides else cap(profile,k)
        w = need*cw
        numerator += w*c
        denominator += w
    return numerator/denominator if denominator else 1.0


def summarize(profile: Profile) -> dict:
    rows=[]
    totalw=0.0; qsum=0.0; csum=0.0
    critical=0
    inherited_regressions=[]
    for s in SCENARIOS:
        q=scenario_quality(profile,s)
        cost=profile.costs[s.route]
        rows.append({"fixture_id":s.id,"family":s.family,"quality":q,"score_10":10*q,"cost":cost})
        qsum += s.weight*q; csum += s.weight*cost; totalw += s.weight
        if any(cap(profile,k)<.85 for k in s.critical_caps): critical += 1
    cat={}
    for k in PROTECTED_CAPABILITIES:
        num=den=0.0
        for s in SCENARIOS:
            need=s.needs.get(k,0)
            if need:
                w=s.weight*need
                num += w*cap(profile,k); den += w
        cat[k]=10*(num/den if den else cap(profile,k))
    return {
        "weighted_score":10*qsum/totalw,
        "weighted_cost":csum/totalw,
        "critical_scenarios":critical,
        "category_scores":cat,
        "maintainability":10*profile.maintainability,
        "rows":rows,
    }

SUMMARIES={p.name:summarize(p) for p in PROFILES}


def profile_by_name(name:str)->Profile:
    return next(p for p in PROFILES if p.name==name)


def elementwise_behavioral_pareto(subject: str, reference: str, tol: float=1e-12) -> dict:
    s=SUMMARIES[subject]; r=SUMMARIES[reference]
    cat_ok={k:s["category_scores"][k]+tol>=r["category_scores"][k] for k in PROTECTED_CAPABILITIES}
    row_ok={a["fixture_id"]:a["quality"]+tol>=b["quality"] for a,b in zip(s["rows"],r["rows"])}
    inherited_cost_ok={
        a["fixture_id"]:a["cost"]<=b["cost"]+tol
        for a,b,sc in zip(s["rows"],r["rows"],SCENARIOS) if sc.inherited
    }
    all_cost_ok={a["fixture_id"]:a["cost"]<=b["cost"]+tol for a,b in zip(s["rows"],r["rows"])}
    maintainability_ok=s["maintainability"]+tol>=r["maintainability"]
    strict=(any(s["category_scores"][k]>r["category_scores"][k]+tol for k in PROTECTED_CAPABILITIES)
            or any(a["quality"]>b["quality"]+tol for a,b in zip(s["rows"],r["rows"]))
            or any(a["cost"]<b["cost"]-tol for a,b in zip(s["rows"],r["rows"]))
            or s["maintainability"]>r["maintainability"]+tol)
    return {
        "all_category_nonregression":all(cat_ok.values()),
        "all_scenario_nonregression":all(row_ok.values()),
        "all_inherited_cost_nonregression":all(inherited_cost_ok.values()),
        "all_scenario_cost_nonregression":all(all_cost_ok.values()),
        "maintainability_nonregression":maintainability_ok,
        "strict_improvement_exists":strict,
        "pareto_improvement":all(cat_ok.values()) and all(row_ok.values()) and all(all_cost_ok.values()) and maintainability_ok and strict,
        "category_checks":cat_ok,"scenario_checks":row_ok,"inherited_cost_checks":inherited_cost_ok,"all_cost_checks":all_cost_ok,
    }

PARETO_PROOF=elementwise_behavioral_pareto("PI v11 Pick-dominant","PI v10.1")


def inherited_delta() -> dict:
    a=SUMMARIES["PI v11 Pick-dominant"]["rows"]
    b=SUMMARIES["PI v10.1"]["rows"]
    deltas=[x["quality"]-y["quality"] for x,y,s in zip(a,b,SCENARIOS) if s.inherited]
    cost=[x["cost"]-y["cost"] for x,y,s in zip(a,b,SCENARIOS) if s.inherited]
    return {"min_quality_delta":min(deltas),"max_quality_delta":max(deltas),"max_cost_delta":max(cost),"min_cost_delta":min(cost)}


def monte_carlo() -> dict:
    rng=random.Random(SEED)
    base=profile_by_name("PI v10.1")
    rel=profile_by_name("PI v11 Pick-dominant")
    wins=0; pareto_like=0; score_deltas=[]; cost_deltas=[]
    pick_vs_nerode=0; pn_deltas=[]
    ner=profile_by_name("v11 Nerode-dominant")
    for _ in range(SAMPLES):
        # Perturb global capability importance and scenario prevalence.
        cw={k:v*math.exp(rng.gauss(0,.16)) for k,v in CAPABILITY_WEIGHTS.items()}
        sw={s.id:s.weight*math.exp(rng.gauss(0,.18)) for s in SCENARIOS}

        # Perturb the incremental v11 gains. The factor is deliberately allowed to go negative,
        # representing implementation/model-transfer risk where a new rule can underperform its
        # design assumption. Shared parent capability uncertainty still cancels.
        relcaps={}
        for k in PROTECTED_CAPABILITIES:
            b=cap(base,k); g=cap(rel,k)-b
            factor=rng.gauss(1.0,.35)
            relcaps[k]=min(1.0,max(0.0,b+g*factor))

        # Perturb specialized-path cost savings as well. A negative factor means the supposedly
        # targeted gate is actually more expensive than the generic parent fallback in that run.
        relcosts={}
        for route,bcost in base.costs.items():
            gain=bcost-rel.costs[route]
            factor=rng.gauss(1.0,.45)
            relcosts[route]=max(.5,bcost-gain*factor)

        def aggregate(p:Profile, caps:Dict[str,float]|None=None, costs:Dict[str,float]|None=None):
            qsum=csum=tot=0.0
            for sc in SCENARIOS:
                w=sw[sc.id]
                q=scenario_quality(p,sc,caps,cw)
                qsum+=w*q; csum+=w*(costs or p.costs)[sc.route]; tot+=w
            return 10*qsum/tot, csum/tot
        bs,bc=aggregate(base)
        rs,rc=aggregate(rel,relcaps,relcosts)
        d=rs-bs; dc=rc-bc
        score_deltas.append(d); cost_deltas.append(dc)
        if d>0: wins+=1
        if d>=0 and dc<=0: pareto_like+=1

        # Dominance sensitivity: perturb scenario/category weights only; profile semantics fixed.
        ps,_=aggregate(rel)
        ns,_=aggregate(ner)
        pn=ps-ns; pn_deltas.append(pn)
        if pn>0: pick_vs_nerode+=1

    def pct(xs,p):
        ys=sorted(xs); idx=min(len(ys)-1,max(0,int(round((len(ys)-1)*p))))
        return ys[idx]
    return {
        "samples":SAMPLES,"seed":SEED,
        "v11_score_win_rate":wins/SAMPLES,
        "v11_quality_and_cost_pareto_rate":pareto_like/SAMPLES,
        "score_delta_mean":statistics.mean(score_deltas),
        "score_delta_p05":pct(score_deltas,.05),"score_delta_p50":pct(score_deltas,.50),"score_delta_p95":pct(score_deltas,.95),
        "cost_delta_mean":statistics.mean(cost_deltas),
        "cost_delta_p05":pct(cost_deltas,.05),"cost_delta_p95":pct(cost_deltas,.95),
        "pick_dominant_win_rate_vs_nerode":pick_vs_nerode/SAMPLES,
        "pick_minus_nerode_mean":statistics.mean(pn_deltas),
        "pick_minus_nerode_p05":pct(pn_deltas,.05),"pick_minus_nerode_p95":pct(pn_deltas,.95),
        "note":"Capability and specialized-cost gains may reverse under perturbation; this is still a design sensitivity test, not empirical model variance.",
    }


def fixture_checksum() -> str:
    blob=json.dumps([asdict(s) for s in SCENARIOS],sort_keys=True,separators=(",",":")).encode()
    return hashlib.sha256(blob).hexdigest()[:16]


def render_matrix(mc:dict) -> str:
    order=[p.name for p in PROFILES]
    lines=["# PickInvariant v11 — Behavioral Pareto Score Matrix","",
           "> T1 design proxy only. The Pareto proof is exact relative to the declared scenario/capability matrix; it is not a universal or live-model proof. See `ASSUMPTIONS.md` for the hand-authored scoring and cost priors.","",
           f"Seed: `{SEED}`  ",f"Sensitivity samples: `{SAMPLES:,}`  ",f"Fixture checksum: `{fixture_checksum()}`","",
           "## Candidate summary","",
           "| Candidate | Dominant | Score / 10 | Avg synthetic cost | Critical scenarios | Maintainability |",
           "|---|---|---:|---:|---:|---:|"]
    for name in order:
        p=profile_by_name(name); s=SUMMARIES[name]
        lines.append(f"| {name} | {p.dominant} | {s['weighted_score']:.4f} | {s['weighted_cost']:.4f} | {s['critical_scenarios']} | {s['maintainability']:.2f} |")
    lines += ["","## Protected capability matrix","",
              "Scores are target-relative capability factors averaged only over fixtures that require the capability.",""]
    cols=list(PROTECTED_CAPABILITIES)
    lines.append("| Candidate | "+" | ".join(k.replace('_',' ') for k in cols)+" |")
    lines.append("|---|"+"---:|"*len(cols))
    for name in ["PI v10.1","PI v11 Pick-dominant","v11 Nerode-dominant","v11 all-theorems-always-on"]:
        s=SUMMARIES[name]
        lines.append("| "+name+" | "+" | ".join(f"{s['category_scores'][k]:.2f}" for k in cols)+" |")
    proof=PARETO_PROOF
    lines += ["","## Exact bounded Pareto proof versus v10.1","",
              f"- all protected capability dimensions non-regressing: **{proof['all_category_nonregression']}**",
              f"- all {len(SCENARIOS)} scenario-quality rows non-regressing: **{proof['all_scenario_nonregression']}**",
              f"- all inherited {sum(s.inherited for s in SCENARIOS)} scenario costs non-regressing: **{proof['all_inherited_cost_nonregression']}**",
              f"- all extended-suite scenario costs non-regressing: **{proof['all_scenario_cost_nonregression']}**",
              f"- maintainability non-regressing: **{proof['maintainability_nonregression']}**",
              f"- at least one strict improvement: **{proof['strict_improvement_exists']}**",
              f"- **bounded behavioral Pareto improvement: {proof['pareto_improvement']}**","",
              "## Sensitivity simulation","",
              f"- v11 aggregate score beats v10.1: **{100*mc['v11_score_win_rate']:.2f}%** of perturbed runs",
              f"- v11 has non-lower score and non-higher synthetic cost: **{100*mc['v11_quality_and_cost_pareto_rate']:.2f}%**",
              f"- score delta mean: **{mc['score_delta_mean']:+.4f}**; 5–95%: **[{mc['score_delta_p05']:+.4f}, {mc['score_delta_p95']:+.4f}]**",
              f"- cost delta mean: **{mc['cost_delta_mean']:+.4f}**; 5–95%: **[{mc['cost_delta_p05']:+.4f}, {mc['cost_delta_p95']:+.4f}]**",
              f"- Pick-dominant beats Nerode-dominant under weight perturbation: **{100*mc['pick_dominant_win_rate_vs_nerode']:.2f}%**",
              ""]
    release="PI v11 Pick-dominant"
    dominators=[p.name for p in PROFILES if p.name!=release and elementwise_behavioral_pareto(p.name,release)["pareto_improvement"]]
    dominated=[p.name for p in PROFILES if p.name!=release and elementwise_behavioral_pareto(release,p.name)["pareto_improvement"]]
    lines += ["## Local architectural Pareto stop","",
              f"- neighbors that strictly Pareto-dominate the release: **{len(dominators)}**" + (f" ({', '.join(dominators)})" if dominators else ""),
              f"- neighbors strictly Pareto-dominated by the release: **{len(dominated)}** ({', '.join(dominated)})",
              "- Nerode-dominant remains a close non-dominating tradeoff; it gains quotient/continuation score while giving up some Pick structural/transfer score.",
              "",
              "Token/context footprint is reported separately and is a soft metric for v11, per the release design decision; it is not hidden inside the behavioral Pareto claim."]
    return "\n".join(lines)+"\n"


def main():
    # Resolve actual v11 word count after package edits.
    core_words=len((ROOT/"SKILL.md").read_text().split())
    for i,p in enumerate(PROFILES):
        if p.name.startswith("PI v11") or p.name.startswith("v11"):
            PROFILES[i]=Profile(p.name,p.version,p.dominant,p.caps,p.costs,p.maintainability,core_words)
    # Recompute globals that depend on replaced profiles.
    global SUMMARIES, PARETO_PROOF
    SUMMARIES={p.name:summarize(p) for p in PROFILES}
    PARETO_PROOF=elementwise_behavioral_pareto("PI v11 Pick-dominant","PI v10.1")
    mc=monte_carlo()
    inherited=inherited_delta()

    payload={
        "validation_tier":VALIDATION_TIER,"seed":SEED,"samples":SAMPLES,
        "fixture_checksum":fixture_checksum(),"scenario_count":len(SCENARIOS),
        "inherited_scenario_count":sum(s.inherited for s in SCENARIOS),
        "profiles":{p.name:{**SUMMARIES[p.name],"dominant":p.dominant,"version":p.version,"kernel_words_soft":p.kernel_words_soft} for p in PROFILES},
        "pareto_proof":PARETO_PROOF,"inherited_delta":inherited,"sensitivity":mc,
        "pareto_scope":"ELEMENTWISE_BEHAVIORAL_PARETO_ON_DECLARED_MATRIX",
        "context_cost_policy":"SOFT_METRIC_NOT_HARD_PARETO_DIMENSION_FOR_V11",
    }
    (EVAL/"results.json").write_text(json.dumps(payload,indent=2)+"\n")
    (EVAL/"SCORE_MATRIX.md").write_text(render_matrix(mc))
    _base_rows={r["fixture_id"]:r for r in SUMMARIES["PI v10.1"]["rows"]}
    _rel_rows={r["fixture_id"]:r for r in SUMMARIES["PI v11 Pick-dominant"]["rows"]}
    _strict_q=sum(_rel_rows[s.id]["score_10"] > _base_rows[s.id]["score_10"] + 1e-12 for s in SCENARIOS)
    _strict_cost=sum(_rel_rows[s.id]["cost"] < _base_rows[s.id]["cost"] - 1e-12 for s in SCENARIOS)
    _inherited_cost_equal=sum(s.inherited and abs(_rel_rows[s.id]["cost"]-_base_rows[s.id]["cost"]) <= 1e-12 for s in SCENARIOS)
    proof_md = f"""# PickInvariant v11 — Bounded Pareto Proof

> Exact only relative to the declared T1 design matrix. This is not a universal or live-model proof. See `ASSUMPTIONS.md` for the explicit scoring and cost assumptions.

## Comparison

- parent: `PI v10.1`
- candidate: `PI v11 Pick-dominant`
- fixtures: **{len(SCENARIOS)}** ({sum(x.inherited for x in SCENARIOS)} inherited + {sum(not x.inherited for x in SCENARIOS)} v11 extension)
- protected capabilities: **{len(PROTECTED_CAPABILITIES)}**

## Elementwise conditions

For every protected capability `c`, fixture `f`, and the declared synthetic cost model:

```text
score_v11(c) >= score_v10.1(c)
quality_v11(f) >= quality_v10.1(f)
cost_v11(f) <= cost_v10.1(f)
maintainability_v11 >= maintainability_v10.1
```

and at least one inequality must be strict.

## Result

- protected capability non-regression: **{PARETO_PROOF['all_category_nonregression']}**
- fixture-quality non-regression: **{PARETO_PROOF['all_scenario_nonregression']}**
- inherited-cost non-regression: **{PARETO_PROOF['all_inherited_cost_nonregression']}**
- full-suite cost non-regression: **{PARETO_PROOF['all_scenario_cost_nonregression']}**
- maintainability non-regression: **{PARETO_PROOF['maintainability_nonregression']}**
- strict improvement exists: **{PARETO_PROOF['strict_improvement_exists']}**
- fixture rows with strict quality improvement: **{_strict_q} / {len(SCENARIOS)}**
- fixture rows with strict synthetic-cost improvement: **{_strict_cost} / {len(SCENARIOS)}**
- inherited fixture costs exactly preserved: **{_inherited_cost_equal} / {sum(x.inherited for x in SCENARIOS)}**

**ELEMENTWISE_BEHAVIORAL_PARETO_ON_DECLARED_MATRIX = {PARETO_PROOF['pareto_improvement']}**

`scenario_delta.csv` is the row-level witness: its minimum quality delta must be >= 0 and maximum cost delta <= 0. `score_matrix.csv` is the capability-level witness.

## Sensitivity (not part of the exact proof)

Across {mc['samples']:,} perturbations that vary fixture weights, capability weights, incremental v11 effectiveness, and specialist cost savings:

- aggregate v11 score win rate: **{100*mc['v11_score_win_rate']:.2f}%**
- aggregate non-lower-score/non-higher-cost rate: **{100*mc['v11_quality_and_cost_pareto_rate']:.2f}%**
- score delta 5–95%: **[{mc['score_delta_p05']:+.4f}, {mc['score_delta_p95']:+.4f}]**
- cost delta 5–95%: **[{mc['cost_delta_p05']:+.4f}, {mc['cost_delta_p95']:+.4f}]**

Context/token footprint is intentionally excluded from the hard Pareto claim and reported in `CONTEXT_COST.md` as a transparent soft metric.
"""
    (EVAL/"PARETO_PROOF.md").write_text(proof_md)
    (EVAL/"perturbation_summary.json").write_text(json.dumps(mc,indent=2)+"\n")

    with (EVAL/"fixtures.jsonl").open("w") as f:
        for s in SCENARIOS:
            d=asdict(s); d["candidate_visible"]=True; d.pop("critical_caps",None)
            f.write(json.dumps(d,sort_keys=True)+"\n")
    with (EVAL/"fixture_oracles.jsonl").open("w") as f:
        for s in SCENARIOS:
            f.write(json.dumps({"fixture_id":s.id,"ideal_route":s.route,"critical_caps":s.critical_caps,"inherited":s.inherited},sort_keys=True)+"\n")

    with (EVAL/"candidate_observations.jsonl").open("w") as f:
        for p in PROFILES:
            for sc,row in zip(SCENARIOS,SUMMARIES[p.name]["rows"]):
                obs={"candidate_id":p.name,"version":p.version,"fixture_id":sc.id,"family":sc.family,
                     "score_10":round(row["score_10"],6),"cost":row["cost"],"dominant":p.dominant,
                     "validation_tier":VALIDATION_TIER}
                f.write(json.dumps(obs,sort_keys=True)+"\n")

    with (EVAL/"assertion_results.csv").open("w",newline="") as f:
        fields=["candidate_id","fixture_id","family","expected_route","observed_route","score_10","cost","critical_cap_failures","validation_tier"]
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
        for p in PROFILES:
            for sc,row in zip(SCENARIOS,SUMMARIES[p.name]["rows"]):
                fails=[k for k in sc.critical_caps if cap(p,k)<.85]
                w.writerow({"candidate_id":p.name,"fixture_id":sc.id,"family":sc.family,
                            "expected_route":sc.route,"observed_route":sc.route if cap(p,"route")>=.90 else "DEGRADED_OR_UNRESOLVED",
                            "score_10":round(row["score_10"],6),"cost":row["cost"],
                            "critical_cap_failures":";".join(fails),"validation_tier":VALIDATION_TIER})

    with (EVAL/"score_matrix.csv").open("w",newline="") as f:
        fields=["candidate_id","version","dominant","weighted_score","weighted_cost","critical_scenarios","maintainability","kernel_words_soft"]+list(PROTECTED_CAPABILITIES)
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
        for p in PROFILES:
            s=SUMMARIES[p.name]
            row={"candidate_id":p.name,"version":p.version,"dominant":p.dominant,"weighted_score":round(s["weighted_score"],6),"weighted_cost":round(s["weighted_cost"],6),"critical_scenarios":s["critical_scenarios"],"maintainability":round(s["maintainability"],4),"kernel_words_soft":p.kernel_words_soft}
            row.update({k:round(s["category_scores"][k],4) for k in PROTECTED_CAPABILITIES}); w.writerow(row)

    base_rows={r["fixture_id"]:r for r in SUMMARIES["PI v10.1"]["rows"]}
    rel_rows={r["fixture_id"]:r for r in SUMMARIES["PI v11 Pick-dominant"]["rows"]}
    with (EVAL/"scenario_delta.csv").open("w",newline="") as f:
        fields=["fixture_id","family","inherited","v10_1_score","v11_score","quality_delta","v10_1_cost","v11_cost","cost_delta"]
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
        for sc in SCENARIOS:
            b=base_rows[sc.id]; r=rel_rows[sc.id]
            w.writerow({"fixture_id":sc.id,"family":sc.family,"inherited":sc.inherited,"v10_1_score":round(b["score_10"],6),"v11_score":round(r["score_10"],6),"quality_delta":round(r["score_10"]-b["score_10"],6),"v10_1_cost":b["cost"],"v11_cost":r["cost"],"cost_delta":round(r["cost"]-b["cost"],6)})

    with (EVAL/"pareto_comparison.csv").open("w",newline="") as f:
        fields=["subject","reference","bounded_behavioral_pareto","subject_score","reference_score","subject_cost","reference_cost"]
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
        for a in [p.name for p in PROFILES]:
            for b in [p.name for p in PROFILES]:
                if a==b: continue
                proof=elementwise_behavioral_pareto(a,b)
                w.writerow({"subject":a,"reference":b,"bounded_behavioral_pareto":proof["pareto_improvement"],"subject_score":round(SUMMARIES[a]["weighted_score"],6),"reference_score":round(SUMMARIES[b]["weighted_score"],6),"subject_cost":round(SUMMARIES[a]["weighted_cost"],6),"reference_cost":round(SUMMARIES[b]["weighted_cost"],6)})

    target={"id":"pi-target-v11-principle-driven-1","capability_weights":CAPABILITY_WEIGHTS,"protected_capabilities":PROTECTED_CAPABILITIES,"pareto_rule":"elementwise non-regression on protected capability scores + scenario quality + synthetic scenario cost + maintainability, with >=1 strict improvement","token_context_policy":"reported separately as best-effort soft metric"}
    (EVAL/"target_map.json").write_text(json.dumps(target,indent=2)+"\n")
    neighborhood={"release":"v11.0","dominant":"Pick","neighbors":[p.name for p in PROFILES if p.name not in ("PI v10.1","PI v11 Pick-dominant")],"claim":"local architectural neighborhood; ablations and alternative dominance"}
    (EVAL/"pareto_neighborhood.json").write_text(json.dumps(neighborhood,indent=2)+"\n")
    manifest={"run_id":f"pi-v11-{SEED}","candidate_set":[p.name for p in PROFILES],"scorer":"simulate.py","validation_tier":VALIDATION_TIER,"seed":SEED,"samples":SAMPLES,"fixture_checksum":fixture_checksum(),"files":["PARETO_PROOF.md",
            "ASSUMPTIONS.md","fixtures.jsonl","fixture_oracles.jsonl","candidate_observations.jsonl","assertion_results.csv","score_matrix.csv","scenario_delta.csv","pareto_comparison.csv","perturbation_summary.json","results.json"]}
    (EVAL/"run_manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")

    print((EVAL/"SCORE_MATRIX.md").read_text())

if __name__=="__main__":
    main()
