# Grand hall painted layers (bestiary landing)
Painted art only; code positions these in CSS 3D / WebGL perspective. Sources (jpg/png) in ../hall-layers-src/.

| File | Size / aspect | Use |
|---|---|---|
| nave-back.webp | 1024x576, 16:9 | Far end of the nave: glowing gold rose window, vault fading to dark, god-rays. Back plane at the vanishing point. Already contains its own short side bays/columns and floor in perspective — crop/scale so its side walls meet the code-placed wall planes, or mask its outer ~15% edges. Overlay the live rose content + rose-frame over its rose (centre ≈ x50%, y32%, diameter ≈ 17% width). |
| wall-tile.webp | 1024x576, 16:9 | Straight-on elevation, 3 bays: honey ashlar, gilded Corinthian pilasters, gilded cornice + dado band. Blank panels between pilasters for live windows (each panel ≈ x 7–28%, 39–61%, 72–93%; y 14–84%). Repeat with background-repeat: repeat-x on rotateY(±90deg) wall planes; mirror for right wall. |
| floor.webp | 1024x1024, 1:1 | Top-down polished honey marble, 4x4 slabs with gold inlay. Tile on a rotateX(90deg) plane. |
| vault.webp | 1024x1024, 1:1 | Ribbed vault seen from below, gilded ribs/bosses, 2x2 bays. Tile on the ceiling plane; darken with a gradient toward the far end. |
| arch-frame-hall.webp (lossless) | 768x1024, 3:4, alpha | Round-topped limestone arch, gilded inner moulding, keystone. Opening + outside transparent. Place over each live window; opening ≈ x 25.5–74%, y 17–89%. |
| rose-frame.webp (lossy q88 with alpha) | 1024x1024, 1:1, alpha | Circular rose tracery frame, transparent openings. Overlay on live rose content. |
