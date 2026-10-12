import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=5,n={source:`
const vec3 SOOT = vec3(0.045, 0.04, 0.042);
const vec3 TRACE = vec3(0.91, 0.89, 0.86);
const vec3 DAMASK = vec3(0.4, 0.085, 0.11);
const vec3 VELVET = vec3(0.42, 0.05, 0.07);
const vec3 CANDLE = vec3(0.95, 0.78, 0.42);
const vec3 BRASS = vec3(0.62, 0.47, 0.22);
const vec3 GOLD = vec3(0.7, 0.52, 0.22);
const vec3 WOOD = vec3(0.2, 0.09, 0.05);
const vec3 SKIN = vec3(0.8, 0.62, 0.53);
const vec3 LINEN = vec3(0.8, 0.77, 0.7);
const vec2 FLAME = vec2(-1.15, -0.14);
const vec2 DRUM = vec2(0.86, -0.02);
const vec2 DRUM_R = vec2(0.23, 0.24);
const float CAP = 0.024;
const vec2 TAMBOUR = vec2(0.47, 0.0);
const float BEDTOP = -0.34;
const vec2 HEAD = vec2(-0.8, -0.235);
// One turn of the drum, in seconds.
const float TURN = 24.0;
float flick;

// The breath at a given moment, -1 to 1: long and even asleep, flat and shallow pressed.
float breath(float at, float pressed) {
  float per = mix(4.2, 1.7, pressed);
  return mix(1.0, 0.13, pressed) * sin(6.2832 * at / per);
}
// Whether the sleeper was pressed a given number of seconds ago.
float pressedAgo(float ago) {
  return ago < u_a.y ? u_a.w : u_a.z;
}

// The sleeper's outline under the coverlet, lying on their back, head at the left: the chest
// rising and falling with the breath, the knees, the feet.
float coverTop(float x, float chest) {
  float c = (0.075 + 0.012 * chest) * exp(-pow((x + 0.42) / 0.16, 2.0));
  float knees = 0.05 * exp(-pow((x + 0.02) / 0.13, 2.0));
  float feet = 0.07 * exp(-pow((x - 0.2) / 0.045, 2.0));
  return BEDTOP + 0.05 + c + knees + feet;
}

float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}

// The candle, low at the left, warm and failing with distance; a thin cold of night from the
// right, off the window that is not in the picture.
vec3 shade(vec3 alb, vec3 N, vec2 p, float rough) {
  vec2 d = FLAME - p;
  vec3 L = normalize(vec3(d, 0.5));
  float att = flick / (1.0 + 2.4 * dot(d, d));
  float ndl = dot(N, L);
  float diff = mix(max(ndl, 0.0), 0.5 + 0.5 * ndl, 0.3 * rough);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(70.0, 10.0, rough)) * (1.0 - rough);
  float night = max(dot(N, normalize(vec3(0.7, 0.4, 0.6))), 0.0);
  return alb * (vec3(0.018, 0.016, 0.022) + vec3(0.1, 0.11, 0.16) * night + CANDLE * diff * att * 2.6)
       + CANDLE * sp * att * 1.3;
}
vec2 boxGrad(vec2 p, vec2 b) {
  vec2 e = vec2(0.002, 0.0);
  return vec2(sdBox(p + e.xy, b) - sdBox(p - e.xy, b), sdBox(p + e.yx, b) - sdBox(p - e.yx, b)) / 0.004;
}
// A rod or rail seen side on: across is -1..1 over its width.
vec3 rod(float across, bool upright) {
  float a = clamp(across, -1.0, 1.0);
  return upright ? normalize(vec3(a, 0.0, sqrt(1.0 - a * a) + 0.05)) : normalize(vec3(0.0, a, sqrt(1.0 - a * a) + 0.05));
}
// The slope of a rounded shape, from its outline inward.
vec3 swell(float d, float depth) {
  vec2 g = normalize(vec2(dFdx(d), dFdy(d)) + 1e-6);
  float r = clamp(-d / depth, 0.0, 1.0);
  return normalize(vec3(g * (1.0 - r), 0.3 + r));
}
// The damask's flower: a bud, two leaves, the stem and the boss, on a dropped repeat.
float damask(vec2 pw) {
  vec2 dq = pw * vec2(5.0, 3.6);
  dq.x += 0.5 * mod(floor(dq.y), 2.0);
  vec2 f = fract(dq) - 0.5;
  vec2 m = vec2(abs(f.x), f.y);
  float bud = length((m - vec2(0.0, 0.16)) * vec2(3.2, 1.3)) - 0.16;
  float leaf = length((rot(0.6) * (m - vec2(0.16, -0.02))) * vec2(1.2, 3.4)) - 0.17;
  float stem = sdSegment(m, vec2(0.0, -0.3), vec2(0.0, 0.1)) - 0.012;
  float boss = length(m - vec2(0.0, -0.12)) - 0.07;
  return smoothstep(0.03, -0.03, min(min(bud, leaf), min(stem, boss)));
}
// The sleeper's head, face to the ceiling, seen from the side: the skull on the pillow, the
// brow, the nose the highest point, the lips, the chin, and the throat going down to the sheet.
float face(vec2 q) {
  float d = sdEllipse(q, vec2(0.062, 0.052));
  d = smin(d, sdEllipse(q - vec2(0.02, 0.02), vec2(0.04, 0.032)), 0.02);
  d = smin(d, sdEllipse(q - vec2(-0.008, 0.05), vec2(0.018, 0.01)), 0.012);
  d = smin(d, cone(q, vec2(0.01, 0.05), vec2(0.022, 0.077), 0.011, 0.005), 0.008);
  d = smin(d, sdEllipse(q - vec2(0.045, 0.051), vec2(0.01, 0.011)), 0.006);
  d = smin(d, sdEllipse(q - vec2(0.058, 0.036), vec2(0.013, 0.012)), 0.008);
  d = smin(d, cone(q, vec2(0.045, -0.005), vec2(0.11, -0.03), 0.021, 0.024), 0.015);
  return d;
}

vec3 scene(vec2 p) {
  float px = 2.0 / min(u_res.x, u_res.y);
  float t = u_time;
  float now = breath(t, u_a.w);
  float come = u_a.x;
  flick = (0.86 + 0.08 * sin(t * 9.0) * sin(t * 2.3) + 0.06 * noise(vec2(t * 4.0, 1.0))) * (1.0 - 0.35 * come);

  // The walls: a crimson silk damask gone nearly black, the satin of its pattern catching the
  // candle where the ground stays dull.
  vec2 pw = p + plateDrift(0.25);
  float motif = 0.4 * damask(pw);
  float weave = 0.5 + 0.5 * sin(pw.x * 900.0) * sin(pw.y * 900.0);
  vec3 silk = DAMASK * (0.75 + 0.2 * grain(pw * 60.0)) * (0.9 + 0.1 * weave);
  vec3 c = shade(silk, normalize(vec3(0.0, 0.0, 1.0)), p, mix(0.95, 0.5, motif));
  c *= 1.0 - 0.08 * motif;

  // The sleeper's shadow thrown on the wall by the candle, larger than the sleeper, breathing;
  // and once it has come, something crouched on the shadow's chest that the bed does not hold.
  float xs = FLAME.x + (p.x - FLAME.x) / 1.35;
  float rise = (coverTop(xs, now) - BEDTOP) * 1.6 + 0.06;
  float shadow = smoothstep(0.03, -0.03, p.y - (BEDTOP + rise)) * step(-0.62, xs) * step(xs, 0.25);
  shadow = max(shadow, smoothstep(0.03, -0.03, length((p - vec2(FLAME.x + (-0.76 - FLAME.x) * 1.35, BEDTOP + 0.17)) / vec2(1.0, 1.1)) - 0.08));
  vec2 fq = (p - vec2(-0.165, -0.08 + 0.08 * come)) / max(come, 0.05);
  float fig = smin(sdEllipse(rot(0.3) * fq, vec2(0.1, 0.12)), sdCircle(fq - vec2(-0.07, 0.14), 0.062), 0.04);
  fig = min(fig, min(cone(fq, vec2(-0.11, 0.18), vec2(-0.17, 0.23), 0.016, 0.0), cone(fq, vec2(-0.03, 0.18), vec2(0.02, 0.23), 0.016, 0.0)));
  fig = smin(fig, sdEllipse(fq - vec2(-0.07, 0.13), vec2(0.075, 0.05)), 0.02);
  fig = smin(fig, cone(fq, vec2(-0.08, 0.02), vec2(-0.14, -0.1), 0.03, 0.02), 0.03);
  c *= 1.0 - 0.6 * shadow;
  c *= 1.0 - 0.85 * smoothstep(0.04, -0.03, fig) * smoothstep(0.1, 0.7, come);

  // The tester above the bed: its cornice, the valance of velvet hanging from it in shallow
  // swags with a gold fringe, and the bed-curtain at the head tied back to the post.
  if (p.y > 0.54 && p.x < 0.38 && p.x > -1.06) {
    float hem = 0.6 - 0.035 * (1.0 - abs(sin(p.x * 6.0 + 0.4)));
    float vf = sin(p.x * 70.0 + 2.0 * noise(vec2(p.x * 6.0, 0.0))) * smoothstep(0.74, hem, p.y);
    vec3 vn = normalize(vec3(vf * 0.5, 0.2, 1.0));
    vec3 val = shade(VELVET * (0.7 + 0.5 * (1.0 - vn.z) + 0.15 * grain(p * 90.0)), vn, p, 0.9);
    c = mix(c, val, fill(hem - p.y, px) * step(p.y, 0.75));
    float fringe = step(p.y, hem) * step(hem - 0.04 - 0.008 * hash(vec2(floor(p.x * 260.0), 1.0)), p.y);
    c = mix(c, shade(GOLD * (0.6 + 0.5 * step(0.5, fract(p.x * 260.0))), vec3(0.0, 0.3, 0.95), p, 0.4), fringe);
    vec2 cq = p - vec2(-0.34, 0.77);
    c = mix(c, shade(WOOD * 1.2 * (0.8 + 0.3 * noise(vec2(p.x * 40.0, p.y * 3.0))), rod(cq.y / 0.025, false), p, 0.35), fill(sdBox(cq, vec2(0.72, 0.025)), px));
  }
  float tieY = 0.0;
  float right = -0.6 - 0.23 * exp(-pow((p.y - tieY) / 0.22, 2.0));
  float curtain = max(max(-1.02 - p.x, p.x - right), p.y - 0.6);
  if (curtain < px * 2.0) {
    float u = (p.x + 1.02) / (right + 1.02);
    float ph = u * 22.0 + 1.6 * noise(vec2(u * 4.0, p.y * 1.4)) + 0.6 * sin(p.y * 2.0 + u * 3.0);
    vec3 cn = normalize(vec3(sin(ph) * 0.75, 0.0, 1.0));
    vec3 vel = VELVET * (0.55 + 0.7 * (1.0 - cn.z) + 0.1 * grain(p * 120.0));
    vel *= 0.7 + 0.3 * smoothstep(-0.2, 0.6, cos(ph));
    c = mix(c, shade(vel, cn, p, 0.92), fill(curtain, px));
    vec2 tq = p - vec2(right + 0.02, tieY);
    float cord = sdBox(rot(0.2) * tq, vec2(0.14, 0.008));
    c = mix(c, shade(GOLD * (0.7 + 0.4 * step(0.5, fract((tq.x + tq.y) * 150.0))), rod(tq.y / 0.01, false), p, 0.3), fill(cord, px) * step(-1.02, p.x) * step(p.x, right + 0.03));
  }
  vec2 tas = p - vec2(-0.82, -0.07);
  float tassel = min(sdEllipse(tas, vec2(0.016, 0.04)), sdCircle(tas - vec2(0.0, 0.045), 0.012));
  c = mix(c, shade(GOLD * (0.65 + 0.4 * step(0.5, fract(tas.x * 400.0))), swell(tassel, 0.02), p, 0.4), fill(tassel, px));

  // The floor: dark boards, a worn rug at the bedside.
  if (p.y < -0.72) {
    float fy = -0.72 - p.y;
    float plank = smoothstep(0.92, 1.0, abs(fract(p.x / (0.25 + fy) * 1.5) * 2.0 - 1.0));
    vec3 boards = WOOD * 0.45 * (0.8 + 0.3 * fbm(vec2(p.x * 3.0, p.y * 40.0))) * (1.0 - 0.5 * plank);
    c = shade(boards, normalize(vec3(0.0, 1.0, 0.4)), p, 0.6);
    float rug = sdBox(p - vec2(-0.3, -0.86), vec2(0.75, 0.1));
    vec3 wool = mix(vec3(0.24, 0.12, 0.08), vec3(0.12, 0.1, 0.16), damask(p * vec2(1.5, 3.0)) * 0.6) * (0.7 + 0.5 * grain(p * 120.0));
    wool = mix(wool, GOLD * 0.5, stroke(sdBox(p - vec2(-0.3, -0.86), vec2(0.7, 0.07)), 0.006, px));
    c = mix(c, shade(wool, normalize(vec3(0.0, 1.0, 0.5)), p, 1.0), fill(rug, px));
  }
  c *= 1.0 - 0.4 * exp(-abs(p.y + 0.72) * 50.0);

  // The night stand: a box of old mahogany, its top lit, a drawer pull; the brown bottle of
  // drops; the candle in its chamberstick, the wax run down it.
  vec2 nq = p - vec2(-1.15, -0.55);
  float stand = sdBox(nq, vec2(0.15, 0.2)) - 0.006;
  float sb = 1.0 - smoothstep(0.0, 0.02, -stand);
  vec3 standN = normalize(vec3(boxGrad(nq, vec2(0.15, 0.2)) * sb, 1.0));
  vec3 mahog = WOOD * (0.7 + 0.4 * fbm(vec2(nq.x * 40.0, nq.y * 4.0)));
  c = mix(c, shade(mahog, standN, p, 0.4), fill(stand, px));
  c = mix(c, shade(mahog * 1.2, normalize(vec3(0.0, 1.0, 0.3)), p, 0.35), fill(sdBox(nq - vec2(0.0, 0.205), vec2(0.165, 0.012)), px));
  c = mix(c, c * 0.5, stroke(sdBox(nq - vec2(0.0, 0.08), vec2(0.12, 0.05)), 0.003, px));
  vec2 kq = (nq - vec2(0.0, 0.08)) / 0.014;
  c = mix(c, shade(BRASS, normalize(vec3(kq, sqrt(max(1.0 - dot(kq, kq), 0.0)))), p, 0.2), fill(length(kq) - 1.0, px / 0.014));
  vec2 bo = p - vec2(-1.045, -0.3);
  float bottle = smin(sdBox(bo, vec2(0.02, 0.032)) - 0.01, sdBox(bo - vec2(0.0, 0.05), vec2(0.006, 0.02)), 0.012);
  vec3 glass = c * 0.35 + vec3(0.2, 0.08, 0.025) * (0.4 + 0.8 * flick);
  glass += CANDLE * 0.7 * smoothstep(0.005, 0.0, abs(bo.x + 0.016)) * smoothstep(0.05, 0.0, abs(bo.y)) * flick;
  glass = mix(glass, shade(vec3(0.72, 0.66, 0.52) * (0.85 + 0.2 * grain(bo * 300.0)), vec3(0.0, 0.0, 1.0), p, 0.9), fill(sdBox(bo - vec2(0.0, -0.005), vec2(0.021, 0.016)), px));
  c = mix(c, glass, fill(bottle, px));
  c = mix(c, shade(vec3(0.45, 0.32, 0.2), rod(bo.x / 0.007, true), p, 0.8), fill(sdBox(bo - vec2(0.0, 0.074), vec2(0.007, 0.008)), px));
  vec2 cs = p - vec2(-1.15, -0.34);
  float dish = sdEllipse(cs, vec2(0.06, 0.012));
  c = mix(c, shade(BRASS * 0.9, normalize(vec3(cs.x / 0.06, 0.6, 0.6)), p, 0.25), fill(dish, px));
  c = mix(c, shade(BRASS, normalize(vec3(0.0, 0.0, 1.0)), p, 0.2), stroke(length((cs - vec2(0.075, 0.012)) * vec2(1.0, 1.4)) - 0.018, 0.004, px));
  vec2 wq = p - vec2(-1.15, -0.27);
  float wax = min(sdBox(wq, vec2(0.02, 0.08)) - 0.003, min(sdEllipse(wq - vec2(-0.018, 0.02), vec2(0.007, 0.05)), sdEllipse(wq - vec2(0.019, -0.03), vec2(0.006, 0.035))));
  float wu = clamp(wq.x / 0.025, -1.0, 1.0);
  vec3 waxc = shade(vec3(0.88, 0.82, 0.68), normalize(vec3(wu, 0.0, sqrt(1.0 - wu * wu) + 0.05)), p, 0.6);
  waxc += CANDLE * 0.55 * flick * exp(-max(FLAME.y - 0.05 - p.y, 0.0) * 12.0);
  c = mix(c, waxc, fill(wax, px));

  // The bed's posts, turned and polished, and the side rail.
  for (int k = 0; k < 2; k++) {
    float x0 = k == 0 ? -0.96 : 0.29;
    float top = k == 0 ? 0.6 : 0.6;
    float w = 0.017 + 0.007 * smoothstep(0.3, 1.0, sin(p.y * 16.0 + float(k))) + 0.012 * smoothstep(-0.5, -0.62, p.y);
    vec2 q = p - vec2(x0, 0.0);
    float post = max(abs(q.x) - w, max(p.y - top, -0.74 - p.y));
    vec3 pc = shade(WOOD * 1.1 * (0.8 + 0.3 * noise(vec2(q.x * 200.0, p.y * 6.0))), rod(q.x / w, true), p, 0.3);
    c = gloom(c, p, vec2(x0, -0.74), vec2(0.05, 0.01));
    c = mix(c, pc, fill(post, px));
  }
  vec2 bq = p - vec2(-0.35, -0.55);
  float frame = sdBox(bq, vec2(0.6, 0.2)) - 0.006;
  vec3 frameN = normalize(vec3(boxGrad(bq, vec2(0.6, 0.2)) * (1.0 - smoothstep(0.0, 0.02, -frame)), 1.0));
  c = gloom(c, p, vec2(-0.3, -0.74), vec2(0.62, 0.04));
  c = mix(c, shade(WOOD * 0.8 * (0.8 + 0.3 * fbm(vec2(bq.x * 6.0, bq.y * 50.0))), frameN, p, 0.45), fill(frame, px));

  // The pillow, plump linen, creased where the head has lain; the hair spread across it.
  vec2 pq = p - vec2(-0.84, BEDTOP + 0.04);
  float pillow = smin(sdEllipse(pq, vec2(0.14, 0.042)), sdEllipse(pq - vec2(-0.06, 0.012), vec2(0.07, 0.04)), 0.03);
  vec3 pn = swell(pillow, 0.04);
  vec3 lin = LINEN * (0.9 + 0.1 * grain(p * 200.0)) * (1.0 - 0.15 * smoothstep(0.6, 0.9, noise(rot(0.5) * pq * vec2(40.0, 120.0))));
  c = mix(c, shade(lin, pn, p, 0.85), fill(pillow, px));
  vec2 hq = p - HEAD;
  float hair = smin(sdEllipse(hq - vec2(-0.045, -0.01), vec2(0.075, 0.052)), sdEllipse(hq - vec2(-0.12, -0.04), vec2(0.08, 0.026)), 0.03);
  hair = smin(hair, sdEllipse(hq - vec2(-0.1, -0.075), vec2(0.06, 0.03)), 0.02);
  hair += 0.008 * (noise(hq * vec2(25.0, 90.0)) - 0.5);
  float strand = noise(vec2(hq.x * 10.0 + 2.0 * noise(hq * 18.0), hq.y * 150.0 + hq.x * 30.0));
  vec3 hc = vec3(0.17, 0.065, 0.03) * (0.5 + 0.9 * strand);
  vec3 hn = normalize(swell(hair, 0.05) + vec3(0.0, (strand - 0.5) * 0.8, 0.0));
  c = mix(c, shade(hc, hn, p, 0.55), fill(hair, px));

  // The face: skin warm with the candle, the lid closed and the lashes on the cheek, the lips.
  float fd = face(hq);
  vec3 fn = swell(fd, 0.03);
  vec3 sk = mix(SKIN, vec3(0.86, 0.5, 0.45), 0.35 * smoothstep(0.03, 0.0, length(hq - vec2(0.03, 0.025))));
  sk = mix(sk, vec3(0.62, 0.3, 0.3), fill(sdEllipse(hq - vec2(0.046, 0.052), vec2(0.008, 0.009)), 0.004) * 0.8);
  vec3 skin = shade(sk * (0.94 + 0.08 * grain(p * 160.0)), fn, p, 0.6);
  skin += CANDLE * 0.06 * flick * (1.0 - fn.z);
  vec2 ey = hq - vec2(0.004, 0.038);
  skin *= 1.0 - 0.3 * smoothstep(0.016, 0.0, length(ey * vec2(1.0, 1.6)));
  skin = mix(skin, vec3(0.12, 0.05, 0.03), stroke(sdEllipse(ey, vec2(0.012, 0.004)), 0.0011, px * 0.6) * step(ey.y, 0.0));
  c = mix(c, skin, fill(fd, px));
  float cap = max(fd - 0.003, hq.x + 0.014 - 0.45 * (hq.y - 0.02) + 0.008 * (noise(hq * 160.0) - 0.5));
  c = mix(c, shade(hc, normalize(swell(cap, 0.03) + vec3(0.0, (strand - 0.5) * 0.6, 0.0)), p, 0.5), fill(cap, px));

  // The coverlet: heavy brocade over the sleeper, falling in folds over the side of the bed, the
  // gold of its pattern and its hem; the sheet turned down across the chest.
  float top = mix(BEDTOP - 0.005, coverTop(p.x, now), smoothstep(-0.76, -0.68, p.x));
  float cover = max(p.y - top, max(-0.62 - p.y, max(-0.95 - p.x, p.x - 0.27)));
  float slope = (coverTop(p.x + 0.005, now) - coverTop(p.x - 0.005, now)) / 0.01;
  float v = clamp((p.y - BEDTOP + 0.05) / max(top - BEDTOP + 0.05, 0.01), 0.0, 1.0);
  float drop = smoothstep(BEDTOP - 0.02, BEDTOP - 0.07, p.y);
  float fold = sin(p.x * 26.0 + 7.0 * fbm(vec2(p.x * 2.5, p.y * 1.2))) * (0.6 + 0.4 * noise(vec2(p.x * 9.0, 0.0)));
  vec3 coverN = normalize(vec3(mix(0.15 * fold - slope * v, 0.7 * fold, drop), mix(v * 1.6 - 0.6, 0.0, drop), 1.0));
  float bro = damask(p * vec2(1.6, 1.8) + vec2(0.0, 0.3));
  vec3 cloth = mix(DAMASK * 1.3, GOLD * 0.75, 0.45 * bro) * (0.85 + 0.25 * grain(p * 90.0));
  vec3 coverlet = shade(cloth, coverN, p, mix(0.85, 0.35, bro));
  coverlet *= 1.0 - 0.4 * drop * smoothstep(-0.4, -0.62, p.y) * (0.6 + 0.4 * fold);
  float hemBand = smoothstep(-0.595, -0.6, p.y);
  coverlet = mix(coverlet, shade(GOLD * (0.7 + 0.3 * step(0.5, fract(p.x * 90.0 + p.y * 40.0))), coverN, p, 0.3), hemBand);
  float sheet = step(p.x, -0.56) * step(-0.72, p.x) * smoothstep(-0.05, -0.02, p.y - top) * (1.0 - drop);
  coverlet = mix(coverlet, shade(LINEN, normalize(vec3(0.0, 0.8, 0.6)), p, 0.8), sheet);
  coverlet = mix(coverlet, coverlet * 0.6, stroke(p.x + 0.56, 0.004, px) * (1.0 - drop) * step(top - 0.05, p.y));
  c = mix(c, coverlet, fill(cover, px));
  float fringe = step(-0.66 + 0.01 * hash(vec2(floor(p.x * 240.0), 2.0)), p.y) * step(p.y, -0.62) * step(-0.68, p.x) * step(p.x, 0.27);
  c = mix(c, shade(GOLD * (0.5 + 0.5 * step(0.45, fract(p.x * 240.0))), vec3(0.0, 0.2, 1.0), p, 0.4), fringe);

  // One arm out from under the sheet, fallen over the edge of the bed, the hand hanging open.
  vec2 sh = vec2(-0.665, BEDTOP + 0.0);
  vec2 el = vec2(-0.652, -0.46);
  vec2 wr = vec2(-0.615, -0.585);
  float arm = smin(cone(p, sh, el, 0.024, 0.017), cone(p, el, wr, 0.017, 0.012), 0.03);
  float hand = sdEllipse(rot(-0.3) * (p - vec2(-0.603, -0.625)), vec2(0.015, 0.036));
  hand = smin(hand, cone(p, vec2(-0.6, -0.64), vec2(-0.592, -0.68), 0.007, 0.004), 0.008);
  arm = smin(arm, hand, 0.012);
  vec3 an = swell(arm, 0.02);
  c = gloom(c, p, vec2(-0.6, -0.48), vec2(0.05, 0.12));
  c = mix(c, shade(SKIN * (0.94 + 0.08 * grain(p * 160.0)), an, p, 0.6) + CANDLE * 0.05 * flick * (1.0 - an.z), fill(arm, px));
  float sleeve = sdEllipse(p - sh - vec2(0.0, 0.012), vec2(0.05, 0.02)) + 0.005 * (noise(p * 120.0) - 0.5);
  c = mix(c, shade(LINEN, swell(sleeve, 0.02), p, 0.85), fill(sleeve, px));

  // The tube from the chest to the tambour, red rubber sagging between; the tambour on its
  // stand, its membrane lifting with each breath; the lever from it to the drum.
  vec2 chest = vec2(-0.42, coverTop(-0.42, now));
  vec2 m1 = vec2(-0.28, -0.1), m2 = vec2(0.04, -0.07), m3 = TAMBOUR - vec2(0.055, 0.0);
  float tube = min(min(sdSegment(p, chest, m1), sdSegment(p, m1, m2)), sdSegment(p, m2, m3));
  c = mix(c, shade(vec3(0.3, 0.1, 0.06), normalize(vec3(0.0, clamp(-tube / 0.006, -1.0, 1.0) * 0.0 + 0.6, 0.8)), p, 0.25) * (1.0 - 0.5 * smoothstep(0.0, 0.006, abs(tube))), fill(tube - 0.006, px));
  vec2 rq = p - vec2(TAMBOUR.x, -0.36);
  c = gloom(c, p, vec2(TAMBOUR.x, -0.74), vec2(0.08, 0.015));
  c = mix(c, shade(BRASS, rod(rq.x / 0.007, true), p, 0.2), fill(sdBox(rq, vec2(0.006, 0.37)), px));
  c = mix(c, shade(BRASS * 0.9, rod((p.y + 0.725) / 0.012, false), p, 0.25), fill(sdBox(p - vec2(TAMBOUR.x, -0.725), vec2(0.07, 0.008)) - 0.004, px));
  vec2 tq = p - TAMBOUR;
  float cup = sdBox(tq, vec2(0.05, 0.02)) - 0.008;
  c = mix(c, shade(BRASS, rod(tq.y / 0.028, false), p, 0.2), fill(cup, px));
  float membrane = sdEllipse(tq - vec2(0.0, 0.03 + 0.004 * now), vec2(0.048, 0.008));
  c = mix(c, shade(vec3(0.35, 0.12, 0.08), vec3(0.0, 0.8, 0.6), p, 0.5), fill(membrane, px));
  vec2 tip = vec2(DRUM.x, DRUM.y + 0.075 * now - CAP);
  vec2 piv = TAMBOUR + vec2(0.0, 0.04 + 0.004 * now);
  c = mix(c, shade(BRASS * 1.15, vec3(0.0, 0.6, 0.8), p, 0.15), stroke(sdSegment(p, piv, tip), 0.0028, px));
  c = mix(c, shade(BRASS, vec3(0.0, 0.0, 1.0), p, 0.2), fill(sdCircle(p - piv, 0.008), px));

  // The kymograph: the clockwork in its brass-bound case, the fly of its governor spinning, the
  // spindle, and the drum turning, smoked black, with the breath scratched white along it.
  // Behind the stylus, the trace is what was written a little while ago; on the far side it fades
  // into the soot of the turn before.
  vec2 kb = p - vec2(DRUM.x, -0.52);
  c = gloom(c, p, vec2(DRUM.x, -0.66), vec2(0.36, 0.04));
  float kcase = sdBox(kb, vec2(0.3, 0.12)) - 0.01;
  vec3 kN = normalize(vec3(boxGrad(kb, vec2(0.3, 0.12)) * (1.0 - smoothstep(0.0, 0.025, -kcase)), 1.0));
  c = mix(c, shade(WOOD * (0.8 + 0.3 * fbm(vec2(kb.x * 30.0, kb.y * 4.0))), kN, p, 0.35), fill(kcase, px));
  c = mix(c, shade(BRASS, kN, p, 0.2), stroke(kcase + 0.012, 0.004, px));
  vec2 dial = kb - vec2(-0.17, 0.0);
  c = mix(c, shade(vec3(0.82, 0.78, 0.66), vec3(0.0, 0.0, 1.0), p, 0.6), fill(sdCircle(dial, 0.05), px));
  c = mix(c, shade(BRASS, vec3(0.0, 0.0, 1.0), p, 0.2), stroke(sdCircle(dial, 0.05), 0.005, px));
  c = mix(c, vec3(0.05), stroke(sdSegment(dial, vec2(0.0), 0.038 * vec2(sin(t * 0.26), cos(t * 0.26))), 0.0018, px));
  vec2 gq = p - vec2(DRUM.x + 0.22, -0.36);
  float spin = sin(t * 11.0);
  float vane = sdBox(gq - vec2(0.0, 0.035), vec2(0.004 + 0.034 * abs(spin), 0.016));
  c = mix(c, shade(BRASS, vec3(0.0, 0.0, 1.0), p, 0.2), fill(sdBox(gq, vec2(0.003, 0.055)), px));
  c = mix(c, shade(BRASS * (0.7 + 0.5 * abs(spin)), normalize(vec3(spin * 0.6, 0.0, 1.0)), p, 0.2), fill(vane, px));
  vec2 sq = p - vec2(DRUM.x, 0.0);
  c = mix(c, shade(BRASS, rod(sq.x / 0.011, true), p, 0.2), fill(sdBox(sq, vec2(0.01, 0.4)), px));
  c = mix(c, shade(BRASS * 0.9, rod((p.y - 0.3) / 0.012, false), p, 0.2), fill(sdBox(p - vec2(DRUM.x, 0.3), vec2(0.022, 0.012)) - 0.003, px));
  vec2 dq = p - DRUM;
  float ex = clamp(dq.x / DRUM_R.x, -1.0, 1.0);
  float ell = CAP * sqrt(max(1.0 - ex * ex, 0.0));
  float drum = max(abs(dq.x) - DRUM_R.x, max(dq.y - DRUM_R.y + ell, -DRUM_R.y - ell - dq.y));
  float endTop = sdEllipse(dq - vec2(0.0, DRUM_R.y), vec2(DRUM_R.x, CAP));
  if (min(drum, endTop) < 0.02) {
    float th = asin(ex);
    vec3 cylN = vec3(ex, 0.0, sqrt(1.0 - ex * ex));
    float ago = mod(th, 6.2832) / 6.2832 * TURN;
    float s = th - t * 6.2832 / TURN;
    vec3 paper = SOOT * (0.7 + 0.6 * noise(vec2(s * 14.0, dq.y * 220.0)));
    paper = shade(paper * 5.0, cylN, p, 0.4) + SOOT * 0.3;
    paper += vec3(0.1, 0.11, 0.14) * pow(max(cylN.x * 0.6 + cylN.z * 0.8, 0.0), 30.0) * 0.6;
    float ay = DRUM.y + 0.075 * breath(t - ago, pressedAgo(ago)) - ell;
    float scratch = stroke(p.y - ay, 0.0028, px * 1.5) * smoothstep(TURN, TURN * 0.6, ago);
    for (int r = 1; r < 4; r++) {
      float fr = float(r);
      float old = DRUM.y - 0.12 * fr + 0.06 * breath(s * 3.8 + fr * 7.0, 0.0) - ell;
      scratch = max(scratch, stroke(p.y - old, 0.0022, px * 1.5) * (0.55 - 0.12 * fr));
    }
    paper = mix(paper, TRACE * (0.4 + 0.6 * cylN.z), scratch);
    c = mix(c, paper, fill(drum, px));
    float rimT = max(stroke(dq.y - DRUM_R.y + ell, 0.007, px), stroke(dq.y + DRUM_R.y + ell, 0.007, px)) * step(abs(ex), 0.999) * step(abs(dq.x), DRUM_R.x);
    c = mix(c, shade(BRASS, normalize(cylN + vec3(0.0, 0.3, 0.0)), p, 0.15), rimT);
    vec3 plate = shade(BRASS * (0.75 + 0.2 * noise(dq * 60.0)), vec3(0.0, 0.85, 0.5), p, 0.25);
    plate = mix(plate, plate * 0.5, stroke(sdEllipse(dq - vec2(0.0, DRUM_R.y), vec2(DRUM_R.x * 0.7, CAP * 0.7)), 0.003, px));
    plate = mix(plate, shade(BRASS, vec3(0.0, 0.6, 0.8), p, 0.15), fill(sdEllipse(dq - vec2(0.0, DRUM_R.y), vec2(0.018, 0.006)), px));
    c = mix(c, plate, fill(endTop, px) * step(DRUM_R.y - ell - 0.002, dq.y));
    c = mix(c, shade(BRASS, rod(dq.x / 0.011, true), p, 0.2), fill(sdBox(dq - vec2(0.0, DRUM_R.y + 0.05), vec2(0.01, 0.05)), px));
  }
  c = mix(c, TRACE, fill(length(p - tip) - 0.005, px));

  // The flame, guttering, and its warmth on the air; its thread of smoke going up.
  vec2 fl = p - FLAME;
  fl.x -= 0.006 * sin(t * 6.0 + fl.y * 40.0) * clamp((fl.y + 0.03) / 0.06, 0.0, 1.0);
  c += CANDLE * flick * (0.16 * exp(-length(fl) * 5.0) + 0.3 * exp(-length(fl) * 24.0));
  float taper = 1.0 + 2.2 * clamp(fl.y / 0.04, 0.0, 1.0);
  c = mix(c, vec3(1.0, 0.64, 0.26), 0.92 * fill(length(vec2(fl.x * taper, fl.y * 0.45)) - 0.017 * flick, px * 1.5));
  c = mix(c, vec3(1.0, 0.95, 0.82), fill(length(vec2(fl.x * taper, (fl.y + 0.01) * 0.6)) - 0.007, px * 2.0));
  c = mix(c, vec3(0.04), stroke(sdSegment(p, FLAME - vec2(0.0, 0.035), FLAME - vec2(0.0, 0.012)), 0.002, px));
  vec2 sm = p - FLAME - vec2(0.0, 0.07);
  float sway = (0.015 * sin(sm.y * 12.0 - t * 1.4) + 0.05 * (noise(vec2(sm.y * 3.0 - t * 0.35, 1.0)) - 0.5)) * smoothstep(0.0, 0.3, sm.y);
  float wisp = exp(-abs(sm.x - sway) / (0.003 + 0.03 * max(sm.y, 0.0))) * smoothstep(0.0, 0.04, sm.y) * smoothstep(0.6, 0.1, sm.y);
  c += vec3(0.3, 0.26, 0.22) * wisp * 0.22 * flick;

  c *= 1.0 - 0.18 * dot(p * 0.5, p * 0.5);

  // The dark closing in from the edges of the case, deeper in the reader's deep night.
  float close = come * (0.75 + 0.25 * u_env.y);
  vec2 e = p / vec2(1.33, 1.0);
  float edge = smoothstep(1.25 - 0.85 * close, 0.35 - 0.3 * close, length(e));
  c *= mix(1.0, edge, min(1.0, close * 1.2));

  if (lensIn(p) > 0.0) {
    float weight = exp(-length((p - chest - vec2(0.0, 0.07)) * vec2(1.4, 1.0)) * 5.0);
    float metal = fill(drum, px) * 0.5 + fill(sdBox(p - vec2(DRUM.x, -0.52), vec2(0.3, 0.12)), px) * 0.6;
    c = fluoroscope(c, p, 1.0 - metal - (0.55 + 0.35 * u_a.w) * weight);
  }
  return c;
}
`,start({stage:n,root:r,env:i}){let a=performance.now(),o=()=>a=performance.now(),s=[`pointermove`,`pointerdown`,`keydown`,`wheel`,`touchstart`,`scroll`];for(let e of s)addEventListener(e,o,{passive:!0});let c=!1,l=!1,u=0,d=0;return r.dataset.state=`sleeping`,{frame(o,s,f){let p=Math.min(f.idle,(performance.now()-a)/1e3)>=t;p!==c&&([l,c,u]=[c,p,o],r.dataset.state=c?`pressed`:`sleeping`),d=e(d,+!!c,c?.6:5,s),n.set(`a`,[d,o-u,+!!l,+!!c]),n.set(`env`,[i.level,+!!i.on,0,0])},level:()=>d,pause(){o()},dispose(){for(let e of s)removeEventListener(e,o)}}},plates:[{name:`sleeping`,caption:{almanac:`The sleeper breathing, and the trace long and even on the drum.`,cipher:`Plate I: normal respiration.`}},{name:`pressed`,caption:{almanac:`The weight come, the trace gone flat, and the dark closing in.`,cipher:`Plate II: respiration suppressed; vignette closed.`},a:[1,7,0,1]}]};export{n as scene};