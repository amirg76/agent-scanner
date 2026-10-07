import { codeText } from './text.mjs';
import { ownersOf } from './scan.mjs';

// Compares two scans: what was added, removed or changed between versions.
// Use case: a plugin auto-updates; show what now runs that did not before.

// Fields that say WHERE something is declared. Same slot = same thing.
// The plugin is not part of the slot: who a declaration belongs to is a value
// ("owners" below), compared as a list. Keyed by the display label, a plugin
// named "a, b" matched two plugins a and b, and a new owner on a shared folder
// showed an unchanged hook as removed and added (release gate, round 9).
const SLOT_FIELDS = ['kind', 'file', 'event', 'matcher', 'server', 'script', 'rule', 'name', 'target'];
// Fields that say WHAT it does. A change here inside the same slot = "changed".
// "condition" and "once" change when a hook runs (release gate, round 4: a hook
// widened from one command to every command showed no change).
const VALUE_FIELDS = ['command', 'package', 'pinned', 'remote', 'backup', 'traced', 'level', 'condition', 'once', 'owners'];

// A field's value for comparison; "owners" is every plugin the finding counts for.
function valueOf(f, k) {
  if (k === 'owners') return [...ownersOf(f)].sort();
  return f[k] ?? null;
}

export function slotKey(f) {
  return SLOT_FIELDS.map((k) => `${k}=${k === 'matcher' ? normalizeMatcher(f.matcher) : (f[k] ?? '')}`).join('|');
}

// "*", ".*", "" and a missing matcher all mean every tool. Seen in ECC between
// v2.1.0 and 2.2.x: a spelling change from "*" to ".*" showed 16 hooks as
// removed and 16 as added instead of the same hooks.
export function normalizeMatcher(m) {
  return m === undefined || m === '' || m === '*' || m === '.*' ? '*' : m;
}

function valueKey(f) {
  return VALUE_FIELDS.map((k) => `${k}=${JSON.stringify(valueOf(f, k))}`).join('|');
}

// Multiset difference: several hooks can share a slot (e.g. seven PostToolUse/Bash hooks).
function subtract(a, b) {
  const counts = new Map();
  for (const f of b) {
    const k = `${slotKey(f)}#${valueKey(f)}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out = [];
  for (const f of a) {
    const k = `${slotKey(f)}#${valueKey(f)}`;
    const n = counts.get(k) ?? 0;
    if (n > 0) counts.set(k, n - 1);
    else out.push(f);
  }
  return out;
}

// newUnread: files the new scan could not read. A finding that disappears only
// because its file was not read is "no longer checked", not "removed"; a
// settings file padded past 1 MB otherwise showed Bash(*) as removed.
export function diffScans(oldFindings, newFindings, newUnread = new Set()) {
  const gone = subtract(oldFindings, newFindings);
  const fresh = subtract(newFindings, oldFindings);

  // Pair a removed and an added finding in the same slot as one change.
  const changed = [];
  const added = [];
  const removedLeft = [...gone];
  for (const f of fresh) {
    const i = removedLeft.findIndex((g) => slotKey(g) === slotKey(f));
    if (i >= 0) {
      changed.push({ before: removedLeft[i], after: f, fields: changedFields(removedLeft[i], f) });
      removedLeft.splice(i, 1);
    } else {
      added.push(f);
    }
  }
  // An unread entry may be a folder (a link, an unreadable folder): a finding
  // in a file under it is not checked either.
  const unread = [...newUnread];
  const notRead = (f) => unread.some((u) => f.file === u || f.file.startsWith(`${u}/`));
  const unchecked = removedLeft.filter(notRead);
  const removed = removedLeft.filter((f) => !notRead(f));
  return { added, removed, changed, unchecked };
}

function changedFields(a, b) {
  return VALUE_FIELDS.filter((k) => JSON.stringify(valueOf(a, k)) !== JSON.stringify(valueOf(b, k)));
}

const LEVEL_LABEL = { high: 'HIGH', attention: 'ATTENTION', info: 'info' };

// Values in a diff come from two scanned repos: hostile, so every one is
// shown through codeText() inside a code span.
const c = (v, max) => `\`${codeText(v, max)}\``;

export function diffToMarkdown(d, { oldLabel = 'old', newLabel = 'new' } = {}) {
  const lines = [`# What changed: ${c(oldLabel, 80)} → ${c(newLabel, 80)}`, ''];
  const unchecked = d.unchecked ?? [];
  lines.push(
    `${d.added.length} added, ${d.changed.length} changed, ${d.removed.length} removed${unchecked.length ? `, ${unchecked.length} no longer checked` : ''}.`,
  );
  lines.push('');
  if (unchecked.length) {
    lines.push('## No longer checked — the new version of its file could not be read', '');
    lines.push('Not a removal: the declaration may still be there. See "Not checked" in a scan of the new version.', '');
    unchecked.forEach((f) =>
      lines.push(`- **${LEVEL_LABEL[f.level] ?? codeText(f.level, 20)}** ${codeText(f.kind, 30)} ${label(f)} — ${c(f.file, 200)}`),
    );
    lines.push('');
  }
  if (!d.added.length && !d.changed.length && !d.removed.length) {
    if (unchecked.length) return lines.join('\n');
    lines.push('Nothing that runs without asking has changed.');
    lines.push('');
    return lines.join('\n');
  }
  const line = (f) =>
    `- **${LEVEL_LABEL[f.level] ?? codeText(f.level, 20)}** ${codeText(f.kind, 30)}${f.plugin ? ` [${c(f.plugin, 60)}]` : ''} ${label(f)} — ${c(f.file, 200)}${
      f.command ? `\n  ${c(f.command)}` : ''
    }`;
  if (d.added.length) {
    lines.push('## Added — runs now, did not before', '');
    d.added.forEach((f) => lines.push(line(f)));
    lines.push('');
  }
  if (d.changed.length) {
    lines.push('## Changed', '');
    for (const ch of d.changed) {
      lines.push(line(ch.after));
      for (const k of ch.fields) {
        // "owners" is computed, not a field on the finding.
        const [was, now] = k === 'owners' ? [valueOf(ch.before, k), valueOf(ch.after, k)] : [ch.before[k], ch.after[k]];
        if (typeof was === 'string' && typeof now === 'string') {
          const [a, b] = around(was, now);
          lines.push(`  - ${k} differs at char ${a.at}: ${c(a.text, 100)} → ${c(b.text, 100)}`);
        } else {
          lines.push(`  - ${k}: ${c(fmt(was), 100)} → ${c(fmt(now), 100)}`);
        }
      }
    }
    lines.push('');
  }
  if (d.removed.length) {
    lines.push('## Removed', '');
    d.removed.forEach((f) => lines.push(line(f)));
    lines.push('');
  }
  return lines.join('\n');
}

function label(f) {
  return [
    f.event && c(f.event, 60),
    f.matcher !== undefined ? `matcher ${c(f.matcher, 80)}` : '',
    f.server && c(f.server, 60),
    f.script && c(f.script, 40),
    f.rule && c(f.rule, 80),
    f.name && c(f.name, 80),
    f.target && c(f.target, 80),
  ]
    .filter(Boolean)
    .join(' ');
}

// Long inline commands often share a long prefix (ECC hooks all start with the
// same bootstrap), so show a window around the first differing character.
export function around(a, b, radius = 40) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const start = Math.max(0, i - radius);
  const cut = (s) => `${start > 0 ? '…' : ''}${s.slice(start, i + radius).replace(/\s+/g, ' ')}${i + radius < s.length ? '…' : ''}`;
  return [
    { at: i, text: cut(a) },
    { at: i, text: cut(b) },
  ];
}

function fmt(v) {
  const s = v === undefined ? '(none)' : JSON.stringify(v);
  return s.length > 100 ? `${s.slice(0, 99)}…` : s;
}
