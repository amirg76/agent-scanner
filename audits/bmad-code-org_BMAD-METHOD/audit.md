# bmad-code-org/BMAD-METHOD — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 1b59caa (2026-09-22) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 53,850 stars · license NOASSERTION · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

654 files listed · no plugin manifest · 0 hooks · 0 MCP servers · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

**Nothing in this repo is declared to run on its own.**

Nothing is declared to run on its own: no hooks, no MCP servers, no npm install-time scripts, and no install script named install*/setup* that writes into `~/.claude`.

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

Nothing specific to this check. How its CLI installer writes into a project folder was not reviewed.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
