# obra/superpowers @ 5bf4e78 — what runs without asking

231 files listed. 1 finding: 0 high, 1 attention, 0 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`superpowers`] `SessionStart` [matcher: `startup|clear|compact`]: `"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd" session-start`  
  `hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

