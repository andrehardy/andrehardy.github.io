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

## Rev 4: kitsune, orc, troll, golem, unicorn, fae, ophanim, lich, wraith, succubus

| Path | Pixel size | File size | Layer | Tileability | CSS hook |
|---|---|---|---|---|---|
| public/walls/kitsune/ground.webp | 2048x1152 | 291 KB | ground: snowfall dusk on a shrine approach, cedar rows, faint trodden path; no gate | full-bleed | `--wall-ground` |
| public/walls/kitsune/ground-night.webp | 2048x1152 | 156 KB | ground (night): cold blue grade, pixel-aligned | full-bleed | `--wall-ground-night` |
| public/walls/kitsune/torii.svg | vector | 2 KB | ornament: row of 4 receding torii (kasagi, nuki, blank gakuzuka), currentColor, default vermilion #c8361f | vector 1400x760 | `--wall-torii` |
| public/walls/kitsune/foxfire-post.svg | vector | 1 KB | ornament: stone lantern post with blue-white foxfire; flame path class="foxfire" (animate opacity/scale) | vector 160x420 | `--wall-post` |
| public/walls/orc/ground.webp | 2048x1152 | 469 KB | ground: soil profile, humus/topsoil with roots, ochre subsoil, grey clay, fractured bedrock | full-bleed | `--wall-ground` |
| public/walls/orc/mycelium.webp | 2048x1152 | 793 KB | overlay: white mycelium threads, alpha; use opacity .3-.45 | full-bleed, not tileable | `--wall-mycelium` |
| public/walls/orc/horizon-ticks.svg | vector | 3 KB | ornament: survey rod, graduations, horizon arrows + dashed boundary leaders, no text; ticks at y=130/310/520/700 of 900 match ground bands | vector 560x900 (height = wall) | `--wall-ticks` |
| public/walls/troll/ground.webp | 2048x1152 | 527 KB | ground: lichened granite scree slope, diagonal fall | full-bleed | `--wall-ground` |
| public/walls/troll/ground-night.webp | 2048x1152 | 287 KB | ground (night): cold dark grade | full-bleed | `--wall-ground-night` |
| public/walls/troll/runestone.webp | 2040x1252 | 370 KB | ornament: 3 granite standing stones, abstract serpent bands + notches (no runes), alpha cutout | single object, bottom anchor | `--wall-runestone` |
| public/walls/golem/ground.webp | 2048x1152 | 469 KB | ground: river clay, dry curling mud-crack plates top to wet sheen bottom | full-bleed | `--wall-ground` |
| public/walls/golem/tablet.webp | 673x964 | 240 KB | ornament: clay tablet with wedge marks (abstract, cuneiform-like), alpha cutout | single object | `--wall-tablet` |
| public/walls/golem/head-ornament.svg | vector | 1 KB | ornament: clay head silhouette, blank forehead band (emet slot, no letters), evenodd cut eyes/mouth | vector 300x380 | `--wall-head` |
| public/walls/unicorn/ground.webp | 2048x1152 | 424 KB | ground: dark green wool weave, sparse millefleurs at edges | full-bleed | `--wall-ground` |
| public/walls/unicorn/border.webp | 2240x720 | 289 KB | strip: millefleurs border | seamless horizontal tile | `--wall-border` |
| public/walls/unicorn/border-v.webp | 720x1200 | 159 KB | strip: millefleurs border, vertical (flowers upright) | seamless vertical tile | `--wall-border-v` |
| public/walls/unicorn/banderole.svg | vector | 1 KB | ornament: curling blank banderole, currentColor fill, dark outline | vector 900x220 | `--wall-banderole` |
| public/walls/fae/ground.webp | 2048x1152 | 339 KB | ground: mulberry/forest-green blown glass with pale parchment ghosts behind | full-bleed | `--wall-ground` |
| public/walls/fae/lattice.svg | vector | 17 KB | ornament: gilt diamond cames with hand jitter, bosses, double frame; currentColor default #c9a24a; preserveAspectRatio slice | vector 1600x900 | `--wall-lattice` |
| public/walls/fae/articles.webp | 1200x1600 | 104 KB | overlay: deckled parchment, numbered clause marks + abstract ink dashes (unreadable), alpha | single object | `--wall-articles` |
| public/walls/ophanim/ground.webp | 2048x1152 | 275 KB | ground: indigo vellum observer's logbook spread, gold-ruled columns, compass circles; glyph marks inpainted out | full-bleed | `--wall-ground` |
| public/walls/ophanim/ground-night.webp | 2048x1152 | 139 KB | ground (night): darker cold grade | full-bleed | `--wall-ground-night` |
| public/walls/ophanim/reticle.svg | vector | 14 KB | ornament: nested rings, 5deg graduations, crosshair, tilted orbit ellipses, 36 rim eyes + centre eye, currentColor default #d4b062 | vector 800x800 | `--wall-reticle` |
| public/walls/lich/ground.webp | 2048x1152 | 332 KB | ground: black marble slabs, silver veins, cold light upper-left; no panels | full-bleed | `--wall-ground` |
| public/walls/lich/lancet.svg | vector | 2 KB | ornament: triptych of silver lancet frames (inner rule, quatrefoil, finials) + predella rail, currentColor default #c3c8cf | vector 1400x920 | `--wall-ornament` |
| public/walls/lich/predella.webp | 2196x850 | 358 KB | strip: carved oak + tarnished silver quatrefoil reliquary frieze, alpha above crest | seamless horizontal tile (period 183px x6 @2x) | `--wall-predella` |
| public/walls/wraith/ground.webp | 2048x1152 | 404 KB | ground: frosted brushed steel, concentric wire-spool scratches, hoarfrost corners | full-bleed | `--wall-ground` |
| public/walls/wraith/reel.svg | vector | 5 KB | ornament: twin wire-recorder reels (supply full, take-up thin), head block, trace | vector 800x520 | `--wall-reel` |
| public/walls/wraith/trace.svg | vector | 8 KB | strip: waveform trace, preserveAspectRatio none | seamless horizontal tile (integer-frequency) | `--wall-trace` |
| public/walls/succubus/ground.webp | 2048x1152 | 281 KB | ground: soot-black kymograph with ember undertone and scratched white traces | full-bleed | `--wall-ground` |
| public/walls/succubus/bands.webp | 2048x512 | 34 KB | band: smoked drum bands with 4 scratched pulse traces | seamless horizontal tile | `--wall-band` |
| public/walls/succubus/soot.webp | 2048x1152 | 357 KB | overlay: soot smudge + edge vignette, alpha | full-bleed | `--wall-soot` |

Notes: night variants only kitsune, troll, ophanim. No baked niches/arches/windows in any ground. Previews: previews/<slug>.jpg (+ kitsune-night, troll-night, ophanim-night).
