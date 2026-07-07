# Init — Project Setup

Initialize project instruction files and configuration for AI coding agents working in this repository. These files give the agent persistent context about the project, coding standards, and workflows.

## Process

### Phase 1: Explore the codebase

Survey the project to understand:
- Build, test, and lint commands
- Languages, frameworks, and package manager
- Project structure (monorepo, multi-module, or single project)
- Code style rules that differ from language defaults
- Non-obvious gotchas, required env vars, or workflow quirks

Read manifest files (package.json, Cargo.toml, pyproject.toml, go.mod, etc.), README, Makefile, CI config, and any existing instruction files.

### Phase 2: Write the instruction file

Create a minimal instruction file at the project root. Every line must pass the test: "Would removing this cause the agent to make mistakes?" If no, cut it.

**Include:**
- Build/test/lint commands that can't be guessed from manifest files
- Code style rules that differ from language defaults
- Testing instructions and quirks
- Repo etiquette (branch naming, PR conventions, commit style)
- Required env vars or setup steps
- Non-obvious gotchas or architectural decisions

**Exclude:**
- File-by-file structure (agent can discover by reading the codebase)
- Standard language conventions the agent already knows
- Generic advice ("write clean code", "handle errors")
- Information that changes frequently — reference source files instead
- Long tutorials — move to separate files and reference them

### Phase 3: Verify and iterate

After writing, ask the user to review. The file is a starting point — they should tweak it, and can re-run init anytime to re-scan.
