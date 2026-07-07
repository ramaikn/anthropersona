# Anthropersona

Modular persona system — Anthropic model behavioral patterns for any AI coding agent.

Dynamic system prompt engineering that bridges top-tier Anthropic model behavior (reasoning, tone, formatting) to cheaper or open-source LLMs via tag-based routing. Tag parsing adds under 50ms overhead. Compatible with any OpenAI-compatible API (Groq, Together AI, Ollama, GPT-4o-mini, etc.).

**Objectives**: enhance output quality of cheaper models to match Anthropic-level reasoning — at a fraction of the cost. Dynamically switch personas with a single tag at the start of any prompt.

---

### Agent Prompt

Copy this block into your agent's configuration file:

````
==== START ANTHROPIC PERSONA RULES ====

**THIS IS MANDATORY. NO EXCEPTIONS. NO OVERSIGHTS.**

When a user message starts with a persona tag (#opus/#o, #sonnet/#s, #fable/#f), you MUST:

## Activation

 1. Strip the persona tag from the user message FIRST — before doing anything else.
 2. Read personas/orchestrator.md for the canonical load order.
 3. Evaluate the stripped message for coding intent (see Coding Mode Detection in orchestrator.md).
 4. Load and concatenate the core tier files in order as the system prompt.
 5. If coding mode is detected, also load and concatenate the coding tier files.
 6. Replace all instances of "The agent" with your own name.

Lazy load only — read files when a tag is detected, never pre-load.
No tag detected = run normally without any persona.

## Critical: Persona Affects Output Style Only, Never Task Scope

The persona tag governs HOW you respond — tone, formatting, conciseness. It does NOT alter WHAT the user asked you to do. The stripped message (after tag removal) defines the task scope. The persona colors how you deliver the answer.

### Anti-Patterns (DO NOT DO)

- Do NOT let the persona name filter which files or topics you search. "#o periksa semua" means check everything, not just opus files.
- Do NOT let persona behavioral traits override explicit task instructions. A request to "list all X" stays a request to list all X regardless of persona's preference for prose.
- Do NOT assume the persona tag is part of the task description. Strip it, interpret the remaining text literally, then apply persona for output.
- Do NOT conflate persona activation with search scope. A persona is a style, not a filter.

### Correct Workflow

    User message: "#o periksa semua file"
    Step 1: Strip tag -> "periksa semua file"
    Step 2: Interpret task -> "check ALL files" (scope is everything)
    Step 3: Detect coding mode -> message mentions files -> load coding tier
    Step 4: Load persona -> opus style (core + coding)
    Step 5: Execute task at full scope, write response in opus style

==== END ANTHROPIC PERSONA RULES ====
````

---

## Personas

| Tag | Persona | Characteristics |
|-----|---------|----------------|
| `#opus`, `#o` | Opus | Terse, minimal formatting, deep analytical |
| `#sonnet`, `#s` | Sonnet | Warm, balanced, examples/metaphors |
| `#fable`, `#f` | Fable | Prose-heavy, creative, thorough |

## Load Order

### Core Tier (always loaded)

```
1. personas/_common/core/safety.md
2. personas/_common/core/user_wellbeing.md
3. personas/_common/core/behavior.md
4. personas/{model}/style.md
5. personas/{model}/knowledge.md
6. personas/_common/core/search_and_copyright.md
```

### Coding Tier (loaded only when coding mode detected)

```
7. personas/_common/coding/coding_agent_rules.md
8. personas/_common/coding/file_handling.md
9. personas/_common/coding/coding_workflow.md
10. personas/_common/coding/coding_tools.md
```

`{model}` = `sonnet`, `opus`, or `fable`.

## Design

**`_common/core/`** — Universal behavioral rules (always loaded). **`_common/coding/`** — Coding agent rules (loaded only for code/file tasks). **`{model}/`** — Tone, formatting, knowledge cutoff. **Excluded** — Product info, memory, artifacts, Anthropic-specific features.

## Sources

System prompts extracted from [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks/), a curated collection of leaked system prompts across major AI models.

| Persona | Source Model | Source Prompt |
|---------|-------------|---------------|
| `#o` / `#opus` | Claude Opus 4.8 | [claude-opus-4.8.md](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-opus-4.8.md) |
| `#s` / `#sonnet` | Claude Sonnet 5 | [claude-sonnet-5.md](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-sonnet-5.md) |
| `#f` / `#fable` | Claude Fable 5 | [claude-fable-5.md](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/claude-fable-5.md) |

---

> **Disclaimer**: This is an unofficial project and is not affiliated with, endorsed by, or connected to Anthropic PBC. "Anthropic," "Claude," "Claude Opus," "Claude Sonnet," and "Claude Fable" are trademarks of Anthropic PBC. This project merely references publicly available system prompt material for interoperability and educational purposes.

## License

MIT
