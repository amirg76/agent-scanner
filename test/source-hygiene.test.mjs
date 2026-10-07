// The repo itself must not contain invisible or bidirectional control
// characters: a scanner that strips them from reports should not ship them.
// Literal ones slipped into three source files once (docs/ENGINEERING-NOTES.md #29).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SKIP = new Set(['.git', 'node_modules', 'scratch', 'targets']);
const TEXT = /\.(mjs|js|json|md|yml|sh|txt)$/;

// Built from code points so this file stays free of the characters it looks for.
const ranges = [[0x200b, 0x200f], [0x202a, 0x202e], [0x2066, 0x2069]];
const isHidden = (ch) => ranges.some(([a, b]) => ch.charCodeAt(0) >= a && ch.charCodeAt(0) <= b);

function* files(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.isSymbolicLink()) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* files(full);
    else if (TEXT.test(e.name)) yield full;
  }
}

test('no invisible or bidirectional control characters in the repository', () => {
  const hits = [];
  for (const f of files(root)) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((l, i) => {
      for (const ch of l) {
        if (isHidden(ch)) hits.push(`${relative(root, f)}:${i + 1} U+${ch.charCodeAt(0).toString(16)}`);
      }
    });
  }
  assert.deepEqual(hits, []);
});
