# Finding kinds and levels

## Levels

- **high**: approves in advance: commands or servers run without a per-action prompt once the project
  is trusted. (Project allow rules apply only after the user accepts the workspace trust dialog, which
  lists them. `claude -p` and SDK sessions never show that dialog, and there project allow rules are not
  used; see [When project content applies](#when-project-content-applies).)
- **attention**: runs automatically. Often legitimate and common, but worth knowing before you install.
- **info**: listed for completeness; low risk.

A level describes what is **declared**, not intent. `high` does not mean malicious.

## When project content applies

The permissions documentation ("What runs before you trust a folder") lists what a repository's own
settings do in a folder the user has not trusted: one where only a parent folder was trusted, or a
`claude -p` or SDK run, which never shows the trust dialog.

- **Used even there:** hooks in settings files, the `env` block, helper commands such as
  `apiKeyHelper`, and a project skill's hooks.
- **Not used until the folder is trusted:** `permissions.allow` rules (not used at all in `claude -p`),
  a project subagent's frontmatter hooks, and an MCP server's `headersHelper`.
- **`.mcp.json` servers:** asked about with only a parent trusted; connected without asking in
  `claude -p`, approved or not.

The scanner reports the declaration in every case; which of these situations applies depends on how the
folder is opened.

## Where a finding applies

- `[plugin-name]`: the file is one of that plugin's components (at the plugin root, or named in its
  manifest). It applies when the plugin is installed.
- `[project settings]`: the file is `.claude/settings.json` or `.claude/settings.local.json`. It applies
  when that folder is opened as a project in Claude Code.
- No label: a file elsewhere in the repo, such as a template project or a sub-package. It applies only
  when that part of the repo is used on its own.

## hook

A command Claude Code runs on its own when an event fires.

- Always **attention**.
- `SessionStart` runs when every session starts, before the user types anything.
- `UserPromptSubmit` runs on every prompt and can add text to it.
- A matcher of `*`, `.*` or none means every tool.
- `inlineCode: true`: the code is in the command string (`node -e`, `python -c`, `bash -c`,
  `pwsh -Command`, `ruby -e`, `perl -e`, `php -r`), not in a separate file. Reviewers must read
  `hooks.json` itself.
- `package` / `pinned`: the hook runs a registry package. With a dist-tag (`@latest`) the registry is
  resolved on every run; with no version, a local install is used if present, otherwise the current
  release is fetched.
- `frontmatter: skill | subagent | markdown`: declared in the frontmatter of a skill, a subagent (any file
  under an `agents/` folder), or other Markdown. Per the hooks documentation, a skill's hooks are
  registered when the skill is invoked and keep running for the rest of the session; a subagent's run only
  while it runs, and its `Stop` is run as `SubagentStop` (reported that way, with `declaredEvent: Stop`).
- `condition`: the hook's `if` field, a permission-rule pattern. Evaluated only on tool events; on other
  events the documentation says the hook never runs, and the finding says so.
- `once: true`: removed after its first successful run; honoured only in skill frontmatter.
- Why it matters: hooks in project files ran before the user accepted the project in an issue fixed in
  Claude Code (advisory GHSA-ph6w-f82w-28w6, reported by Check Point Research).

## settings-command

A setting whose value is a command Claude Code runs: `apiKeyHelper`, `awsAuthRefresh`,
`awsCredentialExport`, `otelHeadersHelper`, `statusLine`, `fileSuggestion`, `policyHelper`,
`processWrapper` (Claude Code settings reference), and an MCP server's `headersHelper`, which "Claude Code
runs … and merges its output into the connection headers" (MCP documentation).

- **attention**.
- The documented scope of some of these keys may keep them from applying in project settings; the
  scanner reports the declaration and does not model scope.

## permission

A rule or setting in project settings that approves in advance.

- **high**: `Bash`, `Bash(*)`, `Bash(:*)`, `PowerShell`, or a shell with any arguments
  (`Bash(bash:*)`, `Bash(sh -c:*)`). Claude Code's permissions documentation: "To match all uses of a
  tool, use only the tool name without parentheses", and "`Bash(*)` is equivalent to `Bash`".
- **high**: `defaultMode: bypassPermissions`, which turns off permission prompts.
- **high**: `enableAllProjectMcpServers: true`, which approves every server in the project's `.mcp.json`
  without a prompt. **attention**: `enabledMcpjsonServers`, which approves named servers. These settings
  were part of CVE-2025-59536, in which such servers could start before the user accepted the project;
  fixed in Claude Code.
- Narrow rules (`Bash(npm test)`) and read-only tools are **not** reported.
- Deny rules narrow a broad allow but do not close it: the same documentation states that a deny rule
  "doesn't match the same program by path or inside `sh -c`".

## env

An environment variable set by project settings.

- **high**: a name containing `BASE_URL`, `PROXY` or `ENDPOINT`, which decides where the agent sends its
  API traffic. A malicious `ANTHROPIC_BASE_URL` in project settings was CVE-2026-21852 (API key
  exfiltration before the trust dialog); fixed in Claude Code.
- **info**: anything else.

## mcp

An MCP server that a project or plugin declares.

- **attention**: `npx`, `bunx`, `pnpx`, `uvx`, `pnpm dlx` or `docker run` **with no version pin**. Every future
  release runs without review. The first documented malicious MCP server (postmark-mcp, September 2025)
  added its behaviour in a later release.
- **info**: pinned, local, or remote by URL.
- When a local server starts (MCP documentation): a plugin's servers when the plugin is enabled; a
  project's `.mcp.json` servers after the user approves them in an interactive session, and without a
  prompt in `claude -p`, Agent SDK and cloud sessions.
- Pinning: `pkg@1.2.3` yes · `pkg@latest` / `pkg` no · `image:1.4` or `@sha256:` yes ·
  `tool==2.0.1` yes · `git+https://…@v1.2` yes, a git URL without a ref no.

## Marketplace entries

A plugin marketplace lists plugins in `.claude-plugin/marketplace.json`. Per the marketplace reference, an
entry "accepts every plugin.json field", and for a plugin without its own `plugin.json` "the entry is the
manifest". The scanner reads, in each entry:

- inline `hooks` (only the inline object form runs), `mcpServers`, `lspServers` and monitors, reported
  like the same fields in `plugin.json`, with the entry's name;
- a `command` source, which Claude Code runs on the installing user's machine at install and once per
  session, and a `headersHelper`: both **settings-command**, **attention**;
- where the plugin is. An entry whose source is a folder here is a plugin, with or without its own
  `plugin.json`, and what the entry declares belongs to it. Entries that share a folder are separate
  plugins: a component file in that folder belongs to each of them (`sharedBy`), whatever their order.
  Two entries with the same name and folder are numbered. Entries hosted elsewhere, and entries produced by a `command` source, are counted under "Not
  checked"; a relative source inside `node_modules`, outside the folder, missing, or of an undocumented
  shape is listed there too.

## lsp and monitor

Plugin components that start a process on their own (plugin manifest reference): language servers in
`.lsp.json`, and background monitors in `monitors/monitors.json`. A monitor's command runs "as a
persistent background process"; by default it "starts at session start and on plugin reload", or the
first time a named skill runs, and "Monitors run only in interactive sessions". Both can also be
declared in `plugin.json` (`lspServers`, `experimental.monitors`), inline or by path; both forms are read.

- **attention**.
- Any object with a `command` in those files is reported; the scanner does not depend on their schema.

## lifecycle

A `package.json` script that runs on `npm install` without being called by name.

- **attention**: `preinstall`, `install`, `postinstall`, `prepare`.
- `build`, `test` and others are not reported.
- Why it matters: the s1ngularity attack on the Nx package (August 2025) used a postinstall script to
  run AI coding CLIs with permission-bypass flags.

## installer

A script that writes into the agent's configuration folder (`~/.claude`).

- **attention**: no backup-related code found (heuristic). Existing files with the same name are likely
  replaced.
- **attention**, `traced: false`: the script names `~/.claude` but writes in another file; the scanner
  could not confirm either way. Check by hand.
- **info**: backup-related code found (heuristic).
- Why it matters: in the ECC audit, the installer's `copyFileSync` replaces a user's skill that has the
  same name as one of ECC's, with no backup.

## Sources

- Claude Code permissions: https://code.claude.com/docs/en/permissions
- Claude Code settings reference: https://code.claude.com/docs/en/settings-reference
- Claude Code plugins reference: https://code.claude.com/docs/en/plugins-reference
- Claude Code hooks (skills and subagents): https://code.claude.com/docs/en/hooks
- Claude Code MCP: https://code.claude.com/docs/en/mcp
- CVE-2025-59536, CVE-2026-21852, GHSA-ph6w-f82w-28w6 (Check Point Research):
  https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/
- postmark-mcp: https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html
- Nx / s1ngularity: https://nx.dev/blog/s1ngularity-postmortem
