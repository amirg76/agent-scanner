# SuperClaude-Org/SuperClaude_Framework — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 2d0fda0 (2026-09-15) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 23,909 stars · license MIT · last push 2026-09-27 (GitHub API, 2026-10-06)

## Summary

409 files listed · 1 plugin · 4 hooks (0 with inline code) · 2 MCP servers (2 not pinned) · 1 install-time npm script · 3 installer findings · 0 settings findings.

`npm install` runs `bin/install.js` automatically (postinstall). The `superclaude` plugin adds three hooks (session start, stop, after edits) and two MCP servers fetched through `npx -y` without a pinned version. A fourth hook file, `src/superclaude/hooks/hooks.json`, is part of the Python package source, not the plugin. `src/superclaude/cli/install_skill.py` writes into `~/.claude/skills` with no backup code (heuristic).

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `SessionStart` | `* (all)` | 2 | 0 |
| `PostToolUse` | `Write\|Edit` | 1 | 0 |
| `Stop` | `* (all)` | 1 | 0 |

Files: `plugins/superclaude/hooks/hooks.json`, `src/superclaude/hooks/hooks.json`

**MCP servers**

- [`superclaude`] `context7`: `npx -y @upstash/context7-mcp@latest` — **not pinned** (`plugins/superclaude/.mcp.json`)
- [`superclaude`] `sequential-thinking`: `npx -y @modelcontextprotocol/server-sequential-thinking` — **not pinned** (`plugins/superclaude/.mcp.json`)

**npm install-time scripts**

- `postinstall`: `node ./bin/install.js` (`package.json`)

**Installers**

- `install.sh` → `~/.claude`: writes not traced, backup not confirmed
- `src/superclaude/cli/install_commands.py` → `~/.claude`: writes not traced, backup not confirmed
- `src/superclaude/cli/install_skill.py` → `~/.claude/skills`: **no backup code found** (heuristic)

## Network calls in hook code (automated grep)

All 4 hook command strings and 2 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

- `install.sh` runs `uv pip install -e ".[dev]"` and then `superclaude install`.
- `src/superclaude/cli/install_commands.py` copies commands into its own subfolder, `~/.claude/commands/sc/`, and skips files that already exist unless `--force` is given (lines 50–57): by default it does not overwrite.
- `install_skill.py` was not traced beyond the scanner's heuristic.

## What is fine

- No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.
- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No hook fetches an unpinned package from a registry.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

1. Installing the npm package runs its installer.
2. Back up `~/.claude/skills` before installing skills.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
