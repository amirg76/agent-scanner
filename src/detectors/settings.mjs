// Project settings that run commands or change what the agent may do without asking.
// Keys and their meaning follow the Claude Code settings reference
// (https://code.claude.com/docs/en/settings-reference).

const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);

// Settings whose value is a command Claude Code runs. Descriptions quoted or
// paraphrased from the settings reference. Whether a key is honoured in
// project settings depends on its documented scope; the declaration is reported.
const COMMAND_KEYS = {
  apiKeyHelper: 'Generates the API credential with a command.',
  awsAuthRefresh: 'Refreshes Bedrock credentials with a command.',
  awsCredentialExport: 'Supplies Bedrock credentials from a command.',
  otelHeadersHelper: 'Generates OpenTelemetry headers with a command.',
  statusLine: 'Runs a command to render the status line.',
  fileSuggestion: 'Runs a command to supply @ file autocomplete.',
  policyHelper: 'Runs an executable that computes managed settings.',
  processWrapper: "Runs Claude Code's background processes through a launcher.",
};

export function detectSettings(rel, json) {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return [];
  const findings = [];
  const perms = json.permissions && typeof json.permissions === 'object' ? json.permissions : {};

  for (const rule of Array.isArray(perms.allow) ? perms.allow : []) {
    if (typeof rule === 'string' && isBroadShellRule(rule)) {
      findings.push({
        kind: 'permission',
        rule,
        level: 'high',
        file: rel,
        why: 'Pre-approves any shell command for everyone who opens this project.',
      });
    }
  }

  if (perms.defaultMode === 'bypassPermissions') {
    findings.push({
      kind: 'permission',
      rule: 'defaultMode:bypassPermissions',
      setting: true,
      level: 'high',
      file: rel,
      why: 'Turns off permission prompts for this project.',
    });
  }

  // Pre-approval of project MCP servers: the location of CVE-2025-59536
  // (MCP servers starting before user consent; fixed in Claude Code).
  if (json.enableAllProjectMcpServers === true) {
    findings.push({
      kind: 'permission',
      rule: 'enableAllProjectMcpServers:true',
      setting: true,
      level: 'high',
      file: rel,
      why: 'Approves every server in project .mcp.json files without a prompt.',
    });
  }
  if (Array.isArray(json.enabledMcpjsonServers) && json.enabledMcpjsonServers.length) {
    const names = json.enabledMcpjsonServers.filter((n) => typeof n === 'string');
    findings.push({
      kind: 'permission',
      rule: `enabledMcpjsonServers:${names.join(',')}`,
      setting: true,
      level: 'attention',
      file: rel,
      why: `Approves ${names.length} project MCP server(s) without a prompt.`,
    });
  }

  for (const [key, why] of Object.entries(COMMAND_KEYS)) {
    const command = commandOf(json[key]);
    if (command) {
      findings.push({ kind: 'settings-command', name: key, command, level: 'attention', file: rel, why });
    }
  }

  if (json.env && typeof json.env === 'object' && !Array.isArray(json.env)) {
    for (const key of Object.keys(json.env)) {
      const redirects = /BASE_URL|PROXY|ENDPOINT/i.test(key);
      findings.push({
        kind: 'env',
        name: key,
        level: redirects ? 'high' : 'info',
        file: rel,
        why: redirects
          ? 'Sets where the agent sends its API traffic.'
          : 'Sets an environment variable for every session in this project.',
      });
    }
  }

  return findings;
}

// A setting may be a command string, or an object such as { "type": "command", "command": "..." }.
function commandOf(v) {
  if (typeof v === 'string' && v.trim()) return v;
  if (v && typeof v === 'object' && typeof v.command === 'string' && v.command.trim()) return v.command;
  return null;
}

// Allows every command: "Bash", "Bash(*)", "Bash(:*)", and rules that allow a
// shell or interpreter with any arguments, e.g. "Bash(bash:*)", "Bash(sh -c:*)".
const ANY_SHELL = /^(bash|sh|zsh|dash|pwsh|powershell|cmd)(\.exe)?(\s+(-c|\/c|-Command))?\s*(:\*|\s\*|\*)$/i;

export function isBroadShellRule(rule) {
  const m = /^\s*([A-Za-z]+)\s*(?:\((.*)\))?\s*$/.exec(rule);
  if (!m || !SHELL_TOOLS.has(m[1])) return false;
  const spec = (m[2] ?? '').trim();
  return spec === '' || spec === '*' || spec === ':*' || ANY_SHELL.test(spec);
}
