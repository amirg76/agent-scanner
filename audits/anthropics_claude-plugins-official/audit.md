# anthropics/claude-plugins-official — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 6bfd4e0 (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 37,462 stars · license Apache-2.0 · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

460 files listed · 53 plugins (32 with findings) · 22 hooks (0 with inline code) · 14 MCP servers (3 not pinned) · 12 plugin components · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

The official marketplace lists 311 plugins. 259 are hosted in other repositories and were not scanned (162 by git URL, 97 as a subfolder of another repository); this audit covers the 52 in this repository, plus `example-plugin`, a folder the marketplace does not list. Of the 39 that have their own `plugin.json`, 19 declare nothing that runs on their own. Twelve language-server plugins have no `plugin.json`: each marketplace entry is their manifest and declares the language server (`clangd`, `gopls`, `pyright`, `rust-analyzer` and others), which Claude Code starts as a local process. Where something runs, it is a hook with an evident purpose, or the MCP or language server the plugin exists to provide. Three MCP servers resolve a new release on each start (`firebase`, `playwright` at `@latest`; `serena` from a git branch). `security-guidance` sends code diffs to the Anthropic API from its hooks, as its README states.

## What runs without asking

**By plugin** (32 of 53 plugins declare something)

| plugin | hooks | MCP servers | other |
|---|---|---|---|
| `security-guidance` | 12 | 0 | 0 |
| `hookify` | 4 | 0 | 0 |
| `claude-security` | 3 | 0 | 0 |
| `clangd-lsp` | 0 | 0 | 1 |
| `context7` | 0 | 1 | 0 |
| `csharp-lsp` | 0 | 0 | 1 |
| `discord` | 0 | 1 | 0 |
| `example-plugin` | 0 | 1 | 0 |
| `explanatory-output-style` | 1 | 0 | 0 |
| `fakechat` | 0 | 1 | 0 |
| `firebase` | 0 | 1 | 0 |
| `github` | 0 | 1 | 0 |
| `gitlab` | 0 | 1 | 0 |
| `gopls-lsp` | 0 | 0 | 1 |
| `imessage` | 0 | 1 | 0 |
| `jdtls-lsp` | 0 | 0 | 1 |
| `kotlin-lsp` | 0 | 0 | 1 |
| `laravel-boost` | 0 | 1 | 0 |
| `learning-output-style` | 1 | 0 | 0 |
| `linear` | 0 | 1 | 0 |
| `lua-lsp` | 0 | 0 | 1 |
| `php-lsp` | 0 | 0 | 1 |
| `playwright` | 0 | 1 | 0 |
| `pyright-lsp` | 0 | 0 | 1 |
| `ralph-loop` | 1 | 0 | 0 |
| `ruby-lsp` | 0 | 0 | 1 |
| `rust-analyzer-lsp` | 0 | 0 | 1 |
| `serena` | 0 | 1 | 0 |
| `swift-lsp` | 0 | 0 | 1 |
| `telegram` | 0 | 1 | 0 |
| `terraform` | 0 | 1 | 0 |
| `typescript-lsp` | 0 | 0 | 1 |

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `PostToolUse` | `Bash` | 8 | 0 |
| `SessionStart` | `* (all)` | 3 | 0 |
| `Stop` | `* (all)` | 3 | 0 |
| `UserPromptSubmit` | `* (all)` | 2 | 0 |
| `PostToolUse` | `* (all)` | 1 | 0 |
| `PostToolUse` | `Edit\|Write\|MultiEdit\|NotebookEdit` | 1 | 0 |
| `PostToolUseFailure` | `Bash` | 1 | 0 |
| `PreToolUse` | `* (all)` | 1 | 0 |
| `SubagentStop` | `* (all)` | 1 | 0 |
| `UserPromptExpansion` | `^claude-security:claude-security$` | 1 | 0 |

Files: `plugins/claude-security/hooks/hooks.json`, `plugins/explanatory-output-style/hooks/hooks.json`, `plugins/hookify/hooks/hooks.json`, `plugins/learning-output-style/hooks/hooks.json`, `plugins/ralph-loop/hooks/hooks.json`, `plugins/security-guidance/hooks/hooks.json`

**MCP servers**

- [`context7`] `context7`: remote `https://mcp.context7.com/mcp?client=claude-code-plugin` (`external_plugins/context7/.mcp.json`)
- [`discord`] `discord`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start` (`external_plugins/discord/.mcp.json`)
- [`fakechat`] `fakechat`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start` (`external_plugins/fakechat/.mcp.json`)
- [`firebase`] `firebase`: `npx -y firebase-tools@latest mcp` — **not pinned** (`external_plugins/firebase/.mcp.json`)
- [`github`] `github`: remote `https://api.githubcopilot.com/mcp/` (`external_plugins/github/.mcp.json`)
- [`gitlab`] `gitlab`: remote `https://gitlab.com/api/v4/mcp` (`external_plugins/gitlab/.mcp.json`)
- [`imessage`] `imessage`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start` (`external_plugins/imessage/.mcp.json`)
- [`laravel-boost`] `laravel-boost`: `php artisan boost:mcp` (`external_plugins/laravel-boost/.mcp.json`)
- [`linear`] `linear`: remote `https://mcp.linear.app/mcp` (`external_plugins/linear/.mcp.json`)
- [`playwright`] `playwright`: `npx @playwright/mcp@latest` — **not pinned** (`external_plugins/playwright/.mcp.json`)
- [`serena`] `serena`: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server` — **not pinned** (`external_plugins/serena/.mcp.json`)
- [`telegram`] `telegram`: `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start` (`external_plugins/telegram/.mcp.json`)
- [`terraform`] `terraform`: `docker run -i --rm -e TFE_TOKEN=${TFE_TOKEN} hashicorp/terraform-mcp-server:0.4.0` — pinned (`external_plugins/terraform/.mcp.json`)
- [`example-plugin`] `example-server`: remote `https://mcp.example.com/api` (`plugins/example-plugin/.mcp.json`)

**Plugin components that start processes**

- language server `clangd`: `clangd --background-index` (`.claude-plugin/marketplace.json`)
- language server `csharp-ls`: `csharp-ls` (`.claude-plugin/marketplace.json`)
- language server `gopls`: `gopls` (`.claude-plugin/marketplace.json`)
- language server `jdtls`: `jdtls` (`.claude-plugin/marketplace.json`)
- language server `kotlin-lsp`: `kotlin-lsp --stdio` (`.claude-plugin/marketplace.json`)
- language server `lua`: `lua-language-server` (`.claude-plugin/marketplace.json`)
- language server `intelephense`: `intelephense --stdio` (`.claude-plugin/marketplace.json`)
- language server `pyright`: `pyright-langserver --stdio` (`.claude-plugin/marketplace.json`)
- language server `ruby-lsp`: `ruby-lsp` (`.claude-plugin/marketplace.json`)
- language server `rust-analyzer`: `rust-analyzer` (`.claude-plugin/marketplace.json`)
- language server `sourcekit-lsp`: `sourcekit-lsp` (`.claude-plugin/marketplace.json`)
- language server `typescript`: `typescript-language-server --stdio` (`.claude-plugin/marketplace.json`)

## Network calls in hook code (automated grep)

All 22 hook command strings and 11 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

- `plugins/security-guidance/hooks/security_reminder_hook.py:69` — `import urllib.request`

## Not read by the scanner

The scanner lists 1 item as not checked; anything declared there is not in the counts above.

- `.claude-plugin/marketplace.json` — 259 entries are hosted elsewhere; not fetched

The marketplace file lists 259 plugins hosted in other repositories (162 by git URL, 97 as a subfolder of another repository). The scanner does not fetch them, so nothing they declare is in this audit.

## Checked by hand

`plugins/security-guidance/hooks/llm.py` posts the diff to `ANTHROPIC_BASE_URL` (default `https://api.anthropic.com`) and retries up to three times, using the user's API credentials and token budget. The automated grep lists only `security_reminder_hook.py` because the hook command runs a wrapper script; `llm.py` was read by hand.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- No hook fetches an unpinned package from a registry.

## Is it documented?

`security-guidance` documents its network use in its README. The unpinned MCP servers are not called out.

## Recommendations for users

1. `security-guidance` spends tokens on every turn that edits code; check its model setting if cost matters.
2. For `firebase`, `playwright` and `serena`, each start can pull a newer release.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
