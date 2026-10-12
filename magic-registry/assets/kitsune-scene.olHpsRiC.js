import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
const float GROUND = -0.36;
const vec2 BASE = vec2(0.40, -0.35);
const vec3 FOX = vec3(0.80, 0.38, 0.15);
const vec3 SNOW = vec3(0.93, 0.95, 0.97);
const vec3 FIRE = vec3(0.24, 0.44, 0.77);
const vec3 FOG = vec3(0.6, 0.63, 0.69);
const vec2 ORB = vec2(0.05, -0.40);
float blue;

float glowAt(vec2 p, vec2 at, float size) { vec2 d = p - at; return size * size / (dot(d, d) + size * size); }
float sdTri(vec2 p, vec2 a, vec2 b, vec2 c) {
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                   vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                   vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}

// One tail, i, in its own frame: along it (u) and across it (v). Returns the distance to its
// edge, how far along it the point lies (0 at the root, 1 at the tip), and where across it
// (-1 to 1).
vec3 tail(vec2 p, float i, float shown) {
  float out_ = clamp(shown - i, 0.0, 1.0);
  float ang = mix(0.12, 0.12 + i * 0.3, out_);
  vec2 q = rot(ang) * (p - BASE);
  float len = mix(0.42, 0.52, out_ * step(0.5, i));
  float u = clamp(q.x / len, 0.0, 1.0);
  float bend = 0.06 * sin(u * PI) * (1.0 - 0.3 * out_);
  float w = 0.012 + 0.05 * pow(sin(u * PI * 0.9 + 0.15), 0.8);
  float d = max(abs(q.y - bend) - w, -q.x);
  d = max(d, q.x - len);
  return vec3(d, u, (q.y - bend) / w);
}

// The fox's body, head and ears, as one distance; its chest, eyes and ear-tips apart.
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float forelegs(vec2 p) {
  float a = sdSegment(p, vec2(0.215, -0.17), vec2(0.205, -0.37)) - 0.017 + 0.004 * smoothstep(-0.2, -0.36, p.y);
  float b = sdSegment(p, vec2(0.255, -0.18), vec2(0.25, -0.375)) - 0.016 + 0.004 * smoothstep(-0.2, -0.36, p.y);
  float paws = min(sdEllipse(p - vec2(0.198, -0.372), vec2(0.026, 0.012)), sdEllipse(p - vec2(0.243, -0.377), vec2(0.024, 0.011)));
  return min(min(a, b), paws);
}
float body(vec2 p) {
  float haunch = sdEllipse(p - vec2(0.335, -0.29), vec2(0.115, 0.09));
  float trunk = sdEllipse(rot(-0.42) * (p - vec2(0.28, -0.17)), vec2(0.095, 0.17));
  float neck = sdEllipse(rot(-0.5) * (p - vec2(0.215, -0.02)), vec2(0.05, 0.09));
  float head = sdEllipse(p - vec2(0.185, 0.05), vec2(0.068, 0.058));
  float snout = sdEllipse(rot(0.22) * (p - vec2(0.115, 0.03)), vec2(0.062, 0.022));
  float d = smin(smin(haunch, trunk, 0.05), neck, 0.04);
  d = smin(d, head, 0.035);
  d = smin(d, snout, 0.02);
  float ears = min(sdTri(p, vec2(0.14, 0.09), vec2(0.155, 0.19), vec2(0.185, 0.1)),
                   sdTri(p, vec2(0.195, 0.1), vec2(0.235, 0.19), vec2(0.245, 0.07)));
  return min(smin(d, forelegs(p), 0.02), ears);
}

// What the rays find: the fox's bones; each tail a fine branching of light, like frost on a
// pane, the oldest the most branched; and the pearl bright, something in it moving like breath.
float xray(vec2 p, float shown) {
  float passes = 0.86;
  float b = body(p);
  passes = mix(passes, 0.55, fill(b, 0.004));
  float spine = stroke(sdSegment(p, vec2(0.21, -0.03), vec2(0.34, -0.33)), 0.009, 0.004);
  float skull = stroke(sdEllipse(p - vec2(0.17, 0.035), vec2(0.06, 0.045)), 0.008, 0.004);
  passes = mix(passes, 0.22, max(spine, skull) * fill(b, 0.004));
  for (int k = 0; k < 9; k++) {
    float i = float(k);
    if (i >= ceil(shown)) break;
    vec3 t = tail(p, i, shown);
    float inside = fill(t.x, 0.004);
    float branch = 1.0 - abs(noise(rot(i) * p * (14.0 + i) + i * 7.0) * 2.0 - 1.0);
    float age = 1.0 - i / 9.0;
    passes = mix(passes, 0.42, inside);
    passes = mix(passes, 1.15, inside * smoothstep(0.93 - 0.08 * age, 0.97, branch) * t.y);
  }
  vec2 o = p - ORB;
  float breath = 0.5 + 0.5 * sin(u_time * 1.4);
  float swirl = noise(rot(u_time * 0.3) * o * 60.0 + vec2(0.0, u_time * 0.4));
  float pearl = 0.85 + 0.25 * breath + 0.15 * (swirl - 0.5) + 0.2 * (1.0 - length(o) / 0.035);
  return mix(passes, pearl, fill(sdCircle(o, 0.035), 0.004));
}

// The light of a snowy dusk: a grey dome over everything, brighter from above and a little from
// the left, and the blue of the fox's fires where they reach.
vec3 shade(vec3 alb, vec3 N, float rough) {
  float dome = 0.55 + 0.45 * N.y;
  float key = max(dot(N, normalize(vec3(-0.35, 0.75, 0.55))), 0.0);
  float sp = pow(max(dot(N, normalize(vec3(-0.2, 0.5, 1.0))), 0.0), mix(60.0, 8.0, rough)) * (1.0 - rough);
  return alb * (vec3(0.44, 0.47, 0.55) * dome + vec3(0.38, 0.38, 0.4) * key + FIRE * blue * 1.2) + vec3(0.7, 0.75, 0.85) * sp * 0.4;
}
vec2 boxGrad(vec2 p, vec2 b) {
  vec2 e = vec2(0.002, 0.0);
  return vec2(sdBox(p + e.xy, b) - sdBox(p - e.xy, b), sdBox(p + e.yx, b) - sdBox(p - e.yx, b)) / 0.004;
}
// A round timber seen side on: t runs -1 to 1 across its width.
vec3 round_(float t) { t = clamp(t, -1.0, 1.0); return normalize(vec3(t, 0.0, sqrt(1.0 - t * t) + 0.05)); }

vec3 scene(vec2 p) {
  float shown = max(u_a.x, 1.0);
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;

  // The fires' light, gathered once: the star-ball's and one for each tail beyond the first.
  float lit = 0.4 + 0.6 * (shown - 1.0) / 8.0;
  blue = glowAt(p, ORB, 0.16) * 0.3 * lit;
  for (int k = 1; k < 9; k++) {
    float i = float(k);
    float on = clamp(shown - i, 0.0, 1.0);
    if (on <= 0.0) break;
    vec2 at = vec2(-1.15 + 0.27 * i + 0.08 * sin(i * 2.7), -0.47 - 0.05 * sin(i * 1.9));
    blue += glowAt(p, at, 0.1) * 0.16 * on;
  }

  // The sky of a snowfall at dusk: slate overhead, paling into the snow-haze at the trees.
  vec3 c = mix(vec3(0.66, 0.68, 0.72), vec3(0.34, 0.38, 0.46), smoothstep(-0.2, 1.0, p.y));
  c *= 0.94 + 0.08 * noise(p * vec2(2.0, 5.0) + vec2(t * 0.02, 0.0));

  // A far wood of cedars, nearly gone into the snow-haze.
  float ftop = GROUND;
  for (int k = 0; k < 2; k++) {
    float fx = p.x / (0.07 + 0.035 * float(k)) + 3.0 + 0.37 * float(k);
    float fid = floor(fx);
    float fu = fract(fx) - 0.4 - 0.2 * hash(vec2(fid, 4.0 + float(k)));
    float fh = (0.12 + 0.2 * hash(vec2(fid, 1.0 + float(k)))) * (1.0 - 0.3 * float(k));
    ftop = max(ftop, GROUND + fh * (1.0 - 2.4 * abs(fu)) + 0.015 * (noise(vec2(p.x * 90.0, p.y * 40.0 + fid)) - 0.5));
  }
  c = mix(c, mix(c, vec3(0.3, 0.36, 0.38), 0.45 + 0.15 * noise(p * vec2(30.0, 8.0))), smoothstep(0.004, -0.004, p.y - ftop) * step(GROUND - 0.05, p.y));

  // Cedars standing into the haze: tall trunks, their boughs in drooping tiers, snow lying in
  // clumps along them, the far ones gone into the fog.
  for (int k = 0; k < 7; k++) {
    float i = float(k);
    float x0 = -1.5 + i * 0.47 + 0.12 * sin(i * 4.1);
    float far = 0.55 + 0.45 * hash(vec2(i, 3.0));
    float h = 0.6 + 0.5 * hash(vec2(i, 7.0));
    vec2 q = p - vec2(x0, GROUND) - plateDrift(0.35 + 0.4 * far);
    if (abs(q.x) > 0.3 || q.y > h + 0.05) continue;
    q.x += 0.006 * sin(t * 0.25 + i) * q.y;
    float trunk = sdBox(q - vec2(0.0, h * 0.3), vec2(0.01 + 0.01 * (1.0 - q.y / h), h * 0.3));
    vec3 bark = vec3(0.16, 0.1, 0.07) * (0.7 + 0.5 * noise(vec2(q.x * 200.0, q.y * 8.0)));
    vec3 tc = shade(bark, round_(q.x / 0.018), 0.9);
    float tm = fill(trunk, px);
    float droop = 0.9 * (q.x / 0.17) * (q.x / 0.17);
    float y = (q.y - h * 0.18) / (h * 0.82) + droop * 0.06;
    float tiers = 7.0 + 2.0 * hash(vec2(i, 2.0));
    float step_ = fract(y * tiers);
    float reach = 0.55 + 0.45 * hash(vec2(floor(y * tiers) + i * 13.0, sign(q.x)));
    float spread = 0.17 * far * pow(clamp(1.0 - y, 0.0, 1.0), 0.85) * (0.45 + 0.55 * pow(step_, 1.4)) * reach;
    spread *= 0.75 + 0.5 * noise(vec2(q.y * 22.0, i * 5.0 + sign(q.x) * 3.0));
    float bough = max(abs(q.x) - spread, max(-y, y - 1.0)) + 0.03 * far * (noise(q * vec2(40.0, 90.0) + i) - 0.5);
    float cap = smoothstep(0.78, 0.95, step_) * smoothstep(0.45, 0.7, noise(q * vec2(55.0, 20.0) + i)) * smoothstep(0.2, 0.6, abs(q.x) / max(spread, 0.01));
    cap = max(cap, smoothstep(0.92, 1.0, y));
    vec3 needles = vec3(0.06, 0.11, 0.09) * (0.55 + 0.7 * noise(q * vec2(60.0, 25.0)));
    vec3 bc = shade(needles, normalize(vec3(sign(q.x) * 0.4 * step_, 0.2 + 0.8 * step_, 1.0)), 0.95);
    bc = mix(bc, shade(SNOW * 0.95, vec3(0.0, 0.85, 0.5), 0.8), cap);
    vec3 tree = mix(tc, bc, fill(bough, px));
    float mask = max(tm, fill(bough, px)) * smoothstep(-0.02, 0.0, q.y);
    c = mix(c, veil(tree, FOG, far * 0.55 + 0.1), mask);
  }

  // The gate: lacquered pillars standing in black sleeves, the tie-beam through them, the black
  // top beam lifting at its ends, snow along every upper edge.
  vec2 g = p - vec2(-0.62, 0.0);
  vec3 vermilion = vec3(0.78, 0.2, 0.13) * (0.85 + 0.15 * noise(g * vec2(4.0, 40.0)));
  vermilion = mix(vermilion, vec3(0.5, 0.3, 0.25), 0.3 * smoothstep(0.6, 0.85, noise(g * vec2(8.0, 3.0))));
  for (int s = 0; s < 2; s++) {
    float sx = float(s) * 0.54 - 0.27;
    vec2 pq = g - vec2(sx, 0.12);
    float pillar = sdBox(pq, vec2(0.03, 0.48));
    vec3 pc = shade(vermilion, round_(pq.x / 0.03), 0.35);
    pc = mix(pc, shade(vec3(0.05), round_(pq.x / 0.034), 0.3), step(pq.y, -0.42));
    c = mix(c, pc, fill(pillar, px));
  }
  vec2 tq = g - vec2(0.0, 0.42);
  float tie = sdBox(tq, vec2(0.36, 0.022));
  c = mix(c, shade(vermilion * 0.9, normalize(vec3(0.0, clamp(tq.y / 0.022, -1.0, 1.0), 1.0)), 0.4), fill(tie, px));
  c = mix(c, shade(SNOW, vec3(0.0, 0.9, 0.4), 0.8), fill(sdBox(tq - vec2(0.0, 0.026), vec2(0.35, 0.008)) - 0.003 * noise(g * 60.0), px));
  float strut = sdBox(g - vec2(0.0, 0.47), vec2(0.02, 0.03));
  c = mix(c, shade(vermilion * 0.85, vec3(0.0, 0.0, 1.0), 0.4), fill(strut, px));
  float plank = sdBox(g - vec2(0.0, 0.51), vec2(0.40, 0.018));
  c = mix(c, shade(vermilion, normalize(vec3(0.0, clamp((g.y - 0.51) / 0.018, -1.0, 1.0), 1.0)), 0.4), fill(plank, px));
  float lift = 0.05 * pow(abs(g.x) / 0.46, 3.0);
  vec2 kq = vec2(g.x, g.y - 0.55 - lift);
  float top = sdBox(kq, vec2(0.46, 0.028));
  c = mix(c, shade(vec3(0.05, 0.045, 0.045), normalize(vec3(0.0, clamp(kq.y / 0.028, -1.0, 1.0), 1.0)), 0.25), fill(top, px));
  float snowTop = sdBox(kq - vec2(0.0, 0.034), vec2(0.44, 0.01)) - 0.004 * noise(g * 50.0);
  c = mix(c, shade(SNOW, vec3(0.0, 0.9, 0.4), 0.8), fill(snowTop, px));

  // The snow on the ground, drifted, blue in its hollows, glinting; the fox's track from the gate.
  float edge = GROUND + 0.02 * sin(p.x * 3.0);
  if (p.y < edge) {
    vec2 sq = p * vec2(3.0, 9.0);
    float d0 = noise(sq);
    vec2 dg = vec2(noise(sq + vec2(0.2, 0.0)) - d0, noise(sq + vec2(0.0, 0.2)) - d0) * 3.2;
    vec3 sn = normalize(vec3(-dg.x, 1.0 - dg.y, 0.6));
    vec3 snow = shade(SNOW * 0.9, sn, 0.85);
    snow = mix(snow, snow * vec3(0.8, 0.88, 1.04), smoothstep(0.55, 0.3, d0));
    snow *= mix(0.88, 1.0, smoothstep(-1.0, GROUND, p.y));
    snow += vec3(1.0) * 0.5 * step(0.985, hash(floor(p * 260.0))) * step(0.5, noise(p * 30.0 + t * 0.3));
    vec2 tr = p - vec2(-0.62, -0.48);
    float along = clamp(tr.x / 0.62, 0.0, 1.0);
    vec2 path = vec2(tr.x, tr.y - 0.06 * sin(along * 3.14) - 0.03);
    vec2 cellp = vec2(fract(path.x * 22.0) - 0.5, path.y * 22.0 + 0.35 * sign(fract(path.x * 11.0) - 0.5));
    float print = fill(length(cellp * vec2(1.0, 1.4)) - 0.22, 0.12) * step(0.0, tr.x) * step(tr.x, 0.55);
    snow = mix(snow, snow * vec3(0.7, 0.76, 0.9), print * 0.7);
    c = mix(c, snow, smoothstep(px, -px, p.y - edge));
    c = mix(c, c * 0.88, smoothstep(0.0, -0.03, p.y - edge) * smoothstep(-0.06, -0.03, p.y - edge));
  }
  c = gloom(c, p, vec2(-0.89, GROUND - 0.12), vec2(0.06, 0.012));
  c = gloom(c, p, vec2(-0.35, GROUND - 0.12), vec2(0.06, 0.012));

  // The tails, fanned behind the fox: thick russet fur, round in the hand, white at the tips,
  // each one lit by the fires it brings.
  for (int k = 8; k >= 0; k--) {
    float i = float(k);
    if (i >= ceil(shown)) continue;
    float out_ = clamp(shown - i, 0.0, 1.0);
    vec3 tl = tail(p, i, shown);
    float across = clamp(tl.z, -1.0, 1.0);
    vec3 tn = normalize(vec3(rot(-mix(0.12, 0.12 + i * 0.3, out_)) * vec2(0.0, across), sqrt(1.0 - across * across) + 0.1));
    float fur = 0.75 + 0.35 * noise(vec2(tl.y * 40.0 + across * 3.0, across * 12.0 + i * 3.0));
    vec3 col = mix(FOX * 0.75, FOX * 1.05, tl.y) * fur;
    col = mix(col, SNOW, smoothstep(0.78, 0.86, tl.y + 0.03 * noise(vec2(across * 9.0, i))));
    vec3 tc = shade(col, tn, 0.95);
    float seen = i == 0.0 ? 1.0 : out_;
    float soft = 1.0 - smoothstep(-px - 0.006, px, tl.x + 0.006 * (noise(vec2(tl.y * 80.0, i)) - 0.5));
    c = mix(c, tc, soft * seen);
  }

  // The fox, sitting, its head turned toward the gate: its coat shaded round, the fur lying
  // along it, the white of its chest, the black of its socks and ear-tips.
  float b = body(p);
  c = gloom(c, p, vec2(0.2, -0.36), vec2(0.24, 0.04));
  if (b < 0.02) {
    vec2 grad = normalize(vec2(dFdx(b), dFdy(b)) + 1e-6);
    float rim = clamp(-b / 0.05, 0.0, 1.0);
    vec3 bn = normalize(vec3(grad * (1.0 - rim), 0.35 + rim));
    float hair = noise(rot(0.9) * p * vec2(30.0, 160.0));
    vec3 coat = FOX * (0.8 + 0.35 * hair);
    float chest = fill(sdEllipse(p - vec2(0.205, -0.10), vec2(0.045, 0.11)), 0.02)
                + fill(sdEllipse(rot(0.22) * (p - vec2(0.12, 0.012)), vec2(0.05, 0.012)), 0.008);
    coat = mix(coat, SNOW * (0.9 + 0.1 * hair), clamp(chest, 0.0, 1.0));
    float socks = smoothstep(-0.27, -0.33, p.y) * fill(forelegs(p), 0.006);
    coat = mix(coat, vec3(0.1, 0.075, 0.065), socks);
    float tips = smoothstep(0.15, 0.175, p.y) * step(p.x, 0.25);
    coat = mix(coat, vec3(0.1, 0.075, 0.065), tips);
    vec3 fox = shade(coat, bn, 0.9);
    float soft = 1.0 - smoothstep(-px - 0.004, px, b + 0.004 * (hair - 0.5));
    c = mix(c, fox, soft);
    c = mix(c, vec3(0.06), fill(sdCircle(p - vec2(0.047, 0.022), 0.009), px));
    c += vec3(0.5) * fill(sdCircle(p - vec2(0.044, 0.026), 0.003), px);
    // Its eye: a slant of amber, opening, wet with a point of the dusk in it.
    vec2 ey = rot(-0.35) * (p - vec2(0.15, 0.06));
    float open = 1.0 - u_a.z;
    float eye = sdEllipse(ey, vec2(0.016, max(0.0015, 0.007 * open)));
    c = mix(c, mix(vec3(0.15, 0.08, 0.05), vec3(0.95, 0.66, 0.18), open), fill(eye, px * 0.7));
    c = mix(c, vec3(0.05), fill(sdEllipse(ey, vec2(0.0025, 0.006 * open)), px * 0.5) * open);
    c += vec3(0.9) * fill(sdCircle(ey - vec2(-0.006, 0.002), 0.0018), px) * open;
  }

  // The star-ball at its feet: a pearl of glass, its flame of light inside, its blue on the snow.
  vec2 o = p - ORB;
  float ball = sdCircle(o, 0.035);
  vec2 oq = o / 0.035;
  vec3 on_ = normalize(vec3(oq, sqrt(max(1.0 - dot(oq, oq), 0.0))));
  vec3 pearl = mix(vec3(0.75, 0.82, 0.95), vec3(0.95, 0.97, 1.0), on_.z) * (0.7 + 0.3 * lit);
  pearl += FIRE * 0.4 * (1.0 - on_.z) + vec3(1.0) * 0.6 * pow(max(dot(on_, normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 40.0);
  c = gloom(c, p, ORB - vec2(0.0, 0.035), vec2(0.04, 0.008));
  c = mix(c, pearl, fill(ball, px));
  float flame = sdEllipse(vec2(o.x + 0.012 * sin(o.y * 40.0 + t * 2.0), o.y - 0.05), vec2(0.012, 0.03));
  c = mix(c, vec3(0.85, 0.92, 1.0), fill(flame, px * 2.0) * 0.9);
  c += FIRE * glowAt(p, ORB + vec2(0.0, 0.02), 0.07) * 0.3 * lit;

  // Its fires in the snow, one for each tail beyond the first.
  for (int k = 1; k < 9; k++) {
    float i = float(k);
    float on = clamp(shown - i, 0.0, 1.0);
    if (on <= 0.0) break;
    vec2 at = vec2(-1.15 + 0.27 * i + 0.08 * sin(i * 2.7), -0.47 - 0.05 * sin(i * 1.9));
    at.y += 0.012 * sin(t * 1.3 + i);
    vec2 d = p - at;
    float tongue = sdEllipse(vec2(d.x + 0.004 * sin(d.y * 60.0 + t * 3.0 + i), d.y - 0.012), vec2(0.008, 0.02));
    c = mix(c, vec3(0.62, 0.78, 1.0), fill(tongue, px * 2.0) * on);
    c = mix(c, vec3(0.92, 0.96, 1.0), fill(tongue + 0.006, px * 2.0) * on);
    c = mix(c, FIRE, glowAt(p, at, 0.035) * 0.35 * on);
  }

  // Snow falling, nearer flakes larger, softer and quicker.
  for (int k = 0; k < 3; k++) {
    float l = float(k);
    float scale = 7.0 - l * 2.0;
    vec2 q = p * scale + vec2(0.3 * sin(t * 0.4 + l), t * (0.35 + 0.25 * l));
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5 - (vec2(hash(id), hash(id + 5.0)) - 0.5) * 0.6;
    float flake = (0.004 + 0.003 * l) * scale;
    c = mix(c, vec3(1.0), fill(length(f) - flake, (0.004 + 0.006 * l) * scale) * step(0.55, hash(id + 11.0 + l)) * (0.65 + 0.12 * l));
  }

  c *= 1.0 - 0.15 * dot(p * 0.6, p * 0.6);
  if (lensIn(p) > 0.0) c = fluoroscope(c, p, xray(p, shown));
  return c;
}
`,n=1.2,r=.15,i={source:t,start({stage:t,root:i,env:a}){let o=Math.max(1,Math.min(9,Math.round(a.level*9))),s=1,c=1;return{frame(l,u,d){c=e(c,0,1.6,u);let f=d.speed>r?1:Math.min(o,1+Math.floor(d.idle/n));s=e(s,f,f<s?7:3,u),t.set(`a`,[s,o,c,0]),t.set(`env`,[o/9,+!!a.on,0,0]),i.dataset.state=s>=1.5?`unfurled`:`one-tail`,i.dataset.tails=String(Math.round(s))},level:()=>(s-1)/8,dispose(){delete i.dataset.tails}}},plates:[{name:`one-tail`,caption:{almanac:`One tail, as the fox is first seen.`,cipher:`Plate I: single tail; at rest.`},a:[1,2,0,0]},{name:`unfurled`,caption:{almanac:`Nine tails, to a reader who has come back and kept still.`,cipher:`Plate II: nine tails; fully unfurled.`},a:[9,9,0,0]}]};export{i as scene};