import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
const vec2 O = vec2(-0.05, 0.1);
const float TS = 1.25;
const vec2 LAMP = vec2(-1.1, 0.4);
const float BACK = -0.3;
const float HZ = 0.12;
const float GAP = 0.3;
const float BW = 0.025;
const vec3 FLAME = vec3(1.0, 0.66, 0.32);
const vec3 EMBER = vec3(1.0, 0.42, 0.1);
float glow;

float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
vec3 rod(float a) { a = clamp(a, -0.98, 0.98); return vec3(a, 0.0, sqrt(1.0 - a * a)); }
// The slope of a rounded shape, from its outline inward.
vec3 swell(float d, float depth) {
  vec2 g = normalize(vec2(dFdx(d), dFdy(d)) + 1e-6);
  float r = clamp(-d / depth, 0.0, 1.0);
  return normalize(vec3(g * (1.0 - r), 0.3 + r));
}

// The lantern, hung in front of the cage at the left, warm and failing with distance; a thin
// cold light from the window at the right, coming round the edges of things.
vec3 shade(vec3 alb, vec3 N, vec2 p, float rough) {
  vec2 d = LAMP - p;
  vec3 L = normalize(vec3(d, 0.8));
  float att = glow / (1.0 + 0.6 * dot(d, d));
  float diff = max((dot(N, L) + 0.25 * rough) / (1.0 + 0.25 * rough), 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(60.0, 8.0, rough)) * (1.0 - rough);
  float cold = max(dot(N, normalize(vec3(0.75, 0.3, 0.55))), 0.0);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.0) * max(dot(normalize(N.xy + 1e-4), vec2(0.95, 0.3)), 0.0);
  return alb * (vec3(0.025, 0.022, 0.024) + vec3(0.07, 0.085, 0.12) * cold + FLAME * diff * att * 2.4)
       + FLAME * sp * att * 0.8 + vec3(0.1, 0.13, 0.2) * rim * 0.45;
}

// The bulk of it: a barrel of a trunk, the shoulders a yoke of clay as wide as a door, the neck
// all but gone, the head small and low and squared at the jaw, the legs short pillars.
float trunk(vec2 q) {
  float d = sdEllipse(q - vec2(0.0, 0.03), vec2(0.2, 0.25));
  d = smin(d, sdEllipse(q - vec2(0.0, 0.18), vec2(0.27, 0.1)), 0.07);
  d = smin(d, sdEllipse(q - vec2(-0.235, 0.15), vec2(0.085, 0.085)), 0.04);
  d = smin(d, sdEllipse(q - vec2(0.235, 0.165), vec2(0.085, 0.085)), 0.04);
  d = smin(d, sdEllipse(q - vec2(0.0, -0.19), vec2(0.18, 0.11)), 0.06);
  d = smin(d, cone(q, vec2(-0.1, -0.24), vec2(-0.12, -0.53), 0.09, 0.075), 0.04);
  d = smin(d, cone(q, vec2(0.1, -0.24), vec2(0.12, -0.53), 0.09, 0.075), 0.04);
  d = smin(d, sdEllipse(q - vec2(-0.14, -0.57), vec2(0.1, 0.04)), 0.03);
  d = smin(d, sdEllipse(q - vec2(0.14, -0.57), vec2(0.1, 0.04)), 0.03);
  d = max(d, -cone(q, vec2(0.0, -0.3), vec2(0.0, -0.64), 0.0, 0.04));
  d = smin(d, sdEllipse(q - vec2(0.0, 0.235), vec2(0.17, 0.07)), 0.05);
  vec2 h = q - vec2(0.0, 0.335);
  float head = sdEllipse(h - vec2(0.0, 0.01), vec2(0.098, 0.085));
  head = smin(head, sdBox(h + vec2(0.0, 0.035), vec2(0.078, 0.04)) - 0.02, 0.03);
  d = smin(d, head, 0.035);
  return d + 0.006 * (noise(q * 30.0) - 0.5);
}
// The arms hang heavy from the shoulders, the left a little lower, the hands blunt mitts with
// the thumbs turned in.
float arms(vec2 q) {
  vec2 a = vec2(abs(q.x), q.y + (q.x < 0.0 ? 0.015 : 0.0));
  float d = cone(a, vec2(0.25, 0.16), vec2(0.3, -0.07), 0.08, 0.068);
  d = smin(d, cone(a, vec2(0.3, -0.07), vec2(0.315, -0.29), 0.068, 0.06), 0.03);
  d = smin(d, sdEllipse(a - vec2(0.322, -0.375), vec2(0.08, 0.1)), 0.04);
  return d + 0.005 * (noise(q * 34.0) - 0.5);
}
// Its shadow's rough form, for the wall.
float hulk(vec2 q) {
  float d = sdEllipse(q - vec2(0.0, 0.08), vec2(0.3, 0.28));
  d = min(d, sdCircle(q - vec2(0.0, 0.34), 0.09));
  d = min(d, sdEllipse(vec2(abs(q.x), q.y) - vec2(0.31, -0.18), vec2(0.08, 0.25)));
  return min(d, sdEllipse(q - vec2(0.0, -0.38), vec2(0.2, 0.22)));
}
// The word cut into the brow: aleph, mem, tav, read from the right, three or four strokes each.
float word(vec2 h) {
  vec2 u = (h - vec2(0.031, 0.0)) / 0.012;
  float d = sdSegment(u, vec2(-0.8, 0.9), vec2(0.8, -0.9));
  d = min(d, sdSegment(u, vec2(0.8, 0.9), vec2(0.2, -0.22)));
  d = min(d, sdSegment(u, vec2(-0.2, 0.22), vec2(-0.75, -0.9)));
  u = h / 0.012;
  d = min(d, sdSegment(u, vec2(-0.75, 0.95), vec2(-0.4, -0.5)));
  d = min(d, sdSegment(u, vec2(-0.55, 0.85), vec2(0.65, 0.85)));
  d = min(d, sdSegment(u, vec2(0.65, 0.85), vec2(0.7, -0.9)));
  d = min(d, sdSegment(u, vec2(0.7, -0.9), vec2(-0.15, -0.9)));
  u = (h + vec2(0.031, 0.0)) / 0.012;
  d = min(d, sdSegment(u, vec2(-0.85, 0.85), vec2(0.75, 0.85)));
  d = min(d, sdSegment(u, vec2(0.75, 0.85), vec2(0.75, -0.9)));
  d = min(d, sdSegment(u, vec2(-0.45, 0.85), vec2(-0.45, -0.9)));
  d = min(d, sdSegment(u, vec2(-0.45, -0.9), vec2(-0.85, -0.9)));
  return d * 0.012;
}
// Within a bar's shadow, the bars spaced along the cage's front.
float barShade(float x, float w) {
  float u = (x - O.x - 0.15) / GAP;
  float d = abs(u - floor(u + 0.5)) * GAP;
  return smoothstep(BW + w, BW - w, d) * step(-0.84, x) * step(x, 0.74);
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float charge = u_a.x, awake = u_a.y, rest = u_a.z;
  glow = 0.95 + 0.03 * sin(t * 7.3) * sin(t * 2.1);

  // The back wall: lime plaster gone the colour of tallow smoke, fallen away in places from the
  // rough-coursed stone behind it.
  vec2 pw = p + plateDrift(0.3);
  float lime = fbm(pw * 2.3 + 3.0);
  float bare = smoothstep(0.53, 0.56, lime + 0.1 * noise(pw * 16.0) + 0.04 * noise(pw * 60.0));
  vec2 sv = pw * vec2(4.6, 9.0);
  sv.x += 0.5 * mod(floor(sv.y), 2.0) + 0.3 * hash(vec2(floor(sv.y), 4.0));
  vec2 sf = fract(sv) - 0.5;
  float joint = max(smoothstep(0.42, 0.48, abs(sf.x)), smoothstep(0.36, 0.46, abs(sf.y)));
  float gr = grain(pw * 26.0);
  float rel = mix(gr * 0.35 + 0.3 * lime, gr - 1.2 * joint - 0.4, bare);
  vec3 wn = normalize(vec3(-vec2(dFdx(rel), dFdy(rel)) / px * 0.012, 1.0));
  vec3 plaster = vec3(0.5, 0.42, 0.31) * (0.78 + 0.32 * lime) * (0.9 + 0.15 * gr);
  vec3 block = vec3(0.34, 0.3, 0.26) * (0.7 + 0.5 * hash(floor(sv))) * (0.8 + 0.3 * gr);
  vec3 wall = mix(plaster, mix(block, vec3(0.2, 0.17, 0.13), joint * 0.8), bare);
  wall *= 1.0 - 0.3 * smoothstep(0.5, 0.53, lime) * (1.0 - bare);
  wall *= 0.7 + 0.3 * smoothstep(-0.3, 0.5, p.y) * (0.8 + 0.2 * noise(vec2(pw.x * 30.0, pw.y * 2.0)));
  vec3 c = shade(wall, wn, p, 0.9);

  // The garret's roof coming down over the right, dark boards and the purlin along its foot.
  float roof = p.y - (0.98 - 0.36 * (p.x + 0.2));
  if (roof > -0.04) {
    vec2 rb = rot(-0.346) * p;
    float board = smoothstep(0.42, 0.5, abs(fract(rb.y * 9.0) - 0.5));
    vec3 deal = vec3(0.13, 0.08, 0.05) * (0.7 + 0.4 * noise(vec2(rb.x * 3.0, rb.y * 120.0))) * (1.0 - 0.5 * board);
    c = mix(c, shade(deal, vec3(0.0, -0.5, 0.86), p, 0.8), step(0.0, roof));
    float beam = roof + 0.035;
    float bt = clamp(beam / 0.035, -1.0, 1.0);
    vec3 oak = vec3(0.2, 0.12, 0.07) * (0.75 + 0.35 * noise(vec2(rb.x * 2.0, rb.y * 200.0)));
    c = mix(c, shade(oak, normalize(vec3(0.0, bt, sqrt(1.0 - bt * bt) + 0.1)), p, 0.6), step(abs(beam), 0.035));
  }

  // A small arched window in the gable, leaded, the night beyond it and the roofs and spires
  // of the old town under a pale sky.
  vec2 wq = p + plateDrift(0.3) - vec2(1.05, 0.17);
  float win = min(sdBox(wq + vec2(0.0, 0.04), vec2(0.11, 0.13)), sdCircle(wq - vec2(0.0, 0.09), 0.11));
  if (win < 0.04) {
    vec3 sky = mix(vec3(0.16, 0.22, 0.32), vec3(0.05, 0.07, 0.13), smoothstep(-0.1, 0.2, wq.y));
    float town = -0.06 + 0.025 * step(0.5, fract(wq.x * 18.0 + 0.3)) + 0.015 * noise(vec2(wq.x * 40.0, 1.0));
    town = max(town, 0.16 - abs(wq.x + 0.03) * 4.5);
    town = max(town, 0.07 - abs(wq.x - 0.06) * 3.0);
    sky = mix(sky, vec3(0.03, 0.035, 0.05), step(wq.y, town));
    sky += vec3(0.6, 0.45, 0.2) * step(0.93, hash(floor(wq * vec2(60.0, 50.0)))) * step(wq.y, town - 0.01) * 0.6;
    vec2 lz = rot(0.785) * wq * 26.0;
    float lead = max(smoothstep(0.42, 0.5, abs(fract(lz.x) - 0.5)), smoothstep(0.42, 0.5, abs(fract(lz.y) - 0.5)));
    sky = mix(sky, vec3(0.02), lead * 0.85);
    c = mix(c, c * 0.35, fill(win - 0.022, px));
    c = mix(c, sky, fill(win, px));
  }

  // The floor: worn flags, gritty with dust and clay fallen from the figure's making.
  if (p.y < BACK) {
    float dep = HZ - p.y;
    vec2 uv = vec2((p.x + plateDrift(0.5).x) / dep, 1.0 / dep) * 1.25;
    float row = floor(uv.y * 2.4);
    vec2 fv = vec2(uv.x * 1.3 + hash(vec2(row, 1.0)) + 0.3 * sin(row * 2.7), uv.y * 2.4);
    vec2 fid = floor(fv);
    vec2 ff = fract(fv) - 0.5 + (noise(uv * 11.0) - 0.5) * 0.06;
    float seam = 0.75 * max(smoothstep(0.44, 0.495, abs(ff.x)), smoothstep(0.41, 0.49, abs(ff.y)));
    float fn = noise(rot(0.6) * uv * vec2(9.0, 20.0));
    vec3 flag = vec3(0.3, 0.27, 0.23) * (0.65 + 0.45 * hash(fid)) * (0.75 + 0.4 * fn);
    flag = mix(flag, vec3(0.38, 0.27, 0.18), 0.4 * smoothstep(0.55, 0.8, noise(uv * 5.0 + 3.0)));
    flag = mix(flag, vec3(0.09, 0.065, 0.05), seam);
    vec3 fN = normalize(vec3((hash(fid + 2.0) - 0.5) * 0.2 + (fn - 0.5) * 0.25, 0.85, 0.5));
    vec3 fc = shade(flag, fN, p, 0.85);
    fc *= 1.0 - 0.55 * exp(-(BACK - p.y) * 22.0);
    c = mix(c, fc, fill(p.y - BACK, px));
  }

  // Shadows: the figure's and the bars' thrown on the wall behind, larger than they are; the
  // bars' lying back across the floor; the dark under its feet.
  if (p.y > BACK) {
    vec2 sw = LAMP + (p - LAMP) / 1.3;
    vec2 hs = (sw - O) / TS;
    if (abs(hs.x) < 0.5 && hs.y > -0.7 && hs.y < 0.54)
      c *= 1.0 - 0.55 * smoothstep(0.06, -0.06, hulk(hs)) * smoothstep(BACK - 0.02, BACK + 0.06, p.y);
    c *= 1.0 - 0.45 * barShade(sw.x, 0.012) * step(sw.y, 0.82) * (1.0 - step(0.0, roof));
  } else if (p.y > -0.74) {
    float back = p.y + 0.74;
    c *= 1.0 - 0.45 * barShade(p.x - back * (p.x - LAMP.x) * 0.55, 0.004 + back * 0.03);
  }
  c = gloom(c, p, O + vec2(0.2, -0.53) * TS, vec2(0.36, 0.06) * TS);
  c = gloom(c, p, O + vec2(0.0, -0.61) * TS, vec2(0.3, 0.035) * TS);

  // The shelf under the window: a crock, two books gone to rags; on the Sabbath two candles.
  vec2 sq = p - vec2(1.1, -0.06);
  c = gloom(c, p, sq * 0.0 + vec2(1.1, -0.1), vec2(0.3, 0.05));
  c = mix(c, shade(vec3(0.2, 0.12, 0.07) * (0.8 + 0.3 * noise(vec2(p.x * 40.0, p.y * 300.0))), vec3(0.0, 0.5, 0.86), p, 0.6), fill(sdBox(sq, vec2(0.25, 0.014)), px));
  vec2 jq = p - vec2(1.24, 0.02);
  float jar = smin(sdEllipse(jq, vec2(0.05, 0.065)), sdBox(jq - vec2(0.0, 0.07), vec2(0.028, 0.015)), 0.02);
  c = mix(c, shade(vec3(0.4, 0.24, 0.13) * (0.8 + 0.3 * noise(jq * 60.0)), swell(jar, 0.04), p, 0.45), fill(jar, px));
  vec2 bk = p - vec2(0.93, -0.01);
  c = mix(c, shade(vec3(0.25, 0.08, 0.05), vec3(-0.2, 0.0, 0.98), p, 0.8), fill(sdBox(bk, vec2(0.022, 0.05)) - 0.003, px));
  c = mix(c, shade(vec3(0.12, 0.1, 0.06), vec3(0.1, 0.0, 0.99), p, 0.8), fill(sdBox(rot(-0.25) * (bk - vec2(0.05, 0.0)), vec2(0.02, 0.048)) - 0.003, px));
  if (rest > 0.5) {
    for (int k = 0; k < 2; k++) {
      vec2 cq = p - vec2(k == 0 ? 1.04 : 1.13, 0.0);
      float wax = sdBox(cq - vec2(0.0, 0.0 + 0.012 * float(k)), vec2(0.011, 0.05 - 0.012 * float(k)));
      c = mix(c, shade(vec3(0.85, 0.8, 0.68), rod(cq.x / 0.012), p, 0.6) + FLAME * 0.25, fill(wax, px));
      vec2 fq = cq - vec2(0.0, 0.075 - 0.0 * float(k));
      fq.y += 0.0;
      fq.x -= 0.002 * sin(t * 5.0 + float(k) * 2.0) * clamp(fq.y / 0.02, 0.0, 1.0);
      c += FLAME * (0.14 * exp(-length(fq) * 9.0) + 0.3 * exp(-length(fq) * 40.0));
      c = mix(c, vec3(1.0, 0.82, 0.5), fill(length(fq * vec2(1.0, 0.45)) - 0.008, px));
    }
  }

  // The Golem: river clay, pressed into shape by hand and left to dry, the thumbs' gouges and the
  // palms' smears all over it, cracked where it shrank. Asleep it is grey; woken, a warmth
  // shows from inside it, in the cracks.
  vec2 q = (p - O) / TS;
  float qx = px / TS;
  float tb = 1.0, ab = 1.0;
  if (abs(q.x) < 0.42 && q.y > -0.63 && q.y < 0.47) {
    tb = trunk(q);
    ab = arms(q);
  }
  vec3 tn = swell(tb, 0.14), an = swell(ab, 0.06);
  float body = min(tb, ab);
  if (body < 0.02) {
    vec2 hq = q - vec2(0.0, 0.335);
    vec2 sm = rot(0.4 + 0.9 * noise(q * 3.0)) * q;
    float smear = noise(sm * vec2(6.0, 44.0));
    float r0 = 0.6 * smear * smoothstep(0.3, 0.7, noise(q * 5.0 + 4.0)) + 0.35 * noise(q * 6.0);
    vec2 gq = rot(0.7) * q * 9.0;
    vec2 gid = floor(gq);
    vec2 gf = rot(1.2 + 1.4 * noise(gid * 0.3) + 0.6 * hash(gid + 7.0)) * (fract(gq) - 0.5 - (vec2(hash(gid), hash(gid + 3.1)) - 0.5) * 0.25);
    float gr2 = length(gf * vec2(0.85, 2.4)) / (0.2 + 0.1 * hash(gid + 1.0));
    float gouge = step(0.25, hash(gid + 5.0)) * (0.4 + 0.6 * hash(gid + 9.0));
    float press = exp(-gr2 * gr2 * 2.2);
    r0 -= 0.85 * gouge * press;
    // The face, as a thumb would make it: a shelf of brow, the sockets pushed in under it, a
    // blunt nose, a cut for the mouth.
    r0 += 1.3 * exp(-pow((hq.y - 0.02) / 0.015, 2.0)) * smoothstep(0.085, 0.05, abs(hq.x));
    vec2 ey = vec2(abs(hq.x) - 0.034, hq.y + 0.002);
    float socket = exp(-dot(ey / vec2(0.022, 0.014), ey / vec2(0.022, 0.014)));
    r0 -= 1.6 * socket;
    vec2 ns = (hq - vec2(0.0, -0.03)) / vec2(0.014, 0.026);
    r0 += 1.2 * exp(-dot(ns, ns));
    r0 -= 1.0 * exp(-pow((hq.y + 0.07) / 0.006, 2.0)) * smoothstep(0.035, 0.02, abs(hq.x));
    vec2 ck = (vec2(abs(hq.x) - 0.05, hq.y + 0.035)) / 0.025;
    r0 += 0.5 * exp(-dot(ck, ck));
    r0 -= 0.7 * exp(-pow((q.y - 0.07 + 2.0 * q.x * q.x) / 0.014, 2.0)) * step(abs(q.x), 0.17);
    vec2 pc = (vec2(abs(q.x) - 0.09, q.y - 0.11)) / vec2(0.08, 0.05);
    vec2 bl = (q - vec2(0.0, -0.06)) / vec2(0.13, 0.1);
    r0 += 3.0 * exp(-dot(pc, pc)) + 2.0 * exp(-dot(bl, bl));
    vec2 hd = vec2(abs(q.x) - 0.322, q.y + 0.375 + (q.x < 0.0 ? 0.015 : 0.0));
    float fing = abs(fract(hd.x / 0.032 + 0.5) - 0.5) * 0.032;
    r0 -= 0.6 * exp(-pow(fing / 0.006, 2.0)) * smoothstep(-0.01, -0.06, hd.y) * smoothstep(0.1, 0.08, length(hd));
    r0 -= 0.9 * exp(-pow(sdSegment(hd, vec2(-0.05, 0.03), vec2(-0.035, -0.055)) / 0.009, 2.0));
    vec2 nv = (q - vec2(0.0, -0.09)) / 0.012;
    r0 -= 1.4 * exp(-dot(nv, nv));
    float wd = 1.0;
    if (abs(hq.y - 0.062) < 0.03 && abs(hq.x) < 0.07) wd = word(hq - vec2(0.0, 0.062) + (vec2(noise(hq * 260.0), noise(hq * 260.0 + 5.0)) - 0.5) * 0.003);
    float incised = smoothstep(0.0034, 0.0012, wd);
    r0 -= 1.3 * incised;
    // The lumps it was built up from, and the cracks that opened between them as it dried.
    vec2 cv = rot(0.3) * q * 11.0 + 0.25 * vec2(noise(q * 24.0), noise(q * 24.0 + 7.0));
    float edge = abs(noise(cv) - 0.5) * 0.9;
    float lump = noise(cv * 0.6 + 3.0);
    r0 += 0.14 * smoothstep(0.0, 0.3, edge) + 0.1 * lump;
    float crack = smoothstep(0.035, 0.008, edge) * smoothstep(0.58, 0.7, noise(q * 3.0 + 11.0) + 0.15 * noise(q * 12.0));
    vec2 rg = vec2(dFdx(r0), dFdy(r0)) / qx * 0.0055;
    float onArm = fill(ab, qx);
    vec2 hc = (hq - vec2(0.0, -0.005)) / vec2(0.105, 0.115);
    vec3 hn = normalize(vec3(hc * 0.9, sqrt(1.0 - min(dot(hc, hc), 1.0)) + 0.15));
    vec3 N = normalize(mix(mix(tn, hn, smoothstep(0.22, 0.28, q.y)), an, onArm) + vec3(-rg, 0.0));
    vec3 clay = mix(vec3(0.46, 0.3, 0.18), vec3(0.37, 0.34, 0.3), (1.0 - awake) * 0.75);
    clay *= (0.78 + 0.3 * noise(q * 7.0 + 1.0)) * (0.85 + 0.22 * smear);
    float dry = smoothstep(0.45, 0.75, noise(q * 4.0 + 20.0) + 0.3 * (lump - 0.5));
    clay = mix(clay, clay * vec3(1.25, 1.22, 1.18) + 0.03, dry * 0.6);
    clay *= 0.93 + 0.12 * hash(floor(q * 260.0));
    clay *= 1.0 - 0.12 * gouge * press;
    clay *= 1.0 - 0.5 * crack - 0.5 * socket - 0.65 * incised;
    clay *= 1.0 - 0.18 * rest;
    vec3 fig = shade(clay, N, p, 0.82);
    fig *= 1.0 - 0.55 * smoothstep(0.035, 0.0, ab) * (1.0 - onArm);
    vec2 jw = (q - vec2(0.0, 0.255)) / vec2(0.1, 0.03);
    fig *= 1.0 - 0.5 * exp(-dot(jw, jw)) * (1.0 - onArm);
    fig *= 0.6 + 0.4 * smoothstep(-0.6, 0.0, q.y);
    float warmth = awake * (1.0 - rest);
    fig += EMBER * warmth * (0.3 * crack + 0.05 * (1.0 - N.z));
    fig += EMBER * awake * (1.4 * incised + 0.3 * exp(-wd / 0.005));
    vec2 eo = vec2(ey.x, ey.y + 0.004);
    float eye = sdEllipse(eo, vec2(0.012, 0.0025 + 0.005 * awake));
    fig = mix(fig, mix(fig * 0.4, EMBER * 1.3, smoothstep(0.15, 0.75, awake)), fill(eye, qx * 0.6) * smoothstep(-0.12, 0.0, -abs(hq.x) + 0.06));
    fig *= 1.0 - 0.45 * barShade(LAMP.x + (p.x - LAMP.x) / 1.1, 0.008);
    c = mix(c, fig, fill(body, qx));
  }

  // The cage: forged bars, hammered uneven, black, rust blooming orange where the damp has had
  // them; the rails top and foot; the corner posts; the rivets. Rubbed, a pale light crawls them.
  float bu = (p.x - O.x - 0.15) / GAP;
  float bi = clamp(floor(bu + 0.5), -3.0, 2.0);
  float bx = O.x + 0.15 + bi * GAP;
  float bd = abs(p.x - bx);
  float crawl = smoothstep(0.62, 0.9, noise(vec2(bi * 5.0, p.y * 9.0 - t * 1.6))) * smoothstep(0.3, 0.8, noise(vec2(p.y * 60.0 + bi, t * 5.0)));
  bool span = p.y > -0.74 && p.y < 0.82;
  c += vec3(0.6, 0.75, 1.0) * charge * crawl * 0.12 * exp(-bd / 0.02) * float(span);
  float wob = BW * (1.0 + 0.16 * (noise(vec2(bi * 7.0, p.y * 9.0)) - 0.5));
  if (span && bd < wob + px * 2.0) {
    float a = (p.x - bx) / wob;
    float rust = smoothstep(0.35, 0.85, noise(vec2(bi * 3.0 + a * 0.3, p.y * 4.0)) * 0.55 + noise(vec2(a * 1.5 + bi, p.y * 70.0)) * 0.45);
    vec3 iron = mix(vec3(0.075, 0.068, 0.062), vec3(0.27, 0.12, 0.05), rust) * (0.75 + 0.35 * noise(vec2(a * 4.0, p.y * 110.0)));
    vec3 N = normalize(rod(a) + vec3(0.0, 0.35 * (noise(vec2(bi * 11.0, p.y * 18.0)) - 0.5), 0.0));
    vec3 bc = shade(iron, N, p, mix(0.3, 0.92, rust));
    float path = 0.6 * sin(p.y * 55.0 + t * 9.0 + bi * 3.0) + 0.3 * sin(p.y * 160.0 - t * 13.0);
    bc += vec3(0.75, 0.86, 1.0) * charge * crawl * (exp(-abs(a - path) * wob / 0.0035) + 0.15);
    c = mix(c, bc, smoothstep(wob, wob - px * 1.5, bd));
  }
  for (int k = 0; k < 2; k++) {
    float x0 = k == 0 ? -0.95 : 0.85;
    float pd = abs(p.x - x0);
    if (pd < 0.04 && p.y > -0.78 && p.y < 0.86) {
      float a = (p.x - x0) / 0.036;
      vec3 N = a < -0.15 ? vec3(-0.6, 0.0, 0.8) : vec3(0.15, 0.0, 0.99);
      vec3 iron = vec3(0.08, 0.07, 0.065) * (0.8 + 0.4 * noise(vec2(a * 3.0, p.y * 60.0)));
      iron = mix(iron, vec3(0.25, 0.11, 0.05), smoothstep(0.4, 0.9, noise(vec2(float(k) * 9.0, p.y * 4.0)) * 0.55 + noise(vec2(a * 1.5, p.y * 70.0)) * 0.45));
      c = mix(c, shade(iron, N, p, 0.6), smoothstep(0.036, 0.034, pd));
    }
  }
  for (int k = 0; k < 2; k++) {
    float y0 = k == 0 ? 0.81 : -0.735;
    float h = k == 0 ? 0.022 : 0.028;
    if (abs(p.y - y0) < h + 0.004 && p.x > -0.99 && p.x < 0.89) {
      float a = (p.y - y0) / h;
      vec3 N = normalize(vec3(0.0, a * 0.7, 1.0));
      vec3 iron = vec3(0.08, 0.07, 0.065) * (0.8 + 0.4 * noise(vec2(p.x * 70.0, a * 3.0)));
      iron = mix(iron, vec3(0.32, 0.13, 0.05), smoothstep(0.55, 0.8, noise(vec2(p.x * 9.0, float(k) * 5.0 + a))));
      vec3 rc = shade(iron, N, p, 0.55);
      vec2 rv = vec2(bd, p.y - y0) / 0.011;
      rc = mix(rc, shade(vec3(0.1, 0.09, 0.08), normalize(vec3(rv, 0.8)), p, 0.3), fill(length(rv) - 1.0, px / 0.011) * step(abs(bu - bi), 0.5));
      c = mix(c, rc, smoothstep(h, h - px * 1.5, abs(p.y - y0)));
    }
  }
  c = gloom(c, p, vec2(-0.05, -0.77), vec2(0.95, 0.03));

  // The lantern, hung from its chain in front of the cage: a pierced iron cap, horn panes lit
  // from within, the flame, and the warm air about it with the dust turning in it.
  vec2 lq = p - LAMP;
  if (abs(lq.x) < 0.1 && lq.y > -0.12) {
    float link = abs(fract(lq.y * 30.0) - 0.5) * 2.0;
    float chain = abs(lq.x) - 0.006 * (0.5 + 0.5 * link);
    c = mix(c, shade(vec3(0.09, 0.08, 0.07), vec3(0.0, 0.0, 1.0), p, 0.4), fill(chain, px) * step(0.12, lq.y));
    float cap = max(sdBox(lq - vec2(0.0, 0.085), vec2(0.06, 0.03)), lq.y - 0.115 + abs(lq.x) * 0.6);
    c = mix(c, shade(vec3(0.1, 0.085, 0.07), normalize(vec3(lq.x * 6.0, 0.6, 0.8)), p, 0.4), fill(cap, px));
    float pane = sdBox(lq, vec2(0.045, 0.055));
    vec3 horn = vec3(1.0, 0.72, 0.36) * (0.75 + 0.25 * noise(lq * 90.0)) * glow * (0.8 + 0.35 * exp(-length(lq) * 22.0));
    c = mix(c, horn, fill(pane, px));
    float cage = min(abs(lq.x) - 0.004, abs(abs(lq.x) - 0.048) - 0.006);
    c = mix(c, vec3(0.05, 0.04, 0.03), fill(cage, px) * step(abs(lq.y), 0.056));
    c = mix(c, shade(vec3(0.1, 0.085, 0.07), vec3(0.0, -0.3, 0.95), p, 0.4), fill(sdBox(lq + vec2(0.0, 0.065), vec2(0.055, 0.01)), px));
  }
  c += FLAME * glow * (0.12 * exp(-length(lq) * 2.6) + 0.3 * exp(-length(lq) * 16.0));
  vec2 mg = p * 55.0 + vec2(t * 0.6, t * 0.25);
  vec2 mid = floor(mg);
  float mote = step(0.975, hash(mid)) * smoothstep(0.3, 0.0, length(fract(mg) - 0.5 - (vec2(hash(mid + 1.0), hash(mid + 2.0)) - 0.5) * 0.4));
  c += FLAME * mote * 0.35 * exp(-length(lq) * 2.2);
  c += FLAME * 0.035 * noise(p * 4.0 + vec2(t * 0.05, 0.0)) * exp(-length(lq) * 1.4);

  c *= 1.0 - 0.2 * dot(p * 0.55, p * 0.55);

  float metal = float(span) * smoothstep(wob, wob - px * 1.5, bd);
  float clayOn = fill(body, 0.01);
  if (lensIn(p) > 0.0) {
    float wordOn = clayOn * smoothstep(0.004, 0.0015, word(q - vec2(0.0, 0.397)));
    c = fluoroscope(c, p, mix(mix(0.45, 0.7, clayOn), mix(0.25, 1.15, awake), wordOn) - 0.4 * metal);
  }
  return c;
}
`,n=.75,r=.3,i={source:t,start({stage:t,root:i,env:a}){let o=a.on,s=0,c=0,l=!1;return{frame(u,d,f){let p=o?0:f.scrub;s=e(s,p,p>s?5:.5,d),s>=n?l=!0:s<r&&(l=!1),c=e(c,+!!l,l?3:1,d),t.set(`a`,[s,c,+!!o,0]),t.set(`env`,[a.level,+!!o,0,0]),i.dataset.state=o?`sabbath`:c>.5?`awake`:`asleep`},level:()=>Math.max(s*.6,c),dispose(){}}},plates:[{name:`asleep`,caption:{almanac:`Asleep, grey, with its eyes shut and the word dark on its brow.`,cipher:`Plate I: dormant; inscription intact.`},a:[0,0,0,0]},{name:`awake`,caption:{almanac:`Awake, with the word burning on its brow and its eyes open.`,cipher:`Plate II: active; inscription lit.`},a:[.8,1,0,0]}]};export{i as scene};