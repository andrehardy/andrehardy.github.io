/**
 * Port Edition II room.css into the nave with a token bridge and selector aliases
 * so B11 architecture (niches, brass band, labyrinth…) lands on bestiary-src DOM.
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const srcRooms = join(root, '../../../magic-registry/src/bestiary/rooms');
const destDir = join(root, '../src/styles/rooms');
mkdirSync(destDir, { recursive: true });

const bridge = `/* Auto-ported from magic-registry B11 room.css — do not hand-edit; re-run port-room-css.mjs */
`;

const aliases = [
  // Nave wraps the specimen as the architectural case opening
  [/\.leaf\s*>\s*\.room\b/g, '.leaf > .case-bay'],
  [/\.leaf\s*>\s*\.room-head\b/g, '.leaf > .creature-head'],
  [/\.room-head\b/g, '.creature-head'],
  // Inscriptions sit under .prose, not as direct leaf children
  [/\.leaf\s*>\s*\[data-frame/g, '.leaf [data-frame'],
  [/\.leaf\s*>\s*:is\(section/g, '.leaf :is(section'],
  [/\.leaf\s*>\s*:nth-child/g, '.leaf .room-stack > :nth-child'],
  // Containment specimen case → nave window
  [/\.specimen\s+\.case\b/g, '.specimen .window'],
  [/\.specimen\s+\.stage\b/g, '.specimen .window-stage'],
];

const rooms = readdirSync(srcRooms, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const imports = [];
for (const slug of rooms) {
  const from = join(srcRooms, slug, 'room.css');
  let css = readFileSync(from, 'utf8');
  for (const [re, to] of aliases) css = css.replace(re, to);
  const out = join(destDir, `${slug}.css`);
  writeFileSync(out, bridge + css);
  imports.push(`import './rooms/${slug}.css';`);
  console.log('ported', slug, css.length);
}

writeFileSync(
  join(root, '../src/styles/rooms.css'),
  `/* All sixteen B11 room architectures on the nave. */\n${imports.join('\n')}\n`,
);
console.log('wrote rooms.css with', imports.length, 'imports');
