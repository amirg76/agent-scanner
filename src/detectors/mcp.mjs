// MCP servers declared by a project or plugin. Each one starts a process
// (or connects to a remote URL) when the agent loads the project.

const RUNNERS = new Set(['npx', 'bunx', 'uvx', 'pnpx']);

// When a local server starts, per the MCP documentation: a plugin's servers
// start when the plugin is enabled; a project's .mcp.json servers after the user
// approves them in an interactive session, and without a prompt in claude -p,
// Agent SDK and cloud sessions.
const STARTS =
  'Runs as a local process: a plugin starts it when enabled; a project server starts after approval in an interactive session, or without a prompt in claude -p, Agent SDK and cloud sessions.';

export function isMcpSource(rel) {
  const r = rel.toLowerCase();
  return r === '.mcp.json' || r.endsWith('/.mcp.json');
}

// opts.flat: the file is an MCP config referenced by path from plugin.json, so
// the flat { name: cfg } shape applies even though it is not named .mcp.json.
export function detectMcp(rel, json, opts = {}) {
  const servers = serversOf(rel, json, opts.flat);
  if (!servers) return [];
  const findings = [];
  for (const [name, cfg] of Object.entries(servers)) {
    if (!cfg || typeof cfg !== 'object') continue;
    // "Claude Code runs the command and merges its output into the connection
    // headers" (MCP documentation). Used mostly with remote servers.
    if (typeof cfg.headersHelper === 'string' && cfg.headersHelper.trim()) {
      findings.push({
        kind: 'settings-command',
        name: `headersHelper (${name})`,
        command: cfg.headersHelper,
        level: 'attention',
        file: rel,
        why: 'Runs a command to generate request headers when connecting to this MCP server.',
      });
    }
    if (typeof cfg.url === 'string') {
      findings.push({
        kind: 'mcp',
        server: name,
        remote: cfg.url,
        pinned: null,
        level: 'info',
        file: rel,
        why: 'Connects to a remote MCP server; its behaviour can change on the server side.',
      });
      continue;
    }
    const command = typeof cfg.command === 'string' ? cfg.command : '';
    const args = Array.isArray(cfg.args) ? cfg.args.filter((a) => typeof a === 'string') : [];
    const pkg = packageFrom(command, args);
    const pinned = pkg ? isPinned(pkg.name, pkg.runner) : null;
    findings.push({
      kind: 'mcp',
      server: name,
      command: [command, ...args].join(' ').trim(),
      package: pkg?.name,
      pinned,
      level: pinned === false ? 'attention' : 'info',
      file: rel,
      why: `${pinned === false ? 'Fetched from a registry with no version: every future release runs without review. ' : ''}${STARTS}`,
    });
  }
  return findings;
}

// Two shapes exist in the wild: { "mcpServers": { name: cfg } } and, in plugin
// .mcp.json files, a flat { name: cfg }. Missing the flat one hid 9 of 14 MCP
// servers in the official marketplace during calibration (docs/ENGINEERING-NOTES.md #6).
function serversOf(rel, json, allowFlat = false) {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return null;
  if (json.mcpServers && typeof json.mcpServers === 'object' && !Array.isArray(json.mcpServers)) return json.mcpServers;
  if (!isMcpSource(rel) && !allowFlat) return null;
  const flat = Object.fromEntries(
    Object.entries(json).filter(
      ([, v]) => v && typeof v === 'object' && (typeof v.command === 'string' || typeof v.url === 'string'),
    ),
  );
  return Object.keys(flat).length ? flat : null;
}

// docker run options that take a separate value ("-e X", "--name y").
const DOCKER_VALUE_FLAGS = new Set([
  '-e', '--env', '--env-file', '-v', '--volume', '--mount', '--name', '-p', '--publish', '--network', '--net',
  '-w', '--workdir', '--entrypoint', '-u', '--user', '-l', '--label', '--platform', '--add-host', '-h', '--hostname',
  '--cpus', '-m', '--memory', '--pull', '--restart', '--device', '--cap-add', '--cap-drop', '--security-opt',
]);

export function packageFrom(command, args) {
  const base = command.replace(/\\/g, '/').split('/').pop().replace(/\.(cmd|exe)$/i, '');
  if (base === 'uvx') {
    // "uvx --from git+https://...@v1 tool start": the package is the --from source.
    const i = args.indexOf('--from');
    if (i >= 0 && args[i + 1]) return { name: args[i + 1], runner: 'uvx' };
  }
  if (RUNNERS.has(base)) {
    const name = args.find((a) => !a.startsWith('-'));
    return name ? { name, runner: base } : null;
  }
  if (base === 'pnpm' && args[0] === 'dlx') {
    const name = args.slice(1).find((a) => !a.startsWith('-'));
    return name ? { name, runner: 'pnpm' } : null;
  }
  if (base === 'docker' && args[0] === 'run') {
    // The image is the first argument that is neither an option nor an option's
    // value; what follows it is the container's command. Taking the last
    // argument reported "serve" as the image (found in review).
    for (let i = 1; i < args.length; i++) {
      const a = args[i];
      if (DOCKER_VALUE_FLAGS.has(a)) i++;
      else if (!a.startsWith('-')) return { name: a, runner: 'docker' };
    }
  }
  return null;
}

export function isPinned(name, runner) {
  if (runner === 'docker') {
    if (name.includes('@sha256:')) return true;
    const tag = name.split('/').pop().split(':')[1];
    return Boolean(tag) && tag !== 'latest';
  }
  if (runner === 'uvx') {
    if (/^git\+/.test(name)) return /\.git@[\w.-]+$|@[0-9a-f]{7,40}$|@v?\d[\w.-]*$/.test(name);
    return /==\d/.test(name);
  }
  // npm-style: name@version, where a scoped name starts with "@".
  const at = name.lastIndexOf('@');
  if (at <= 0) return false;
  const version = name.slice(at + 1);
  return /^\d/.test(version);
}
