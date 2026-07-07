# Run

Launch and drive the project's app to see a change working. Running means launching the actual app and interacting with it — not the test suite, not an import of an internal function with a console.log.

## Match the shape, use the pattern

| Project type | Approach |
|---|---|
| CLI tool | Direct invocation, exit code, stdin/stdout |
| Web server / API | Background launch + curl smoke test |
| TUI / interactive terminal | tmux send-keys / capture-pane |
| Electron / desktop GUI | Playwright under xvfb |
| Browser-driven | Dev server + headless browser script |
| Library / SDK | Import-and-call smoke script at the package boundary |

## Drive it, don't just launch it

Launching with no interaction proves the entrypoint resolves — that's not running the app. Drive it to a point where a user would see something:
- CLI → type a representative command, check the exit code and output
- Server → hit the route the diff touches, read the body
- TUI → send-keys a navigation, capture-pane the result
- GUI → click the button, screenshot the window

## Background launch pattern (servers)

```bash
npm start &> /tmp/server.log &
SERVER_PID=$!
for i in {1..30}; do
  curl -sf http://localhost:3000/health > /dev/null && break
  sleep 1
done
```

Then verify:
```bash
curl http://localhost:3000/health
```

And stop:
```bash
kill $SERVER_PID
```

## Checklist per project type

**CLI:** How to get the binary on PATH, representative invocations with expected output, exit codes, stdin behavior.

**Server:** Port, what "ready" looks like (health endpoint or log line), required env vars, dependent services, hot reload vs production mode.

**TUI:** Terminal size for tmux, startup time / ready marker, keybinding reference, exit sequence.

**Browser-driven:** Dev command + port, auth setup, one representative interaction, app-specific gotchas (React controlled inputs, slow first paint, websockets).
