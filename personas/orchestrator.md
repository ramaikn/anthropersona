# Personas — Canonical Orchestrator

Token-efficient modular prompt architecture. Common behavioral rules live in `_common/core/` (always loaded) and `_common/coding/` (loaded only for coding tasks). Persona-specific tone, formatting, and knowledge live in `{model}/`. Files are concatenated on demand only when a persona tag is detected.

## Tag-Based Routing

Tags at the beginning of user input:

| Tag | Persona | Characteristics |
|-----|---------|----------------|
| `#opus`, `#o` | Opus | Terse, minimal formatting, deep analytical, concise |
| `#sonnet`, `#s` | Sonnet | Warm, balanced, uses examples/metaphors, caring |
| `#fable`, `#f` | Fable | Prose-heavy, creative, token budget 190k, thorough |

No tag detected: agent runs normally without any persona prompt.

## Two-Tier Assembly

Assembly splits into **core** (always loaded) and **coding** (conditional — only when the task involves code, files, or software engineering).

### Coding Mode Detection

After stripping the tag, evaluate the remaining user message for coding intent. A message triggers the coding tier if it mentions any of:

- Creating, modifying, reading, deleting, or searching files or directories
- Writing, editing, reviewing, debugging, testing, or running code
- Git operations, commits, PRs, branches
- Software architecture, system design, refactoring
- Shell commands, build tools, package managers, config files
- Bug reports, error messages, stack traces
- Any tool invocation that produces or modifies files

A message that is purely conversational, informational, or analytical (questions, explanations, brainstorming without code/file actions) loads only the core tier.

### Core Tier (always loaded)

1. `personas/_common/core/safety.md`
2. `personas/_common/core/user_wellbeing.md`
3. `personas/_common/core/behavior.md`
4. `personas/{model}/style.md`
5. `personas/{model}/knowledge.md`
6. `personas/_common/core/search_and_copyright.md`

### Coding Tier (loaded only when coding mode detected)

7. `personas/_common/coding/coding_agent_rules.md`
8. `personas/_common/coding/file_handling.md`
9. `personas/_common/coding/coding_workflow.md`
10. `personas/_common/coding/coding_tools.md`

**Skills** in `personas/_common/coding/skills/` are lazy-loaded — the Skill tool section in `coding_tools.md` lists available skills with descriptions; individual `.md` files are loaded only when a skill is invoked.

Concatenate files in the order above. Inject as system prompt before the user message. Persist persona (including coding tier status) until next tag detected.

**Lazy loading**: Files are only read when a tag triggers activation. Never pre-loaded or cached across personas.

## Conventions

- **Self-reference**: All files use "The agent". Harness replaces with agent's actual name if different.
- **Base path**: All paths relative to project root containing `personas/`.
- **Characteristics**: Persona-specific characteristics (tone, formatting, reasoning, default stance) live in each model's `style.md` under a `<characteristics>` block.

## Excluded

Not included (Anthropic-specific, not generalizable):
- Product information / model descriptions
- User memory systems
- Visual generation tools / Image search
- End conversation tooling / Artifacts / MCP apps
- Citation instructions
