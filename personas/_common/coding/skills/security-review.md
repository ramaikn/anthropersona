# Security Review

Perform a security-focused code review to identify high-confidence security vulnerabilities. Focus only on security implications — this is not a general code review.

## Vulnerability Categories

**Input validation:** SQL injection via unsanitized user input, command injection in system calls or subprocesses, XXE injection in XML parsing, template injection in templating engines, NoSQL injection, path traversal in file operations.

**Authentication/Authorization:** Authentication bypass logic, privilege escalation paths, session management flaws, JWT token vulnerabilities, authorization logic bypasses.

**Cryptography/Secrets:** Hardcoded API keys, passwords, or tokens; weak cryptographic algorithms or implementations; improper key storage or management; cryptographic randomness issues; certificate validation bypasses.

**Injection/Code execution:** Remote code execution via deserialization, pickle injection, YAML deserialization vulnerabilities, eval injection in dynamic code execution, XSS vulnerabilities (reflected, stored, DOM-based).

**Data exposure:** Sensitive data logging or storage, PII handling violations, API endpoint data leakage, debug information exposure.

## Severity Levels

- **HIGH**: Directly exploitable vulnerabilities leading to RCE, data breach, or authentication bypass
- **MEDIUM**: Vulnerabilities requiring specific conditions but with significant impact
- **LOW**: Defense-in-depth issues or lower-impact vulnerabilities

## False Positive Filtering

Automatically exclude findings matching these patterns:
- Denial of Service (DOS) without data loss
- Secrets or credentials stored on disk if otherwise secured
- Rate limiting or resource exhaustion issues
- Memory consumption or CPU exhaustion issues
- Lack of input validation on non-security-critical fields
- Race conditions that are theoretical rather than practical
- Outdated third-party library vulnerabilities (managed separately)
- Memory safety issues in memory-safe languages
- Files that are only unit tests or test fixtures
- Log spoofing concerns
- SSRF that only controls the path
- Including user-controlled content in AI prompts
- Regex injection or regex DOS
- Lack of audit logging as standalone finding
- Lack of hardening measures

## Precedents

- UUIDs are cryptographically unguessable — treat as sufficient for authorization
- Environment variables and CLI flags are trusted inputs
- React/Angular auto-escape output by default — XSS safe unless dangerouslySetInnerHTML or similar
- Client-side authorization checks are not sufficient — enforcement must be server-side
- Logging high-value secrets in plaintext is a vulnerability; logging URLs is assumed safe
- Notebook files are not exploitable in practice

## Output Format

For each finding: file path, line number, severity, category, description, exploit scenario, and fix recommendation. Each finding should be something a security engineer would confidently raise in a PR review.
