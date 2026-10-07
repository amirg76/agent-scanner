# thedotmack/claude-mem @ c4bfa45 — what runs without asking

1249 files listed. 19 findings: 0 high, 17 attention, 2 info.

## By plugin

3 plugins in this repo. You install them one at a time, so read the row for yours.

| plugin | high | attention | info |
|---|---|---|---|
| `claude-mem (plugin/)` | 0 | 8 | 1 |
| `claude-mem (repo root)` | 0 | 0 | 0 |
| `claude-mem-cowork` | 0 | 7 | 0 |
| *(outside any plugin)* | 0 | 2 | 1 |

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`claude-mem-cowork`] `SessionStart` [matcher: `(empty)`]: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" context`  
  `cowork/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`claude-mem-cowork`] `UserPromptSubmit`: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" session-init`  
  `cowork/hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`claude-mem-cowork`] `PostToolUse` [matcher: `*`]: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" observation`  
  `cowork/hooks/hooks.json` — Runs on every PostToolUse event, for every tool.
- **ATTENTION** [`claude-mem-cowork`] `PreToolUse` [matcher: `Task|Agent`]: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" agent-context`  
  `cowork/hooks/hooks.json` — Runs on PreToolUse for tools matching "Task\|Agent".
- **ATTENTION** [`claude-mem-cowork`] `SubagentStop`: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" subagent-stop`  
  `cowork/hooks/hooks.json` — Runs on every SubagentStop event.
- **ATTENTION** [`claude-mem-cowork`] `Stop`: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" summarize`  
  `cowork/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`claude-mem-cowork`] `SessionEnd`: `node "${CLAUDE_PLUGIN_ROOT}/scripts/cmem-hook.mjs" session-end`  
  `cowork/hooks/hooks.json` — Runs on every SessionEnd event.
- **ATTENTION** [`claude-mem (plugin/)`] `Setup` [matcher: `*`]: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on every Setup event.
- **ATTENTION** [`claude-mem (plugin/)`] `SessionStart` [matcher: `startup|resume|clear|compact`]: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`claude-mem (plugin/)`] `SessionStart` [matcher: `startup|resume|clear|compact`]: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`claude-mem (plugin/)`] `UserPromptSubmit`: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`claude-mem (plugin/)`] `PostToolUse` [matcher: `*`]: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on every PostToolUse event, for every tool.
- **ATTENTION** [`claude-mem (plugin/)`] `PreToolUse` [matcher: `Read`]: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "Read".
- **ATTENTION** [`claude-mem (plugin/)`] `Stop`: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`claude-mem (plugin/)`] `SessionEnd`: `export PATH="$HOME/.nvm/versions/node/v$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -t. -k1,1n -k2…`  
  `plugin/hooks/hooks.json` — Runs on every SessionEnd event.

## MCP servers started or contacted

- **info** [`claude-mem (plugin/)`] `mcp-search`: `node -e const f=require('fs'),p=require('path'),o=require('os'),c=require('child_process');const h=o.homedir();const C=…`  
  `plugin/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Installers that write into ~/.claude

- **ATTENTION** writes to `~/.claude` (no backup code found, heuristic)  
  `openclaw/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **ATTENTION** writes to `~/.claude/plugins` (no backup code found, heuristic)  
  `openclaw/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **info** writes to `~/.claude` (backup code found, heuristic)  
  `plugin/skills/mode-creator/scripts/install-mode.mjs` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

