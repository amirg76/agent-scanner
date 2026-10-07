# davila7/claude-code-templates @ 3c28e46 — what runs without asking

9574 files listed. 109 findings: 3 high, 43 attention, 63 info.

1 file that could declare something was not read or not interpreted; see "Not checked".

## By plugin

29 plugins in this repo. You install them one at a time, so read the row for yours.

| plugin | high | attention | info |
|---|---|---|---|
| `2048` | 0 | 0 | 0 |
| `admin-capability-lockdown` | 0 | 0 | 0 |
| `aitmpl` | 0 | 0 | 0 |
| `block-destructive-commands` | 0 | 0 | 0 |
| `cc-arcade` | 0 | 0 | 0 |
| `diff-invaders` | 0 | 0 | 0 |
| `doom` | 0 | 0 | 0 |
| `flappy` | 0 | 0 | 0 |
| `invaders` | 0 | 0 | 0 |
| `jev-guardrails` | 0 | 0 | 0 |
| `jev-model-router` | 0 | 0 | 0 |
| `jev-skill-suggestion` | 0 | 0 | 0 |
| `large-edit-confirmation` | 0 | 0 | 0 |
| `minesweeper` | 0 | 0 | 0 |
| `npm-to-pnpm-rewriter` | 0 | 0 | 0 |
| `pacman` | 0 | 0 | 0 |
| `pet` | 0 | 0 | 0 |
| `pi-agent-for-claude` | 0 | 0 | 0 |
| `pong` | 0 | 0 | 0 |
| `protected-paths-guard` | 0 | 0 | 0 |
| `secret-redactor` | 0 | 0 | 0 |
| `snake` | 0 | 0 | 0 |
| `tetris` | 0 | 0 | 0 |
| `tool-defense` | 0 | 0 | 0 |
| `tool-timing-badge` | 0 | 0 | 0 |
| `typing-test` | 0 | 0 | 0 |
| `universal-audit-log` | 0 | 0 | 0 |
| `webfetch-cache` | 0 | 0 | 0 |
| `websearch-to-exa` | 0 | 0 | 0 |
| *(outside any plugin)* | 3 | 43 | 63 |

## Hooks (run by the agent when an event fires)

- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|MultiEdit`]: `echo 'Blocked: read-only-auditor cannot modify files. Use a different agent to apply fixes.' && exit 1`  
  `cli-tool/components/agents/security/read-only-auditor.md` — Declared in a subagent: runs only while that subagent is running. Runs on PreToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** `PreToolUse` [matcher: `Bash`]: `echo 'Blocked: read-only-auditor cannot run shell commands.' && exit 1`  
  `cli-tool/components/agents/security/read-only-auditor.md` — Declared in a subagent: runs only while that subagent is running. Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** `PostToolUse` [matcher: `Bash`]: `echo "[$(date)] GH Address Comments: Executed gh command to address PR comments" >> ~/.claude/gh-address-comments.log`  
  `cli-tool/components/skills/development/gh-address-comments/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Bash".
- **ATTENTION** `PostToolUse` [matcher: `Bash`]: `echo "[$(date)] Git Commit Helper: Analyzed git diff for commit message" >> ~/.claude/git-commit-helper.log`  
  `cli-tool/components/skills/development/git-commit-helper/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Bash".
- **ATTENTION** `SessionStart`: `echo '[planning-with-files] Ready. Auto-activates for complex tasks, or invoke manually with /planning-with-files'`  
  `cli-tool/components/skills/productivity/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash`]: `cat task_plan.md 2>/dev/null | head -30 || true`  
  `cli-tool/components/skills/productivity/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `echo '[planning-with-files] File updated. If this completes a phase, update task_plan.md status.'`  
  `cli-tool/components/skills/productivity/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `${CLAUDE_PLUGIN_ROOT}/scripts/check-complete.sh`  
  `cli-tool/components/skills/productivity/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Bash`]: `jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""); CONTENT=$(echo $STDIN_JSON | jq -r '.tool_input.content …`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" == "package.json" ]]; then echo 'Checking…`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.(js|jsx|ts|tsx)$ ]]; then npx pretti…`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit". Runs prettier with no version: a local install is used if present, otherwise the current release is fetched.
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.(ts|tsx)$ ]]; then RESULT=$(npx tsc …`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit". Runs tsc with no version: a local install is used if present, otherwise the current release is fetched.
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.(js|jsx|ts|tsx)$ ]] && grep -q 'impo…`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.(js|jsx|ts|tsx)$ && "$FILE" != *".te…`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit". Runs jest with no version: a local install is used if present, otherwise the current release is fetched.
- **ATTENTION** [project settings] `Notification` [matcher: `(empty)`]: `echo "Claude Code notification: $(date)" >> ~/.claude/notifications.log`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on every Notification event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f package.json && $(git status --porcelain | grep -E '\.js$|\.jsx$|\.ts$|\.tsx$') ]]; then echo 'Running linter …`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on every Stop event. Runs eslint with no version: a local install is used if present, otherwise the current release is fetched.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f package.json && $(git status --porcelain | grep -E '\.js$|\.jsx$|\.ts$|\.tsx$') ]]; then echo 'Analyzing bundl…`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Runs on every Stop event. Runs bundlesize with no version: a local install is used if present, otherwise the current release is fetched.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Bash`]: `jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""); CONTENT=$(echo $STDIN_JSON | jq -r '.tool_input.content …`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" == "requirements.txt" ]] || [[ "$FILE" ==…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.py$ ]]; then black "$FILE" 2>/dev/nu…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.py$ ]]; then isort "$FILE" 2>/dev/nu…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.py$ ]]; then RESULT=$(flake8 "$FILE"…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.py$ ]]; then RESULT=$(mypy "$FILE" 2…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.py$ && "$FILE" != *"test_"* && "$FIL…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `Notification` [matcher: `(empty)`]: `echo "Claude Code notification: $(date)" >> ~/.claude/notifications.log`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on every Notification event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f requirements.txt || -f pyproject.toml || -f setup.py ]] && [[ $(git status --porcelain | grep '\.py$') ]]; the…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f requirements.txt || -f pyproject.toml || -f setup.py ]] && [[ $(git status --porcelain | grep '\.py$') ]]; the…`  
  `cli-tool/templates/python/.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Bash`]: `jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""); CONTENT=$(echo $STDIN_JSON | jq -r '.tool_input.content …`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Write`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" == "Gemfile" ]] || [[ "$FILE" == "Gemfile…`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PreToolUse for tools matching "Write".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.rb$ ]]; then if command -v rubocop >…`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.rb$ ]]; then RESULT=$(if command -v …`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `FILE=$(echo $STDIN_JSON | jq -r '.tool_input.file_path // ""'); if [[ "$FILE" =~ \.rb$ && "$FILE" != *"spec/"* && "$FIL…`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `Notification` [matcher: `(empty)`]: `echo "Claude Code notification: $(date)" >> ~/.claude/notifications.log`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on every Notification event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f Gemfile || -f Rakefile ]] && [[ $(git status --porcelain | grep '\.rb$') ]]; then echo 'Running RuboCop on cha…`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f Gemfile || -f Rakefile ]] && [[ $(git status --porcelain | grep '\.rb$') ]]; then echo 'Running security scan …`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `Stop` [matcher: `(empty)`]: `if [[ -f Gemfile ]]; then echo 'Checking for gem vulnerabilities...'; if command -v bundle >/dev/null 2>&1 && bundle sh…`  
  `cli-tool/templates/ruby/.claude/settings.json` — Runs on every Stop event.

## Permissions and approvals granted by project settings

- **HIGH** [project settings] allow `Bash`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Pre-approves any shell command for everyone who opens this project.
- **HIGH** [project settings] allow `Bash`  
  `cli-tool/templates/python/.claude/settings.json` — Pre-approves any shell command for everyone who opens this project.
- **HIGH** [project settings] allow `Bash`  
  `cli-tool/templates/ruby/.claude/settings.json` — Pre-approves any shell command for everyone who opens this project.

## Environment set by project settings

- **info** [project settings] `BASH_DEFAULT_TIMEOUT_MS`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BASH_MAX_OUTPUT_LENGTH`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `NODE_ENV`  
  `cli-tool/templates/javascript-typescript/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BASH_DEFAULT_TIMEOUT_MS`  
  `cli-tool/templates/python/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BASH_MAX_OUTPUT_LENGTH`  
  `cli-tool/templates/python/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`  
  `cli-tool/templates/python/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `PYTHONPATH`  
  `cli-tool/templates/python/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BASH_DEFAULT_TIMEOUT_MS`  
  `cli-tool/templates/ruby/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BASH_MAX_OUTPUT_LENGTH`  
  `cli-tool/templates/ruby/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`  
  `cli-tool/templates/ruby/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BUNDLE_PATH`  
  `cli-tool/templates/ruby/.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `BUNDLE_JOBS`  
  `cli-tool/templates/ruby/.claude/settings.json` — Sets an environment variable for every session in this project.

## MCP servers started or contacted

- **ATTENTION** `linear`: `npx -y mcp-remote https://mcp.linear.app/mcp` (version not pinned)  
  `.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** `github`: `npx -y @modelcontextprotocol/server-github` (version not pinned)  
  `cli-tool/templates/ruby/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** `postgres`: `npx -y @modelcontextprotocol/server-postgres` (version not pinned)  
  `cli-tool/templates/ruby/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** `brave-search`: `npx -y @modelcontextprotocol/server-brave-search` (version not pinned)  
  `cli-tool/templates/ruby/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `neon` → remote `https://mcp.neon.tech/mcp`  
  `.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.
- **info** `memory-bank`: `server-memory`  
  `cli-tool/templates/common/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `sequential-thinking`: `code-reasoning`  
  `cli-tool/templates/common/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `brave-search`: `server-brave-search`  
  `cli-tool/templates/common/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `google-maps`: `server-google-maps`  
  `cli-tool/templates/common/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `deep-graph`: `mcp-code-graph`  
  `cli-tool/templates/common/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `go-sdk`: `go-sdk-server`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `language-server`: `mcp-language-server`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `gin`: `gin-mcp`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `mysql`: `go-mcp-mysql`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `archer`: `go-archer`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `memory-bank`: `server-memory`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `sequential-thinking`: `code-reasoning`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `brave-search`: `server-brave-search`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `google-maps`: `server-google-maps`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `deep-graph`: `mcp-code-graph`  
  `cli-tool/templates/go/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `typescript-sdk`: `node path/to/ts-sdk-server.js`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `github`: `node path/to/server-github`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `puppeteer`: `node path/to/server-puppeteer`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `slack`: `node path/to/server-slack`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `filesystem`: `node path/to/server-filesystem`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `memory-bank`: `server-memory`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `sequential-thinking`: `code-reasoning`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `brave-search`: `server-brave-search`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `google-maps`: `server-google-maps`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `deep-graph`: `mcp-code-graph`  
  `cli-tool/templates/javascript-typescript/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `python-sdk`: `python -m python_sdk.server`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `docker`: `python -m mcp_server_docker`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `jupyter`: `python -m server_jupyter`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `postgresql`: `python -m server_postgres`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `opik`: `python -m opik_mcp`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `memory-bank`: `server-memory`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `sequential-thinking`: `code-reasoning`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `brave-search`: `server-brave-search`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `google-maps`: `server-google-maps`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `deep-graph`: `mcp-code-graph`  
  `cli-tool/templates/python/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `ruby-docs`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'ruby_docs', description: 'Search Ruby d…`  
  `cli-tool/templates/ruby/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `rails-docs`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'rails_docs', description: 'Search Rails…`  
  `cli-tool/templates/ruby/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `rubygems`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'gem_search', description: 'Search and e…`  
  `cli-tool/templates/ruby/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `bundler`: `bundle exec ruby -e require 'json'; puts JSON.generate({tools: [{name: 'bundle_audit', description: 'Security audit for…`  
  `cli-tool/templates/ruby/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `rust-sdk`: `rust_mcp_server`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `ht-mcp`: `ht-mcp`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `rust-docs`: `rust-docs-mcp-server`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `substrate`: `substrate-mcp-rs`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `mcp-proxy`: `mcp-proxy`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `memory-bank`: `server-memory`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `sequential-thinking`: `code-reasoning`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `brave-search`: `server-brave-search`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `google-maps`: `server-google-maps`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** `deep-graph`: `mcp-code-graph`  
  `cli-tool/templates/rust/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Not checked

- `cli-tool/components/skills/ai-research/fine-tuning-unsloth/references/llms-full.md`: larger than 1 MB

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

