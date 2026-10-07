# SuperClaude-Org/SuperClaude\_Framework @ 2d0fda0 — what runs without asking

409 files listed. 10 findings: 0 high, 10 attention, 0 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`superclaude`] `SessionStart`: `${CLAUDE_PLUGIN_ROOT}/scripts/session-init.sh`  
  `plugins/superclaude/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`superclaude`] `Stop`: `prompt`  
  `plugins/superclaude/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`superclaude`] `PostToolUse` [matcher: `Write|Edit`]: `prompt`  
  `plugins/superclaude/hooks/hooks.json` — Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `SessionStart`: `./scripts/session-init.sh`  
  `src/superclaude/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.

## MCP servers started or contacted

- **ATTENTION** [`superclaude`] `context7`: `npx -y @upstash/context7-mcp@latest` (version not pinned)  
  `plugins/superclaude/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** [`superclaude`] `sequential-thinking`: `npx -y @modelcontextprotocol/server-sequential-thinking` (version not pinned)  
  `plugins/superclaude/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Scripts that run on npm install

- **ATTENTION** `postinstall`: `node ./bin/install.js`  
  `package.json` — Runs automatically on npm install (postinstall).

## Installers that write into ~/.claude

- **ATTENTION** targets `~/.claude` (writes not traced; backup not confirmed)  
  `install.sh` — Installer that targets the agent config folder; the writes happen in other files and were not traced, so a backup step could not be confirmed.
- **ATTENTION** targets `~/.claude` (writes not traced; backup not confirmed)  
  `src/superclaude/cli/install_commands.py` — Installer that targets the agent config folder; the writes happen in other files and were not traced, so a backup step could not be confirmed.
- **ATTENTION** writes to `~/.claude/skills` (no backup code found, heuristic)  
  `src/superclaude/cli/install_skill.py` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

