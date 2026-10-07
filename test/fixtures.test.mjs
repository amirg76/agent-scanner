// Runs the scanner over every folder in fixtures/ and checks it against expected.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixturesDir = join(root, 'fixtures');
const scannerPath = join(root, 'src', 'scan.mjs');

const fixtures = readdirSync(fixturesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

async function loadScanner() {
  assert.ok(existsSync(scannerPath), `scanner not found: ${scannerPath}`);
  const mod = await import(pathToFileURL(scannerPath).href);
  assert.equal(typeof mod.scan, 'function', 'src/scan.mjs must export scan(dir)');
  return mod.scan;
}

function matches(actual, wanted) {
  return Object.entries(wanted).every(([k, v]) => actual[k] === v);
}

test('fixture set is complete', () => {
  assert.ok(fixtures.length >= 8, `expected at least 8 fixtures, found ${fixtures.length}`);
  for (const name of fixtures) {
    assert.ok(existsSync(join(fixturesDir, name, 'expected.json')), `${name} has no expected.json`);
  }
});

for (const name of fixtures) {
  test(`fixture: ${name}`, async () => {
    const expected = JSON.parse(readFileSync(join(fixturesDir, name, 'expected.json'), 'utf8'));
    const scan = await loadScanner();
    const { findings } = await scan(join(fixturesDir, name));
    // One finding satisfies at most one expected entry.
    const unused = [...findings];
    for (const wanted of expected.findings) {
      const i = unused.findIndex((f) => matches(f, wanted));
      assert.ok(i >= 0, `missing finding ${JSON.stringify(wanted)}\n got: ${JSON.stringify(findings)}`);
      unused.splice(i, 1);
    }
    if (expected.exact) {
      assert.equal(findings.length, expected.findings.length, `extra findings: ${JSON.stringify(findings)}`);
    }
  });
}
