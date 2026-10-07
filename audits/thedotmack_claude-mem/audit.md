# thedotmack/claude-mem — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** c4bfa45 (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 97,002 stars · license Apache-2.0 · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

1,249 files listed · 3 plugins (2 with findings) · 15 hooks (0 with inline code) · 1 MCP server (0 not pinned) · 0 install-time npm scripts · 3 installer findings · 0 settings findings.

Two of its three plugins declare 15 hooks between them, on almost every event. The `cowork` plugin sends session data to an external service **once an API key is configured**: its README says hooks "stream raw fragments to cmem.ai", and that with no key "every hook is a silent no-op".

## What runs without asking

**By plugin** (2 of 3 plugins declare something)

| plugin | hooks | MCP servers | other |
|---|---|---|---|
| `claude-mem (plugin/)` | 8 | 1 | 0 |
| `claude-mem-cowork` | 7 | 0 | 0 |

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `PostToolUse` | `* (all)` | 2 | 0 |
| `SessionEnd` | `* (all)` | 2 | 0 |
| `SessionStart` | `startup\|resume\|clear\|compact` | 2 | 0 |
| `Stop` | `* (all)` | 2 | 0 |
| `UserPromptSubmit` | `* (all)` | 2 | 0 |
| `PreToolUse` | `Read` | 1 | 0 |
| `PreToolUse` | `Task\|Agent` | 1 | 0 |
| `SessionStart` | `* (all)` | 1 | 0 |
| `Setup` | `* (all)` | 1 | 0 |
| `SubagentStop` | `* (all)` | 1 | 0 |

Files: `cowork/hooks/hooks.json`, `plugin/hooks/hooks.json`

**MCP servers**

- [`claude-mem (plugin/)`] `mcp-search`: `node -e const f=require('fs'),p=require('path'),o=require('os'),c=require('child_process');const h=o.homedir();const C=…` (`plugin/.mcp.json`)

**Installers**

- `openclaw/install.sh` → `~/.claude`: **no backup code found** (heuristic)
- `openclaw/install.sh` → `~/.claude/plugins`: **no backup code found** (heuristic)
- `plugin/skills/mode-creator/scripts/install-mode.mjs` → `~/.claude`: backup-related code found (heuristic)

## Network calls in hook code (automated grep)

All 15 hook command strings and 4 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

- `cowork/scripts/cmem-hook.mjs:174` — `const res = await fetch(url, {`
- `plugin/scripts/worker-service.cjs:(minified)` — `15 lines match in a bundled/minified file; read the source instead`

## Checked by hand

`cowork/scripts/cmem-hook.mjs` posts to `${apiBase}/api/hooks/ingest` with a Bearer API key; `apiBase` defaults to `https://cmem.ai` (line 52). The script strips private tags and runs `redactSecrets` before sending. `plugin/scripts/worker-service.cjs` is a bundled file and was not read line by line. `openclaw/install.sh` writes into `~/.claude/plugins` with no backup code (heuristic).

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- Every MCP server is pinned, local, or remote by URL.
- No hook fetches an unpinned package from a registry.
- No language servers or background monitors.

## Is it documented?

Yes: the cowork README describes what each hook sends and when.

## Recommendations for users

1. With an API key, the cowork plugin streams "raw fragments" of your sessions (its README's words) to a third-party service. That is its purpose; decide knowingly.
2. The local plugin keeps its settings in `~/.claude-mem/settings.json` (README).

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
