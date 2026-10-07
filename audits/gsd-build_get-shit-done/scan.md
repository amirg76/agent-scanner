# gsd-build/get-shit-done @ bdcaab2 — what runs without asking

1854 files listed. 3 findings: 0 high, 2 attention, 1 info.

## Installers that write into ~/.claude

- **ATTENTION** writes to `~/.claude` (no backup code found, heuristic)  
  `get-shit-done/bin/lib/install-profiles.cjs` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **ATTENTION** writes to `~/.claude/skills` (no backup code found, heuristic)  
  `get-shit-done/bin/lib/install-profiles.cjs` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **info** writes to `~/.claude` (backup code found, heuristic)  
  `bin/install.js` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

