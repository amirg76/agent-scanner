# nextlevelbuilder/ui-ux-pro-max-skill — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** dcc40ff (2026-09-21) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 133,544 stars · license MIT · last push 2026-10-03 (GitHub API, 2026-10-06)

## Summary

680 files listed · 1 plugin · 0 hooks · 3 MCP servers (3 not pinned) · 0 install-time npm scripts · 0 installer findings · 1 settings finding.

The skill itself declares nothing that runs on its own. The repo also contains `stack/`, a separate template project meant to be cloned and opened on its own. Its settings approve every project MCP server without a prompt (`enableAllProjectMcpServers: true`), and its `.mcp.json` fetches three servers at `@latest`. These apply when `stack/` is opened as a project, not when the skill is installed.

## What runs without asking

**Project settings files** (1 file, 1 finding): these apply when that folder is opened as a project, not when a plugin is installed. `stack/.claude/settings.json`

**MCP servers**

- `playwright`: `npx -y @playwright/mcp@latest` — **not pinned** (`stack/.mcp.json`)
- `chrome-devtools`: `npx -y chrome-devtools-mcp@latest` — **not pinned** (`stack/.mcp.json`)
- `shadcn`: `npx -y shadcn@latest mcp` — **not pinned** (`stack/.mcp.json`)

**Project settings**

- **high** setting `enableAllProjectMcpServers:true` (`stack/.claude/settings.json`)

## Network calls in hook code (automated grep)

No hooks, nothing to check.

## Checked by hand

`stack/README.md` calls it "a ready-to-clone Claude Code project" and says "the MCP servers and CLAUDE.md workflow load automatically". `enableAllProjectMcpServers` was part of CVE-2025-59536, in which such servers could start before the user accepted the project; Claude Code has since fixed that (Check Point Research).

## What is fine

- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- No language servers or background monitors.
- No hooks.

## Is it documented?

Yes, for `stack/`: its README says the MCP servers load automatically.

## Recommendations for users

1. If you clone `stack/`, it approves all of its MCP servers up front. Remove `enableAllProjectMcpServers` from `stack/.claude/settings.json` to be asked per server.
2. Consider pinning the three `@latest` servers in `stack/.mcp.json`.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
