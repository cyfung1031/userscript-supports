# DOM and CSS module

Load when the diff touches document state, event listeners, observers, injected markup/styles, layout, theme, focus, or rendering.

Map producer guarantees to consumer requirements: which document or frame owns the node, when it exists, which world can access it, and whether repeated navigation or reinjection is reachable. Check selector scope, duplicate insertion, listener identity, cleanup, mutation-observer churn, accessibility names, and page-style interference.

For CSS or visual claims, prefer static selector/cascade checks and deterministic DOM fixtures. Use a browser fixture only as a last-resort partial simulation when it can answer a decision-relevant contrast. Probe empty/long content, narrow/wide viewports, zoom or reduced motion when relevant, focus-visible controls, one versus multiple scroll owners, fixed/sticky overlays, clipping, and first-paint visibility. Static checks and fragile browser fixtures are not universal visual proof.
