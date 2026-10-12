import{s as e}from"./input.CdXIQc7H.js";import{t}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var n=`
const vec2 O = vec2(0.12, 0.0);
const float TS = 1.15;
const float HS = 1.3;
const vec2 VP = vec2(0.0, 0.12);
const vec2 SCONCE = vec2(-0.86, 0.3);
const float BACK = -0.35;
const vec3 FLAME = vec3(1.0, 0.7, 0.4);
const vec3 COLD = vec3(0.11, 0.14, 0.22);
float att;

float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
float bump(vec2 p, vec2 at, float r) { vec2 d = p - at; return exp(-dot(d, d) / (r * r)); }
vec3 swell(float d, float depth) {
  vec2 g = normalize(vec2(dFdx(d), dFdy(d)) + 1e-6);
  float r = clamp(-d / depth, 0.0, 1.0);
  return normalize(vec3(g * (1.0 - r), 0.3 + r));
}
// The thermopile's colours: black for the cold, through blood red and ember to white.
vec3 thermal(float t) {
  vec3 c = mix(vec3(0.0), vec3(0.30, 0.03, 0.07), smoothstep(0.0, 0.25, t));
  c = mix(c, vec3(0.76, 0.07, 0.12), smoothstep(0.2, 0.45, t));
  c = mix(c, vec3(1.0, 0.48, 0.10), smoothstep(0.42, 0.7, t));
  return mix(c, vec3(1.0, 0.96, 0.88), smoothstep(0.68, 0.95, t));
}

// The candle at the left, warm and failing with distance; the cold of the crypt from the right,
// and its rim on the edges of things.
vec3 shade(vec3 alb, vec3 N, vec2 p, float rough) {
  vec2 d = SCONCE - p;
  vec3 L = normalize(vec3(d, 0.55));
  float a = att / (1.0 + dot(d, d));
  float diff = max((dot(N, L) + 0.2 * rough) / (1.0 + 0.2 * rough), 0.0);
  float sp = pow(max(dot(N, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), mix(50.0, 8.0, rough)) * (1.0 - rough);
  float cold = max(dot(N, vec3(0.74, 0.25, 0.62)), 0.0);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.5) * max(dot(normalize(N.xy + 1e-4), vec2(0.95, 0.3)), 0.0);
  return alb * (vec3(0.012, 0.012, 0.018) + COLD * cold + FLAME * diff * a * 2.4) + FLAME * sp * a * 0.8 + vec3(0.09, 0.11, 0.18) * rim;
}

// A box seen toward the vanishing point: which face p is on (1 front, 2 top, 3 side, 0 none),
// and where on that face, 0 to 1 across and up.
vec3 slab(vec2 p, vec2 x, vec2 y, float s) {
  if (p.x > x.x && p.x < x.y && p.y > y.x && p.y < y.y) return vec3(1.0, (p - vec2(x.x, y.x)) / vec2(x.y - x.x, y.y - y.x));
  float k = (p.y - VP.y) / (y.y - VP.y);
  float l = VP.x + (x.x - VP.x) * k, r = VP.x + (x.y - VP.x) * k;
  if (k < 1.0 && k > s && p.x > l && p.x < r) return vec3(2.0, (p.x - l) / (r - l), (1.0 - k) / (1.0 - s));
  float j = (p.x - VP.x) / (x.y - VP.x);
  float b = VP.y + (y.x - VP.y) * j, tp = VP.y + (y.y - VP.y) * j;
  if (j < 1.0 && j > s && p.y > b && p.y < tp) return vec3(3.0, (1.0 - j) / (1.0 - s), (p.y - b) / (tp - b));
  return vec3(0.0);
}

vec2 headAt() { return vec2(u_a.y * 0.025, 0.515 + u_a.z * 0.015); }
// The head: a long skull, the cheekbones high, the jaw narrowing to a pointed chin; the ears.
float head(vec2 h) {
  float d = sdEllipse(h - vec2(0.0, 0.02), vec2(0.06, 0.068));
  d = smin(d, sdEllipse(h - vec2(0.0, -0.004), vec2(0.06, 0.024)), 0.015);
  d = smin(d, cone(h, vec2(0.0, -0.012), vec2(0.0, -0.078), 0.046, 0.014), 0.02);
  d = smin(d, sdBox(h - vec2(0.0, -0.1), vec2(0.016, 0.03)), 0.008);
  vec2 e = vec2(abs(h.x) - 0.062, h.y - 0.006);
  return min(d, max(sdEllipse(rot(0.35) * e, vec2(0.009, 0.026)), -e.x - 0.006));
}
// The cloak: falling from the shoulders to the floor and spreading as it falls, in long folds.
float cloak(vec2 q, out float ph) {
  float h = clamp((q.y + 0.72) / 1.08, 0.0, 1.0);
  float w = mix(0.38, 0.215, pow(h, 0.7));
  float u = q.x / w;
  ph = u * 7.5 + 0.9 * noise(vec2(u * 2.5, q.y * 1.2)) + 0.4 * sin(q.y * 3.0 + u);
  float d = max(abs(q.x) - w - 0.012 * sin(ph) * (1.0 - h), -0.72 - 0.012 * sin(ph) - q.y);
  return max(d, q.y - 0.4 + 2.2 * q.x * q.x);
}
// The long hands, pressed palm to palm before the breast.
float hands(vec2 a) {
  float d = cone(a, vec2(0.036, 0.075), vec2(0.005, 0.2), 0.021, 0.0045);
  d = smin(d, sdEllipse(rot(-0.3) * (a - vec2(0.04, 0.065)), vec2(0.022, 0.03)), 0.015);
  return smin(d, cone(a, vec2(0.04, 0.03), vec2(0.04, 0.065), 0.017, 0.02), 0.012);
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float heat = u_a.x, drain = u_a.w, beat = u_b.x, waking = u_b.y;
  att = (0.94 + 0.04 * sin(t * 8.1) * sin(t * 2.7)) * (1.0 - 0.6 * drain);

  // The crypt wall: dressed blocks of a cold grey stone in uneven courses, worn and damp-stained.
  vec2 pw = p + plateDrift(0.3);
  vec2 bv = pw * vec2(2.4, 5.4);
  float brow = floor(bv.y);
  bv.x = bv.x * (0.75 + 0.5 * hash(vec2(brow, 2.0))) + hash(vec2(brow, 5.0));
  vec2 bid = floor(bv), bf = fract(bv) - 0.5 + (vec2(noise(pw * 22.0), noise(pw * 22.0 + 4.0)) - 0.5) * 0.06;
  float joint = max(smoothstep(0.45, 0.495, abs(bf.x)), smoothstep(0.42, 0.49, abs(bf.y)));
  float gr = grain(pw * 30.0);
  vec2 bev = -sign(bf) * vec2(smoothstep(0.36, 0.47, abs(bf.x)) * 0.5, smoothstep(0.3, 0.46, abs(bf.y)));
  vec3 wn = normalize(vec3(bev * 0.6 + (vec2(gr, noise(pw * 30.0 + 2.0)) - 0.5) * 0.5, 1.0));
  vec3 stone = vec3(0.25, 0.245, 0.24) * (0.7 + 0.4 * hash(bid)) * (0.8 + 0.35 * gr);
  stone *= 1.0 - 0.4 * smoothstep(0.45, 0.7, fbm(pw * vec2(2.0, 0.8) + 4.0));
  stone = mix(stone, vec3(0.05, 0.045, 0.045), joint * 0.7);
  vec3 c = shade(stone, wn, p, 0.88);

  // The niche behind the figure: a round vault turned in voussoirs with its keystone, the jambs
  // in long and short blocks, and its hollow going back into the dark.
  vec2 nq = p - vec2(O.x, 0.2);
  bool arch = nq.y > 0.0;
  float ring = arch ? length(nq) - 0.5 : abs(nq.x) - 0.5;
  if (ring < 0.1 && p.y > BACK) {
    float back = smoothstep(0.0, -0.02, (arch ? length(nq) : abs(nq.x)) - 0.43);
    vec3 hollow = (vec3(0.03, 0.03, 0.04) * (0.7 + 0.4 * gr) + COLD * 0.15 * smoothstep(0.0, 0.4, nq.x)) * (0.7 + 0.5 * smoothstep(-0.2, 0.5, p.y));
    vec3 reveal = shade(stone * 0.8, normalize(vec3(-sign(nq.x) * 0.8 - (arch ? nq.x : 0.0), -max(nq.y, 0.0) * 1.5, 0.5)), p, 0.9);
    c = mix(c, reveal * 0.7, (1.0 - back) * fill(ring, px));
    c = mix(c, hollow, back);
    float vs = arch ? atan(nq.y, nq.x) / PI * 15.0 : -nq.y * 9.0 + 100.0 * step(0.0, nq.x);
    float vi = floor(vs + 0.5);
    float outer = arch ? 0.075 + 0.02 * step(abs(vs - 7.5), 0.5) : 0.06 + 0.03 * mod(vi, 2.0);
    float vd = min(min(ring, outer - ring), abs(fract(vs) - 0.5) * (arch ? PI * (0.5 + ring) / 15.0 : 0.111));
    vec2 rd = arch ? normalize(nq) : vec2(sign(nq.x), 0.0);
    vec3 vn = normalize(vec3(rd * (smoothstep(0.012, 0.0, ring) - smoothstep(outer - 0.012, outer, ring)) * 0.8, 1.0));
    vec3 vstone = shade(vec3(0.38, 0.36, 0.33) * (0.8 + 0.3 * hash(vec2(vi, 3.0))) * (0.85 + 0.25 * gr), vn, p, 0.8);
    c = mix(c, mix(vstone, vec3(0.04), smoothstep(0.006, 0.002, vd)), step(0.0, ring) * step(ring, outer));
  }

  // The floor: old flags, dark in the joints.
  if (p.y < BACK) {
    float dep = VP.y - p.y;
    vec2 uv = vec2((p.x + plateDrift(0.5).x) / dep, 1.0 / dep) * 1.2;
    vec2 fv = vec2(uv.x * 1.2 + hash(vec2(floor(uv.y * 2.4), 1.0)), uv.y * 2.4);
    vec2 ff = fract(fv) - 0.5 + (noise(uv * 10.0) - 0.5) * 0.05;
    float fn = noise(rot(0.5) * uv * vec2(8.0, 18.0));
    vec3 flag = vec3(0.24, 0.23, 0.22) * (0.65 + 0.45 * hash(floor(fv))) * (0.75 + 0.4 * fn);
    flag = mix(flag, vec3(0.04), 0.8 * max(smoothstep(0.44, 0.495, abs(ff.x)), smoothstep(0.41, 0.49, abs(ff.y))));
    vec3 fc = shade(flag, normalize(vec3((fn - 0.5) * 0.3, 0.85, 0.5)), p, 0.75) * (1.0 - 0.5 * exp(-(BACK - p.y) * 20.0));
    c = mix(c, fc, fill(p.y - BACK, px));
  }

  // The figure's shadow thrown on the wall and lying on the floor.
  vec2 sw = (SCONCE + (p - SCONCE) / 1.25 - O) / TS;
  c *= 1.0 - 0.45 * smoothstep(0.06, -0.08, min(sdEllipse(sw - vec2(0.0, -0.2), vec2(0.28, 0.55)), sdCircle(sw - vec2(0.0, 0.46), 0.07))) * step(BACK, p.y);
  c = gloom(c, p, O + vec2(0.18, -0.71) * TS, vec2(0.5, 0.06) * TS);
  c = gloom(c, p, O + vec2(0.0, -0.73) * TS, vec2(0.38, 0.03) * TS);

  // The sarcophagus, an arcade carved along its front, its coped lid pushed half off.
  if (p.x < -0.3 && p.y < -0.4) {
    vec3 sc = vec3(0.3, 0.29, 0.27) * (0.72 + 0.35 * grain(p * 42.0)) * (0.8 + 0.35 * noise(p * 7.0));
    vec3 f = slab(p, vec2(-1.36, -0.5), vec2(-1.02, -0.73), 0.84);
    if (f.x > 0.5) {
      vec3 sn = f.x < 1.5 ? vec3(0.0, 0.0, 1.0) : f.x < 2.5 ? vec3(0.0, 0.9, 0.4) : vec3(0.8, 0.0, 0.6);
      float edge = f.x < 1.5 ? min(min(f.y, 1.0 - f.y) * 0.86, min(f.z, 1.0 - f.z) * 0.29) : 1.0;
      if (f.x < 1.5) {
        float ly = f.z * 0.29, lx = (fract(f.y * 5.0) - 0.5) * 0.172;
        float ar = max(ly > 0.15 ? length(vec2(lx, ly - 0.15)) - 0.058 : abs(lx) - 0.058, 0.05 - ly);
        float band = max(smoothstep(0.235, 0.245, ly), smoothstep(0.045, 0.035, ly));
        vec2 ag = normalize(vec2(dFdx(ar), dFdy(ar)) + 1e-6);
        sn = normalize(sn + vec3(-ag * smoothstep(0.012, 0.0, abs(ar)) * step(ar, 0.0) * 0.9, 0.0) + vec3(0.0, sign(ly - 0.15) * 0.5 * band, 0.0));
        sc *= (1.0 - 0.45 * step(ar, -0.008) * smoothstep(0.0, 0.1, 0.06 - ar)) * (0.75 + 0.25 * smoothstep(0.0, 0.25, ly));
      }
      vec3 sarc = shade(sc, sn, p, 0.85);
      if (f.x > 1.5 && f.x < 2.5) sarc = mix(sarc, vec3(0.008, 0.007, 0.01), smoothstep(0.12, 0.22, min(min(f.y, 1.0 - f.y) * 7.0, min(f.z, 1.0 - f.z) * 3.0)));
      c = sarc * (0.55 + 0.45 * smoothstep(0.0, 0.008, edge));
    }
    vec3 lid = slab(p, vec2(-1.5, -0.7), vec2(-0.74, -0.68), 0.84);
    if (lid.x > 0.5) {
      vec3 ln = lid.x < 1.5 ? vec3(0.0, -0.3, 0.95) : lid.x < 2.5 ? (lid.z < 0.5 ? vec3(0.0, 0.55, 0.83) : vec3(0.0, 0.98, -0.1)) : vec3(0.8, 0.2, 0.55);
      vec3 lcol = shade(sc * 1.1, ln, p, 0.8);
      c = lcol * (0.6 + 0.4 * smoothstep(0.0, 0.08, min(lid.y, 1.0 - lid.y)));
    }
  }

  // The figure before the niche: the high collar standing behind the head, the cloak, the gaunt
  // face, the long hands.
  vec2 q = (p - O) / TS;
  vec2 qa = vec2(abs(q.x), q.y);
  float qx = px / TS;
  vec2 hp = headAt();
  vec2 h = (q - hp) / HS;
  float fph = 0.0;
  float cl = 1.0, hd = 1.0, hn = 1.0, col = 1.0;
  if (qa.x < 0.42 && q.y > -0.76 && q.y < 0.72) {
    cl = cloak(q, fph);
    hd = head(h) * HS;
    hn = hands(qa);
    col = max(max(qa.x - 0.075 - 0.55 * (q.y - 0.33), q.y - 0.44 - 0.55 * qa.x), 0.33 - q.y);
  }
  vec3 hN = swell(hd, 0.065), handN = swell(hn, 0.012), cN = swell(cl, 0.06);
  float onFig = min(min(cl, col), min(hd, hn));
  vec3 fig = c;
  float hot = 0.0;
  if (onFig < 0.02) {
    // The collar, stiffened in ribs, lined with crimson.
    vec3 colN = normalize(vec3(-sign(q.x) * 0.5, 0.2, 0.85));
    float rib = 0.75 + 0.25 * smoothstep(-0.5, 1.0, sin(atan(q.y - 0.3, qa.x) * 22.0));
    vec3 lining = vec3(0.32, 0.03, 0.05) * (0.7 + 0.4 * noise(vec2(q.x * 60.0, q.y * 8.0))) * rib;
    fig = mix(fig, shade(lining, colN, p, 0.5) * (0.35 + 0.75 * clamp((q.y - 0.33) / 0.2, 0.0, 1.0) * smoothstep(0.05, 0.16, qa.x)), fill(col, qx));
    // The cloak, parted down the front on the black beneath, its edges turned back on the lining.
    vec3 fN = normalize(cN + vec3(sin(fph) * 1.3 * smoothstep(0.4, 0.15, q.y), 0.0, 0.0));
    float nap = noise(vec2(fph * 2.0, q.y * 40.0));
    vec3 wool = vec3(0.09, 0.08, 0.095) * (0.8 + 0.4 * nap) * (0.25 + 0.95 * smoothstep(-0.8, 0.9, cos(fph)));
    float edge = abs(q.x + 0.008 * sin(q.y * 9.0)) - 0.012 - 0.07 * smoothstep(0.2, -0.72, q.y);
    float turn = 0.004 + 0.026 * smoothstep(0.25, -0.72, q.y);
    vec3 cc = shade(wool, fN, p, 0.5);
    vec3 crimson = vec3(0.34, 0.03, 0.055) * (0.75 + 0.35 * nap) * (0.6 + 0.5 * smoothstep(0.0, turn, edge));
    cc = mix(cc, shade(crimson, normalize(vec3(-sign(q.x) * 0.5, 0.0, 0.85)), p, 0.4), step(edge, turn) * step(q.y, 0.33));
    cc = mix(cc, shade(vec3(0.02), vec3(0.0, 0.0, 1.0), p, 0.5) * (0.6 + 0.4 * smoothstep(0.0, 0.03, -edge)), smoothstep(0.002, -0.002, edge) * step(q.y, 0.33));
    fig = mix(fig, cc * (0.55 + 0.45 * smoothstep(-0.75, -0.2, q.y)), fill(cl, qx));
    // The face: pale, sunk at the temples and under the cheekbones, the sockets deep, the nose long,
    // the mouth a hard line over the long teeth, the hair swept back. It turns toward the warmth.
    vec2 fq = h - vec2(u_a.y * 0.01, u_a.z * 0.006);
    vec2 fa = vec2(abs(fq.x), fq.y);
    vec2 ey = fa - vec2(0.024, 0.008);
    float socket = bump(ey * vec2(1.0, 1.45), vec2(0.0), 0.016);
    float hollow = bump((fa - vec2(0.034, -0.04)) * vec2(1.0, 0.73), vec2(0.0), 0.016);
    float mouth = exp(-pow((fq.y + 0.052 + 0.8 * fq.x * fq.x) / 0.003, 2.0)) * smoothstep(0.02, 0.012, fa.x);
    float r0 = 1.1 * exp(-pow((fq.y - 0.024) / 0.01, 2.0)) * smoothstep(0.055, 0.03, fa.x) - 1.4 * socket - 1.3 * hollow - 0.9 * mouth;
    r0 += 1.2 * exp(-pow(fq.x / 0.006, 2.0)) * smoothstep(0.022, 0.0, abs(fq.y + 0.008) - 0.012) * step(fq.y, 0.02);
    r0 += 0.9 * bump((fa - vec2(0.04, -0.006)) * vec2(1.0, 1.8), vec2(0.0), 0.016) - 0.6 * bump(fa, vec2(0.052, 0.03), 0.014) + 0.6 * bump(fq * vec2(1.0, 1.5), vec2(0.0, -0.12), 0.012);
    vec2 sk = h / vec2(0.068, 0.095);
    vec3 skN = normalize(vec3(sk * 0.85, sqrt(1.0 - min(dot(sk, sk), 1.0)) + 0.25));
    vec3 N = normalize(mix(skN, hN, smoothstep(-0.012, 0.0, hd) * 0.6) - vec3(vec2(dFdx(r0), dFdy(r0)) / (qx * HS) * 0.005, 0.0));
    vec3 skin = vec3(0.74, 0.7, 0.68) * (0.92 + 0.12 * noise(h * 90.0));
    skin = mix(skin, vec3(0.6, 0.5, 0.55), 0.4 * hollow + 0.6 * socket);
    float flush = (0.15 + 0.85 * heat) * (0.45 + 0.55 * waking);
    skin = mix(skin, vec3(0.8, 0.42, 0.4), flush * 0.35 * bump(fq, vec2(0.0, -0.02), 0.05));
    vec3 face = shade(skin, N, p, 0.55) * (1.0 - 0.6 * socket) * (1.0 - 0.7 * smoothstep(-0.076, -0.092, fq.y + 0.4 * fa.x));
    face = mix(face, face * 0.5 + vec3(0.12, 0.0, 0.02), mouth * 0.7);
    float hair = clamp(step(0.028 + 0.75 * fa.x - 16.0 * fq.x * fq.x, fq.y) + step(0.05, fa.x), 0.0, 1.0) * smoothstep(0.064, 0.056, fa.x) * step(0.015, fq.y);
    float strand = noise(vec2(fq.x * 260.0 + fq.y * 60.0, fq.y * 30.0));
    vec3 hairC = shade(vec3(0.03, 0.027, 0.03) * (0.5 + 0.9 * strand), normalize(skN + vec3(0.0, 0.25, 0.0)), p, 0.25);
    hairC += vec3(0.1, 0.09, 0.1) * smoothstep(0.6, 0.95, 0.6 * (skN.y - skN.x) + 0.4) * (0.5 + 0.5 * strand);
    face = mix(face, hairC, hair);
    vec2 fg = fa - vec2(0.009, -0.056);
    float fang = max(abs(fg.x) - 0.0028 * clamp(1.0 - fg.y / 0.012, 0.0, 1.0), max(fg.y, -0.012 - fg.y));
    face = mix(face, shade(vec3(0.85, 0.82, 0.74), vec3(0.0, 0.0, 1.0), p, 0.3), fill(fang, qx * 0.4));
    face = mix(face, mix(vec3(0.05, 0.02, 0.02), vec3(0.9, 0.12, 0.08), max(waking * 0.7, heat)), fill(sdEllipse(ey - vec2(0.002, -0.002), vec2(0.005, 0.0025)), qx * 0.4));
    fig = mix(fig, face, fill(hd, qx));
    // The black stock wound high about the throat, and the clasp of the cloak beneath it.
    fig = mix(fig, shade(vec3(0.03), normalize(vec3(clamp(q.x / 0.05, -1.0, 1.0) * 0.7, 0.0, 0.7)), p, 0.4), fill(sdBox(q - vec2(0.0, 0.365), vec2(0.026, 0.02)) - 0.008, qx));
    vec2 cq = (q - vec2(0.0, 0.32)) / 0.013;
    fig = mix(fig, shade(vec3(0.5, 0.38, 0.18), normalize(vec3(cq, sqrt(max(1.0 - dot(cq, cq), 0.0)))), p, 0.2), fill(length(cq) - 1.0, qx / 0.013));
    // The hands, long and white, the fingers lying close; lace at the wrists; the black sleeves.
    float sl = cone(qa, vec2(0.04, 0.015), vec2(0.11, -0.08), 0.03, 0.04);
    fig = mix(fig, shade(vec3(0.03), swell(sl, 0.03), p, 0.5), fill(sl, qx));
    vec2 ha = qa - vec2(0.036, 0.075);
    float hu = dot(ha, vec2(0.97, 0.24)) / mix(0.021, 0.0045, clamp(dot(ha, vec2(-0.24, 0.97)) / 0.129, 0.0, 1.0));
    vec3 hs = vec3(0.78, 0.74, 0.72) * (0.92 + 0.1 * noise(q * 150.0));
    hs *= 1.0 - 0.3 * smoothstep(0.14, 0.0, abs(fract(hu * 1.6 + 0.5) - 0.5)) * step(0.095, q.y) * step(abs(hu), 0.9);
    hs *= 1.0 - 0.25 * smoothstep(0.015, 0.0, abs(q.y - 0.065)) * step(qa.x, 0.05);
    fig = gloom(fig, p, O + vec2(0.01, 0.1) * TS, vec2(0.06, 0.1) * TS);
    fig = mix(fig, shade(hs, normalize(vec3(sign(q.x) * 0.45 + handN.x * 0.6, handN.y * 0.6 + 0.1, 0.8)), p, 0.5), fill(hn, qx));
    vec2 lq = qa - vec2(0.04, 0.03);
    float lace = sdEllipse(rot(0.5) * lq, vec2(0.026, 0.012)) - 0.0025 * sin(atan(lq.y, lq.x) * 6.0);
    fig = mix(fig, shade(vec3(0.7, 0.68, 0.64) * (0.8 + 0.3 * noise(q * 300.0)), swell(lace, 0.01), p, 0.8), fill(lace, qx));
    // Its heat: the face flushing, the veins flaring, the heart under the hands.
    float vein = smoothstep(0.06, 0.015, abs(noise(vec2(q.x * 30.0, q.y * 9.0) + 0.6 * noise(q * 40.0)) - 0.5)) * smoothstep(0.35, 0.6, noise(q * 14.0 + 3.0));
    hot = flush * bump(h, vec2(0.0, -0.01), 0.07) * fill(hd, 0.01) * 0.75;
    hot += heat * (0.5 * vein * max(fill(hd, 0.004), fill(hn, 0.004)) + 0.35 * fill(hn, 0.006));
    hot += bump(q, vec2(-0.04, 0.15), 0.08) * (0.12 + 0.7 * heat) * (0.4 + 0.6 * beat) * fill(min(cl, hn), 0.02);
  }
  c = mix(c, fig, fill(onFig, qx));

  // The candle in its iron sconce, the wax run down it, the flame and its light on the air.
  vec2 sq = p - SCONCE;
  c = mix(c, shade(vec3(0.06, 0.055, 0.05), vec3(0.0, 0.3, 0.95), p, 0.4), fill(min(sdBox(sq + vec2(0.0, 0.14), vec2(0.05, 0.01)), sdBox(sq + vec2(0.0, 0.2), vec2(0.008, 0.06))), px));
  float wax = min(sdBox(sq + vec2(0.0, 0.085), vec2(0.018, 0.045)), sdEllipse(sq + vec2(-0.016, 0.08), vec2(0.006, 0.03)));
  c = mix(c, shade(vec3(0.85, 0.8, 0.68), normalize(vec3(clamp(sq.x / 0.02, -1.0, 1.0), 0.0, 0.6)), p, 0.6) + FLAME * 0.3 * att, fill(wax, px));
  vec2 fl = sq + vec2(0.0, 0.015);
  float rise = clamp(fl.y / 0.03, 0.0, 1.0);
  fl.x -= 0.004 * sin(t * 6.0 + fl.y * 50.0) * rise;
  c += FLAME * att * (0.18 * exp(-length(fl) * 4.0) + 0.35 * exp(-length(fl) * 22.0));
  c = mix(c, vec3(1.0, 0.7, 0.32), fill(length(vec2(fl.x * (1.0 + 2.0 * rise), fl.y * 0.45)) - 0.014 * att, px));
  c = mix(c, vec3(1.0, 0.95, 0.85), fill(length(vec2(fl.x * 2.0, (fl.y + 0.006) * 0.6)) - 0.006, px));

  // Cold light falling from a grating high at the right, and its bars laid on the flags.
  vec2 sd = p - vec2(1.05, 1.05);
  float along = dot(sd, vec2(-0.387, -0.922)), across = dot(sd, vec2(0.922, -0.387));
  float shaft = smoothstep(0.16 + 0.12 * along, 0.0, abs(across)) * smoothstep(0.0, 0.3, along) * smoothstep(2.1, 1.2, along);
  vec2 gp = (p - vec2(0.72, -0.68)) / vec2(0.3, 0.07);
  shaft = shaft * (0.35 + 0.4 * noise(vec2(across * 20.0, along * 3.0 - t * 0.1))) + 0.6 * smoothstep(1.0, 0.6, length(gp)) * smoothstep(0.3, 0.45, abs(fract(gp.x * 2.5 + gp.y * 0.6) - 0.5));
  c += vec3(0.16, 0.2, 0.3) * shaft * (1.0 - 0.5 * drain);
  // The mist lying on the floor, cold, moving slowly.
  float mist = fbm(vec2(p.x * 2.0 + t * 0.03, p.y * 6.0 - t * 0.01));
  c = mix(c, vec3(0.2, 0.22, 0.28) * (0.6 + 0.6 * mist) + FLAME * 0.05 * exp(-length(sq) * 1.5), smoothstep(-0.45, -0.8, p.y + 0.1 * mist) * 0.55 * (0.6 + 0.5 * mist));

  // The warmth of the reader's hand, white-hot where it is; and the warmth it draws, in slow
  // currents toward its mouth, the room going dark round it.
  hot += u_ptr.z * bump(p, u_ptr.xy, 0.14);
  vec2 dh = p - O - (hp + vec2(0.0, -0.06)) * TS;
  float spoke = noise(normalize(dh + 1e-4) * 2.2 + vec2(length(dh) * 6.0 + t * 0.35, 0.0));
  hot += drain * 0.35 * smoothstep(0.55, 0.85, spoke) * smoothstep(1.1, 0.15, length(dh));
  c *= 1.0 - 0.45 * drain * (1.0 - fill(onFig, qx));
  c = 1.0 - (1.0 - c) * (1.0 - thermal(clamp(hot, 0.0, 1.0)) * 0.9);
  c *= 1.0 - 0.22 * dot(p * 0.55, p * 0.55);

  if (lensIn(p) > 0.0) {
    // What the rays find: ribs and spine, the skull with its long teeth, the heart dense with blood.
    float passes = mix(0.86, 0.55, fill(min(cl, hd), 0.004));
    float spine = stroke(q.x, 0.012, 0.004) * step(-0.25, q.y) * step(q.y, 0.38);
    float ribs = stroke(fract((q.y + 0.02) * 22.0) - 0.5, 0.12, 0.08) * step(qa.x, 0.123 + 0.09 * q.y) * step(-0.04, q.y) * step(q.y, 0.3);
    float skull = fill(sdEllipse(h - vec2(0.0, 0.01), vec2(0.05, 0.068)), 0.004);
    passes = mix(passes, 0.24, max(max(spine, ribs * 0.8), skull));
    passes = mix(passes, 0.7, fill(sdEllipse(vec2(abs(h.x) - 0.022 - u_a.y * 0.004, h.y - 0.01), vec2(0.013, 0.011)), 0.003));
    passes = mix(passes, 0.04, fill(sdEllipse(vec2(abs(h.x) - 0.011, h.y + 0.05), vec2(0.0035, 0.017)), 0.002));
    c = fluoroscope(c, p, mix(passes, 0.3, fill(sdEllipse(q - vec2(-0.04, 0.15), vec2(0.045, 0.055)), 0.004)));
  }
  return c;
}
`,r=(e,t,n)=>Math.min(n,Math.max(t,e)),i={waking:2.4},a={rest:.7,roused:2.2},o={source:n,start({stage:n,root:o,env:s}){let c=s.on,l=o.closest(`.instrument`),u=0,d=0,f=0,p=0,m=0,h=[],g=(e,t,n)=>{if(!e)return;let r=h.find(n=>n[0]===e&&n[1]===t);r?.[2]!==n&&(r?r[2]=n:h.push([e,t,n]),e.style.setProperty(t,n))},_,v=()=>{clearInterval(_),_=void 0};return{pause(){v();let e=performance.now();_=setInterval(()=>{let n=performance.now(),r=Math.min(.25,(n-e)/1e3);e=n,u=t(u,0,2,r),p=t(p,0,.15,r),g(l,`--reading`,u.toFixed(2)),g(document.body,`--drain`,p.toFixed(2)),p<.005&&u<.005&&v()},66)},frame(h,_,y){v();let b=y.present?e(Math.hypot(y.x,y.y),i.waking):0,x=Math.max(y.near,y.dwell,c?b:0);u=t(u,x*(c?1:.9),c?3:2,_),d=t(d,y.present?r(y.x/1.2,-1,1):0,2.5,_),f=t(f,y.present?r(y.y,-1,1):0,2.5,_);let S=c?.8:.5;p=t(p,y.dwell,y.dwell>p?S:.15,_),m+=_*(a.rest+(a.roused-a.rest)*u);let C=Math.max(0,Math.sin(m*2*Math.PI))**6;n.set(`a`,[u,d,f,p]),n.set(`b`,[C,+!!c,0,0]),n.set(`env`,[s.level,+!!c,0,0]),g(l,`--reading`,u.toFixed(2)),g(document.body,`--drain`,p.toFixed(2)),o.dataset.state=u>.5?`flushed`:c?`waking`:`cold`},level:()=>Math.max(u,p),dispose(){v();for(let[e,t]of h)e.style.removeProperty(t)}}},plates:[{name:`flushed`,caption:{almanac:`Flushed, its head turned toward the warmth that came near.`,cipher:`Plate I: thermal response to a nearby heat source.`},a:[.8,.6,.2,.3],b:[.8,0,0,0]}]};export{o as scene};