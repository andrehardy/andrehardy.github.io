import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
vec3 KEY, KEYC, SKYC, AIR, COAT;
const float S = 1.75;
// The trunks, far to near: across, depth (1 far, 0 at the glass), and a seed.
const vec3 TREES[8] = vec3[](vec3(-0.33, 0.95, 0.3), vec3(0.02, 0.9, 0.7), vec3(-0.74, 0.85, 0.4),
  vec3(0.46, 0.8, 0.2), vec3(-0.6, 0.7, 0.8), vec3(0.6, 0.65, 0.55), vec3(-1.17, 0.1, 0.5), vec3(1.14, 0.05, 0.3));

float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
// A limb that narrows from a to b.
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
// A round thing seen side on: t runs -1 to 1 across it.
vec3 rod(float t) { t = clamp(t, -0.98, 0.98); return vec3(t, 0.0, sqrt(1.0 - t * t)); }

// One light (the moon through the leaves, or the low sun at dawn), the cool fill of the sky, a
// rim where the light comes round, and a little light carried through thin hair and skin.
vec3 shade(vec3 alb, vec3 N, float rough) {
  float ndl = dot(N, KEY);
  float wr = max((ndl + 0.3) / 1.3, 0.0);
  float sky = 0.55 + 0.45 * N.y;
  vec3 H = normalize(KEY + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(70.0, 10.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.5) * max(dot(normalize(N.xy + 1e-4), normalize(KEY.xy)), 0.0);
  float through = smoothstep(0.2, -0.3, ndl) * 0.12;
  return alb * (SKYC * sky + KEYC * (wr + through)) + KEYC * (sp * 0.45 + rim * 0.4);
}

// The head carried high and alert among the trees, or lowered to the water.
vec2 neckTop(float down) { return mix(vec2(-0.235, 0.215), vec2(-0.3, -0.06), down); }
float headTurn(float down) { return mix(0.8, 1.35, down); }

float foreleg(vec2 q, float x) {
  float d = cone(q, vec2(x, -0.02), vec2(x - 0.006, -0.112), 0.025, 0.013);
  d = min(d, cone(q, vec2(x - 0.006, -0.112), vec2(x, -0.172), 0.0115, 0.0105));
  d = min(d, cone(q, vec2(x, -0.172), vec2(x - 0.011, -0.191), 0.0125, 0.011));
  return min(d, sdBox(q - vec2(x - 0.013, -0.197), vec2(0.012, 0.006)) - 0.002);
}
float hindleg(vec2 q, float x) {
  float d = cone(q, vec2(x - 0.012, 0.02), vec2(x + 0.035, -0.102), 0.046, 0.013);
  d = min(d, cone(q, vec2(x + 0.035, -0.102), vec2(x + 0.027, -0.172), 0.0115, 0.0105));
  d = min(d, cone(q, vec2(x + 0.027, -0.172), vec2(x + 0.016, -0.191), 0.0125, 0.011));
  return min(d, sdBox(q - vec2(x + 0.014, -0.197), vec2(0.012, 0.006)) - 0.002);
}

// The beast in profile, facing the water: the barrel, a deep shoulder, round quarters, an arched
// neck, a fine head with its ear and the goat's beard of the old bestiaries, and the near legs.
float equine(vec2 q, float down) {
  float d = sdEllipse(q - vec2(0.0, 0.028), vec2(0.165, 0.07));
  d = smin(d, sdEllipse(q - vec2(-0.13, 0.035), vec2(0.07, 0.08)), 0.045);
  d = smin(d, sdEllipse(q - vec2(0.14, 0.048), vec2(0.088, 0.077)), 0.045);
  vec2 n1 = neckTop(down);
  vec2 mid = mix(vec2(-0.13, 0.075), n1, 0.5) + mix(vec2(0.012, 0.02), vec2(0.0, 0.025), down);
  d = smin(d, min(cone(q, vec2(-0.125, 0.058), mid, 0.058, 0.044), cone(q, mid, n1, 0.044, 0.03)), 0.04);
  if (length(q - n1) < 0.17) {
    vec2 hq = rot(headTurn(down)) * (q - n1);
    float head = sdEllipse(hq - vec2(-0.02, 0.0), vec2(0.045, 0.034));
    head = smin(head, cone(hq, vec2(-0.03, -0.004), vec2(-0.122, -0.02), 0.029, 0.017), 0.025);
    head = min(head, cone(hq, vec2(0.01, 0.026), vec2(0.026, 0.072), 0.01, 0.002));
    head = min(head, cone(hq, vec2(-0.075, -0.03), vec2(-0.066, -0.07), 0.007, 0.0008));
    d = smin(d, head, 0.02);
  }
  if (q.y > 0.07) return d;
  d = smin(d, foreleg(q, -0.135), 0.015);
  return smin(d, hindleg(q, 0.155), 0.02);
}

// The mane, lying along the crest and falling down the near side of the neck in locks.
float maneD(vec2 q, float down, out float h, out float s, out float len) {
  vec2 a = vec2(-0.095, 0.1);
  vec2 ab = neckTop(down) + rot(-headTurn(down)) * vec2(0.012, 0.032) - a;
  h = dot(q - a, ab) / dot(ab, ab);
  vec2 nrm = normalize(vec2(ab.y, -ab.x));
  vec2 along = q - a - ab * clamp(h, 0.0, 1.0);
  s = dot(along, nrm);
  float lock = noise(vec2(h * 6.0, 1.3));
  len = 0.028 + 0.03 * lock * (1.0 - 0.4 * h);
  float edge = 0.005 * (noise(vec2(h * 30.0, 2.0)) - 0.5);
  return max(max(s - 0.006, -len - s + edge), max(-h, h - 1.05) * length(ab));
}

// The tail: long, full and lifting a little in the air.
float tailD(vec2 q, float t, out float u, out float across) {
  u = clamp((0.075 - q.y) / 0.25, 0.0, 1.0);
  float cx = 0.236 + 0.09 * u - 0.075 * u * u + 0.012 * u * u * sin(t * 0.8 + u * 3.0);
  float w = 0.008 + 0.026 * sin(min(u * 1.7, 1.0) * PI * 0.5) * (1.0 - 0.35 * u * u);
  w *= 0.85 + 0.3 * noise(vec2(u * 4.0, 2.0));
  cx += 0.008 * (noise(vec2(u * 3.0, 6.0)) - 0.5);
  across = (q.x - cx) / w;
  float d = abs(q.x - cx) - w;
  float end = -0.175 + 0.04 * noise(vec2(across * 3.0, 4.0)) + 0.025 * abs(across);
  return max(d, max(q.y - 0.075, end - q.y));
}

// A frond of bracken: a stem arching over, its pinnae paired along it, shortening to the tip.
float frond(vec2 fq, float L, float side, out float s) {
  s = fq.y / L;
  if (s < -0.02 || s > 1.02) return 1.0;
  float xc = fq.x - side * 0.3 * s * s * L;
  float stem = abs(xc) - 0.004 * (1.0 - s * 0.7);
  float n = 14.0;
  float k = (floor(s * n) + 0.5) / n;
  float plen = 0.16 * L * sin(PI * min(k * 1.15, 1.0)) * (1.0 - 0.35 * k);
  vec2 pq = vec2(abs(xc), (s - k) * L);
  float pinna = cone(pq, vec2(0.0, 0.0), vec2(plen, plen * 0.35), 0.009 * L / 0.4, 0.002);
  return min(stem, pinna);
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float outv = u_a.x, glare = u_a.y, dawn = u_a.z;
  KEY = normalize(mix(vec3(-0.5, 0.72, 0.48), vec3(-0.85, 0.32, 0.42), dawn));
  KEYC = mix(vec3(0.55, 0.66, 0.85), vec3(1.05, 0.8, 0.52), dawn);
  SKYC = mix(vec3(0.06, 0.08, 0.12), vec3(0.17, 0.21, 0.26), dawn);
  COAT = vec3(0.97, 0.97, 0.98);
  vec2 src = mix(vec2(-0.8, 0.95), vec2(-1.1, 0.25), dawn);

  // The deep wood: a cool air going back between the trunks, warm where the light comes in.
  vec3 low = mix(vec3(0.07, 0.1, 0.13), vec3(0.72, 0.6, 0.48), dawn);
  vec3 high = mix(vec3(0.03, 0.05, 0.07), vec3(0.26, 0.33, 0.36), dawn);
  AIR = mix(low, high, smoothstep(-0.1, 0.8, p.y));
  vec3 c = AIR + KEYC * 0.45 * exp(-1.6 * length((p - src) * vec2(0.8, 1.2)));
  AIR = mix(low, high, 0.35);
  c *= 0.92 + 0.16 * noise(p * 2.5);

  // The floor, going back into the wood: moss, old leaves and short grass, the clearing lit.
  float floorY = -0.08;
  vec3 bg = c;
  if (p.y < floorY + 0.01) {
    float near = clamp((floorY - p.y) / 0.92, 0.0, 1.0);
    float dep = max(floorY - p.y, 0.015);
    vec2 fuv = vec2(p.x / dep, 1.0 / dep) * 1.6;
    float n1 = noise(fuv), n2 = noise(fuv * 3.1 + 3.0), n3 = noise(fuv * 9.0 + 7.0);
    vec3 moss = mix(vec3(0.1, 0.15, 0.06), mix(vec3(0.12, 0.12, 0.09), vec3(0.26, 0.17, 0.09), dawn), smoothstep(0.4, 0.7, n1 + 0.2 * n3)) * (0.55 + 0.4 * n2 + 0.35 * n3);
    vec3 fl = shade(moss, normalize(vec3((n2 - 0.5) * 0.7, 1.0, 0.3)), 0.95);
    fl *= 0.45 + 1.0 * exp(-length((p - vec2(-0.05, -0.38)) * vec2(0.85, 2.0)) * 1.5);
    fl = mix(bg * 0.92, fl, smoothstep(0.0, 0.32, near));
    c = mix(c, fl, smoothstep(floorY + 0.01, floorY - 0.03, p.y));
  }

  // Beech trunks, far to near: smooth grey bark, moss on the shaded side, roots flaring into
  // the floor. The nearest stand at the edges of the case, dark against the clearing.
  for (int k = 0; k < 8; k++) {
    float i = float(k);
    vec3 tr = TREES[k];
    float z = tr.y, h2 = tr.z;
    bool edge = z < 0.2;
    float x = tr.x + plateDrift(1.0 - z).x;
    float base = edge ? -0.74 + 0.05 * h2 : mix(-0.24, -0.09, z);
    float w = edge ? 0.1 + 0.03 * h2 : mix(0.045, 0.01, z) * (0.8 + 0.4 * h2);
    c = gloom(c, p, vec2(x, base - 0.004), vec2(w * 2.8, 0.012 + 0.035 * (1.0 - z)));
    vec2 q = p - vec2(x, base);
    float cx = q.x - (h2 - 0.5) * 0.06 * q.y;
    float ww = w * (1.0 + 0.9 * exp(-max(q.y, 0.0) / (w * 1.3)));
    if (q.y < -0.01 || abs(cx) > ww + px * 2.0) continue;
    float tt = cx / ww;
    float ridge = noise(vec2(tt * 2.5 + i * 3.0, q.y * 5.0 / max(w * 10.0, 0.2)));
    vec3 bark = vec3(0.3, 0.3, 0.29) * (0.7 + 0.45 * ridge);
    bark = mix(bark, vec3(0.13, 0.2, 0.08), 0.75 * smoothstep(0.4, 0.0, q.y) * smoothstep(-0.3, 0.5, tt));
    vec3 tc = shade(bark, normalize(rod(tt) + vec3((ridge - 0.5) * 0.3, 0.0, 0.0)), 0.85);
    tc *= edge ? 0.45 : 1.0;
    tc = veil(tc, mix(low, high, smoothstep(-0.1, 0.8, p.y)), z * 0.78);
    c = mix(c, tc, smoothstep(ww, ww - px * 1.5, abs(cx)) * smoothstep(-0.01, 0.005, q.y));
  }

  // Beech leaves overhead in three layers, each leaf its own, the light coming through the thin
  // ones gold-green.
  if (p.y > 0.2) {
    float clump = noise(p * vec2(3.2, 4.0) + 1.0) * 0.7 + noise(p * 8.0) * 0.3;
    float mass = smoothstep(0.45, 0.62, clump + 0.6 * (p.y - 0.75));
    c = mix(c, veil(vec3(0.03, 0.045, 0.025) + KEYC * 0.04 * noise(p * 30.0), AIR, 0.35), mass * 0.85);
    for (int k = 0; k < 3; k++) {
      float fk = float(k);
      float sc = 16.0 + fk * 10.0;
      vec2 g = rot(0.5 + fk * 1.3) * p * sc;
      vec2 id = floor(g);
      float h = hash(id + fk * 17.0);
      float dens = smoothstep(0.42, 0.6, clump + 0.6 * (p.y - 0.75) + 0.05 * fk) * 0.95;
      if (h > dens) continue;
      vec2 o = (vec2(hash(id + 5.1), hash(id + 9.3)) - 0.5) * 0.3;
      vec2 lq = rot(h * 6.28) * (fract(g) - 0.5 - o);
      float leaf = sdEllipse(lq, vec2(0.44, 0.19)) + 0.04 * abs(lq.y) * sin(lq.x * 40.0);
      float lit_ = smoothstep(-0.2, 0.2, dot(normalize(vec2(cos(h * 6.28), sin(h * 6.28))), normalize(KEY.xy)));
      vec3 lcol = mix(vec3(0.03, 0.05, 0.025), vec3(0.11, 0.17, 0.05), hash(id + 2.0));
      lcol += KEYC * mix(vec3(0.1, 0.13, 0.1), vec3(0.32, 0.38, 0.12), dawn) * lit_ * (0.4 + 0.6 * hash(id + 4.0)) * (1.0 - 0.3 * fk);
      lcol *= 1.0 - 0.12 * abs(lq.y) / 0.19;
      c = mix(c, veil(lcol, AIR, max(0.3 - fk * 0.1, 0.0)), fill(leaf / sc, px));
    }
  }

  // Shafts of that light, coming down slant between the trunks, and the motes that hang in them.
  vec2 ld = normalize(vec2(0.25, -0.35) - src);
  vec2 rel = p - src;
  float along = max(dot(rel, ld), 0.0);
  float ang0 = dot(rel, vec2(-ld.y, ld.x)) / max(along, 0.3);
  float beams = smoothstep(0.4, 0.9, noise(vec2(ang0 * 3.2, 1.7))) * smoothstep(0.1, 0.5, along) * exp(-along * 0.8);
  beams *= mix(0.25, 1.0, smoothstep(-0.25, -0.05, p.y));
  c += KEYC * beams * mix(0.1, 0.22, dawn);
  vec2 mc = floor(p * 26.0 + vec2(0.0, t * 0.15));
  vec2 mp = fract(p * 26.0 + vec2(0.0, t * 0.15)) - 0.5 - (vec2(hash(mc), hash(mc + 3.0)) - 0.5) * 0.7;
  c += KEYC * smoothstep(0.08, 0.0, length(mp)) * step(0.7, hash(mc + 9.0)) * (0.15 + beams * 2.0) * 0.5;

  vec2 stand = mix(vec2(0.74, -0.03), vec2(0.13, -0.03), outv);
  float down = smoothstep(0.72, 1.0, outv);
  float ang = headTurn(down);
  vec2 n1 = neckTop(down);
  vec2 muzzle = stand + S * (n1 + rot(-ang) * vec2(-0.122, -0.02));

  // The spring: dark water in a hollow of the moss, sunk stones about it, the light and the
  // beast mirrored in it.
  vec2 P0 = vec2(-0.47, -0.45);
  vec2 w = p - P0;
  float wob = 0.006 * sin(atan(w.y, w.x) * 3.0 + 1.0);
  c = gloom(c, p, P0 + vec2(0.0, -0.02), vec2(0.42, 0.11));
  float pool = sdEllipse(w, vec2(0.27, 0.07)) + wob;
  if (pool < 0.01) {
    vec2 rm = (p - muzzle) * vec2(1.0, 3.2);
    float ring = sin(length(rm) * 150.0 - t * 5.0) * exp(-length(rm) * 9.0) * down;
    float fres = 0.3 + 0.5 * smoothstep(-0.07, 0.07, w.y);
    vec3 water = vec3(0.015, 0.03, 0.035) + (low * 0.7 + KEYC * 0.12) * fres * (1.0 + 0.5 * ring);
    vec2 pr = vec2(p.x + 0.004 * ring, 2.0 * (stand.y - 0.2 * S) - p.y + 0.003 * sin(p.x * 60.0 + t));
    vec2 rq = (pr - stand) / S;
    float rb = length((rq - vec2(-0.05, 0.0)) / vec2(0.5, 0.35)) < 1.2 ? equine(rq, down) : 1.0;
    water = mix(water, COAT * (KEYC * 0.5 + SKYC), fill(rb * S, px * 3.0) * 0.55 * outv);
    water += KEYC * 0.3 * smoothstep(0.82, 0.95, noise(vec2(w.x * 55.0, w.y * 240.0 + t * 0.6)));
    water = mix(water, water * 0.6, smoothstep(0.0, -0.06, w.y));
    c = mix(c, water, fill(pool, px));
    c = mix(c, c * 0.55, smoothstep(0.012, 0.0, abs(pool)) * step(0.0, w.y));
  }
  if (abs(w.y) < 0.14 && abs(w.x) < 0.42) {
    for (int k = 0; k < 5; k++) {
      float i = float(k);
      float a = k < 3 ? -2.6 + i * 0.42 : 2.7 - (i - 3.0) * 0.5;
      vec2 at = vec2(cos(a) * 0.3, sin(a) * 0.082 - 0.008);
      vec2 sr = vec2(0.07 + 0.04 * hash(vec2(i, 2.0)), 0.018 + 0.01 * hash(vec2(i, 4.0))) * (1.0 - 0.3 * sin(a));
      vec2 nq = (w - at) / sr;
      nq.y += 0.35 * nq.x * nq.x - 0.2;
      float d = max((length(nq) - 1.0) * sr.y, -(w.y - at.y + sr.y * 0.55)) + 0.005 * (noise(nq * 2.5 + i) - 0.5);
      if (d > 0.012) continue;
      vec3 N = normalize(vec3(nq.x * 0.5, nq.y * 0.7 + 0.5, sqrt(max(1.0 - dot(nq, nq), 0.0)) + 0.3));
      vec3 stone = vec3(0.46, 0.45, 0.42) * (0.7 + 0.4 * noise(nq * vec2(3.0, 6.0) + i * 2.0));
      stone = mix(stone, vec3(0.62, 0.6, 0.5), smoothstep(0.72, 0.8, noise(nq * 9.0 + i)) * 0.6);
      stone = mix(stone, vec3(0.16, 0.24, 0.08), smoothstep(0.6, 0.9, nq.y + 0.5 * noise(nq * 5.0 + i)) * 0.7);
      c = gloom(c, p, P0 + at - vec2(0.0, sr.y * 0.7), sr * vec2(1.3, 1.0));
      c = mix(c, shade(stone, N, 0.8), fill(d, px));
    }
  }

  // The beast. Among the trees it is half lost in the haze; at the water it is all there, pale
  // as moonlight, and a little of its own light about it.
  vec2 q = (p - stand) / S;
  q.y -= 0.002 * sin(t * 1.1);
  float qpx = px / S;
  float haze = (1.0 - outv) * 0.62;
  c = gloom(c, p, stand + vec2(0.0, -0.205 * S), vec2(0.3 * S, 0.028 * S));
  bool nearBeast = abs(q.x + 0.04) < 0.36 && abs(q.y - 0.03) < 0.27;
  float b = nearBeast ? equine(q, down) : 1.0;
  c += vec3(0.8, 0.86, 0.98) * 0.12 * exp(-max(b, 0.0) * 25.0) * outv * (0.6 + 0.4 * sin(t * 0.7));
  if (nearBeast) {
    float far = min(min(cone(q, vec2(-0.098, -0.02), vec2(-0.104, -0.112), 0.024, 0.012), cone(q, vec2(-0.104, -0.112), vec2(-0.11, -0.197), 0.011, 0.011)),
                    min(cone(q, vec2(0.106, 0.02), vec2(0.153, -0.102), 0.044, 0.012), cone(q, vec2(0.153, -0.102), vec2(0.136, -0.197), 0.011, 0.011)));
    if (far < 0.01) {
      vec3 fc = shade(COAT * 0.55, normalize(vec3(0.25, 0.15, 0.95)), 0.8);
      fc = mix(fc, vec3(0.1, 0.1, 0.1), smoothstep(-0.187, -0.195, q.y));
      c = mix(c, veil(fc, AIR, haze), fill(far, qpx));
    }
    float tu, ta;
    float td = tailD(q, t, tu, ta);
    if (td < 0.01) {
      float strands = noise(vec2(ta * 6.0, tu * 0.9)) * 0.55 + noise(vec2(ta * 19.0, tu * 1.6 + 3.0)) * 0.45;
      vec3 tn = normalize(vec3(clamp(ta, -1.0, 1.0) * 0.45, 0.1, 0.9));
      vec3 tcol = shade(COAT * (0.7 + 0.32 * strands) * (1.0 - 0.25 * tu), tn, 0.6);
      tcol += KEYC * 0.1 * smoothstep(0.6, 0.85, strands);
      float edgeA = 1.0 - smoothstep(0.6, 1.0, abs(ta)) * smoothstep(0.3, 0.7, 1.0 - strands);
      float endA = 1.0 - smoothstep(0.75, 1.0, tu) * smoothstep(0.35, 0.6, 1.0 - strands);
      c = mix(c, veil(tcol, AIR, haze), fill(td, qpx * 4.0) * edgeA * endA);
    }
  }
  if (b < 0.02) {
    vec2 g = normalize(vec2(dFdx(b), dFdy(b)) + 1e-6);
    float rim = clamp(-b / 0.05, 0.0, 1.0);
    vec3 N = normalize(vec3(g * (1.0 - rim), 0.2 + rim));
    float hair = noise(q * vec2(110.0, 35.0));
    vec3 coat = COAT * (0.93 + 0.1 * hair);
    coat = mix(coat, vec3(0.2, 0.18, 0.16), smoothstep(-0.186, -0.194, q.y));
    vec3 bc = shade(coat, N, 0.7);
    vec2 hq = rot(ang) * (q - n1);
    vec2 eq = rot(-0.35) * (hq - vec2(-0.036, 0.009));
    bc = mix(bc, bc * 0.55, fill(sdEllipse(eq, vec2(0.0095, 0.0062)), qpx * 2.0));
    bc = mix(bc, vec3(0.04, 0.03, 0.03), fill(sdEllipse(eq, vec2(0.0062, 0.0038)), qpx));
    bc += KEYC * 0.6 * fill(sdCircle(eq - vec2(-0.002, 0.0015), 0.0011), qpx);
    bc = mix(bc, bc * 0.35, fill(sdEllipse(hq - vec2(-0.115, -0.011), vec2(0.007, 0.004)), qpx));
    c = mix(c, veil(bc, AIR, haze), fill(b, qpx));
  }
  if (nearBeast) {
    float mh, ms, ml;
    float md = maneD(q, down, mh, ms, ml);
    if (md < 0.01) {
      float f = clamp(-ms / ml, 0.0, 1.0);
      float strands = noise(vec2(mh * 40.0, f * 0.8)) * 0.55 + noise(vec2(mh * 130.0, f * 1.2 + 2.0)) * 0.45;
      vec3 mn = normalize(vec3(0.0, 0.6 - f * 0.7, 0.8));
      vec3 mcol = shade(COAT * (0.8 + 0.28 * strands), mn, 0.5);
      mcol += KEYC * 0.1 * smoothstep(0.6, 0.85, strands) * (1.0 - f);
      c = mix(c, veil(mcol, AIR, haze), fill(md, qpx * 3.0) * (1.0 - smoothstep(0.55, 1.0, f) * (0.4 + 0.6 * smoothstep(0.3, 0.6, 1.0 - strands))));
    }
    for (int k = 0; k < 2; k++) {
      float x = k == 0 ? -0.146 : 0.168;
      float tuft = sdEllipse(q - vec2(x + 0.01, -0.181), vec2(0.01, 0.006)) + 0.002 * sin(q.x * 900.0);
      c = mix(c, veil(shade(COAT * 0.8, vec3(0.2, 0.3, 0.93), 0.6), AIR, haze), fill(tuft, qpx) * 0.6);
    }
  }

  // The horn, a twist of ivory; it gathers the glare when the beast is startled.
  vec2 hb = n1 + rot(-ang) * vec2(-0.016, 0.033);
  vec2 hd = rot(-ang) * normalize(vec2(-0.55, 0.83));
  vec2 hv = q - hb;
  float al = clamp(dot(hv, hd) / 0.17, 0.0, 1.0);
  float ac = dot(hv, vec2(-hd.y, hd.x));
  float hr = mix(0.0105, 0.0012, al);
  float horn = max(abs(ac) - hr, max(-dot(hv, hd), dot(hv, hd) - 0.17));
  if (horn < 0.01) {
    float spiral = sin(al * 75.0 + ac / hr * 1.7);
    vec3 tn = rod(ac / hr);
    vec3 N = normalize(vec3(vec2(-hd.y, hd.x) * tn.x + hd * spiral * 0.3, tn.z));
    vec3 hc = shade(vec3(0.95, 0.92, 0.84) * (0.86 + 0.12 * spiral), N, 0.25) + glare * vec3(0.6, 0.65, 0.6) * (0.5 + 0.5 * al);
    c = mix(c, veil(hc, AIR, haze), fill(horn, qpx * 0.8));
  }
  c += vec3(0.8, 0.85, 0.8) * glare * 0.3 * exp(-length(q - hb - hd * 0.17) * 6.0);

  // Bracken in the near shade at the foot of the case, and the grass between.
  if (p.y < -0.72) {
    for (int k = 0; k < 2; k++) {
      float g = p.x * (70.0 + 40.0 * float(k)) + float(k) * 0.5;
      float id = floor(g);
      float hgt = 0.07 + 0.12 * hash(vec2(id, float(k)));
      float y = (p.y + 1.0) / hgt;
      float x0 = fract(g) - 0.5 - (hash(vec2(id, 3.0)) - 0.5) * 0.4 - (hash(vec2(id, 5.0)) - 0.5) * 1.4 * y * y;
      float blade = abs(x0) - 0.22 * (1.0 - y);
      vec3 gc = vec3(0.05, 0.08, 0.03) * (1.0 + 0.6 * y) + KEYC * 0.05 * y;
      c = mix(c, gc * (0.7 + 0.3 * float(k)), smoothstep(0.06, -0.06, blade) * step(y, 1.0) * step(0.0, y));
    }
  }
  for (int m = 0; m < 3; m++) {
    float fm = float(m);
    vec2 root = m == 0 ? vec2(-1.22, -1.04) : m == 1 ? vec2(1.2, -1.02) : vec2(0.68, -1.08);
    float L = m == 2 ? 0.34 : 0.52;
    if (length(p - root) > L + 0.12) continue;
    for (int j = 0; j < 5; j++) {
      float fj = float(j);
      float a = (fj / 4.0 - 0.5) * 2.0 + (m == 0 ? -0.25 : 0.25) + 0.03 * sin(t * 0.5 + fj + fm);
      float s;
      float fd = frond(rot(a) * (p - root), L * (0.8 + 0.2 * hash(vec2(fj, fm))), sign(a + 1e-3), s);
      if (fd > 0.01) continue;
      vec3 fc = shade(vec3(0.07, 0.13, 0.04) * (0.7 + 0.6 * s), normalize(vec3(0.0, 0.6, 0.7)), 0.8) * 0.6;
      c = mix(c, fc + KEYC * 0.05 * s, fill(fd, px));
    }
  }

  // Mist lying on the water and the floor, heavier at dawn.
  float mist = smoothstep(-0.05, -0.36, p.y) * smoothstep(-0.8, -0.34, p.y) * (0.2 + 0.4 * dawn);
  mist *= 0.5 + 0.5 * noise(vec2(p.x * 2.5 - t * 0.04, p.y * 6.0));
  c = mix(c, low * 1.15 + KEYC * 0.08, mist * 0.5);
  c = mix(c, vec3(0.9, 0.93, 0.88), glare * 0.55 * smoothstep(0.9, 0.0, length(p - stand)));

  float on = smoothstep(0.02, -0.02, min(sdEllipse(q, vec2(0.34, 0.28)), horn));
  c = fluoroscope(c, p, mix(0.85, mix(0.4, 1.15, fill(horn, qpx)), on));
  return c;
}
`,n=.3,r=1.6,i={dawn:5,else:9},a={source:t,start({stage:t,root:a,env:o}){let s=o.on,c=0,l=0;return{frame(u,d,f){let p=f.speed<n&&f.idle>.5,m=f.speed>r&&c>.25;p?c=Math.min(1,c+d/(s?i.dawn:i.else)):m?c=Math.max(.3,c-d*.05):f.speed>n&&(c=Math.max(0,c-d*.25)),l=e(l,+!!m,m?.6:.35,d),t.set(`a`,[c,l,+!!s,0]),t.set(`env`,[o.level,+!!s,0,0]),a.dataset.state=l>.5?`glaring`:c>.5?`revealed`:`hidden`},level:()=>Math.max(c*.5,l),dispose(){}}},plates:[{name:`revealed`,caption:{almanac:`Out at the water, with its horn in the stream.`,cipher:`Plate I: revealed and drinking.`},a:[1,0,1,0]}]};export{a as scene};