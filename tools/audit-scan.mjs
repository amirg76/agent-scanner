#!/usr/bin/env node
// Produces the machine part of an audit: audits/<owner_repo>/scan.md, scan.json, meta.json.
// The target must already be a shallow clone at targets/<owner_repo> (see docs/AUDIT-METHOD.md).
// Usage: node tools/audit-scan.mjs <owner/repo> [...more]
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scan, summarize } from '../src/scan.mjs';
import { toMarkdown } from '../src/report.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

function git(cwd, ...args) {
  return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();
}

async function one(slug) {
  const dirName = slug.replace('/', '_');
  const target = join(root, 'targets', dirName);
  if (!existsSync(target)) throw new Error(`missing clone: targets/${dirName}`);

  const result = await scan(target);
  const meta = {
    repo: slug,
    commit: git(target, 'rev-parse', 'HEAD'),
    commitDate: git(target, 'log', '-1', '--format=%cs'),
    scannedAt: new Date().toISOString().slice(0, 10),
    scannerCommit: git(root, 'rev-parse', '--short', 'HEAD'),
    filesSeen: result.filesSeen,
    plugins: result.plugins.length,
    summary: summarize(result.findings),
  };

  const out = join(root, 'audits', dirName);
  mkdirSync(out, { recursive: true });
  // Absolute local paths do not belong in a published file.
  const portable = { ...result, dir: `targets/${dirName}` };
  writeFileSync(join(out, 'scan.json'), `${JSON.stringify(portable, null, 2)}\n`);
  writeFileSync(join(out, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
  const title = `${slug} @ ${meta.commit.slice(0, 7)} — what runs without asking`;
  writeFileSync(join(out, 'scan.md'), `${toMarkdown(result, { title })}\n`);
  return meta;
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('usage: node tools/audit-scan.mjs <owner/repo> [...]');
  process.exitCode = 2;
} else {
  for (const s of slugs) {
    try {
      const m = await one(s);
      const l = m.summary.byLevel;
      console.log(`${s} ${m.commit.slice(0, 7)} files=${m.filesSeen} plugins=${m.plugins} high=${l.high} attention=${l.attention} info=${l.info}`);
    } catch (e) {
      console.error(`${s}: ${e.message}`);
      process.exitCode = 1;
    }
  }
}
