# msitarzewski/agency-agents @ 053ddbb — what runs without asking

362 files listed. 2 findings: 0 high, 0 attention, 2 info.

## Installers that write into ~/.claude

- **info** writes to `~/.claude` (backup code found, heuristic)  
  `scripts/install.sh` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).
- **info** writes to `~/.claude/agents` (backup code found, heuristic)  
  `scripts/install.sh` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

