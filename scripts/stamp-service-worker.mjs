import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';

const distDirectory = new URL('../dist/', import.meta.url);
const assetDirectory = new URL('assets/', distDirectory);
const workerPath = new URL('sw.js', distDirectory);
const assetNames = (await readdir(assetDirectory))
  .filter(name => /\.(?:css|js|webp)$/.test(name))
  .sort();

if (!assetNames.some(name => /^app-[A-Za-z0-9_-]+\.js$/.test(name))) {
  throw new Error('The production JavaScript bundle is not content hashed.');
}
if (!assetNames.some(name => /^index-[A-Za-z0-9_-]+\.css$/.test(name))) {
  throw new Error('The production CSS bundle is not content hashed.');
}

const shell = [
  '/', '/demo', '/privacy', '/terms', '/offline.html', '/simple.css',
  '/manifest.webmanifest', '/icon.svg',
  ...assetNames.map(name => `/assets/${name}`)
];
const version = createHash('sha256').update(shell.join('\n')).digest('hex').slice(0, 12);
const source = await readFile(workerPath, 'utf8');
const stamped = source
  .replace("const VERSION = 'sidecar-development';", `const VERSION = 'sidecar-${version}';`)
  .replace(/const SHELL = \[[\s\S]*?\];/, `const SHELL = ${JSON.stringify(shell)};`);

if (stamped === source || stamped.includes('sidecar-development')) {
  throw new Error('The service worker template could not be stamped.');
}
await writeFile(workerPath, stamped);
