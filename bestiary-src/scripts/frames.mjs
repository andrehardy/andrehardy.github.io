/**
 * Painted placeholder frames. These are image files (SVG), not CSS borders.
 * A delivered frame.webp / mask.webp in the creature's window folder replaces them.
 */

const MATERIALS = {
  'iron-oak': { stone: '#6d5438', dark: '#2a1c12', lite: '#b08960', gilt: '#e2c27a', joint: '#1a120c', sill: '#4a3422' },
  'black-marble': { stone: '#2a2428', dark: '#100c10', lite: '#5c5158', gilt: '#c9a4a0', joint: '#070506', sill: '#1a1418' },
  moonstone: { stone: '#d9d3e4', dark: '#6d6580', lite: '#f4f1f8', gilt: '#c6b27a', joint: '#8a8298', sill: '#cfc6da' },
  cinnabar: { stone: '#7a2e28', dark: '#3a120e', lite: '#c45a48', gilt: '#f0d090', joint: '#2a0c08', sill: '#5c241c' },
  'fungal-soil': { stone: '#6a4630', dark: '#2c1810', lite: '#a87848', gilt: '#d7b56a', joint: '#1a0e08', sill: '#3d2918' },
  granite: { stone: '#8a8d86', dark: '#3e423c', lite: '#c5c7c0', gilt: '#b7a56a', joint: '#2a2c28', sill: '#6a6e66' },
  brass: { stone: '#8d6230', dark: '#3e260e', lite: '#e6c27a', gilt: '#f3dd9a', joint: '#2a1808', sill: '#6e4a22' },
  limestone: { stone: '#e4d8c4', dark: '#8d7b64', lite: '#f7f1e6', gilt: '#c6a15a', joint: '#6e5e48', sill: '#d5c6ae' },
  labyrinth: { stone: '#5c6a72', dark: '#1c2830', lite: '#a8b6be', gilt: '#d4b46a', joint: '#10181e', sill: '#3e4c54' },
  'gilt-thorn': { stone: '#c6a45a', dark: '#5c4010', lite: '#f3e2a8', gilt: '#fff1c2', joint: '#3a2808', sill: '#a88840' },
  'bog-oak': { stone: '#3a342c', dark: '#16130f', lite: '#6a5e4e', gilt: '#9d8a62', joint: '#0c0a08', sill: '#2a241c' },
  'fire-gold': { stone: '#c4923a', dark: '#5a3208', lite: '#f6d78a', gilt: '#fff0c0', joint: '#3a2004', sill: '#a87428' },
  'brass-smoke': { stone: '#6e5a40', dark: '#241c14', lite: '#c8b48a', gilt: '#e6d2a0', joint: '#12100c', sill: '#4a3c2c' },
  tomb: { stone: '#1e3332', dark: '#0a1414', lite: '#4e6e6c', gilt: '#8fd0c8', joint: '#060c0c', sill: '#142422' },
  ice: { stone: '#d5e6f0', dark: '#7f9aab', lite: '#f7fbfe', gilt: '#e8f4fb', joint: '#5c7888', sill: '#c5d8e4' },
  'rose-stone': { stone: '#c9a090', dark: '#6a4038', lite: '#f0d2c8', gilt: '#e8c27a', joint: '#4a2824', sill: '#b08880' },
};

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function opening(shape) {
  const L = 112;
  const R = 528;
  const base = 812;
  const spring = 508;
  const crown = 128;
  const cx = 320;
  switch (shape) {
    case 'lancet':
      return `M ${L} ${base} V ${spring - 30} C ${L} ${crown + 70}, ${cx - 30} ${crown + 8}, ${cx} ${crown} C ${cx + 30} ${crown + 8}, ${R} ${crown + 70}, ${R} ${spring - 30} V ${base} Z`;
    case 'horseshoe':
      return `M ${L + 28} ${base} V ${spring + 36} A 176 198 0 1 1 ${R - 28} ${spring + 36} V ${base} Z`;
    case 'ogee':
      return `M ${L} ${base} V ${spring} C ${L} ${spring - 180}, ${cx - 170} ${crown + 30}, ${cx} ${crown} C ${cx + 170} ${crown + 30}, ${R} ${spring - 180}, ${R} ${spring} V ${base} Z`;
    case 'trefoil':
      return `M ${L + 8} ${base} V 590 C ${L + 8} 470, ${L + 70} 360, ${cx - 86} 300 C ${cx - 130} 210, ${cx - 70} 150, ${cx} 188 C ${cx + 70} 150, ${cx + 130} 210, ${cx + 86} 300 C ${R - 70} 360, ${R - 8} 470, ${R - 8} 590 V ${base} Z`;
    case 'shouldered':
      return `M ${L} ${base} V 460 H ${L + 46} C ${L + 46} 250, ${cx - 90} 196, ${cx} 184 C ${cx + 90} 196, ${R - 46} 250, ${R - 46} 460 H ${R} V ${base} Z`;
    case 'mihrab':
      return `M ${L + 6} ${base} V ${spring + 20} C ${L + 6} 280, ${cx - 16} ${crown + 24}, ${cx} ${crown - 16} C ${cx + 16} ${crown + 24}, ${R - 6} 280, ${R - 6} ${spring + 20} V ${base} Z`;
    case 'trilithon':
      return `M ${L - 6} ${base} V 268 H ${R + 6} V ${base} Z`;
    case 'torii':
      return `M ${L + 24} ${base} V 318 H ${R - 24} V ${base} Z`;
    case 'wheel':
      return `M ${cx} 168 m -168 0 a 168 168 0 1 0 336 0 a 168 168 0 1 0 -336 0`;
    case 'round':
    default:
      return `M ${L} ${base} V ${spring} A ${(R - L) / 2} ${(R - L) / 2} 0 0 1 ${R} ${spring} V ${base} Z`;
  }
}

function grain(seed, color, dark) {
  const rand = rng(hash(seed));
  let dots = '';
  for (let i = 0; i < 420; i++) {
    const x = rand() * 640;
    const y = rand() * 980;
    const r = 0.4 + rand() * 1.6;
    const fill = rand() > 0.55 ? dark : color;
    const o = (0.08 + rand() * 0.22).toFixed(2);
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}" opacity="${o}"/>`;
  }
  return dots;
}

function motif(kind, x, y, palette, rand) {
  if (kind === 'moon') {
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="none" stroke="${palette.gilt}" stroke-width="1.4"/><circle cx="${(x + 3).toFixed(1)}" cy="${y.toFixed(1)}" r="5.4" fill="${palette.dark}"/>`;
  }
  if (kind === 'mycelium') {
    const x2 = x + (rand() - 0.5) * 18;
    const y2 = y + 28 + rand() * 36;
    return `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${x2.toFixed(1)} ${(y + 16).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${palette.lite}" stroke-width="0.9" opacity="0.9"/>`;
  }
  if (kind === 'frost') {
    return `<path d="M ${x.toFixed(1)} ${(y - 8).toFixed(1)} v 16 M ${(x - 6).toFixed(1)} ${y.toFixed(1)} h 12 M ${(x - 4).toFixed(1)} ${(y - 5).toFixed(1)} l 8 10 M ${(x + 4).toFixed(1)} ${(y - 5).toFixed(1)} l -8 10" fill="none" stroke="${palette.lite}" stroke-width="1"/>`;
  }
  if (kind === 'eye') {
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="5" fill="${palette.dark}" stroke="${palette.gilt}" stroke-width="1"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${palette.gilt}"/>`;
  }
  if (kind === 'horn') {
    return `<path d="M ${(x - 8).toFixed(1)} ${(y + 4).toFixed(1)} q 8 -16 16 0" fill="none" stroke="${palette.gilt}" stroke-width="1.6"/>`;
  }
  if (kind === 'meander') {
    return `<path d="M ${(x - 9).toFixed(1)} ${(y + 4).toFixed(1)} h 6 v -8 h 6 v 8 h 6" fill="none" stroke="${palette.gilt}" stroke-width="1.3"/>`;
  }
  if (kind === 'reed') {
    return `<path d="M ${x.toFixed(1)} ${(y + 16).toFixed(1)} q ${(rand() * 6 - 3).toFixed(1)} -16 ${(rand() * 8 - 4).toFixed(1)} -30" fill="none" stroke="${palette.lite}" stroke-width="1.1" opacity="0.85"/>`;
  }
  if (kind === 'lichen') {
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.2 + rand() * 2.4).toFixed(1)}" fill="#7f8f52" opacity="0.6"/>`;
  }
  if (kind === 'knot') {
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="none" stroke="${palette.gilt}" stroke-width="1.1"/>`;
  }
  if (kind === 'spark') {
    return `<path d="M ${x.toFixed(1)} ${(y - 7).toFixed(1)} v 14 M ${(x - 7).toFixed(1)} ${y.toFixed(1)} h 14" stroke="${palette.gilt}" stroke-width="1" fill="none"/>`;
  }
  return `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} c 6 -9 13 -9 15 0 c -6 9 -13 9 -15 0" fill="${palette.gilt}" opacity="0.92"/>`;
}

/** Carving sits on the jambs, outside every opening, so the hole stays clear for the painting. */
function ornament(kind, palette, seed) {
  const rand = rng(hash(seed + kind));
  const bits = [];
  const rows = kind === 'eye' ? 8 : 11;
  for (let i = 0; i < rows; i++) {
    const y = 210 + (i / (rows - 1)) * 520;
    bits.push(motif(kind, 74, y, palette, rand));
    bits.push(motif(kind, 566, y, palette, rand));
  }
  return bits.join('');
}

function sillPath() {
  return 'M 78 800 H 562 L 590 900 H 50 Z';
}

export function frameSvg(id, frame) {
  const palette = MATERIALS[frame.material] ?? MATERIALS.limestone;
  const hole = opening(frame.shape);
  const extra =
    frame.shape === 'torii'
      ? `<path d="M 78 250 H 562 V 292 H 78 Z" fill="${palette.dark}"/><path d="M 96 292 H 544 V 318 H 96 Z" fill="${palette.gilt}"/>`
      : frame.shape === 'trilithon'
        ? `<path d="M 86 250 H 554 V 292 H 86 Z" fill="${palette.dark}"/>`
        : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 980" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.lite}"/>
      <stop offset="0.42" stop-color="${palette.stone}"/>
      <stop offset="1" stop-color="${palette.dark}"/>
    </linearGradient>
    <path id="hole" d="${hole}"/>
    <mask id="stone">
      <rect width="640" height="980" fill="white"/>
      <use href="#hole" fill="black"/>
    </mask>
  </defs>
  <g mask="url(#stone)">
    <rect width="640" height="980" fill="url(#fill)"/>
    ${grain(id, palette.lite, palette.dark)}
    <rect x="36" y="48" width="568" height="860" fill="none" stroke="${palette.joint}" stroke-width="18"/>
    <rect x="58" y="70" width="524" height="816" fill="none" stroke="${palette.gilt}" stroke-width="6" opacity="0.85"/>
  </g>
  <use href="#hole" fill="none" stroke="${palette.dark}" stroke-width="22"/>
  <use href="#hole" fill="none" stroke="${palette.gilt}" stroke-width="7"/>
  <use href="#hole" fill="none" stroke="${palette.lite}" stroke-width="1.5" opacity="0.7"/>
  ${extra}
  <path d="${sillPath()}" fill="${palette.sill}"/>
  <path d="M 78 800 H 562" fill="none" stroke="${palette.gilt}" stroke-width="3"/>
  <path d="M 50 892 H 590" fill="none" stroke="${palette.dark}" stroke-width="8"/>
  <g opacity="0.95">${ornament(frame.ornament, palette, id)}</g>
</svg>`;
}

export function maskSvg(shape) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 980">
  <path d="${opening(shape)}" fill="white"/>
</svg>`;
}

export function hallFrame() {
  return frameSvg('hall', {
    shape: 'round',
    material: 'limestone',
    ornament: 'leaf',
    glow: '#c6a15a',
  });
}
