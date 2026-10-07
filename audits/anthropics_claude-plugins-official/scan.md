# anthropics/claude-plugins-official @ 6bfd4e0 — what runs without asking

460 files listed. 48 findings: 0 high, 37 attention, 11 info.

1 file that could declare something was not read or not interpreted; see "Not checked".

## By plugin

53 plugins in this repo. You install them one at a time, so read the row for yours.

| plugin | high | attention | info |
|---|---|---|---|
| `agent-sdk-dev` | 0 | 0 | 0 |
| `asana` | 0 | 0 | 0 |
| `clangd-lsp` | 0 | 1 | 0 |
| `claude-code-setup` | 0 | 0 | 0 |
| `claude-md-management` | 0 | 0 | 0 |
| `claude-security` | 0 | 3 | 0 |
| `code-modernization` | 0 | 0 | 0 |
| `code-review` | 0 | 0 | 0 |
| `code-simplifier` | 0 | 0 | 0 |
| `commit-commands` | 0 | 0 | 0 |
| `context7` | 0 | 0 | 1 |
| `csharp-lsp` | 0 | 1 | 0 |
| `cwc-makers` | 0 | 0 | 0 |
| `discord` | 0 | 0 | 1 |
| `example-plugin` | 0 | 0 | 1 |
| `explanatory-output-style` | 0 | 1 | 0 |
| `fakechat` | 0 | 0 | 1 |
| `feature-dev` | 0 | 0 | 0 |
| `firebase` | 0 | 1 | 0 |
| `frontend-design` | 0 | 0 | 0 |
| `github` | 0 | 0 | 1 |
| `gitlab` | 0 | 0 | 1 |
| `gopls-lsp` | 0 | 1 | 0 |
| `hookify` | 0 | 4 | 0 |
| `imessage` | 0 | 0 | 1 |
| `jdtls-lsp` | 0 | 1 | 0 |
| `kotlin-lsp` | 0 | 1 | 0 |
| `laravel-boost` | 0 | 0 | 1 |
| `learning-output-style` | 0 | 1 | 0 |
| `linear` | 0 | 0 | 1 |
| `lua-lsp` | 0 | 1 | 0 |
| `math-olympiad` | 0 | 0 | 0 |
| `mcp-server-dev` | 0 | 0 | 0 |
| `mcp-tunnels` | 0 | 0 | 0 |
| `php-lsp` | 0 | 1 | 0 |
| `playground` | 0 | 0 | 0 |
| `playwright` | 0 | 1 | 0 |
| `plugin-dev` | 0 | 0 | 0 |
| `pr-review-toolkit` | 0 | 0 | 0 |
| `project-artifact` | 0 | 0 | 0 |
| `pyright-lsp` | 0 | 1 | 0 |
| `ralph-loop` | 0 | 1 | 0 |
| `receipts` | 0 | 0 | 0 |
| `ruby-lsp` | 0 | 1 | 0 |
| `rust-analyzer-lsp` | 0 | 1 | 0 |
| `security-guidance` | 0 | 12 | 0 |
| `serena` | 0 | 1 | 0 |
| `session-report` | 0 | 0 | 0 |
| `skill-creator` | 0 | 0 | 0 |
| `swift-lsp` | 0 | 1 | 0 |
| `telegram` | 0 | 0 | 1 |
| `terraform` | 0 | 0 | 1 |
| `typescript-lsp` | 0 | 1 | 0 |

## Hooks (run by the agent when an event fires)

- **ATTENTION** [`claude-security`] `UserPromptExpansion` [matcher: `^claude-security:claude-security$`]: `sh "${CLAUDE_PLUGIN_ROOT}/hooks/hooks.sh" banner`  
  `plugins/claude-security/hooks/hooks.json` — Runs on UserPromptExpansion events matching "^claude-security:claude-security$".
- **ATTENTION** [`claude-security`] `PostToolUse` [matcher: `Bash`]: `sh "${CLAUDE_PLUGIN_ROOT}/hooks/hooks.sh" metrics`  
  `plugins/claude-security/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(python3 \*claude-security\*scripts/\*.py \*)".
- **ATTENTION** [`claude-security`] `PostToolUseFailure` [matcher: `Bash`]: `sh "${CLAUDE_PLUGIN_ROOT}/hooks/hooks.sh" metrics`  
  `plugins/claude-security/hooks/hooks.json` — Runs on PostToolUseFailure only when the tool call matches "Bash(python3 \*claude-security\*scripts/\*.py \*)".
- **ATTENTION** [`explanatory-output-style`] `SessionStart`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks-handlers/session-start.sh"`  
  `plugins/explanatory-output-style/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`hookify`] `PreToolUse`: `python3 "${CLAUDE_PLUGIN_ROOT}/hooks/pretooluse.py"`  
  `plugins/hookify/hooks/hooks.json` — Runs on every PreToolUse event, for every tool.
- **ATTENTION** [`hookify`] `PostToolUse`: `python3 "${CLAUDE_PLUGIN_ROOT}/hooks/posttooluse.py"`  
  `plugins/hookify/hooks/hooks.json` — Runs on every PostToolUse event, for every tool.
- **ATTENTION** [`hookify`] `Stop`: `python3 "${CLAUDE_PLUGIN_ROOT}/hooks/stop.py"`  
  `plugins/hookify/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`hookify`] `UserPromptSubmit`: `python3 "${CLAUDE_PLUGIN_ROOT}/hooks/userpromptsubmit.py"`  
  `plugins/hookify/hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`learning-output-style`] `SessionStart`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks-handlers/session-start.sh"`  
  `plugins/learning-output-style/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`ralph-loop`] `Stop`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.sh"`  
  `plugins/ralph-loop/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`security-guidance`] `SessionStart`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/ensure_agent_sdk.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`security-guidance`] `UserPromptSubmit`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Edit|Write|MultiEdit|NotebookEdit`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse for tools matching "Edit\|Write\|MultiEdit\|NotebookEdit".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(git commit:\*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(git -C \* commit \*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(git push:\*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(git -C \* push\*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(gt create:\*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(gt modify:\*)".
- **ATTENTION** [`security-guidance`] `PostToolUse` [matcher: `Bash`]: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on PostToolUse only when the tool call matches "Bash(gt submit:\*)".
- **ATTENTION** [`security-guidance`] `Stop`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** [`security-guidance`] `SubagentStop`: `bash "${CLAUDE_PLUGIN_ROOT}/hooks/sg-python.sh" "${CLAUDE_PLUGIN_ROOT}/hooks/security_reminder_hook.py"`  
  `plugins/security-guidance/hooks/hooks.json` — Runs on every SubagentStop event.

## MCP servers started or contacted

- **ATTENTION** [`firebase`] `firebase`: `npx -y firebase-tools@latest mcp` (version not pinned)  
  `external_plugins/firebase/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** [`playwright`] `playwright`: `npx @playwright/mcp@latest` (version not pinned)  
  `external_plugins/playwright/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** [`serena`] `serena`: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server` (version not pinned)  
  `external_plugins/serena/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`context7`] `context7` → remote `https://mcp.context7.com/mcp?client=claude-code-plugin`  
  `external_plugins/context7/.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.
- **info** [`discord`] `discord`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start`  
  `external_plugins/discord/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`fakechat`] `fakechat`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start`  
  `external_plugins/fakechat/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`github`] `github` → remote `https://api.githubcopilot.com/mcp/`  
  `external_plugins/github/.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.
- **info** [`gitlab`] `gitlab` → remote `https://gitlab.com/api/v4/mcp`  
  `external_plugins/gitlab/.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.
- **info** [`imessage`] `imessage`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start`  
  `external_plugins/imessage/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`laravel-boost`] `laravel-boost`: `php artisan boost:mcp`  
  `external_plugins/laravel-boost/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`linear`] `linear` → remote `https://mcp.linear.app/mcp`  
  `external_plugins/linear/.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.
- **info** [`telegram`] `telegram`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start`  
  `external_plugins/telegram/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`terraform`] `terraform`: `docker run -i --rm -e TFE_TOKEN=${TFE_TOKEN} hashicorp/terraform-mcp-server:0.4.0`  
  `external_plugins/terraform/.mcp.json` — Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **info** [`example-plugin`] `example-server` → remote `https://mcp.example.com/api`  
  `plugins/example-plugin/.mcp.json` — Connects to a remote MCP server; its behaviour can change on the server side.

## Language servers started by a plugin

- **ATTENTION** [`clangd-lsp`] `clangd`: `clangd --background-index`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "clangd-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`csharp-lsp`] `csharp-ls`: `csharp-ls`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "csharp-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`gopls-lsp`] `gopls`: `gopls`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "gopls-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`jdtls-lsp`] `jdtls`: `jdtls`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "jdtls-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`kotlin-lsp`] `kotlin-lsp`: `kotlin-lsp --stdio`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "kotlin-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`lua-lsp`] `lua`: `lua-language-server`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "lua-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`php-lsp`] `intelephense`: `intelephense --stdio`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "php-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`pyright-lsp`] `pyright`: `pyright-langserver --stdio`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "pyright-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`ruby-lsp`] `ruby-lsp`: `ruby-lsp`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "ruby-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`rust-analyzer-lsp`] `rust-analyzer`: `rust-analyzer`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "rust-analyzer-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`swift-lsp`] `sourcekit-lsp`: `sourcekit-lsp`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "swift-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.
- **ATTENTION** [`typescript-lsp`] `typescript`: `typescript-language-server --stdio`  
  `.claude-plugin/marketplace.json` — Declared in marketplace entry "typescript-lsp". A language server the plugin starts to provide code intelligence; it runs as a local process.

## Not checked

- `.claude-plugin/marketplace.json`: 259 entries are hosted elsewhere; not fetched

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

