import { readFile } from 'node:fs/promises';

const audit = await readFile(new URL('../.factory/copy-audit.md', import.meta.url), 'utf8');
const banned = /\b(?:leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|unlock|delightful|journey|ecosystem|AI-powered)\b/i;
const rows = [...audit.matchAll(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*Pass\s*\|$/gm)];

if (rows.length < 20) throw new Error('Copy audit must include the current landing and README sentences.');
for (const [, recorded, rawCopy] of rows) {
  const copy = rawCopy.replace(/`|\*|_+/g, '').trim();
  const actual = copy.split(/\s+/).filter(Boolean).length;
  if (actual !== Number(recorded)) throw new Error(`Copy count mismatch: recorded ${recorded}, found ${actual} in “${copy}”.`);
  if (actual > 22) throw new Error(`Copy exceeds 22 words: “${copy}”.`);
  if (banned.test(copy)) throw new Error(`Copy contains a banned term: “${copy}”.`);
}

console.log(`Copy audit verified ${rows.length} current sentences.`);
