# Code Review

Review code changes for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level.

## Phase 0 — Gather the diff

Run `git diff` to get the unified diff under review. Treat this diff as the review scope. The diff is ground truth — any description is a claim about it.

## Phase 1 — Find candidates (multi-angle)

Run independent finder angles, each surfacing candidate findings with file, line, summary, and failure scenario.

### Angle A — Line-by-line diff scan

Read every hunk in the diff, line by line. Then read the enclosing function for each hunk — bugs in unchanged lines of a touched function are in scope. For every line ask: what input, state, timing, or platform makes this line wrong? Look for inverted/wrong conditions, off-by-one, null/undefined deref, missing await, falsy-zero checks, wrong-variable copy-paste, error swallowed in catch.

### Angle B — Removed-behavior auditor

For every line the diff deletes or replaces, name the invariant or behavior it enforced, then search the new code for where that invariant is re-established. Flag removed guards, dropped error paths, narrowed validation, deleted tests covering real cases.

### Angle C — Cross-file tracer

For each function the diff changes, find its callers and check whether the change breaks any call site: new precondition, changed return shape, new exception, timing/ordering dependency. Also check callees for unsafe parallel changes in the same diff.

### Reuse

Flag new code that re-implements something the codebase already has. Search shared/utility modules and files adjacent to the change, and name the existing helper to call instead.

### Simplification

Flag unnecessary complexity: redundant or derivable state, copy-paste with slight variation, deep nesting, dead code left behind. Name the simpler form.

### Efficiency

Flag wasted work: redundant computation or repeated I/O, independent operations run sequentially, blocking work added to startup or hot paths. Name the cheaper alternative.

### Altitude

Check that each change is implemented at the right depth, not as a fragile bandaid. Special cases layered on shared infrastructure are a sign the fix isn't deep enough — prefer generalizing the underlying mechanism over adding special cases.

### Conventions

Find the governing instruction files that apply to the changed code and check the diff for clear violations of the rules they state. Only flag when you can quote the exact rule and the exact line that breaks it — no vague style preferences.

## Phase 2 — Verify

For each candidate, run one verifier. Return exactly one of: CONFIRMED, PLAUSIBLE, REFUTED.

PLAUSIBLE by default — do not refute a candidate for being "speculative" when the state is realistic (concurrency races, nil/undefined on rare-but-reachable paths, falsy-zero treated as missing, off-by-one on boundary the code does not exclude).

REFUTED only when constructible from code: factually wrong, provably impossible, already handled in this diff, or pure style with no observable effect.

Keep CONFIRMED and PLAUSIBLE. Drop REFUTED.

## Output

Rank most-severe first. For each: file path, line number, summary, failure scenario, verdict, suggested fix. If nothing survives verification, say so plainly.

## Effort Levels

- **Low**: Single-pass diff read, flag only obvious runtime-correctness bugs. Skip test files. Max 4 findings.
- **Medium**: All finder angles, up to 6 candidates per angle. Precision-focused. Max 8 findings.
- **High**: All finder angles, up to 6 candidates per angle, recall-biased verification. Catch every real bug. Max 10 findings.
