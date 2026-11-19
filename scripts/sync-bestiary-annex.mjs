/**
 * Pathspec sync: copy ONLY Field Reports + Journal (and their hashed assets)
 * from magic-registry/dist into portfolio-site/magic-registry.
 * Never copies Hall, specimen leaves, walls, or windows.
 */
import { copyFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, '..', 'magic-registry', 'dist');
const ship = join(root, 'magic-registry');

const pages = ['bestiary/field-reports/index.html', 'bestiary/journal/index.html'];

function copy(rel) {
  const src = join(dist, rel);
  const dst = join(ship, rel);
  if (!existsSync(src)) throw new Error(`missing ${src}`);
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  console.log('copied', rel);
}

let blob = '';
for (const page of pages) {
  copy(page);
  blob += readFileSync(join(dist, page), 'utf8') + '\n';
}

const assets = [...blob.matchAll(/\/magic-registry\/(assets\/[^"\s]+)/g)].map((m) => m[1]);
for (const a of [...new Set(assets)]) copy(a);

const hall = readFileSync(join(ship, 'bestiary/index.html'), 'utf8');
if (!hall.includes('id="nave"') || hall.includes('body class="containment"')) {
  throw new Error('FAIL: Hall nave clobbered or missing after annex sync');
}
console.log('ok: nave still held');
