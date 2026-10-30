/** Pointer trails for nave leaf life — fine pointer only; reduced-motion skips. */

type Teardown = () => void;

interface Point {
  x: number;
  y: number;
  t: number;
}

const CONTROL = 'a, button, summary, label, [role="button"], input, select, textarea, .house-bar';

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

export function lineTrail(
  layer: SVGSVGElement,
  o: { stroke: string; width: number; life: number; burr?: string },
): Teardown {
  const path = svgEl('path', {
    fill: 'none',
    stroke: o.stroke,
    'stroke-width': o.width,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  const burr = o.burr
    ? svgEl('path', {
        fill: 'none',
        stroke: o.burr,
        'stroke-width': Math.max(0.5, o.width * 0.5),
        'stroke-linecap': 'round',
        transform: 'translate(1.2 1)',
      })
    : undefined;
  if (burr) layer.append(burr);
  layer.append(path);
  let points: Point[] = [];
  let frame = 0;
  const draw = () => {
    frame = 0;
    const now = performance.now() / 1000;
    points = points.filter((p) => now - p.t < o.life);
    if (points.length < 2) {
      path.setAttribute('d', '');
      burr?.setAttribute('d', '');
      return;
    }
    let d = `M${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`;
    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i]!;
      const n = points[i + 1]!;
      d += `Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${((p.x + n.x) / 2).toFixed(1)} ${((p.y + n.y) / 2).toFixed(1)}`;
    }
    const last = points[points.length - 1]!;
    d += `L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    path.setAttribute('d', d);
    burr?.setAttribute('d', d);
    const age = now - points[0]!.t;
    path.style.opacity = String(Math.max(0.15, 1 - age / o.life));
    frame = requestAnimationFrame(draw);
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (e.target instanceof Element && e.target.closest(CONTROL)) return;
    points.push({ x: e.clientX, y: e.clientY, t: performance.now() / 1000 });
    if (points.length > 48) points.shift();
    if (!frame) frame = requestAnimationFrame(draw);
  };
  addEventListener('pointermove', move, { passive: true });
  return () => {
    removeEventListener('pointermove', move);
    cancelAnimationFrame(frame);
    path.remove();
    burr?.remove();
  };
}

export function moteTrail(
  layer: HTMLElement,
  o: { className: string; every: number; most: number; life: number },
): Teardown {
  let travelled = 0;
  let last: { x: number; y: number } | undefined;
  const move = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (e.target instanceof Element && e.target.closest(CONTROL)) return;
    if (!last) {
      last = { x: e.clientX, y: e.clientY };
      return;
    }
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    travelled += Math.hypot(dx, dy);
    last = { x: e.clientX, y: e.clientY };
    if (travelled < o.every) return;
    travelled = 0;
    while (layer.childElementCount >= o.most) layer.firstElementChild?.remove();
    const mote = document.createElement('span');
    mote.className = o.className;
    mote.style.left = `${e.clientX}px`;
    mote.style.top = `${e.clientY}px`;
    layer.append(mote);
    window.setTimeout(() => mote.remove(), o.life);
  };
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}

const TRAILS: Record<string, (layer: HTMLElement | SVGSVGElement) => Teardown> = {
  unicorn: (layer) =>
    lineTrail(layer as SVGSVGElement, { stroke: '#9b1c1c', width: 1.4, life: 0.55, burr: '#5c1010' }),
  fae: (layer) =>
    lineTrail(layer as SVGSVGElement, { stroke: '#d4af37', width: 1.2, life: 0.5, burr: '#8a7020' }),
  succubus: (layer) =>
    lineTrail(layer as SVGSVGElement, { stroke: '#2a1810', width: 1.6, life: 0.45 }),
  kitsune: (layer) =>
    moteTrail(layer as HTMLElement, { className: 'foxfire-spark', every: 28, most: 14, life: 700 }),
  orc: (layer) =>
    moteTrail(layer as HTMLElement, { className: 'orc-spore', every: 36, most: 12, life: 900 }),
  golem: (layer) =>
    moteTrail(layer as HTMLElement, { className: 'spark', every: 22, most: 16, life: 500 }),
};

/** Mount a body-level cursor trail for the room; no-op under reduced motion or coarse pointer. */
export function mountTrail(slug: string): Teardown {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (!matchMedia('(pointer: fine)').matches) return () => {};
  const factory = TRAILS[slug];
  if (!factory) return () => {};
  const svg = slug === 'kitsune' || slug === 'orc' || slug === 'golem' ? false : true;
  const layer = svg
    ? svgEl('svg', { focusable: 'false', class: 'cursor-trail', 'data-cursor': slug })
    : Object.assign(document.createElement('div'), { className: 'cursor-trail' });
  if (!svg) (layer as HTMLElement).setAttribute('data-cursor', slug);
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const stop = factory(layer);
  return () => {
    stop();
    layer.remove();
  };
}
