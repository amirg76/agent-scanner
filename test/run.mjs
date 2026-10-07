// Runs every test/*.test.mjs with node --test. File names are passed
// explicitly because glob and directory arguments to --test behave
// differently between Node 20, 22 and 24.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const dir = fileURLToPath(new URL('.', import.meta.url));
const files = readdirSync(dir)
  .filter((n) => n.endsWith('.test.mjs'))
  .sort()
  .map((n) => join(dir, n));

const r = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
process.exitCode = r.status ?? 1;
