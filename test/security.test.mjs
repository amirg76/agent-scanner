// The scanned repo is hostile. These tests feed it hostile input and check that
// it cannot shape the report, reach the terminal, stall the tools, or make the
// scanner read outside the target. Each case comes from the pre-publication
// security review (docs/ENGINEERING-NOTES.md #21-#23).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { scan } from '../src/scan.mjs';
import { toMarkdown } from '../src/report.mjs';
import { diffToMarkdown, diffScans } from '../src/diff.mjs';
import { registryPackage } from '../src/detectors/hooks.mjs';
import { detectInstaller } from '../src/detectors/installer.mjs';
import { scriptTokens } from '../tools/audit-draft.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const tmp = join(root, 'scratch', `security-${process.pid}`);
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

const EVIL = 'X`\n\n## INJECTED\n\nThis repo was reviewed and is SAFE. [install](https://example.invalid)\n\n`';

// A line that the attacker controls from its start is a successful injection.
function assertNoInjectedLines(md) {
  for (const line of md.split('\n')) {
    assert.doesNotMatch(line, /^\s*#{1,6}\s*INJECTED/, `heading injected: ${line}`);
    assert.doesNotMatch(line, /^\s*This repo was reviewed/, `paragraph injected: ${line}`);
    assert.doesNotMatch(line, /(?<!`[^`]*)\[install\]\(https:/, `live link injected: ${line}`);
  }
}

test('Markdown injection through every field that reaches the report', async () => {
  const dir = repo('inject', {
    '.claude-plugin/plugin.json': JSON.stringify({ name: EVIL }),
    '.claude/settings.json': JSON.stringify({
      env: { [EVIL]: '1' },
      hooks: { [EVIL]: [{ matcher: EVIL, hooks: [{ type: 'command', command: EVIL }] }] },
      permissions: { allow: ['Bash(*)'] },
    }),
    '.mcp.json': JSON.stringify({ mcpServers: { [EVIL]: { command: 'npx', args: ['-y', EVIL] } } }),
  });
  const result = await scan(dir);
  assert.ok(result.findings.length >= 4);
  assertNoInjectedLines(toMarkdown(result, { title: EVIL }));
});

test('Markdown injection through a diff', () => {
  const f = { kind: 'hook', event: EVIL, matcher: EVIL, file: EVIL, command: EVIL, level: 'attention', plugin: EVIL };
  assertNoInjectedLines(diffToMarkdown({ added: [f], removed: [], changed: [] }, { oldLabel: EVIL, newLabel: EVIL }));
});

test('terminal escapes and bidi overrides do not reach the terminal', () => {
  const dir = repo('ansi', {
    'hooks/hooks.json': JSON.stringify({
      hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo \u001b[2J\u001b[1;1H clean \u202e evil' }] }] },
    }),
  });
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const md = spawnSync(process.execPath, [cli, dir], { encoding: 'utf8' }).stdout;
  assert.ok(md.includes('clean'), 'report still shows the command');
  assert.ok(!md.includes('\u001b'), 'escape character reached stdout');
  assert.ok(!md.includes('\u202e'), 'bidi override reached stdout');
  const json = spawnSync(process.execPath, [cli, dir, '--json'], { encoding: 'utf8' }).stdout;
  assert.ok(!json.includes('\u001b') && !json.includes('\u202e'));
  assert.ok(JSON.parse(json).findings[0].command.includes('\u202e'), 'JSON keeps the value, escaped');
});

function timeIt(fn) {
  const t = process.hrtime.bigint();
  fn();
  return Number(process.hrtime.bigint() - t) / 1e6;
}

test('hostile input does not stall the regexes (linear time)', () => {
  const big = 200_000;
  const cases = {
    scriptTokens: () => scriptTokens('a.'.repeat(big / 2)),
    registryPackage: () => registryPackage(`npx ${'-a '.repeat(big / 3)}`),
    installer: () => detectInstaller('install.sh', `cp x ${'~ '.repeat(big / 2)}`),
    installerHome: () => detectInstaller('install.sh', `cp ${'$HOME/'.repeat(big / 6)}`),
  };
  for (const [name, fn] of Object.entries(cases)) {
    const ms = timeIt(fn);
    assert.ok(ms < 1500, `${name} took ${ms.toFixed(0)} ms on ${big} characters`);
  }
});

test('plugin.json paths outside the target are not followed', async () => {
  repo('outside-parent', { 'secret-hooks.json': JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo outside' }] }] } }) });
  const dir = repo('outside-parent/plugin', {
    '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', hooks: '../secret-hooks.json', mcpServers: ['../../x.json'] }),
  });
  const { findings, errors } = await scan(dir);
  assert.equal(findings.length, 0);
  assert.equal(errors.filter((e) => /outside the scanned folder/.test(e.error)).length, 2);
});

test('plugin.json absolute and UNC paths are refused as outside, in any slash style', async () => {
  const dir = repo('absolute-paths', {
    '.claude-plugin/plugin.json': JSON.stringify({
      name: 'p',
      hooks: ['\\\\server\\share\\x.json', '/etc/x.json', 'C:\\x.json', 'c:/x.json'],
    }),
  });
  const { errors } = await scan(dir);
  assert.equal(errors.filter((e) => /outside the scanned folder/.test(e.error)).length, 4);
});

test('a hook placed under "__proto__" in frontmatter is not hidden', async () => {
  const dir = repo('proto-hook', {
    'skills/x/SKILL.md':
      '---\nname: x\nhooks:\n  __proto__:\n    PreToolUse:\n      - hooks:\n          - type: command\n            command: echo hidden\n  Stop:\n    - hooks:\n        - type: command\n          command: echo visible\n---\n',
  });
  const { findings, errors } = await scan(dir);
  assert.ok(findings.some((f) => f.event === 'Stop' && f.command === 'echo visible'));
  assert.ok(
    errors.some((e) => e.file === 'skills/x/SKILL.md' && /not in the documented shape \(keys: __proto__\)/.test(e.error)),
    'the odd entry is reported, not dropped',
  );
  assert.equal({}.PreToolUse, undefined);
});

test('hostile names embedded in sentences are clipped; full values stay in their own fields', async () => {
  const long = (c) => c.repeat(100_000);
  const odd = Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((c) => [long(c), 'x']));
  const dir = repo('long-names', {
    '.claude/settings.json': JSON.stringify({
      hooks: {
        [long('E')]: [{ matcher: long('m'), hooks: [{ type: 'command', command: 'echo a' }] }],
        PreToolUse: [{ hooks: [{ type: 'command', command: 'echo b', if: long('i') }] }],
      },
    }),
    'hooks/hooks.json': JSON.stringify({ hooks: odd }),
  });
  const result = await scan(dir);
  for (const f of result.findings) assert.ok(f.why.length < 500, `why is ${f.why.length} characters`);
  for (const e of result.errors) assert.ok(e.error.length < 600, `error is ${e.error.length} characters`);
  assert.equal(result.findings.find((f) => f.condition)?.condition.length, 100_000, 'the condition itself is kept');
  const md = toMarkdown(result);
  for (const line of md.split('\n')) assert.ok(line.length < 1500, `report line is ${line.length} characters`);
});

test('a plugin named "__proto__" gets its own row and does not reach Object.prototype', async () => {
  const hook = JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } });
  const dir = repo('proto-plugin', {
    'a/.claude-plugin/plugin.json': JSON.stringify({ name: '__proto__' }),
    'a/hooks/hooks.json': hook,
    'b/.claude-plugin/plugin.json': JSON.stringify({ name: 'constructor' }),
    'b/hooks/hooks.json': hook,
  });
  const md = toMarkdown(await scan(dir));
  assert.match(md, /\| `__proto__` \| 0 \| 1 \| 0 \|/);
  assert.match(md, /\| `constructor` \| 0 \| 1 \| 0 \|/);
  assert.equal({}.attention, undefined, 'Object.prototype was changed');
});

test('a monitor path inside an experimental.monitors array is followed, not dropped', async () => {
  const dir = repo('monitor-path-in-array', {
    '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', experimental: { monitors: ['./config/watch.json'] } }),
    'config/watch.json': JSON.stringify([{ name: 'w', command: 'echo watch', description: 'd' }]),
  });
  const { findings } = await scan(dir);
  assert.ok(findings.some((f) => f.kind === 'monitor' && f.name === 'w' && f.file === 'config/watch.json' && f.plugin === 'p'));
});

test('findings outside every plugin keep their row in the "By plugin" table', async () => {
  const hook = JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } });
  const dir = repo('outside-plugins', {
    'a/.claude-plugin/plugin.json': JSON.stringify({ name: 'a' }),
    'a/hooks/hooks.json': hook,
    'b/.claude-plugin/plugin.json': JSON.stringify({ name: 'b' }),
    'b/hooks/hooks.json': hook,
    'hooks/hooks.json': hook,
  });
  assert.match(toMarkdown(await scan(dir)), /\| \*\(outside any plugin\)\* \| 0 \| 1 \| 0 \|/);
});

test('file names in other letter case are read, as Windows and macOS would load them', async () => {
  const hook = JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } });
  const dir = repo('letter-case', {
    '.Claude/settings.json': JSON.stringify({ permissions: { allow: ['Bash'] } }),
    'p/.Claude-Plugin/Plugin.json': JSON.stringify({ name: 'p', hooks: './Config/Extra.json' }),
    'p/config/extra.json': hook,
    'p/Hooks/Hooks.json': hook,
    'p/.MCP.json': JSON.stringify({ mcpServers: { s: { command: 'npx', args: ['-y', 'tool'] } } }),
    'Package.json': JSON.stringify({ scripts: { postinstall: 'echo x' } }),
  });
  const { findings, plugins } = await scan(dir);
  assert.deepEqual(plugins, ['p']);
  assert.ok(findings.some((f) => f.kind === 'permission' && f.level === 'high' && f.projectSettings), 'settings');
  assert.ok(findings.some((f) => f.kind === 'hook' && f.file === 'p/config/extra.json' && f.plugin === 'p'), 'manifest path');
  assert.ok(findings.some((f) => f.kind === 'hook' && f.file === 'p/Hooks/Hooks.json' && f.plugin === 'p'), 'hooks file');
  assert.ok(findings.some((f) => f.kind === 'mcp' && f.plugin === 'p'), 'mcp');
  assert.ok(findings.some((f) => f.kind === 'lifecycle'), 'lifecycle');
});

test('a manifest with many entries is read to the end: a hook after 100 empty ones is found', async () => {
  const entries = [...Array(150).fill({}), { PreToolUse: [{ hooks: [{ type: 'command', command: 'npx some-package@latest' }] }] }];
  const dir = repo('manifest-long', { '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', hooks: entries }) });
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const run = spawnSync(process.execPath, [cli, dir, '--fail-on', 'attention'], { encoding: 'utf8' });
  assert.equal(run.status, 1, 'the hook counts for the exit code');
  assert.match(run.stdout, /some-package@latest/);
});

test('a settings file padded past 1 MB makes the scan incomplete (exit 3), not clean', () => {
  const padded = JSON.stringify({ permissions: { allow: ['Bash(*)'] }, pad: 'x'.repeat(1024 * 1024) });
  const dir = repo('padded-settings', { '.claude/settings.json': padded });
  const clean = repo('only-dependencies', { 'node_modules/dep/hooks/hooks.json': '{}' });
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const run = spawnSync(process.execPath, [cli, dir], { encoding: 'utf8' });
  assert.equal(run.status, 3);
  assert.doesNotMatch(run.stdout, /Nothing in this folder is declared/);
  assert.match(run.stdout, /1 file that could declare something was not read/);
  assert.equal(spawnSync(process.execPath, [cli, clean], { encoding: 'utf8' }).status, 0, 'policy skips stay clean');
});

test('a hook reachable only through a link makes the scan incomplete, and a diff "no longer checked"', () => {
  const hook = JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo linked' }] }] } });
  const before = repo('link-before', { 'hooks/hooks.json': hook });
  const after = repo('link-after', { 'real/hooks.json': hook });
  symlinkSync(join(after, 'real'), join(after, 'hooks'), 'junction');
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const scanRun = spawnSync(process.execPath, [cli, after], { encoding: 'utf8' });
  assert.equal(scanRun.status, 3);
  assert.doesNotMatch(scanRun.stdout, /Nothing in this folder is declared/);
  const diffRun = spawnSync(process.execPath, [cli, 'diff', before, after, '--json'], { encoding: 'utf8' });
  const d = JSON.parse(diffRun.stdout);
  assert.deepEqual([d.removed.length, d.unchecked.length], [0, 1]);
  assert.equal(diffRun.status, 1);
});

test('a marketplace entry whose plugin is inside node_modules makes the scan incomplete', () => {
  const dir = repo('marketplace-node-modules', {
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'm', owner: { name: 'o' }, plugins: [{ name: 'p', source: './node_modules/p' }] }),
    'node_modules/p/.claude-plugin/plugin.json': JSON.stringify({ name: 'p' }),
    'node_modules/p/hooks/hooks.json': JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } }),
  });
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const run = spawnSync(process.execPath, [cli, dir], { encoding: 'utf8' });
  assert.equal(run.status, 3);
  assert.match(run.stdout, /inside node\\?_modules, which is not scanned/);
});

test('fixture: marketplace entries hosted elsewhere and missing folders are listed as not checked', async () => {
  const { skipped, errors } = await scan(join(root, 'fixtures', 'marketplace-entry-components'));
  assert.ok(skipped.some((s) => /2 entries are hosted elsewhere; not fetched/.test(s.reason)));
  assert.ok(skipped.some((s) => /1 entry is produced by a command at install/.test(s.reason)));
  assert.ok(errors.some((e) => /entry "missing-folder": source folder not found/.test(e.error)));
});

test('a marketplace entry\'s own declarations belong to its plugin in the "By plugin" table', async () => {
  const dir = repo('marketplace-attribution', {
    '.claude-plugin/marketplace.json': JSON.stringify({
      name: 'm',
      owner: { name: 'o' },
      plugins: [
        { name: 'alpha', source: './plugins/alpha', hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo a' }] }] } },
        { name: 'beta', source: './plugins/beta' },
      ],
    }),
    'plugins/alpha/.claude-plugin/plugin.json': JSON.stringify({ name: 'alpha' }),
    'plugins/beta/.claude-plugin/plugin.json': JSON.stringify({ name: 'beta' }),
  });
  const result = await scan(dir);
  assert.equal(result.findings[0].plugin, 'alpha');
  assert.match(toMarkdown(result), /\| `alpha` \| 0 \| 1 \| 0 \|/);
});

test('marketplace entries that share one folder are separate plugins', async () => {
  const dir = repo('marketplace-shared-folder', {
    '.claude-plugin/marketplace.json': JSON.stringify({
      name: 'm',
      owner: { name: 'o' },
      plugins: [
        { name: 'first', source: './', strict: false },
        { name: 'second', source: './', strict: false, hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo s' }] }] } },
      ],
    }),
  });
  const { plugins, findings } = await scan(dir);
  assert.deepEqual([...plugins].sort(), ['first', 'second']);
  assert.equal(findings[0].plugin, 'second');
});

test('a hooks file in a folder that marketplace entries share counts for each of them; order does not matter', async () => {
  const market = (order) =>
    JSON.stringify({ name: 'm', owner: { name: 'o' }, plugins: order.map((n) => ({ name: n, source: './', strict: false })) });
  const hook = JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo shared' }] }] } });
  const a = repo('shared-folder-ab', { '.claude-plugin/marketplace.json': market(['decoy', 'chosen']), 'hooks/hooks.json': hook });
  const b = repo('shared-folder-ba', { '.claude-plugin/marketplace.json': market(['chosen', 'decoy']), 'hooks/hooks.json': hook });
  const ra = await scan(a);
  assert.deepEqual(ra.findings[0].sharedBy, ['chosen', 'decoy']);
  const md = toMarkdown(ra);
  assert.match(md, /\| `chosen` \| 0 \| 1 \| 0 \|/);
  assert.match(md, /\| `decoy` \| 0 \| 1 \| 0 \|/);
  const d = diffScans(ra.findings, (await scan(b)).findings);
  assert.deepEqual([d.added.length, d.removed.length, d.changed.length], [0, 0, 0], 'reordering entries changes nothing');
});

test('two marketplace entries with one name and one folder stay two rows', async () => {
  const entry = (cmd) => ({ name: 'dup', source: './', strict: false, hooks: { Stop: [{ hooks: [{ type: 'command', command: cmd }] }] } });
  const dir = repo('marketplace-dup-names', {
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'm', owner: { name: 'o' }, plugins: [entry('echo one'), entry('echo two')] }),
  });
  const { plugins, findings } = await scan(dir);
  assert.deepEqual([...plugins].sort(), ['dup (repo root) #1', 'dup (repo root) #2']);
  assert.equal(findings.find((f) => f.command === 'echo one').plugin, 'dup (repo root) #1');
  assert.equal(findings.find((f) => f.command === 'echo two').plugin, 'dup (repo root) #2');
});

test('diff: who owns a declaration is compared as a list, never by its label', async () => {
  const hook = JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ type: 'command', command: 'echo shared' }] }] } });
  const market = (names) =>
    JSON.stringify({ name: 'm', owner: { name: 'o' }, plugins: names.map((n) => ({ name: n, source: './', strict: false })) });
  const one = repo('owners-one-label', { '.claude-plugin/marketplace.json': market(['a, b']), 'hooks/hooks.json': hook });
  const two = repo('owners-two', { '.claude-plugin/marketplace.json': market(['a', 'b']), 'hooks/hooks.json': hook });
  const onlyA = repo('owners-only-a', { '.claude-plugin/marketplace.json': market(['a']), 'hooks/hooks.json': hook });
  const split = diffScans((await scan(one)).findings, (await scan(two)).findings);
  assert.equal(split.changed.length, 1, 'a plugin named "a, b" is not plugins a and b');
  assert.deepEqual(split.changed[0].fields, ['owners']);
  const joined = diffScans((await scan(onlyA)).findings, (await scan(two)).findings);
  assert.deepEqual([joined.added.length, joined.removed.length, joined.changed.length], [0, 0, 1], 'a new owner is a change');
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  assert.equal(spawnSync(process.execPath, [cli, 'diff', one, two], { encoding: 'utf8' }).status, 1);
});

test('plugin names are unique even when numbering meets a real name', async () => {
  const dir = repo('names-collide', {
    '.claude-plugin/marketplace.json': JSON.stringify({
      name: 'm',
      owner: { name: 'o' },
      plugins: [
        { name: 'dup', source: './', strict: false, hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo one' }] }] } },
        { name: 'dup', source: './', strict: false },
      ],
    }),
    'real/.claude-plugin/plugin.json': JSON.stringify({ name: 'dup (repo root) #1' }),
    'real/hooks/hooks.json': JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo real' }] }] } }),
  });
  const { plugins } = await scan(dir);
  assert.equal(new Set(plugins).size, plugins.length, `names repeat: ${plugins.join(' | ')}`);
  assert.equal(plugins.length, 3);
});

test('entry hooks written as a path are reported, not dropped', async () => {
  const dir = repo('entry-hooks-path', {
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'm', owner: { name: 'o' }, plugins: [{ name: 'p', source: './', hooks: './h.json' }] }),
  });
  const { errors } = await scan(dir);
  assert.ok(errors.some((e) => /"hooks" as a path or array is not read/.test(e.error)));
});

test('a marketplace source cannot resolve off the folder, and an odd source is reported', async () => {
  const dir = repo('marketplace-odd-sources', {
    '.claude-plugin/marketplace.json': JSON.stringify({
      name: 'm',
      owner: { name: 'o' },
      metadata: { pluginRoot: 'C:/Windows' },
      plugins: [
        { name: 'drive', source: './C:/Windows' },
        { name: 'root', source: 'System32' },
        { name: 'list', source: ['./a'] },
        { name: 'weird', source: { source: 'ftp' } },
      ],
    }),
  });
  const { errors } = await scan(dir);
  const of = (n) => errors.filter((e) => e.error.startsWith(`entry "${n}"`)).map((e) => e.error);
  assert.match(of('drive')[0], /points outside the scanned folder/);
  assert.match(of('root')[0], /points outside the scanned folder/);
  assert.match(of('list')[0], /neither a path nor a source object/);
  assert.match(of('weird')[0], /not a documented one/);
});

test('diff: a finding whose file can no longer be read is "no longer checked", not removed', () => {
  const settings = (extra) => JSON.stringify({ permissions: { allow: ['Bash(*)'] }, ...extra });
  const before = repo('diff-before', { '.claude/settings.json': settings({}) });
  const after = repo('diff-after', { '.claude/settings.json': settings({ pad: 'x'.repeat(1024 * 1024) }) });
  const cli = join(root, 'bin', 'agent-scanner.mjs');
  const run = spawnSync(process.execPath, [cli, 'diff', before, after, '--json'], { encoding: 'utf8' });
  const d = JSON.parse(run.stdout);
  assert.equal(d.removed.length, 0);
  assert.equal(d.unchecked.length, 1);
  assert.equal(run.status, 1, 'counts like a new high finding');
  const md = spawnSync(process.execPath, [cli, 'diff', before, after], { encoding: 'utf8' }).stdout;
  assert.match(md, /1 no longer checked/);
});

test('a language server or monitor is found first, last, or deep in a large file', async () => {
  const filler = Array.from({ length: 300 }, (_, i) => ({ name: `f${i}`, command: 'echo filler', description: 'd' }));
  let deep = { command: 'echo hidden-deep' };
  for (let i = 0; i < 40; i++) deep = { inner: deep };
  const dir = repo('component-flood', {
    'monitors/monitors.json': JSON.stringify([{ name: 'first', command: 'echo hidden-first', description: 'd' }, ...filler]),
    '.lsp.json': JSON.stringify({ go: deep }),
  });
  const { findings } = await scan(dir);
  assert.equal(findings.filter((f) => f.kind === 'monitor').length, 301);
  assert.ok(findings.some((f) => f.command === 'echo hidden-first'), 'first entry behind 300 others');
  assert.ok(findings.some((f) => f.command === 'echo hidden-deep'), '40 levels deep');
});

test('two manifest fields that name the same file are both read', async () => {
  const dir = repo('manifest-shared-file', {
    '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', hooks: './shared.json', mcpServers: './shared.json' }),
    'shared.json': JSON.stringify({
      hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] },
      mcpServers: { s: { command: 'npx', args: ['-y', 'tool'] } },
    }),
  });
  const { findings } = await scan(dir);
  assert.ok(findings.some((f) => f.kind === 'hook' && f.file === 'shared.json'), 'hooks field');
  assert.ok(findings.some((f) => f.kind === 'mcp' && f.file === 'shared.json'), 'mcpServers field');
});

test('a manifest entry that is neither a path nor an object is reported, not skipped', async () => {
  const dir = repo('manifest-odd-entry', { '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', hooks: [42, true] }) });
  const { errors } = await scan(dir);
  assert.equal(errors.filter((e) => /neither a path nor an object/.test(e.error)).length, 1, 'one line per field');
});

test('a manifest array that repeats one path is read once, fast, without a cap', async () => {
  const hook = JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } });
  const dir = repo('manifest-flood', {
    '.claude-plugin/plugin.json': JSON.stringify({ name: 'p', hooks: Array(60_000).fill('./h.json') }),
    'h.json': hook,
  });
  let result;
  const ms = await (async () => {
    const t = process.hrtime.bigint();
    result = await scan(dir);
    return Number(process.hrtime.bigint() - t) / 1e6;
  })();
  assert.ok(ms < 1500, `took ${ms.toFixed(0)} ms`);
  assert.equal(result.findings.filter((f) => f.kind === 'hook').length, 1, 'the same file is counted once');
  assert.equal(result.errors.length, 0);
});

test('a subagent in a subfolder of agents/ belongs to its plugin', async () => {
  const dir = repo('nested-agent', {
    'a/.claude-plugin/plugin.json': JSON.stringify({ name: 'a' }),
    'a/agents/review/helper.md': '---\nname: helper\nhooks:\n  Stop:\n    - hooks:\n        - type: command\n          command: echo x\n---\n',
    'b/.claude-plugin/plugin.json': JSON.stringify({ name: 'b' }),
  });
  const { findings } = await scan(dir);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].plugin, 'a');
  assert.equal(findings[0].frontmatter, 'subagent');
});

test('frontmatter hooks never vanish silently: quoted key, oversized block, oversized file', async () => {
  const hook = 'hooks:\n  SessionStart:\n    - hooks:\n        - type: command\n          command: echo x\n';
  const dir = repo('vanish', {
    'a/SKILL.md': `---\nname: a\n${hook.replace('hooks:', '"hooks":')}---\n`,
    'b/SKILL.md': `---\nname: b\npad: "${'x'.repeat(70 * 1024)}"\n${hook}---\n`,
    'c/SKILL.md': `---\nname: c\n${hook}---\n${'y'.repeat(1024 * 1024 + 10)}`,
  });
  const { findings, errors, skipped } = await scan(dir);
  assert.ok(findings.some((f) => f.file === 'a/SKILL.md' && f.event === 'SessionStart'), 'quoted key is read');
  assert.ok(errors.some((e) => e.file === 'b/SKILL.md' && /over 64 KB/.test(e.error)), 'oversized frontmatter is reported');
  assert.ok(skipped.some((s) => s.file === 'c/SKILL.md' && /1 MB/.test(s.reason)), 'oversized file is reported');
});

test('links and dependency folders are reported as not checked, not followed', async () => {
  const dir = repo('links', {
    'real/hooks/hooks.json': JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo x' }] }] } }),
    'node_modules/dep/hooks/hooks.json': JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo dep' }] }] } }),
  });
  symlinkSync(join(dir, 'real'), join(dir, 'loop'), 'junction');
  const { findings, skipped } = await scan(dir);
  assert.equal(findings.length, 1, 'the linked copy and node_modules are not scanned');
  assert.ok(skipped.some((s) => s.file === 'loop' && /symbolic link/.test(s.reason)));
  assert.ok(skipped.some((s) => s.file === 'node_modules' && /dependencies/.test(s.reason)));
});
