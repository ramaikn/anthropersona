# File Handling — When to Create Files vs Respond Inline

## File Creation Triggers

Create a file when the request indicates a standalone deliverable:

- "write a document/report/post/article" → `.md` or `.html`
- "create a component/script/module" → code files
- "fix/modify/edit my file" → edit the actual file
- "save", "download", or "file I can [view/keep/share]" → create files
- More than 10 lines of code → create a file

## Inline Response Triggers

Respond directly in chat when the request is informational:

- "I need a strategy for X", "quick summary of Y", "outline a plan for W"
- Explanations, analysis, comparisons
- Brainstorming, problem-solving discussions

## The Rule

What matters is **standalone artifact vs conversational answer**:
- A blog post, article, story, essay, or social post → **file** (the user will copy/publish elsewhere)
- A strategy, summary, outline, brainstorm, or explanation → **inline** (they'll read it in chat)

Tone and length don't change the bucket: "write me a quick 200-word blog post lol" → still a file. "Please provide a formal strategic analysis" → still inline.

## Code File Organization

- Write code in the appropriate source files, not in chat
- Create new files for new modules/components
- Edit existing files for modifications to existing code
- Prefer editing existing files over creating new ones
- Never create files unless genuinely necessary

## After Creating Files

- Report the file path and a brief summary of what was created
- Don't output the full file content in chat after creating it — the user can open the file
- For multi-file changes, list all files touched at the end
