# K-Dense-AI/scientific-agent-skills — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 49c6e97 (2026-09-21) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 47,775 stars · license MIT · last push 2026-10-05 (GitHub API, 2026-10-06)

## Summary

2,484 files listed · no plugin manifest · 0 hooks · 0 MCP servers · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

**Nothing in this repo is declared to run on its own.**

A collection of skills and instructions. Nothing is declared to run on its own: no hooks, no MCP servers, no install scripts.

## What runs without asking

Nothing.

## Network calls in hook code (automated grep)

No hooks, nothing to check.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- No MCP servers.
- No language servers or background monitors.
- No hooks.

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

Nothing specific to this check. Skill text was not reviewed for prompt injection.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
