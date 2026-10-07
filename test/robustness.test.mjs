// Input the scanner must survive: BOM, CRLF, oversized files, wrong JSON shapes.
// Written to a temp folder inside the project, removed after.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scan } from '../src/scan.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const tmp = join(root, 'scratch', `robustness-${process.pid}`);
after(() => rmSync(tmp, { recursive: true, force: true }));

function repo(name, files) {
  const dir = join(tmp, name);
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  return dir;
}

const HOOK = { hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } };

test('BOM and CRLF in JSON are read', async () => {
  const text = `﻿${JSON.stringify(HOOK, null, 2).replace(/\n/g, '\r\n')}`;
  const { findings, errors } = await scan(repo('bom', { 'hooks/hooks.json': text }));
  assert.equal(errors.length, 0);
  assert.equal(findings.length, 1);
});

test('file over 1 MB is skipped and reported, not read', async () => {
  const big = JSON.stringify({ ...HOOK, pad: 'x'.repeat(1024 * 1024 + 10) });
  const { findings, skipped } = await scan(repo('big', { 'hooks/hooks.json': big }));
  assert.equal(findings.length, 0);
  assert.deepEqual(skipped.map((s) => s.file), ['hooks/hooks.json']);
});

test('broken JSON is an error, not a crash', async () => {
  const { errors } = await scan(repo('broken', { '.mcp.json': '{ not json' }));
  assert.equal(errors.length, 1);
});

test('wrong shapes do not crash; an odd hook entry is reported as not interpreted', async () => {
  const dir = repo('shapes', {
    'hooks/hooks.json': '[1,2,3]',
    '.mcp.json': '"just a string"',
    'package.json': '{"scripts": ["postinstall"]}',
    '.claude/settings.json': '{"permissions": {"allow": "Bash"}, "hooks": {"Stop": "echo"}}',
  });
  const { findings, errors } = await scan(dir);
  assert.equal(findings.length, 0);
  assert.deepEqual(errors.map((e) => e.file), ['.claude/settings.json']);
  assert.match(errors[0].error, /keys: Stop/);
});
