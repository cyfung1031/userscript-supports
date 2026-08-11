#!/usr/bin/env python3
"""Hard context-footprint Pareto report for PickInvariant v11.1.

Uses exact packaged v11.0 and v11.1 kernel snapshots. Whitespace words, Unicode characters, and UTF-8
bytes are tokenizer-independent proxies; no live tokenizer/latency claim is made. Because activation
sets are separately required to be identical, every declared activated path inherits the same strict
kernel reduction.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'eval/SKILL.v11.0.baseline.md'
CAND=ROOT/'SKILL.md'
ACT=ROOT/'eval/activation_cases.jsonl'

def metrics(p):
    t=p.read_text(); b=p.read_bytes()
    return {'words':len(t.split()),'chars':len(t),'bytes':len(b),'lines':len(t.splitlines())}

def file_words(rel):
    p=ROOT/rel
    if not p.is_file(): return 0
    return len(p.read_text().split())

base=metrics(BASE); cand=metrics(CAND)
cases=[json.loads(x) for x in ACT.read_text().splitlines() if x.strip()]
path_rows=[]
for c in cases:
    # v11.1 activation must exactly equal expected_v11_0; activation_sim.py proves this separately.
    refs=c['expected_v11_0']['refs']
    ref_words=sum(file_words(r) for r in refs if r!='eval/')
    path_rows.append({
      'case_id':c['id'],'kind':c['kind'],'reference_words':ref_words,
      'v11_0_path_words':base['words']+ref_words,
      'v11_1_path_words':cand['words']+ref_words,
      'delta_words':cand['words']-base['words'],
    })

hard={
  'core_words_nonincrease':cand['words']<=base['words'],
  'core_chars_nonincrease':cand['chars']<=base['chars'],
  'core_bytes_nonincrease':cand['bytes']<=base['bytes'],
  'all_declared_paths_words_nonincrease':all(r['v11_1_path_words']<=r['v11_0_path_words'] for r in path_rows),
  'strict_context_improvement':cand['words']<base['words'] and cand['chars']<base['chars'] and cand['bytes']<base['bytes'],
}
report={
 'metric':'hard_context_proxy_with_exact_activation_equivalence',
 'parent':'PickInvariant v11.0','candidate':'PickInvariant v11.1',
 'v11_0_core':base,'v11_1_core':cand,
 'delta':{k:cand[k]-base[k] for k in base},
 'reduction_pct':{k:round(100*(base[k]-cand[k])/base[k],2) for k in ['words','chars','bytes','lines']},
 'declared_activation_case_count':len(path_rows),
 'path_word_delta_min':min(r['delta_words'] for r in path_rows),
 'path_word_delta_max':max(r['delta_words'] for r in path_rows),
 'hard_checks':hard,'hard_context_pareto':all(hard.values()),
 'tokenizer_note':'No installed model tokenizer was used; words/chars/bytes are transparent proxies. Exact activation equivalence makes the direction of context change independent of specialist-path mix.',
}
(ROOT/'eval/context_cost.json').write_text(json.dumps(report,indent=2)+'\n')
import csv
with (ROOT/'eval/context_path_matrix.csv').open('w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=path_rows[0].keys()); w.writeheader(); w.writerows(path_rows)
md=f'''# PickInvariant v11.1 — Hard Context Pareto Report

This release treats kernel/context efficiency as a **hard Pareto dimension relative to v11.0**.
The token claim remains conservative: no model tokenizer or latency benchmark is available here, so
whitespace words, Unicode characters, and UTF-8 bytes are reported transparently.

| Metric | v11.0 | v11.1 | Delta | Reduction |
|---|---:|---:|---:|---:|
| always-loaded words | {base['words']} | **{cand['words']}** | {cand['words']-base['words']} | **{report['reduction_pct']['words']:.2f}%** |
| characters | {base['chars']} | **{cand['chars']}** | {cand['chars']-base['chars']} | **{report['reduction_pct']['chars']:.2f}%** |
| UTF-8 bytes | {base['bytes']} | **{cand['bytes']}** | {cand['bytes']-base['bytes']} | **{report['reduction_pct']['bytes']:.2f}%** |
| lines | {base['lines']} | {cand['lines']} | {cand['lines']-base['lines']} | {report['reduction_pct'].get('lines',0):.2f}% |

Activation equivalence is tested independently over {len(path_rows)} fixture/boundary cases. Because
v11.1 activates the same lazy references, every declared path is shorter by exactly
**{base['words']-cand['words']} whitespace words** before any unchanged reference content.

Hard context Pareto: **{'PASS' if report['hard_context_pareto'] else 'FAIL'}**.

This is a context-footprint proxy, not a claim of exact model-token or latency reduction.
'''
(ROOT/'eval/CONTEXT_COST.md').write_text(md)
print(md)
if not report['hard_context_pareto']: raise SystemExit(1)
