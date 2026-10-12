import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
float gSkin;
float gSleeve;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
vec3 swell(float d, float depth) {
  vec2 g = normalize(vec2(dFdx(d), dFdy(d)) + 1e-5);
  float r = clamp(-d / depth, 0.0, 1.0);
  return normalize(vec3(g * (1.0 - r), 0.22 + 0.78 * r));
}
float spiral(vec2 q, float scale) {
  float r = length(q) * scale;
  float a = atan(q.y, q.x) / 6.2832;
  return stroke(fract(r - a) - 0.5, 0.16, 0.1) * step(r, 3.2);
}

vec3 shade(vec3 alb, vec3 N, float rough, float gleam) {
  vec3 sun = normalize(vec3(-0.75, 0.35, 0.55));
  vec3 doorL = normalize(vec3(0.65, 0.15, 0.6));
  float wr = max((dot(N, sun) + 0.3) / 1.3, 0.0);
  float gold = max(dot(N, doorL), 0.0) * gleam;
  vec3 H = normalize(sun + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(40.0, 8.0, rough)) * (1.0 - rough);
  float rim = pow(clamp(-N.x, 0.0, 1.0), 1.6);
  vec3 sky = vec3(0.1, 0.09, 0.16);
  vec3 warm = mix(vec3(0.95, 0.55, 0.32), vec3(1.05, 0.78, 0.42), gleam);
  return alb * (sky * (0.4 + 0.6 * max(N.y, 0.0)) + warm * wr * (0.3 + 0.7 * gleam) + vec3(1.0, 0.72, 0.35) * gold * 0.7)
       + warm * sp * 0.22 + vec3(0.62, 0.7, 0.82) * rim * 0.28;
}

float barrowTop(float x) {
  float g = (x - 0.38) / 0.82;
  return -0.62 + 0.74 * exp(-g * g) + 0.012 * noise(vec2(x * 3.2, 2.0));
}
// Where the mound's foot meets the ground: nearer, so lower, at its middle.
float barrowFoot(float x) {
  float g = (x - 0.38) / 0.82;
  return -0.4 - 0.05 * exp(-1.5 * g * g);
}

float fingersAt(vec2 q, vec2 hand, vec2 dir) {
  float d = 1.0;
  for (int i = 0; i < 4; i++) {
    float s = float(i) - 1.5;
    vec2 tip = hand + dir * 0.042 + vec2(s * 0.012, s * dir.x * 0.01);
    d = min(d, cone(q, hand + vec2(s * 0.006, 0.0), tip, 0.0032, 0.0014));
  }
  return d;
}

// A very tall figure, about eight heads, turned toward the door: a high-waisted robe flaring to a
// hem that pools and trails behind, long hanging sleeves, one arm lifted toward the door.
float sidhe(vec2 q) {
  float sk = clamp((0.44 - q.y) / 0.44, 0.0, 1.0);
  float hw = mix(0.038, 0.15, pow(sk, 1.3));
  float skirt = max(abs(q.x - 0.025 * sk) - hw, max(-q.y, q.y - 0.46));
  skirt = smin(skirt, sdEllipse(q - vec2(-0.06, 0.008), vec2(0.21, 0.03)), 0.05);
  float robe = smin(skirt, cone(q, vec2(0.0, 0.44), vec2(0.004, 0.655), 0.036, 0.05), 0.03);
  robe = smin(robe, sdEllipse(q - vec2(0.004, 0.655), vec2(0.062, 0.022)), 0.03);
  float arms = cone(q, vec2(0.045, 0.648), vec2(0.115, 0.6), 0.016, 0.013);
  arms = min(arms, cone(q, vec2(0.115, 0.6), vec2(0.19, 0.67), 0.012, 0.009));
  arms = min(arms, cone(q, vec2(-0.045, 0.645), vec2(-0.06, 0.5), 0.016, 0.013));
  arms = min(arms, cone(q, vec2(-0.06, 0.5), vec2(-0.035, 0.4), 0.012, 0.01));
  robe = smin(robe, arms, 0.015);
  // The long hanging sleeves: gauze, soft at the edge and falling in a curve, not slabs.
  vec2 s1 = q - vec2(0.005 * sin(q.y * 18.0), 0.0);
  gSleeve = cone(s1, vec2(0.122, 0.612), vec2(0.108, 0.5), 0.012, 0.026);
  gSleeve = max(gSleeve, -sdEllipse(s1 - vec2(0.13, 0.47), vec2(0.03, 0.03)));
  gSleeve = min(gSleeve, cone(s1, vec2(-0.052, 0.58), vec2(-0.074, 0.42), 0.014, 0.03));
  robe = smin(robe, gSleeve, 0.02);
  vec2 h = q - vec2(0.012, 0.75);
  float head = sdEllipse(rot(-0.25) * (h - vec2(0.0, 0.012)), vec2(0.025, 0.034));
  head = smin(head, sdEllipse(h - vec2(0.012, -0.02), vec2(0.017, 0.016)), 0.014);
  head = min(head, cone(h, vec2(-0.012, 0.004), vec2(-0.036, 0.036), 0.006, 0.0008));
  float neck = cone(q, vec2(0.006, 0.66), vec2(0.01, 0.73), 0.012, 0.009);
  vec2 raised = vec2(0.195, 0.672);
  float palm = smin(sdEllipse(q - raised, vec2(0.01, 0.013)), fingersAt(q, raised, vec2(0.4, 0.7)), 0.005);
  vec2 held = vec2(-0.033, 0.39);
  float gather = smin(sdEllipse(q - held, vec2(0.012, 0.011)), fingersAt(q, held, vec2(0.15, -0.8)), 0.005);
  gSkin = min(smin(head, neck, 0.015), min(palm, gather));
  return min(robe, gSkin);
}

// Silver hair from the crown down the back, past the shoulders, stirring.
float hairStrands(vec2 q) {
  float sway = sin(u_time * 0.5 + q.y * 2.5) * 0.01;
  vec2 c = vec2(-0.004, 0.78);
  float d = 1.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 end = vec2(-0.08 + 0.016 * fi + sway * (1.0 + fi * 0.2), 0.4 + 0.05 * hash(vec2(fi, 2.0)));
    d = min(d, cone(q, c + vec2(-0.02 + 0.004 * fi, -0.02), end, 0.009, 0.002));
  }
  return d;
}
// The thorn's limbs, in its own frame, and the clumps of leaf at the end of each.
const vec2 TA2 = vec2(0.01, 0.27);
const vec2 TA3 = vec2(0.12, 0.41);
const vec2 TBR = vec2(0.22, 0.25);
const vec2 TBL = vec2(-0.14, 0.37);
const vec2 TBT = vec2(0.03, 0.55);
const vec2 TBF = vec2(0.24, 0.51);
// The clumps' rounded shape alone; where a leaf may grow needs no more than that. Each clump sits
// a little past and above its limb's end, its radius its own.
const vec2 TIPS[7] = vec2[7](
  TBR + vec2(0.02, 0.012), TBL + vec2(0.02, 0.012), TBT + vec2(0.02, 0.012), TBF + vec2(0.02, 0.012),
  TBR + vec2(0.13, 0.062), vec2(0.095, 0.492), vec2(-0.0525, 0.337)
);
// Each layer of leaves on its own slant.
const mat2 TURNS[4] = mat2[4](
  mat2(0.8253, -0.5646, 0.5646, 0.8253), mat2(-0.8011, -0.5985, 0.5985, -0.8011), mat2(-0.3073, 0.9516, -0.9516, -0.3073),
  mat2(0.3624, -0.932, 0.932, 0.3624)
);
float thornCrown(vec2 t, float tipr[7]) {
  // Lobed as foliage grows, never a smooth oval, and broken again at a smaller scale.
  t += vec2(sin(t.y * 61.0 + sin(t.x * 23.0) * 2.0), sin(t.x * 57.0 + 1.3)) * 0.011;
  t += vec2(sin(t.x * 131.0 + t.y * 37.0), sin(t.y * 117.0 - t.x * 41.0)) * 0.004;
  float crown = 1.0;
  for (int i = 0; i < 7; i++) crown = smin(crown, length((t - TIPS[i]) * vec2(0.8, 1.35)) - tipr[i], 0.03);
  return crown;
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float season = u_a.y;
  float gleam = max(u_a.z, 0.2);
  float winter = clamp(1.0 - abs(season), 0.0, 1.0) + clamp(season - 3.0, 0.0, 1.0);
  float spring = clamp(1.0 - abs(season - 1.0), 0.0, 1.0);
  float summer = clamp(1.0 - abs(season - 2.0), 0.0, 1.0);
  float autumn = clamp(1.0 - abs(season - 3.0), 0.0, 1.0);
  float shut = u_b.z;
  gSkin = 1.0;
  gSleeve = 1.0;

  vec3 zenith = vec3(0.04, 0.045, 0.11);
  vec3 low = mix(vec3(0.22, 0.16, 0.24), vec3(0.62, 0.34, 0.24), gleam);
  vec3 c = mix(low, zenith, smoothstep(-0.15, 0.85, p.y));
  vec2 sc = floor(p * 26.0 + plateDrift(0.08));
  vec2 sv = fract(p * 26.0) - 0.15 - 0.7 * vec2(hash(sc), hash(sc + 3.2));
  float star = smoothstep(0.045, 0.0, length(sv)) * step(0.965, hash(sc + 9.0));
  c += vec3(0.85, 0.9, 1.0) * star * smoothstep(0.05, 0.55, p.y) * (1.0 - gleam) * 0.85;
  float moon = length(p - vec2(0.85, 0.72)) - 0.035;
  c = mix(c, vec3(0.78, 0.8, 0.84) * (0.45 + 0.4 * (1.0 - gleam)), fill(moon, px));

  float far = -0.05 + 0.06 * noise(vec2((p.x + plateDrift(0.15).x) * 1.4, 3.0));
  c = mix(c, mix(vec3(0.1, 0.1, 0.16), vec3(0.2, 0.18, 0.22), gleam), fill(p.y - far, px) * 0.85);

  if (p.y < -0.02) {
    float dep = max(-0.02 - p.y, 0.012);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.85 + plateDrift(0.4);
    float far_ = smoothstep(0.03, 0.3, dep);
    float n = mix(0.5, noise(rot(0.25) * uv * 1.2), far_);
    float n2 = mix(0.5, noise(rot(1.2) * uv * 3.1 + 3.0), far_);
    float near = smoothstep(-0.05, -1.0, p.y);
    vec3 grass = mix(vec3(0.06, 0.09, 0.05), vec3(0.2, 0.28, 0.12), n);
    grass = mix(grass, vec3(0.26, 0.18, 0.09), autumn * 0.35);
    grass = mix(grass, vec3(0.46, 0.48, 0.5), winter * smoothstep(0.4, 0.7, n2) * 0.5);
    // The turf's own variation: patchy at the scale of a clump and fine within it, foreshortened
    // with the ground but alike in every direction on it, so nothing streaks to the horizon.
    float tufts = mix(0.5, noise(uv * 4.5 + 11.0), far_);
    float fine = mix(0.5, noise(uv * 13.0 + 5.0), far_ * far_);
    grass *= (0.8 + 0.4 * n2) * (0.76 + 0.48 * tufts) * (0.88 + 0.24 * fine);
    // Close to, the short grass between the clumps: fine upright blades, their tips catching
    // the light, gone into the turf's own tone with distance.
    if (p.y < -0.5) {
      float near_ = smoothstep(-0.5, -0.9, p.y);
      vec2 sg = vec2(p.x * 230.0 + 2.0 * sin(p.y * 37.0 + p.x * 9.0), p.y * 34.0);
      float blade = noise(sg);
      grass *= mix(1.0, 0.72 + 0.56 * blade, near_);
      grass += vec3(0.05, 0.07, 0.03) * smoothstep(0.66, 0.8, blade) * near_ * (1.0 - winter * 0.5);
    }
    grass *= mix(1.0, 0.62, smoothstep(0.35, 1.5, dep));
    vec3 tn = normalize(vec3((tufts - 0.5) * 0.5, 0.85, 0.55));
    vec3 lit = shade(grass, tn, 0.94, gleam);
    vec2 dg = p * 80.0;
    vec2 di = floor(dg);
    vec2 dof = fract(dg) - 0.5 - (vec2(hash(di + 1.3), hash(di + 7.1)) - 0.5) * 0.6;
    float dew = step(0.975, hash(di)) * (1.0 - smoothstep(0.02, 0.1, length(dof))) * (1.0 - gleam) * near;
    lit += vec3(0.75, 0.8, 0.85) * dew * 0.7;
    c = lit;
    // Near the glass the grass gathers into tussocks, scattered in depth, never in rows: each a
    // domed clump sitting down into the turf, its blades springing off the crown and fanning
    // out, the nearer the larger. Drawn from the far ones forward, so each hides what is behind.
    for (int k = 0; k < 5; k++) {
      float fk = float(k);
      float cw = 0.15 + fk * 0.07;
      float baseY = -0.52 - fk * 0.1;
      if (p.y < baseY - 0.06 - cw * 0.25 || p.y > baseY + 0.05 + cw * 1.1) continue;
      float x = p.x + plateDrift(0.5 + 0.2 * fk).x + fk * 0.37;
      for (int j = -1; j <= 1; j++) {
        float id = floor(x / cw) + float(j);
        vec2 hid = vec2(id, fk * 13.0);
        if (hash(hid) < 0.42) continue;
        float tx = (id + 0.5 + (hash(hid + 1.0) - 0.5) * 0.7) * cw;
        float ty = baseY + (hash(hid + 2.0) - 0.5) * 0.08;
        float tw = cw * (0.16 + 0.3 * hash(hid + 3.0));
        float th = tw * (0.34 + 0.16 * hash(hid + 4.0));
        vec2 o = vec2(x - tx, p.y - ty);
        if (abs(o.x) > tw * 2.6 || o.y < -th || o.y > th * 5.0) continue;
        // The clump's heart: a low mound in its own shadow, fading into the turf at its foot and
        // taking the turf's own colour on top, the blades hiding its edge.
        float dome = sdEllipse(o, vec2(tw, th * 0.5));
        float up = clamp(o.y / (th * 0.5), -1.0, 1.0);
        vec3 dc = mix(vec3(0.03, 0.045, 0.025), vec3(0.12, 0.17, 0.07), smoothstep(-0.8, 1.0, up));
        dc = mix(dc, vec3(0.26, 0.18, 0.09), autumn * 0.35);
        dc = mix(dc, c * mix(0.45, 0.85, smoothstep(-0.6, 1.0, up)), winter * 0.8);
        c = gloom(c, p, vec2(tx + tw * 0.3, ty - th * 0.35), vec2(tw * 1.4, th * 0.4));
        c = mix(c, dc, smoothstep(th * 0.5, -th * 0.3, dome) * smoothstep(-1.0, 0.0, up) * 0.6);
        // The blades: a fountain of them off the heart, each clump its own: more or fewer, thrown
        // to one side, or laid flat by weather; each blade its own height, tapered and lit along
        // one edge.
        float many = 7.0 + floor(hash(hid + 9.0) * 6.0);
        float skew = (hash(hid + 10.0) - 0.5) * 0.7;
        float flat_ = step(0.78, hash(hid + 11.0));
        float wind = (hash(hid + 12.0) - 0.5) * 1.4 + flat_ * sign(skew + 1e-3) * 1.6;
        float splay = 1.4 + 1.4 * hash(hid + 13.0);
        for (int b = 0; b < 12; b++) {
          float fb = float(b);
          if (fb >= many) break;
          float hb = hash(hid + fb * 1.7 + 5.0);
          float u = (fb + 0.5) / many - 0.5 + (hb - 0.5) * 0.7 / many;
          u = clamp(u + skew * (0.25 - u * u), -0.5, 0.5);
          float rx = u * tw * 1.3;
          float ry = th * 0.5 * sqrt(max(0.0, 1.0 - (rx / tw) * (rx / tw))) - th * (0.3 + 0.5 * hash(hid + fb * 4.3 + 8.0));
          float bh = th * (1.6 + 2.6 * hash(hid + fb * 2.3 + 6.0)) * (1.0 - abs(u + skew * 0.3) * 0.8) * mix(1.0, 0.5, flat_);
          float lean = u * splay + 0.2 + wind * 0.5 + (hash(hid + fb * 3.1 + 7.0) - 0.5) * 0.9;
          float y = o.y - ry;
          if (y < -0.004 || y > bh) continue;
          float s = clamp(y / bh, 0.0, 1.0);
          float bx = o.x - rx - lean * bh * s * s;
          float w = mix(tw * 0.09, 0.0006, s);
          float d = max(abs(bx) - w, y - bh);
          if (d > px * 2.0) continue;
          vec3 bc = mix(vec3(0.05, 0.075, 0.04), vec3(0.25, 0.33, 0.13), s * (0.55 + 0.45 * hb));
          bc = mix(bc, vec3(0.38, 0.25, 0.11), autumn * 0.45 * s);
          bc = mix(bc, vec3(0.58, 0.6, 0.63), winter * smoothstep(0.45, 1.0, s) * 0.65);
          float edge = clamp(bx / max(w, 1e-4), -1.0, 1.0) * sign(lean + 1e-3);
          vec3 bN = normalize(vec3(edge * 0.7, 0.5, 0.6));
          // Rising out of the turf, not set on it.
          c = mix(c, shade(bc, bN, 0.8, gleam) * (0.55 + 0.45 * s), fill(d, px) * smoothstep(0.0, 0.22, s));
        }
      }
    }
  }
  float top = barrowTop(p.x);
  float foot = barrowFoot(p.x);
  // The mound's shadow along its foot, where it sits down into the grass.
  if (top > foot && p.y < foot) c *= 1.0 - 0.38 * smoothstep(0.07, 0.0, foot - p.y);
  if (p.y < top + 0.02 && p.y > foot - 0.04 && top > foot - 0.02) {
    float g = (p.x - 0.38) / 0.82;
    float slope = 0.74 * exp(-g * g) * (-2.0 * g) / 0.82;
    float tn = noise(vec2(p.x * 5.0, p.y * 9.0));
    float along = p.x * 22.0 + tn * 2.0;
    float tuft = smoothstep(0.32, 0.08, abs(fract(along) - 0.5) - 0.16) * 0.4;
    tuft *= smoothstep(0.12, 0.0, top - p.y);
    vec3 turf = mix(vec3(0.06, 0.11, 0.045), vec3(0.22, 0.32, 0.11), tn);
    turf = mix(turf * 0.7, turf * 1.2, tuft);
    turf = mix(turf, vec3(0.28, 0.18, 0.1), autumn * 0.35);
    turf = mix(turf, vec3(0.5, 0.52, 0.54), winter * smoothstep(-0.15, 0.25, p.y) * 0.45);
    float crest = exp(-((p.x - 0.5) * (p.x - 0.5)) / 0.08) * smoothstep(0.04, 0.0, top - p.y);
    turf += vec3(0.16, 0.18, 0.16) * crest * (0.45 + 0.35 * (1.0 - gleam));
    vec3 N = normalize(vec3(-slope, 0.9, 0.65));
    // Darker as the mound rounds down toward its foot, where it is turned from the sky.
    turf *= mix(0.6, 1.0, smoothstep(0.0, 0.14, p.y - foot));
    float onMound = smoothstep(0.015, -0.02, p.y - top) * smoothstep(-0.03, 0.012, p.y - foot);
    c = mix(c, shade(turf, N, 0.9, gleam), onMound);
  }

  vec2 door = p - vec2(0.4, -0.16);
  float openW = mix(0.072, 0.004, shut) * mix(0.45, 1.0, gleam);
  float opening = sdBox(door - vec2(0.0, -0.01), vec2(openW, 0.12));
  vec3 within = mix(vec3(0.28, 0.14, 0.04), vec3(1.0, 0.75, 0.32), 0.4 + 0.5 * gleam);
  within *= 0.7 + 0.3 * noise(door * 8.0 + u_time * 0.12);
  c = mix(c, within, fill(opening, px));
  float rough = 0.012 * (noise(door * 16.0) - 0.5) + 0.006 * (noise(door * 45.0) - 0.5);
  float leftS = sdBox(rot(0.04) * (door - vec2(-0.125, -0.02)), vec2(0.032, 0.18)) - 0.01;
  float rightS = sdBox(rot(-0.05) * (door - vec2(0.125, -0.02)), vec2(0.03, 0.18)) - 0.012;
  float lintel = sdBox(rot(0.03) * (door - vec2(0.0, 0.17)), vec2(0.18, 0.035)) - 0.012;
  float stones = min(leftS, min(rightS, lintel)) + rough;
  vec3 sN = normalize(swell(stones, 0.03) + vec3((noise(door * 30.0) - 0.5) * 0.4, 0.1, 0.0));
  vec3 rock = vec3(0.4, 0.39, 0.37) * (0.62 + 0.38 * noise(door * 11.0)) * (0.85 + 0.25 * noise(door * 60.0));
  rock = mix(rock, vec3(0.3, 0.34, 0.24), smoothstep(0.55, 0.8, noise(door * 7.0 + 3.0)) * 0.5);
  c = mix(c, shade(rock, sN, 0.58, gleam), fill(stones, px));
  vec2 e = door - vec2(0.0, -0.22);
  float slab = sdBox(e, vec2(0.16, 0.055));
  float triple = max(spiral((e - vec2(-0.07, 0.0)) * 0.85, 9.0), max(spiral(e * 0.85, 9.0), spiral((e - vec2(0.07, 0.0)) * 0.85, 9.0)));
  vec3 slabC = shade(vec3(0.3, 0.28, 0.26), normalize(vec3(0.0, 0.4, 0.9)), 0.6, gleam);
  slabC = mix(slabC, slabC * 0.35, triple);
  c = mix(c, slabC, fill(slab, px));
  float spill = smoothstep(0.02, -0.42, door.y) * smoothstep(0.5, 0.0, abs(door.x) - max(-door.y, 0.0) * 0.4);
  c += vec3(1.0, 0.72, 0.28) * spill * 0.32 * gleam * (1.0 - shut);

  // The kerbstones along the mound's foot: each its own, some tall and some squat, leaning as
  // the ground has let them, sunk deep or barely set, and sitting in their own shadow.
  if (p.y < -0.22 && p.y > -0.56) {
    float kA = 0.0, kD = 1.0, kI = 0.0, kH = 0.0, kF = 0.0;
    vec2 kS = vec2(0.0);
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float x = -0.44 + fi * 0.185 + 0.05 * (hash(vec2(fi, 1.0)) - 0.5);
      if (abs(x - 0.4) < 0.19) continue;
      float kf = barrowFoot(x);
      if (barrowTop(x) < kf + 0.05) continue;
      float tall = step(0.6, hash(vec2(fi, 15.0)));
      float kw = 0.042 + 0.04 * hash(vec2(fi, 6.0)) - 0.01 * tall;
      float kh = mix(0.045 + 0.035 * hash(vec2(fi, 2.0)), 0.1 + 0.04 * hash(vec2(fi, 2.0)), tall);
      float lean = (hash(vec2(fi, 9.0)) - 0.5) * 0.5;
      float sink = 0.2 + 0.45 * hash(vec2(fi, 11.0));
      vec2 at = vec2(x, kf + kh * (1.0 - sink));
      vec2 s = rot(lean) * (p - at);
      // Rough-hewn: the top weathered to a slant and the faces uneven.
      s.y -= s.x * (hash(vec2(fi, 17.0)) - 0.5) * 0.6;
      float corner = 0.3 + 0.35 * hash(vec2(fi, 13.0));
      float rk = sdBox(s, vec2(kw, kh) * (1.0 - corner * 0.5)) - min(kw, kh) * corner * 0.5;
      rk += 0.01 * (noise(s * 12.0 + fi * 4.0) - 0.5) + 0.003 * (noise(s * 50.0 + fi) - 0.5);
      rk = max(rk, kf - 0.006 - p.y);
      if (rk > 0.06) continue;
      c = gloom(c, p, vec2(x + kw * 0.4, kf - 0.004), vec2(kw * 1.6, 0.018));
      // The stone standing in front here; it is cut and lit once, after the row.
      if (fill(rk, px) > 0.0) {
        kA = fill(rk, px);
        kD = rk;
        kS = s;
        kI = fi;
        kH = kh;
        kF = kf;
      }
    }
    if (kA > 0.0) {
      vec3 grey = vec3(0.24, 0.25, 0.26) * (0.7 + 0.4 * hash(vec2(kI, 4.0))) * (0.75 + 0.4 * noise(kS * 30.0 + kI));
      grey = mix(grey, vec3(0.3, 0.33, 0.22), smoothstep(0.55, 0.8, noise(kS * 14.0 + kI * 3.0)) * 0.6);
      grey *= mix(0.55, 1.0, smoothstep(0.0, kH * 0.8, p.y - kF));
      vec3 kn = normalize(swell(kD, 0.035) + vec3((noise(kS * 25.0) - 0.5) * 0.35, (noise(kS * 9.0 + 2.0) - 0.5) * 0.2, 0.0));
      c = mix(c, shade(grey, kn, 0.7, gleam), kA);
    }
  }

  vec2 t = (p - vec2(-0.95, -0.42)) / 1.3;
  if (t.y > -0.05 && t.y < 0.9 && t.x > -0.4 && t.x < 0.6) {
    // The thorn: an old trunk, thick at the root and flaring into it, twisting as it climbs and
    // tapering into limbs that the wind has bent all one way, each ending in a fist of twigs.
    c = gloom(c, p, vec2(-0.95, -0.42) + vec2(0.06, -0.008), vec2(0.22, 0.035));
    vec2 tg = t + vec2(0.012 * (noise(t * vec2(5.0, 9.0)) - 0.5), 0.0);
    vec2 a0 = vec2(0.0, -0.01);
    vec2 a1 = vec2(0.06, 0.13);
    vec2 a2 = TA2;
    vec2 a3 = TA3;
    vec2 bR = TBR;
    vec2 bL = TBL;
    vec2 bT = TBT;
    vec2 bF = TBF;
    float trunk = cone(tg, a0, a1, 0.036, 0.026);
    trunk = smin(trunk, cone(tg, a1, a2, 0.026, 0.019), 0.02);
    trunk = smin(trunk, cone(tg, a2, a3, 0.019, 0.012), 0.015);
    trunk = smin(trunk, cone(tg, a1 + vec2(0.0, 0.01), bR, 0.014, 0.006), 0.012);
    trunk = smin(trunk, cone(tg, a2, bL, 0.012, 0.005), 0.01);
    trunk = smin(trunk, cone(tg, a3, bT, 0.009, 0.003), 0.008);
    trunk = smin(trunk, cone(tg, a3, bF, 0.009, 0.004), 0.008);
    trunk = smin(trunk, cone(tg, bR, bR + vec2(0.11, 0.05), 0.006, 0.002), 0.006);
    trunk = smin(trunk, sdEllipse(tg - vec2(0.01, -0.005), vec2(0.075, 0.018)), 0.03);
    // Twigs in clusters at the end of every limb, thin and crooked, with their thorns.
    if (t.y > 0.18) {
      for (int i = 0; i < 16; i++) {
        float fi = float(i);
        float pick = mod(fi, 4.0);
        vec2 root = pick < 1.0 ? bR : (pick < 2.0 ? bL : (pick < 3.0 ? bT : bF));
        float a = 0.3 + hash(vec2(fi, 3.0)) * 2.6;
        float len = 0.035 + 0.06 * hash(vec2(fi, 8.0));
        vec2 mid = root + vec2(cos(a), sin(a)) * len * 0.5 + vec2(0.01 * (hash(vec2(fi, 4.0)) - 0.5));
        vec2 tip = root + vec2(cos(a + 0.4 * (hash(vec2(fi, 5.0)) - 0.5)), sin(a)) * len;
        float tw = min(cone(t, root, mid, 0.0032, 0.0022), cone(t, mid, tip, 0.0022, 0.0008));
        vec2 thornAt = mix(root, tip, 0.35 + 0.3 * hash(vec2(fi, 6.0)));
        tw = min(tw, cone(t, thornAt, thornAt + vec2(-sin(a), cos(a)) * 0.012, 0.0014, 0.0002));
        trunk = min(trunk, tw);
      }
    }
    // Bark: grey-brown, fissured along the grain, with lichen on the side turned from the wind.
    if (trunk < px * 2.0) {
      float fiss = smoothstep(0.42, 0.62, noise(rot(0.22) * t * vec2(150.0, 13.0)));
      float lich = smoothstep(0.6, 0.75, noise(t * 22.0 + 4.0)) * smoothstep(0.02, -0.01, t.x - 0.05 - t.y * 0.2);
      vec3 barkA = mix(vec3(0.2, 0.15, 0.11), vec3(0.08, 0.06, 0.05), fiss);
      barkA = mix(barkA, vec3(0.38, 0.42, 0.33), lich * 0.6);
      barkA *= 0.8 + 0.3 * noise(t * vec2(40.0, 6.0));
      vec3 bN = normalize(swell(trunk, 0.024) + vec3((fiss - 0.5) * 0.35, 0.0, 0.0));
      c = mix(c, shade(barkA, bN, 0.82, gleam), fill(trunk, px));
    }
    if (winter < 0.8 && t.y > 0.12) {
      // The leaf: a clump of it at the end of every limb, one outline for all of it. Inside, the
      // shaded mass of the leaves behind, crisp-edged, open in places to the sky; over it the
      // leaves themselves in three layers, each whole and turned its own way, grown only from
      // inside that same outline, so every leaf at the edge overlaps the mass and the edge is
      // made of leaves.
      float tipr[7];
      for (int i = 0; i < 7; i++) tipr[i] = 0.05 + 0.035 * hash(vec2(float(i), 21.0));
      float crown = thornCrown(t, tipr);
      float leafy = clamp(spring + summer + autumn, 0.0, 1.0);
      if (crown < 0.02 && leafy > 0.0) {
        float high = smoothstep(-0.06, 0.04, t.y - 0.42 - (t.x - 0.05) * 0.1);
        float weave = noise(TURNS[1] * t * 11.0 + 7.0);
        float thin = smoothstep(0.72, 0.74, weave);
        float mass = fill(crown + 0.013, px) * (1.0 - thin);
        // The leaves behind, in their own shade: green, mottled, never black.
        vec3 deep = mix(vec3(0.05, 0.085, 0.03), vec3(0.08, 0.125, 0.04), smoothstep(0.2, 0.6, weave));
        deep = mix(deep, vec3(0.12, 0.05, 0.025), autumn * 0.6) * mix(0.9, 1.0, high);
        c = mix(c, deep, mass * leafy);
        // The nearest leaf over each point, its colour and its turn, lit once.
        vec3 la = vec3(0.0);
        vec3 ln = vec3(0.0, 1.0, 0.0);
        float cover = 0.0;
        for (int k = 0; k < 4; k++) {
          float fk = float(k);
          float sc = 31.0 + fk * 7.0;
          mat2 turn = TURNS[k];
          vec2 g = turn * t * sc;
          vec2 id = floor(g);
          float h = hash(id + fk * 17.0);
          vec2 o = (vec2(hash(id + 5.1), hash(id + 9.3)) - 0.5) * 0.12;
          float grows = smoothstep(0.002, -0.003, thornCrown(transpose(turn) * ((id + 0.5 + o) / sc), tipr));
          // Every layer thick within the clump and thinning out to its edge.
          if (h > grows * (1.0 - fk * 0.1)) continue;
          float ang = (hash(id + 7.7) - 0.5) * 2.4 + 1.57 + fk * 0.9;
          vec2 cs = vec2(cos(ang), sin(ang));
          vec2 lq = mat2(cs.x, -cs.y, cs.y, cs.x) * (fract(g) - 0.5 - o);
          // Drawn to a point at either end, as a leaf is, not an oval.
          lq.y *= 1.0 + 0.8 * abs(lq.x);
          float lf = sdEllipse(lq, vec2(0.38, 0.3) * (0.85 + 0.2 * hash(id + 1.9)));
          float tone = hash(id + 2.0);
          vec3 lc = mix(vec3(0.045, 0.085, 0.028), vec3(0.13, 0.2, 0.055), tone);
          lc = mix(lc, vec3(0.16, 0.19, 0.05), step(0.85, fract(tone * 3.7)));
          lc = mix(lc, vec3(0.88, 0.86, 0.76), spring * step(0.5, fract(tone * 7.3)));
          lc = mix(lc, mix(vec3(0.5, 0.14, 0.08), vec3(0.6, 0.34, 0.1), fract(tone * 13.1)), autumn * step(0.25, fract(tone * 7.3)));
          // Darker down the midrib's far side, and the back layers in the clump's own shade.
          lc *= (1.0 - 0.25 * smoothstep(-0.02, 0.16, lq.y)) * (0.68 + 0.11 * fk);
          float a = fill(lf / sc * 1.3, px);
          la = mix(la, lc, a);
          ln = mix(ln, vec3(cs.x * 0.55, 0.35 + 0.5 * high, 0.65 + 0.2 * cs.y), a);
          cover = max(cover, a);
        }
        vec3 leafC = shade(la / max(cover, 1e-3), normalize(ln), 0.85, gleam) * mix(0.85, 1.0, high);
        c = mix(c, leafC, cover * leafy);
      }
    }
  }

  vec2 feet = vec2(-0.02 + u_a.x, -0.43);
  vec2 q = p - feet;
  q.x += u_a.x * 0.22 * q.y;
  c = gloom(c, p, feet + vec2(0.04, 0.01), vec2(0.22, 0.045));

  float hair = hairStrands(q);
  vec3 silver = vec3(0.5, 0.52, 0.56);
  c = mix(c, shade(silver, swell(hair, 0.03), 0.4, gleam), fill(hair, px));

  float fig = sidhe(q);
  if (fig < 0.05) {
    float sk = clamp((0.44 - q.y) / 0.44, 0.0, 1.0);
    float u = (q.x - 0.025 * sk) / mix(0.038, 0.15, pow(sk, 1.3));
    float ph = u * mix(5.0, 11.0, sk) + 3.0 * noise(vec2(q.y * 5.0, 2.0));
    float onSkirt = step(q.y, 0.45);
    float folds = pow(0.5 + 0.5 * cos(ph), 1.6);
    vec3 N = normalize(swell(fig, 0.05) + vec3(-sin(ph) * 0.4 * sk * onSkirt, 0.0, 0.0));
    vec3 cloth = mix(vec3(0.06, 0.07, 0.13), vec3(0.36, 0.38, 0.54), 0.25 + 0.6 * mix(0.6, folds, onSkirt));
    vec3 body = shade(cloth, N, 0.55, gleam);
    body += vec3(0.42, 0.44, 0.52) * smoothstep(0.006, 0.0, abs(q.y - 0.44)) * step(abs(q.x), 0.045) * 0.5;
    // The sleeves: a paler, thinner stuff, rounded, folded down their length, the hill's light
    // coming through them at the edge.
    float onSleeve = smoothstep(0.004, -0.006, gSleeve);
    float sf = 0.5 + 0.5 * cos(q.y * 70.0 + 4.0 * noise(vec2(q.x * 30.0, q.y * 6.0)));
    vec3 sleeveC = shade(mix(vec3(0.14, 0.15, 0.26), vec3(0.46, 0.48, 0.64), 0.35 + 0.45 * sf), normalize(swell(gSleeve, 0.022) + vec3(0.0, 0.0, 0.2)), 0.6, gleam);
    sleeveC += vec3(0.9, 0.62, 0.3) * 0.18 * gleam * smoothstep(-0.008, 0.0, gSleeve);
    body = mix(body, mix(sleeveC, c, 0.25), onSleeve);
    vec2 h = q - vec2(0.012, 0.75);
    vec3 face = shade(vec3(0.86, 0.82, 0.78), N, 0.42, gleam);
    face = mix(face, face * 0.3, fill(sdEllipse(h - vec2(0.014, 0.006), vec2(0.0075, 0.0028)), px));
    face = mix(face, face * 0.6, stroke(sdSegment(h, vec2(0.006, 0.016), vec2(0.024, 0.017)), 0.0015, px));
    face = mix(face, face * 0.7, stroke(sdSegment(h, vec2(0.016, -0.022), vec2(0.024, -0.021)), 0.0012, px));
    float hairline = step(0.0, h.y - 0.9 * h.x - 0.012) * step(length(h - vec2(-0.03, 0.03)), 0.045);
    vec3 hairC = shade(vec3(0.74, 0.76, 0.8) * (0.8 + 0.25 * noise(vec2(h.x * 200.0, h.y * 30.0))), N, 0.4, gleam);
    face = mix(face, hairC, hairline * (1.0 - fill(cone(h, vec2(-0.012, 0.004), vec2(-0.036, 0.036), 0.006, 0.0008), px)));
    float onSkin = fill(gSkin, px);
    body = mix(body, face, onSkin);
    float raw = u_a.w * smoothstep(0.09, 0.02, length(q - u_b.xy));
    body = mix(body, vec3(0.55, 0.15, 0.12), raw * (0.4 + 0.45 * onSkin));
    c = mix(c, body, fill(fig, px));
  }
  float under = lensIn(p);
  if (under > 0.0) {
    float grey = dot(c, vec3(0.3, 0.59, 0.11));
    vec3 dead = vec3(grey) * vec3(0.62, 0.62, 0.66) * 0.75;
    float sore = smoothstep(0.72, 0.88, noise(q * 16.0)) * fill(gSkin, px);
    dead = mix(dead, vec3(0.5, 0.18, 0.14), sore);
    c = mix(c, dead, under);
  }
  float r = length(p - u_lens.xy) - u_lens.z;
  vec3 iron = vec3(0.16, 0.15, 0.14) + vec3(0.12, 0.05, 0.02) * noise(p * 8.0);
  c = mix(c, iron, u_lens.w * stroke(r - 0.012, 0.012, 0.004));
  return c;
}
`,n=[`winter`,`spring`,`summer`,`autumn`],r=-.02,i=-.15,a=.7,o=.6,s=(e,t,n)=>Math.min(n,Math.max(t,e)),c={source:t,start({stage:t,root:c,env:l}){let u=Math.max(0,n.indexOf(l.note??`winter`)),d=Math.max(.2,l.level),f=0,p=0,m=0,h=[0,.3],g=1;return{frame(_,v){g=e(g,0,.9,v);let[y,b,,x]=t.lensAt(),S=r+f,C=Math.hypot(y-S,b-s(b,-.42,.12)),w=Math.hypot(y-S,b-i);p=x*s((a-Math.min(C,w))/.5,0,1),f=e(f,(y>r?-1:1)*o*p,6,v),x>.5&&C<.3?(h=[s(y-S,-.08,.08),s(b+.43,.05,.5)],m=e(m,1,3,v)):m=e(m,0,.25,v),t.set(`a`,[f,u,d,m]),t.set(`b`,[h[0],h[1],g,0]),t.set(`env`,[d,+!!l.on,u,0]),c.dataset.state=p>.15||m>.5?`recoil`:n[u]},level:()=>Math.max(p,m*.6),dispose(){}}},plates:[{name:`blistered`,caption:{almanac:`Drawn aside from the iron, the blister rising where it touched.`,cipher:`Plate I: recoil from iron; contact lesion visible.`},a:[.32,2,1,.9],b:[0,.3,0,0]}]};export{c as scene};