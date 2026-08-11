#!/usr/bin/env python3
"""Freeze the released v11.0 activation semantics for the declared feature cases.

This interpreter is intentionally separate from v11.1's candidate interpreter. It translates the
v11.0 mode/depth/firewall/progressive-loading rules into a deterministic oracle used only for T1
regression evaluation.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
CASES=ROOT/'eval/activation_cases.jsonl'


def baseline_v11_0(f):
    # Primary authority mode from v11.0 §1.
    request=f.get('request','normal')
    owner=bool(f.get('validated_owner'))
    gap=bool(f.get('adopted_gap'))
    if request=='explore': mode='PICK_EXPLORE'
    elif request=='audit': mode='PICK_AUDIT'
    elif (not owner) or gap: mode='PICK_DERIVE'
    else: mode='BYPASS'

    # Adaptive depth from v11.0 §3. Specialized gates do not alter depth by themselves.
    structural=bool(f.get('structural_witness') or f.get('pick_roles_material'))
    if mode=='BYPASS': depth='DIRECT'
    elif mode=='PICK_DERIVE' and f.get('fast_delta_eligible') and not structural: depth='FAST_DELTA'
    elif structural: depth='STRUCTURAL'
    else: depth='DIRECT'

    broad_audit=mode=='PICK_AUDIT' and f.get('audit_depth') in ('DELTA_AUDIT','FULL_AUDIT')
    probability=bool(f.get('probability_material'))
    quotient=any(bool(f.get(k)) for k in ('merge_equivalence','minimal_claim','continuation_material','stochastic_channel_compare'))
    composition=bool(f.get('composition_material'))
    null_gate=probability and bool(f.get('null_condition'))
    symmetry_gate=probability and bool(f.get('symmetry_canonical_claim'))
    ehrhart_gate=bool(f.get('ehrhart_literal_extension'))
    voi_gate=bool(f.get('multiple_observations_cost_matters'))
    refinement_gate=bool(f.get('abstraction_counterexample'))
    local_global_gate=composition and bool(f.get('local_global_obstruction'))

    tr={
      'PROBABILITY_MEASURE_TRIGGER': probability,
      'DECISION_QUOTIENT_TRIGGER': quotient,
      'COMPOSITION_TRIGGER': composition,
      'NULL_CONDITIONING_TRIGGER': null_gate,
      'SYMMETRY_INVARIANT_MEASURE_TRIGGER': symmetry_gate,
      'EHRHART_TRIGGER': ehrhart_gate,
      'OBSERVATION_VALUE_TRIGGER': voi_gate,
      'ABSTRACTION_REFINEMENT_TRIGGER': refinement_gate,
      'LOCAL_GLOBAL_OBSTRUCTION_TRIGGER': local_global_gate,
      'COVERAGE': broad_audit,
    }

    refs=[]
    def use(*xs):
        for x in xs:
            if x not in refs: refs.append(x)
    if mode=='PICK_EXPLORE': use('references/exploration_and_adaptive_rigor.md')
    if f.get('pick_roles_material') or f.get('literal_pick') or depth=='STRUCTURAL':
        use('references/pick_abstraction.md','references/pick_representation.md')
    if f.get('theorem_architecture_explanation'): use('references/theorem_provenance.md')
    if quotient: use('references/decision_quotients.md')
    if mode=='PICK_AUDIT':
        use('references/audit_and_contrast.md')
        if broad_audit: use('references/review_scope_and_coverage.md')
    if mode=='PICK_DERIVE': use('references/procedure_gaps.md','references/binding_and_rebinding.md','references/execution_and_failures.md')
    if f.get('architecture_resolution'): use('references/architecture.md','integration/procedure_resolution.md')
    if f.get('seam_history_time'): use('references/seams_information_and_time.md')
    if probability: use('references/probability_semantics.md')
    if composition or voi_gate or refinement_gate: use('references/composition_and_refinement.md')
    if null_gate or symmetry_gate or ehrhart_gate or local_global_gate: use('integration/specialized_gates.md')
    if f.get('prompt_presentation_design'): use('references/prompt_and_presentation.md')
    if f.get('robustness'): use('references/robustness.md')
    if f.get('release_eval'): use('references/no_drawback_contract.md','eval/')
    return {'mode':mode,'depth':depth,'triggers':tr,'refs':sorted(refs)}


def main():
    rows=[]
    for line in CASES.read_text().splitlines():
        if not line.strip(): continue
        c=json.loads(line)
        c['expected_v11_0']=baseline_v11_0(c['features'])
        rows.append(c)
    CASES.write_text(''.join(json.dumps(c,sort_keys=True)+'\n' for c in rows))
    print('froze',len(rows),'v11.0 activation oracle rows')

if __name__=='__main__': main()
