// Edge cases for the small parsing helpers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPinned } from '../src/detectors/mcp.mjs';
import { isBroadShellRule } from '../src/detectors/settings.mjs';
import { detectInstaller, stripComments, isInstaller } from '../src/detectors/installer.mjs';
import { detectHooks, isInlineCode } from '../src/detectors/hooks.mjs';
import { around } from '../src/diff.mjs';

test('hooks: registry package in a hook command', async () => {
  const { registryPackage } = await import('../src/detectors/hooks.mjs');
  assert.deepEqual(registryPackage('[ -n "$X" ] && npx @claude-flow/cli@latest hooks pre-edit'), { runner: 'npx', name: '@claude-flow/cli@latest' });
  assert.deepEqual(registryPackage('npx -y some-tool@1.2.0 run'), { runner: 'npx', name: 'some-tool@1.2.0' });
  assert.deepEqual(registryPackage('pnpm dlx tool check'), { runner: 'pnpm', name: 'tool' });
  assert.equal(registryPackage('node ./hooks/x.js'), null);
  assert.equal(registryPackage('echo npx is great'), null);
  const [f] = detectHooks('hooks/hooks.json', {
    hooks: { PreToolUse: [{ matcher: 'Edit', hooks: [{ type: 'command', command: 'npx @claude-flow/cli@latest hooks pre-edit' }] }] },
  });
  assert.equal(f.pinned, false);
  assert.match(f.why, /"latest" tag is resolved from the registry on each run/);
  const [g] = detectHooks('x/.claude/settings.json', {
    hooks: { PostToolUse: [{ matcher: 'Write', hooks: [{ type: 'command', command: 'npx tsc --noEmit' }] }] },
  });
  assert.match(g.why, /local install is used if present/);
});

test('isInlineCode', () => {
  assert.equal(isInlineCode('node -e "console.log(1)"'), true);
  assert.equal(isInlineCode('python3 -c "print(1)"'), true);
  assert.equal(isInlineCode('bash -c "echo hi"'), true);
  assert.equal(isInlineCode('node ${CLAUDE_PLUGIN_ROOT}/hooks/log.mjs'), false);
  assert.equal(isInlineCode('bash "${CLAUDE_PLUGIN_ROOT}/hooks/stop.sh"'), false);
});

test('around: shows the window at the first difference', () => {
  const prefix = 'x'.repeat(200);
  const [a, b] = around(`${prefix}AAA`, `${prefix}BBB`, 5);
  assert.equal(a.at, 200);
  assert.equal(a.text, '…xxxxxAAA');
  assert.equal(b.text, '…xxxxxBBB');
});

test('hooks: regex matcher ".*" is described as every tool; non-tool events do not mention tools', () => {
  const [f] = detectHooks('hooks/hooks.json', {
    hooks: { PreToolUse: [{ matcher: '.*', hooks: [{ type: 'command', command: 'echo x' }] }] },
  });
  assert.match(f.why, /for every tool/);
  const [g] = detectHooks('hooks/hooks.json', {
    hooks: { Stop: [{ matcher: '.*', hooks: [{ type: 'command', command: 'echo x' }] }] },
  });
  assert.equal(g.why, 'Runs on every Stop event.');
});

test('hooks: an "if" condition narrows the description, and never runs on a non-tool event', () => {
  const [f] = detectHooks('hooks/hooks.json', {
    hooks: {
      PostToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'echo x', if: 'Bash(git *)' }] }],
      Stop: [{ hooks: [{ type: 'command', command: 'echo y', if: 'Bash(git *)' }] }],
    },
  });
  assert.equal(f.condition, 'Bash(git *)');
  assert.match(f.why, /only when the tool call matches/);
  const g = detectHooks('hooks/hooks.json', { hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo y', if: 'Bash(git *)' }] }] } })[0];
  assert.match(g.why, /never runs/);
});

test('isPinned: npm names', () => {
  assert.equal(isPinned('pkg', 'npx'), false);
  assert.equal(isPinned('pkg@latest', 'npx'), false);
  assert.equal(isPinned('pkg@1.2.3', 'npx'), true);
  assert.equal(isPinned('@scope/pkg', 'npx'), false);
  assert.equal(isPinned('@scope/pkg@0.4.0', 'npx'), true);
  assert.equal(isPinned('@scope/pkg@next', 'npx'), false);
});

test('isPinned: docker and uvx', () => {
  assert.equal(isPinned('ghcr.io/org/img', 'docker'), false);
  assert.equal(isPinned('ghcr.io/org/img:latest', 'docker'), false);
  assert.equal(isPinned('ghcr.io/org/img:1.4', 'docker'), true);
  assert.equal(isPinned('img@sha256:abc', 'docker'), true);
  assert.equal(isPinned('tool', 'uvx'), false);
  assert.equal(isPinned('tool==2.0.1', 'uvx'), true);
});

test('isBroadShellRule', () => {
  for (const r of ['Bash', 'Bash(*)', 'Bash(:*)', 'Bash( * )', 'PowerShell']) {
    assert.equal(isBroadShellRule(r), true, r);
  }
  for (const r of ['Bash(npm test)', 'Bash(git status:*)', 'Read', 'Edit(*)', 'WebFetch']) {
    assert.equal(isBroadShellRule(r), false, r);
  }
});

test('stripComments keeps the shebang and code', () => {
  const out = stripComments('#!/bin/sh\n# note\ncp a b\n// js note\nREM cmd note\n:: cmd note');
  assert.equal(out, '#!/bin/sh\ncp a b');
});

test('installer: backup word only in a comment does not count', () => {
  const [f] = detectInstaller('install.sh', '# we skip the backup\ncp -r x "$HOME/.claude/agents/"');
  assert.equal(f.backup, false);
  assert.equal(f.target, '~/.claude/agents');
});

test('installer: a real backup step counts', () => {
  const [f] = detectInstaller('install.sh', 'cp -r ~/.claude ~/.claude.bak\ncp -r x ~/.claude/skills/');
  assert.equal(f.backup, true);
});

test('installer: target named but writes elsewhere -> not traced, backup unknown', () => {
  const found = detectInstaller('scripts/install-apply.js', 'console.log("Install into ~/.claude/ and ~/.claude/docs/")');
  assert.equal(found.length, 1);
  assert.equal(found[0].traced, false);
  assert.equal(found[0].backup, null);
  assert.deepEqual(found[0].mentions, ['~/.claude', '~/.claude/docs']);
});

test('installer: no mention of ~/.claude means no finding', () => {
  assert.deepEqual(detectInstaller('install.sh', 'node scripts/install-apply.js "$@"'), []);
});

test('installer: test files are not installers', () => {
  assert.equal(isInstaller('tests/scripts/install-sh.test.js'), false);
  assert.equal(isInstaller('test/install.sh'), false);
  assert.equal(isInstaller('src/install.test.mjs'), false);
  assert.equal(isInstaller('install.sh'), true);
  assert.equal(isInstaller('scripts/install-apply.js'), true);
});

test('installer: regex escape after .claude is not a folder', () => {
  const found = detectInstaller('install.js', "fs.writeFileSync(p, s.replace(/\\$HOME\\/\\.claude\\b/g, 'x'))");
  assert.deepEqual(found.map((f) => f.target), ['~/.claude']);
});

test('mcp: docker image is the first non-option argument, not the last', async () => {
  const { packageFrom } = await import('../src/detectors/mcp.mjs');
  assert.deepEqual(packageFrom('docker', ['run', '-i', '--rm', 'ghcr.io/org/img', 'serve']), { name: 'ghcr.io/org/img', runner: 'docker' });
  assert.deepEqual(
    packageFrom('docker', ['run', '-i', '--rm', '-e', 'TOKEN=x', 'hashicorp/terraform-mcp-server:0.4.0']),
    { name: 'hashicorp/terraform-mcp-server:0.4.0', runner: 'docker' },
  );
  assert.deepEqual(packageFrom('docker', ['run', '--name', 'n', '-v', 'a:b', 'img:1.2', 'cmd']), { name: 'img:1.2', runner: 'docker' });
});

test('mcp: uvx --from is the package source; a git ref pins it', async () => {
  const { packageFrom } = await import('../src/detectors/mcp.mjs');
  const pkg = packageFrom('uvx', ['--from', 'git+https://github.com/o/r', 'tool', 'start']);
  assert.deepEqual(pkg, { name: 'git+https://github.com/o/r', runner: 'uvx' });
  assert.equal(isPinned(pkg.name, 'uvx'), false);
  assert.equal(isPinned('git+https://github.com/o/r.git@v1.2.0', 'uvx'), true);
  assert.equal(isPinned('git+https://github.com/o/r@0123abcd', 'uvx'), true);
});

test('settings: a shell or interpreter with any arguments is a broad rule', () => {
  for (const r of ['Bash(bash:*)', 'Bash(sh -c:*)', 'Bash(pwsh -Command:*)', 'Bash(zsh *)', 'PowerShell(powershell:*)']) {
    assert.equal(isBroadShellRule(r), true, r);
  }
  for (const r of ['Bash(bash scripts/test.sh)', 'Bash(shellcheck:*)', 'Bash(sha256sum:*)']) {
    assert.equal(isBroadShellRule(r), false, r);
  }
});

test('hooks: ruby, perl and php inline code', () => {
  assert.equal(isInlineCode('ruby -e "puts 1"'), true);
  assert.equal(isInlineCode('perl -e "print 1"'), true);
  assert.equal(isInlineCode('php -r "echo 1;"'), true);
});

test('installer: Windows paths', () => {
  const found = detectInstaller('install.ps1', 'Copy-Item -Recurse x "$env:USERPROFILE\\.claude\\commands"');
  assert.equal(found[0].target, '~/.claude/commands');
});

test('hooks: only npx and bunx are described as using a local install first', async () => {
  const { unpinnedNote } = await import('../src/detectors/hooks.mjs');
  assert.match(unpinnedNote({ runner: 'npx', name: 'tool' }), /local install is used if present/);
  assert.match(unpinnedNote({ runner: 'bunx', name: 'tool' }), /local install is used if present/);
  assert.doesNotMatch(unpinnedNote({ runner: 'uvx', name: 'tool' }), /local install/);
  assert.match(unpinnedNote({ runner: 'pnpm', name: 'tool' }), /decided by pnpm at run time/);
});
