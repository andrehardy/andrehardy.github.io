# Grand hall painted layers (bestiary landing)
Painted art only; code positions these in CSS 3D / WebGL perspective. Sources (jpg/png) in ../hall-layers-src/.

| File | Size / aspect | Use |
|---|---|---|
| nave-back.webp | 1024x576, 16:9 | Far end of the nave: glowing gold rose window, vault fading to dark, god-rays. Back plane at the vanishing point. Already contains its own short side bays/columns and floor in perspective — crop/scale so its side walls meet the code-placed wall planes, or mask its outer ~15% edges. Overlay the live rose content + rose-frame over its rose (centre ≈ x50%, y32%, diameter ≈ 17% width). |
| wall-tile.webp | 670x576 (v2) | Straight-on elevation, 2 bays, cropped pilaster-centre to pilaster-centre so it repeats seamlessly with repeat-x (verified 2x2): honey ashlar, gilded Corinthian pilasters, gilded cornice + dado band. Blank panels for live windows at ≈ x 9–41% and 59–91%, y 14–84%. Repeat with background-repeat: repeat-x on rotateY(±90deg) wall planes; mirror for right wall. |
| floor.webp | 1024x1024, 1:1 | Top-down polished honey marble, 4x4 slabs with gold inlay. v2: light patch flattened, saturation -20%. Tile on a rotateX(90deg) plane. |
| vault.webp | 1024x1024, 1:1 | Ribbed vault seen from below, gilded ribs/bosses, 2x2 bays. v2: channel-matched to wall warmth. Tile on the ceiling plane (slight seam arcs at tile edges); darken with a gradient toward the far end. |
| arch-frame-hall.webp (lossless) | 768x1024, 3:4, alpha | Round-topped limestone arch, gilded inner moulding, keystone. Opening + outside transparent. Place over each live window; opening ≈ x 25.5–74%, y 17–89%. |
| rose-frame.webp (lossy q88 with alpha) | 1024x1024, 1:1, alpha | Circular rose tracery frame, transparent openings. Overlay on live rose content. |

## Night variants (v2)
Same geometry as day; crossfade day<->night by opacity for a night trigger.
| nave-back-night.webp | 1024x576 | Blue-black stone, rose window glowing amber, warm god-rays and floor glow. |
| wall-tile-night.webp | 670x576 | Blue-black ashlar, bronze-gold capitals and bands; same crop as day, seamless repeat-x. |
| floor-night.webp | 1024x1024 | Dark navy marble, gold inlay. Even (no baked reflections) — add window reflections in code (blurred, flipped window glow on floor plane). |
| vault-night.webp | 1024x1024 | Navy webs, bronze-gold ribs/bosses. |
Frames (arch-frame-hall, rose-frame) are shared; darken with CSS filter: brightness(.45) saturate(.8) at night.
