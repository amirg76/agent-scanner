#!/usr/bin/env node
// CLI:
//   agent-scanner <dir> [--json] [--fail-on LEVEL] [--title "..."]
//   agent-scanner diff <old> <new> [--json] [--fail-on LEVEL]
//   agent-scanner --version | --help
// <old>/<new> are folders, or scan JSON files written by --json.
// Exit: 0 nothing at or above the threshold and everything read; 1 found;
// 2 bad input; 3 nothing found, but a file that could declare something was
// not read or not interpreted (see "Not checked").
import { existsSync, statSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { scan, LEVELS, unreadFiles } from '../src/scan.mjs';
import { toMarkdown } from '../src/report.mjs';
import { diffScans, diffToMarkdown } from '../src/diff.mjs';
import { stripControls } from '../src/text.mjs';

const USAGE = [
  'usage: agent-scanner <dir> [--json] [--fail-on high|attention|info] [--title "..."]',
  '       agent-scanner diff <old dir|scan.json> <new dir|scan.json> [--json] [--fail-on LEVEL]',
  '       agent-scanner --version',
  'exit:  0 clean, 1 found, 2 bad input, 3 something could not be read (see "Not checked")',
].join('\n');

const VERSION = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

function parseArgs(argv) {
  const opts = { json: false, failOn: undefined, title: undefined, positional: [] };
  const value = (i, flag) => {
    const v = argv[i];
    if (v === undefined || v.startsWith('--')) throw new Error(`${flag} needs a value`);
    return v;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--fail-on') opts.failOn = value(++i, '--fail-on');
    else if (a === '--title') opts.title = value(++i, '--title');
    else if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '-v' || a === '--version') opts.version = true;
    else if (a.startsWith('--')) throw new Error(`unknown option: ${a}`);
    else opts.positional.push(a);
  }
  return opts;
}

async function load(p) {
  const full = resolve(p);
  if (!existsSync(full)) throw new Error(`not found: ${full}`);
  if (statSync(full).isDirectory()) return scan(full);
  const data = JSON.parse(readFileSync(full, 'utf8'));
  if (!Array.isArray(data.findings)) throw new Error(`not a scan result: ${full}`);
  return data;
}

function atOrAbove(level, threshold) {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(threshold);
}

// The report is built from hostile text and goes to a terminal: drop escape
// sequences and other controls (a hook command could otherwise clear the
// screen). JSON already escapes C0 controls; C1 and bidi marks are escaped too.
function emit(text, json) {
  if (json) {
    const safe = text.replace(/[\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, (ch) =>
      `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
    console.log(safe);
  } else {
    console.log(text.split('\n').map(stripControls).join('\n'));
  }
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`${e.message}\n${USAGE}`);
    return 2;
  }
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }
  if (opts.version) {
    console.log(VERSION);
    return 0;
  }
  const isDiff = opts.positional[0] === 'diff';
  // A scan fails on high by default; a diff fails on anything new that runs.
  const failOn = opts.failOn ?? (isDiff ? 'attention' : 'high');
  if (!LEVELS.includes(failOn)) {
    console.error(`--fail-on must be one of: ${LEVELS.join(', ')}`);
    return 2;
  }

  try {
    if (isDiff) {
      const [, a, b, extra] = opts.positional;
      if (!a || !b || extra) throw new Error('diff needs exactly two inputs');
      const [oldR, newR] = [await load(a), await load(b)];
      const unread = unreadFiles(newR);
      const d = diffScans(oldR.findings, newR.findings, unread);
      emit(opts.json ? JSON.stringify(d, null, 2) : diffToMarkdown(d, { oldLabel: basename(a), newLabel: basename(b) }), opts.json);
      // A finding that is no longer checked counts like a new one: it may still run.
      const hit = [...d.added, ...d.changed.map((c) => c.after), ...d.unchecked].some((f) => atOrAbove(f.level, failOn));
      return hit ? 1 : unread.size ? 3 : 0;
    }

    const [dir, extra] = opts.positional;
    if (!dir || extra) throw new Error('expected one folder');
    const full = resolve(dir);
    if (!existsSync(full) || !statSync(full).isDirectory()) throw new Error(`not a directory: ${full}`);
    const result = await scan(full);
    emit(opts.json ? JSON.stringify(result, null, 2) : toMarkdown(result, { title: opts.title }), opts.json);
    if (result.findings.some((f) => atOrAbove(f.level, failOn))) return 1;
    return unreadFiles(result).size ? 3 : 0;
  } catch (e) {
    console.error(`${e.message}\n${USAGE}`);
    return 2;
  }
}

main().then((code) => {
  process.exitCode = code;
});
