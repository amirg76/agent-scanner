// Lists files under a directory.
// Skips only version-control data and installed dependencies, and records
// everything it did not look into. An earlier version also skipped folders
// named build/dist/venv, which let a plugin inside build/ report "nothing
// declared" (found in review, docs/ENGINEERING-NOTES.md #20).
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SKIP_DIRS = new Map([
  ['.git', 'version-control data'],
  ['node_modules', 'installed dependencies'],
]);
const MAX_FILE_BYTES = 1024 * 1024;

// Skipped by policy, not by failure: installed dependencies are not the
// extension's own declarations, and a manifest path into them is reported as
// not found. This does not make a scan incomplete; everything else listed as
// not checked does. Links are NOT here: Claude Code reads through a link, so a
// hook reachable only through one was a clean "nothing declared" (release
// gate, round 5). A link is still never followed; it makes the scan incomplete.
export const POLICY_REASONS = new Set(['installed dependencies, not scanned']);

// Returns the files; appends what was not followed to `notChecked`.
export function walk(root, notChecked = []) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      notChecked.push({ file: toPosix(relative(root, dir)) || '.', reason: `folder not readable (${e.code ?? 'error'})` });
      continue;
    }
    for (const e of entries) {
      const full = join(dir, e.name);
      const rel = toPosix(relative(root, full));
      if (e.isSymbolicLink()) {
        // Links (and Windows junctions) could point outside the target or loop.
        notChecked.push({ file: rel, reason: 'symbolic link, not followed' });
      } else if (e.isDirectory()) {
        // .git is skipped silently: every clone has one and listing it is noise.
        if (SKIP_DIRS.has(e.name)) {
          if (e.name !== '.git') notChecked.push({ file: rel, reason: `${SKIP_DIRS.get(e.name)}, not scanned` });
        } else stack.push(full);
      } else if (e.isFile()) {
        let size = 0;
        try {
          size = statSync(full).size;
        } catch (err) {
          notChecked.push({ file: rel, reason: `file not readable (${err.code ?? 'error'})` });
          continue;
        }
        out.push({ full, rel, size, tooBig: size > MAX_FILE_BYTES });
      } else {
        // A socket, pipe or device: nothing to read, but not dropped silently.
        notChecked.push({ file: rel, reason: 'not a regular file, not read' });
      }
    }
  }
  notChecked.sort((a, b) => a.file.localeCompare(b.file));
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

export function toPosix(p) {
  return p.split(sep).join('/');
}
