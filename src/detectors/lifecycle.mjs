// npm lifecycle scripts that run on `npm install` without being called by name.

export const AUTO_SCRIPTS = ['preinstall', 'install', 'postinstall', 'prepare'];

export function isPackageJson(rel) {
  const r = rel.toLowerCase();
  return r === 'package.json' || r.endsWith('/package.json');
}

export function detectLifecycle(rel, json) {
  const scripts = json?.scripts;
  if (!scripts || typeof scripts !== 'object') return [];
  const findings = [];
  for (const name of AUTO_SCRIPTS) {
    if (typeof scripts[name] === 'string') {
      findings.push({
        kind: 'lifecycle',
        script: name,
        command: scripts[name],
        level: 'attention',
        file: rel,
        why:
          name === 'prepare'
            ? 'Runs on install from git and before publish.'
            : `Runs automatically on npm install (${name}).`,
      });
    }
  }
  return findings;
}
