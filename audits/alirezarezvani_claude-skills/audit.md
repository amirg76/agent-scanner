# alirezarezvani/claude-skills — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 19392f7 (2026-08-26) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 27,777 stars · license MIT · last push 2026-08-30 (GitHub API, 2026-10-06)

## Summary

5,443 files listed · 99 plugins (8 with findings) · 12 hooks (0 with inline code) · 2 MCP servers (0 not pinned) · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

99 plugins; 7 declare hooks (12 in total, 8 of them at session start or end). Two MCP servers: `tessl`, run locally from the repo root, and Atlassian over HTTPS in the `pm-skills` plugin. No install scripts, no network calls in hook code (automated grep).

## What runs without asking

**By plugin** (8 of 99 plugins declare something)

| plugin | hooks | MCP servers | other |
|---|---|---|---|
| `agent-memory` | 3 | 0 | 0 |
| `agent-launcher-skills` | 2 | 0 | 0 |
| `handoff (productivity/handoff/)` | 2 | 0 | 0 |
| `pw` | 2 | 0 | 0 |
| `pm-skills` | 0 | 1 | 0 |
| `security-guidance` | 1 | 0 | 0 |
| `si` | 1 | 0 | 0 |
| `skillopt-sleep` | 1 | 0 | 0 |

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `SessionEnd` | `* (all)` | 4 | 0 |
| `SessionStart` | `* (all)` | 4 | 0 |
| `PostToolUse` | `Bash` | 1 | 0 |
| `PostToolUse` | `Write\|Edit` | 1 | 0 |
| `PreToolUse` | `Edit\|Write\|MultiEdit` | 1 | 0 |
| `UserPromptSubmit` | `* (all)` | 1 | 0 |

Files: `agent-launcher/hooks/hooks.json`, `engineering-team/playwright-pro/hooks/hooks.json`, `engineering-team/self-improving-agent/hooks/hooks.json`, `engineering/agent-memory/hooks/hooks.json`, `engineering/security-guidance/hooks/hooks.json`, `engineering/skillopt-sleep/hooks/hooks.json`, `productivity/handoff/hooks/hooks.json`

**MCP servers**

- `tessl`: `tessl mcp start` (`.mcp.json`)
- [`pm-skills`] `atlassian`: remote `https://mcp.atlassian.com/v1/sse` (`project-management/.mcp.json`)

## Network calls in hook code (automated grep)

All 12 hook command strings and 12 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

The scripts these hooks run were not read in this pass; only the automated network search in the section above ran on them.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- Every MCP server is pinned, local, or remote by URL.
- No hook fetches an unpinned package from a registry.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

Check the hook list for the plugin you install; most plugins here add nothing automatic.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
