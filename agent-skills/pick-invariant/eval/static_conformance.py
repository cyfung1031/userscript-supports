#!/usr/bin/env python3
from pathlib import Path
import json,re,sys,hashlib
ROOT=Path(__file__).resolve().parents[1]
FAIL=[]; PASS=[]
def check(cond,label): (PASS if cond else FAIL).append(label)

skill=(ROOT/'SKILL.md').read_text(); norm_skill=' '.join(skill.lower().split()); package=(ROOT/'PACKAGE.md').read_text(); tests=(ROOT/'tests/acceptance_cases.md').read_text()
prob=(ROOT/'references/probability_semantics.md').read_text(); quot=(ROOT/'references/decision_quotients.md').read_text(); comp=(ROOT/'references/composition_and_refinement.md').read_text(); prompt=(ROOT/'references/prompt_and_presentation.md').read_text()

check('# PickInvariant v11.1' in skill,'core identifies v11.1')
check('version: `11.1.0`' in package,'package identifies 11.1.0')
for term in ['BYPASS','PICK_EXPLORE','PICK_AUDIT','PICK_DERIVE','FAST_DELTA','STRUCTURAL','COVERAGE',
             'FOCUSED_AUDIT','DELTA_AUDIT','FULL_AUDIT','AVAILABLE_NOW','PROSPECTIVE_ONLY','ERASED_UNRECOVERABLE']:
    check(term in skill,f'core contains {term}')
for term in ['P/I/B/χ','producer_guarantee >= consumer_requirement','NO_OWNER','PROCEDURE_GAP','INFERRED_PICKINVARIANT','PICK_LITERAL',
             'x1 ~D x2','Blackwell/Le Cam','COMPOSITION_TRIGGER','PROBABILITY_MEASURE_TRIGGER',
             'internal control logic, not mandatory user-facing ceremony']:
    check(term.lower() in skill.lower(),f'v11 safeguard reachable: {term}')

# Hard authority/presentation/firewall obligations must remain explicit in the compressed core.
for phrase in ['Exploration/audit evidence never creates derivation authority',
               'Only `COMPILE` may authorize action',
               'Every escalation names its witness',
               'Prove sufficiency before minimality',
               'Incidental stochastic vocabulary does not fire it',
               'If required detail is unavailable, narrow or downgrade the conclusion',
               'Never patch a known-insufficient representation only in the decision rule',
               'Rebind only on observed decision misclassification']:
    check(phrase.lower() in norm_skill,f'compressed kernel retains obligation: {phrase}')

refs=set(re.findall(r'`((?:references|integration|templates|examples|tests|eval)/[^`\n]+)`',skill))
for ref in sorted(refs): check((ROOT/ref).exists(),f'referenced path exists: {ref}')

# Specialist detail remains outside the always-loaded core.
for heavy in ['target_measure_μ = F_*ν','Jacobian_or_change_of_variables','regular_conditional_distribution_basis',
              'local_sections/facts:','counterexample_status: REAL | SPURIOUS | UNKNOWN']:
    check(heavy not in skill,f'heavy doctrine absent from core: {heavy}')
for term in ['target_measure_μ = F_*ν','NULL_CONDITIONING_TRIGGER','DECISION_EQUIVALENT','EPSILON_DECISION_SUFFICIENT','CANONICAL_RELATIVE_TO(G)']:
    check(term in prob,f'probability reference retains {term}')
for term in ['Myhill-Nerode','bisimulation','DECISION_DOMINATES','INCOMPARABLE_INFORMATION','EPSILON_DECISION_SUFFICIENT','remove or merge distinction']:
    check(term.lower() in quot.lower(),f'quotient reference retains {term}')
for term in ['COMPOSITION_TRIGGER','VALUATIVE','Ehrhart','LOCAL_GLOBAL_OBSTRUCTION_TRIGGER','ABSTRACTION_REFINEMENT_TRIGGER','SPURIOUS','cheapest reachable observation']:
    check(term in comp,f'composition/refinement retains {term}')
for term in ['internal control logic','native language','Do not narrate internal routing','observable obligations']:
    check(term.lower() in prompt.lower(),f'prompt/presentation retains {term}')

nums=[int(x) for x in re.findall(r'^### Test (\d+)\b',tests,re.M)]
check(nums==list(range(1,241)),'acceptance tests contiguous 1..240')

# Exact activation hard gate.
act=json.loads((ROOT/'eval/activation_results.json').read_text())
check(act['case_count']==88,'activation suite has 88 cases')
check(act['fixture_cases']==52 and act['boundary_cases']==36,'activation suite has 52 fixture + 36 boundary cases')
check(act['activation_equivalence'] and act['activation_drift_count']==0,'activation equivalence exact; zero drift')
check(act['mutation_sensitivity_all_protected_fields'],'activation suite detects protected-field mutations')
check(all(v['both'] for v in act['trigger_fire_do_not_fire_coverage'].values()),'every trigger has fire and do-not-fire coverage')

# Context is now hard relative to exact v11.0 snapshot.
ctx=json.loads((ROOT/'eval/context_cost.json').read_text())
check(ctx['hard_context_pareto'],'hard context Pareto passes')
check(ctx['v11_1_core']['words']<ctx['v11_0_core']['words'],'core word proxy strictly smaller')
check(ctx['v11_1_core']['chars']<ctx['v11_0_core']['chars'],'core chars strictly smaller')
check(ctx['v11_1_core']['bytes']<ctx['v11_0_core']['bytes'],'core bytes strictly smaller')
check(ctx['v11_1_core']['words']==len(skill.split()),'context report measures actual core')
check(ctx['v11_1_core']['words']<=951,'v11.1 core no larger than historical v10.1 951-word kernel')

res=json.loads((ROOT/'eval/results.json').read_text())
check(res['hard_pareto_improvement'],'v11.1 hard Pareto release gate passes')
check(res['parent_behavior_score']==res['candidate_behavior_score'],'no behavioral score bonus for compression')
check(res['parent_weighted_synthetic_cost']==res['candidate_weighted_synthetic_cost'],'synthetic cost exactly preserved')
check(res['parent_maintainability']==res['candidate_maintainability'],'maintainability not inflated')
check(res['sensitivity']['hard_pareto_win_rate']>=.999,'50k context sensitivity win rate >=99.9%')

# Prompt + behavioral lazy assets remain byte-identical to v11.0.
hashes=json.loads((ROOT/'eval/behavioral_hashes_v11_0.json').read_text())
check(len(hashes)>=40,'behavioral hash set is substantial')
check(all(v['identical'] for v in hashes.values()),'all protected behavioral assets byte-identical to v11.0')
for rel in ['agents/openai.yaml','references/prompt_and_presentation.md','references/probability_semantics.md',
            'references/decision_quotients.md','references/composition_and_refinement.md','integration/specialized_gates.md']:
    check(hashes.get(rel,{}).get('identical') is True,f'critical asset byte-identical: {rel}')

# Reproducibility artifacts.
for rel in ['eval/SKILL.v11.0.baseline.md','eval/derive_v11_0_activation_oracle.py','eval/activation_sim.py',
            'eval/activation_cases.jsonl','eval/activation_results.json','eval/activation_equivalence.csv',
            'eval/context_path_matrix.csv','eval/results_v11_0.json','eval/results.json','eval/SCORE_MATRIX.md',
            'eval/PARETO_PROOF.md','MIGRATION_v11.0_to_v11.1.md']:
    check((ROOT/rel).exists(),f'artifact exists: {rel}')

print(f'PASS {len(PASS)} / {len(PASS)+len(FAIL)}')
for x in FAIL: print('FAIL:',x)
if FAIL: sys.exit(1)
