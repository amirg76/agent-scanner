# affaan-m/ECC @ bf70150 — what runs without asking

3734 files listed. 29 findings: 0 high, 27 attention, 2 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Bash`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Bash". The code is inline in the command (1045 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `PowerShell`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "PowerShell". The code is inline in the command (1130 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Write`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Write". The code is inline in the command (1117 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Edit|Write`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Edit\|Write". The code is inline in the command (1120 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PreToolUse event, for every tool. The code is inline in the command (1100 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Bash|PowerShell|Write|Edit|MultiEdit`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Bash\|PowerShell\|Write\|Edit\|MultiEdit". The code is inline in the command (1115 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Write|Edit|MultiEdit`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Write\|Edit\|MultiEdit". The code is inline in the command (1113 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PreToolUse event, for every tool. The code is inline in the command (1111 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreToolUse` [matcher: `Edit|Write|MultiEdit`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Edit\|Write\|MultiEdit". The code is inline in the command (1130 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PreCompact` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PreCompact event. The code is inline in the command (1097 characters), not in a separate file.
- **ATTENTION** [`ecc`] `SessionStart` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything. The code is inline in the command (1049 characters), not in a separate file.
- **ATTENTION** [`ecc`] `SessionStart` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything. The code is inline in the command (1129 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PostToolUse` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PostToolUse event, for every tool. The code is inline in the command (1015 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PostToolUse` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PostToolUse event, for every tool. The code is inline in the command (1016 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PostToolUseFailure` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every PostToolUseFailure event, for every tool. The code is inline in the command (1112 characters), not in a separate file.
- **ATTENTION** [`ecc`] `PostToolUseFailure` [matcher: `Skill`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on PostToolUseFailure for tools matching "Skill". The code is inline in the command (1108 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1407 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1399 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1395 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1391 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1401 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1393 characters), not in a separate file.
- **ATTENTION** [`ecc`] `Stop` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (1389 characters), not in a separate file.
- **ATTENTION** [`ecc`] `SessionEnd` [matcher: `.*`]: `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`  
  `hooks/hooks.json` — Runs on every SessionEnd event. The code is inline in the command (1400 characters), not in a separate file.

## MCP servers started or contacted

- **ATTENTION** [`ecc`] `chrome-devtools`: `npx -y chrome-devtools-mcp@latest` (version not pinned)  
  `.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Installers that write into ~/.claude

- **ATTENTION** targets `~/.claude` (writes not traced; backup not confirmed)  
  `scripts/install-apply.js` — Installer that targets the agent config folder; the writes happen in other files and were not traced, so a backup step could not be confirmed.
- **ATTENTION** targets `~/.claude` (writes not traced; backup not confirmed)  
  `scripts/setup-package-manager.js` — Installer that targets the agent config folder; the writes happen in other files and were not traced, so a backup step could not be confirmed.
- **info** writes to `~/.claude/settings.local.json` (backup code found, heuristic)  
  `docs/fixes/install_hook_wrapper.ps1` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).
- **info** writes to `~/.claude/skills` (backup code found, heuristic)  
  `docs/fixes/install_hook_wrapper.ps1` — Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

