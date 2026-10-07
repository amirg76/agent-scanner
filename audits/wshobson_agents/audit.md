# wshobson/agents — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 4236bb9 (2026-09-13) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 40,246 stars · license MIT · last push 2026-10-05 (GitHub API, 2026-10-06)

## Summary

1,175 files listed · 92 plugins (2 with findings) · 4 hooks (0 with inline code) · 0 MCP servers · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

92 plugins in this repository (the marketplace lists 2 more, hosted elsewhere and not scanned). 90 declare nothing that runs on its own. Two (`protect-mcp`, `review-agent-governance`) register PreToolUse and PostToolUse hooks on every tool, running `hooks/evaluate.sh` and `hooks/sign.sh`.

## What runs without asking

**By plugin** (2 of 92 plugins declare something)

| plugin | hooks | MCP servers | other |
|---|---|---|---|
| `protect-mcp` | 2 | 0 | 0 |
| `review-agent-governance` | 2 | 0 | 0 |

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `PostToolUse` | `* (all)` | 2 | 0 |
| `PreToolUse` | `* (all)` | 2 | 0 |

Files: `plugins/protect-mcp/hooks/hooks.json`, `plugins/review-agent-governance/hooks/hooks.json`

## Network calls in hook code (automated grep)

All 4 hook command strings and 4 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Not read by the scanner

The scanner lists 1 item as not checked; anything declared there is not in the counts above.

- `.claude-plugin/marketplace.json` — 2 entries are hosted elsewhere; not fetched

Two marketplace entries are hosted in other repositories and were not fetched: `pensyve` (no pinned commit) and `hol-guard` (pinned to a commit). Nothing they declare is in this audit.

## Checked by hand

The scripts these hooks run were not read in this pass; only the automated network search in the section above ran on them.

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

Only the two plugins above add automatic behaviour. Read their two scripts before enabling them.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
