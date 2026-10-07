// The YAML-subset parser used for skill and subagent frontmatter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractFrontmatter, parseYamlSubset } from '../src/frontmatter.mjs';

test('extracts frontmatter only at the start of the file', () => {
  assert.equal(extractFrontmatter('---\na: 1\n---\nbody'), 'a: 1');
  assert.equal(extractFrontmatter('---\r\na: 1\r\n---\r\nbody'), 'a: 1');
  assert.equal(extractFrontmatter('\uFEFF---\na: 1\n---\n'), 'a: 1');
  assert.equal(extractFrontmatter('text\n---\na: 1\n---\n'), null);
  assert.equal(extractFrontmatter('---\na: 1\nno end'), null);
});

test('hooks in the documented format', () => {
  const o = parseYamlSubset(
    'name: x\nhooks:\n  PreToolUse:\n    - matcher: "Bash"\n      hooks:\n        - type: command\n          command: "./scripts/check.sh"',
  );
  assert.deepEqual(o.hooks, { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: './scripts/check.sh' }] }] });
});

test('scalars: quoted, escaped, plain with comment, booleans, numbers, flow lists', () => {
  const o = parseYamlSubset(
    'a: "x \\"q\\" y"\nb: \'it\'\'s\'\nc: plain # comment\nd: true\ne: 12\nf: [Read, "Grep", \'Bash(x, y)\']\ng: []',
  );
  assert.deepEqual(o, { a: 'x "q" y', b: "it's", c: 'plain', d: true, e: 12, f: ['Read', 'Grep', 'Bash(x, y)'], g: [] });
});

test('block scalars and a sequence at the same indent as its key', () => {
  const o = parseYamlSubset('lit: |\n  one\n  two\nfold: >\n  a\n  b\nlist:\n- x\n- y');
  assert.deepEqual(o, { lit: 'one\ntwo', fold: 'a b', list: ['x', 'y'] });
});

test('"__proto__" is an ordinary key: nothing hides behind the prototype', () => {
  const o = parseYamlSubset('hooks:\n  __proto__:\n    x: 1\n  Stop:\n    - hooks:\n        - type: command\n          command: echo y');
  assert.equal(Object.getPrototypeOf(o.hooks), Object.prototype);
  assert.deepEqual(Object.keys(o.hooks), ['__proto__', 'Stop']);
  const seq = parseYamlSubset('list:\n  - a: 1\n    __proto__:\n      polluted: true');
  assert.equal(Object.getPrototypeOf(seq.list[0]), Object.prototype);
  assert.equal(seq.list[0].polluted, undefined);
  assert.equal({}.polluted, undefined);
});

test('a quoted value may be followed by a comment; other trailing text is refused', () => {
  assert.deepEqual(parseYamlSubset('a: "human"  # for production\nb: \'x\' # note'), { a: 'human', b: 'x' });
  assert.equal(parseYamlSubset('a: "x" y'), null);
});

test('anchors, aliases, tags and nested inline sequences are refused', () => {
  assert.equal(parseYamlSubset('a: &anchor x'), null);
  assert.equal(parseYamlSubset('a: *alias'), null);
  assert.equal(parseYamlSubset('a: !!str x'), null);
  assert.equal(parseYamlSubset('a:\n  - - x'), null);
});

test('outside the subset: null, never a guess', () => {
  assert.equal(parseYamlSubset('a: {b: 1}'), null, 'flow mapping');
  assert.equal(parseYamlSubset('a: "unterminated'), null);
  assert.equal(parseYamlSubset('a:\n\tb: 1'), null, 'tab indentation');
  assert.equal(parseYamlSubset('just a line'), null);
  const deep = Array.from({ length: 30 }, (_, i) => `${' '.repeat(i * 2)}k${i}:`).join('\n');
  assert.equal(parseYamlSubset(deep), null, 'deeper than the limit');
});
