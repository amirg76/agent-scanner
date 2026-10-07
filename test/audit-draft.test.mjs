// scriptsFor(): finding the files a hook runs, in the shapes seen in real repos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { scriptsFor, insideTarget } from '../tools/audit-draft.mjs';

const dir = fileURLToPath(new URL('./data/resolve', import.meta.url));
const hookFile = 'plug/hooks/hooks.json';

test('quote between variable and path', () => {
  const got = scriptsFor({ file: hookFile, command: '"${CLAUDE_PLUGIN_ROOT}"/hooks/evaluate.sh' }, dir);
  assert.deepEqual(got, ['plug/hooks/evaluate.sh']);
});

test('plugin root copied into another variable', () => {
  const cmd = 'HOOK_ROOT=$(printf %s "${CLAUDE_PLUGIN_ROOT}"); node "$HOOK_ROOT/src/hooks/activate.js"';
  assert.deepEqual(scriptsFor({ file: 'plug/.claude-plugin/plugin.json', command: cmd }, dir), ['plug/src/hooks/activate.js']);
});

test('command and args joined by the scanner', () => {
  const got = scriptsFor({ file: hookFile, command: 'sh ${CLAUDE_PLUGIN_ROOT}/hooks/evaluate.sh session-start' }, dir);
  assert.deepEqual(got, ['plug/hooks/evaluate.sh']);
});

test('path traversal out of the target is refused (docs/ENGINEERING-NOTES.md #19)', () => {
  // test/data/resolve/../audit-draft.test.mjs exists, so only the guard stops it.
  for (const cmd of ['sh ../audit-draft.test.mjs', 'sh ../../test/audit-draft.test.mjs', 'bash ${CLAUDE_PLUGIN_ROOT}/../../audit-draft.test.mjs']) {
    assert.deepEqual(scriptsFor({ file: hookFile, command: cmd }, dir), [], cmd);
  }
});

test('insideTarget', () => {
  assert.equal(insideTarget(dir, 'plug/hooks/evaluate.sh'), true);
  assert.equal(insideTarget(dir, '../x'), false);
  assert.equal(insideTarget(dir, 'plug/../../x'), false);
  assert.equal(insideTarget(dir, '/etc/passwd'), false);
  assert.equal(insideTarget(dir, 'C:/Windows/win.ini'), false);
});

test('missing file is not reported', () => {
  assert.deepEqual(scriptsFor({ file: hookFile, command: 'bash ${CLAUDE_PLUGIN_ROOT}/hooks/nope.sh' }, dir), []);
});
