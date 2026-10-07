# nextlevelbuilder/ui-ux-pro-max-skill @ dcc40ff — what runs without asking

680 files listed. 4 findings: 1 high, 3 attention, 0 info.

## Permissions and approvals granted by project settings

- **HIGH** [project settings] setting `enableAllProjectMcpServers:true`  
  `stack/.claude/settings.json` — Approves every server in project .mcp.json files without a prompt.

## MCP servers started or contacted

- **ATTENTION** `playwright`: `npx -y @playwright/mcp@latest` (version not pinned)  
  `stack/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** `chrome-devtools`: `npx -y chrome-devtools-mcp@latest` (version not pinned)  
  `stack/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.
- **ATTENTION** `shadcn`: `npx -y shadcn@latest mcp` (version not pinned)  
  `stack/.mcp.json` — Fetched from a registry with no version: every future release runs without review. Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

