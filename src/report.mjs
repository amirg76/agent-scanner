// Renders scan results as Markdown for humans. Every value from the scanned
// repo goes through src/text.mjs first: it is hostile input.
import { summarize, unreadFiles, ownersOf } from './scan.mjs';
import { codeText, plainText, cellCode } from './text.mjs';

const LEVEL_ORDER = { high: 0, attention: 1, info: 2 };
const LEVEL_LABEL = { high: 'HIGH', attention: 'ATTENTION', info: 'info' };

export const KIND_TITLE = {
  hook: 'Hooks (run by the agent when an event fires)',
  'settings-command': 'Commands run by configuration (settings, MCP servers)',
  permission: 'Permissions and approvals granted by project settings',
  env: 'Environment set by project settings',
  mcp: 'MCP servers started or contacted',
  lsp: 'Language servers started by a plugin',
  monitor: 'Background monitors started by a plugin',
  lifecycle: 'Scripts that run on npm install',
  installer: 'Installers that write into ~/.claude',
};

export function toMarkdown(result, { title } = {}) {
  const { findings, errors, skipped, filesSeen } = result;
  const s = summarize(findings);
  const lines = [];
  lines.push(`# ${plainText(title ?? 'What runs without asking')}`);
  lines.push('');
  lines.push(
    `${filesSeen} ${filesSeen === 1 ? 'file' : 'files'} listed. ${s.total} ${s.total === 1 ? 'finding' : 'findings'}: ${s.byLevel.high} high, ${s.byLevel.attention} attention, ${s.byLevel.info} info.`,
  );
  lines.push('');
  const unread = unreadFiles(result).size;
  const unreadText = `${unread} ${unread === 1 ? 'file' : 'files'} that could declare something ${unread === 1 ? 'was' : 'were'} not read or not interpreted; see "Not checked".`;
  if (!findings.length) {
    lines.push(unread ? `Nothing was found in the files that were read. ${unreadText}` : 'Nothing in this folder is declared to run on its own.');
    lines.push('');
  } else if (unread) {
    lines.push(unreadText);
    lines.push('');
  }

  const perPlugin = byPlugin(findings);
  if ((result.plugins?.length ?? 0) > 1) {
    lines.push('## By plugin');
    lines.push('');
    lines.push(`${result.plugins.length} plugins in this repo. You install them one at a time, so read the row for yours.`);
    lines.push('');
    lines.push('| plugin | high | attention | info |');
    lines.push('|---|---|---|---|');
    for (const name of [...result.plugins].sort()) {
      const c = perPlugin.get(name) ?? { high: 0, attention: 0, info: 0 };
      lines.push(`| \`${cellCode(name)}\` | ${c.high} | ${c.attention} | ${c.info} |`);
    }
    const outside = perPlugin.get('(repo)');
    if (outside) lines.push(`| *(outside any plugin)* | ${outside.high} | ${outside.attention} | ${outside.info} |`);
    lines.push('');
  }

  const kinds = Object.keys(KIND_TITLE).filter((k) => s.byKind[k]);
  for (const kind of kinds) {
    lines.push(`## ${KIND_TITLE[kind]}`);
    lines.push('');
    const items = findings
      .filter((f) => f.kind === kind)
      .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.file.localeCompare(b.file));
    for (const f of items) {
      const where = f.plugin ? `[\`${codeText(f.plugin, 60)}\`] ` : f.projectSettings ? '[project settings] ' : '';
      lines.push(`- **${LEVEL_LABEL[f.level]}** ${where}${describe(f)}  `);
      lines.push(`  \`${codeText(f.file, 200)}\` — ${plainText(f.why)}`);
    }
    lines.push('');
  }

  if (skipped.length || errors.length) {
    lines.push('## Not checked');
    lines.push('');
    for (const x of skipped) lines.push(`- \`${codeText(x.file, 200)}\`: ${plainText(x.reason)}`);
    for (const x of errors) lines.push(`- \`${codeText(x.file, 200)}\`: ${plainText(x.error)}`);
    lines.push('');
  }

  lines.push('## Limits');
  lines.push('');
  lines.push('- Static reading of declared configuration. Nothing was installed or executed.');
  lines.push('- Scripts called by a hook are listed by command, not analysed.');
  lines.push('- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.');
  lines.push('');
  return lines.join('\n');
}

// Plugin names come from the scanned repo: a plugin named "__proto__" must not
// reach Object.prototype (fourth review), so the counts live in a Map.
function byPlugin(findings) {
  const out = new Map();
  for (const f of findings) {
    // A file shared by several plugins counts in the row of each.
    const keys = ownersOf(f);
    for (const key of keys.length ? keys : ['(repo)']) {
      if (!out.has(key)) out.set(key, { high: 0, attention: 0, info: 0 });
      out.get(key)[f.level] += 1;
    }
  }
  return out;
}

const c = (v, max) => `\`${codeText(v, max)}\``;

function describe(f) {
  switch (f.kind) {
    case 'hook':
      return `${c(f.event, 60)}${f.matcher !== undefined ? ` [matcher: ${c(f.matcher || '(empty)', 80)}]` : ''}: ${c(f.command ?? f.hookType ?? '?')}`;
    case 'settings-command':
      return `${c(f.name, 60)}: ${c(f.command ?? '?')}`;
    case 'permission':
      return f.setting ? `setting ${c(f.rule, 80)}` : `allow ${c(f.rule, 80)}`;
    case 'env':
      return c(f.name, 80);
    case 'mcp':
      if (f.remote) return `${c(f.server, 60)} → remote ${c(f.remote)}`;
      return `${c(f.server, 60)}: ${c(f.command)}${f.pinned === false ? ' (version not pinned)' : ''}`;
    case 'lsp':
    case 'monitor':
      return `${c(f.name, 60)}: ${c(f.command)}`;
    case 'lifecycle':
      return `${c(f.script, 40)}: ${c(f.command)}`;
    case 'installer':
      if (f.traced === false) return `targets ${c(f.target, 80)} (writes not traced; backup not confirmed)`;
      return `writes to ${c(f.target, 80)}${f.backup ? ' (backup code found, heuristic)' : ' (no backup code found, heuristic)'}`;
    default:
      return c(JSON.stringify(f), 200);
  }
}
