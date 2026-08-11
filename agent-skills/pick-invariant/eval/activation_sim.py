#!/usr/bin/env python3
"""Bounded activation-equivalence simulation for PickInvariant v11.1.

The expected activation vectors are a frozen oracle derived from the released v11.0 routing/firewall
semantics. v11.1 must match every field exactly. Boundary cases include both fire and do-not-fire
pairs. Mutation checks verify the suite is capable of detecting drift in every protected activation.
"""
from __future__ import annotations
from pathlib import Path
import json, hashlib

ROOT = Path(__file__).resolve().parents[1]
CASES = ROOT / 'eval' / 'activation_cases.jsonl'
OUT = ROOT / 'eval' / 'activation_results.json'
CSV = ROOT / 'eval' / 'activation_equivalence.csv'

TRIGGERS = [
    'PROBABILITY_MEASURE_TRIGGER','DECISION_QUOTIENT_TRIGGER','COMPOSITION_TRIGGER',
    'NULL_CONDITIONING_TRIGGER','SYMMETRY_INVARIANT_MEASURE_TRIGGER','EHRHART_TRIGGER',
    'OBSERVATION_VALUE_TRIGGER','ABSTRACTION_REFINEMENT_TRIGGER','LOCAL_GLOBAL_OBSTRUCTION_TRIGGER',
    'COVERAGE'
]


def candidate_activation(f: dict) -> dict:
    # Authority/mode semantics are intentionally identical to v11.0.
    if f.get('request') == 'explore':
        mode = 'PICK_EXPLORE'
    elif f.get('request') == 'audit':
        mode = 'PICK_AUDIT'
    elif f.get('adopted_gap') or not f.get('validated_owner', False):
        mode = 'PICK_DERIVE'
    else:
        mode = 'BYPASS'

    if mode == 'BYPASS':
        depth = 'DIRECT'
    elif mode == 'PICK_DERIVE' and f.get('fast_delta_eligible') and not f.get('structural_witness'):
        depth = 'FAST_DELTA'
    elif f.get('structural_witness') or f.get('pick_roles_material'):
        depth = 'STRUCTURAL'
    else:
        depth = 'DIRECT'

    coverage = mode == 'PICK_AUDIT' and f.get('audit_depth') in {'DELTA_AUDIT','FULL_AUDIT'}
    probability = bool(f.get('probability_material'))
    quotient = bool(f.get('merge_equivalence') or f.get('minimal_claim') or f.get('continuation_material') or f.get('stochastic_channel_compare'))
    composition = bool(f.get('composition_material'))
    null_cond = probability and bool(f.get('null_condition'))
    symmetry = probability and bool(f.get('symmetry_canonical_claim'))
    ehrhart = bool(f.get('ehrhart_literal_extension'))
    voi = bool(f.get('multiple_observations_cost_matters'))
    refine = bool(f.get('abstraction_counterexample'))
    local_global = composition and bool(f.get('local_global_obstruction'))

    triggers = {
        'PROBABILITY_MEASURE_TRIGGER': probability,
        'DECISION_QUOTIENT_TRIGGER': quotient,
        'COMPOSITION_TRIGGER': composition,
        'NULL_CONDITIONING_TRIGGER': null_cond,
        'SYMMETRY_INVARIANT_MEASURE_TRIGGER': symmetry,
        'EHRHART_TRIGGER': ehrhart,
        'OBSERVATION_VALUE_TRIGGER': voi,
        'ABSTRACTION_REFINEMENT_TRIGGER': refine,
        'LOCAL_GLOBAL_OBSTRUCTION_TRIGGER': local_global,
        'COVERAGE': coverage,
    }

    refs = set()
    if mode == 'PICK_EXPLORE': refs.add('references/exploration_and_adaptive_rigor.md')
    if f.get('pick_roles_material') or f.get('literal_pick') or depth == 'STRUCTURAL':
        refs |= {'references/pick_abstraction.md','references/pick_representation.md'}
    if f.get('theorem_architecture_explanation'):
        refs.add('references/theorem_provenance.md')
    if quotient:
        refs.add('references/decision_quotients.md')
    if mode == 'PICK_AUDIT':
        refs.add('references/audit_and_contrast.md')
        if coverage: refs.add('references/review_scope_and_coverage.md')
    if mode == 'PICK_DERIVE':
        refs |= {'references/procedure_gaps.md','references/binding_and_rebinding.md','references/execution_and_failures.md'}
    if f.get('architecture_resolution'):
        refs |= {'references/architecture.md','integration/procedure_resolution.md'}
    if f.get('seam_history_time'):
        refs.add('references/seams_information_and_time.md')
    if probability:
        refs.add('references/probability_semantics.md')
    if composition or voi or refine:
        refs.add('references/composition_and_refinement.md')
    if any((null_cond, symmetry, ehrhart, local_global)):
        refs.add('integration/specialized_gates.md')
    if f.get('prompt_presentation_design'):
        refs.add('references/prompt_and_presentation.md')
    if f.get('robustness'):
        refs.add('references/robustness.md')
    if f.get('release_eval'):
        refs.add('references/no_drawback_contract.md')
        refs.add('eval/')

    return {'mode':mode,'depth':depth,'triggers':triggers,'refs':sorted(refs)}


def canonical(x):
    return json.dumps(x,sort_keys=True,separators=(',',':'))


def load_cases():
    return [json.loads(line) for line in CASES.read_text().splitlines() if line.strip()]


def main():
    cases=load_cases()
    rows=[]; failures=[]
    for c in cases:
        got=candidate_activation(c['features'])
        exp=c['expected_v11_0']
        ok=canonical(got)==canonical(exp)
        rows.append((c['id'],c['kind'],ok,canonical(exp),canonical(got)))
        if not ok: failures.append(c['id'])

    # Mutation sensitivity: for each protected trigger, invert that output in all cases and require
    # the suite to notice at least one mismatch. Mode/depth/ref-set sensitivity are also checked.
    sensitivity={}
    base=[candidate_activation(c['features']) for c in cases]
    expected=[c['expected_v11_0'] for c in cases]
    for t in TRIGGERS:
        detected=0
        for g,e in zip(base,expected):
            m=json.loads(json.dumps(g))
            m['triggers'][t]=not m['triggers'][t]
            if canonical(m)!=canonical(e): detected += 1
        sensitivity[t]=detected>0
    for field in ['mode','depth']:
        detected=0
        for g,e in zip(base,expected):
            m=json.loads(json.dumps(g)); m[field]='__MUTATED__'
            if canonical(m)!=canonical(e): detected += 1
        sensitivity[field]=detected>0
    detected=0
    for g,e in zip(base,expected):
        m=json.loads(json.dumps(g)); m['refs']=sorted(set(m['refs'])|{'__mutated_ref__'})
        if canonical(m)!=canonical(e): detected += 1
    sensitivity['refs']=detected>0

    # Fire/do-not-fire coverage for each trigger.
    trigger_coverage={}
    for t in TRIGGERS:
        vals=[e['triggers'][t] for e in expected]
        trigger_coverage[t]={'fires':sum(vals),'does_not_fire':len(vals)-sum(vals),'both':any(vals) and not all(vals)}

    checksum=hashlib.sha256(CASES.read_bytes()).hexdigest()
    result={
        'validation_tier':'T1_DESIGN_PROXY',
        'parent':'PickInvariant v11.0',
        'candidate':'PickInvariant v11.1',
        'case_count':len(cases),
        'fixture_cases':sum(c['kind']=='fixture' for c in cases),
        'boundary_cases':sum(c['kind']=='boundary' for c in cases),
        'exact_activation_matches':len(cases)-len(failures),
        'activation_drift_count':len(failures),
        'activation_equivalence':not failures,
        'failed_case_ids':failures,
        'mutation_sensitivity_all_protected_fields':all(sensitivity.values()),
        'mutation_sensitivity':sensitivity,
        'trigger_fire_do_not_fire_coverage':trigger_coverage,
        'case_checksum_sha256':checksum,
    }
    OUT.write_text(json.dumps(result,indent=2)+'\n')
    import csv
    with CSV.open('w',newline='') as fh:
        w=csv.writer(fh); w.writerow(['case_id','kind','exact_match','expected_v11_0','actual_v11_1']); w.writerows(rows)
    print(json.dumps(result,indent=2))
    if failures or not all(sensitivity.values()) or not all(v['both'] for v in trigger_coverage.values()):
        raise SystemExit(1)

if __name__=='__main__': main()
