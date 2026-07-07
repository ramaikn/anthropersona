# Simplify

Review changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — does not hunt for bugs.

## Phase 0 — Gather the diff

Run `git diff` to get the unified diff under review. Treat this diff as the review scope.

## Phase 1 — Review (4 cleanup agents in parallel)

Launch independent review agents, each focusing on one angle:

### Reuse

Flag new code that re-implements something the codebase already has. Search shared/utility modules and files adjacent to the change, and name the existing helper to call instead.

### Simplification

Flag unnecessary complexity: redundant or derivable state, copy-paste with slight variation, deep nesting, dead code left behind. Name the simpler form that does the same job.

### Efficiency

Flag wasted work: redundant computation or repeated I/O, independent operations run sequentially, blocking work added to startup or hot paths. Name the cheaper alternative.

### Altitude

Check that each change is implemented at the right depth, not as a fragile bandaid. Special cases layered on shared infrastructure are a sign the fix isn't deep enough — prefer generalizing the underlying mechanism over adding special cases.

## Phase 2 — Apply the fixes

Wait for all agents to complete, dedup findings that point at the same line or mechanism, and fix each remaining one directly. Skip any finding whose fix would change intended behavior, require changes well outside the reviewed diff, or that you judge to be a false positive — note the skip rather than arguing with it.

Finish with a brief summary of what was fixed and what was skipped, or confirm the code was already clean.
