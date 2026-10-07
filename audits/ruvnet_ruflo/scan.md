# ruvnet/ruflo @ 0a96fb8 — what runs without asking

5775 files listed. 72 findings: 0 high, 68 attention, 4 info.

131 files that could declare something were not read or not interpreted; see "Not checked".

## By plugin

44 plugins in this repo. You install them one at a time, so read the row for yours.

| plugin | high | attention | info |
|---|---|---|---|
| `claude-flow (plugin/)` | 0 | 16 | 0 |
| `claude-flow (repo root)` | 0 | 3 | 0 |
| `ruflo-adr` | 0 | 0 | 0 |
| `ruflo-agent` | 0 | 0 | 0 |
| `ruflo-agentdb` | 0 | 0 | 0 |
| `ruflo-agntcy` | 0 | 0 | 0 |
| `ruflo-aidefence` | 0 | 0 | 0 |
| `ruflo-arena` | 0 | 0 | 0 |
| `ruflo-autopilot` | 0 | 0 | 0 |
| `ruflo-bbs-federation` | 0 | 0 | 0 |
| `ruflo-browser` | 0 | 0 | 0 |
| `ruflo-business-pods` | 0 | 0 | 0 |
| `ruflo-chatgpt-federation` | 0 | 0 | 0 |
| `ruflo-core` | 0 | 7 | 1 |
| `ruflo-cost-tracker` | 0 | 1 | 0 |
| `ruflo-daa` | 0 | 0 | 0 |
| `ruflo-ddd` | 0 | 0 | 0 |
| `ruflo-deepseek-harness` | 0 | 0 | 0 |
| `ruflo-docs` | 0 | 0 | 0 |
| `ruflo-federation` | 0 | 0 | 0 |
| `ruflo-goals` | 0 | 0 | 0 |
| `ruflo-graph-intelligence` | 0 | 0 | 0 |
| `ruflo-intelligence` | 0 | 0 | 0 |
| `ruflo-iot-cognitum` | 0 | 0 | 0 |
| `ruflo-jujutsu` | 0 | 0 | 0 |
| `ruflo-knowledge-graph` | 0 | 0 | 0 |
| `ruflo-loop-workers` | 0 | 0 | 0 |
| `ruflo-market-data` | 0 | 0 | 0 |
| `ruflo-metaharness` | 0 | 0 | 0 |
| `ruflo-migrations` | 0 | 0 | 0 |
| `ruflo-music` | 0 | 0 | 0 |
| `ruflo-neural-trader` | 0 | 0 | 0 |
| `ruflo-observability` | 0 | 0 | 0 |
| `ruflo-plugin-creator` | 0 | 0 | 0 |
| `ruflo-rag-memory` | 0 | 0 | 0 |
| `ruflo-ruvector` | 0 | 0 | 0 |
| `ruflo-ruvllm` | 0 | 0 | 0 |
| `ruflo-rvf` | 0 | 0 | 0 |
| `ruflo-security-audit` | 0 | 0 | 0 |
| `ruflo-sparc` | 0 | 0 | 0 |
| `ruflo-swarm` | 0 | 0 | 0 |
| `ruflo-testgen` | 0 | 0 | 0 |
| `ruflo-workflows` | 0 | 0 | 0 |
| `ruflo-x-gateway` | 0 | 0 | 0 |
| *(outside any plugin)* | 0 | 41 | 3 |

## Hooks (run by the agent when an event fires)

- **ATTENTION** `PreToolUse` [matcher: `Bash`]: `"${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" modify-bash || true`  
  `.claude-plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|MultiEdit`]: `"${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" modify-file || true`  
  `.claude-plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** `PostToolUse` [matcher: `Bash`]: `cat | jq -r '.tool_input.command // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh…`  
  `.claude-plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "Bash".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `cat | jq -r '.tool_input.file_path // .tool_input.path // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}…`  
  `.claude-plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** `PreCompact` [matcher: `manual`]: `/bin/bash -c 'INPUT=$(cat); CUSTOM=$(echo "$INPUT" | jq -r ".custom_instructions // \"\""); echo "🔄 PreCompact Guidanc…`  
  `.claude-plugin/hooks/hooks.json` — Runs on PreCompact events matching "manual". The code is inline in the command (597 characters), not in a separate file.
- **ATTENTION** `PreCompact` [matcher: `auto`]: `/bin/bash -c 'echo "🔄 Auto-Compact Guidance (Context Window Full):"; echo "📋 CRITICAL: Before compacting, ensure you …`  
  `.claude-plugin/hooks/hooks.json` — Runs on PreCompact events matching "auto". The code is inline in the command (511 characters), not in a separate file.
- **ATTENTION** `Stop`: `"${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" session-end --generate-summary true --persist-state true --export-metrics…`  
  `.claude-plugin/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `Bash`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" pre-bash`  
  `.claude/settings.json` — Runs on PreToolUse for tools matching "Bash".
- **ATTENTION** [project settings] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" post-edit`  
  `.claude/settings.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit".
- **ATTENTION** [project settings] `UserPromptSubmit`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" route`  
  `.claude/settings.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [project settings] `SessionStart`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" session-restore`  
  `.claude/settings.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [project settings] `SessionStart`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/auto-memory-hook.mjs" import`  
  `.claude/settings.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [project settings] `SessionEnd`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" session-end`  
  `.claude/settings.json` — Runs on every SessionEnd event.
- **ATTENTION** [project settings] `Stop`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/auto-memory-hook.mjs" sync`  
  `.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `PreCompact` [matcher: `manual`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" compact-manual`  
  `.claude/settings.json` — Runs on PreCompact events matching "manual".
- **ATTENTION** [project settings] `PreCompact` [matcher: `manual`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" session-end`  
  `.claude/settings.json` — Runs on PreCompact events matching "manual".
- **ATTENTION** [project settings] `PreCompact` [matcher: `auto`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" compact-auto`  
  `.claude/settings.json` — Runs on PreCompact events matching "auto".
- **ATTENTION** [project settings] `PreCompact` [matcher: `auto`]: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" session-end`  
  `.claude/settings.json` — Runs on PreCompact events matching "auto".
- **ATTENTION** [project settings] `SubagentStop`: `node "$CLAUDE_PROJECT_DIR/.claude/helpers/hook-handler.cjs" post-task`  
  `.claude/settings.json` — Runs on every SubagentStop event.
- **ATTENTION** [`claude-flow (plugin/)`] `PreToolUse` [matcher: `^(Write|Edit|MultiEdit)$`]: `cat | jq -r '.tool_input.file_path // .tool_input.path // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "^(Write\|Edit\|MultiEdit)$".
- **ATTENTION** [`claude-flow (plugin/)`] `PreToolUse` [matcher: `^Bash$`]: `cat | jq -r '.tool_input.command // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "^Bash$".
- **ATTENTION** [`claude-flow (plugin/)`] `PreToolUse` [matcher: `^Task$`]: `cat | jq -r '.tool_input.description // empty | .[:200]' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "^Task$".
- **ATTENTION** [`claude-flow (plugin/)`] `PreToolUse` [matcher: `^(Grep|Glob|Read)$`]: `cat | jq -r '.tool_input.pattern // .tool_input.query // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "^(Grep\|Glob\|Read)$".
- **ATTENTION** [`claude-flow (plugin/)`] `PreToolUse` [matcher: `^mcp__claude-flow__.*$`]: `cat | jq -r '.tool_name // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" mcp-pre…`  
  `plugin/hooks/hooks.json` — Runs on PreToolUse for tools matching "^mcp\_\_claude-flow\_\_.\*$".
- **ATTENTION** [`claude-flow (plugin/)`] `PostToolUse` [matcher: `^(Write|Edit|MultiEdit)$`]: `cat | jq -r '.tool_input.file_path // .tool_input.path // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}…`  
  `plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "^(Write\|Edit\|MultiEdit)$".
- **ATTENTION** [`claude-flow (plugin/)`] `PostToolUse` [matcher: `^Bash$`]: `cat | jq -r '.tool_input.command // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh…`  
  `plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "^Bash$".
- **ATTENTION** [`claude-flow (plugin/)`] `PostToolUse` [matcher: `^Task$`]: `cat | jq -r '.tool_response.agent_id // .tool_response.task_id // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUG…`  
  `plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "^Task$".
- **ATTENTION** [`claude-flow (plugin/)`] `PostToolUse` [matcher: `^(Grep|Glob|Read)$`]: `cat | jq -r '.tool_input.pattern // .tool_input.query // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/…`  
  `plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "^(Grep\|Glob\|Read)$".
- **ATTENTION** [`claude-flow (plugin/)`] `PostToolUse` [matcher: `^mcp__claude-flow__.*$`]: `cat | jq -r '.tool_name // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" mcp-pos…`  
  `plugin/hooks/hooks.json` — Runs on PostToolUse for tools matching "^mcp\_\_claude-flow\_\_.\*$".
- **ATTENTION** [`claude-flow (plugin/)`] `UserPromptSubmit`: `cat | jq -r '.prompt // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" route --ta…`  
  `plugin/hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`claude-flow (plugin/)`] `SessionStart`: `cat | jq -r '.session_id // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" sessio…`  
  `plugin/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`claude-flow (plugin/)`] `Stop`: `prompt`  
  `plugin/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`claude-flow (plugin/)`] `SubagentStop`: `prompt`  
  `plugin/hooks/hooks.json` — Runs on every SubagentStop event.
- **ATTENTION** [`claude-flow (plugin/)`] `Notification`: `cat | jq -r '.message // empty' | tr '\n' '\0' | xargs -0 -I {} "${CLAUDE_PLUGIN_ROOT}/scripts/ruflo-hook.sh" notify --…`  
  `plugin/hooks/hooks.json` — Runs on every Notification event.
- **ATTENTION** [`claude-flow (plugin/)`] `PermissionRequest` [matcher: `^mcp__claude-flow__.*$`]: `echo '{"decision": "allow", "reason": "claude-flow MCP tool auto-approved"}'`  
  `plugin/hooks/hooks.json` — Runs on PermissionRequest for tools matching "^mcp\_\_claude-flow\_\_.\*$".
- **ATTENTION** [`ruflo-core`] `PreToolUse` [matcher: `Bash`]: `node -e "process.argv=[process.argv[0],'x','modify-bash'];require(require('path').join(process.env.CLAUDE_PLUGIN_ROOT,'…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PreToolUse for tools matching "Bash". The code is inline in the command (147 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `PreToolUse` [matcher: `Write|Edit|MultiEdit`]: `node -e "process.argv=[process.argv[0],'x','modify-file'];require(require('path').join(process.env.CLAUDE_PLUGIN_ROOT,'…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PreToolUse for tools matching "Write\|Edit\|MultiEdit". The code is inline in the command (147 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `PostToolUse` [matcher: `Bash`]: `node -e "process.argv=[process.argv[0],'x','post-command'];require(require('path').join(process.env.CLAUDE_PLUGIN_ROOT,…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PostToolUse for tools matching "Bash". The code is inline in the command (148 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `PostToolUse` [matcher: `Write|Edit|MultiEdit`]: `node -e "process.argv=[process.argv[0],'x','post-edit'];require(require('path').join(process.env.CLAUDE_PLUGIN_ROOT,'sc…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PostToolUse for tools matching "Write\|Edit\|MultiEdit". The code is inline in the command (145 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `PreCompact` [matcher: `manual`]: `node -e "process.argv=[process.argv[0],'x','precompact-manual'];require(require('path').join(process.env.CLAUDE_PLUGIN_…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PreCompact events matching "manual". The code is inline in the command (153 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `PreCompact` [matcher: `auto`]: `node -e "process.argv=[process.argv[0],'x','precompact-auto'];require(require('path').join(process.env.CLAUDE_PLUGIN_RO…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on PreCompact events matching "auto". The code is inline in the command (151 characters), not in a separate file.
- **ATTENTION** [`ruflo-core`] `Stop`: `node -e "process.argv=[process.argv[0],'x','session-end','--generate-summary','true','--persist-state','true','--export…`  
  `plugins/ruflo-core/hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (226 characters), not in a separate file.
- **ATTENTION** [`ruflo-cost-tracker`] `Stop`: `node -e "require(require('path').join(process.env.CLAUDE_PLUGIN_ROOT,'scripts','ruflo-hook.cjs'))"`  
  `plugins/ruflo-cost-tracker/hooks/hooks.json` — Runs on every Stop event. The code is inline in the command (98 characters), not in a separate file.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `^(Write|Edit|MultiEdit)$`]: `[ -n "$TOOL_INPUT_file_path" ] && npx @claude-flow/cli@latest hooks pre-edit --file "$TOOL_INPUT_file_path" 2>/dev/null…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PreToolUse for tools matching "^(Write\|Edit\|MultiEdit)$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `^Bash$`]: `[ -n "$TOOL_INPUT_command" ] && npx @claude-flow/cli@latest hooks pre-command --command "$TOOL_INPUT_command" 2>/dev/nu…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PreToolUse for tools matching "^Bash$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `PreToolUse` [matcher: `^Task$`]: `[ -n "$TOOL_INPUT_description" ] && npx @claude-flow/cli@latest hooks pre-task --task-id "task-$(date +%s)" --descripti…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PreToolUse for tools matching "^Task$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `PostToolUse` [matcher: `^(Write|Edit|MultiEdit)$`]: `[ -n "$TOOL_INPUT_file_path" ] && npx @claude-flow/cli@latest hooks post-edit --file "$TOOL_INPUT_file_path" --success …`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PostToolUse for tools matching "^(Write\|Edit\|MultiEdit)$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `PostToolUse` [matcher: `^Bash$`]: `[ -n "$TOOL_INPUT_command" ] && npx @claude-flow/cli@latest hooks post-command --command "$TOOL_INPUT_command" --succes…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PostToolUse for tools matching "^Bash$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `PostToolUse` [matcher: `^Task$`]: `[ -n "$TOOL_RESULT_agent_id" ] && npx @claude-flow/cli@latest hooks post-task --task-id "$TOOL_RESULT_agent_id" --succe…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on PostToolUse for tools matching "^Task$". Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `UserPromptSubmit`: `[ -n "$PROMPT" ] && npx @claude-flow/cli@latest hooks route --task "$PROMPT" || true`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on every prompt the user sends and can add text to it. Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `SessionStart`: `npx @claude-flow/cli@latest daemon start --quiet 2>/dev/null || true`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs at session start (startup, resume, clear or compact), before the user types anything. Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `SessionStart`: `[ -n "$SESSION_ID" ] && npx @claude-flow/cli@latest hooks session-restore --session-id "$SESSION_ID" 2>/dev/null || true`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs at session start (startup, resume, clear or compact), before the user types anything. Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.
- **ATTENTION** [project settings] `Stop`: `echo '{"ok": true}'`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on every Stop event.
- **ATTENTION** [project settings] `Notification`: `[ -n "$NOTIFICATION_MESSAGE" ] && npx @claude-flow/cli@latest memory store --namespace notifications --key "notify-$(da…`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs on every Notification event. Runs @claude-flow/cli@latest: the "latest" tag is resolved from the registry on each run.

## Commands run by configuration (settings, MCP servers)

- **ATTENTION** [project settings] `statusLine`: `sh -c 'exec node "${CLAUDE_PROJECT_DIR:-.}/.claude/helpers/statusline.cjs"'`  
  `.claude/settings.json` — Runs a command to render the status line.
- **ATTENTION** [project settings] `statusLine`: `npx @claude-flow/cli@latest hooks statusline 2>/dev/null || node .claude/helpers/statusline.cjs 2>/dev/null || echo "▊ …`  
  `v3/@claude-flow/mcp/.claude/settings.json` — Runs a command to render the status line.

## Permissions and approvals granted by project settings

- **ATTENTION** [project settings] setting `enabledMcpjsonServers:claude-flow`  
  `.claude/settings.json` — Approves 1 project MCP server(s) without a prompt.

## Environment set by project settings

- **info** [project settings] `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`  
  `.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `CLAUDE_FLOW_V3_ENABLED`  
  `.claude/settings.json` — Sets an environment variable for every session in this project.
- **info** [project settings] `CLAUDE_FLOW_HOOKS_ENABLED`  
  `.claude/settings.json` — Sets an environment variable for every session in this project.

## MCP servers started or contacted

- **ATTENTION** [`claude-flow (repo root)`] `claude-flow`: `npx claude-flow@alpha mcp start` (version not pinned)  
  `.claude-plugin/plugin.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** [`claude-flow (repo root)`] `ruv-swarm`: `npx ruv-swarm mcp start` (version not pinned)  
  `.claude-plugin/plugin.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** [`claude-flow (repo root)`] `flow-nexus`: `npx flow-nexus@latest mcp start` (version not pinned)  
  `.claude-plugin/plugin.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`ruflo-core`] `ruflo`: `node ${CLAUDE_PLUGIN_ROOT}/scripts/mcp-launch.cjs`  
  `plugins/ruflo-core/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Scripts that run on npm install

- **ATTENTION** `prepare`: `husky`  
  `ruflo/src/ruvocal/package.json` — Runs on install from git and before publish.
- **ATTENTION** `postinstall`: `node -e "const{execSync}=require('child_process');try{execSync('agent-browser --version',{stdio:'ignore'});}catch{conso…`  
  `v3/@claude-flow/browser/package.json` — Runs automatically on npm install (postinstall).
- **ATTENTION** `postinstall`: `node ./scripts/postinstall.cjs`  
  `v3/@claude-flow/cli/package.json` — Runs automatically on npm install (postinstall).
- **ATTENTION** `prepare`: `npm run build`  
  `v3/@claude-flow/security/package.json` — Runs on install from git and before publish.

## Installers that write into ~/.claude

- **ATTENTION** writes to `~/.claude` (no backup code found, heuristic)  
  `.claude-plugin/scripts/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **ATTENTION** writes to `~/.claude/agents` (no backup code found, heuristic)  
  `.claude-plugin/scripts/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **ATTENTION** writes to `~/.claude/commands` (no backup code found, heuristic)  
  `.claude-plugin/scripts/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.
- **ATTENTION** writes to `~/.claude/settings.json` (no backup code found, heuristic)  
  `.claude-plugin/scripts/install.sh` — Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.

## Not checked

- `v3/@claude-flow/cli/.claude/agents/analysis/analyze-code-quality.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/analysis/code-analyzer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/analysis/code-review/analyze-code-quality.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/architecture/arch-system-design.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/architecture/system-design/arch-system-design.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/byzantine-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/crdt-synchronizer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/gossip-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/performance-benchmarker.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/quorum-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/raft-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/security-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/core/planner.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/data/data-ml-model.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/data/ml/data-ml-model.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/development/backend/dev-backend-api.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/development/dev-backend-api.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/devops/ci-cd/ops-cicd-github.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/devops/ops-cicd-github.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/documentation/api-docs/docs-api-openapi.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/documentation/docs-api-openapi.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/code-review-swarm.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/github-modes.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/issue-tracker.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/pr-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/release-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/release-swarm.md`: hooks entries not in the documented shape (keys: pre\_task, post\_edit, post\_task, notification); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/repo-architect.md`: hooks entries not in the documented shape (keys: pre\_task, post\_edit, post\_task, notification); not interpreted
- `v3/@claude-flow/cli/.claude/agents/github/workflow-automation.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/sparc/architecture.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/sparc/pseudocode.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/sparc/refinement.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/sparc/specification.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/specialized/mobile/spec-mobile-react-native.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/specialized/spec-mobile-react-native.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/swarm/adaptive-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/swarm/hierarchical-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/swarm/mesh-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/automation-smart-agent.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/base-template-generator.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/coordinator-swarm-init.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/github-pr-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/implementer-sparc-coder.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/memory-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/orchestrator-task.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/performance-analyzer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/templates/sparc-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/testing/production-validator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/testing/tdd-london-swarm.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/aidefence-guardian.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/claims-authorizer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/collective-intelligence-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/ddd-domain-expert.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/injection-analyst.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/performance-engineer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/pii-detector.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/reasoningbank-learner.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/security-architect-aidefence.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/security-architect.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/swarm-memory-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/v3/v3-integration-architect.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/settings.json`: invalid JSON: Expected ',' or '}' after property value in JSON at position 318 (line 14 column 31)
- `v3/@claude-flow/mcp/.claude/agents/analysis/analyze-code-quality.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/analysis/code-analyzer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/analysis/code-review/analyze-code-quality.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/architecture/arch-system-design.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/architecture/system-design/arch-system-design.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/byzantine-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/crdt-synchronizer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/gossip-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/performance-benchmarker.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/quorum-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/raft-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/consensus/security-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/core/coder.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/core/planner.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/core/researcher.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/core/reviewer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/core/tester.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/data/data-ml-model.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/data/ml/data-ml-model.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/development/backend/dev-backend-api.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/development/dev-backend-api.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/devops/ci-cd/ops-cicd-github.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/devops/ops-cicd-github.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/documentation/api-docs/docs-api-openapi.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/documentation/docs-api-openapi.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/code-review-swarm.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/github-modes.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/issue-tracker.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/pr-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/release-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/release-swarm.md`: hooks entries not in the documented shape (keys: pre\_task, post\_edit, post\_task, notification); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/repo-architect.md`: hooks entries not in the documented shape (keys: pre\_task, post\_edit, post\_task, notification); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/github/workflow-automation.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/sparc/architecture.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/sparc/pseudocode.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/sparc/refinement.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/sparc/specification.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/specialized/mobile/spec-mobile-react-native.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/specialized/spec-mobile-react-native.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/swarm/adaptive-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/swarm/hierarchical-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/swarm/mesh-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/automation-smart-agent.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/base-template-generator.md`: hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/coordinator-swarm-init.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/github-pr-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/implementer-sparc-coder.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/memory-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/orchestrator-task.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/performance-analyzer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/templates/sparc-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/testing/production-validator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/testing/tdd-london-swarm.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/adr-architect.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/aidefence-guardian.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/claims-authorizer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/collective-intelligence-coordinator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/ddd-domain-expert.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/injection-analyst.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/memory-specialist.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/performance-engineer.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/pii-detector.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/reasoningbank-learner.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/security-architect-aidefence.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/security-architect.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/security-auditor.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/sparc-orchestrator.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/swarm-memory-manager.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/mcp/.claude/agents/v3/v3-integration-architect.md`: hooks entries not in the documented shape (keys: pre, post); not interpreted

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

