/** B11 architecture of record for each nave room (design.md). */
export const ARCHITECTURE: Record<
  string,
  {
    id: string;
    label: string;
    /** Specimen / case frame name from B11 */
    case: string;
    /** Head frame */
    head: string;
  }
> = {
  vampire: { id: 'crypt-niches', label: 'Crypt niches', case: 'crypt', head: 'lintel' },
  djinn: { id: 'brass-band', label: 'Engraved brass', case: 'vessel', head: 'lamp' },
  lycanthrope: { id: 'atlas-plate', label: 'Engraved atlas plate', case: 'plate', head: 'plate-head' },
  minotaur: { id: 'labyrinth', label: 'Labyrinth plan', case: 'centre', head: 'frieze' },
  sidhe: { id: 'inside-hill', label: 'Inside the hill', case: 'door', head: 'mound' },
  kitsune: { id: 'torii-path', label: 'Vermilion gates', case: 'gate', head: 'shrine' },
  orc: { id: 'soil-profile', label: 'Soil profile', case: 'horizon', head: 'profile-head' },
  troll: { id: 'runestones', label: 'Runestone slope', case: 'stone', head: 'scree-head' },
  golem: { id: 'clay-tablets', label: 'River clay tablets', case: 'tablet', head: 'emet' },
  unicorn: { id: 'millefleurs', label: 'Millefleurs tapestry', case: 'hanging', head: 'banderole' },
  fae: { id: 'covenant', label: 'Covenant lattice', case: 'glass', head: 'articles' },
  'will-o-the-wisp': { id: 'bog-tussocks', label: 'Moss tussocks', case: 'bank', head: 'mist-head' },
  ophanim: { id: 'observer-log', label: "Observer's log", case: 'eyepiece', head: 'log-head' },
  lich: { id: 'reliquary', label: 'Silver reliquary', case: 'triptych', head: 'lancets' },
  wraith: { id: 'wire-transcript', label: 'Wire transcript', case: 'reel', head: 'splice-head' },
  succubus: { id: 'smoked-drum', label: 'Smoked drum', case: 'drum', head: 'band-head' },
};

export function architectureOf(slug: string) {
  return ARCHITECTURE[slug] ?? { id: 'wall', label: 'Wall', case: 'opening', head: 'lintel' };
}
