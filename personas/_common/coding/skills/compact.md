# Compact — Context Compaction

Create a detailed summary of the conversation so far, capturing technical details, code patterns, and architectural decisions essential for continuing development work without losing context.

## Response format

Output an `<analysis>` block followed by a `<summary>` block. Do not call any tools — you already have all the context you need in the conversation.

## Summary structure

1. **Primary Request and Intent:** All explicit requests and intents in detail
2. **Key Technical Concepts:** Technologies, frameworks, patterns discussed
3. **Files and Code Sections:** Files examined, modified, or created — with full code snippets where applicable and why each is important
4. **Errors and fixes:** Errors encountered and how they were fixed, including specific user feedback
5. **Problem Solving:** Problems solved and ongoing troubleshooting
6. **All user messages:** All non-tool-result user messages (critical for understanding feedback and changing intent)
7. **Pending Tasks:** Tasks explicitly asked to work on but not yet completed
8. **Current Work:** Precisely what was being worked on immediately before this summary
9. **Optional Next Step:** Next step directly in line with the user's most recent explicit requests

## Guidelines

- Be thorough with technical details — code snippets, file names, function signatures
- Pay special attention to user feedback, especially if the user told you to do something differently
- Preserve security-relevant instructions or constraints verbatim
- Note errors and how you fixed them
- For "Current Work," include direct quotes from the most recent conversation showing exactly what you were working on
- Don't start on tangential or old requests that were already completed without confirming
