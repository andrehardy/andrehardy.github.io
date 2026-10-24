import catalogue from './catalogue.json';
import manifest from './manifest.json';

export type Plate = { almanac: string; cipher: string };

export type Opening = { x: number; y: number; w: number; h: number };

export type Frame = {
  shape: string;
  material: string;
  ornament: string;
  glow: string;
  particle: string;
  sill: string;
  overlay: string;
  overlayNight?: string | null;
  mask: string;
  opening?: Opening;
};

/** World units for the painted nave. Wall length is three tiles; eight windows use the first eight panels. */
export const HALL = {
  tileW: 1500,
  wallH: 844,
  span: 700,
  winW: 280,
  winH: 373,
  tiles: 3,
  centers: [0.175, 0.5, 0.825] as const,
};

export type EntityFile = {
  slug: string;
  title: string;
  description: string;
  og: Record<string, string>;
  name: string;
  mark: string;
  epithet: { almanac: string; cipher: string };
  input: string;
  link: string;
  voice: string;
  setting: string;
  accession: string;
  hooks: string[];
  sections: string[];
};

type Spec = (typeof catalogue)[keyof typeof catalogue];

const entities = import.meta.glob('./entities/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, EntityFile>;

const specs = catalogue as Record<string, Spec>;
type ManifestCreature = (typeof manifest.creatures)[keyof typeof manifest.creatures];
const creatures = manifest.creatures as Record<string, ManifestCreature>;

export type Creature = {
  slug: string;
  entity: EntityFile;
  spec: Spec;
  frame: Frame;
  states: string[];
  plates: Record<string, Plate>;
  readout: boolean;
  depth: number;
  wall: 'north' | 'south';
};

export function roster(): Creature[] {
  return Object.keys(specs).map((slug, index) => {
    const spec = specs[slug];
    const entity = entities[`./entities/${slug}.json`];
    const assets = creatures[slug];
    if (!entity || !assets) throw new Error(`missing creature data for ${slug}`);
    return {
      slug,
      entity,
      spec,
      frame: assets.frame,
      states: [...assets.states],
      plates: assets.plates,
      readout: assets.readout,
      depth: Math.floor(index / 2),
      wall: index % 2 === 0 ? 'north' : 'south',
    };
  });
}

export function findCreature(slug: string) {
  return roster().find((item) => item.slug === slug) ?? null;
}

/** Day and night plates for the nave. Night reuses the day file until a night plate is delivered. */
export function hallLayers() {
  return manifest.hall.layers;
}

/** The nave shares one arch. Glow, motes, and the creature's own opening still belong to it. */
export function hallFrame(glow: string, particle: string, opening?: Opening): Frame {
  return {
    shape: manifest.hall.shape,
    material: manifest.hall.material,
    ornament: manifest.hall.ornament,
    sill: manifest.hall.sill,
    glow,
    particle,
    overlay: manifest.hall.overlay,
    overlayNight: manifest.hall.overlayNight,
    mask: manifest.hall.mask,
    opening,
  };
}

const FALLBACK_HOLE: Opening = { x: 0.2488, y: 0.1675, w: 0.4989, h: 0.7301 };

/** Cover-scale a creature still so its opening fills the hall arch. */
export function hallImagePlace(opening?: Opening | null) {
  const hole = manifest.hall.hole ?? FALLBACK_HOLE;
  const open = opening ?? { x: 0.18, y: 0.08, w: 0.64, h: 0.8 };
  const s = Math.max(hole.w / open.w, hole.h / open.h);
  return {
    x: hole.x + (hole.w - open.w * s) / 2 - open.x * s,
    y: hole.y + (hole.h - open.h * s) / 2 - open.y * s,
    s,
  };
}

export function posterUrl(slug: string, state: string) {
  const assets = creatures[slug];
  if (!assets) return null;
  return assets.posters[state] ?? null;
}

export function idlePosterUrl(slug: string, state: string) {
  const assets = creatures[slug];
  if (!assets) return null;
  return assets.idlePosters[state] ?? null;
}

/** Distance along a wall to the centre of a bay, and the CSS left of its element. */
export function bayMetrics(depth: number, wall: 'north' | 'south') {
  const tile = Math.floor(depth / 3);
  const slot = depth % 3;
  const along = tile * HALL.tileW + HALL.centers[slot] * HALL.tileW;
  const span = HALL.tileW * HALL.tiles;
  const left = wall === 'north' ? along - HALL.winW / 2 : span - along - HALL.winW / 2;
  return { along, left };
}

export function openingCaption(creature: Creature) {
  const state = creature.states[0] ?? '';
  return creature.plates[state] ?? { almanac: state, cipher: state };
}

const PART_ORDER = ['account', 'screen', 'habits', 'neighbour', 'exemplars'];

export function orderedSections(sections: string[]) {
  return [...sections].sort((a, b) => rank(a) - rank(b));
}

function rank(html: string) {
  const part = html.match(/data-part="([^"]+)"/)?.[1] ?? '';
  const index = PART_ORDER.indexOf(part);
  return index < 0 ? PART_ORDER.length : index;
}

/** First-paint geometry for cursor 0. The hall script uses the same curve. */
export function bayPlace(depth: number) {
  const t = Math.min(Math.max(depth, 0) / 3.2, 1);
  const e = t * t * (3 - 2 * t);
  const fade = depth <= -0.55 || depth >= 3.45 ? 0 : depth < 0 ? Math.max(0, 1 + depth / 0.55) : 1;
  return {
    height: 58 + (15 - 58) * e,
    bottom: 15 + (38 - 15) * e,
    inset: 1.2 + (31 - 1.2) * e,
    fade,
    name: depth < 1.25 && depth > -0.2 ? 1 : 0,
    z: Math.round(40 - depth * 6),
    near: depth < 0.6 && depth > -0.2,
    tab: fade > 0.15,
  };
}
