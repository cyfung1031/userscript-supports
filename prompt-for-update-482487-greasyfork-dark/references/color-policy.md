# Owner color policy

Use the actual previous // general snapshot in the target script as the color oracle. The current Greasy Fork CSS supplies selectors, declarations, responsive conditions, and layering; it does not override the user's theme choices. This file contains historical examples only and must not be treated as a fixed palette.

## Confirmed replacements

These are observed selector-level examples from the historical snapshot. Confirm each value against the actual target before applying it, because the owner may change the preference later:

- overall background -> #24272d
- overall text -> #e9e9e9
- link -> #f7c67f
- visited link -> #c9a573
- Ace storage/keyword and related syntax roles -> #f7c67f
- Ace constants and PrettyPrint strings -> #b3f6d1
- custom diff insertion/deletion colors and hover variables -> the existing #346634, #82373a, #318e31, and #bb3636 values
- historical inline-color compatibility selector containing #4183c4 -> #9fceea

These are examples, not a global replacement table. Preserve the complete declaration and its review comments from the old snapshot. A selector may have different old colors for different semantic roles; do not flatten them into one global color.

## Handling changed selectors

The current CSS may combine old rules, for example .notice, .validation-errors, or introduce :is(.pagination, .pagy). Preserve the old component-specific rules in the same // general template when exact matching is impossible. This keeps the owner's colors effective without changing the runtime architecture.

Do not activate the upstream :root light/dark variable system or its @media (prefers-color-scheme: dark) palette. Resolve variables to the historical hard-coded value when the old selector or semantic role provides one. Keep --gfdark-* custom properties when the snapshot's diff hover behavior depends on them.

## History anchor

Version v0.3.22 is the validated historical “Update to latest CSS” transition. Version v0.3.23 contains a targeted self-link color correction. Use the full published history for evidence about structural changes, but preserve the current script's owner palette and comments.
