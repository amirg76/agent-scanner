# mksglu/context-mode — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 5a92b7c (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 25,534 stars · license NOASSERTION · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

599 files listed · 1 plugin · 17 hooks (0 with inline code) · 2 MCP servers (0 not pinned) · 1 install-time npm script · 0 installer findings · 0 settings findings.

17 hooks: 14 in the plugin's `hooks/hooks.json`, intercepting Bash, Read, Grep, WebFetch, Agent and the plugin's own MCP tools, and 3 in a configuration for another CLI (`configs/antigravity-cli/hooks/hooks.json`). The plugin's MCP server runs locally (`start.mjs`). `npm install` runs `scripts/postinstall.mjs`.

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `Stop` | `* (all)` | 2 | 0 |
| `PostToolUse` | `* (all)` | 1 | 0 |
| `PostToolUse` | `Bash\|Read\|Write\|Edit\|NotebookEdit\|Glob\|Grep\|TodoWrite\|TaskCreate\|TaskUpdate\|Ent…` | 1 | 0 |
| `PreCompact` | `* (all)` | 1 | 0 |
| `PreToolUse` | `Agent` | 1 | 0 |
| `PreToolUse` | `Bash` | 1 | 0 |
| `PreToolUse` | `Grep` | 1 | 0 |
| `PreToolUse` | `mcp__` | 1 | 0 |
| `PreToolUse` | `mcp__plugin_context-mode_context-mode__ctx_batch_execute` | 1 | 0 |
| `PreToolUse` | `mcp__plugin_context-mode_context-mode__ctx_execute` | 1 | 0 |
| `PreToolUse` | `mcp__plugin_context-mode_context-mode__ctx_execute_file` | 1 | 0 |
| `PreToolUse` | `Read` | 1 | 0 |
| `PreToolUse` | `run_command\|view_file\|grep_search\|web_fetch\|read_url_content` | 1 | 0 |
| `PreToolUse` | `WebFetch` | 1 | 0 |
| `SessionStart` | `* (all)` | 1 | 0 |
| `UserPromptSubmit` | `* (all)` | 1 | 0 |

Files: `configs/antigravity-cli/hooks/hooks.json`, `hooks/hooks.json`

**MCP servers**

- [`context-mode`] `context-mode`: `node ${CLAUDE_PLUGIN_ROOT}/start.mjs` (`.claude-plugin/plugin.json`)
- `context-mode`: `context-mode` (`configs/copilot-cli/.mcp.json`)

**npm install-time scripts**

- `postinstall`: `node scripts/postinstall.mjs` (`package.json`)

## Network calls in hook code (automated grep)

All 17 hook command strings and 6 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

The scripts these hooks run were not read in this pass; only the automated network search in the section above ran on them.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No installer that writes into `~/.claude`.
- Every MCP server is pinned, local, or remote by URL.
- No hook fetches an unpinned package from a registry.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

The plugin sits in front of most tools by design. Read `hooks/hooks.json` to see which calls it redirects.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
