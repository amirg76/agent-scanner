# affaan-m/ECC — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner was notified on 2026-10-07 (https://github.com/affaan-m/ECC/issues/3450); corrections are welcome as an issue.
**Commit:** bf70150 (2026-09-21) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 274,118 stars · license MIT · last push 2026-10-05 (GitHub API, 2026-10-06)

## Summary

3,734 files listed · 1 plugin · 24 hooks (24 with inline code) · 1 MCP server (1 not pinned) · 0 install-time npm scripts · 4 installer findings · 0 settings findings.

A large, actively maintained collection of skills, agents and hooks. It declares 24 hooks, all with their code inline in `hooks/hooks.json`, several on every tool call or at every session start and stop. Its installer copies files into `~/.claude`; the copy step (`scripts/lib/install/apply.js`, line 593) replaces existing files of the same name, with no backup step in that file (other modules of the installer were not checked).

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `Stop` | `* (all)` | 7 | 7 |
| `PostToolUse` | `* (all)` | 2 | 2 |
| `PreToolUse` | `* (all)` | 2 | 2 |
| `SessionStart` | `* (all)` | 2 | 2 |
| `PostToolUseFailure` | `* (all)` | 1 | 1 |
| `PostToolUseFailure` | `Skill` | 1 | 1 |
| `PreCompact` | `* (all)` | 1 | 1 |
| `PreToolUse` | `Bash` | 1 | 1 |
| `PreToolUse` | `Bash\|PowerShell\|Write\|Edit\|MultiEdit` | 1 | 1 |
| `PreToolUse` | `Edit\|Write` | 1 | 1 |
| `PreToolUse` | `Edit\|Write\|MultiEdit` | 1 | 1 |
| `PreToolUse` | `PowerShell` | 1 | 1 |
| `PreToolUse` | `Write` | 1 | 1 |
| `PreToolUse` | `Write\|Edit\|MultiEdit` | 1 | 1 |
| `SessionEnd` | `* (all)` | 1 | 1 |

Files: `hooks/hooks.json`

**MCP servers**

- [`ecc`] `chrome-devtools`: `npx -y chrome-devtools-mcp@latest` — **not pinned** (`.mcp.json`)

**Installers**

- `docs/fixes/install_hook_wrapper.ps1` → `~/.claude/settings.local.json`: backup-related code found (heuristic)
- `docs/fixes/install_hook_wrapper.ps1` → `~/.claude/skills`: backup-related code found (heuristic)
- `scripts/install-apply.js` → `~/.claude`: writes not traced, backup not confirmed
- `scripts/setup-package-manager.js` → `~/.claude`: writes not traced, backup not confirmed

## Network calls in hook code (automated grep)

All 24 hook command strings and 21 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

- `scripts/hooks/plan-canvas-pending.js:87` — `const req = http.request(`

## Checked by hand

- `scripts/lib/install/apply.js` line 593: `fs.copyFileSync(operation.sourcePath, operation.destinationPath)`, with no existence check, backup or rollback in that file. The installer also writes a commit-attribution preference into the Claude settings file and leaves unreadable settings untouched (line 227).
- The one network match, `scripts/hooks/plan-canvas-pending.js:87`, is a request to `127.0.0.1` (a local server).
- Since v2.1.0 (2026-07-27): 4 hooks added, 9 changed, 1 removed (21 → 24); see `diff-since-v2.1.0.md`. Whether Claude Code asks before applying a plugin update was not checked.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No hook fetches an unpinned package from a registry.
- No language servers or background monitors.

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

1. Back up `~/.claude` first.
2. Run the installer with `--dry-run` and read the list.
3. Install single skills (`--skills <id>`) if you already have your own skills.
4. Review `hooks/hooks.json` and keep only the hooks you want.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
