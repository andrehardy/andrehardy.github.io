# Bestiary walls: MANIFEST (rev 2)

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