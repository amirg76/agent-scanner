# ruvnet/ruflo — what runs without asking

**Status:** reviewed by hand; a snapshot at the commit shown. The owner was notified on 2026-10-07 (https://github.com/ruvnet/ruflo/issues/3888); corrections are welcome as an issue.
**Commit:** 0a96fb8 (2026-09-23) · **Scanner:** 4d67412 · **Reviewed:** 2026-10-06
**Repo:** 73,999 stars · license MIT · last push 2026-10-06 (GitHub API, 2026-10-06)

## Summary

5,775 files listed · 44 plugins (4 with findings) · 54 hooks (10 with inline code) · 4 MCP servers (3 not pinned) · 4 install-time npm scripts · 4 installer findings · 6 settings findings.

54 hooks, in three groups. 24 are in the hook files of three plugins (`plugin/`, `plugins/ruflo-core/`, `plugins/ruflo-cost-tracker/`). 23 are in two project settings files (`.claude/settings.json`, `v3/@claude-flow/mcp/.claude/settings.json`) that apply only when those folders are opened as projects. 7 are in `.claude-plugin/hooks/hooks.json`, which the root manifest does not reference. Two different plugins are both named `claude-flow` (the repo root and `plugin/`); the root one declares three MCP servers fetched through `npx` without a pinned version. `.claude-plugin/scripts/install.sh` writes into `~/.claude` with no backup code (heuristic).

## What runs without asking

**By plugin** (4 of 44 plugins declare something)

| plugin | hooks | MCP servers | other |
|---|---|---|---|
| `claude-flow (plugin/)` | 16 | 0 | 0 |
| `ruflo-core` | 7 | 1 | 0 |
| `claude-flow (repo root)` | 0 | 3 | 0 |
| `ruflo-cost-tracker` | 1 | 0 | 0 |

**Project settings files** (2 files, 29 findings): these apply when that folder is opened as a project, not when a plugin is installed. `.claude/settings.json`, `v3/@claude-flow/mcp/.claude/settings.json`

**Hooks**

| event | matcher | count | inline code |
|---|---|---|---|
| `Stop` | `* (all)` | 6 | 2 |
| `SessionStart` | `* (all)` | 5 | 0 |
| `PreCompact` | `auto` | 4 | 2 |
| `PreCompact` | `manual` | 4 | 2 |
| `PostToolUse` | `Write\|Edit\|MultiEdit` | 3 | 1 |
| `PreToolUse` | `Bash` | 3 | 1 |
| `UserPromptSubmit` | `* (all)` | 3 | 0 |
| `Notification` | `* (all)` | 2 | 0 |
| `PostToolUse` | `^(Write\|Edit\|MultiEdit)$` | 2 | 0 |
| `PostToolUse` | `^Bash$` | 2 | 0 |
| `PostToolUse` | `^Task$` | 2 | 0 |
| `PostToolUse` | `Bash` | 2 | 1 |
| `PreToolUse` | `^(Write\|Edit\|MultiEdit)$` | 2 | 0 |
| `PreToolUse` | `^Bash$` | 2 | 0 |
| `PreToolUse` | `^Task$` | 2 | 0 |
| `PreToolUse` | `Write\|Edit\|MultiEdit` | 2 | 1 |
| `SubagentStop` | `* (all)` | 2 | 0 |
| `PermissionRequest` | `^mcp__claude-flow__.*$` | 1 | 0 |
| `PostToolUse` | `^(Grep\|Glob\|Read)$` | 1 | 0 |
| `PostToolUse` | `^mcp__claude-flow__.*$` | 1 | 0 |
| `PreToolUse` | `^(Grep\|Glob\|Read)$` | 1 | 0 |
| `PreToolUse` | `^mcp__claude-flow__.*$` | 1 | 0 |
| `SessionEnd` | `* (all)` | 1 | 0 |

Files: `.claude-plugin/hooks/hooks.json`, `.claude/settings.json`, `plugin/hooks/hooks.json`, `plugins/ruflo-core/hooks/hooks.json`, `plugins/ruflo-cost-tracker/hooks/hooks.json`, `v3/@claude-flow/mcp/.claude/settings.json`

**Hooks that run a registry package** (10; 10 not pinned)

- `@claude-flow/cli@latest` × 10 — **dist-tag**: resolved from the registry on each run

**MCP servers**

- [`claude-flow (repo root)`] `claude-flow`: `npx claude-flow@alpha mcp start` — **not pinned** (`.claude-plugin/plugin.json`)
- [`claude-flow (repo root)`] `ruv-swarm`: `npx ruv-swarm mcp start` — **not pinned** (`.claude-plugin/plugin.json`)
- [`claude-flow (repo root)`] `flow-nexus`: `npx flow-nexus@latest mcp start` — **not pinned** (`.claude-plugin/plugin.json`)
- [`ruflo-core`] `ruflo`: `node ${CLAUDE_PLUGIN_ROOT}/scripts/mcp-launch.cjs` (`plugins/ruflo-core/.mcp.json`)

**npm install-time scripts**

- `prepare`: `husky` (`ruflo/src/ruvocal/package.json`)
- `postinstall`: `node -e "const{execSync}=require('child_process');try{execSync('agent-browser --version',{stdio:'ignore'});}catch{conso…` (`v3/@claude-flow/browser/package.json`)
- `postinstall`: `node ./scripts/postinstall.cjs` (`v3/@claude-flow/cli/package.json`)
- `prepare`: `npm run build` (`v3/@claude-flow/security/package.json`)

**Installers**

- `.claude-plugin/scripts/install.sh` → `~/.claude`: **no backup code found** (heuristic)
- `.claude-plugin/scripts/install.sh` → `~/.claude/agents`: **no backup code found** (heuristic)
- `.claude-plugin/scripts/install.sh` → `~/.claude/commands`: **no backup code found** (heuristic)
- `.claude-plugin/scripts/install.sh` → `~/.claude/settings.json`: **no backup code found** (heuristic)

**Project settings**

- **attention** setting `enabledMcpjsonServers:claude-flow` (`.claude/settings.json`)
- **attention** `statusLine` runs `sh -c 'exec node "${CLAUDE_PROJECT_DIR:-.}/.claude/helpers/statusline.cjs"'` (`.claude/settings.json`)
- **attention** `statusLine` runs `npx @claude-flow/cli@latest hooks statusline 2>/dev/null || node .claude/helpers/statusline.cjs 2>/dev/null || echo "▊ …` (`v3/@claude-flow/mcp/.claude/settings.json`)
- **info** env `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` (`.claude/settings.json`)
- **info** env `CLAUDE_FLOW_V3_ENABLED` (`.claude/settings.json`)
- **info** env `CLAUDE_FLOW_HOOKS_ENABLED` (`.claude/settings.json`)

## Network calls in hook code (automated grep)

All 54 hook command strings and 4 script files they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.

No matches.

## Not read by the scanner

The scanner lists 131 items as not checked; anything declared in them is not in the counts above.

- `v3/@claude-flow/cli/.claude/agents/analysis/analyze-code-quality.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/analysis/code-analyzer.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/analysis/code-review/analyze-code-quality.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/architecture/arch-system-design.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/architecture/system-design/arch-system-design.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/byzantine-coordinator.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/crdt-synchronizer.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/gossip-coordinator.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/performance-benchmarker.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/quorum-manager.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/raft-manager.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/consensus/security-manager.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/core/planner.md` — hooks entries not in the documented shape (keys: pre, post); not interpreted
- `v3/@claude-flow/cli/.claude/agents/data/data-ml-model.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/data/ml/data-ml-model.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/development/backend/dev-backend-api.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/development/dev-backend-api.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/devops/ci-cd/ops-cicd-github.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/devops/ops-cicd-github.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- `v3/@claude-flow/cli/.claude/agents/documentation/api-docs/docs-api-openapi.md` — hooks entries not in the documented shape (keys: pre\_execution, post\_execution, on\_error); not interpreted
- … 111 more (see `scan.json`)

`v3/@claude-flow/cli/.claude/settings.json` is not valid JSON: its command strings contain unescaped quotes (the first on line 14, where parsing stops). Read as text, it declares 8 hooks on seven events (PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, SessionEnd, SubagentStart, Stop), a status-line command, three `env` variables and four `permissions.allow` rules, one of them `Bash(node .claude/*)`. None of these are in the counts; Claude Code would probably fail to read the file as well [assessment]. The other 130 files are agent definitions whose `hooks:` blocks use keys from ruflo's own format (`pre`, `post`, `pre_execution`, `post_execution`, `on_error` and a few others), not Claude Code event names, so nothing in them is counted as a hook.

## Checked by hand

- The 10 hooks that run `npx @claude-flow/cli@latest` are all in `v3/@claude-flow/mcp/.claude/settings.json`.
- `.claude-plugin/plugin.json` has no `hooks` field, and the Claude Code plugins reference gives `hooks/hooks.json` as the default location, so the 7 hooks in `.claude-plugin/hooks/hooks.json` are probably not loaded by the plugin [assessment, not tested].
- `v3/@claude-flow/browser/package.json` has a postinstall that, only if `agent-browser` is not already installed, runs `npm install -g agent-browser@latest`.
- Both project settings files configure a status-line command.

## What is fine

- No project settings that redirect API traffic.
- No language servers or background monitors.
- No network calls found in the code the hooks run (automated grep).

## Is it documented?

**Not checked in this pass.**

## Recommendations for users

1. Back up `~/.claude/settings.json`, `agents/` and `commands/` before running `.claude-plugin/scripts/install.sh`.
2. The `@alpha` and `@latest` MCP servers resolve a new release on each start; pin them if you need repeatable behaviour.
3. Installing `@claude-flow/browser` from npm may install `agent-browser@latest` globally.

## Limits

- Static reading of declared configuration; nothing was installed or run.
- Network grep covers one level of scripts referenced by hooks, not code those scripts import.
- Skill and agent text were not checked for prompt injection.
- Plugins hosted in other repos and referenced from a marketplace file were not fetched.
