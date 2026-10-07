# mksglu/context-mode @ 5a92b7c — what runs without asking

599 files listed. 20 findings: 0 high, 18 attention, 2 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** `PreToolUse` [matcher: `run_command|view_file|grep_search|web_fetch|read_url_content`]: `context-mode hook antigravity-cli pretooluse`  
  `configs/antigravity-cli/hooks/hooks.json` — Runs on PreToolUse for tools matching "run\_command\|view\_file\|grep\_search\|web\_fetch\|read\_url\_content".
- **ATTENTION** `PostToolUse` [matcher: `(empty)`]: `context-mode hook antigravity-cli posttooluse`  
  `configs/antigravity-cli/hooks/hooks.json` — Runs on every PostToolUse event, for every tool.
- **ATTENTION** `Stop` [matcher: `(empty)`]: `context-mode hook antigravity-cli stop`  
  `configs/antigravity-cli/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`context-mode`] `PostToolUse` [matcher: `Bash|Read|Write|Edit|NotebookEdit|Glob|Grep|TodoWrite|TaskCreate|TaskUpdate|Ent…`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/posttooluse.mjs"`  
  `hooks/hooks.json` — Runs on PostToolUse for tools matching "Bash\|Read\|Write\|Edit\|NotebookEdit\|Glob\|Grep\|TodoWrite\|TaskCreate\|TaskUpdate\|EnterPlanMode\|ExitPlanMode\|Skill\|Agent\|AskU…".
- **ATTENTION** [`context-mode`] `PreCompact` [matcher: `(empty)`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/precompact.mjs"`  
  `hooks/hooks.json` — Runs on every PreCompact event.
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `Bash`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `WebFetch`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "WebFetch".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `Read`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Read".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `Grep`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Grep".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `Agent`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Agent".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `mcp__plugin_context-mode_context-mode__ctx_execute`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "mcp\_\_plugin\_context-mode\_context-mode\_\_ctx\_execute".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `mcp__plugin_context-mode_context-mode__ctx_execute_file`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "mcp\_\_plugin\_context-mode\_context-mode\_\_ctx\_execute\_file".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `mcp__plugin_context-mode_context-mode__ctx_batch_execute`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "mcp\_\_plugin\_context-mode\_context-mode\_\_ctx\_batch\_execute".
- **ATTENTION** [`context-mode`] `PreToolUse` [matcher: `mcp__`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.mjs"`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "mcp\_\_".
- **ATTENTION** [`context-mode`] `UserPromptSubmit` [matcher: `(empty)`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/userpromptsubmit.mjs"`  
  `hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`context-mode`] `SessionStart` [matcher: `(empty)`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/sessionstart.mjs"`  
  `hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`context-mode`] `Stop` [matcher: `(empty)`]: `node "${CLAUDE_PLUGIN_ROOT}/hooks/stop.mjs"`  
  `hooks/hooks.json` — Runs on every Stop event.

## MCP servers started or contacted

- **info** [`context-mode`] `context-mode`: `node ${CLAUDE_PLUGIN_ROOT}/start.mjs`  
  `.claude-plugin/plugin.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `context-mode`: `context-mode`  
  `configs/copilot-cli/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Scripts that run on npm install

- **ATTENTION** `postinstall`: `node scripts/postinstall.mjs`  
  `package.json` — Runs automatically on npm install (postinstall).

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

