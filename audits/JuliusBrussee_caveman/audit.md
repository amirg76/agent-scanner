# JuliusBrussee/caveman — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 2fd153c (2026-09-22) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 110,164 stars · license Apache-2.0 · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

1,594 files listed · 1 plugin · 2 hooks (0 with inline code) · 0 MCP servers · 0 install-time npm scripts · 4 installer findings · 0 settings findings.

Two hooks, at session start and on every prompt, run Node scripts from the plugin (`src/hooks/caveman-activate.js`, `src/hooks/caveman-mode-tracker.js`). The installers back up `settings.json` before editing it.

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `SessionStart` | `* (all)` | 1 | 0 |
| `UserPromptSubmit` | `* (all)` | 1 | 0 |

Files: `.claude-plugin/plugin.json`

**Installers**

- `bin/install.js` → `~/.claude`: backup-related code found (heuristic)
- `src/hooks/install.ps1` → `~/.claude`: backup-related code found (heuristic)
- `src/hooks/install.sh` → `~/.claude`: backup-related code found (heuristic)
- `src/hooks/install.sh` → `~/.claude/settings.json`: backup-related code found (heuristic)

## Network calls in hook code (automated grep)

All 2 hook command strings and 2 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

`src/hooks/install.sh` lines 166–167 copy `settings.json` to `settings.json.bak` if no backup exists yet. No network calls in the two hook scripts.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No hook fetches an unpinned package from a registry.
- No MCP servers.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

Nothing specific. The UserPromptSubmit hook runs on every message you send.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
