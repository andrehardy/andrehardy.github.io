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
// Painted hall plates. A plain file stands in for both day and night until
// <name>-day / <name>-night variants are dropped beside it.
const HALL_PLATES = [
  ['nave', ['nave-back', 'nave']],
  ['wall', ['wall-tile', 'wall']],
  ['floor', ['floor']],
  ['vault', ['vault']],
  ['arch', ['arch-frame-hall', 'arch']],
  ['rose', ['rose-frame', 'rose']],
];
const LAYER_EXT = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];
const HALL_MASK = '/magic-registry/bestiary/frames/hall/opening-mask.png';
const HALL_HOLE = { x: 0.2488, y: 0.1675, w: 0.4989, h: 0.7301 };
const servedHall = join(repo, 'magic-registry/bestiary/hall');
const dropHall = join(repo, 'magic-registry/public/bestiary/hall');
const servedBays = join(repo, 'magic-registry/bestiary/bays');
const dropBays = join(repo, 'magic-registry/public/bestiary/bays');

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

function splitName(file) {
  const ext = extname(file).toLowerCase();
  return { ext, stem: file.slice(0, file.length - ext.length) };
}

function transitionEnds(stem) {
  const match = stem.match(/^t?\d*-?(.+)-to-(.+)$/);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

function parseAssets(files, states) {
  const posters = Object.fromEntries(states.map((state) => [state, null]));
  const idles = Object.fromEntries(states.map((state) => [state, null]));
  const idlePosters = Object.fromEntries(states.map((state) => [state, null]));
  const stills = Object.fromEntries(states.map((state) => [state, []]));
  const clips = new Map();
  const ignored = [];

  const clipFor = (from, to) => {
    const key = `${from}\0${to}`;
    if (!clips.has(key)) clips.set(key, { from, to, file: null, poster: null });
    return clips.get(key);
  };

  for (const file of files) {
    const { ext, stem } = splitName(file);
    if (IMAGE.has(ext)) {
      if (stem.endsWith('-poster')) {
        const base = stem.slice(0, -'-poster'.length);
        const idle = base.match(/^idle-(.+)$/);
        if (idle && idle[1] in idlePosters) {
          idlePosters[idle[1]] = file;
          continue;
        }
        const ends = transitionEnds(base);
        if (ends && states.includes(ends.from) && states.includes(ends.to)) {
          clipFor(ends.from, ends.to).poster = file;
          continue;
        }
        ignored.push(file);
        continue;
      }
      const numbered = stem.match(/^(\d+)-(.+)$/);
      const state = numbered ? numbered[2] : stem;
      if (state in stills) stills[state].push(file);
      else if (!FRAME_NAMES.includes(file) && !MASK_NAMES.includes(file)) ignored.push(file);
      continue;
    }
    if (ext === '.mp4') {
      const idle = stem.match(/^idle-(.+)$/);
      if (idle && idle[1] in idles) {
        idles[idle[1]] = file;
        continue;
      }
      const ends = transitionEnds(stem);
      if (ends && states.includes(ends.from) && states.includes(ends.to)) {
        clipFor(ends.from, ends.to).file = file;
        continue;
      }
      ignored.push(file);
    }
  }
  for (const state of states) {
    const matches = stills[state].slice().sort();
    if (matches.length) posters[state] = matches[0];
  }
  const transitions = [...clips.values()].filter((item) => item.file);
  return { posters, idles, idlePosters, transitions, ignored };
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

async function gatherHall() {
  await mkdir(servedHall, { recursive: true });
  await mkdir(dropHall, { recursive: true });
  for (const name of await listFiles(dropHall)) {
    if (name.startsWith('.')) continue;
    await copyFile(join(dropHall, name), join(servedHall, name));
  }
  return listFiles(servedHall);
}

/** Painted full-scene bays. Day and night are separate files. */
async function gatherBays() {
  for (const phase of ['day', 'night']) {
    const from = join(dropBays, phase);
    const to = join(servedBays, phase);
    await mkdir(to, { recursive: true });
    for (const name of await listFiles(from)) {
      if (!name.endsWith('.webp')) continue;
      await copyFile(join(from, name), join(to, name));
    }
  }
}

function findNamed(files, names, suffix) {
  for (const name of names) {
    for (const ext of LAYER_EXT) {
      const file = `${name}${suffix}${ext}`;
      if (files.includes(file)) return `/magic-registry/bestiary/hall/${file}`;
    }
  }
  return null;
}

function resolvePlate(files, names) {
  const day = findNamed(files, names, '-day') ?? findNamed(files, names, '');
  const night = findNamed(files, names, '-night') ?? day;
  return { day, night };
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
  // Keep the delivered filenames. A catalogue state with no still borrows another
  // state's still in the manifest (the wisp's decoy is the shimmer plate).
  if (!parsed.posters.decoy && parsed.posters.shimmer && spec.states.includes('decoy') && spec.states.includes('shimmer')) {
    parsed.posters.decoy = parsed.posters.shimmer;
  }
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
    idlePosters: Object.fromEntries(
      spec.states.map((state) => [state, parsed.idlePosters[state] ? urlFor(slug, parsed.idlePosters[state]) : null]),
    ),
    transitions: parsed.transitions.map((item) => ({
      from: item.from,
      to: item.to,
      src: urlFor(slug, item.file),
      poster: item.poster ? urlFor(slug, item.poster) : null,
    })),
    plates,
    frame: {
      ...spec.frame,
      overlay: frameFile ? urlFor(slug, frameFile) : `${base}/frame.svg`,
      mask: maskFile ? urlFor(slug, maskFile) : `${base}/mask.svg`,
    },
  };
  const missing = spec.states.filter((state) => !parsed.posters[state]);
  if (missing.length || parsed.ignored.length) {
    console.log(`${slug}: missing [${missing.join(', ')}] ignored [${parsed.ignored.join(', ')}]`);
  }
  void indexOfState;
}

const hallFiles = await gatherHall();
await gatherBays();
const layers = Object.fromEntries(HALL_PLATES.map(([key, names]) => [key, resolvePlate(hallFiles, names)]));
const archDay = layers.arch.day ?? '/magic-registry/bestiary/frames/hall/frame.svg';
const archNight = layers.arch.night ?? archDay;

manifest.hall = {
  shape: 'round',
  material: 'limestone',
  ornament: 'leaf',
  sill: 'Limestone',
  overlay: archDay,
  overlayNight: archNight,
  mask: HALL_MASK,
  hole: HALL_HOLE,
  layers,
};

await mkdir(dirname(join(root, 'src/data/manifest.json')), { recursive: true });
await writeFile(join(root, 'src/data/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const withArt = slugs.filter((slug) => Object.values(manifest.creatures[slug].posters).some(Boolean));
const withHall = HALL_PLATES.map(([key]) => key).filter((layer) => layers[layer].day || layers[layer].night);
console.log(`manifest: ${slugs.length} creatures, ${withArt.length} with posters, hall layers: ${withHall.join(', ') || 'none yet'}`);
for (const [key] of HALL_PLATES) {
  const plate = layers[key];
  console.log(`  ${key}: day ${plate.day ? 'yes' : 'no'}, night ${plate.night && plate.night !== plate.day ? 'own' : plate.night ? 'stand-in' : 'no'}`);
}
