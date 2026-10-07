#!/usr/bin/env node
// Writes a draft audit.md from audits/<slug>/scan.json + meta.json, so every
// number in the audit comes from data (docs/AUDIT-METHOD.md, section 5). Also greps the
// code that hooks run for network calls - an aid for the manual check, not a verdict.
// Overwrites audit.md only while it is an untouched draft; after hand edits it writes audit.draft.md.
// Usage: node tools/audit-draft.mjs <owner/repo> [...more]
import { readFileSync, writeFileSync, existsSync, lstatSync } from 'node:fs';
import { join, posix, relative, resolve, isAbsolute } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { normalizeMatcher } from '../src/diff.mjs';
import { codeText, cellCode, plainText } from '../src/text.mjs';
import { ownersOf } from '../src/scan.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const GH = process.env.GH_PATH || 'gh';
const SUMMARY_MARKER = '<!-- HUMAN: two or three sentences for a user deciding whether to install. -->';

const NET = /\b(curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm)\b|\bfetch\s*\(|urllib\.request|\brequests\.(get|post|put|request)\b|\bhttps?\.request\b|\baxios\b|XMLHttpRequest|new WebSocket|net\.connect/;
const SCRIPT_EXT = /\.(sh|bash|py|js|mjs|cjs|ts|ps1|cmd|bat)$/i;
// Commands longer than this are not searched for script paths. A security
// review showed the previous regex took quadratic time on a hostile command
// (60K characters: 4.2 s); splitting into words is linear.
const MAX_COMMAND = 8000;

function ghMeta(slug) {
  try {
    const out = execFileSync(GH, ['api', `repos/${slug}`, '--jq', '[.stargazers_count, (.license.spdx_id // "none"), .pushed_at[:10]] | @tsv'], {
      encoding: 'utf8',
    }).trim();
    const [stars, license, pushed] = out.split('\t');
    return { stars: Number(stars), license, pushed };
  } catch {
    return null;
  }
}

// Files a hook command points at. Each path-like token is tried against the
// plugin root and the repo root, after dropping any leading "$VAR/" or quotes.
// Real repos showed three shapes this must survive (docs/ENGINEERING-NOTES.md #10-11):
//   "${CLAUDE_PLUGIN_ROOT}"/hooks/x.sh     (quote between variable and path)
//   HOOK_ROOT=...; node "$HOOK_ROOT/src/x.js"   (the root copied into another variable)
//   command "sh" + args ["${CLAUDE_PLUGIN_ROOT}/hooks/x.sh"]   (joined by the scanner)
function pluginRootOf(file) {
  const dir = posix.dirname(file);
  if (/(^|\/)hooks$/.test(dir)) return posix.dirname(dir);
  if (/(^|\/)\.claude-plugin$/.test(dir)) return posix.dirname(dir);
  return dir.replace(/\/?\.claude$/, '') || '.';
}

// True only for a relative path that stays inside targetDir after resolution.
// lstat in the caller rejects symlinks, so a link cannot point back out either.
export function insideTarget(targetDir, p) {
  if (!p || p.startsWith('..') || posix.isAbsolute(p) || /^[A-Za-z]:/.test(p)) return false;
  const rel = relative(resolve(targetDir), resolve(targetDir, p));
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

// Path-like words in a command: ending in a script extension, or starting from
// the plugin root variable.
export function scriptTokens(command) {
  const cmd = String(command ?? '').slice(0, MAX_COMMAND).replace(/["']/g, '');
  return cmd
    .split(/[\s;&|()<>]+/)
    .filter((t) => t && (SCRIPT_EXT.test(t) || /\$\{?CLAUDE_PLUGIN_ROOT\}?\//.test(t)));
}

export function scriptsFor(finding, targetDir) {
  const pluginRoot = pluginRootOf(finding.file);
  const out = new Set();
  for (const token of scriptTokens(finding.command)) {
    const rest = token
      .replace(/\\/g, '/')
      .replace(/^(\$\{?\w+\}?\/?)+/, '')
      .replace(/^\/+/, '');
    for (const base of [pluginRoot, '.']) {
      const p = posix.normalize(posix.join(base === '.' ? '' : base, rest));
      // The command comes from the repo under audit, so it is hostile input.
      // "sh ../../x.sh" must not make us read (and publish) a file outside it.
      if (!insideTarget(targetDir, p)) continue;
      const full = join(targetDir, p);
      if (existsSync(full) && lstatSync(full).isFile()) {
        out.add(p);
        break;
      }
    }
  }
  return [...out];
}

export function netRefs(findings, targetDir) {
  const refs = [];
  const seen = new Set();
  for (const f of findings.filter((x) => x.kind === 'hook')) {
    // The command string itself is code too (shell one-liners in settings.json).
    if (f.command && NET.test(f.command)) {
      refs.push({ where: `${f.file} (${f.event} command)`, line: '(command)', text: f.command.match(NET)[0] });
    }
    for (const p of scriptsFor(f, targetDir)) {
      if (seen.has(p)) continue;
      seen.add(p);
      const lines = readFileSync(join(targetDir, p), 'utf8').split(/\r?\n/);
      // A bundled/minified file (claude-mem's worker-service.cjs) turns every
      // match into a 110-char slice of unreadable code; summarise it instead.
      if (lines.some((l) => l.length > 500)) {
        const n = lines.filter((l) => NET.test(l)).length;
        if (n) refs.push({ where: p, line: '(minified)', text: `${n} lines match in a bundled/minified file; read the source instead` });
        continue;
      }
      lines.forEach((l, i) => {
        if (NET.test(l) && !/^\s*(#|\/\/)/.test(l)) refs.push({ where: p, line: i + 1, text: l.trim().slice(0, 110) });
      });
    }
  }
  return { refs, scriptsRead: seen.size };
}

function count(arr, keyFn) {
  const m = new Map();
  for (const x of arr) m.set(keyFn(x), (m.get(keyFn(x)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

// Everything interpolated below comes from the audited repo: through codeText.
const c = (v, max = 120) => `\`${codeText(v, max)}\``;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function draft(slug) {
  const dirName = slug.replace('/', '_');
  const auditDir = join(root, 'audits', dirName);
  const scan = JSON.parse(readFileSync(join(auditDir, 'scan.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(join(auditDir, 'meta.json'), 'utf8'));
  const gh = ghMeta(slug);
  const F = scan.findings;
  const of = (k) => F.filter((f) => f.kind === k);
  const hooks = of('hook');
  const mcp = of('mcp');
  const life = of('lifecycle');
  const inst = of('installer');
  const perm = of('permission');
  const env = of('env');
  const cmds = of('settings-command');
  const comps = [...of('lsp'), ...of('monitor')];
  const inline = hooks.filter((h) => h.inlineCode).length;
  const unpinned = mcp.filter((m) => m.pinned === false).length;
  const pluginsWith = new Set(F.flatMap(ownersOf)).size;
  const settingsCount = perm.length + env.length + cmds.length;
  const { refs, scriptsRead } = netRefs(F, join(root, 'targets', dirName));
  const L = [];

  L.push(`# ${slug} — what runs without asking`, '');
  L.push('**Status:** draft generated from the scan; not yet reviewed by hand.');
  L.push(`**Commit:** ${meta.commit.slice(0, 7)} (${meta.commitDate}) · **Scanner:** ${meta.scannerCommit} · **Reviewed:** ${meta.scannedAt}`);
  if (gh) L.push(`**Repo:** ${gh.stars.toLocaleString('en-US')} stars · license ${codeText(gh.license, 40)} · last push ${gh.pushed} (GitHub API, ${meta.scannedAt})`);
  L.push('');

  L.push('## Summary', '');
  const parts = [
    `${meta.filesSeen.toLocaleString('en-US')} files listed`,
    scan.plugins.length ? `${plural(scan.plugins.length, 'plugin')}${scan.plugins.length > 1 ? ` (${pluginsWith} with findings)` : ''}` : 'no plugin manifest',
    `${plural(hooks.length, 'hook')}${hooks.length ? ` (${inline} with inline code)` : ''}`,
    `${plural(mcp.length, 'MCP server')}${mcp.length ? ` (${unpinned} not pinned)` : ''}`,
    ...(comps.length ? [plural(comps.length, 'plugin component')] : []),
    plural(life.length, 'install-time npm script'),
    plural(inst.length, 'installer finding'),
    plural(settingsCount, 'settings finding'),
  ];
  L.push(`${parts.join(' · ')}.`, '');
  if (!F.length) L.push('**Nothing in this repo is declared to run on its own.**', '');
  L.push(SUMMARY_MARKER, '');

  L.push('## What runs without asking', '');
  // In a repo with several plugins, a user installs one: show which carry what.
  if (scan.plugins.length > 1 && pluginsWith) {
    L.push(`**By plugin** (${pluginsWith} of ${scan.plugins.length} plugins declare something)`, '', '| plugin | hooks | MCP servers | other |', '|---|---|---|---|');
    // Same order as before: most findings first, then by name.
    for (const [name, n] of count(F.flatMap(ownersOf), (x) => x)) {
      const mine = F.filter((f) => ownersOf(f).includes(name));
      const h = mine.filter((f) => f.kind === 'hook').length;
      const m = mine.filter((f) => f.kind === 'mcp').length;
      L.push(`| \`${cellCode(name, 60)}\` | ${h} | ${m} | ${n - h - m} |`);
    }
    L.push('');
  }
  const ps = F.filter((f) => f.projectSettings);
  if (ps.length) {
    const files = [...new Set(ps.map((f) => f.file))];
    L.push(`**Project settings files** (${plural(files.length, 'file')}, ${plural(ps.length, 'finding')}): these apply when that folder is opened as a project, not when a plugin is installed. ${files.map((f) => c(f, 200)).join(', ')}`, '');
  }
  if (hooks.length) {
    L.push('**Hooks**', '', '| event | matcher | count | inline code |', '|---|---|---|---|');
    for (const [k, n] of count(hooks, (h) => `${h.event}\u0000${normalizeMatcher(h.matcher)}`)) {
      const [ev, m] = k.split('\u0000');
      const inl = hooks.filter((h) => h.event === ev && normalizeMatcher(h.matcher) === m && h.inlineCode).length;
      L.push(`| \`${cellCode(ev, 60)}\` | \`${m === '*' ? '* (all)' : cellCode(m, 80)}\` | ${n} | ${inl} |`);
    }
    L.push('', `Files: ${[...new Set(hooks.map((h) => c(h.file, 200)))].join(', ')}`, '');
    const fetching = hooks.filter((h) => h.package);
    if (fetching.length) {
      L.push(`**Hooks that run a registry package** (${fetching.length}; ${fetching.filter((h) => h.pinned === false).length} not pinned)`, '');
      for (const [k, n] of count(fetching, (h) => `${h.package}\u0000${h.pinned}`)) {
        const [name, pinned] = k.split('\u0000');
        const tagged = name.lastIndexOf('@') > 0;
        const note = pinned !== 'false' ? ' — pinned' : tagged ? ' — **dist-tag**: resolved from the registry on each run' : ' — no version: local install if present, else the current release';
        L.push(`- ${c(name, 80)} × ${n}${note}`);
      }
      L.push('');
    }
  }
  if (mcp.length) {
    L.push('**MCP servers**', '');
    for (const m of mcp) {
      const what = m.remote ? `remote ${c(m.remote)}` : c(m.command);
      const pin = m.pinned === false ? ' — **not pinned**' : m.pinned === true ? ' — pinned' : '';
      L.push(`- ${m.plugin ? `[${c(m.plugin, 60)}] ` : ''}${c(m.server, 60)}: ${what}${pin} (${c(m.file, 200)})`);
    }
    L.push('');
  }
  if (comps.length) {
    L.push('**Plugin components that start processes**', '');
    comps.forEach((x) => L.push(`- ${x.kind === 'lsp' ? 'language server' : 'monitor'} ${c(x.name, 60)}: ${c(x.command)} (${c(x.file, 200)})`));
    L.push('');
  }
  if (life.length) {
    L.push('**npm install-time scripts**', '');
    life.forEach((s) => L.push(`- ${c(s.script, 40)}: ${c(s.command)} (${c(s.file, 200)})`));
    L.push('');
  }
  if (inst.length) {
    L.push('**Installers**', '');
    inst.forEach((i) =>
      L.push(`- ${c(i.file, 200)} → ${c(i.target, 80)}: ${i.traced === false ? 'writes not traced, backup not confirmed' : i.backup ? 'backup-related code found (heuristic)' : '**no backup code found** (heuristic)'}`),
    );
    L.push('');
  }
  if (settingsCount) {
    L.push('**Project settings**', '');
    perm.forEach((p) => L.push(`- **${p.level}** ${p.setting ? 'setting' : 'allow'} ${c(p.rule, 80)} (${c(p.file, 200)})`));
    cmds.forEach((x) => L.push(`- **${x.level}** ${c(x.name, 60)} runs ${c(x.command)} (${c(x.file, 200)})`));
    env.forEach((e) => L.push(`- **${e.level}** env ${c(e.name, 80)} (${c(e.file, 200)})`));
    L.push('');
  }
  if (!F.length) L.push('Nothing.', '');

  L.push('## Network calls in hook code (automated grep)', '');
  if (!hooks.length) {
    L.push('No hooks, nothing to check.', '');
  } else {
    L.push(`All ${plural(hooks.length, 'hook command string')} and ${plural(scriptsRead, 'script file')} they reference were searched. Pattern: curl, wget, fetch(, urllib, requests, http(s).request, axios, Invoke-WebRequest/RestMethod, WebSocket.`, '');
    if (!refs.length) L.push('No matches.', '');
    else {
      refs.slice(0, 25).forEach((r) => L.push(`- ${c(`${r.where}:${r.line}`, 200)} — ${c(r.text)}`));
      if (refs.length > 25) L.push(`- … ${refs.length - 25} more`);
      L.push('', '<!-- HUMAN: open each match. Where does it go, and is it documented? -->', '');
    }
  }

  // What the scanner could not read belongs in the audit, not only in scan.json
  // (third review: one audit hid 15 errors from its own scan).
  const notRead = [...(scan.errors ?? []).map((e) => [e.file, e.error]), ...(scan.skipped ?? []).map((s) => [s.file, s.reason])];
  if (notRead.length) {
    L.push('## Not read by the scanner', '');
    const one = notRead.length === 1;
    // An item is a file the scanner could not read, parse or interpret, or a
    // count of marketplace plugins it did not fetch.
    L.push(`The scanner lists ${plural(notRead.length, 'item')} as not checked; anything declared ${one ? 'there' : 'in them'} is not in the counts above.`, '');
    notRead.slice(0, 20).forEach(([file, why]) => L.push(`- ${c(file, 200)} — ${plainText(why)}`));
    if (notRead.length > 20) L.push(`- … ${notRead.length - 20} more (see \`scan.json\`)`);
    L.push('', '<!-- HUMAN: say whether anything that runs could be in these files. -->', '');
  }

  L.push('## What is fine', '');
  const fine = [];
  if (!perm.length) fine.push('No project settings that pre-approve shell commands, MCP servers, or turn off permission prompts.');
  if (!cmds.length) fine.push('No project settings that configure a command (status line, credential helpers).');
  if (!env.filter((e) => e.level === 'high').length) fine.push('No project settings that redirect API traffic.');
  if (!life.length) fine.push('No npm lifecycle scripts.');
  if (!inst.length) fine.push('No installer that writes into `~/.claude`.');
  if (mcp.length && !unpinned) fine.push('Every MCP server is pinned, local, or remote by URL.');
  if (hooks.length && !hooks.some((h) => h.pinned === false)) fine.push('No hook fetches an unpinned package from a registry.');
  if (!mcp.length) fine.push('No MCP servers.');
  if (!comps.length) fine.push('No language servers or background monitors.');
  if (hooks.length && !refs.length) fine.push('No network calls found in the code the hooks run (automated grep).');
  if (!hooks.length) fine.push('No hooks.');
  fine.forEach((x) => L.push(`- ${x}`));
  L.push('');

  L.push('## Is it documented?', '', '**Not checked in this pass.**', '');
  L.push('## Recommendations for users', '', '<!-- HUMAN -->', '');
  L.push('## Limits', '');
  L.push('- Static reading of declared configuration; nothing was installed or run.');
  L.push('- Network grep covers one level of scripts referenced by hooks, not code those scripts import.');
  L.push('- Skill and agent text were not checked for prompt injection.');
  L.push('- Plugins hosted in other repos and referenced from a marketplace file were not fetched.');
  L.push('');

  // Overwrite audit.md only while it is still an untouched draft (the HUMAN
  // summary marker is still there); a hand-edited audit gets audit.draft.md.
  const existing = join(auditDir, 'audit.md');
  const untouched = existsSync(existing) && readFileSync(existing, 'utf8').includes(SUMMARY_MARKER);
  const target = !existsSync(existing) || untouched || FORCE ? 'audit.md' : 'audit.draft.md';
  writeFileSync(join(auditDir, target), L.join('\n'));
  return { target, hooks: hooks.length, inline, mcp: mcp.length, unpinned, life: life.length, inst: inst.length, settings: settingsCount, netRefs: refs.length, stars: gh?.stars };
}

// --force rebuilds audit.md even after hand edits (used when the scanner changed
// and the hand-written sections are re-applied afterwards).
const FORCE = process.argv.includes('--force');
const slugs = process.argv.slice(2).filter((a) => a !== '--force');
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain && !slugs.length) {
  console.error('usage: node tools/audit-draft.mjs <owner/repo> [...]');
  process.exitCode = 2;
}
for (const s of isMain ? slugs : []) {
  try {
    const r = draft(s);
    console.log(`${s} -> ${r.target} hooks=${r.hooks} inline=${r.inline} mcp=${r.mcp} unpinned=${r.unpinned} lifecycle=${r.life} installer=${r.inst} settings=${r.settings} netRefs=${r.netRefs} stars=${r.stars}`);
  } catch (e) {
    console.error(`${s}: ${e.message}`);
    process.exitCode = 1;
  }
}
