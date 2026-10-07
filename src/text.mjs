// Every string that comes from the scanned repo is hostile. Before it goes into
// a report it must not be able to add Markdown structure (a fake heading or
// "SAFE" paragraph), create a link, or send control sequences to a terminal.
// A security review found all three possible before this module existed.

// ANSI escape sequences (colour, cursor, clear screen).
const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]|\u001b\][^\u0007\u001b]*(?:\u0007|\u001b\\)?|\u001b[@-_]/g;
// C0/C1 controls except tab and newline, zero-width marks, and bidirectional
// overrides that can make text read differently from how it runs.
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g;

export function stripControls(s) {
  return String(s).replace(ANSI, '').replace(CONTROL, ' ');
}

// For a value shown inside a code span: one line, no backticks, clipped.
export function codeText(s, max = 120) {
  let t = stripControls(s).replace(/\s+/g, ' ').replace(/`/g, "'").trim();
  if (t.length > max) t = `${t.slice(0, max - 1)}…`;
  return t;
}

// Shortens a hostile fragment before it is embedded in a sentence; the full
// value stays in its own field (command, matcher, condition).
export function clip(s, max) {
  const t = String(s);
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

// For prose that may embed hostile fragments: one line, and Markdown
// characters that could start structure or a link are escaped. Clipped too:
// a hostile key name can be as long as the file (fourth review).
export function plainText(s, max = 600) {
  let t = stripControls(s).replace(/\s+/g, ' ').trim();
  if (t.length > max) t = `${t.slice(0, max - 1)}…`;
  return t.replace(/`/g, "'").replace(/([\\[\]<>*_#|!])/g, '\\$1');
}

// Inside a table cell a pipe ends the cell even within a code span.
export function cellCode(s, max = 120) {
  return codeText(s, max).replace(/\|/g, '\\|');
}
