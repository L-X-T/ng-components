// Spec/tools typecheck: the inferred per-project
// `typecheck` target compiles tsconfig.app/lib.json only – spec files are
// excluded there, and Vitest strips types without checking them. This script
// runs tsc --noEmit over every tsconfig.spec.json so tests and test harness
// files get the same strictness gate as production code.
//
// Usage: node tools/typecheck-specs.mjs (exits 1 listing every failing config)
import { execFile } from 'node:child_process';
import { globSync } from 'node:fs';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CONCURRENCY = 4;

const configs = ['apps', 'libs', 'tools']
  .flatMap((dir) => globSync(`${dir}/**/tsconfig.spec.json`))
  .filter((config) => !config.includes('node_modules'))
  .sort();

if (configs.length === 0) {
  console.error('typecheck-specs: no tsconfig.spec.json found – glob broken?');
  process.exit(1);
}

const failures = [];
let started = 0;

async function worker() {
  while (started < configs.length) {
    const config = configs[started++];
    try {
      await execFileAsync('pnpm', ['exec', 'tsc', '--noEmit', '-p', config]);
    } catch (error) {
      failures.push(`${config}\n${error.stdout ?? ''}${error.stderr ?? ''}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

if (failures.length > 0) {
  console.error(`typecheck-specs: ${failures.length} of ${configs.length} spec tsconfigs failed:\n`);
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}
console.log(`typecheck-specs: ${configs.length} spec tsconfigs clean.`);
