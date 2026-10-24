export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Exponential approach used by the original specimen loop. */
export const approach = (value: number, target: number, rate: number, dt: number) =>
  value + (target - value) * (1 - Math.exp(-rate * dt));

export const smoothstep = (value: number, edge: number) => {
  const t = clamp(value / edge, 0, 1);
  return t * t * (3 - 2 * t);
};

/** 1 at the origin, 0 at `edge`. Matches the old input smooth. */
export const falloff = (value: number, edge: number) => {
  const t = clamp(value / edge, 0, 1);
  return 1 - t * t * (3 - 2 * t);
};

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
