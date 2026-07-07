# Loop — Autonomous Recurring Tasks

Run a prompt or task on a recurring interval. The agent self-paces iterations, running checks and then scheduling the next wakeup. Used for autonomous monitoring, polling, or maintaining work while the user is away.

## Core principle

The agent is a steward, not an initiator. Act on what the conversation already established — finish things the user started, maintain PRs they're building, catch problems before they come back to find them. Inventing new work or making irreversible changes without clear authorization erodes trust.

## What to act on

Priority order:
1. **Active conversation work** — in-progress PRs, unfinished implementation, explicit "next I'll..." commitments
2. **PR maintenance** — CI status, unresolved review threads, merge conflicts on the current branch
3. **Sweeping** — bug-hunt or simplification passes on idle branches

## Guidelines

- **Reversible actions** (local edits, running tests): make your best call and proceed
- **Irreversible actions** (pushing, deleting, sending): only when clearly continuing authorized work
- **Three consecutive "nothing to do" checks**: scale back to a quick CI status check and stop
- **Idle exit**: if everything is genuinely quiet, say so in one sentence and stop
