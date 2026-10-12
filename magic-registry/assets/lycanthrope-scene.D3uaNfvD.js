import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t={source:`
float gBest, gNear, gAc, gUp, gKn, gIron;

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
  return normalize(vec3(g * (1.0 - r), 0.25 + 0.75 * r));
}
vec3 shade(vec3 alb, vec3 N, float rough) {
  vec3 L = normalize(vec3(0.12, 0.82, 0.5));
  float wr = max((dot(N, L) + 0.35) / 1.35, 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(48.0, 10.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.0);
  vec3 key = mix(vec3(0.95, 0.88, 0.72), vec3(0.72, 0.8, 0.95), u_env.y);
  return alb * (vec3(0.05, 0.045, 0.04) * (0.5 + 0.5 * N.y) + key * wr) + key * (sp * 0.28 + rim * 0.12);
}

float shake(float i) {
  float t = u_time * 2.0, n = floor(t), f = smoothstep(0.0, 1.0, fract(t));
  return (mix(hash(vec2(i, n)), hash(vec2(i, n + 1.0)), f) - 0.5) * 0.022 * u_a.y;
}

void take(float d, float ac, float up, float kn, float iron) {
  if (d < gBest) {
    gNear = gBest;
    gBest = d;
    gAc = ac;
    gUp = up;
    gKn = kn;
    gIron = iron;
  } else if (d < gNear) {
    gNear = d;
  }
}

void cap(vec2 p, vec2 a, vec2 b, float r, float iron) {
  vec2 ba = b - a;
  float L2 = dot(ba, ba);
  if (L2 < 1e-8) return;
  vec2 pa = p - a;
  float h = clamp(dot(pa, ba) / L2, 0.0, 1.0);
  vec2 n = pa - ba * h;
  float ln = length(n);
  float up = ln > 1e-4 ? n.y / ln : 0.0;
  float ac = dot(n, vec2(-ba.y, ba.x)) / (sqrt(L2) * max(r, 0.002));
  take(ln - r, clamp(ac, -1.0, 1.0), up, min(h, 1.0 - h), iron);
}

void knob(vec2 p, vec2 c, float r) {
  vec2 q = p - c;
  float ln = length(q);
  take(ln - r, clamp(q.x / max(r, 0.002), -1.0, 1.0), ln > 1e-4 ? q.y / ln : 1.0, 0.06, 0.0);
}

void ell(vec2 p, vec2 c, vec2 r, float ang) {
  vec2 q = rot(ang) * (p - c);
  vec2 e = q / r;
  float k = length(e);
  vec2 dir = k > 0.12 ? e / k : vec2(0.0, 1.0);
  vec2 w = rot(-ang) * dir;
  take((k - 1.0) * min(r.x, r.y), clamp(w.x, -1.0, 1.0), w.y, 0.5, 0.0);
}

void rbox(vec2 p, vec2 c, vec2 b) {
  vec2 q = p - c;
  vec2 d = abs(q) - b;
  float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.002;
  take(dist, clamp(q.x / max(b.x, 0.003), -1.0, 1.0), clamp(q.y / max(b.y, 0.003), -1.0, 1.0), 0.4, 0.0);
}

vec2 spineAt(float t, float k) {
  float y = mix(0.85, 0.52, t);
  vec2 man = vec2(0.02 * sin(t * 3.3), y);
  vec2 wolf = vec2(mix(0.16, -0.32, t), mix(0.50, 0.38, t) + 0.022 * sin(t * 3.1416));
  return mix(man, wolf, k);
}

void fingers(vec2 p, vec2 wri, float side, float k) {
  if (max(abs(p.x - wri.x), abs(p.y - wri.y)) > 0.1) return;
  knob(p, wri + vec2(side * 0.005, -0.007), 0.0055);
  knob(p, wri + vec2(-side * 0.004, -0.009), 0.0045);
  knob(p, wri + vec2(side * 0.011, -0.003), 0.004);
  for (int i = 0; i < 4; i++) {
    float f = float(i) - 1.5;
    float sp = f * 0.011;
    vec2 a = wri + vec2(side * sp * 0.35, -0.015);
    vec2 b = a + vec2(side * (sp * 0.22), -0.015);
    vec2 c = b + vec2(side * (sp * 0.28 + 0.005), -0.012);
    vec2 d = c + vec2(side * (sp * 0.16 + 0.008), -0.008);
    vec2 bw = mix(b, wri + vec2(0.014 + f * 0.006, -0.011), k);
    vec2 cw = mix(c, wri + vec2(0.024 + f * 0.007, -0.006), k);
    vec2 dw = mix(d, wri + vec2(0.032 + f * 0.008, -0.002), k);
    cap(p, a, bw, 0.0033, 0.0);
    cap(p, bw, cw, 0.0029, 0.0);
    cap(p, cw, dw, 0.0025, 0.0);
    knob(p, bw, 0.0044);
    knob(p, cw, 0.0038);
  }
}

void toes(vec2 p, vec2 ank, float side, float k) {
  if (max(abs(p.x - ank.x), abs(p.y - ank.y)) > 0.09) return;
  knob(p, ank + vec2(side * 0.008, -0.003), 0.006);
  knob(p, ank + vec2(-side * 0.003, 0.004), 0.005);
  for (int i = 0; i < 5; i++) {
    float f = float(i) - 2.0;
    vec2 toe = mix(ank + vec2(side * (0.012 + f * 0.008), -0.02), ank + vec2(0.02 + f * 0.007, -0.008), k);
    cap(p, ank + vec2(side * f * 0.003, -0.004), toe, 0.0028, 0.0);
  }
}

// A specimen: feet at y 0, the crown at y 1, frontal as a man and muzzled as a wolf.
// Far from the bones the distance stays large and the rest of the jar is left alone.
float skeleton(vec2 p, float k) {
  gBest = 1.0;
  gNear = 1.0;
  gAc = 0.0;
  gUp = 0.5;
  gKn = 0.5;
  gIron = 0.0;
  p += vec2(shake(1.0), shake(2.0));
  float reach = mix(0.24, 0.7, k);
  if (abs(p.x) > reach || p.y < -0.08 || p.y > mix(1.08, 0.74, k)) return 1.0;

  vec2 cran = mix(vec2(0.0, 0.935), vec2(0.22, 0.52), k);
  vec2 cr = mix(vec2(0.052, 0.062), vec2(0.075, 0.048), k);
  vec2 cheek = mix(vec2(0.0, 0.905), cran + vec2(0.035, -0.012), k);
  vec2 chr = mix(vec2(0.05, 0.008), vec2(0.046, 0.014), k);
  float cranD = sdEllipse(p - cran, cr);
  float cheekD = sdEllipse(p - cheek, chr);
  vec2 qn = cheekD < cranD ? (p - cheek) / chr : (p - cran) / cr;
  float sk = length(qn);
  vec2 snA = mix(cran + vec2(0.0, -0.04), cran + vec2(0.04, -0.01), k);
  vec2 snB = mix(cran + vec2(0.0, -0.055), vec2(0.54, 0.45), k);
  float snD = cone(p, snA, snB, mix(0.012, 0.03, k), mix(0.006, 0.014, k));
  float skullD = smin(smin(cranD, cheekD, 0.03), snD, mix(0.01, 0.022, k));
  vec2 crestA = mix(cran + vec2(-0.01, 0.055), vec2(0.08, 0.56), k);
  vec2 crestB = mix(cran + vec2(0.01, 0.058), vec2(0.28, 0.6), k);
  float crest = sdSegment(p, crestA, crestB) - mix(0.004, 0.008, k);
  skullD = smin(skullD, crest, 0.012);
  if (snD < min(cranD, cheekD)) {
    vec2 ba = snB - snA;
    vec2 n = p - snA - ba * clamp(dot(p - snA, ba) / dot(ba, ba), 0.0, 1.0);
    qn = n / max(length(n), 0.001);
    sk = 1.0;
  }
  take(skullD, clamp(qn.x / max(sk, 0.2), -1.0, 1.0), qn.y / max(sk, 0.2), 0.55, 0.0);
  cap(p, mix(vec2(-0.04, 0.938), cran + vec2(-0.02, 0.02), k), mix(vec2(0.04, 0.938), cran + vec2(0.06, 0.028), k), 0.008, 0.0);

  vec2 jA = mix(vec2(-0.018, 0.862), vec2(0.2, 0.47), k);
  vec2 jB = mix(vec2(0.018, 0.862), vec2(0.52, 0.425), k);
  cap(p, jA, jB, mix(0.014, 0.011, k), 0.0);
  cap(p, mix(vec2(-0.03, 0.868), jA, k), mix(vec2(-0.042, 0.91), cran + vec2(-0.02, -0.02), k), 0.005, 0.0);
  cap(p, mix(vec2(0.03, 0.868), jB, k), mix(vec2(0.042, 0.91), cran + vec2(0.0, -0.03), k), 0.005, 0.0);

  vec2 tA = mix(vec2(-0.024, 0.884), vec2(0.26, 0.478), k);
  vec2 tB = mix(vec2(0.024, 0.884), vec2(0.5, 0.442), k);
  if (abs(p.y - mix(tA.y, tB.y, 0.5)) < 0.035) {
    for (int i = 0; i < 6; i++) {
      vec2 c = mix(tA, tB, float(i) / 5.0);
      vec2 tq = p - c;
      vec2 td = abs(tq) - vec2(0.0018, 0.0065);
      take(length(max(td, 0.0)) + min(max(td.x, td.y), 0.0), clamp(tq.x * 40.0, -1.0, 1.0), clamp(tq.y * 20.0, -1.0, 1.0), 0.35, 0.0);
    }
  }

  float yCull = mix(0.016, 0.08, k);
  if (abs(p.x) < mix(0.08, 0.55, k)) {
    for (int i = 0; i < 16; i++) {
      float t = float(i) / 15.0;
      vec2 s = spineAt(t, k);
      if (abs(p.y - s.y) > yCull) continue;
      rbox(p, s, mix(vec2(0.009, 0.005), vec2(0.011, 0.006), k));
    }
  }

  if (abs(p.x) < mix(0.16, 0.4, k) && p.y > mix(0.5, 0.22, k) && p.y < mix(0.9, 0.62, k)) {
    for (int i = 0; i < 10; i++) {
      float rt = float(i) / 9.0;
      float y = mix(0.8, 0.62, rt);
      float st = clamp((0.85 - y) / 0.33, 0.0, 1.0);
      vec2 root = spineAt(st, k);
      if (abs(p.y - root.y) > mix(0.07, 0.16, k)) continue;
      float w = 0.094 * (1.0 - 0.5 * rt);
      float drop = mix(0.007, 0.015, rt);
      float endX = mix(0.016, 0.055, smoothstep(0.15, 1.0, rt));
      for (int s = 0; s < 2; s++) {
        float side = s == 0 ? -1.0 : 1.0;
        vec2 back = mix(root + vec2(side * w * 0.55, 0.006), root + vec2(side * 0.015, -0.01), k);
        vec2 mid = mix(root + vec2(side * w, -0.024 - 0.012 * rt), root + vec2(side * 0.03, -(0.03 + 0.015 * rt)), k);
        vec2 endp = mix(root + vec2(side * endX, -0.05 - 0.02 * rt - drop), root + vec2(side * 0.01, -(0.055 + 0.03 * rt)), k);
        cap(p, root, back, 0.003, 0.0);
        cap(p, back, mid, 0.003, 0.0);
        cap(p, mid, endp, 0.0026, 0.0);
      }
    }
    if (k < 0.8) {
      vec2 sc = mix(vec2(0.0, 0.74), vec2(0.1, 0.44), k);
      rbox(p, sc, mix(vec2(0.006, 0.06), vec2(0.004, 0.02), k));
    }
  }

  vec2 clR0 = mix(vec2(0.012, 0.815), vec2(0.12, 0.5), k);
  vec2 clR1 = mix(vec2(0.1, 0.828), vec2(0.2, 0.47), k);
  vec2 clL0 = mix(vec2(-0.012, 0.815), vec2(0.05, 0.48), k);
  vec2 clL1 = mix(vec2(-0.1, 0.828), vec2(0.02, 0.44), k);
  cap(p, clR0, clR1, 0.0042, 0.0);
  cap(p, clL0, clL1, 0.004, 0.0);
  knob(p, clR1, mix(0.014, 0.012, k));
  knob(p, clL1, mix(0.013, 0.01, k));

  vec2 shR = mix(vec2(0.11, 0.815), vec2(0.16, 0.45), k);
  vec2 elR = mix(vec2(0.125, 0.62), vec2(0.22, 0.26), k);
  vec2 wrR = mix(vec2(0.135, 0.45), vec2(0.16, 0.09), k);
  cap(p, shR, elR, 0.011, 0.0);
  knob(p, shR, 0.017);
  knob(p, elR, 0.015);
  vec2 nR = normalize(vec2(-(wrR - elR).y, (wrR - elR).x) + 1e-4) * 0.016;
  cap(p, elR + nR, wrR + nR, 0.0036, 0.0);
  cap(p, elR - nR, wrR - nR, 0.0026, 0.0);
  fingers(p, wrR, 1.0, k);

  vec2 shL = mix(vec2(-0.11, 0.815), vec2(0.06, 0.43), k);
  vec2 elL = mix(vec2(-0.125, 0.62), vec2(0.1, 0.24), k);
  vec2 wrL = mix(vec2(-0.135, 0.45), vec2(0.07, 0.09), k);
  cap(p, shL, elL, 0.01, 0.0);
  knob(p, shL, 0.016);
  knob(p, elL, 0.014);
  vec2 nL = normalize(vec2(-(wrL - elL).y, (wrL - elL).x) + 1e-4) * 0.016;
  cap(p, elL + nL, wrL + nL, 0.0034, 0.0);
  cap(p, elL - nL, wrL - nL, 0.0025, 0.0);
  fingers(p, wrL, -1.0, k);

  vec2 pel = mix(vec2(0.0, 0.5), vec2(-0.28, 0.39), k);
  if (abs(p.x - pel.x) < mix(0.16, 0.22, k) && abs(p.y - pel.y) < 0.12) {
    ell(p, mix(vec2(0.05, 0.515), pel + vec2(0.04, 0.0), k), mix(vec2(0.062, 0.028), vec2(0.04, 0.028), k), mix(0.45, 0.25, k));
    ell(p, mix(vec2(-0.05, 0.515), pel + vec2(-0.03, -0.01), k), mix(vec2(0.062, 0.028), vec2(0.034, 0.024), k), mix(-0.45, -0.2, k));
    ell(p, mix(vec2(0.034, 0.458), pel + vec2(0.03, -0.02), k), mix(vec2(0.026, 0.014), vec2(0.02, 0.012), k), 0.0);
    ell(p, mix(vec2(-0.034, 0.458), pel + vec2(-0.03, -0.02), k), mix(vec2(0.026, 0.014), vec2(0.02, 0.012), k), 0.0);
    float holes = min(sdCircle(p - mix(vec2(0.034, 0.462), pel + vec2(0.03, -0.018), k), 0.011), sdCircle(p - mix(vec2(-0.034, 0.462), pel + vec2(-0.03, -0.018), k), 0.011));
    gBest = max(gBest, -holes);
    ell(p, mix(vec2(0.0, 0.52), pel + vec2(0.01, 0.025), k), mix(vec2(0.016, 0.028), vec2(0.014, 0.018), k), 0.0);
    float notch = sdEllipse(p - mix(vec2(0.0, 0.45), pel + vec2(0.0, -0.015), k), vec2(0.02, 0.024));
    gBest = max(gBest, -notch);
  }

  vec2 hpR = mix(vec2(0.05, 0.475), vec2(-0.24, 0.36), k);
  vec2 knR = mix(vec2(0.06, 0.255), vec2(-0.12, 0.2), k);
  vec2 anR = mix(vec2(0.058, 0.045), vec2(-0.26, 0.09), k);
  cap(p, hpR, knR, 0.014, 0.0);
  knob(p, hpR, 0.018);
  knob(p, knR, 0.016);
  ell(p, knR + vec2(0.0, -0.012), vec2(0.011, 0.009), 0.0);
  vec2 nFR = normalize(vec2(-(anR - knR).y, (anR - knR).x) + 1e-4) * 0.018;
  cap(p, knR, anR, 0.006, 0.0);
  cap(p, knR + nFR, anR + nFR, 0.0028, 0.0);
  toes(p, anR, 1.0, k);

  vec2 hpL = mix(vec2(-0.05, 0.475), vec2(-0.34, 0.34), k);
  vec2 knL = mix(vec2(-0.06, 0.255), vec2(-0.22, 0.18), k);
  vec2 anL = mix(vec2(-0.058, 0.045), vec2(-0.36, 0.08), k);
  cap(p, hpL, knL, 0.013, 0.0);
  knob(p, hpL, 0.017);
  knob(p, knL, 0.015);
  ell(p, knL + vec2(0.0, -0.01), vec2(0.01, 0.008), 0.0);
  vec2 nFL = normalize(vec2(-(anL - knL).y, (anL - knL).x) + 1e-4) * 0.018;
  cap(p, knL, anL, 0.0055, 0.0);
  cap(p, knL + nFL, anL + nFL, 0.0026, 0.0);
  toes(p, anL, -1.0, k);

  if (k > 0.15) {
    vec2 ta = mix(pel, vec2(-0.34, 0.4), k);
    vec2 tb = mix(ta, vec2(-0.48, 0.32), k);
    vec2 tc = mix(tb, vec2(-0.58, 0.22), k);
    cap(p, ta, tb, mix(0.004, 0.01, k), 0.0);
    cap(p, tb, tc, mix(0.003, 0.006, k), 0.0);
  }

  cap(p, vec2(-0.04, -0.04), vec2(0.04, -0.04), 0.007, 1.0);
  cap(p, vec2(0.0, -0.04), pel, 0.0055, 1.0);

  vec2 e1 = cran + mix(vec2(-0.021, -0.01), vec2(0.04, 0.01), k);
  vec2 e2 = cran + mix(vec2(0.021, -0.01), vec2(-0.015, 0.015), k);
  float sock = sdEllipse(p - e1, mix(vec2(0.016, 0.014), vec2(0.02, 0.015), k));
  if (k < 0.72) sock = min(sock, sdEllipse(p - e2, mix(vec2(0.016, 0.014), vec2(0.007, 0.006), k)));
  vec2 nas = mix(vec2(0.0, 0.898), snB + vec2(-0.02, 0.01), k);
  float nasal = min(sdCircle(p - nas - vec2(-0.006, 0.005), 0.009), sdCircle(p - nas - vec2(0.006, 0.005), 0.009));
  nasal = min(nasal, sdEllipse(p - nas - vec2(0.0, -0.007), vec2(0.005, 0.011)));
  vec2 oR = mix(vec2(0.03, 0.455), pel + vec2(0.03, -0.02), k);
  vec2 oL = mix(vec2(-0.03, 0.455), pel + vec2(-0.02, -0.015), k);
  float obt = min(sdCircle(p - oR, mix(0.014, 0.008, k)), sdCircle(p - oL, mix(0.014, 0.007, k)));
  gBest = max(gBest, -min(sock, min(nasal, obt)));
  return gBest;
}

float cracks(vec2 q, float strain) {
  vec2 at = vec2(0.22, 0.18);
  float d = 1.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.05 + hash(vec2(float(i), 3.0)) * 0.4;
    vec2 dir = vec2(cos(a), sin(a));
    float len = (0.1 + 0.2 * hash(vec2(float(i), 7.0))) * strain;
    d = min(d, sdSegment(q, at, at + dir * len));
  }
  return d;
}

float jar(vec2 q) {
  float dome = min(sdBox(q - vec2(0.0, -0.16), vec2(0.56, 0.5)), sdCircle(q - vec2(0.0, 0.22), 0.56));
  return max(dome, -(q.y + 0.68));
}

vec3 boneLit(vec2 loc) {
  float face = sqrt(max(0.0, 1.0 - gAc * gAc));
  float lit = clamp(0.18 + 1.05 * gUp, 0.04, 1.35) * (0.42 + 0.58 * face);
  vec3 ivory = vec3(0.72, 0.64, 0.5);
  vec3 iron = vec3(0.16, 0.15, 0.14);
  vec3 alb = mix(ivory, iron, clamp(gIron, 0.0, 1.0));
  vec3 bc = alb * (0.22 + 0.95 * lit);
  bc *= 0.58 + 0.42 * smoothstep(0.02, 0.22, gKn);
  if (gNear < 0.006 && gKn < 0.16) bc *= 0.72;
  bc *= 0.9 + 0.12 * noise(loc * 32.0);
  vec3 key = mix(vec3(0.95, 0.9, 0.75), vec3(0.75, 0.82, 0.95), u_env.y);
  bc += key * pow(clamp(face * max(gUp, 0.0), 0.0, 1.0), 3.0) * 0.16 * (1.0 - gIron);
  return bc;
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float k = u_a.x;
  float strain = u_a.y;
  float full = u_env.y;
  vec2 drift = plateDrift(0.35);
  vec3 key = mix(vec3(0.9, 0.84, 0.7), vec3(0.7, 0.78, 0.98), full);

  float boards = noise(vec2(floor(p.x * 2.4 + 3.0), p.y * 1.6));
  float seam = smoothstep(0.06, 0.0, abs(fract(p.x * 2.4) - 0.5) - 0.4);
  vec3 wall = mix(vec3(0.05, 0.03, 0.02), vec3(0.11, 0.065, 0.035), boards);
  wall *= 1.0 - 0.4 * seam;
  vec3 c = shade(wall, normalize(vec3(0.0, 0.05, 1.0)), 0.9);
  float shaft = smoothstep(0.55, 0.02, abs(p.x) - (1.05 - p.y) * 0.2);
  float dust = 0.65 + 0.35 * noise(vec2(p.x * 4.0, p.y * 2.0 - u_time * 0.05));
  c += key * shaft * dust * smoothstep(-0.85, 0.4, p.y) * 0.22;
  c += key * exp(-length(p - vec2(0.0, 1.0)) * 1.6) * (0.12 + 0.2 * full);

  for (int i = 0; i < 3; i++) {
    float f = float(i);
    vec2 ctr = vec2(0.0, 0.78 - f * 0.2) + drift * 0.15;
    float e = sdEllipse(p - ctr, vec2(0.95 + f * 0.2, 0.32));
    float rail = abs(e) - 0.02;
    float arc = fill(rail, px) * step(p.y, ctr.y - 0.02) * step(ctr.y - 0.36, p.y);
    vec3 oak = vec3(0.15, 0.08, 0.04) * (0.72 + 0.4 * noise(vec2(p.x * 3.5, f + p.y * 2.0)));
    c = mix(c, shade(oak, normalize(vec3(0.0, 0.6, 0.7)), 0.72), arc);
  }

  vec2 oc = p - vec2(0.0, 0.98);
  float oculus = sdEllipse(oc, vec2(0.22, 0.07));
  vec3 sky = mix(vec3(0.15, 0.16, 0.18), vec3(0.55, 0.62, 0.72), full);
  c = mix(c, sky, fill(oculus, px));
  float moon = length(oc) - 0.045;
  float phase = clamp(u_env.x, 0.0, 1.0);
  vec3 moonC = vec3(0.8, 0.82, 0.78) * (0.2 + 0.8 * smoothstep(0.04, -0.02, oc.x - mix(0.04, -0.05, phase)));
  c = mix(c, moonC, fill(moon, px) * fill(oculus, px));
  c = mix(c, shade(vec3(0.22, 0.18, 0.14), normalize(vec3(0.0, -0.2, 0.9)), 0.7), stroke(oculus, 0.012, px));

  if (p.y < -0.62) {
    float grain = noise(vec2(p.x * 5.0, p.y * 18.0));
    vec3 deal = mix(vec3(0.18, 0.1, 0.05), vec3(0.28, 0.16, 0.08), grain);
    c = shade(deal, normalize(vec3((grain - 0.5) * 0.3, 0.75, 0.55)), 0.7);
    float sh = sdEllipse(p - vec2(0.0, -0.67), vec2(0.26, 0.04));
    c *= 1.0 - 0.42 * smoothstep(0.05, -0.02, sh);
  }

  vec2 q = p - vec2(0.0, -0.04) - plateDrift(0.55);
  float dome = jar(q);
  float inside = fill(dome, px);
  c = mix(c, c * 0.45 + vec3(0.03, 0.045, 0.035), inside * 0.85);
  c = gloom(c, p, vec2(0.0, -0.74), vec2(0.5, 0.06));

  vec2 loc = q + vec2(0.0, 0.6);
  float d = skeleton(loc, k);
  float breaking = 1.0 - abs(k - 0.5) * 2.0;
  float chip = breaking * smoothstep(0.58, 0.8, noise(loc * 18.0));
  if (d < 0.03) c = mix(c, boneLit(loc), fill(d, px) * (1.0 - chip * 0.9) * inside);

  float lip = sdEllipse(q - vec2(0.0, -0.66), vec2(0.58, 0.045));
  float kn = sdCircle(q - vec2(0.0, 0.8), 0.035);
  vec3 brass = vec3(0.45, 0.3, 0.1);
  c = mix(c, shade(brass * (0.8 + 0.3 * noise(q * 20.0)), swell(lip, 0.03), 0.35), fill(lip, px));
  c = mix(c, shade(brass, swell(kn, 0.02), 0.3), fill(kn, px));
  c += vec3(0.75, 0.85, 0.9) * stroke(dome, 0.0035, px) * 0.55;
  float gleam = fill(sdEllipse(q - vec2(-0.32, 0.12), vec2(0.03, 0.22)), 0.015);
  c += vec3(0.8, 0.88, 0.95) * gleam * inside * 0.16;
  float crazed = max(strain, breaking * 0.65);
  if (crazed > 0.03) c += vec3(0.8, 0.88, 0.9) * stroke(cracks(q, crazed), 0.0015, px) * inside * 0.75;

  c += key * 0.05 * full * shaft;
  float passes = 0.84;
  if (lensIn(p) > 0.0) {
    float other = skeleton(loc, 1.0 - step(0.5, k));
    passes = 0.8 - 0.68 * fill(other, px * 2.0) - 0.12 * fill(d, px);
  }
  c = fluoroscope(c, p, passes);
  return c;
}
`,start({stage:t,root:n,env:r}){let i=+!!r.on,a=0;return{frame(o,s,c){let l=Math.min(1,Math.max(0,(c.pace-1.2)/2.8));a=e(a,l,l>a?10:2,s);let u=r.on||a>.15;i=e(i,+!!u,u?3:.6,s),t.set(`a`,[i,a,0,0]),t.set(`env`,[r.level,+!!r.on,0,0]),n.dataset.state=i>.5?`wolf`:`man`},level:()=>Math.max(a,i*.6),dispose(){}}},plates:[{name:`man`,caption:{almanac:`The man, with the wolf folded in him.`,cipher:`Plate I: base form.`},a:[0,0,0,0]},{name:`wolf`,caption:{almanac:`The wolf, with the man still in it.`,cipher:`Plate II: dense form.`},a:[1,0,0,0]}]};export{t as scene};