// A plugin marketplace: .claude-plugin/marketplace.json lists plugin entries.
// Source: Claude Code marketplace reference
// (https://code.claude.com/docs/en/plugins/marketplace-reference). An entry
// "accepts every plugin.json field", so it can declare hooks and servers inline,
// and two entry fields run commands on the installing user's machine. Found by
// the release gate (round 6): the scanner did not read this file at all.
import { clip } from '../text.mjs';

export function isMarketplace(rel) {
  return /(^|\/)\.claude-plugin\/marketplace\.json$/i.test(rel);
}

export function marketplaceRoot(rel) {
  return rel.replace(/(^|\/)\.claude-plugin\/marketplace\.json$/i, '');
}

export function entriesOf(json) {
  return json && typeof json === 'object' && Array.isArray(json.plugins) ? json.plugins.filter((e) => e && typeof e === 'object') : [];
}

export function entryName(entry, i) {
  return typeof entry.name === 'string' && entry.name ? clip(entry.name, 80) : `plugins[${i}]`;
}

// Commands an entry makes Claude Code run, apart from the plugin's own hooks.
export function detectEntryCommands(rel, entry, name) {
  const found = [];
  const src = entry.source;
  if (src && typeof src === 'object' && src.source === 'command' && typeof src.command === 'string') {
    found.push({
      kind: 'settings-command',
      name: `plugin source command (${name})`,
      command: src.command,
      level: 'attention',
      file: rel,
      marketplaceEntry: name,
      why: "Runs on the installing user's machine at install, and again once per session, to produce the plugin's files.",
    });
  }
  if (typeof entry.headersHelper === 'string' && entry.headersHelper.trim()) {
    found.push({
      kind: 'settings-command',
      name: `headersHelper (${name})`,
      command: entry.headersHelper,
      level: 'attention',
      file: rel,
      marketplaceEntry: name,
      why: "Runs a command that prints the headers for downloading this entry's archive.",
    });
  }
  return found;
}

// A relative source: "./dir", "." for the root, or a bare name under
// metadata.pluginRoot. Returns the path from the scanned folder, or null with
// a reason when it is not a relative source or cannot be resolved.
export function relativeSource(entry, json, root, posix) {
  const s = entry.source;
  if (typeof s !== 'string') return { path: null };
  const norm = s.replace(/\\/g, '/');
  const pluginRoot = typeof json.metadata?.pluginRoot === 'string' ? json.metadata.pluginRoot.replace(/\\/g, '/') : null;
  const outside = { path: null, reason: `source "${clip(s, 120)}" points outside the scanned folder` };
  // Every part that is joined is checked before joining, and the result after:
  // "./C:/x" or an absolute pluginRoot must not resolve to a path off the folder.
  const absolute = (p) => posix.isAbsolute(p) || /^[A-Za-z]:/.test(p) || /(^|\/)[A-Za-z]:\//.test(p);
  if (absolute(norm) || (pluginRoot !== null && absolute(pluginRoot))) return outside;
  const join = (...p) => posix.normalize(posix.join(root, ...p)).replace(/\/$/, '');
  let rel;
  if (norm === '.') rel = root;
  else if (norm.startsWith('./')) rel = join(norm);
  else if (!norm.includes('/') && pluginRoot !== null) rel = join(pluginRoot, norm);
  else return { path: null, reason: `source "${clip(s, 120)}" is not a documented relative path` };
  if (rel === '.') rel = '';
  if (rel === '..' || rel.startsWith('../') || absolute(rel)) return outside;
  return { path: rel };
}

// Source objects that name a plugin hosted somewhere else (marketplace
// reference, "Plugin sources"). "command" is separate: its plugin is produced
// on the user's machine, and its command is reported as a finding.
export const REMOTE_SOURCES = new Set(['github', 'url', 'git-subdir', 'npm', 'archive']);
