// Entry point: scan(dir) returns every declared thing that runs without asking.
import { readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { walk, POLICY_REASONS } from './walk.mjs';
import { isHookSource, isSettingsFile, isPluginManifest, detectHooks } from './detectors/hooks.mjs';
import { detectSettings } from './detectors/settings.mjs';
import { isMcpSource, detectMcp } from './detectors/mcp.mjs';
import { isPackageJson, detectLifecycle } from './detectors/lifecycle.mjs';
import { isInstaller, detectInstaller } from './detectors/installer.mjs';
import { isLspSource, isMonitorSource, detectComponentCommands } from './detectors/components.mjs';
import {
  isMarketplace,
  marketplaceRoot,
  entriesOf,
  entryName,
  detectEntryCommands,
  relativeSource,
  REMOTE_SOURCES,
} from './detectors/marketplace.mjs';
import { frontmatterBlock, parseYamlSubset, HOOKS_KEY } from './frontmatter.mjs';
import { clip } from './text.mjs';

// Hooks in skill and subagent frontmatter (hooks documentation): a skill's are
// registered when the skill is invoked and keep running for the rest of the
// session; a subagent's run only while it runs.
function frontmatterRole(rel) {
  if (/(^|\/)SKILL\.md$/i.test(rel)) return 'skill';
  if (/(^|\/)agents\/(.+\/)?[^/]+\.md$/i.test(rel)) return 'subagent';
  return 'markdown';
}
const ROLE_WHY = {
  skill: 'Declared in a skill: registered when the skill is invoked, then runs for the rest of the session.',
  subagent: 'Declared in a subagent: runs only while that subagent is running.',
  markdown: 'Declared in Markdown frontmatter.',
};

function detectFrontmatterHooks(rel, text, errors) {
  const block = frontmatterBlock(text);
  if (block === null || !HOOKS_KEY.test(block.body)) return [];
  if (block.tooBig) {
    errors.push({ file: rel, error: 'frontmatter declares hooks but is over 64 KB; not checked' });
    return [];
  }
  const parsed = parseYamlSubset(block.body);
  const hooks = parsed && typeof parsed === 'object' ? parsed.hooks : undefined;
  if (!parsed || typeof parsed !== 'object' || hooks === undefined) {
    errors.push({ file: rel, error: 'frontmatter declares hooks but could not be parsed; not checked' });
    return [];
  }
  const role = frontmatterRole(rel);
  return hooksWithOdd(rel, { hooks }, errors).map((f) => {
    const out = { ...f, frontmatter: role, why: `${ROLE_WHY[role]} ${f.why}` };
    // Hooks documentation: in a subagent, "Claude Code converts a Stop hook here
    // to SubagentStop"; "once" is "only honored for hooks declared in skill frontmatter".
    if (role === 'subagent' && out.event === 'Stop') {
      out.declaredEvent = 'Stop';
      out.event = 'SubagentStop';
      out.why = `${ROLE_WHY[role]} Declared as Stop; Claude Code runs it as SubagentStop, when the subagent finishes.`;
    }
    if (role === 'skill' && out.once) out.why += ' Removed after its first successful run (once: true).';
    if (role !== 'skill') delete out.once;
    return out;
  });
}

export const LEVELS = ['info', 'attention', 'high'];

// Files that could declare something but were not read or not interpreted
// (too large, invalid, an unexpected shape). A report with any of these is
// incomplete: "nothing found" must not read as "nothing declared" (release
// gate, round 4: a settings file padded past 1 MB hid Bash(*) with exit 0).
export function unreadFiles(result) {
  const out = new Set();
  for (const e of result.errors ?? []) out.add(e.file);
  for (const s of result.skipped ?? []) if (!POLICY_REASONS.has(s.reason)) out.add(s.file);
  return out;
}

// Runs detectHooks and turns entries in an unexpected shape into one error
// line for the file, so they are neither counted as hooks nor silently lost.
function hooksWithOdd(rel, json, errors) {
  const odd = [];
  const found = detectHooks(rel, json, odd);
  if (odd.length) {
    const keys = [...new Set(odd)];
    const shown = keys.slice(0, 6).map((k) => clip(k, 60)).join(', ') + (keys.length > 6 ? ', …' : '');
    errors.push({ file: rel, error: `hooks entries not in the documented shape (keys: ${shown}); not interpreted` });
  }
  return found;
}

export async function scan(dir) {
  const skipped = [];
  const files = walk(dir, skipped);
  // Manifest paths are looked up by exact name, then in lower case. Exact keys
  // are set last, so two files that differ only in case keep their own entry.
  const byRel = new Map(files.map((f) => [f.rel.toLowerCase(), f]));
  for (const f of files) byRel.set(f.rel, f);
  const findings = [];
  const marketRoots = [];
  const errors = [];

  // Reads and parses one listed file; records why it could not.
  const readJson = (f) => {
    if (f.tooBig) {
      skipped.push({ file: f.rel, reason: 'larger than 1 MB' });
      return undefined;
    }
    try {
      return JSON.parse(stripBom(readFileSync(f.full, 'utf8')));
    } catch (e) {
      errors.push({ file: f.rel, error: e instanceof SyntaxError ? `invalid JSON: ${e.message}` : (e.code ?? 'unreadable') });
      return undefined;
    }
  };

  for (const f of files) {
    const wantsJson =
      isHookSource(f.rel) ||
      isMcpSource(f.rel) ||
      isPackageJson(f.rel) ||
      isLspSource(f.rel) ||
      isMonitorSource(f.rel) ||
      isMarketplace(f.rel);
    const wantsText = isInstaller(f.rel);
    if (/\.md$/i.test(f.rel)) {
      if (f.tooBig) {
        skipped.push({ file: f.rel, reason: 'larger than 1 MB' });
        continue;
      }
      try {
        findings.push(...detectFrontmatterHooks(f.rel, readFileSync(f.full, 'utf8'), errors));
      } catch (e) {
        errors.push({ file: f.rel, error: e.code ?? 'unreadable' });
      }
      continue;
    }
    if (!wantsJson && !wantsText) continue;

    if (wantsJson) {
      const json = readJson(f);
      if (json === undefined) continue;
      if (isHookSource(f.rel)) findings.push(...hooksWithOdd(f.rel, json, errors));
      if (isSettingsFile(f.rel)) findings.push(...detectSettings(f.rel, json));
      if (isMcpSource(f.rel) || isPluginManifest(f.rel)) findings.push(...detectMcp(f.rel, json));
      if (isPackageJson(f.rel)) findings.push(...detectLifecycle(f.rel, json));
      if (isLspSource(f.rel)) findings.push(...detectComponentCommands('lsp', f.rel, json));
      if (isMonitorSource(f.rel)) findings.push(...detectComponentCommands('monitor', f.rel, json));
      if (isPluginManifest(f.rel)) findings.push(...followManifestPaths(f.rel, json, byRel, readJson, errors));
      if (isMarketplace(f.rel)) findings.push(...followMarketplace(f.rel, json, files, errors, skipped, marketRoots));
    }
    if (wantsText) {
      if (f.tooBig) {
        skipped.push({ file: f.rel, reason: 'larger than 1 MB' });
        continue;
      }
      try {
        findings.push(...detectInstaller(f.rel, readFileSync(f.full, 'utf8')));
      } catch (e) {
        errors.push({ file: f.rel, error: e.code ?? 'unreadable' });
      }
    }
  }

  // A finding belongs to a plugin only when its file is where Claude Code loads
  // that plugin's components: hooks/hooks.json, .mcp.json, .lsp.json,
  // monitors/monitors.json or plugin.json at the plugin root, or a path the
  // manifest names. The same file names deeper in the tree (a template project,
  // a sub-package) are not part of the installed plugin. Project settings
  // (.claude/settings*.json) apply when that folder is opened as a project.
  // Found on ui-ux-pro-max stack/ and ruflo v3/ (docs/ENGINEERING-NOTES.md #24).
  const plugins = findPlugins(files, marketRoots);
  for (const f of findings) {
    if (isSettingsFile(f.file)) {
      f.projectSettings = true;
      continue;
    }
    const owners = ownersByLocation(f, plugins);
    delete f.viaManifest;
    delete f.viaEntryRoot;
    delete f.viaEntryKey;
    if (owners.length === 1) f.plugin = owners[0];
    else if (owners.length > 1) {
      // A component file in a folder that several marketplace entries share
      // belongs to each of them. The label is sorted, so reordering the
      // entries does not turn into "removed" and "added" in a diff (round 8).
      f.sharedBy = owners;
      f.plugin = owners.join(', ');
    }
  }

  return { dir, filesSeen: files.length, plugins: plugins.map((p) => p.name), findings, errors, skipped };
}

// plugin.json may declare components outside their default files (plugin
// manifest reference, "Component path forms"): "hooks", "mcpServers" and
// "lspServers" take a path, an inline object, or an array mixing both;
// "experimental.monitors" (formerly top-level "monitors") takes a path or an
// inline array. Only paths inside the scanned folder are followed, and a file
// already read at its default location is not read twice. A plain inline
// "hooks" or "mcpServers" object is read with the manifest itself; objects
// inside an array are read here (the fourth review found them dropped).
//
// The entries of a field are not capped (no detector caps its findings either,
// since round 3 of the release gate): a cap let a hostile manifest put its one real hook after 100
// empty ones (release gate, round 2). What made 60,000 copies of one path slow
// was reading that file 60,000 times, so each file is read once per field, and
// each error line is written once.
function followManifestPaths(manifestRel, manifest, byRel, readJson, errors) {
  const root = manifestRoot(manifestRel);
  const out = [];
  // Keyed by field and file: two fields may name the same file, and each
  // reads it its own way (round 2: a shared set dropped the second field).
  const seen = new Set();
  const errorSeen = new Set();
  const fail = (error) => {
    if (errorSeen.has(error)) return;
    errorSeen.add(error);
    errors.push({ file: manifestRel, error });
  };
  const mark = (list, via) => list.map((x) => ({ ...x, viaManifest: via }));
  const fields = {
    hooks: manifest?.hooks,
    mcpServers: manifest?.mcpServers,
    lspServers: manifest?.lspServers,
    monitors: manifest?.experimental?.monitors ?? manifest?.monitors,
  };
  for (const [field, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    // Every item is read on its own: a string is a path, an object is inline
    // (for monitors, one monitor entry). A path inside a monitors array is not a
    // documented form, but it is followed rather than dropped (code review).
    const items = Array.isArray(v) ? v : [v];
    for (const item of items) {
      if (item && typeof item === 'object') {
        // Inline configuration. A single hooks or mcpServers object was
        // already read from the manifest.
        if (field === 'hooks' && Array.isArray(v)) out.push(...mark(hooksWithOdd(manifestRel, { hooks: item }, errors), manifestRel));
        if (field === 'mcpServers' && Array.isArray(v)) out.push(...mark(detectMcp(manifestRel, item, { flat: true }), manifestRel));
        if (field === 'lspServers') out.push(...mark(detectComponentCommands('lsp', manifestRel, item), manifestRel));
        if (field === 'monitors') out.push(...mark(detectComponentCommands('monitor', manifestRel, item), manifestRel));
        continue;
      }
      if (typeof item !== 'string') {
        if (item !== null && item !== undefined) fail(`"${field}" has an entry that is neither a path nor an object; not read`);
        continue;
      }
      if (field === 'mcpServers' && /\.(mcpb|dxt)$/i.test(item)) {
        fail('"mcpServers" names an MCP bundle (.mcpb or .dxt); its contents are not read');
        continue;
      }
      // Checks run on the path after "\" becomes "/", the same form used to
      // build rel; checking the raw value let "\\server\share\x" through
      // (harmless, it never matched a listed file, but inconsistent).
      const norm = item.replace(/\\/g, '/');
      const rel = posix.normalize(posix.join(root, norm));
      if (rel.startsWith('..') || posix.isAbsolute(norm) || /^[A-Za-z]:/.test(norm)) {
        fail(`"${field}" points outside the scanned folder; not followed: ${clip(item, 120)}`);
        continue;
      }
      // An exact name first, then without regard to case, as on Windows and macOS.
      const f = byRel.get(rel) ?? byRel.get(rel.toLowerCase());
      if (!f) {
        fail(`"${field}" points to a file that was not found: ${rel}`);
        continue;
      }
      // The same file named twice in one field is read once; it would otherwise be counted twice.
      if (seen.has(`${field}:${f.rel}`)) continue;
      seen.add(`${field}:${f.rel}`);
      const target = f.rel;
      const read = () => readJson(f);
      if (field === 'hooks' && !isHookSource(target)) {
        const json = read();
        if (json !== undefined) out.push(...mark(hooksWithOdd(target, json, errors), manifestRel));
      }
      if (field === 'mcpServers' && !isMcpSource(target)) {
        const json = read();
        if (json !== undefined) out.push(...mark(detectMcp(target, json, { flat: true }), manifestRel));
      }
      if (field === 'lspServers' && !isLspSource(target)) {
        const json = read();
        if (json !== undefined) out.push(...mark(detectComponentCommands('lsp', target, json), manifestRel));
      }
      if (field === 'monitors' && !isMonitorSource(target)) {
        const json = read();
        if (json !== undefined) out.push(...mark(detectComponentCommands('monitor', target, json), manifestRel));
      }
    }
  }
  return out;
}

// A marketplace entry can declare components inline and name where its plugin
// is (marketplace reference). Inline components are read like plugin.json's;
// a relative source must be a folder this scan read. One inside node_modules
// (not scanned), outside the folder, or missing is listed as not checked, so
// the scan is incomplete rather than clean (release gate, round 6). Remote
// sources are not fetched (README, Limits), and saying how many is part of the
// report: "nothing found" in a marketplace of 311 plugins, 259 of them
// elsewhere, must not read as a verdict on all 311.
//
// An entry whose relative source is a folder here is a plugin, with or without
// its own plugin.json ("the entry is the manifest"); it is added to
// `marketRoots`, and the entry's own findings belong to it (release gate,
// round 7: they showed under "outside any plugin" while the plugin's row read
// 0 0 0).
function followMarketplace(rel, json, files, errors, skipped, marketRoots) {
  const root = marketplaceRoot(rel);
  const out = [];
  const fail = (error) => errors.push({ file: rel, error });
  const dirs = new Map([['', '']]); // lower case → as listed
  for (const f of files) {
    for (let d = posix.dirname(f.rel); d !== '.' && !dirs.has(d.toLowerCase()); d = posix.dirname(d)) dirs.set(d.toLowerCase(), d);
  }
  const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const entries = entriesOf(json);
  const sourceType = (e) => (isObject(e.source) ? e.source.source : undefined);
  const elsewhere = entries.filter((e) => REMOTE_SOURCES.has(sourceType(e))).length;
  if (elsewhere) {
    skipped.push({ file: rel, reason: `${elsewhere} ${elsewhere === 1 ? 'entry is' : 'entries are'} hosted elsewhere; not fetched` });
  }
  const produced = entries.filter((e) => sourceType(e) === 'command').length;
  if (produced) {
    skipped.push({ file: rel, reason: `${produced} ${produced === 1 ? 'entry is' : 'entries are'} produced by a command at install; their files are not scanned` });
  }
  entries.forEach((entry, i) => {
    const name = entryName(entry, i);
    const { path, reason } = relativeSource(entry, json, root, posix);
    const pluginDir = path !== null && !reason && dirs.has(path.toLowerCase()) && !path.split('/').some((s) => s.toLowerCase() === 'node_modules') ? dirs.get(path.toLowerCase()) : undefined;
    // An entry is identified by its position, not its name: two entries may share a name.
    const key = `${rel}#${i}`;
    if (pluginDir !== undefined) marketRoots.push({ root: pluginDir, name: typeof entry.name === 'string' && entry.name ? entry.name : name, key });
    const via = pluginDir !== undefined ? { viaEntryRoot: pluginDir, viaEntryKey: key } : {};
    const tag = (list) =>
      list.map((f) => ({ ...f, ...via, marketplaceEntry: name, why: `Declared in marketplace entry "${name}". ${f.why}` }));
    if (isObject(entry.source)) {
      const t = sourceType(entry);
      if (!REMOTE_SOURCES.has(t) && t !== 'command') fail(`entry "${name}": source type "${clip(String(t), 40)}" is not a documented one; not followed`);
    } else if (entry.source !== undefined && typeof entry.source !== 'string') {
      fail(`entry "${name}": source is neither a path nor a source object; not followed`);
    }
    // The command findings already name the entry; they only need its plugin.
    out.push(...detectEntryCommands(rel, entry, name).map((f) => ({ ...f, ...via })));
    // Entry hooks run only as an inline object; a path or array "never run".
    if (isObject(entry.hooks)) out.push(...tag(hooksWithOdd(rel, { hooks: entry.hooks }, errors)));
    else if (entry.hooks !== undefined) fail(`entry "${name}": "hooks" as a path or array is not read (Claude Code reports an error and does not run them)`);
    if (entry.mcpServers !== undefined) {
      if (isObject(entry.mcpServers)) out.push(...tag(detectMcp(rel, { mcpServers: entry.mcpServers })));
      else fail(`entry "${name}": "mcpServers" as a path or array is not read`);
    }
    if (entry.lspServers !== undefined) {
      if (isObject(entry.lspServers)) out.push(...tag(detectComponentCommands('lsp', rel, entry.lspServers)));
      else fail(`entry "${name}": "lspServers" as a path or array is not read`);
    }
    const monitors = entry.experimental?.monitors ?? entry.monitors;
    if (monitors !== undefined) {
      if (Array.isArray(monitors)) out.push(...tag(detectComponentCommands('monitor', rel, monitors)));
      else fail(`entry "${name}": "monitors" as a path is not read`);
    }
    if (reason) fail(`entry "${name}": ${reason}; not followed`);
    else if (path !== null) {
      if (path.split('/').some((seg) => seg.toLowerCase() === 'node_modules')) {
        fail(`entry "${name}": source is inside node_modules, which is not scanned`);
      } else if (!dirs.has(path.toLowerCase())) {
        fail(`entry "${name}": source folder not found, empty, or not read: ${clip(path, 200)}`);
      }
    }
  });
  return out;
}

// The plugins a finding belongs to, by where it is declared.
function ownersByLocation(f, plugins) {
  const manifestPlugin = (root) => plugins.filter((x) => x.root === root && x.key === undefined);
  if (f.viaEntryKey !== undefined) {
    const own = plugins.filter((x) => x.key === f.viaEntryKey);
    // The entry's folder has its own plugin.json: that is the plugin.
    return (own.length ? own : manifestPlugin(f.viaEntryRoot)).map((x) => x.name);
  }
  if (f.viaManifest) return manifestPlugin(manifestRoot(f.viaManifest)).map((x) => x.name);
  const candidates = plugins.filter((x) => isComponentOf(f.file, x.root));
  if (!candidates.length) return [];
  // The innermost folder wins; entries sharing it all own the file.
  const depth = Math.max(...candidates.map((x) => x.root.length));
  return candidates.filter((x) => x.root.length === depth).map((x) => x.name).sort();
}

// Every plugin a finding counts for: one, or all that share its folder.
export function ownersOf(f) {
  return f.sharedBy ?? (f.plugin ? [f.plugin] : []);
}

// Plugin root of a manifest path ("" for the repo root), matched without case.
function manifestRoot(rel) {
  return rel.replace(/(^|\/)\.claude-plugin\/plugin\.json$/i, '');
}

// A plugin root is any folder holding .claude-plugin/plugin.json. In a
// marketplace repo each finding belongs to the plugin a user would install.
function findPlugins(files, marketRoots = []) {
  const roots = [];
  for (const f of files) {
    const m = /^(?:(.*)\/)?\.claude-plugin\/plugin\.json$/i.exec(f.rel);
    if (!m) continue;
    const root = m[1] ?? '';
    let name = root.split('/').pop() || '(root)';
    try {
      const json = JSON.parse(stripBom(readFileSync(f.full, 'utf8')));
      if (typeof json.name === 'string' && json.name) name = json.name;
    } catch {
      // Name falls back to the folder; a broken manifest is not this scan's concern.
    }
    roots.push({ root, name });
  }
  // Marketplace entries whose folder has no plugin.json: the entry is the
  // manifest. Several entries may share one folder, each choosing different
  // skills (anthropics/skills has five on "./"): each is its own plugin.
  const manifestRoots = new Set(roots.map((r) => r.root.toLowerCase()));
  for (const m of marketRoots) {
    if (!manifestRoots.has(m.root.toLowerCase())) roots.push({ root: m.root, name: m.name, key: m.key });
  }
  // Two plugins can share a manifest name (ruflo has two "claude-flow"); a name
  // alone would merge them in counts and tables, so duplicates get their folder.
  const count = () => {
    const m = new Map();
    for (const r of roots) m.set(r.name, (m.get(r.name) ?? 0) + 1);
    return m;
  };
  let seen = count();
  for (const r of roots) if (seen.get(r.name) > 1) r.name = `${r.name} (${r.root ? `${r.root}/` : 'repo root'})`;
  // Still equal: two marketplace entries with one name on one folder. Numbered
  // in file order, or the table would merge them (release gate, round 8). A
  // number is skipped when that name is already taken, also by a real plugin
  // called "x #1" (round 9): every name in the result is unique.
  seen = count();
  const taken = new Set(roots.map((r) => r.name));
  for (const r of roots) {
    const base = r.name;
    if (seen.get(base) < 2) continue;
    let k = 1;
    while (taken.has(`${base} #${k}`)) k++;
    r.name = `${base} #${k}`;
    taken.add(r.name);
  }
  // Longest root first, so nested plugins win over their parents.
  return roots.sort((a, b) => b.root.length - a.root.length);
}

const COMPONENT_FILES = ['hooks/hooks.json', '.mcp.json', '.lsp.json', 'monitors/monitors.json', '.claude-plugin/plugin.json'];

function isComponentOf(file, root) {
  const prefix = root ? `${root}/` : '';
  if (!file.startsWith(prefix)) return false;
  const rest = file.slice(prefix.length);
  if (COMPONENT_FILES.includes(rest.toLowerCase())) return true;
  // A plugin's own skills and subagents: skills/<name>/SKILL.md, and agents/,
  // which Claude Code "loads recursively" (plugin components documentation).
  return /^skills\/[^/]+\/SKILL\.md$/i.test(rest) || /^agents\/(?:.+\/)?[^/]+\.md$/i.test(rest);
}

export function summarize(findings) {
  const byLevel = Object.fromEntries(LEVELS.map((l) => [l, 0]));
  const byKind = {};
  for (const f of findings) {
    byLevel[f.level] = (byLevel[f.level] ?? 0) + 1;
    byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
  }
  return { total: findings.length, byLevel, byKind };
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}
