# MAGIC Builder brief — Bestiary living walls (nave)

You are MAGIC Builder. The coding agent is rebuilding `portfolio-site/bestiary-src` so each room is a **unique architectural wall** (B11 law), not a blown-up centered window. Paint / SVG assets are needed for wall grounds that CSS alone cannot carry.

## Law (do not invent a new house)

From `magic-registry-workshop/reviews/phase-B11/design.md`. Blind test: plate covered, name masked, stranger still names the room from the wall alone.

| Room | Architecture to paint / ornament |
|---|---|
| Vampire | Crypt stone: arched niches, keystones, ossuary loculi, epitaph slab; cold blue small-hours wash |
| Djinn | Engraved brass band (left), eight-point seal, cartouche plates, lamp smoke |
| Lycanthrope | Engraved atlas plate, ruled border, letterpress key leaders |
| Minotaur | Labyrinth plan / papyrus cells, painted frieze, red thread |
| Sidhe | Inside the hill: mound door, turf chambers, seasonal petal wash |
| Kitsune | Vermilion torii path in snow, foxfire posts |
| Orc | Soil profile horizons, mycelium threads |
| Troll | Runestones + scree slope |
| Golem | River-clay tablets, emet head |
| Unicorn | Millefleurs tapestry border + banderoles |
| Fae | Covenant articles, gilt lattice on glass |
| Will-o'-the-wisp | Moss tussocks over dark water |
| Ophanim | Observer’s log, reticle / wheel of eyes |
| Lich | Silver-lancet reliquary triptych + predella |
| Wraith | Wire-recording transcript, reel trace |
| Succubus | Smoked drum bands / soot record |

## Deliverables (prioritized)

1. **Vampire crypt** first (reference room): full-bleed stone wall texture (subtle, dark, not photo-noise), niche arch mask/ornament if needed beyond CSS, keystone glyph. Match iron/amber registry palette; crypt runs cooler (stone → blue at night).
2. **Djinn brass band** strip texture + seal (already replacing six-point star — keep **eight-point**).
3. **Lycanthrope atlas** plate ground (engraved paper/plate feel).
4. Then Minotaur frieze, Wisp bog, Sidhe mound — same restraint: ornaments that read at distance, no sticker collage.

## Constraints

- Assets land in `portfolio-site/bestiary-src/public/walls/<slug>/` (create as needed): `ground.webp` or `.png`, optional `ornament.svg`.
- Night variants only where day/night already diverge (`*-night.webp`).
- No Containment GL crypt skin dump onto the nave hall paintings.
- Coding agent ports B11 `room.css` niches/cartouches/cells onto the nave DOM; you supply **material** the stylesheet can layer.

## Reply format

For each asset: path, size, what layer it is (ground / niche / band), and any CSS hook (`--wall-ground`, etc.). Start Vampire + Djinn now.
