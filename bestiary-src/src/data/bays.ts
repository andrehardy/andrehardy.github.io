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
};

type RawBay = {
  width: number;
  height: number;
  openings: RawOpening[];
  doorway?: { center?: number[] } | null;
};

export type SceneSlot = {
  id: string;
  kind: 'creature' | 'portal' | 'rose';
  side: 'left' | 'right' | 'center';
  depth: number | null;
  name: string;
  mark: string;
  href: string | null;
  slug: string | null;
  poster: string | null;
  idle: string | null;
  glow: string;
  day: BayBox;
  night: BayBox;
};

export type SceneBay = {
  n: number;
  numeral: string;
  daySrc: string;
  nightSrc: string;
  doorDay: [number, number] | null;
  doorNight: [number, number] | null;
  roseNight: BayBox | null;
  slots: SceneSlot[];
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

/** Bounding box plus a clip-path. The clip sits just inside the polygon so paint covers the seam. */
export function openingFrame(polygon: BayPoint[]): BayBox {
  const xs = polygon.map((point) => point[0]);
  const ys = polygon.map((point) => point[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(Math.max(...xs) - x, 0.001);
  const h = Math.max(Math.max(...ys) - y, 0.001);
  const cx = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const cy = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  const clip = polygon
    .map((point) => {
      const ix = point[0] + (cx - point[0]) * 0.02;
      const iy = point[1] + (cy - point[1]) * 0.02;
      return `${(((ix - x) / w) * 100).toFixed(2)}% ${(((iy - y) / h) * 100).toFixed(2)}%`;
    })
    .join(', ');
  return { x, y, w, h, clip };
}

function doorOf(raw: RawBay): [number, number] | null {
  const center = raw.doorway?.center;
  if (!center || center.length < 2) return null;
  return [center[0], center[1]];
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
          href: null,
          slug: null,
          poster: null,
          idle: null,
          glow: '#e2c27a',
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
          href: gate.href,
          slug: gate.slug,
          poster: null,
          idle: null,
          glow: gate.glow,
          day: dayBox,
          night: nightBox,
        };
      }
      const creature = creatures[cursor++];
      const state = creature?.states[0] ?? '';
      const found = creature ? findCreature(creature.slug) : null;
      return {
        id: opening.id,
        kind: 'creature',
        side: opening.side,
        depth: opening.depth,
        name: found?.entity.name ?? creature?.slug ?? 'Window',
        mark: found?.entity.mark ?? '',
        href: creature ? `${creature.slug}/` : null,
        slug: creature?.slug ?? null,
        poster: creature ? posterUrl(creature.slug, state) : null,
        idle: creature ? idleUrl(creature.slug, state) : null,
        glow: found?.frame.glow ?? '#e2c27a',
        day: dayBox,
        night: nightBox,
      };
    });
    const rose = slots.find((slot) => slot.kind === 'rose') ?? null;
    return {
      n,
      numeral: NUMERALS[n - 1] ?? String(n),
      daySrc: `${BAY_SRC}/day/bay${n}.webp`,
      nightSrc: `${BAY_SRC}/night/bay${n}.webp`,
      doorDay: doorOf(day),
      doorNight: doorOf(night),
      roseNight: rose?.night ?? null,
      slots,
    };
  });
}
