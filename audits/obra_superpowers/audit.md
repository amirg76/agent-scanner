# obra/superpowers — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 5bf4e78 (2026-09-18) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 295,929 stars · license MIT · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

231 files listed · 1 plugin · 1 hook (0 with inline code) · 0 MCP servers · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

One hook, at session start (matcher `startup|clear|compact`). Nothing else runs on its own.

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `SessionStart` | `startup\|clear\|compact` | 1 | 0 |

Files: `hooks/hooks.json`

## Network calls in hook code (automated grep)

All 1 hook command string and 1 script file they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

`hooks/run-hook.cmd` is a wrapper that works as both a Windows batch file and a shell script; on Windows it looks for Git Bash in standard locations and runs `hooks/session-start`. That script contains no network calls (one GitHub URL appears in a comment).

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- No hook fetches an unpinned package from a registry.
- No MCP servers.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

Nothing specific. Read `hooks/session-start` once if you want to know what it adds to each session.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
