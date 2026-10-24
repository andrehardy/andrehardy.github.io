/**
 * Desktop hall, once the painted bays arrive.
 * Three full-scene plates (6, 6 and 4 windows), each with a day file and a
 * night file. Openings are transparent in the painting. This module only
 * describes them; the current nave stays mounted until those files are here.
 * Narrow screens keep the one-card-per-window list.
 */

/** A point in the bay image, origin top-left, each axis 0–1. */
export type BayPoint = [number, number];

export type BayOpening = {
  slug: string;
  polygon: BayPoint[];
};

export type PaintedBay = {
  id: string;
  day: string;
  night: string;
  /** Width / height of the plate. Both variants share it. */
  aspect: number;
  openings: BayOpening[];
};

export type BayBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Clip path in percentages of the opening's own box. */
  clip: string;
};

/** Bounding box of an opening, plus a clip-path that restores the polygon. */
export function openingFrame(polygon: BayPoint[]): BayBox {
  const xs = polygon.map((point) => point[0]);
  const ys = polygon.map((point) => point[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(Math.max(...xs) - x, 0.001);
  const h = Math.max(Math.max(...ys) - y, 0.001);
  const clip = polygon
    .map((point) => `${(((point[0] - x) / w) * 100).toFixed(2)}% ${(((point[1] - y) / h) * 100).toFixed(2)}%`)
    .join(', ');
  return { x, y, w, h, clip };
}
