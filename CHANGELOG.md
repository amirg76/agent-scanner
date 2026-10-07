# Changelog

## 0.1.0 — 2026-10-06

First public version.

- Scanner for Claude Code hooks (plugin `hooks/hooks.json`, project settings, paths referenced from
  `plugin.json`, and skill and subagent frontmatter), commands configured in project settings
  (`statusLine`, `apiKeyHelper` and others) and on MCP servers (`headersHelper`),
  permission rules and MCP pre-approvals, environment variables, MCP servers and version pinning,
  plugin language servers and monitors, npm install-time scripts, and installers that write into
  `~/.claude`.
- `diff` mode: what was added, changed or removed between two versions.
- Markdown and JSON output; exit code on a threshold; exit `3` when a file that could declare
  something was not read or not interpreted.
- Diff: "no longer checked" when the new version of a file could not be read; `if` and `once` compared.
- Audits of 20 Claude Code extension repositories under `audits/`.
- Hook handler fields `if` and `once`; a subagent's `Stop` reported as `SubagentStop`. Files the
  scanner could not read or interpret are listed, never dropped silently.
- `marketplace.json`: inline components, `command` sources and `headersHelper` in entries are read;
  entries hosted elsewhere and unreadable relative sources are listed as not checked.
- No detector stops early: the language-server and monitor detector had a silent limit of 200
  findings and 20 levels of nesting.
- File names matched without regard to case; a file named twice in one manifest field is read once;
  subagents in subfolders of `agents/` attributed to their plugin.
- `plugin.json`: inline objects in `hooks` / `mcpServers` arrays, and `lspServers` / `experimental.monitors`
  inline or by path, are read; MCP bundles are listed as not read.
- Hardened against hostile input: report text from scanned repos is escaped, terminal control
  sequences are removed, symlinks are not followed, and paths outside the scanned folder are refused.
  See `docs/ENGINEERING-NOTES.md` for the problems found and fixed before release.
