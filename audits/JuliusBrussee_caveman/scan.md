# JuliusBrussee/caveman @ 2fd153c — what runs without asking

1594 files listed. 6 findings: 0 high, 2 attention, 4 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`caveman`] `SessionStart`: `HOOK_ROOT=$(printf %s "${CLAUDE_PLUGIN_ROOT}" | sed 's|^/\([a-zA-Z]\)/|\1:/|'); node "$HOOK_ROOT/src/hooks/caveman-acti…`  
  `.claude-plugin/plugin.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`caveman`] `UserPromptSubmit`: `HOOK_ROOT=$(printf %s "${CLAUDE_PLUGIN_ROOT}" | sed 's|^/\([a-zA-Z]\)/|\1:/|'); node "$HOOK_ROOT/src/hooks/caveman-mode…`  
  `.claude-plugin/plugin.json` — Runs on every prompt the user sends and can add text to it.

## Installers that write into ~/.claude

- **info** writes to `~/.claude` (backup code found, heuristic)  
  `bin/install.js` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).
- **info** writes to `~/.claude` (backup code found, heuristic)  
  `src/hooks/install.ps1` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).
- **info** writes to `~/.claude` (backup code found, heuristic)  
  `src/hooks/install.sh` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).
- **info** writes to `~/.claude/settings.json` (backup code found, heuristic)  
  `src/hooks/install.sh` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

