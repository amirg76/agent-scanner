# msitarzewski/agency-agents — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 053ddbb (2026-09-21) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 157,665 stars · license MIT · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

362 files listed · no plugin manifest · 0 hooks · 0 MCP servers · 0 install-time npm scripts · 2 installer findings · 0 settings findings.

Agent definitions plus an install script. Nothing runs inside the agent session. `scripts/install.sh` copies agents into `~/.claude/agents`.

## What runs without asking

**Installers**

- `scripts/install.sh` → `~/.claude`: backup-related code found (heuristic)
- `scripts/install.sh` → `~/.claude/agents`: backup-related code found (heuristic)

## Network calls in hook code (automated grep)

No hooks, nothing to check.

## Checked by hand

The backup code in `scripts/install.sh` that was read (lines 1081–1087) covers a Hermes plugin config file. Whether same-named agent files in `~/.claude/agents` are backed up was not traced.

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

If you keep your own agents in `~/.claude/agents`, back up that folder before running the installer.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
