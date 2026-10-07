// Install scripts that copy into the user's agent configuration folder.
// Static text reading only; the script is never executed.

const INSTALLER_NAME = /^(install|setup)[^/]*\.(sh|bash|ps1|cmd|bat|mjs|cjs|js|py)$/i;
const CLAUDE_DIR =
  /(?:~|\$HOME|\$\{HOME\}|%USERPROFILE%|\$env:USERPROFILE|homedir\(\)[^\n]{0,40}?)[\\/'",\s+]*\.claude(?:[\\/]([A-Za-z0-9._-]+))?/g;
const WRITE_OP = /\b(cp|mv|rsync|Copy-Item|Move-Item|copyFile|copyFileSync|cpSync|writeFile|writeFileSync|shutil\.copy|shutil\.copytree)\b/;
const BACKUP = /backup|\.bak\b|--backup|\bbak\b/i;

// Drops whole-line comments for sh/ps1/py (#), js (//), and cmd (REM, ::).
// Trailing comments after code are kept; good enough for a heuristic.
export function stripComments(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !/^\s*(#(?!!)|\/\/|REM\b|::)/i.test(line))
    .join('\n');
}

// Tests that exercise an installer are not installers.
const TEST_PATH = /(^|\/)(tests?|__tests__|spec)\/|\.(test|spec)\.[cm]?[jt]s$/i;

export function isInstaller(rel) {
  if (TEST_PATH.test(rel)) return false;
  const base = rel.split('/').pop();
  return INSTALLER_NAME.test(base);
}

export function detectInstaller(rel, text) {
  const code = stripComments(text);
  const targets = new Set();
  for (const m of code.matchAll(CLAUDE_DIR)) {
    // A backup copy ("skills.bak") is where old files go, not an install target.
    if (m[1] && BACKUP.test(m[1])) continue;
    // "\.claude\b" in a regex literal is a word boundary, not a folder named "b"
    // (get-shit-done; docs/ENGINEERING-NOTES.md #15). One-letter segments after "\" are escapes.
    const seg = m[1] && m[0].includes(`\\${m[1]}`) && m[1].length === 1 ? undefined : m[1];
    targets.add(seg ? `~/.claude/${seg}` : '~/.claude');
  }
  if (!targets.size) return [];

  // The installer names ~/.claude but copies in another module (seen in ECC:
  // the path is built in one file, the copy happens in another). Say so
  // instead of guessing about a backup step this file does not show.
  if (!WRITE_OP.test(code)) {
    return [
      {
        kind: 'installer',
        target: '~/.claude',
        mentions: [...targets].sort(),
        backup: null,
        traced: false,
        level: 'attention',
        file: rel,
        why: 'Installer that targets the agent config folder; the writes happen in other files and were not traced, so a backup step could not be confirmed.',
      },
    ];
  }

  // Comments are stripped first: "# no backup here" must not count as a backup step.
  const backup = BACKUP.test(code);
  return [...targets].sort().map((target) => ({
    kind: 'installer',
    target,
    backup,
    traced: true,
    level: backup ? 'info' : 'attention',
    file: rel,
    why: backup
      ? 'Writes into the agent config folder; backup-related code is present (heuristic: confirm by reading the script).'
      : 'Writes into the agent config folder and no backup code was found (heuristic): existing files of the same name are likely replaced.',
  }));
}
