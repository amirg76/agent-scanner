// Version comparison: unit cases on diffScans, and the CLI on fixture pairs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { diffScans } from '../src/diff.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const cli = join(root, 'bin', 'agent-scanner.mjs');
const fx = (name) => join(root, 'fixtures', name);
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

const hook = (command, extra = {}) => ({
  kind: 'hook', event: 'PostToolUse', matcher: 'Bash', file: 'hooks/hooks.json', level: 'attention', command, ...extra,
});

test('identical scans: nothing changed', () => {
  const d = diffScans([hook('a')], [hook('a')]);
  assert.deepEqual([d.added.length, d.changed.length, d.removed.length], [0, 0, 0]);
});

test('new hook in a new slot is added', () => {
  const d = diffScans([hook('a')], [hook('a'), hook('b', { event: 'SessionStart', matcher: undefined })]);
  assert.equal(d.added.length, 1);
  assert.equal(d.added[0].event, 'SessionStart');
});

test('same slot, different command is changed', () => {
  const d = diffScans([hook('echo a')], [hook('curl something')]);
  assert.equal(d.changed.length, 1);
  assert.deepEqual(d.changed[0].fields, ['command']);
});

test('a hook whose "if" condition is widened or removed is changed', () => {
  const narrow = hook('echo a', { condition: 'Bash(ls:*)' });
  assert.deepEqual(diffScans([narrow], [hook('echo a')]).changed[0].fields, ['condition']);
  assert.deepEqual(diffScans([narrow], [hook('echo a', { condition: 'Bash(*)' })]).changed[0].fields, ['condition']);
  assert.deepEqual(diffScans([hook('echo a', { once: true })], [hook('echo a')]).changed[0].fields, ['once']);
});

test('an unread folder covers the files under it, not a folder that only starts with its name', () => {
  const inA = hook('echo a', { file: 'a/b/hooks.json' });
  const inAbc = hook('echo b', { file: 'a/bc/hooks.json' });
  const d = diffScans([inA, inAbc], [], new Set(['a/b']));
  assert.deepEqual(d.unchecked.map((f) => f.file), ['a/b/hooks.json']);
  assert.deepEqual(d.removed.map((f) => f.file), ['a/bc/hooks.json']);
});

test('a scan.json from before "sharedBy" compares by its plugin field', () => {
  const old = hook('echo a', { plugin: 'a' }); // written before round 8: no sharedBy
  assert.deepEqual([diffScans([old], [hook('echo a', { plugin: 'a' })]).changed.length], [0]);
  const shared = hook('echo a', { plugin: 'a, b', sharedBy: ['a', 'b'] });
  const d = diffScans([old], [shared]);
  assert.deepEqual([d.added.length, d.removed.length, d.changed.length], [0, 0, 1]);
  assert.deepEqual(d.changed[0].fields, ['owners']);
});

test('several hooks in one slot are counted, not merged', () => {
  const d = diffScans([hook('x'), hook('x')], [hook('x'), hook('x'), hook('x')]);
  assert.equal(d.added.length + d.changed.length, 1);
  assert.equal(d.removed.length, 0);
});

test('matcher spelled "*" vs ".*" is the same slot', () => {
  const d = diffScans([hook('a', { matcher: '*' })], [hook('a', { matcher: '.*' })]);
  assert.deepEqual([d.added.length, d.changed.length, d.removed.length], [0, 0, 0]);
});

test('removed hook', () => {
  const d = diffScans([hook('a')], []);
  assert.equal(d.removed.length, 1);
});

test('CLI: pinned -> unpinned is a change and fails the diff', () => {
  const r = run('diff', fx('mcp-pinned'), fx('mcp-unpinned'));
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stdout, /pinned: `true` → `false`/);
});

test('CLI: clean -> hook added fails; hook -> clean passes', () => {
  assert.equal(run('diff', fx('clean-skill'), fx('hook-wildcard')).status, 1);
  const back = run('diff', fx('hook-wildcard'), fx('clean-skill'));
  assert.equal(back.status, 0, back.stderr);
  assert.match(back.stdout, /## Removed/);
});

test('CLI: diff needs two inputs', () => {
  assert.equal(run('diff', fx('clean-skill')).status, 2);
});
