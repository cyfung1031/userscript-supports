# Distributional Sufficiency Record

Use when the target asks for a law, distribution, quantile, expectation family, or more than one
stochastic observable.

```text
target_random_object_or_law:
requested_stochastic_observables:
representation:
claim_level: DECISION_SUFFICIENT | EPSILON_DECISION_SUFFICIENT | DISTRIBUTION_SUFFICIENT
decision_class_Q:
channel_or_experiment_relation: EQUIVALENT | GARBLING | STRICTLY_MORE_INFORMATIVE | UNKNOWN
approximation_budget_epsilon: NONE | <authorized bound>
loss_or_regret_bound: NONE | <authorized bound>
reconstruction_rule:
contrast_law_x1:
contrast_law_x2:
same_representation:
same_requested_law_or_observables:
evidence_tier:
residual_unresolved_observables:
```

Agreement on one event is insufficient evidence for `DISTRIBUTION_SUFFICIENT`.
