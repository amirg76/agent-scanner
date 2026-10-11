# affaan-m/ECC — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner was notified on 2026-10-07 (https://github.com/affaan-m/ECC/issues/3450); corrections are welcome as an issue.
**Commit:** bf70150 (2026-09-21) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 274,118 stars · license MIT · last push 2026-10-05 (GitHub API, 2026-10-06)

## Summary

3,734 files listed · 1 plugin · 24 hooks (24 with inline code) · 1 MCP server (1 not pinned) · 0 install-time npm scripts · 4 installer findings · 0 settings findings.

A large, actively maintained collection of skills, agents and hooks. It declares 24 hooks, all with their code inline in `hooks/hooks.json`, several on every tool call or at every session start and stop. Its installer copies files into `~/.claude`. It does not replace a file that already exists unless the installer recorded it as its own: a guard in `scripts/lib/install/ownership-guard.js` removes such destinations from the plan and checks again before each write. A reinstall can update files the installer recorded as its own. (Corrected on 2026-10-11; the first version of this audit said existing files were replaced.)

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

- `scripts/lib/install/apply.js` line 593 copies with `fs.copyFileSync(operation.sourcePath, operation.destinationPath)`. **Correction (2026-10-11):** the first version of this audit read only `apply.js` and concluded that a user's file of the same name would be replaced. That was wrong. At the audited commit, `apply.js` calls `prepareUserOwnedFileGuard()` from `scripts/lib/install/ownership-guard.js`, which removes existing destinations not recorded as installer-managed from the applied plan, and `assertNoNewUserOwnedFile()` before each write. Re-checked in the code after the owner's reply. The installer also writes a commit-attribution preference into the Claude settings file and leaves unreadable settings untouched (line 227).
- The one network match, `scripts/hooks/plan-canvas-pending.js:87`, is a request to `127.0.0.1` (a local server).
- Since v2.1.0 (2026-07-27): 4 hooks added, 9 changed, 1 removed (21 → 24); see `diff-since-v2.1.0.md`. Whether Claude Code asks before applying a plugin update was not checked.

## Owner response

2026-10-11, on the notification issue (affaan-m/ECC#3450), which asked whether the copy replaces existing files: a collaborator, haelyra, pointed to the ownership guard (`prepareUserOwnedFileGuard()` and `assertNoNewUserOwnedFile()`, in the 2.2.3 release) and reported running the installer and uninstaller with a colliding, user-authored skill: "Both preserved its exact bytes". Files already recorded as installer-managed can be updated by a reinstall. This corrected the audit; see "Checked by hand".

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

1. Files you edited that the installer recorded as its own can be updated by a reinstall; keep a copy of those.
2. Run the installer with `--dry-run` and read the list.
3. Install single skills (`--skills <id>`) if you already have your own skills.
4. Review `hooks/hooks.json` and keep only the hooks you want.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
