# Coding Tools — Universal Tool Definitions

---

# Grep — Content Search

A powerful content search tool built on ripgrep. It answers: "Which files contain text matching this pattern, and what are the matching lines?"

Grep searches **inside** files. (Glob searches file **names**.)

## When to use

- Finding where a function, variable, class, or string is defined or used.
- Locating all occurrences of a pattern across a codebase.
- Counting how many times something appears.
- Any time you'd reach for `grep`, `rg`, or `grep -r` in a shell.

Always prefer this tool over running `grep`/`rg` through Bash. It is purpose-built, respects `.gitignore` by default, and returns results in a clean, structured form.

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern` | string | Yes | A regex to search for (e.g. `log.*Error`, `function\s+\w+`). |
| `path` | string | No | File or directory to search. Defaults to current working directory. |
| `glob` | string | No | Glob pattern to filter files (e.g. `*.js`, `*.{ts,tsx}`). |
| `type` | string | No | File type to search (e.g. `js`, `py`, `rust`). Often more efficient than `glob`. |
| `output_mode` | string | No | `content`, `files_with_matches` (default), or `count`. |
| `-i` | boolean | No | Case-insensitive search. |
| `-n` | boolean | No | Show line numbers. Only applies when `output_mode` is `content`. |
| `-A` | number | No | Lines of context after each match (content mode only). |
| `-B` | number | No | Lines of context before each match (content mode only). |
| `-C` | number | No | Lines of context before and after each match (content mode only). |
| `multiline` | boolean | No | Enable multiline mode so patterns can span lines. Default false. |
| `head_limit` | number | No | Limit output to first N lines/entries. Works across all output modes. |

## Output modes

- **`files_with_matches`** *(default)* — Returns file paths containing matches. Cheapest. Best when you only need location.
- **`content`** — Returns matching lines with optional context (`-A`/`-B`/`-C`, `-n`). Use when you need to read matches.
- **`count`** — Returns match count per file. Best for gauging scale before diving in.

## Regex notes

- The `pattern` is a regex, not a literal string. Characters `.`, `(`, `)`, `{`, `[`, `*`, `+`, `?`, `|`, `\` have special meaning.
- Escape with backslash. Example: to find literal `interface{}` in Go, write `interface\{\}`.
- Patterns match per line by default. Multiline patterns require `multiline: true`.

## Examples

Find every file mentioning TODO:
```json
{ "pattern": "TODO" }
```

Show matching lines with line numbers, only in JavaScript:
```json
{ "pattern": "useState", "glob": "*.js", "output_mode": "content", "-n": true }
```

Case-insensitive search with 3 lines of context:
```json
{ "pattern": "deprecated", "output_mode": "content", "-i": true, "-C": 3 }
```

Count `console.log` per file in TypeScript:
```json
{ "pattern": "console\\.log", "type": "ts", "output_mode": "count" }
```

Multiline search for a struct block spanning several lines:
```json
{ "pattern": "struct \\{[\\s\\S]*?name", "multiline": true, "output_mode": "content" }
```

## Tips

- **Filter early.** Combining `pattern` with `glob` or `type` is far faster than searching everything.
- **`type` vs `glob`.** `type` uses built-in language definitions. `glob` gives precise control over file patterns.
- **Escaping in JSON.** A backslash in regex must be written as `\\` in JSON (e.g. `\\.` for literal dot).
- **`.gitignore` aware.** Skips ignored files (e.g. `node_modules`) by default.
- **Pair with Glob.** Use Glob to discover candidate files by name, then Grep to search their contents.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pattern": {
      "description": "The regex pattern to search for in file contents",
      "type": "string"
    },
    "path": {
      "description": "The directory to search in. Defaults to the current working directory.",
      "type": "string"
    },
    "glob": {
      "description": "Glob pattern to filter files (e.g. \"*.js\", \"*.{ts,tsx}\")",
      "type": "string"
    },
    "type": {
      "description": "File type to search (e.g. \"js\", \"py\", \"rust\")",
      "type": "string"
    },
    "output_mode": {
      "description": "One of \"content\", \"files_with_matches\" (default), or \"count\"",
      "type": "string"
    },
    "-i": {
      "description": "Case-insensitive search.",
      "type": "boolean"
    },
    "-n": {
      "description": "Show line numbers in content output.",
      "type": "boolean"
    },
    "-A": {
      "description": "Lines of context after each match.",
      "type": "number"
    },
    "-B": {
      "description": "Lines of context before each match.",
      "type": "number"
    },
    "-C": {
      "description": "Lines of context before and after each match.",
      "type": "number"
    },
    "multiline": {
      "description": "Enable multiline mode so patterns can span lines.",
      "type": "boolean"
    },
    "head_limit": {
      "description": "Limit output to the first N lines/entries.",
      "type": "number"
    }
  },
  "required": ["pattern"],
  "additionalProperties": false
}
```

---

# Glob — File Name Search

A fast filename/path matching tool. It answers: "Which files exist whose path matches this pattern?"

Glob searches file **names and paths** — not inside files. (Grep searches file **contents**.)

## When to use

- Locating files by name or extension (e.g. all `*.test.ts` files).
- Discovering the structure/layout of a codebase before diving in.
- Finding most recently modified files matching a pattern.
- Any time you'd reach for `find . -name ...` or shell globbing in a terminal.

Always prefer this tool over running `find` or `ls` through Bash. It is faster and works on any codebase size.

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pattern` | string | Yes | The glob pattern to match (e.g. `**/*.js`, `src/**/*.{ts,tsx}`). |
| `path` | string | No | Directory to search within. Omit for current working directory. Do not pass `null` or empty string — just omit the parameter. |

## Glob pattern syntax

| Token | Meaning |
|---|---|
| `*` | Matches any run of characters except path separator (`/`). |
| `**` | Matches any number of directories recursively (including zero). |
| `?` | Matches exactly one character. |
| `{a,b,c}` | Matches any of the comma-separated alternatives (brace expansion). |
| `[abc]` | Matches one character from the set. |

## Common patterns

- `*.md` — every Markdown file at top level only
- `**/*.md` — every Markdown file at any depth
- `src/**/*.js` — all `.js` files anywhere under `src/`
- `**/*.{ts,tsx}` — all TypeScript and TSX files, recursively
- `**/test_*.py` — all Python files beginning with `test_`, any depth
- `**/README.md` — every README, regardless of depth

## Output

- Returns a list of matching file paths.
- Sorted by **modification time**, most recently modified first.
- If nothing matches, returns empty (not an error).

## Glob vs. Grep

| You want to... | Use |
|---|---|
| Find files **named** a certain way | Glob |
| Find files **containing** certain text | Grep |
| List all `*.py` files | Glob |
| Find which `*.py` files call `requests.get` | Grep (with `glob: "*.py"`) |
| Understand directory layout | Glob |
| Read matching lines of code | Grep (`output_mode: "content"`) |

## Tips & gotchas

- **`*` does not cross directory boundaries; `**` does.** `src/*.js` matches files directly in `src/`, while `src/**/*.js` matches recursively.
- **Omit `path` for the whole project.** Don't pass an empty string or placeholder — just leave it out.
- **Sorted by recency.** A quick way to answer "what did I change most recently that matches X?"
- **Chain with Grep.** Use Glob to narrow to candidate files, then Grep to search their contents. Grep also accepts its own `glob` parameter, so for simple cases you may not need a separate Glob call.
- **For broad, open-ended searches** across many directories and naming conventions, consider delegating to an exploration agent rather than issuing many individual Glob calls.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pattern": {
      "description": "The glob pattern to match files against",
      "type": "string"
    },
    "path": {
      "description": "The directory to search in. Defaults to the current working directory if not specified.",
      "type": "string"
    }
  },
  "required": ["pattern"],
  "additionalProperties": false
}
```

---

# Read

Reads a file from the local filesystem. You can access any file directly by using this tool.

- `file_path` must be an absolute path, not a relative path.
- By default, reads up to 2000 lines starting from the beginning of the file.
- You can optionally specify a line offset and limit.
- Any lines longer than 2000 characters will be truncated.
- Results are returned with line numbers starting at 1.
- This tool can read images (PNG, JPG, etc.) and presents them visually. Reads PDF files (.pdf) and Jupyter notebooks (.ipynb).
- This tool can read files, not directories. Reading a directory, missing file, or empty file returns an error.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file_path": {
      "description": "The absolute path to the file to read",
      "type": "string"
    },
    "offset": {
      "description": "The line number to start reading from.",
      "type": "integer",
      "minimum": 0
    },
    "limit": {
      "description": "The number of lines to read.",
      "type": "integer",
      "exclusiveMinimum": 0
    }
  },
  "required": ["file_path"],
  "additionalProperties": false
}
```

---

# Edit

Performs exact string replacement in a file.

- You MUST Read the file in this conversation before editing, or the call will fail.
- `old_string` must match the file exactly, including indentation, and be unique in the file — the edit fails otherwise. Strip the Read line prefix (line number + space) before matching.
- `replace_all: true` replaces every occurrence instead.
- Use for partial changes. For full file overwrites, use Write instead.
- ALWAYS prefer editing existing files to creating new ones.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file_path": {
      "description": "The absolute path to the file to modify",
      "type": "string"
    },
    "old_string": {
      "description": "The text to replace",
      "type": "string"
    },
    "new_string": {
      "description": "The text to replace it with (must be different from old_string)",
      "type": "string"
    },
    "replace_all": {
      "description": "Replace all occurrences of old_string (default false)",
      "default": false,
      "type": "boolean"
    }
  },
  "required": ["file_path", "old_string", "new_string"],
  "additionalProperties": false
}
```

---

# Write

Writes a file to the local filesystem, overwriting if one exists.

When to use:
- Creating a new file that doesn't exist yet.
- Fully replacing a file you've already Read in this conversation.
- Overwriting an existing file you haven't Read will fail. For partial changes, use Edit.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file_path": {
      "description": "The absolute path to the file to write (must be absolute, not relative)",
      "type": "string"
    },
    "content": {
      "description": "The content to write to the file",
      "type": "string"
    }
  },
  "required": ["file_path", "content"],
  "additionalProperties": false
}
```

---

# Bash

Executes a bash command and returns its output.

- Working directory persists between calls, but prefer absolute paths — `cd` in a compound command can trigger a permission prompt.
- Shell state (env vars, functions) does not persist between calls; the shell initializes from the user's profile.
- `timeout` is in milliseconds: default 120000 (2 min), max 600000 (10 min).
- `run_in_background` runs the command detached — it keeps running across turns and re-invokes you when it exits. No `&` needed.

## When NOT to use

IMPORTANT: Avoid using this tool to run `cat`, `head`, `tail`, `sed`, `awk`, or `echo` commands unless you have verified that a dedicated tool cannot accomplish your task. Always prefer the specialized tools (Read, Edit, Write, Grep) — they provide a much better experience.

For file discovery, use Glob instead of `ls`/`find`. For content search, use Grep instead of `grep`/`rg`.

## Git Practices

- Interactive git flags (`-i`, e.g. `git rebase -i`, `git add -i`) are not supported.
- Use `gh` CLI for GitHub operations: PRs, issues, releases, API.
- Commit or push only when the user asks. If on the default branch, branch first.

## Background Execution

`run_in_background` runs commands detached. Benefits:
- Commands keep running while you work on other things.
- You get a notification when they complete.
- One notification pattern: use an `until` loop with a command that exits when the condition is met (e.g. `until grep -q "Ready in" dev.log; do sleep 0.5; done`).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "command": {
      "description": "The command to execute",
      "type": "string"
    },
    "timeout": {
      "description": "Optional timeout in milliseconds (max 600000)",
      "type": "number"
    },
    "description": {
      "description": "Clear, concise description of what this command does.",
      "type": "string"
    },
    "run_in_background": {
      "description": "Set to true to run this command in the background.",
      "type": "boolean"
    }
  },
  "required": ["command"],
  "additionalProperties": false
}
```

---

# Agent

Launch a new agent to handle complex, multi-step tasks autonomously. Each agent type has specific capabilities.

## When to use

Reach for this when:
- The task matches an available agent type.
- You have independent work to run in parallel.
- Answering would mean reading across several files — delegate it and you keep the conclusion, not the file dumps.

For a single-fact lookup where you already know the file or symbol, search directly. Once you've delegated a search, don't also run it yourself — wait for the result.

## Agent types

- **explore**: Fast, read-only agent for exploring codebases. Use when finding files by patterns, searching code for keywords, or answering questions about the codebase. Specify thoroughness: `quick`, `medium`, or `very thorough`.
- **general**: General-purpose agent for complex questions, code searches, and multi-step tasks.

## Usage notes

- Launch multiple agents concurrently — send them in a single message with multiple tool calls.
- The agent's final message is the tool result, not shown to the user — relay what matters.
- Use `run_in_background: true` to run asynchronously; you'll be notified on completion.
- Each agent invocation starts with a fresh context.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "description": {
      "description": "A short (3-5 words) description of the task",
      "type": "string"
    },
    "prompt": {
      "description": "The task for the agent to perform",
      "type": "string"
    },
    "subagent_type": {
      "description": "The type of specialized agent to use for this task",
      "type": "string"
    },
    "run_in_background": {
      "description": "Set to true to run this agent in the background.",
      "type": "boolean"
    }
  },
  "required": ["description", "prompt"],
  "additionalProperties": false
}
```

---

# AskUserQuestion

Use this tool only when you are blocked on a decision genuinely the user must make — one you cannot resolve from the request, the code, or sensible defaults.

Reserve this for decisions where the user's answer changes what you do next. For choices with a conventional default or facts you can verify in the codebase yourself, pick the obvious option and proceed.

- Users can always select "Other" to provide custom input.
- Use `multiSelect: true` for non-mutually-exclusive choices.
- If you recommend a specific option, make it first and add "(Recommended)".

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "questions": {
      "description": "Questions to ask the user (1-4 questions)",
      "minItems": 1,
      "maxItems": 4,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "description": "The complete question to ask the user.",
            "type": "string"
          },
          "header": {
            "description": "Very short label (max 12 chars).",
            "type": "string"
          },
          "options": {
            "description": "Available choices (2-4 options).",
            "minItems": 2,
            "maxItems": 4,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": {
                  "description": "Display text (1-5 words).",
                  "type": "string"
                },
                "description": {
                  "description": "Explanation of what this option means.",
                  "type": "string"
                }
              },
              "required": ["label", "description"]
            }
          },
          "multiSelect": {
            "description": "Allow selecting multiple options.",
            "default": false,
            "type": "boolean"
          }
        },
        "required": ["question", "header", "options"]
      }
    }
  },
  "required": ["questions"],
  "additionalProperties": false
}
```

---

# WebFetch

Fetches a URL, converts the page to markdown, and answers `prompt` against it.

- Fails on authenticated/private URLs — use authenticated tools or `gh` for those instead.
- HTTP is upgraded to HTTPS. Cross-host redirects are returned to you rather than followed; call again with the redirect URL.
- Responses are cached for 15 minutes per URL.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "description": "The URL to fetch content from",
      "type": "string",
      "format": "uri"
    },
    "prompt": {
      "description": "The prompt to run on the fetched content",
      "type": "string"
    }
  },
  "required": ["url", "prompt"],
  "additionalProperties": false
}
```

---

# WebSearch

Search the web. Returns result blocks with titles and URLs.

- `allowed_domains` / `blocked_domains` filter results.
- After answering from results, end with a "Sources:" list of the URLs you used as markdown links.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "query": {
      "description": "The search query to use",
      "type": "string",
      "minLength": 2
    },
    "allowed_domains": {
      "description": "Only include search results from these domains",
      "type": "array",
      "items": { "type": "string" }
    },
    "blocked_domains": {
      "description": "Never include search results from these domains",
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["query"],
  "additionalProperties": false
}
```

---

# Task

Launch a new agent to handle complex, multistep tasks autonomously.

- Launch multiple agents concurrently whenever possible to maximize performance.
- Once you have delegated work to an agent, do not duplicate that work yourself.
- The agent's final message is the tool result — relay what matters to the user, don't show raw agent output.
- Each agent invocation starts with a fresh context.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "description": {
      "description": "A short (3-5 words) description of the task",
      "type": "string"
    },
    "prompt": {
      "description": "The task for the agent to perform",
      "type": "string"
    },
    "subagent_type": {
      "description": "The type of specialized agent to use for this task",
      "type": "string"
    },
    "task_id": {
      "description": "Set only if resuming a previous task.",
      "type": "string"
    }
  },
  "required": ["description", "prompt", "subagent_type"],
  "additionalProperties": false
}
```

---

# Skill

Execute a skill within the main conversation. Skills provide specialized capabilities and domain knowledge. When users reference a "slash command" or "`/<something>`", they are referring to a skill.

How to invoke:
- Set `skill` to the exact name of an available skill (no leading slash).
- Set `args` to pass optional arguments.

Important:
- Only invoke a skill that appears in the available-skills list, or one the user explicitly typed. Never guess or invent a skill name from training data.
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task.
- Never mention a skill without actually calling this tool.
- Do not invoke a skill that is already running.
- Skills are lazy-loaded: the skill's full instructions are loaded from `personas/_common/coding/skills/<skill-name>.md` when invoked.

## Available Coding Skills

Skills in `personas/_common/coding/skills/` are loaded on demand when invoked:

- **code-review** — Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups. Supports effort levels: low, medium, high.
- **security-review** — Complete a security review of pending changes. Focuses only on high-confidence security vulnerabilities with clear exploitation potential.
- **simplify** — Review changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — does not hunt for bugs.
- **verify** — Verify that a code change actually works by running the app and observing behavior at runtime. Not tests, not typechecking — runtime observation.
- **debug** — Systematic debugging: enable logging, reproduce, scan logs, check config, isolate the component, explain findings, suggest fixes.
- **run** — Launch and drive the project's app to see a change working. Matches the project type (CLI, server, TUI, GUI, browser-driven, library) and drives through the real interface.
- **compact** — Create a detailed summary of the conversation to preserve context for continuing work. Captures technical details, code patterns, and architectural decisions.
- **review** — Two-axis review (Standards + Spec) of changes against a fixed point. Standards checks conformance to repo coding standards; Spec checks faithful implementation of the originating issue/PRD.
- **loop** — Run a prompt or task on a recurring interval with autonomous self-pacing. For polling, monitoring, or maintaining work while the user is away.
- **init** — Initialize project instruction files for AI coding agents. Scans the codebase, writes minimal guidance (build commands, style rules, gotchas), excludes anything the agent can discover by reading the code.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "skill": {
      "description": "The name of a skill from the available-skills list. Do not guess names.",
      "type": "string"
    },
    "args": {
      "description": "Optional arguments for the skill",
      "type": "string"
    }
  },
  "required": ["skill"],
  "additionalProperties": false
}
```
