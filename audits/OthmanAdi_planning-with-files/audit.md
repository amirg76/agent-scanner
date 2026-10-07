# OthmanAdi/planning-with-files — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 3b7690e (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 27,308 stars · license MIT · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

732 files listed · 1 plugin · 76 hooks (0 with inline code) · 0 MCP servers · 0 install-time npm scripts · 0 installer findings · 0 settings findings.

76 hooks, each running one of two scripts (`hooks/claude-hook.sh` or `skill-hook.sh`). 6 are in the plugin's `hooks/hooks.json` and 5 in its skill (`skills/planning-with-files/SKILL.md`); the other 65 are in 13 copies of the same skill: 8 in folders for other agent tools (`.cursor/`, `.codex/` and others) and 5 translated variants under `skills/i18n/`. No MCP servers, no install scripts.

## What runs without asking

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `PostToolUse` | `Write\|Edit` | 15 | 0 |
| `PreCompact` | `* (all)` | 15 | 0 |
| `PreToolUse` | `Write\|Edit\|Bash\|Read\|Glob\|Grep` | 15 | 0 |
| `Stop` | `* (all)` | 15 | 0 |
| `UserPromptSubmit` | `* (all)` | 15 | 0 |
| `SessionStart` | `startup\|resume\|clear\|compact` | 1 | 0 |

Files: `.agents/skills/planning-with-files/SKILL.md`, `.codebuddy/skills/planning-with-files/SKILL.md`, `.codex/skills/planning-with-files/SKILL.md`, `.cursor/skills/planning-with-files/SKILL.md`, `.factory/skills/planning-with-files/SKILL.md`, `.mastracode/skills/planning-with-files/SKILL.md`, `.opencode/skills/planning-with-files/SKILL.md`, `.pi/skills/planning-with-files/SKILL.md`, `hooks/hooks.json`, `skills/i18n/planning-with-files-ar/SKILL.md`, `skills/i18n/planning-with-files-de/SKILL.md`, `skills/i18n/planning-with-files-es/SKILL.md`, `skills/i18n/planning-with-files-zh/SKILL.md`, `skills/i18n/planning-with-files-zht/SKILL.md`, `skills/planning-with-files/SKILL.md`

## Network calls in hook code (automated grep)

All 76 hook command strings and 12 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Checked by hand

Each hook command in `skills/planning-with-files/SKILL.md` starts with `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0`, so when the skill runs as part of the installed plugin its hooks exit at once and the plugin's `hooks/hooks.json` does the work [assessment from reading that file; the copies were not read one by one].

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

Nothing specific. The hooks run on most actions, so read `hooks/claude-hook.sh` once.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
