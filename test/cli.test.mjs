// Runs the CLI as a real process and checks exit codes and output shape.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const cli = join(root, 'bin', 'agent-scanner.mjs');
const fx = (name) => join(root, 'fixtures', name);

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
}

test('clean folder: exit 0', () => {
  const r = run(fx('clean-skill'));
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Nothing in this folder is declared to run on its own/);
});

test('high finding: exit 1 by default', () => {
  const r = run(fx('repo-settings'));
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stdout, /\*\*HIGH\*\* \[project settings\] allow `Bash\(\*\)`/);
});

test('attention only: exit 0 by default, 1 with --fail-on attention', () => {
  assert.equal(run(fx('hook-wildcard')).status, 0);
  assert.equal(run(fx('hook-wildcard'), '--fail-on', 'attention').status, 1);
});

test('--json output parses and lists findings', () => {
  const r = run(fx('mcp-unpinned'), '--json');
  const data = JSON.parse(r.stdout);
  assert.equal(data.findings.length, 1);
  assert.equal(data.findings[0].pinned, false);
});

test('bad input: exit 2', () => {
  assert.equal(run().status, 2);
  assert.equal(run(fx('clean-skill'), '--fail-on', 'nope').status, 2);
  assert.equal(run(join(root, 'no-such-dir')).status, 2);
});

test('an option without its value is an error, not a silent default', () => {
  const r = run(fx('clean-skill'), '--fail-on');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--fail-on needs a value/);
  assert.equal(run(fx('clean-skill'), '--title').status, 2);
});

test('--version and --help print to stdout and exit 0', () => {
  const v = run('--version');
  assert.equal(v.status, 0);
  assert.match(v.stdout.trim(), /^\d+\.\d+\.\d+$/);
  const h = run('--help');
  assert.equal(h.status, 0);
  assert.match(h.stdout, /usage: agent-scanner/);
});

test('report says files were listed, not read', () => {
  assert.match(run(fx('hook-wildcard')).stdout, /files listed\./);
});
