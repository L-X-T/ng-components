// Rewrites the `sources` of every source map in the built package so no path
// points outside the package. ng-packagr records workspace-relative paths
// (`../../../../libs/ng-components/select/src/…`); after the rewrite they read
// `ng-components/select/src/…`, resolved inside the package. The original code
// stays available through `sourcesContent`.
//
// Usage: node libs/ng-components/tools/rewrite-source-maps.mjs (after ng-packagr)
import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const libraryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = resolve(libraryRoot, '../../dist/libs/ng-components');
const mapFiles = globSync('**/*.map', { cwd: packageRoot });

if (mapFiles.length === 0) {
  console.error(`rewrite-source-maps: no source maps in ${packageRoot} – build the package first.`);
  process.exit(1);
}

for (const mapFile of mapFiles) {
  const mapPath = join(packageRoot, mapFile);
  const sourceMap = JSON.parse(readFileSync(mapPath, 'utf-8'));
  sourceMap.sources = sourceMap.sources.map((source) => {
    const sourcePath = resolve(dirname(mapPath), source);
    const libraryPath = relative(libraryRoot, sourcePath);
    if (libraryPath.startsWith('..')) {
      throw new Error(`rewrite-source-maps: ${mapFile} references ${source}, outside the library.`);
    }
    return `ng-components/${libraryPath}`;
  });
  writeFileSync(mapPath, JSON.stringify(sourceMap));
}

console.log(`rewrite-source-maps: ${mapFiles.length} source maps now point inside the package.`);
