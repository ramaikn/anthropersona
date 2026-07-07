# Review — Standards + Spec

Two-axis review of the diff between HEAD and a fixed point the user supplies:
- **Standards** — does the code conform to this repo's documented coding standards?
- **Spec** — does the code faithfully implement the originating issue / spec / PRD?

Both axes run as parallel sub-agents, then results are aggregated. Reporting them separately stops one axis from masking the other.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point — a commit SHA, branch name, tag, `main`, `HEAD~5`, etc. If unspecified, ask: "Review against what — a branch, a commit, or main?" Capture the diff: `git diff <fixed-point>...HEAD`.

### 2. Identify the spec source

Look for the originating spec in this order:
1. Issue references in commit messages
2. A path the user passed as an argument
3. A PRD/spec file under `docs/`, `specs/`, or matching the branch name
4. If nothing found, ask the user. If there isn't one, the Spec axis reports "no spec available."

### 3. Identify the standards sources

Anything in the repo that documents how code should be written:
- AGENTS.md, CONTRIBUTING.md
- CONTEXT.md files
- Architecture decision records
- Editor/linter configs (machine-enforced — note but don't re-check)
- Style guides

### 4. Spawn both sub-agents in parallel

**Standards agent:** Read the standards docs. Read the diff. Report every place the diff violates a documented standard. Cite the standard (file + rule). Distinguish hard violations from judgment calls. Skip anything tooling enforces.

**Spec agent:** Read the spec. Read the diff. Report: (a) requirements the spec asked for that are missing or partial; (b) behavior in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but wrong. Quote the spec line for each finding.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings. Do not merge or rerank — the two axes are deliberately separate.

End with a one-line summary: total findings per axis, and the worst single issue flagged.
