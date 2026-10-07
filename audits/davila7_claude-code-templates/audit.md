# davila7/claude-code-templates — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner has not been contacted yet; corrections are welcome as an issue.
**Commit:** 3c28e46 (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 32,424 stars · license MIT · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

9,574 files listed · 29 plugins (0 with findings) · 39 hooks (0 with inline code) · 54 MCP servers (4 not pinned) · 0 install-time npm scripts · 0 installer findings · 16 settings findings.

The 29 plugins in this repo declare nothing that runs on their own. The findings are in material its CLI copies into your project (`cli-tool/src/file-operations.js`, `copyTemplateFiles`). The JavaScript/TypeScript, Python and Ruby project templates pre-approve `Bash` — every shell command — and add hooks, one of which appends every Bash command to `~/.claude/bash-command-log.txt`. Four installable components (three skills and a subagent under `cli-tool/components/`) declare 8 more hooks in their frontmatter. The repo's own root `.mcp.json` declares two servers (`linear` through `npx -y mcp-remote`, `neon` over HTTPS) that apply when this repo is opened as a project.

## What runs without asking

**Project settings files** (3 files, 47 findings): these apply when that folder is opened as a project, not when a plugin is installed. `cli-tool/templates/javascript-typescript/.claude/settings.json`, `cli-tool/templates/python/.claude/settings.json`, `cli-tool/templates/ruby/.claude/settings.json`

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `PostToolUse` | `Write\|Edit\|MultiEdit` | 12 | 0 |
| `Stop` | `* (all)` | 8 | 0 |
| `PreToolUse` | `Write` | 6 | 0 |
| `PreToolUse` | `Bash` | 4 | 0 |
| `Notification` | `* (all)` | 3 | 0 |
| `PostToolUse` | `Bash` | 2 | 0 |
| `PostToolUse` | `Write\|Edit` | 1 | 0 |
| `PreToolUse` | `Write\|Edit\|Bash` | 1 | 0 |
| `PreToolUse` | `Write\|Edit\|MultiEdit` | 1 | 0 |
| `SessionStart` | `* (all)` | 1 | 0 |

Files: `cli-tool/components/agents/security/read-only-auditor.md`, `cli-tool/components/skills/development/gh-address-comments/SKILL.md`, `cli-tool/components/skills/development/git-commit-helper/SKILL.md`, `cli-tool/components/skills/productivity/planning-with-files/SKILL.md`, `cli-tool/templates/javascript-typescript/.claude/settings.json`, `cli-tool/templates/python/.claude/settings.json`, `cli-tool/templates/ruby/.claude/settings.json`

**Hooks that run a registry package** (5; 5 not pinned)

- `bundlesize` × 1 — no version: local install if present, else the current release
- `eslint` × 1 — no version: local install if present, else the current release
- `jest` × 1 — no version: local install if present, else the current release
- `prettier` × 1 — no version: local install if present, else the current release
- `tsc` × 1 — no version: local install if present, else the current release

**MCP servers**

- `linear`: `npx -y mcp-remote https://mcp.linear.app/mcp` — **not pinned** (`.mcp.json`)
- `neon`: remote `https://mcp.neon.tech/mcp` (`.mcp.json`)
- `memory-bank`: `server-memory` (`cli-tool/templates/common/.mcp.json`)
- `sequential-thinking`: `code-reasoning` (`cli-tool/templates/common/.mcp.json`)
- `brave-search`: `server-brave-search` (`cli-tool/templates/common/.mcp.json`)
- `google-maps`: `server-google-maps` (`cli-tool/templates/common/.mcp.json`)
- `deep-graph`: `mcp-code-graph` (`cli-tool/templates/common/.mcp.json`)
- `go-sdk`: `go-sdk-server` (`cli-tool/templates/go/.mcp.json`)
- `language-server`: `mcp-language-server` (`cli-tool/templates/go/.mcp.json`)
- `gin`: `gin-mcp` (`cli-tool/templates/go/.mcp.json`)
- `mysql`: `go-mcp-mysql` (`cli-tool/templates/go/.mcp.json`)
- `archer`: `go-archer` (`cli-tool/templates/go/.mcp.json`)
- `memory-bank`: `server-memory` (`cli-tool/templates/go/.mcp.json`)
- `sequential-thinking`: `code-reasoning` (`cli-tool/templates/go/.mcp.json`)
- `brave-search`: `server-brave-search` (`cli-tool/templates/go/.mcp.json`)
- `google-maps`: `server-google-maps` (`cli-tool/templates/go/.mcp.json`)
- `deep-graph`: `mcp-code-graph` (`cli-tool/templates/go/.mcp.json`)
- `typescript-sdk`: `node path/to/ts-sdk-server.js` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `github`: `node path/to/server-github` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `puppeteer`: `node path/to/server-puppeteer` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `slack`: `node path/to/server-slack` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `filesystem`: `node path/to/server-filesystem` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `memory-bank`: `server-memory` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `sequential-thinking`: `code-reasoning` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `brave-search`: `server-brave-search` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `google-maps`: `server-google-maps` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `deep-graph`: `mcp-code-graph` (`cli-tool/templates/javascript-typescript/.mcp.json`)
- `python-sdk`: `python -m python_sdk.server` (`cli-tool/templates/python/.mcp.json`)
- `docker`: `python -m mcp_server_docker` (`cli-tool/templates/python/.mcp.json`)
- `jupyter`: `python -m server_jupyter` (`cli-tool/templates/python/.mcp.json`)
- `postgresql`: `python -m server_postgres` (`cli-tool/templates/python/.mcp.json`)
- `opik`: `python -m opik_mcp` (`cli-tool/templates/python/.mcp.json`)
- `memory-bank`: `server-memory` (`cli-tool/templates/python/.mcp.json`)
- `sequential-thinking`: `code-reasoning` (`cli-tool/templates/python/.mcp.json`)
- `brave-search`: `server-brave-search` (`cli-tool/templates/python/.mcp.json`)
- `google-maps`: `server-google-maps` (`cli-tool/templates/python/.mcp.json`)
- `deep-graph`: `mcp-code-graph` (`cli-tool/templates/python/.mcp.json`)
- `github`: `npx -y @modelcontextprotocol/server-github` — **not pinned** (`cli-tool/templates/ruby/.mcp.json`)
- `postgres`: `npx -y @modelcontextprotocol/server-postgres` — **not pinned** (`cli-tool/templates/ruby/.mcp.json`)
- `brave-search`: `npx -y @modelcontextprotocol/server-brave-search` — **not pinned** (`cli-tool/templates/ruby/.mcp.json`)
- `ruby-docs`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'ruby_docs', description: 'Search Ruby d…` (`cli-tool/templates/ruby/.mcp.json`)
- `rails-docs`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'rails_docs', description: 'Search Rails…` (`cli-tool/templates/ruby/.mcp.json`)
- `rubygems`: `ruby -e require 'json'; require 'net/http'; puts JSON.generate({tools: [{name: 'gem_search', description: 'Search and e…` (`cli-tool/templates/ruby/.mcp.json`)
- `bundler`: `bundle exec ruby -e require 'json'; puts JSON.generate({tools: [{name: 'bundle_audit', description: 'Security audit for…` (`cli-tool/templates/ruby/.mcp.json`)
- `rust-sdk`: `rust_mcp_server` (`cli-tool/templates/rust/.mcp.json`)
- `ht-mcp`: `ht-mcp` (`cli-tool/templates/rust/.mcp.json`)
- `rust-docs`: `rust-docs-mcp-server` (`cli-tool/templates/rust/.mcp.json`)
- `substrate`: `substrate-mcp-rs` (`cli-tool/templates/rust/.mcp.json`)
- `mcp-proxy`: `mcp-proxy` (`cli-tool/templates/rust/.mcp.json`)
- `memory-bank`: `server-memory` (`cli-tool/templates/rust/.mcp.json`)
- `sequential-thinking`: `code-reasoning` (`cli-tool/templates/rust/.mcp.json`)
- `brave-search`: `server-brave-search` (`cli-tool/templates/rust/.mcp.json`)
- `google-maps`: `server-google-maps` (`cli-tool/templates/rust/.mcp.json`)
- `deep-graph`: `mcp-code-graph` (`cli-tool/templates/rust/.mcp.json`)

**Project settings**

- **high** allow `Bash` (`cli-tool/templates/javascript-typescript/.claude/settings.json`)
- **high** allow `Bash` (`cli-tool/templates/python/.claude/settings.json`)
- **high** allow `Bash` (`cli-tool/templates/ruby/.claude/settings.json`)
- **info** env `BASH_DEFAULT_TIMEOUT_MS` (`cli-tool/templates/javascript-typescript/.claude/settings.json`)
- **info** env `BASH_MAX_OUTPUT_LENGTH` (`cli-tool/templates/javascript-typescript/.claude/settings.json`)
- **info** env `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` (`cli-tool/templates/javascript-typescript/.claude/settings.json`)
- **info** env `NODE_ENV` (`cli-tool/templates/javascript-typescript/.claude/settings.json`)
- **info** env `BASH_DEFAULT_TIMEOUT_MS` (`cli-tool/templates/python/.claude/settings.json`)
- **info** env `BASH_MAX_OUTPUT_LENGTH` (`cli-tool/templates/python/.claude/settings.json`)
- **info** env `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` (`cli-tool/templates/python/.claude/settings.json`)
- **info** env `PYTHONPATH` (`cli-tool/templates/python/.claude/settings.json`)
- **info** env `BASH_DEFAULT_TIMEOUT_MS` (`cli-tool/templates/ruby/.claude/settings.json`)
- **info** env `BASH_MAX_OUTPUT_LENGTH` (`cli-tool/templates/ruby/.claude/settings.json`)
- **info** env `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` (`cli-tool/templates/ruby/.claude/settings.json`)
- **info** env `BUNDLE_PATH` (`cli-tool/templates/ruby/.claude/settings.json`)
- **info** env `BUNDLE_JOBS` (`cli-tool/templates/ruby/.claude/settings.json`)

## Network calls in hook code (automated grep)

All 39 hook command strings and 1 script file they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Not read by the scanner

The scanner lists 1 item as not checked; anything declared there is not in the counts above.

- `cli-tool/components/skills/ai-research/fine-tuning-unsloth/references/llms-full.md` — larger than 1 MB

The one skipped file, `cli-tool/components/skills/ai-research/fine-tuning-unsloth/references/llms-full.md`, is a reference document over 1 MB, not a skill or configuration file.

## Checked by hand

Claude Code documentation: "To match all uses of a tool, use only the tool name without parentheses", and "`Bash(*)` is equivalent to `Bash`". The templates also deny `Bash(curl:*)`, `Bash(wget:*)` and `Bash(rm -rf:*)`; the same documentation says a deny rule "doesn't match the same program by path or inside `sh -c`", so the list narrows the allowance but does not close it. Project allow rules apply once the user accepts the workspace trust dialog, which lists them. The command log is a plain file in your home folder and will contain any secret typed into a command.

## What is fine

- No project settings that configure a command (status line, credential helpers).
- No project settings that redirect API traffic.
- No npm lifecycle scripts.
- No installer that writes into `~/.claude`.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

1. After applying a template, replace the bare `Bash` allow in `.claude/settings.json` with the specific commands you want.
2. Decide whether you want `~/.claude/bash-command-log.txt`; remove that hook if not.
3. Read the frontmatter of any component you install from `cli-tool/components/`.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
