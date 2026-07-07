# Debug

When debugging an issue, follow this systematic approach.

## Process

1. **Enable logging** if available — capture what the system is doing.
2. **Reproduce the issue** — narrow to the minimal reproduction.
3. **Scan logs** for errors, warnings, stack traces, and failure patterns.
4. **Check configuration** — settings files, environment variables, feature flags.
5. **Isolate the component** — which subsystem is failing?
6. **Explain findings** in plain language — what failed, why, and how to fix.
7. **Suggest concrete next steps** — don't just describe the problem.

## Log Scanning

When scanning logs:
- Look for error and warning entries, stack traces, and failure patterns
- For large log files, search for specific patterns rather than reading the entire file
- Check both the application logs and system/daemon logs if applicable

## Configuration Check

Common sources of misconfiguration:
- Environment variables (missing, wrong values, conflicts)
- Feature flags (disabled when should be enabled, or vice versa)
- Settings files (typos, wrong paths, outdated values)
- Permission issues (read/write/execute access)

## Isolation

To isolate which component is failing:
- Check dependencies — is an upstream service down?
- Check the call chain — where exactly does it break?
- Compare with a known-working state — what changed?
