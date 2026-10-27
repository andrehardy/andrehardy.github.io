# Bestiary walls: MANIFEST (rev 3)

Copy `<slug>/` into `portfolio-site/bestiary-src/public/walls/<slug>/`. `previews/` is for review only (1440x900 composites, band seam check at 300%, 3x tile, seal vs stopper, keystone at 400%).

| Path | Pixel size | File size | Layer | Tileability | CSS hook |
|---|---|---|---|---|---|
| public/walls/vampire/ground.webp | 2048x1152 | 84 KB | ground: plain dressed-ashlar crypt wall, irregular aged blocks, damp/efflorescence/soot, amber mortar glints; NO baked niches | full-bleed, not tileable | `--wall-ground` |
| public/walls/vampire/ground-night.webp | 2048x1152 | 64 KB | ground (night): cold blue wash + faint cold light pool upper right | full-bleed, pixel-aligned to day | `--wall-ground-night` |
| public/walls/vampire/ornament.svg | vector | 1 KB | ornament: niche arch outline (ring broken by keystone) + keystone with 8-petal rosette, currentColor | vector, viewBox 200x300 | `--wall-ornament` |
| public/walls/vampire/niche.svg | vector | 0 KB | niche mask: arch interior, fits ornament inner reveal | vector, viewBox 200x300 | `--wall-niche-mask` |
| public/walls/djinn/band.webp | 480x2048 | 122 KB | band: left-edge aged hammered brass, central column of eight-point stars + diamond strapwork chain, vine-scroll borders | seamless vertical tile (strapwork period 256px; borders repeat 4x per tile) | `--wall-band` |
| public/walls/djinn/seal.svg | vector | 1 KB | ornament: eight-point seal (octagram outline, parallel inner outline, double centre ring) matched to stopper, currentColor | vector, viewBox 200x200 | `--wall-seal` |
| public/walls/djinn/ground.webp | 2048x1152 | 146 KB | ground: lapis plaster with fine crackle relief, warm lamplit pool + smoke wisps lower left | full-bleed, not tileable | `--wall-ground` |

No djinn night variant. Seal is eight-pointed, never six.

## Rev 3: lycanthrope, minotaur, will-o-the-wisp, sidhe

| Path | Pixel size | File size | Layer | Tileability | CSS hook |
|---|---|---|---|---|---|
| public/walls/lycanthrope/ground.webp | 2048x1152 | 361 KB | ground: aged engraved atlas plate, curved graticule, dotted route leaders, burin-hatched hills/forest at foot, foxing; no text | full-bleed, not tileable | `--wall-ground` |
| public/walls/lycanthrope/ground-night.webp | 2048x1152 | 152 KB | ground (night): moonlit desaturated cool grade of day, pixel-aligned | full-bleed, not tileable | `--wall-ground-night` |
| public/walls/lycanthrope/ornament.svg | vector | 3 KB | ornament: double ruled border + dotted inner rule, engraver scroll corners, graduation ticks; currentColor; preserveAspectRatio=none | vector, viewBox 1600x900 (stretch to wall) | `--wall-ornament` |
| public/walls/lycanthrope/key-leaders.svg | vector | 2 KB | ornament: map-key, 6 hatched swatches + letterpress dot leaders + abstract bars (no text), currentColor | vector, viewBox 260x172 | `--wall-key` |
| public/walls/minotaur/ground.webp | 2048x1152 | 394 KB | ground: cracked Minoan lime plaster, ochre/cream, faded red lily traces | full-bleed, not tileable | `--wall-ground` |
| public/walls/minotaur/frieze.webp | 2048x356 | 305 KB | strip/band: Knossos-style frieze, running spirals, rosettes, bull-leaping panel, red/black rules | seamless horizontal tile (mirror-pair; each tile has 2 bull panels, 2nd mirrored) | `--wall-frieze` |
| public/walls/minotaur/labyrinth.svg | vector | 11 KB | ornament: true classical 7-circuit Cretan labyrinth (circuit order 3-2-1-4-7-6-5-centre), currentColor strokes | vector, viewBox 424x424 | `--wall-labyrinth` |
| public/walls/minotaur/thread.svg | vector | 7 KB | ornament: Ariadne red thread through the labyrinth, path id="ariadne-thread" pathLength=1, dasharray 1 1; animate stroke-dashoffset 1 to 0. Same viewBox as labyrinth, overlay exactly | vector, viewBox 424x424 | `--wall-thread` |
| public/walls/will-o-the-wisp/ground.webp | 2048x1152 | 201 KB | ground (day): overcast dark bog water, grey cloud reflections, reed reflections | full-bleed, not tileable | `--wall-ground` |
| public/walls/will-o-the-wisp/ground-night.webp | 2048x1152 | 86 KB | ground (night): same, dark blue-black grade, pixel-aligned | full-bleed, not tileable | `--wall-ground-night` |
| public/walls/will-o-the-wisp/tussocks.webp | 2048x646 | 420 KB | strip/overlay: foreground moss tussocks + cottongrass, alpha top edge, solid peat-dark at the bottom; dim with filter:brightness(.4-.5) at night | bottom-anchored, not tileable (stretch background-size:100% auto) | `--wall-foreground` |
| public/walls/sidhe/ground.webp | 2048x1152 | 508 KB | ground: packed earth chamber wall with pale root threads and small stones | full-bleed, not tileable | `--wall-ground` |
| public/walls/sidhe/door.webp | 1728x2304 | 319 KB | niche/ornament: Newgrange-style trilithon door (lintel + jambs + sill) with triple-spiral and lozenge carving; transparent alpha outside; opening painted black (opaque) | single object, not tileable; anchor bottom-centre | `--wall-door` |
| public/walls/sidhe/petals.webp | 2048x1152 | 97 KB | overlay: soft transparent petal wash, densest at edges, near-white so CSS can tint by season | full-bleed, not tileable | `--wall-petals` |

Notes:
- Minotaur thread: `#ariadne-thread{stroke-dasharray:1 1;stroke-dashoffset:1;transition:stroke-dashoffset 4s}` then set 0 on reaction. Inline the SVG (not as background) to animate it.
- Sidhe seasonal tint: tint petals with `mix-blend-mode:multiply` or a color overlay. winter #cfd8e6 (petals sparse/near-white, low opacity .25), spring #f3c6d3 (.55), summer #f2dc9a (.45), autumn #c8702a (.5); recoil state: opacity 0.
- Night variants: lycanthrope and will-o-the-wisp only. Minotaur and sidhe have none (no day/night divergence).
- Previews: previews/<slug>.jpg (1440x900), plus lycanthrope-night, will-o-the-wisp-night, sidhe-autumn-tint, minotaur-frieze-seam300, wisp-tussock-edge300.

## Rev 4: SVG stubs (kitsune…succubus) — replace when MAGIC paint lands

| Path | Layer | CSS hook |
|---|---|---|
| public/walls/kitsune/ground.svg | snow path + torii silhouette | `--wall-ground` |
| public/walls/kitsune/ground-night.svg | night snow + foxfire | `--wall-ground-night` |
| public/walls/kitsune/posts.svg | foxfire post ornament | `--wall-ornament` |
| public/walls/orc/ground.svg | soil horizon bands + mycelium | `--wall-ground` |
| public/walls/orc/mycelium.svg | mycelium overlay | `--wall-mycelium` |
| public/walls/troll/ground.svg | scree slope | `--wall-ground` |
| public/walls/troll/rune.svg | runestone | `--wall-rune` |
| public/walls/golem/ground.svg | clay tablets | `--wall-ground` |
| public/walls/golem/emet.svg | emet head mark | `--wall-emet` |
| public/walls/unicorn/ground.svg | millefleurs field + border | `--wall-ground` |
| public/walls/unicorn/banderole.svg | banderole under title | `--wall-banderole` |
| public/walls/fae/ground.svg | gilt lattice on dark glass | `--wall-ground` |
| public/walls/fae/lattice.svg | lattice ornament | `--wall-lattice` |
| public/walls/ophanim/ground.svg | reticle / observer log | `--wall-ground` |
| public/walls/ophanim/reticle.svg | reticle glyph | `--wall-reticle` |
| public/walls/lich/ground.svg | silver-lancet triptych | `--wall-ground` |
| public/walls/lich/lancet.svg | lancet arch | `--wall-lancet` |
| public/walls/wraith/ground.svg | transcript lines + reels | `--wall-ground` |
| public/walls/wraith/reel.svg | reel ornament | `--wall-reel` |
| public/walls/succubus/ground.svg | smoked drum bands | `--wall-ground` |
| public/walls/succubus/band.svg | soot band strip | `--wall-band` |
