const fs = require('fs')
const path = require('path')

const RULES_BLOCK = `
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

\`\`\`
User message: "#o periksa semua file"
Step 1: Strip tag → "periksa semua file"
Step 2: Interpret task → "check ALL files" (scope is everything)
Step 3: Detect coding mode → message mentions files → load coding tier
Step 4: Load persona → opus style (core + coding)
Step 5: Execute task at full scope, write response in opus style
\`\`\`

==== END ANTHROPIC PERSONA RULES ====
`

const MARKER_START = '==== START ANTHROPIC PERSONA RULES ===='
const MARKER_END = '==== END ANTHROPIC PERSONA RULES ===='

function installRules(targetDir) {
  const agentsPath = path.join(targetDir, 'AGENTS.md')

  if (fs.existsSync(agentsPath)) {
    const content = fs.readFileSync(agentsPath, 'utf-8')

    if (content.includes(MARKER_START)) {
      console.log('[!] AGENTS.md already contains persona rules, skipping')
      return false
    }

    fs.writeFileSync(agentsPath, RULES_BLOCK.trim() + '\n\n' + content.trim() + '\n')
    console.log('[+] Prepended persona rules to existing AGENTS.md')
    return true
  }

  fs.writeFileSync(agentsPath, RULES_BLOCK.trim() + '\n')
  console.log('[+] Created AGENTS.md with persona rules')
  return true
}

module.exports = { installRules }
