# gsd-build/get-shit-done — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** bdcaab2 (2026-05-31) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 64,370 stars · license MIT · last push 2026-05-31 (GitHub API, 2026-10-06)

## Summary

1,854 files listed · no plugin manifest · 0 hooks · 0 MCP servers · 0 install-time npm scripts · 3 installer findings · 0 settings findings.

No hooks, no MCP servers. Two install scripts write into `~/.claude`. `bin/install.js` contains backup-related code; `get-shit-done/bin/lib/install-profiles.cjs`, which writes into `~/.claude` and `~/.claude/skills`, has none (heuristic). Whether the backup in `bin/install.js` covers the writes in `install-profiles.cjs` was not checked.

## What runs without asking

**Installers**

- `bin/install.js` → `~/.claude`: backup-related code found (heuristic)
- `get-shit-done/bin/lib/install-profiles.cjs` → `~/.claude`: **no backup code found** (heuristic)
- `get-shit-done/bin/lib/install-profiles.cjs` → `~/.claude/skills`: **no backup code found** (heuristic)

## Network calls in hook code (automated grep)

No hooks, nothing to check.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No MCP servers.
- No language servers or background monitors.
- No hooks.

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

Back up `~/.claude/skills` before installing if you keep skills whose names could collide.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
