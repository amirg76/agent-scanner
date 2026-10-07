// Reads the YAML frontmatter of a Markdown file (skills, subagents), where
// Claude Code also accepts hooks "in the same configuration format as
// settings-based hooks" (hooks documentation). Zero dependencies, so this is a
// small parser for the subset such configs use: block mappings and sequences,
// plain / single- / double-quoted scalars, flow sequences of scalars, and
// literal / folded block scalars. Anything else makes it give up (null), and
// the scan reports the file as not parsed rather than guessing.

const MAX_FRONTMATTER = 64 * 1024;
const MAX_DEPTH = 20;

// { body } for a frontmatter block, { body, tooBig: true } when it exceeds the
// cap (the caller must report that, not treat it as "no frontmatter"), or null.
export function frontmatterBlock(text) {
  const t = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/.exec(t);
  if (!m) return null;
  return m[1].length > MAX_FRONTMATTER ? { body: m[1], tooBig: true } : { body: m[1] };
}

export function extractFrontmatter(text) {
  const b = frontmatterBlock(text);
  return b && !b.tooBig ? b.body : null;
}

// A top-level "hooks:" key, plain or quoted.
export const HOOKS_KEY = /^["']?hooks["']?\s*:/m;

// Returns the parsed object, or null when the text is outside the subset.
export function parseYamlSubset(src) {
  const lines = [];
  for (const raw of src.split(/\r?\n/)) {
    if (/^\s*(#.*)?$/.test(raw)) continue;
    if (/\t/.test(raw.match(/^\s*/)[0])) return null;
    lines.push({ indent: raw.match(/^ */)[0].length, text: raw.trim(), raw });
  }
  const state = { i: 0 };
  try {
    const value = parseBlock(lines, state, 0, 0);
    return state.i === lines.length ? value : null;
  } catch {
    return null;
  }
}

// Keys come from a hostile file. "obj[key] = v" with key "__proto__" calls the
// prototype setter instead of adding a key, so a hook placed under it vanished
// from the scan with no error (third review). Define every key as an own property.
function setOwn(obj, key, value) {
  Object.defineProperty(obj, key, { value, enumerable: true, writable: true, configurable: true });
}

function parseBlock(lines, state, indent, depth) {
  if (depth > MAX_DEPTH) throw new Error('too deep');
  const first = lines[state.i];
  if (!first || first.indent < indent) return null;
  return first.text.startsWith('- ') || first.text === '-'
    ? parseSequence(lines, state, first.indent, depth)
    : parseMapping(lines, state, first.indent, depth);
}

function parseMapping(lines, state, indent, depth) {
  const obj = {};
  while (state.i < lines.length && lines[state.i].indent === indent && !lines[state.i].text.startsWith('- ')) {
    const { text } = lines[state.i];
    const kv = splitKey(text);
    if (!kv) throw new Error(`not a mapping line: ${text}`);
    state.i++;
    setOwn(obj, kv.key, valueAfterKey(kv.rest, lines, state, indent, depth));
  }
  return obj;
}

function parseSequence(lines, state, indent, depth) {
  const arr = [];
  while (state.i < lines.length && lines[state.i].indent === indent && (lines[state.i].text.startsWith('- ') || lines[state.i].text === '-')) {
    const line = lines[state.i];
    const rest = line.text === '-' ? '' : line.text.slice(2).trim();
    if (rest.startsWith('- ') || rest === '-') throw new Error('nested inline sequences are not supported');
    state.i++;
    if (rest === '') {
      arr.push(parseBlock(lines, state, indent + 1, depth + 1));
      continue;
    }
    const kv = splitKey(rest);
    if (kv) {
      // "- key: value" starts a mapping whose other keys are indented to the key's column.
      const col = line.indent + (line.text.length - rest.length);
      const obj = { [kv.key]: valueAfterKey(kv.rest, lines, state, col, depth + 1) };
      if (state.i < lines.length && lines[state.i].indent === col) {
        for (const [k, v] of Object.entries(parseMapping(lines, state, col, depth + 1))) setOwn(obj, k, v);
      }
      arr.push(obj);
    } else {
      arr.push(scalar(rest));
    }
  }
  return arr;
}

function valueAfterKey(rest, lines, state, indent, depth) {
  if (rest === '' ) {
    const next = lines[state.i];
    if (!next || next.indent <= indent) {
      // A sequence may sit at the same indent as its key.
      if (next && next.indent === indent && next.text.startsWith('- ')) return parseSequence(lines, state, indent, depth + 1);
      return null;
    }
    return parseBlock(lines, state, next.indent, depth + 1);
  }
  if (/^[|>][+-]?$/.test(rest)) {
    const parts = [];
    while (state.i < lines.length && lines[state.i].indent > indent) parts.push(lines[state.i++].text);
    return rest.startsWith('|') ? parts.join('\n') : parts.join(' ');
  }
  return scalar(rest);
}

// "key: value" with a plain or quoted key; the value may be empty.
function splitKey(text) {
  const m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^:#'"\s][^:#]*?)\s*:(?:\s+(.*))?$/.exec(text);
  if (!m) return null;
  return { key: String(scalar(m[1])), rest: (m[2] ?? '').trim() };
}

// Index just past the closing quote of a quoted scalar starting at 0, or -1.
function quotedEnd(t) {
  const q = t[0];
  for (let i = 1; i < t.length; i++) {
    if (q === '"' && t[i] === '\\') i++;
    else if (t[i] === q) {
      if (q === "'" && t[i + 1] === "'") i++;
      else return i + 1;
    }
  }
  return -1;
}

function scalar(s) {
  const t = s.trim();
  if (t.startsWith('"') || t.startsWith("'")) {
    // A quoted value may be followed by a comment: "human"  # note.
    const end = quotedEnd(t);
    if (end < 0) throw new Error('unterminated string');
    const after = t.slice(end);
    if (after && !/^\s+#/.test(after)) throw new Error('text after a quoted value');
    const body = t.slice(0, end);
    return body[0] === '"' ? JSON.parse(body.replace(/\\\//g, '/')) : body.slice(1, -1).replace(/''/g, "'");
  }
  // Anchors, aliases and tags change meaning in real YAML: give up rather than
  // return their text as if it were the value.
  if (/^[&*!]/.test(t)) throw new Error('anchors, aliases and tags are not supported');
  if (t.startsWith('[') && t.endsWith(']')) {
    const inner = t.slice(1, -1).trim();
    return inner ? splitFlow(inner).map(scalar) : [];
  }
  if (t.startsWith('{')) throw new Error('flow mappings are not supported');
  const plain = t.replace(/\s+#.*$/, '');
  if (plain === 'true') return true;
  if (plain === 'false') return false;
  if (plain === 'null' || plain === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(plain)) return Number(plain);
  return plain;
}

// Splits "a, 'b, c', \"d\"" on commas outside quotes.
function splitFlow(s) {
  const out = [];
  let cur = '';
  let q = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      cur += ch;
      if (ch === '\\' && q === '"') cur += s[++i] ?? '';
      else if (ch === q) q = '';
    } else if (ch === '"' || ch === "'") {
      q = ch;
      cur += ch;
    } else if (ch === ',') {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (q) throw new Error('unterminated string');
  if (cur.trim()) out.push(cur.trim());
  return out;
}
