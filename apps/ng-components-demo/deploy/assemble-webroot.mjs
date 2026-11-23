// Assembles the webroot of the demo app (spec 003): the prerendered static
// output plus .htaccess, in dist/webroot/designsystem.angular.st/. The upload
// itself is manual and never runs from here – the webspace offers FTPS
// only: upload the folder in one session and verify every file's size.
//
// Usage: nx run ng-components-demo:assemble-webroot (builds first).
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const deployDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(deployDir, '../../..');
const browserDir = join(workspaceRoot, 'dist/apps/ng-components-demo/browser');
const webrootDir = join(workspaceRoot, 'dist/webroot/designsystem.angular.st');

if (!existsSync(join(browserDir, 'index.html'))) {
  console.error(`assemble-webroot: no build output at ${browserDir} – run the build first.`);
  process.exit(1);
}

rmSync(webrootDir, { recursive: true, force: true });
mkdirSync(webrootDir, { recursive: true });
cpSync(browserDir, webrootDir, { recursive: true });
cpSync(join(deployDir, '.htaccess'), join(webrootDir, '.htaccess'));

console.log(`assemble-webroot: assembled ${webrootDir}`);
console.log('assemble-webroot: upload it over FTPS (one session, verify sizes).');
