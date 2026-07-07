# Verify

Verify that a code change actually does what it claims by running the app and observing behavior. Verification is runtime observation — build the app, run it, drive it to where the changed code executes, and capture what you see.

Don't run tests. Don't typecheck. Running them proves you can run CI, not that the change works.

## Find the change

In a git repo, establish the full diff range. The diff is ground truth — any description is a claim about it. Read both. If they disagree, that's a finding.

## Surface

Match the change to its runtime surface — where a user meets the change:

| Change reaches | You |
|---|---|
| CLI / TUI | Type the command, capture output |
| Server / API | Send the request, capture the response |
| GUI | Drive under xvfb/Playwright, screenshot |
| Library | Sample code through the public export |
| CI workflow | Dispatch it, read the run |

Internal function? Follow callers until you reach a surface. No runtime surface at all? Report SKIP.

## Get a handle

Check project docs (README, Makefile, package.json scripts) for build and run instructions. Timebox to ~15min. If stuck, report BLOCKED with exactly where it stopped.

## Drive it

Take the smallest path that makes the changed code execute: changed a flag? Run with it. Changed a handler? Hit that route. Changed error handling? Trigger the error.

## Push on it

Probe around the change, not just the happy path:
- Empty/null values at boundaries
- Wrong HTTP methods or content types
- Adjacent error conditions
- Ctrl-C / interrupt handling
- Stale state or cache issues
- Two concurrent sessions interacting

These aren't a checklist — pick the ones the change points at.

## Capture

Stdout, response bodies, screenshots, pane dumps. Captured output is evidence; your memory isn't.

## Report

```
## Verification: <one-line what changed>

**Verdict:** PASS | FAIL | BLOCKED | SKIP

**Claim:** <what it's supposed to do>

**Method:** <how you got a handle>

### Steps
1. ✅/❌/⚠️/🔍 <what you did to the running app> → <what you observed>

### Findings
<Things you noticed — friction, surprises, anything a first-time user would trip on>
```

**Verdicts:**
- **PASS** — ran the app, the change did what it should
- **FAIL** — ran it and it doesn't, or breaks something else
- **BLOCKED** — couldn't reach a state where the change is observable
- **SKIP** — no runtime surface exists (docs-only, types-only, tests-only)
