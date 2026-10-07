// Plugin components that start processes on their own (plugin manifest
// reference): LSP servers (.lsp.json) and background monitors
// (monitors/monitors.json). A monitor's command runs "as a persistent background
// process"; with "when": "always", the default, it "starts at session start and
// on plugin reload", and "Monitors run only in interactive sessions".
// The exact schema of these files is not relied on: any object with a string
// "command" (plus optional "args") anywhere in the file is reported.

export function isLspSource(rel) {
  const r = rel.toLowerCase();
  return r === '.lsp.json' || r.endsWith('/.lsp.json');
}

export function isMonitorSource(rel) {
  const r = rel.toLowerCase();
  return r === 'monitors/monitors.json' || r.endsWith('/monitors/monitors.json');
}

const WHY = {
  lsp: 'A language server the plugin starts to provide code intelligence; it runs as a local process.',
  monitor: 'A background monitor: its command runs as a persistent process in interactive sessions, from session start unless it waits for a skill.',
};

export function detectComponentCommands(kind, rel, json) {
  const found = [];
  const seen = new Set();
  // Iterative walk, so deep nesting cannot overflow the call stack. No limit on
  // depth or on the number of findings: both were silent, and a command placed
  // first behind 250 others, or 21 levels deep, was never reported (release
  // gate, round 3). The input is at most 1 MB, which bounds the work.
  const stack = [{ node: json, name: '(root)' }];
  while (stack.length) {
    const { node, name } = stack.pop();
    if (!node || typeof node !== 'object' || seen.has(node)) continue;
    seen.add(node);
    if (typeof node.command === 'string') {
      const args = Array.isArray(node.args) ? node.args.filter((a) => typeof a === 'string') : [];
      found.push({
        kind,
        // A monitor entry carries its own "name"; an LSP config is keyed by it.
        name: kind === 'monitor' && typeof node.name === 'string' && node.name ? node.name : name,
        command: [node.command, ...args].join(' '),
        level: 'attention',
        file: rel,
        why: WHY[kind],
      });
    }
    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === 'object') stack.push({ node: v, name: Array.isArray(node) ? name : k });
    }
  }
  return found.sort((a, b) => a.name.localeCompare(b.name));
}
