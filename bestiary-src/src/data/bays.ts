/**
 * Painted hall bays. Each plate is a 16:9 foreground with transparent openings.
 * Day and night are separate generations; their polygons are close, not equal.
 */
import day1 from './bays/day/bay1.json';
import day2 from './bays/day/bay2.json';
import day3 from './bays/day/bay3.json';
import night1 from './bays/night/bay1.json';
import night2 from './bays/night/bay2.json';
import night3 from './bays/night/bay3.json';
import { findCreature, idleUrl, posterUrl, roster } from './house';
import { SPECIMEN_COLLARS } from './upgrade5';

export type BayPoint = [number, number];

export type BayBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Clip path in percentages of the opening's own box, pulled a hair inside the hole. */
  clip: string;
};

type RawOpening = {
  id: string;
  kind: 'window' | 'rose';
  side: 'left' | 'right' | 'center';
  depth: number | null;
  polygon: number[][];
  arch?: { sillY?: number };
  /** Stained glass painted in the foreground. The hole is not an opening. */
  glazed?: boolean;
};

type RawBay = {
  width: number;
  height: number;
  openings: RawOpening[];
  doorway?: { center?: number[]; innerBbox?: number[] } | null;
};

export type SceneSlot = {
  id: string;
  kind: 'creature' | 'portal' | 'rose';
  side: 'left' | 'right' | 'center';
  depth: number | null;
  name: string;
  mark: string;
  /** Appendix E sub-plaque — floor-side only; never across the aperture. */
  subPlaque: string;
  href: string | null;
  slug: string | null;
  poster: string | null;
  idle: string | null;
  glow: string;
  /** Painted glass in the foreground plate. Do not punch this opening. */
  glazed: boolean;
  day: BayBox;
  night: BayBox;
};

export type SceneBay = {
  n: number;
  numeral: string;
  /** Short aria / control title. */
  wardShort: string;
  /** Full Ward header with physics parenthetical (canonical engraved form). */
  wardFull: string;
  daySrc: string;
  nightSrc: string;
  doorDay: [number, number] | null;
  doorNight: [number, number] | null;
  /** Width of the bright passage, as a fraction of the plate. */
  doorDayW: number | null;
  doorNightW: number | null;
  /** Night tracery overlay. Null when the rose is already painted into the plate. */
  roseNight: BayBox | null;
  slots: SceneSlot[];
};

/** Upgrade 5 — Three Ward headers (canonical). */
export const WARD_HEADERS: Record<1 | 2 | 3, { short: string; full: string }> = {
  1: {
    short: 'Bay the First · Of Changed Blood and Heavy Flesh',
    full: 'Ward the First · The Menagerie of Changed Flesh (Where the Living Web and the Limestone Vat are bound in blood and breath)',
  },
  2: {
    short: 'Bay the Second · Of Clay, Horn, and the Upper Air',
    full: 'Ward the Second · The Open Crossing (Where inert Clay and agitated Horn give way to the unroofed apertures of the Vault and the Sealed Light)',
  },
  3: {
    short: 'Bay the Third · Of Vessels Sealed, Decoyed, and Unhoused',
    full: "Ward the Third · The Leaded Chancel (Where that which has no bone—Fire, Decoy, Echo, and Dream—is kept under seal beside the Clerks' Books)",
  },
};

/** Appendix E arch sub-plaques keyed by mark. */
export const ARCH_SUBPLAQUES: Record<string, string> = {
  'F.1': 'Depth 65 (Limestone) · Answered by The Witch',
  'F.2': 'Depth 55 (Shale) · Answered by The Enchantress',
  'F.3': 'Altitude 40 (The Vault) · Answered by The Druid',
  'F.4': 'Altitude 40 (The Vault) · Answered by The Druid',
  'F.5': 'Depth 65 (Limestone) · Answered by The Witch',
  'F.6': 'Depth 75 (Basalt) · Answered by The Warlock',
  'F.7': 'Depth 90 (Granite) · Answered by The Necromancer',
  'F.8': 'Altitude 80 (The Vault) · Answered by The Paladin',
  'F.9': 'On the Horizon · Answered by The Sorcerer',
  'U.1': 'Altitude 55 (The Vault) · Answered by The Shaman',
  'U.2': 'Altitude 75 (The Vault) · Answered by The Wizard',
  'U.3': 'Altitude 100 (The Sealed Light) · Answered by The Cleric',
  'U.4': 'On the Horizon · Answered by The Alchemist',
  'U.5': 'Depth 90 (Granite) · Answered by The Necromancer',
  'U.6': 'Depth 35 (Loess) · Answered by The Bard',
  'U.7': 'Depth 75 (Basalt) · Answered by The Warlock',
};

const NUMERALS = ['I', 'II', 'III'];
const BAY_SRC = '/magic-registry/bestiary/bays';
export const ROSE_FRAME = '/magic-registry/bestiary/hall/rose-frame.webp';

const PORTALS = [
  {
    slug: 'field-reports',
    name: 'The Field Reports',
    mark: 'Folio',
    href: 'field-reports/',
    glow: '#e2b15a',
  },
  {
    slug: 'journal',
    name: 'The Journal',
    mark: 'Ledger',
    href: 'journal/',
    glow: '#9eb6e8',
  },
];

const PLATE_W = 2048;
const PLATE_H = 1152;
/** The keyed hole sits outside the traced polygon. Grow the clip so paint covers the seam. */
const COVER_PX = 20;

function coveredPolygon(polygon: BayPoint[]): BayPoint[] {
  const cx = polygon.reduce((sum, point) => sum + point[0], 0) / polygon.length;
  const cy = polygon.reduce((sum, point) => sum + point[1], 0) / polygon.length;
  return polygon.map((point) => {
    const px = (point[0] - cx) * PLATE_W;
    const py = (point[1] - cy) * PLATE_H;
    const mag = Math.hypot(px, py) || 1;
    return [point[0] + (px / mag) * (COVER_PX / PLATE_W), point[1] + (py / mag) * (COVER_PX / PLATE_H)];
  });
}

/** Bounding box plus a clip-path. The clip runs under the stone so the page does not show through the key. */
export function openingFrame(polygon: BayPoint[]): BayBox {
  const covered = coveredPolygon(polygon);
  const xs = covered.map((point) => point[0]);
  const ys = covered.map((point) => point[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(Math.max(...xs) - x, 0.001);
  const h = Math.max(Math.max(...ys) - y, 0.001);
  const clip = covered
    .map((point) => `${(((point[0] - x) / w) * 100).toFixed(2)}% ${(((point[1] - y) / h) * 100).toFixed(2)}%`)
    .join(', ');
  return { x, y, w, h, clip };
}

function doorOf(raw: RawBay): [number, number] | null {
  const center = raw.doorway?.center;
  if (!center || center.length < 2) return null;
  return [center[0], center[1]];
}

function doorWidth(raw: RawBay): number | null {
  const box = raw.doorway?.innerBbox;
  if (!box || box.length < 4) return null;
  const width = box[2] - box[0];
  return width > 0 ? Math.round(width * 10000) / 10000 : null;
}

function isPortal(bay: number, opening: RawOpening) {
  return bay === 3 && opening.kind === 'window' && opening.depth === 2;
}

export function sceneBays(): SceneBay[] {
  const creatures = roster();
  let cursor = 0;
  let portal = 0;
  const pairs: Array<[RawBay, RawBay, number]> = [
    [day1 as RawBay, night1 as RawBay, 1],
    [day2 as RawBay, night2 as RawBay, 2],
    [day3 as RawBay, night3 as RawBay, 3],
  ];
  return pairs.map(([day, night, n]) => {
    const nightById = new Map(night.openings.map((opening) => [opening.id, opening]));
    const slots: SceneSlot[] = day.openings.map((opening) => {
      const twin = nightById.get(opening.id) ?? opening;
      const dayBox = openingFrame(opening.polygon as BayPoint[]);
      const nightBox = openingFrame(twin.polygon as BayPoint[]);
      if (opening.kind === 'rose') {
        return {
          id: opening.id,
          kind: 'rose',
          side: 'center',
          depth: null,
          name: 'Rose window',
          mark: '',
          subPlaque: '',
          href: null,
          slug: null,
          poster: null,
          idle: null,
          glow: '#e2c27a',
          glazed: Boolean(opening.glazed),
          day: dayBox,
          night: nightBox,
        };
      }
      if (isPortal(n, opening)) {
        const gate = PORTALS[portal++] ?? PORTALS[0];
        return {
          id: opening.id,
          kind: 'portal',
          side: opening.side,
          depth: opening.depth,
          name: gate.name,
          mark: gate.mark,
          subPlaque: '',
          href: gate.href,
          slug: gate.slug,
          poster: null,
          idle: null,
          glow: gate.glow,
          glazed: false,
          day: dayBox,
          night: nightBox,
        };
      }
      const creature = creatures[cursor++];
      const state = creature?.states[0] ?? '';
      const found = creature ? findCreature(creature.slug) : null;
      const mark = found?.entity.mark ?? '';
      const collar = creature ? SPECIMEN_COLLARS[creature.slug] : undefined;
      return {
        id: opening.id,
        kind: 'creature',
        side: opening.side,
        depth: opening.depth,
        name: found?.entity.name ?? creature?.slug ?? 'Window',
        mark,
        subPlaque: ARCH_SUBPLAQUES[mark] ?? (collar ? `${collar.groundStratum} · Answered by ${collar.answeringPractitioner}` : ''),
        href: creature ? `${creature.slug}/` : null,
        slug: creature?.slug ?? null,
        poster: creature ? posterUrl(creature.slug, state) : null,
        idle: creature ? idleUrl(creature.slug, state) : null,
        glow: found?.frame.glow ?? '#e2c27a',
        glazed: false,
        day: dayBox,
        night: nightBox,
      };
    });
    const rose = slots.find((slot) => slot.kind === 'rose') ?? null;
    const ward = WARD_HEADERS[n as 1 | 2 | 3];
    return {
      n,
      numeral: NUMERALS[n - 1] ?? String(n),
      wardShort: ward.short,
      wardFull: ward.full,
      daySrc: `${BAY_SRC}/day/bay${n}.webp`,
      nightSrc: `${BAY_SRC}/night/bay${n}.webp`,
      doorDay: doorOf(day),
      doorNight: doorOf(night),
      doorDayW: doorWidth(day),
      doorNightW: doorWidth(night),
      roseNight: rose && !rose.glazed ? rose.night : null,
      slots,
    };
  });
}
