import{r as e}from"./life.CiMj1Ee-.js";import{t}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var n=1,r={fruiting:6,else:9},i=.6;function a(t){let a=document.body,o=0,s=!1,c=0,l=performance.now(),u=l,d=scrollY,f=``,p=e(e=>{let p=Math.min(.25,Math.max(.001,(e-l)/1e3));l=e;let m=Math.abs(scrollY-d)/Math.max(1,innerHeight);d=scrollY,c+=(m/p-c)*Math.min(1,p*8),m>0&&(u=e),s=c>i,s?o=Math.max(0,o-p*2.5):(e-u)/1e3>n&&(o=Math.min(1,o+p/(t?r.fruiting:r.else)));let h=o.toFixed(2);h!==f&&a.style.setProperty(`--mycelium`,f=h),a.toggleAttribute(`data-torn`,s)},15);return{get value(){return o},get torn(){return s},stop(){p(),a.style.removeProperty(`--mycelium`),a.removeAttribute(`data-torn`)}}}var o=`
const float SURFACE = 0.43;
const vec2 HEART = vec2(0.06, -0.22);
const vec3 BONE = vec3(0.76, 0.72, 0.59);
const vec3 BRASS = vec3(0.56, 0.41, 0.17);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
vec3 shade(vec3 alb, vec3 N, vec2 p, float rough) {
  vec3 key = normalize(vec3(-0.6, 0.75, 0.5));
  vec3 H = normalize(key + vec3(0.0, 0.0, 1.0));
  float wr = max((dot(N, key) + 0.3) / 1.3, 0.0);
  float sky = 0.45 + 0.55 * max(N.y, 0.0);
  float sp = pow(max(dot(N, H), 0.0), mix(55.0, 8.0, rough)) * (1.0 - rough);
  float depth = clamp((SURFACE - p.y) / 1.5, 0.0, 1.0);
  return alb * (vec3(0.08, 0.10, 0.11) * sky + vec3(1.0, 0.72, 0.42) * wr * mix(1.25, 0.38, depth))
       + vec3(1.0, 0.78, 0.5) * sp * mix(1.0, 0.25, depth);
}
float surfaceY(float x) {
  return SURFACE + 0.025 * (noise(vec2(x * 3.4, 1.2)) - 0.5) + 0.012 * (noise(vec2(x * 12.0, 4.3)) - 0.5);
}

// The growing body is already humanoid while curled, then lengthens into a broad, sinewy Orc.
float orcShape(vec2 p, float up) {
  vec2 at = vec2(HEART.x, mix(HEART.y, SURFACE, up));
  vec2 q = p - at;
  float trunk = sdEllipse(rot(mix(0.28, 0.08, up)) * (q - vec2(0.0, mix(-0.015, 0.0, up))), mix(vec2(0.16, 0.18), vec2(0.19, 0.29), up));
  float shoulder = sdEllipse(q - vec2(-0.015, mix(0.09, 0.15, up)), mix(vec2(0.18, 0.085), vec2(0.27, 0.10), up));
  vec2 headAt = mix(vec2(-0.085, 0.16), vec2(-0.06, 0.36), up);
  float head = sdEllipse(q - headAt, mix(vec2(0.08, 0.07), vec2(0.085, 0.095), up));
  float jaw = sdEllipse(q - headAt - vec2(-0.035, -0.055), vec2(0.075, 0.043));
  float ear = cone(q, headAt + vec2(0.025, 0.035), headAt + vec2(0.105, 0.07), 0.025, 0.002);
  ear = min(ear, cone(q, headAt + vec2(-0.025, 0.035), headAt + vec2(-0.105, 0.07), 0.025, 0.002));
  float d = smin(trunk, shoulder, 0.055);
  d = smin(d, head, 0.035);
  d = smin(d, jaw, 0.025);
  d = min(d, ear);
  vec2 le = mix(vec2(-0.17, -0.03), vec2(-0.26, -0.12), up);
  vec2 lh = mix(vec2(-0.06, -0.17), vec2(-0.31, -0.31), up);
  vec2 re = mix(vec2(0.15, -0.09), vec2(0.25, -0.10), up);
  vec2 rh = mix(vec2(0.06, -0.18), vec2(0.30, -0.30), up);
  d = smin(d, cone(q, vec2(-0.15, 0.10), le, 0.065, 0.045), 0.035);
  d = smin(d, cone(q, le, lh, 0.045, 0.028), 0.025);
  d = smin(d, cone(q, vec2(0.15, 0.10), re, 0.065, 0.045), 0.035);
  d = smin(d, cone(q, re, rh, 0.045, 0.028), 0.025);
  d = smin(d, sdEllipse(q - lh, vec2(0.052, 0.03)), 0.015);
  d = smin(d, sdEllipse(q - rh, vec2(0.052, 0.03)), 0.015);
  // Bent legs remain tucked into the root ball until the body stands clear.
  vec2 lk = mix(vec2(-0.11, -0.10), vec2(-0.10, -0.29), up);
  vec2 lf = mix(vec2(-0.17, -0.16), vec2(-0.13, -0.43), up);
  vec2 rk = mix(vec2(0.11, -0.11), vec2(0.11, -0.29), up);
  vec2 rf = mix(vec2(0.16, -0.17), vec2(0.15, -0.43), up);
  d = smin(d, cone(q, vec2(-0.07, -0.13), lk, 0.072, 0.05), 0.035);
  d = smin(d, cone(q, lk, lf, 0.05, 0.035), 0.025);
  d = smin(d, cone(q, vec2(0.07, -0.13), rk, 0.072, 0.05), 0.035);
  d = smin(d, cone(q, rk, rf, 0.05, 0.035), 0.025);
  // Buried, the same anatomy is folded on its side like a sleeper around drawn-up knees.
  vec2 cq = (p - HEART) / 0.75;
  float curl = sdEllipse(rot(-0.3) * cq, vec2(0.26, 0.18));
  curl = smin(curl, sdCircle(cq - vec2(0.10, 0.10), 0.14), 0.05);
  curl = smin(curl, sdCircle(cq - vec2(-0.20, -0.02), 0.10), 0.045);
  curl = smin(curl, sdEllipse(cq - vec2(-0.08, -0.15), vec2(0.12, 0.07)), 0.04);
  curl = smin(curl, sdEllipse(cq - vec2(0.10, -0.18), vec2(0.07, 0.035)), 0.025);
  curl = smin(curl, cone(cq, vec2(-0.07, 0.05), vec2(-0.15, -0.13), 0.05, 0.035), 0.035);
  float curlEar = cone(cq, vec2(-0.15, 0.04), vec2(-0.06, 0.10), 0.025, 0.002);
  curl = min(curl, curlEar);
  curl *= 0.75;
  return mix(curl, d, up) + 0.007 * (noise(q * vec2(35.0, 21.0)) - 0.5);
}

// Survey letters cut into narrow brass slips: O litter, A loam, B clay, C chalk.
float letter(vec2 q, float k) {
  if (k < 0.5) return abs(sdEllipse(q, vec2(0.017, 0.024)));
  if (k < 1.5) {
    float a = min(sdSegment(q, vec2(-0.018, -0.024), vec2(0.0, 0.025)), sdSegment(q, vec2(0.018, -0.024), vec2(0.0, 0.025)));
    return min(a, sdSegment(q, vec2(-0.011, -0.006), vec2(0.011, -0.006)));
  }
  if (k < 2.5) {
    float stem = sdSegment(q, vec2(-0.014, -0.025), vec2(-0.014, 0.025));
    float lobes = min(abs(length(q - vec2(-0.001, 0.013)) - 0.013), abs(length(q - vec2(-0.001, -0.013)) - 0.013));
    return min(stem, max(lobes, -q.x - 0.014));
  }
  float arc = abs(length(q * vec2(1.25, 1.0)) - 0.025);
  return max(arc, -q.x - 0.005);
}
vec3 labelSlip(vec3 c, vec2 p, vec2 at, float k, float px) {
  vec2 q = p - at;
  float slip = sdBox(q, vec2(0.047, 0.032)) - 0.003;
  c = gloom(c, p, at - vec2(0.0, 0.018), vec2(0.06, 0.018));
  vec3 metal = shade(BRASS * 1.45 * (0.82 + 0.16 * noise(q * 90.0)), vec3(0.0, 0.2, 0.98), p, 0.24);
  c = mix(c, metal * 0.45, fill(slip - 0.006, px));
  c = mix(c, metal, fill(slip, px));
  c = mix(c, vec3(0.92, 0.7, 0.3), stroke(slip + 0.005, 0.0018, px));
  c = mix(c, vec3(0.08, 0.055, 0.035), stroke(letter(q, k), 0.003, px) * step(slip, 0.0));
  float rivet = fill(sdCircle(vec2(abs(q.x) - 0.03, q.y), 0.0035), px);
  c = mix(c, vec3(0.9, 0.7, 0.3), rivet * step(slip, 0.0));
  float leader = stroke(sdSegment(p, at + vec2(0.05, 0.0), at + vec2(0.11, -0.012)), 0.0015, px);
  return mix(c, BRASS * 0.7, leader);
}

// Beneath the soil the rays show a curled skeleton, stretching as its body rises.
float xray(vec2 p, float up) {
  float passes = 0.72 + 0.07 * fbm(p * 7.0);
  vec2 at = vec2(HEART.x, mix(HEART.y, SURFACE, up));
  vec2 q = p - at;
  float body = fill(orcShape(p, up), 0.004);
  passes = mix(passes, 0.54, body);
  vec2 skullAt = mix(vec2(-0.085, 0.16), vec2(-0.06, 0.36), up);
  float skull = stroke(sdEllipse(q - skullAt, vec2(0.05, 0.055)), 0.009, 0.004);
  float spine = stroke(sdSegment(q, vec2(-0.035, mix(0.10, 0.20, up)), vec2(0.02, -0.14)), 0.008, 0.004);
  float ribs = 0.0;
  for (int k = 0; k < 3; k++) {
    float y = 0.07 - float(k) * 0.06;
    ribs = max(ribs, stroke(sdEllipse(q - vec2(-0.005, y), vec2(0.10 - float(k) * 0.012, 0.04)), 0.006, 0.003));
  }
  float limbs = stroke(sdSegment(q, vec2(-0.11, 0.08), mix(vec2(-0.06, -0.17), vec2(-0.30, -0.28), up)), 0.008, 0.004);
  limbs = max(limbs, stroke(sdSegment(q, vec2(0.11, 0.08), mix(vec2(0.06, -0.18), vec2(0.29, -0.28), up)), 0.008, 0.004));
  return mix(passes, 0.17, clamp(skull + spine + ribs + limbs, 0.0, 1.0) * body);
}

vec3 scene(vec2 p) {
  float grown = u_a.x, up = u_a.y, torn = u_a.z;
  float px = 1.5 / min(u_res.x, u_res.y);
  float sy = surfaceY(p.x);

  // A narrow blue-grey sky and distant hedge sit above the cut turf.
  vec3 c = mix(vec3(0.24, 0.34, 0.40), vec3(0.68, 0.68, 0.59), smoothstep(1.0, SURFACE, p.y));
  float cloud = 0.55 * noise(p * vec2(1.8, 5.0) + 2.0) + 0.45 * noise(rot(0.5) * p * vec2(4.5, 11.0));
  c *= 0.78 + 0.28 * cloud;
  float hedge = SURFACE + 0.055 + 0.025 * noise(vec2(p.x * 6.0, 5.0));
  c = mix(c, vec3(0.08, 0.12, 0.075) * (0.7 + 0.4 * noise(p * 14.0)), smoothstep(hedge + 0.015, hedge - 0.012, p.y) * step(sy, p.y));

  if (p.y < sy) {
    // The horizons blend into one another through broken crumbs rather than meeting in bands.
    vec2 rp = rot(0.28) * p;
    float n1 = 0.55 * noise(rp * vec2(6.0, 9.0)) + 0.3 * noise(rot(1.1) * p * 18.0) + 0.15 * noise(p * 45.0);
    float n2 = 0.6 * noise(rot(-0.45) * p * vec2(11.0, 7.0) + 6.0) + 0.4 * noise(p * 32.0);
    float yA = 0.27 + 0.055 * (n1 - 0.5);
    float yB = -0.05 + 0.10 * (n2 - 0.5);
    float yC = -0.56 + 0.09 * (n1 + n2 - 1.0);
    float wa = smoothstep(yA - 0.13, yA + 0.13, p.y);
    float wb = smoothstep(yB - 0.18, yB + 0.18, p.y);
    float wc = smoothstep(yC - 0.17, yC + 0.17, p.y);
    vec3 litter = vec3(0.18, 0.105, 0.045) * (0.62 + 0.65 * n1);
    vec3 loam = vec3(0.24, 0.145, 0.075) * (0.58 + 0.65 * n2);
    vec3 clay = mix(vec3(0.39, 0.18, 0.09), vec3(0.28, 0.25, 0.20), smoothstep(0.56, 0.76, n1)) * (0.68 + 0.45 * n2);
    vec3 chalk = vec3(0.62, 0.58, 0.47) * (0.7 + 0.42 * n1);
    vec3 soil = mix(chalk, clay, wc);
    soil = mix(soil, loam, wb);
    soil = mix(soil, litter, wa);
    float crumb = 0.6 * noise(p * 25.0) + 0.4 * noise(rot(0.8) * p * 63.0);
    soil *= 0.68 + 0.48 * crumb;
    vec3 N = normalize(vec3((n1 - 0.5) * 0.7, (n2 - 0.5) * 0.45 - 0.15, 0.85));
    c = shade(soil, N, p, 0.94);
    // Fine crumbs catch the lantern in A; grey and orange peds mottle B.
    vec2 cid = floor(p * vec2(85.0, 75.0));
    vec2 cf = fract(p * vec2(85.0, 75.0)) - 0.5;
    float aggregate = smoothstep(0.18, 0.03, length(cf - (vec2(hash(cid), hash(cid + 4.0)) - 0.5) * 0.45));
    aggregate *= step(0.72, hash(cid + 8.0)) * smoothstep(-0.05, 0.28, p.y);
    c += vec3(0.18, 0.11, 0.05) * aggregate * 0.35;
    float clayMottle = smoothstep(0.64, 0.76, 0.65 * noise(rot(0.6) * p * 13.0) + 0.35 * noise(p * 41.0));
    c = mix(c, c + vec3(0.13, 0.055, 0.02), clayMottle * smoothstep(0.18, -0.18, p.y) * smoothstep(-0.62, -0.35, p.y) * 0.35);

    // Pores and worm galleries curl through the face of the monolith.
    float gallery = abs(p.x + 0.72 + 0.09 * sin((p.y + 0.35) * 7.0)) - 0.007;
    gallery = min(gallery, abs(p.x - 0.66 - 0.08 * sin((p.y - 0.1) * 8.0)) - 0.006);
    c = mix(c, c * 0.72 + vec3(0.025, 0.015, 0.008), fill(gallery, px) * smoothstep(SURFACE, 0.15, p.y) * 0.65);

    // Pebbles and flints sit in the face with soft contact shadows and lit upper planes.
    for (int k = 0; k < 9; k++) {
      float i = float(k);
      vec2 at = vec2(-1.13 + 0.27 * i + 0.06 * sin(i * 7.0), 0.18 - 0.13 * mod(i * 2.7, 6.0));
      vec2 rr = vec2(0.028 + 0.038 * hash(vec2(i, 2.0)), 0.018 + 0.026 * hash(vec2(i, 7.0)));
      vec2 q = p - at;
      float rock = sdEllipse(q, rr) + 0.004 * (noise(q * 85.0 + i) - 0.5);
      float inside = clamp(1.0 - length(q / rr), 0.0, 1.0);
      vec3 rockN = normalize(vec3(normalize(q / rr + 1e-4) * (1.0 - inside), 0.35 + inside));
      vec3 alb = mix(vec3(0.34, 0.31, 0.27), vec3(0.58, 0.53, 0.42), hash(vec2(i, 4.0)));
      c = mix(c, c * 0.38, fill(rock - 0.008, px) * (1.0 - fill(rock, px)));
      c = mix(c, shade(alb * (0.8 + 0.25 * noise(q * 70.0)), rockN, p, 0.9), fill(rock, px));
      c += vec3(0.16, 0.13, 0.09) * smoothstep(0.010, 0.0, length(q - vec2(-rr.x * 0.25, rr.y * 0.25))) * fill(rock, px);
    }
  }

  // A turf crown with separate grass blades, fine stems and leaf litter.
  float turf = smoothstep(sy + 0.015, sy - 0.02, p.y) * smoothstep(sy - 0.10, sy - 0.03, p.y);
  c = mix(c, vec3(0.08, 0.105, 0.045) * (0.65 + 0.55 * noise(p * 30.0)), turf);
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    float gx = p.x * (52.0 + fk * 31.0);
    float id = floor(gx);
    float x = fract(gx) - 0.5;
    float h = 0.045 + 0.09 * hash(vec2(id, fk + 3.0));
    float y = (p.y - sy) / h;
    x -= (hash(vec2(id, fk + 7.0)) - 0.5) * y * y * 0.8;
    float blade = smoothstep(0.10, -0.03, abs(x) - 0.10 * (1.0 - y)) * step(0.0, y) * step(y, 1.0);
    blade *= step(hash(vec2(id, fk + 11.0)), 0.82);
    vec3 grass = mix(vec3(0.055, 0.095, 0.03), vec3(0.30, 0.31, 0.09), y) * (0.75 + 0.35 * hash(vec2(id, 4.0)));
    c = mix(c, grass, blade);
    float seed = fill(sdEllipse(vec2(x, y - 0.93), vec2(0.16, 0.10)), 0.03) * step(0.9, hash(vec2(id, fk + 21.0))) * step(0.0, y) * step(y, 1.08);
    c = mix(c, vec3(0.35, 0.29, 0.10), seed);
  }

  // Branching roots taper into hairs; no two keep the same course through the loam.
  for (int k = 0; k < 6; k++) {
    float i = float(k);
    float rootx = -1.05 + i * 0.43;
    float bottom = 0.0 - 0.10 * hash(vec2(i, 6.0));
    float bend = 0.05 * sin(p.y * (7.0 + i) + i * 1.7);
    float width = mix(0.008, 0.027, smoothstep(bottom, SURFACE, p.y));
    float root = abs(p.x - rootx - bend) - width;
    float keep = step(bottom, p.y) * step(p.y, sy + 0.01);
    vec3 rootc = shade(vec3(0.18, 0.16, 0.12) * (0.8 + 0.25 * noise(vec2(p.y * 35.0, i))), normalize(vec3((p.x - rootx - bend) / max(width, 0.004), 0.15, 0.8)), p, 0.9) + vec3(0.045, 0.035, 0.022);
    c = mix(c, rootc, fill(root, px) * keep);
    float side = mod(i, 2.0) < 1.0 ? -1.0 : 1.0;
    float bay = 0.27 - 0.02 * i;
    vec2 ba = vec2(rootx + 0.05 * sin(bay * (7.0 + i) + i * 1.7), bay);
    vec2 bm = ba + vec2(side * 0.045, -0.035 - 0.008 * sin(i));
    vec2 bb = ba + vec2(side * (0.075 + 0.006 * i), -0.105);
    vec2 bc = bb + vec2(side * 0.052, -0.065);
    float branch = cone(p, ba, bm, 0.010, 0.007);
    branch = min(branch, cone(p, bm, bb, 0.007, 0.0035));
    branch = min(branch, cone(p, bb, bc, 0.0035, 0.001));
    float day = 0.17 - 0.018 * i;
    vec2 da = vec2(rootx + 0.05 * sin(day * (7.0 + i) + i * 1.7), day);
    vec2 dm = da + vec2(-side * 0.035, -0.04);
    vec2 db = da + vec2(-side * 0.062, -0.09);
    branch = min(branch, cone(p, da, dm, 0.007, 0.004));
    branch = min(branch, cone(p, dm, db, 0.004, 0.001));
    vec3 branchc = vec3(0.24, 0.19, 0.12) * (0.82 + 0.18 * noise(p * 45.0 + i));
    c = mix(c, branchc, fill(branch, px) * step(p.y, sy));
    float sideDist = abs(p.x - rootx - bend) - width;
    float row = abs(fract((p.y - bottom) * 72.0 + i * 0.31) - 0.5);
    float hairs = smoothstep(0.10, 0.02, row) * step(0.003, sideDist) * smoothstep(0.026, 0.004, sideDist) * step(bottom, p.y) * step(p.y, 0.27);
    c = mix(c, vec3(0.38, 0.32, 0.24), hairs * 0.14);
  }

  // In the fruiting season, three tiny fungal cups open in the loam rather than making pods.
  for (int k = 0; k < 3; k++) {
    float i = float(k);
    vec2 at = vec2(-0.82 + i * 0.72, 0.17 - 0.035 * i);
    float stem = cone(p, at - vec2(0.0, 0.055), at, 0.006, 0.004);
    float cup = max(sdEllipse(p - at, vec2(0.032, 0.012)), at.y - p.y);
    vec3 fungus = shade(vec3(0.52, 0.38, 0.18), normalize(vec3(0.0, 0.35, 0.94)), p, 0.7);
    c = mix(c, fungus, fill(min(stem, cup), px) * u_a.w);
  }

  // White fungal threads radiate from the buried body, branching and breaking after a tear.
  vec2 mq = p - HEART;
  float rad = length(mq * vec2(0.86, 1.0));
  vec2 warp = vec2(noise(mq * 4.0), noise(rot(0.8) * mq * 4.5 + 7.0)) - 0.5;
  float web1 = 1.0 - abs(noise(rot(0.35) * mq * 8.0 + warp * 2.2) * 2.0 - 1.0);
  float web2 = 1.0 - abs(noise(rot(-0.9) * mq * 17.0 - warp * 1.5 + 3.0) * 2.0 - 1.0);
  float threads = max(smoothstep(0.991, 0.999, web1), smoothstep(0.994, 0.9995, web2) * 0.5);
  float reach = mix(0.32, 1.45, grown);
  threads *= smoothstep(reach, reach - 0.25, rad) * step(p.y, sy);
  threads *= mix(1.0, step(0.48, noise(p * 31.0)), torn);
  c = mix(c, vec3(0.84, 0.82, 0.72), threads * 0.28);
  // Fine feeding threads descend from nearby roots and disappear beneath the sleeper's back.
  float feeders = stroke(sdSegment(p, vec2(-0.30, 0.08), HEART + vec2(-0.10, 0.10)), 0.00035, px * 0.55);
  feeders = max(feeders, stroke(sdSegment(p, vec2(-0.04, 0.13), HEART + vec2(-0.02, 0.14)), 0.0003, px * 0.55));
  feeders = max(feeders, stroke(sdSegment(p, vec2(0.31, 0.08), HEART + vec2(0.10, 0.10)), 0.00035, px * 0.55));
  c = mix(c, vec3(0.84, 0.82, 0.7), feeders * (1.0 - up) * (1.0 - 0.75 * torn) * 0.14);

  // Broken turf and clods part beneath the body before it clears the opening.
  float clod = sdEllipse(p - vec2(HEART.x, sy - 0.018), vec2(0.29, 0.045));
  clod += 0.014 * (noise(p * 40.0) - 0.5);
  c = mix(c, vec3(0.12, 0.075, 0.035) * (0.65 + 0.5 * noise(p * 22.0)), fill(clod, px) * up * step(p.y, sy + 0.025));

  // The root-bound body: mud-caked and lumpy below, upright with head, shoulders and long arms.
  float od = orcShape(p, up);
  if (od < 0.025) {
    vec2 grad = normalize(vec2(dFdx(od), dFdy(od)) + 1e-6);
    float deep = clamp(-od / 0.09, 0.0, 1.0);
    vec3 N = normalize(vec3(grad * (1.0 - deep), 0.22 + deep));
    float sinew = 0.58 * noise(rot(0.6) * p * vec2(22.0, 55.0)) + 0.42 * noise(rot(-0.8) * p * 48.0);
    vec3 living = mix(vec3(0.22, 0.24, 0.12), vec3(0.34, 0.29, 0.14), sinew);
    vec3 clayf = mix(vec3(0.24, 0.13, 0.06), vec3(0.34, 0.24, 0.11), sinew);
    vec3 flesh = mix(clayf, living, up);
    float mud = smoothstep(0.50, 0.76, 0.45 * noise(rot(0.4) * p * 24.0 + 4.0) + 0.35 * noise(rot(-0.8) * p * 61.0) + 0.2 * noise(p * 120.0));
    flesh = mix(flesh, vec3(0.23, 0.12, 0.055) * (0.65 + 0.45 * sinew), mud * mix(0.68, 0.38, up));
    vec3 bodyc = shade(flesh, N, p, mix(0.55, 0.84, up));
    bodyc += vec3(0.055, 0.032, 0.014) * (1.0 - up);
    bodyc += vec3(0.76, 0.7, 0.56) * (1.0 - up) * pow(max(dot(N, normalize(vec3(-0.6, 0.7, 0.5))), 0.0), 24.0) * 0.22;
    vec2 cavityAt = mix(HEART, vec2(HEART.x, SURFACE - 0.03), up);
    c = gloom(c, p, cavityAt, mix(vec2(0.34, 0.20), vec2(0.34, 0.06), up));
    c = mix(c, bodyc, fill(od, px));
    vec2 at = vec2(HEART.x, mix(HEART.y, SURFACE, up));
    vec2 q = p - at;
    vec2 eyeAt = mix(vec2(-0.125, 0.085), vec2(-0.085, 0.38), up);
    float eyeD = min(sdCircle(q - eyeAt, 0.010), sdCircle(q - vec2(-0.025, 0.38), 0.009) + (1.0 - up));
    c = mix(c, vec3(0.035, 0.028, 0.018), fill(eyeD, px) * up);
    c = mix(c, vec3(0.48, 0.38, 0.14), fill(eyeD + 0.006, px) * up);
    float mouth = stroke(sdSegment(q, eyeAt + vec2(-0.055, -0.07), eyeAt + vec2(0.035, -0.065)), 0.004, px);
    c = mix(c, vec3(0.06, 0.035, 0.02), mouth * up);
    float tusk = cone(q, eyeAt + vec2(-0.042, -0.056), eyeAt + vec2(-0.058, -0.025), 0.007, 0.001);
    tusk = min(tusk, cone(q, vec2(-0.015, 0.31), vec2(0.0, 0.345), 0.007, 0.001) + (1.0 - up));
    c = mix(c, BONE * 0.75, fill(tusk, px) * up);
    float brow = stroke(sdSegment(q, eyeAt + vec2(-0.025, 0.018), eyeAt + vec2(0.02, 0.012)), 0.005, px);
    c = mix(c, vec3(0.06, 0.05, 0.025), brow * up * 0.65);
    float muscles = stroke(sdSegment(q, vec2(-0.15, 0.12), vec2(-0.025, 0.07)), 0.003, px);
    muscles = max(muscles, stroke(sdSegment(q, vec2(0.14, 0.12), vec2(0.025, 0.07)), 0.003, px));
    muscles = max(muscles, stroke(sdSegment(q, vec2(0.0, 0.08), vec2(0.0, -0.16)), 0.003, px));
    c = mix(c, vec3(0.08, 0.065, 0.035), muscles * fill(od, px) * up * 0.5);
    // Brow, tusks and fingers identify the curled anatomy without diagrammatic stick lines.
    vec2 cf = (p - HEART) / 0.75;
    float headForm = sdCircle(cf - vec2(-0.20, -0.02), 0.10);
    float kneeForm = sdEllipse(cf - vec2(-0.08, -0.15), vec2(0.12, 0.07));
    float footForm = sdEllipse(cf - vec2(0.10, -0.18), vec2(0.07, 0.035));
    float armForm = cone(cf, vec2(-0.07, 0.05), vec2(-0.15, -0.13), 0.05, 0.035);
    c = mix(c, bodyc * 0.74, fill(headForm * 0.75, px) * (1.0 - up) * 0.30);
    c = mix(c, bodyc * 1.28, fill(kneeForm * 0.75, px) * (1.0 - up) * 0.34);
    c = mix(c, bodyc * 0.62, stroke(armForm * 0.75, 0.0024, px) * (1.0 - up) * 0.82);
    c = mix(c, vec3(0.07, 0.045, 0.025), stroke(headForm * 0.75, 0.0018, px) * (1.0 - up) * 0.62);
    c = mix(c, vec3(0.07, 0.045, 0.025), stroke(kneeForm * 0.75, 0.0015, px) * (1.0 - up) * 0.48);
    c = mix(c, bodyc * 1.36, fill(footForm * 0.75, px) * (1.0 - up) * 0.42);
    c = mix(c, vec3(0.06, 0.04, 0.022), stroke(footForm * 0.75, 0.0014, px) * (1.0 - up) * 0.55);
    float browDormant = sdEllipse(cf - vec2(-0.25, 0.02), vec2(0.05, 0.02));
    c = mix(c, vec3(0.075, 0.06, 0.035), fill(browDormant * 0.75, px) * (1.0 - up) * 0.65);
    c = mix(c, vec3(0.025, 0.022, 0.014), fill(sdCircle(cf - vec2(-0.235, -0.002), 0.007) * 0.75, px) * (1.0 - up));
    float jawDormant = stroke(sdSegment(cf, vec2(-0.275, -0.07), vec2(-0.205, -0.085)) * 0.75, 0.0017, px);
    c = mix(c, vec3(0.055, 0.038, 0.022), jawDormant * (1.0 - up) * 0.75);
    float tusks = cone(cf, vec2(-0.27, -0.08), vec2(-0.275, -0.035), 0.0065, 0.001);
    tusks = min(tusks, cone(cf, vec2(-0.23, -0.09), vec2(-0.225, -0.045), 0.006, 0.001));
    c = mix(c, BONE * 0.72, fill(tusks * 0.75, px) * (1.0 - up) * 0.78);
    float fingers = stroke(sdSegment(cf, vec2(-0.16, -0.125), vec2(-0.10, -0.158)) * 0.75, 0.0015, px);
    fingers = max(fingers, stroke(sdSegment(cf, vec2(-0.145, -0.115), vec2(-0.085, -0.148)) * 0.75, 0.0013, px));
    fingers = max(fingers, stroke(sdSegment(cf, vec2(-0.13, -0.105), vec2(-0.07, -0.136)) * 0.75, 0.0012, px));
    c = mix(c, vec3(0.055, 0.045, 0.028), fingers * (1.0 - up));
    float crack = 1.0 - abs(noise(rot(0.45) * p * 38.0 + vec2(noise(p * 9.0), 0.0)) * 2.0 - 1.0);
    crack = smoothstep(0.982, 0.998, crack) * fill(od, px) * (1.0 - up);
    c = mix(c, vec3(0.08, 0.05, 0.025), crack * 0.5);
  }

  // Brass horizon slips are fixed in the left margin of the soil face.
  float left = -u_res.x / min(u_res.x, u_res.y) + 0.095;
  c = labelSlip(c, p, vec2(left, 0.37), 0.0, px);
  c = labelSlip(c, p, vec2(left, 0.16), 1.0, px);
  c = labelSlip(c, p, vec2(left, -0.24), 2.0, px);
  c = labelSlip(c, p, vec2(left, -0.73), 3.0, px);

  // Lantern warmth pools over the cut without flattening its depth.
  c += vec3(0.20, 0.10, 0.035) * 0.20 / (1.0 + 1.5 * dot(p - vec2(-0.55, 0.95), p - vec2(-0.55, 0.95)));
  if (lensIn(p) > 0.0) c = fluoroscope(c, p, xray(p, up));
  return c;
}
`,s=.85,c={source:o,start({stage:e,root:n,env:r}){let i=r.on,o=a(i),c=0,l=0;return{frame(a,u){let d=o.value>=s;c=t(c,+!!d,d?.9:3,u),l=t(l,+!!o.torn,o.torn?10:1.5,u),e.set(`a`,[o.value,c,l,+!!i]),e.set(`env`,[r.level,+!!i,0,0]),n.dataset.state=c>.5?`grown`:`pod`},level:()=>Math.max(o.value*.5,c),dispose(){o.stop()}}},plates:[{name:`pod`,caption:{almanac:`The pod in the clay, its threads spreading out through the soil.`,cipher:`Plate I: dormant pod; mycelial growth in progress.`},a:[.6,0,0,1]},{name:`grown`,caption:{almanac:`Grown in full, and standing up out of the broken ground.`,cipher:`Plate II: emergence complete.`},a:[1,1,0,1]}]};export{c as scene};