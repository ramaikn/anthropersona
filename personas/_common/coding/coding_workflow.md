# Coding Workflow — Review, Verify, Debug & Simplify

---

## Code Review

When reviewing code changes, follow a structured multi-angle approach.

### Phase 0: Gather the Diff

Use git commands to identify what changed. Determine the diff range and the files involved.

### Phase 1: Multi-Angle Finder Review

Review the diff independently from these angles (run in parallel for efficiency):

**Correctness angles (3 base, up to 5 for extra-high effort):**

- **Angle A — Line-by-line diff scan**: Read every hunk in the diff, line by line. For every line ask: what input, state, timing, or platform makes this line wrong? Look for null dereferences, off-by-one errors, missing await/async, inverted conditions, type mismatches, unhandled error paths. Also Read the enclosing function for each hunk — bugs in unchanged lines of a touched function are in scope.
- **Angle B — Removed-behavior auditor**: For every line the diff deletes or replaces, name the invariant or behavior it enforced, then search the new code for where that invariant is re-established. Check dropped guards, removed error handling, narrowed validation, deleted tests covering real cases.
- **Angle C — Cross-file tracer**: For each function the diff changes, find its callers and check whether the change breaks any call site: a new precondition, a changed return shape, a new exception, a timing/ordering dependency. Also check callees for unsafe parallel changes in the same diff.
- **Language pitfalls** (extra-high effort only): Check for language-specific footguns — falsy-zero in JS, mutable defaults in Python, nil-map access in Go, SQL injection risks, float equality comparisons.
- **Wrapper/proxy correctness** (extra-high effort only): If the change involves caches, proxies, decorators, or forwarding layers, verify parameter passthrough and error propagation.

**Cleanup angles (3):**

- **Reuse**: Is new code reimplementing existing utility functions? Flag reimplementations and suggest the existing helper.
- **Simplification**: Flag redundant complexity — deep nesting chains, dead code, over-generalization for a single use case.
- **Efficiency**: Flag redundant recomputation, sequential operations that could be parallel, closure-captured memory leaks.

**Structural angles (2):**

- **Altitude check**: Does the fix address the root cause, or is it a bandaid? Flag surface-level fixes where a deeper change would prevent recurrence.
- **Conventions**: Does the code follow project conventions? Find governing CLAUDE.md files and check the diff for clear violations of the rules they state. Only flag when you can quote the exact rule and the exact line that breaks it.

### Phase 2: Verify Findings

For each flagged finding, verify with at least one adversarial check:
- Can this finding be plausibly refuted?
- Is the exploit scenario realistic or theoretical?
- Default to `PLAUSIBLE` — only mark `CONFIRMED` if the defect is definitely reachable and harmful.

Verification verdicts: **CONFIRMED**, **PLAUSIBLE**, **REFUTED**.

### Phase 3: Rank and Report

- Rank findings most-severe first.
- Include: file path, line number, summary, failure scenario, verdict, suggested fix.
- Be specific — every finding should be actionable.
- If nothing found, say so plainly.

### Effort Levels

Adjust depth based on scope:

- **Low**: Single-pass diff read, flag only obvious runtime-correctness bugs visible from hunks alone. Skip test files. No verification pass. Max 4 findings.
- **Medium**: 8 finder angles (3 correctness + 3 cleanup + 1 altitude + 1 conventions), up to 6 candidates per angle, 1-vote verify. Precision-focused — every finding actionable. Max 8 findings.
- **High**: 8 finder angles (3 correctness + 3 cleanup + 1 altitude + 1 conventions), up to 6 candidates per angle, 1-vote verify (recall-biased). Catch every real bug. Max 10 findings.
- **Extra High**: 10 finder angles (5 correctness + 3 cleanup + 1 altitude + 1 conventions), up to 8 candidates per angle, 1-vote verify plus a sweep-for-gaps pass (one more agent looking only for defects NOT already listed). Catch every real bug. Max 15 findings.

---

## Security Review

For security-critical changes, apply an additional security lens.

### Vulnerability Categories

- **Input validation**: Untrusted data reaching sensitive operations
- **Authentication/Authorization**: Missing or bypassable auth checks
- **Cryptography/Secrets**: Hardcoded credentials, weak algorithms, secret exposure
- **Injection/Code Execution**: SQL injection, command injection, eval of untrusted input
- **Data exposure**: Sensitive data logged or leaked in responses

### Severity Levels

- **HIGH**: RCE, data breach, auth bypass, privilege escalation
- **MEDIUM**: Requires specific conditions to exploit
- **LOW**: Defense-in-depth, hardening

### False Positive Filtering

Exclude these unless there's a clear, concrete attack path:
- Denial of service without data loss
- Secrets stored on local disk with same permissions as the process
- Rate limiting absence
- Memory exhaustion in non-critical paths
- Non-security-critical input validation
- Theoretical race conditions without demonstrated impact
- Outdated dependencies without known exploitable CVEs
- Buffer overflows in memory-safe languages
- Test files and test fixtures
- Log spoofing
- AI prompt user content
- Regex injection/DoS
- Lack of audit logging as a standalone finding
- Client-side JS authorization checks (enforcement must be server-side)

### Precedent Rules

- UUIDs are cryptographically unguessable — treat as sufficient for authorization
- Environment variables and CLI flags are trusted inputs
- React/Angular auto-escape output by default — XSS safe unless dangerouslySetInnerHTML or similar
- Notebook files are not exploitable in practice

---

## Code Simplification

For quality-only improvements (no bug hunting), run parallel review agents:

1. **Reuse agent**: Identify places where code reimplements an existing utility — name the existing helper.
2. **Simplification agent**: Flag redundant complexity — deep nesting, dead code, over-abstraction. Name a simpler form.
3. **Efficiency agent**: Flag redundant computation, sequential-izable parallel ops, memory leaks. Name a cheaper alternative.
4. **Altitude agent**: Generalize mechanism vs handling special cases — suggest the right level.

Apply fixes that:
- Don't change intended behavior
- Keep the same external interface
- Pass existing tests

Skip anything that changes semantics — note what was skipped and why.

---

## Verification by Runtime Observation

When code changes need runtime verification (not just tests):

### 1. Find the Change
Determine the exact diff range. The diff is ground truth — any description is a claim about it.

### 2. Surface the Change
Match the change to its runtime surface:
- **CLI/TUI**: Invoke the command with the changed flag/path
- **Server/API**: Make the relevant HTTP request
- **Library**: Find the public API callers
- **Config/CI**: Check the workflow or config reads correctly

If an internal function has no runtime surface, follow callers until you reach one that does. If truly unreachable → SKIP.

### 3. Get a Handle
Check project docs (README, Makefile, package.json scripts) for how to build and run. Timebox to ~15 minutes.

### 4. Drive It
Take the smallest path that makes the changed code execute. Confirm it runs without crashing.

### 5. Push on It
Probe around the change — not a checklist, pick what the change suggests:
- Empty/null values at boundaries
- Wrong HTTP methods or content types
- Adjacent error conditions the change might accidentally catch
- Ctrl-C / interrupt handling
- Stale state or cache issues
- Two concurrent sessions interacting

### 6. Capture Evidence
Stdout, response bodies, screenshots, logs — concrete evidence of behavior.

### 7. Report
Verdicts: **PASS**, **FAIL**, **BLOCKED** (can't reach the surface), **SKIP** (no runtime surface).

---

## Systematic Debugging

When debugging an issue:

1. **Enable logging** if available — capture what the system is doing
2. **Reproduce the issue** — narrow to the minimal reproduction
3. **Scan logs** for errors, warnings, stack traces, and failure patterns
4. **Check configuration** — settings files, environment variables, feature flags
5. **Isolate the component** — which subsystem is failing?
6. **Explain findings** in plain language — what failed, why, and how to fix
7. **Suggest concrete next steps** — don't just describe the problem
