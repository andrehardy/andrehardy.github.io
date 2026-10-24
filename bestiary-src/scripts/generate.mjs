import { mkdir, readdir, readFile, writeFile, copyFile, stat } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frameSvg, maskSvg, hallFrame } from './frames.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const repo = fileURLToPath(new URL('../..', import.meta.url));
const catalogue = JSON.parse(await readFile(join(root, 'src/data/catalogue.json'), 'utf8'));
const entityDir = join(root, 'src/data/entities');
const publicFrames = join(root, 'public/frames');
const servedWindows = join(repo, 'magic-registry/bestiary/windows');
const dropWindows = join(repo, 'magic-registry/public/bestiary/windows');

const IMAGE = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const FRAME_NAMES = ['frame.webp', 'frame.png', 'frame.jpg', 'frame.jpeg', 'frame.svg'];
const MASK_NAMES = ['mask.webp', 'mask.png', 'mask.jpg', 'mask.jpeg', 'mask.svg'];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir) {
  if (!(await exists(dir))) return [];
  const out = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isFile()) out.push(name);
  }
  return out;
}

async function ensurePlaceholder(slug, frame) {
  const dir = join(publicFrames, slug);
  await mkdir(dir, { recursive: true });
  const svg = slug === 'hall' ? hallFrame() : frameSvg(slug, frame);
  const mask = maskSvg(frame.shape);
  await writeFile(join(dir, 'frame.svg'), svg);
  await writeFile(join(dir, 'mask.svg'), mask);
}

function indexOfState(states, name) {
  return states.indexOf(name);
}

function parseAssets(files, states) {
  const posters = Object.fromEntries(states.map((state) => [state, null]));
  const idles = Object.fromEntries(states.map((state) => [state, null]));
  const transitions = [];
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const stem = file.slice(0, file.length - ext.length);
    if (IMAGE.has(ext)) {
      const numbered = stem.match(/^(\d+)-(.+)$/);
      const state = numbered ? numbered[2] : stem;
      if (state in posters) posters[state] = file;
      continue;
    }
    if (ext === '.mp4') {
      const idle = stem.match(/^idle-(.+)$/);
      if (idle && idle[1] in idles) {
        idles[idle[1]] = file;
        continue;
      }
      const transition = stem.match(/^t?\d*-?(.+)-to-(.+)$/) || stem.match(/^(.+)-to-(.+)$/);
      if (transition) {
        const from = transition[1];
        const to = transition[2];
        if (states.includes(from) && states.includes(to)) transitions.push({ from, to, file });
      }
    }
  }
  // Prefer the numbered poster when several match; the scan above keeps the last.
  // Re-scan so 01-state wins over a bare name if both exist, and lower numbers win.
  for (const state of states) {
    const matches = files.filter((file) => {
      const ext = extname(file).toLowerCase();
      if (!IMAGE.has(ext)) return false;
      const stem = file.slice(0, file.length - ext.length);
      return stem === state || stem.endsWith(`-${state}`);
    });
    matches.sort();
    if (matches.length) posters[state] = matches[0];
  }
  return { posters, idles, transitions };
}

async function gather(slug) {
  const served = join(servedWindows, slug);
  const drop = join(dropWindows, slug);
  await mkdir(served, { recursive: true });
  if (await exists(drop)) {
    for (const name of await listFiles(drop)) {
      await copyFile(join(drop, name), join(served, name));
    }
  }
  return listFiles(served);
}

function urlFor(slug, file) {
  return `/magic-registry/bestiary/windows/${slug}/${file}`;
}

const slugs = Object.keys(catalogue);
if (slugs.length !== 16) throw new Error(`expected 16 creatures, found ${slugs.length}`);

await ensurePlaceholder('hall', { shape: 'round', material: 'limestone', ornament: 'leaf' });

const manifest = { hall: null, creatures: {} };

for (const slug of slugs) {
  const spec = catalogue[slug];
  await ensurePlaceholder(slug, spec.frame);
  const files = await gather(slug);
  const parsed = parseAssets(files, spec.states);
  const entity = JSON.parse(await readFile(join(entityDir, `${slug}.json`), 'utf8'));
  const plates = {};
  for (const plate of entity.plates ?? []) plates[plate.name] = { almanac: plate.almanac, cipher: plate.cipher };
  for (const note of entity.stateNotes ?? []) {
    if (!plates[note.name]) plates[note.name] = { almanac: note.almanac, cipher: note.cipher };
  }
  const frameFile = FRAME_NAMES.find((name) => files.includes(name));
  const maskFile = MASK_NAMES.find((name) => files.includes(name));
  const base = `/magic-registry/bestiary/frames/${slug}`;
  manifest.creatures[slug] = {
    states: spec.states,
    captionAlias: spec.captionAlias ?? {},
    readout: Boolean(spec.readout),
    posters: Object.fromEntries(
      spec.states.map((state) => [state, parsed.posters[state] ? urlFor(slug, parsed.posters[state]) : null]),
    ),
    idles: Object.fromEntries(
      spec.states.map((state) => [state, parsed.idles[state] ? urlFor(slug, parsed.idles[state]) : null]),
    ),
    transitions: parsed.transitions.map((item) => ({
      from: item.from,
      to: item.to,
      src: urlFor(slug, item.file),
    })),
    plates,
    frame: {
      ...spec.frame,
      overlay: frameFile ? urlFor(slug, frameFile) : `${base}/frame.svg`,
      mask: maskFile ? urlFor(slug, maskFile) : `${base}/mask.svg`,
    },
  };
  void indexOfState;
}

manifest.hall = {
  shape: 'round',
  material: 'limestone',
  ornament: 'leaf',
  sill: 'Limestone',
  overlay: '/magic-registry/bestiary/frames/hall/frame.svg',
  mask: '/magic-registry/bestiary/frames/hall/mask.svg',
};

await mkdir(dirname(join(root, 'src/data/manifest.json')), { recursive: true });
await writeFile(join(root, 'src/data/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const withArt = slugs.filter((slug) => Object.values(manifest.creatures[slug].posters).some(Boolean));
console.log(`manifest: ${slugs.length} creatures, ${withArt.length} with posters`);
