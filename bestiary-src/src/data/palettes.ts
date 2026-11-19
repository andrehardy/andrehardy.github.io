/**
 * Each room's own colours (R-B-GLASS-01). The swatches are the entity's palette, named as its
 * identity names them; the roles are what the page is painted with. Most rooms are dark, as a
 * case is in a darkened gallery, but a few habitats and one instrument stand in daylight: the
 * snow of the shrine wood, the dawn at the spring, the papyrus of Daedalus's board.
 *
 * Tests hold every room's text to WCAG, every room apart from every other and from the twelve
 * folios, and every swatch name equal to the entity's identity.
 */
/** Sixteen specimen room ids (bestiary-src roster). */
export type EntityId =
  | 'lycanthrope'
  | 'vampire'
  | 'sidhe'
  | 'kitsune'
  | 'orc'
  | 'troll'
  | 'golem'
  | 'unicorn'
  | 'minotaur'
  | 'fae'
  | 'will-o-the-wisp'
  | 'ophanim'
  | 'djinn'
  | 'lich'
  | 'wraith'
  | 'succubus';

export interface RoomPalette {
  /** The entity's palette, by the names its identity gives. */
  swatches: Record<string, string>;
  /** The page's ground, and the raised ground of a case, a card or a label. */
  ground: string;
  well: string;
  /** Body text, and secondary text. */
  ink: string;
  inkSoft: string;
  /** Display type and fittings, and a second for the room's one other note. */
  accent: string;
  accent2: string;
  /** The colour of the room's light, for the shaft or pool it is lit by. */
  light: string;
}

export const ROOM_PALETTES: Record<EntityId, RoomPalette> = {
  lycanthrope: {
    swatches: {
      bone: '#e3d9c2',
      'dried blood': '#7a2a22',
      tallow: '#d9c58f',
      'lamp-black': '#141312',
    },
    ground: '#121618',
    well: '#1d2225',
    ink: '#e3d9c2',
    inkSoft: '#ada492',
    accent: '#d9c58f',
    accent2: '#c86454',
    light: '#dce6ee',
  },
  vampire: {
    swatches: {
      'crypt black': '#0d0708',
      'arterial red': '#c1121f',
      'ember orange': '#ff7a1a',
      'white heat': '#fff4e0',
    },
    ground: '#170709',
    well: '#251013',
    ink: '#fff4e0',
    inkSoft: '#c4aca4',
    accent: '#ff5850',
    accent2: '#ff7a1a',
    light: '#ff9a4a',
  },
  sidhe: {
    swatches: {
      'dusk violet': '#4b3a6b',
      'hawthorn white': '#f3efe6',
      'moss gold': '#c4ad55',
      'barrow green': '#2f4a3a',
    },
    ground: '#1a1428',
    well: '#261e39',
    ink: '#f3efe6',
    inkSoft: '#bfb6cf',
    accent: '#b9a3e3',
    accent2: '#c4ad55',
    light: '#f0b878',
  },
  kitsune: {
    swatches: {
      vermilion: '#e34234',
      'snow white': '#f2f4f6',
      'cedar green-black': '#1c2923',
      'foxfire blue': '#3d6fc4',
    },
    ground: '#f2f4f6',
    well: '#e1e7ec',
    ink: '#1c2923',
    inkSoft: '#46574f',
    accent: '#c8362a',
    accent2: '#3d6fc4',
    light: '#eef3f8',
  },
  orc: {
    swatches: {
      'loam brown': '#4a3423',
      chalk: '#ebe6d6',
      rust: '#b7472a',
      'fungal ivory': '#efe7cf',
      'spore green': '#8fae5a',
    },
    ground: '#1e150d',
    well: '#2c2016',
    ink: '#efe7cf',
    inkSoft: '#bcae94',
    accent: '#ed947a',
    accent2: '#8fae5a',
    light: '#f3b35c',
  },
  troll: {
    swatches: {
      granite: '#6b6e70',
      'lichen green': '#a3b06a',
      'birch white': '#eeeae0',
      'night blue': '#101b33',
    },
    ground: '#101b33',
    well: '#1a2745',
    ink: '#eeeae0',
    inkSoft: '#b3b8c2',
    accent: '#a3b06a',
    accent2: '#a0a4a8',
    light: '#c9d6ec',
  },
  golem: {
    swatches: {
      'river clay ochre': '#b07a3c',
      'iron black': '#1c1b19',
      chalk: '#ece8dc',
      'spark blue-white': '#cfe6ff',
    },
    ground: '#1d1a16',
    well: '#2b2721',
    ink: '#ece8dc',
    inkSoft: '#b8b0a2',
    accent: '#7794b0',
    accent2: '#c88d48',
    light: '#ffd9a0',
  },
  unicorn: {
    swatches: {
      'millefleurs green': '#2f5d3a',
      ivory: '#f6f1e3',
      'pomegranate red': '#b3263e',
      'spring silver': '#c7d3d6',
    },
    ground: '#f6f1e3',
    well: '#e9e3d0',
    ink: '#1d2a20',
    inkSoft: '#4b594e',
    accent: '#2f5d3a',
    accent2: '#b3263e',
    light: '#fbf7ee',
  },
  minotaur: {
    swatches: {
      'Cretan red ochre': '#a8442a',
      bronze: '#8c6a2f',
      papyrus: '#e8dcb5',
      'Aegean blue': '#1f5f8b',
    },
    ground: '#e8dcb5',
    well: '#dccd9e',
    ink: '#2a1d12',
    inkSoft: '#56422c',
    accent: '#1f5f8b',
    accent2: '#a8442a',
    light: '#fffaf0',
  },
  fae: {
    swatches: {
      'gold leaf': '#d4af37',
      'black glass': '#0b0b10',
      'rowan red': '#c0392b',
      pearl: '#eae6df',
    },
    ground: '#0b0b10',
    well: '#17161f',
    ink: '#eae6df',
    inkSoft: '#b4aea6',
    accent: '#cfa700',
    accent2: '#de5a48',
    light: '#ffd27a',
  },
  'will-o-the-wisp': {
    swatches: {
      'peat black': '#0f0d09',
      'bog umber': '#4b3a26',
      'cold blue-green': '#7fd1c1',
      'cotton-grass white': '#f1efe6',
    },
    ground: '#0f0d09',
    well: '#1b1810',
    ink: '#f1efe6',
    inkSoft: '#b3ab9c',
    accent: '#7fd1c1',
    accent2: '#a88d64',
    light: '#9ff0de',
  },
  ophanim: {
    swatches: {
      'white gold': '#f2e6c4',
      lapis: '#1d3270',
      'burning amber': '#ff9f1c',
      chrysolite: '#a7c957',
    },
    ground: '#0a1030',
    well: '#141c45',
    ink: '#f2e6c4',
    inkSoft: '#bcb6cc',
    accent: '#ff9f1c',
    accent2: '#a7c957',
    light: '#fff1c8',
  },
  djinn: {
    swatches: {
      brass: '#b5893a',
      'smoke violet': '#5b4a6e',
      'smokeless-fire blue': '#6fb7ff',
      lapis: '#1f3a8a',
    },
    ground: '#100d1a',
    well: '#1c1729',
    ink: '#ece4d4',
    inkSoft: '#b5abc0',
    accent: '#6fb7ff',
    accent2: '#d0a14c',
    light: '#ffbf6b',
  },
  lich: {
    swatches: {
      'tarnished silver': '#8e9196',
      bone: '#ddd3bd',
      verdigris: '#43b3ae',
      'cold green': '#6f8f6a',
    },
    ground: '#0b1614',
    well: '#152320',
    ink: '#ddd3bd',
    inkSoft: '#a4a79d',
    accent: '#11938e',
    accent2: '#b0b4ba',
    light: '#ffe2a8',
  },
  wraith: {
    swatches: {
      sepia: '#704214',
      steel: '#7d8a96',
      'faded wallpaper green': '#8fa58a',
      'tungsten amber': '#ffb347',
    },
    ground: '#1a140c',
    well: '#272016',
    ink: '#ece3d2',
    inkSoft: '#b2a794',
    accent: '#c8d6e3',
    accent2: '#ffb347',
    light: '#ffcf87',
  },
  succubus: {
    swatches: {
      'smoked black': '#0c0a0b',
      'soot-white trace': '#e9e4dc',
      'damask crimson': '#9e1b32',
      candle: '#f3c66b',
    },
    ground: '#150a14',
    well: '#231321',
    ink: '#e9e4dc',
    inkSoft: '#b4a8a4',
    accent: '#d9467a',
    accent2: '#f3c66b',
    light: '#ffc46e',
  },
};

/**
 * A room in daylight keeps darker fittings: brass that would vanish on snow or papyrus is
 * oxidised to an old bronze, and the glass is drawn by its shadow instead of its shine.
 */
export const DAYLIGHT_FITTINGS = {
  brass: '#6f531b',
  brassDim: '#94763c',
  glass: 'rgb(30 45 45 / 0.05)',
  glassEdge: 'rgb(30 45 45 / 0.32)',
} as const;

/** Whether a room stands in daylight (a light ground with dark ink). */
export function isDaylight(p: RoomPalette): boolean {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
  };
  return lum(p.ground) > lum(p.ink);
}

/** The room's colours as custom properties, for the page's style attribute. */
export function roomStyle(id: EntityId): string {
  const p = ROOM_PALETTES[id];
  const day = isDaylight(p);
  return [
    `--c-ground: ${p.ground}`,
    `--c-ground-raised: ${p.well}`,
    `--c-ink: ${p.ink}`,
    `--c-ink-soft: ${p.inkSoft}`,
    /* Own the page ink so Hall --night cream cannot poison daylight rooms (B1 I3). */
    `--ink: ${p.ink}`,
    `--ink-soft: ${p.inkSoft}`,
    `--r-accent: ${p.accent}`,
    `--r-accent-2: ${p.accent2}`,
    `--r-light: ${p.light}`,
    ...(day
      ? [
          `--c-brass: ${DAYLIGHT_FITTINGS.brass}`,
          `--c-brass-dim: ${DAYLIGHT_FITTINGS.brassDim}`,
          `--c-glass: ${DAYLIGHT_FITTINGS.glass}`,
          `--c-glass-edge: ${DAYLIGHT_FITTINGS.glassEdge}`,
          'color-scheme: light',
        ]
      : []),
  ].join('; ');
}
