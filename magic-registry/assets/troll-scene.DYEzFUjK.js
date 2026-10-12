import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
vec3 KEY, KEYC, SKYC;
const vec2 O = vec2(0.04, -0.06);
const float TS = 1.2;

float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
vec3 rod(float t) { t = clamp(t, -0.98, 0.98); return vec3(t, 0.0, sqrt(1.0 - t * t)); }

// The moon (or the sun by day), the cold sky's fill, and a rim where the light comes round.
vec3 shade(vec3 alb, vec3 N, float rough) {
  float wr = max((dot(N, KEY) + 0.25) / 1.25, 0.0);
  vec3 H = normalize(KEY + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(60.0, 8.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 3.0) * max(dot(normalize(N.xy + 1e-4), normalize(KEY.xy)), 0.0);
  return alb * (SKYC * (0.6 + 0.4 * N.y) + KEYC * wr) + KEYC * (sp * 0.35 + rim * 0.25);
}

// The skyline of the slope: it climbs to the right.
float ridge(float x) { return -0.04 + 0.2 * x + 0.035 * noise(vec2(x * 3.0, 0.5)); }

// The brute, sat hunched on the scree: the pear of its trunk, the hump of its shoulders, a
// head thrust forward under a heavy brow, the long nose, the beard, the long arm down to its
// knuckles, the haunch and the foot. Its outline is shaggy with hair and heather.
float brute(vec2 q, float rise) {
  float d = sdEllipse(rot(0.5) * (q - vec2(0.06, -0.05)), vec2(0.2, 0.25 + rise * 0.5));
  d = smin(d, sdEllipse(q - vec2(-0.02, -0.13), vec2(0.2, 0.14)), 0.05);
  d = smin(d, sdEllipse(rot(0.35) * (q - vec2(0.0, 0.13 + rise)), vec2(0.17, 0.13)), 0.08);
  d = smin(d, sdEllipse(q - vec2(-0.07, 0.15 + rise * 0.8), vec2(0.14, 0.11)), 0.05);
  d = smin(d, sdEllipse(q - vec2(-0.19, 0.22 + rise * 0.6), vec2(0.12, 0.11)), 0.03);
  d = smin(d, sdEllipse(q - vec2(-0.23, 0.29 + rise * 0.6), vec2(0.1, 0.04)), 0.02);
  d = smin(d, cone(q, vec2(-0.28, 0.21), vec2(-0.39, 0.09), 0.05, 0.045), 0.03);
  d = smin(d, sdEllipse(q - vec2(-0.41, 0.055), vec2(0.066, 0.06)), 0.02);
  d = smin(d, sdEllipse(q - vec2(-0.2, 0.1), vec2(0.1, 0.09)), 0.02);
  d = min(d, cone(q, vec2(-0.1, 0.28), vec2(-0.04, 0.36), 0.035, 0.01));
  d = smin(d, cone(q, vec2(-0.06, 0.12), vec2(-0.22, -0.1), 0.075, 0.06), 0.04);
  d = smin(d, cone(q, vec2(-0.22, -0.1), vec2(-0.24, -0.23), 0.06, 0.05), 0.02);
  d = smin(d, sdEllipse(q - vec2(-0.25, -0.255), vec2(0.075, 0.04)), 0.02);
  d = smin(d, sdEllipse(q - vec2(0.17, -0.17), vec2(0.13, 0.11)), 0.04);
  d = smin(d, sdEllipse(q - vec2(0.12, -0.265), vec2(0.12, 0.035)), 0.02);
  return d + 0.009 * smoothstep(0.0, 0.25, q.y) * (noise(vec2(q.x * 70.0, q.y * 10.0)) - 0.5);
}
vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float stone = u_a.x, day = u_a.y, breath = u_a.z, sweep = u_a.w, bird = u_b.x;
  // By day the sun comes across the slope from the right, and what it has reached is lit.
  float sunlit = day * smoothstep(-0.1, 0.1, p.x - mix(1.7, -1.7, sweep));
  KEY = normalize(mix(vec3(0.45, 0.55, 0.65), vec3(0.7, 0.45, 0.55), day));
  KEYC = mix(vec3(0.72, 0.8, 1.0), vec3(1.15, 0.98, 0.78) * (0.25 + 0.75 * sunlit), day);
  SKYC = mix(vec3(0.05, 0.065, 0.1), vec3(0.34, 0.4, 0.5), day);
  vec2 moonAt = vec2(0.72, 0.64);

  // The sky: night blue with its stars and the moon in a ring of light, or a pale northern day.
  vec3 c = mix(mix(vec3(0.02, 0.03, 0.06), vec3(0.06, 0.08, 0.13), smoothstep(0.9, -0.1, p.y)),
               mix(vec3(0.42, 0.55, 0.7), vec3(0.75, 0.8, 0.82), smoothstep(0.9, -0.1, p.y)), day);
  vec2 sc = floor(p * 90.0);
  float star = step(0.985, hash(sc)) * smoothstep(0.35, 0.0, length(fract(p * 90.0) - 0.5)) * (1.0 - day);
  c += vec3(0.8, 0.85, 1.0) * star * (0.4 + 0.6 * hash(sc + 3.0)) * smoothstep(-0.1, 0.3, p.y);
  c += vec3(0.35, 0.4, 0.5) * exp(-length(p - moonAt) * 4.0) * 0.5 * (1.0 - day);
  float moon = length(p - moonAt) - 0.055;
  vec3 moonC = vec3(0.86, 0.87, 0.8) * (0.85 + 0.15 * noise((p - moonAt) * 40.0)) - vec3(0.12) * smoothstep(0.5, 0.75, noise((p - moonAt) * 18.0));
  c = mix(c, moonC, fill(moon, px) * (1.0 - day));

  // The fells beyond, two ridges going back into the air, snow lying in their gullies.
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    float x = p.x + plateDrift(0.2 + 0.2 * fk).x;
    float top = 0.24 - 0.11 * fk + 0.14 * noise(vec2(x * 1.3 + fk * 4.0, fk)) + 0.035 * noise(vec2(x * 5.0, fk + 2.0));
    if (p.y > top + 0.01) continue;
    float dn = top - p.y;
    float gully = smoothstep(0.55, 0.7, noise(vec2(x * 7.0 + fk * 5.0, dn * 12.0))) * smoothstep(0.08, 0.0, dn) * day;
    vec3 fell = mix(vec3(0.028, 0.034, 0.055), vec3(0.36, 0.4, 0.46), day) * (0.75 + 0.35 * noise(vec2(x * 5.0 + dn * 3.0, dn * 7.0 + fk)));
    fell += vec3(0.12, 0.14, 0.19) * smoothstep(0.025, 0.0, dn) * smoothstep(-0.3, 0.6, x) * (1.0 - day);
    fell = mix(fell, mix(vec3(0.3, 0.33, 0.42), vec3(0.88, 0.9, 0.92), day), gully * 0.7);
    vec3 air = mix(vec3(0.07, 0.09, 0.14), vec3(0.65, 0.72, 0.8), day);
    c = mix(c, mix(fell, air, 0.4 - 0.25 * fk), fill(p.y - top, px * 2.0));
  }

  // Mist lying in the valley beyond, pale under the moon.
  c = mix(c, mix(vec3(0.16, 0.19, 0.26), vec3(0.78, 0.82, 0.86), day), smoothstep(0.24, 0.0, p.y) * smoothstep(-0.25, 0.0, p.y) * (0.75 + 0.25 * noise(vec2(p.x * 2.0 + t * 0.02, p.y * 9.0))) * 0.8);

  // The slope: scree and heather, the stones nearer and bigger as it comes down to the glass.
  float sky = ridge(p.x);
  if (p.y < sky + 0.01) {
    float dep = max(sky - p.y, 0.012);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.45;
    float n1 = noise(uv * 2.0), n2 = noise(uv * 7.0 + 4.0);
    vec3 ground = mix(vec3(0.16, 0.13, 0.1), vec3(0.2, 0.22, 0.12), smoothstep(0.4, 0.7, n1)) * (0.6 + 0.6 * n2);
    vec3 gc = shade(ground, normalize(vec3((n2 - 0.5) * 0.5, 0.9, 0.45)), 0.95);
    // Broken rock: each stone cut by a few planes, so it shows flat faces to the light.
    vec2 id = floor(uv * 3.4);
    vec2 f = fract(uv * 3.4) - 0.5;
    vec2 bq = f - (vec2(hash(id), hash(id + 7.0)) - 0.5) * 0.25;
    bq.y = bq.y * 0.7 + 0.08;
    float r = 0.24 + 0.16 * hash(id + 3.0);
    float rock = -1.0;
    vec2 face = vec2(0.0, 1.0);
    for (int j = 0; j < 5; j++) {
      float a = hash(id + float(j) * 13.0) * 0.9 + float(j) * 1.257;
      vec2 dir = vec2(cos(a), sin(a));
      float pl = dot(bq, dir) - r * (0.75 + 0.25 * hash(id + float(j) * 5.0));
      if (pl > rock) { rock = pl; face = dir; }
    }
    float shadowed = smoothstep(0.08, -0.02, length(bq + vec2(KEY.x, 0.25) * r * 0.5) - r);
    gc *= 1.0 - 0.5 * shadowed * step(0.0, rock);
    if (rock < 0.03 && hash(id + 11.0) > 0.12) {
      float inner = clamp(-rock / (r * 0.35), 0.0, 1.0);
      vec3 N = normalize(vec3(face * (1.0 - inner) * 0.9, 0.35 + inner));
      N = normalize(N + vec3(0.0, 0.25, 0.0));
      vec3 alb = mix(vec3(0.3, 0.3, 0.29), vec3(0.42, 0.4, 0.36), hash(id + 5.0)) * (0.75 + 0.35 * noise(bq * 9.0 + id * 3.0));
      alb = mix(alb, vec3(0.55, 0.56, 0.44), smoothstep(0.76, 0.8, noise(bq * 18.0 + id)) * 0.3);
      gc = mix(gc, shade(alb, N, 0.85), smoothstep(0.012, -0.012, rock));
    }
    gc = mix(c, gc, smoothstep(0.0, 0.08, dep));
    c = mix(c, gc, fill(p.y - sky, px));
  }

  // Birches on the slope: white bark marked with black, fine and slanting, roots in the scree.
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    float x = -1.2 + fk * 0.48 + 0.12 * sin(fk * 3.7) + plateDrift(0.6).x;
    if (abs(x - O.x) < 0.45) x += sign(x - O.x + 1e-3) * 0.45;
    float base = ridge(x) - 0.06 - 0.22 * hash(vec2(fk, 2.0));
    float w = 0.014 + 0.012 * hash(vec2(fk, 5.0));
    vec2 q = p - vec2(x, base);
    float cx = q.x - (0.04 * sin(fk * 2.0) * q.y + 0.015 * sin(q.y * 4.0 + fk));
    if (q.y < 0.0 || abs(cx) > w + px * 2.0) continue;
    float tt = cx / w;
    // The bark: chalk-white, peeling in bands, scored across with dark lenticels, and broken
    // into black fissures low down where the trunk is old.
    float marks = smoothstep(0.62, 0.7, noise(vec2(tt * 1.5 + fk * 9.0, q.y * 55.0)));
    marks = max(marks, smoothstep(0.12, 0.0, q.y) * smoothstep(0.4, 0.6, noise(vec2(tt * 3.0, q.y * 30.0 + fk))));
    float lent = smoothstep(0.72, 0.8, noise(vec2(tt * 0.8 + fk * 3.0, q.y * 190.0))) * smoothstep(0.9, 0.3, abs(tt));
    float peel = noise(vec2(fk * 5.0, q.y * 24.0));
    vec3 bark = mix(vec3(0.78, 0.76, 0.71), vec3(0.86, 0.8, 0.7), smoothstep(0.55, 0.75, peel));
    bark = mix(bark, vec3(0.1, 0.08, 0.07), max(marks, lent * 0.7));
    // Round, lit from the moon's side and falling into the cold on the other.
    float toward = tt * sign(KEY.x + 1e-3);
    vec3 bc = shade(bark, rod(tt), 0.7) * mix(0.28, 1.05, smoothstep(-0.85, 0.75, toward));
    bc += mix(vec3(0.02, 0.03, 0.06), vec3(0.08, 0.1, 0.13), day) * smoothstep(0.2, -0.9, toward);
    bc = mix(bc, mix(vec3(0.07, 0.09, 0.14), vec3(0.65, 0.72, 0.8), day), 0.2);
    c = mix(c, bc, smoothstep(w, w - px * 1.5, abs(cx)));
  }

  // The Troll. Its back rises as it breathes; by day it is granite to the bone.
  float rise = 0.02 * breath * (1.0 - stone);
  vec2 q = (p - O) / TS;
  float qx = px / TS;
  c = gloom(c, p, O + vec2(-0.03, -0.29) * TS, vec2(0.38, 0.05) * TS);
  c = gloom(c, p, O + vec2(-0.25 * KEY.x, -0.27) * TS, vec2(0.42, 0.045) * TS);
  bool nearBrute = abs(q.x + 0.05) < 0.5 && q.y > -0.33 && q.y < 0.4;
  float b = nearBrute ? brute(q, rise) : 1.0;
  if (b < 0.02) {
    vec2 g = normalize(vec2(dFdx(b), dFdy(b)) + 1e-6);
    float rim = clamp(-b / 0.08, 0.0, 1.0);
    float h1 = noise(rot(0.7) * q * 16.0) * 0.6 + noise(rot(1.9) * q * 34.0) * 0.4, h2 = noise(rot(2.4) * q * 70.0 + 3.0);
    vec3 N = normalize(vec3(g * (1.0 - rim) + (vec2(h1, h2) - 0.5) * 0.3 * rim, 0.25 + rim));
    // Its hide: rough and grey-brown, moss where it faces the sky, heather in its hair; and
    // stone, speckled and crusted with lichen, once the sun has had it.
    vec3 hide = vec3(0.34, 0.3, 0.25) * (0.65 + 0.35 * h1 + 0.25 * h2);
    float mossy = smoothstep(0.25, 0.7, N.y + 0.4 * (h1 - 0.5)) * smoothstep(-0.05, 0.1, q.y);
    hide = mix(hide, vec3(0.12, 0.17, 0.07) * (0.7 + 0.6 * h2), mossy * 0.85);
    vec3 granite = vec3(0.47, 0.46, 0.44) * (0.75 + 0.3 * h1) + vec3(0.12) * (step(0.82, hash(floor(q * 260.0))) - step(hash(floor(q * 260.0) + 1.0), 0.15));
    float lichen = smoothstep(0.66, 0.72, noise(q * 40.0 + 9.0) * 0.75 + noise(q * 150.0) * 0.3) * smoothstep(-0.02, 0.12, q.y);
    granite = mix(granite, mix(vec3(0.68, 0.6, 0.32), vec3(0.58, 0.63, 0.5), smoothstep(0.4, 0.6, noise(q * 9.0))) * (0.8 + 0.3 * h2), lichen * 0.65);
    hide = mix(hide, granite, stone);
    vec3 bc = shade(hide, N, mix(0.75, 0.95, stone));
    bc += KEYC * 0.35 * pow(1.0 - clamp(N.z, 0.0, 1.0), 2.0) * max(dot(normalize(N.xy + 1e-4), normalize(KEY.xy)), 0.0) * (1.0 - day);
    bc *= 0.75 + 0.25 * smoothstep(-0.2, 0.0, q.y);
    // A deep-set eye under the brow, catching the moon; stone-blind by day.
    vec2 ey = q - vec2(-0.27, 0.235 + rise * 0.6);
    float eye = sdEllipse(ey, vec2(0.012, 0.008));
    bc = mix(bc, bc * 0.35, fill(sdEllipse(ey - vec2(0.004, 0.004), vec2(0.024, 0.016)), qx * 2.0));
    bc = mix(bc, mix(vec3(0.6, 0.62, 0.42), granite * 0.8, stone), fill(eye, qx));
    bc += vec3(0.8, 0.85, 0.9) * fill(sdCircle(ey - vec2(-0.003, 0.003), 0.003), qx) * (1.0 - stone) * (1.0 - day);
    // The nostril and the line of the mouth.
    bc = mix(bc, bc * 0.3, fill(sdEllipse(q - vec2(-0.44, 0.022), vec2(0.018, 0.009)), qx));
    float beard = smoothstep(0.1, 0.03, q.y) * fill(sdEllipse(q - vec2(-0.2, 0.1), vec2(0.105, 0.095)), 0.015);
    bc = mix(bc, mix(vec3(0.16, 0.14, 0.11), granite, stone) * (0.6 + 0.6 * noise(vec2(q.x * 150.0 + q.y * 25.0, q.y * 8.0))) * (SKYC + KEYC * 0.6), beard * 0.8);
    c = mix(c, bc, fill(b, qx));
  }
  // A birch sapling seeded in the moss of its shoulders.
  vec2 sq = q - vec2(0.06, 0.24);
  float sap = cone(sq, vec2(0.0), vec2(0.035, 0.2), 0.007, 0.003);
  vec2 lq = sq - vec2(0.03, 0.2);
  float crown = length(lq * vec2(1.0, 1.3)) - 0.06 - 0.03 * (noise(lq * 40.0 + 3.0) - 0.5);
  float leaves = step(0.0, -crown) * step(0.38, noise(rot(0.5) * lq * 110.0));
  c = mix(c, shade(mix(vec3(0.75, 0.73, 0.7), vec3(0.42, 0.42, 0.4), stone), rod(clamp((sq.x - sq.y * 0.17) / 0.006, -1.0, 1.0)), 0.7), fill(sap, qx));
  c = mix(c, shade(mix(mix(vec3(0.12, 0.16, 0.08), vec3(0.45, 0.55, 0.18), day), vec3(0.6, 0.48, 0.2), stone * day), normalize(vec3(lq * 8.0, 0.8)), 0.8), leaves * smoothstep(0.0, 0.3, -crown / 0.06));
  // The bird, come down on its head once it has stood still as stone: a wheatear, grey and buff.
  if (bird > 0.02) {
    vec2 bq = (p - (O + vec2(-0.21, 0.355 + 0.08 * (1.0 - bird)) * TS)) / 0.9;
    float body = sdEllipse(rot(0.25) * bq, vec2(0.032, 0.018));
    float head = sdCircle(bq - vec2(-0.028, 0.014), 0.012);
    float beak = cone(bq, vec2(-0.038, 0.015), vec2(-0.05, 0.012), 0.003, 0.0005);
    float tail = cone(bq, vec2(0.025, -0.006), vec2(0.055, -0.016), 0.008, 0.005);
    float legs = min(cone(bq, vec2(-0.004, -0.014), vec2(-0.006, -0.03), 0.0015, 0.0012), cone(bq, vec2(0.006, -0.014), vec2(0.005, -0.03), 0.0015, 0.0012));
    float bd = min(min(smin(body, head, 0.008), min(beak, tail)), legs);
    vec3 plum = mix(vec3(0.5, 0.5, 0.52), vec3(0.82, 0.68, 0.5), smoothstep(0.0, -0.015, bq.y + 0.004));
    plum = mix(plum, vec3(0.08), max(smoothstep(0.02, 0.03, bq.x), fill(sdEllipse(bq - vec2(-0.03, 0.013), vec2(0.012, 0.004)), 0.002)));
    vec3 bn = normalize(vec3((bq - vec2(0.0, 0.0)) / vec2(0.04, 0.025) * 0.6, 0.8));
    c = gloom(c, p, O + vec2(-0.21, 0.325) * TS, vec2(0.04, 0.008) * bird);
    c = mix(c, shade(plum, bn, 0.6), fill(bd, px) * smoothstep(0.0, 0.5, bird));
    c = mix(c, vec3(0.02), fill(sdCircle(bq - vec2(-0.031, 0.017), 0.0025), px) * bird);
  }

  // Its breath steaming from the nose in the cold, drifting up and off.
  vec2 nose = O + vec2(-0.47, 0.02) * TS;
  vec2 sp = p - nose;
  float plume = exp(-length((sp - vec2(-0.08, 0.04) * breath) * vec2(1.0, 1.4)) * 8.0) * smoothstep(-0.05, 0.12, -sp.x + 0.5 * sp.y + 0.05);
  plume *= 0.55 + 0.45 * noise(sp * 14.0 + vec2(t * 0.3, -t * 0.4));
  c = mix(c, vec3(0.6, 0.65, 0.72) * (0.5 + 0.5 * KEYC.b), plume * breath * (1.0 - day) * 0.55);

  // The night's haze lying in the hollows of the slope.
  c = mix(c, mix(vec3(0.08, 0.1, 0.16), vec3(0.7, 0.75, 0.8), day), smoothstep(-0.1, -0.5, p.y) * smoothstep(-0.9, -0.5, p.y) * 0.12);

  float on = smoothstep(0.02, -0.02, sdEllipse(p - O - vec2(-0.06, 0.04) * TS, vec2(0.42, 0.36) * TS));
  c = fluoroscope(c, p, mix(0.8, mix(0.35, 0.12, stone), on));
  return c;
}
`,n=2.4,r=.22,i=e=>e*e*(3-2*e),a={source:t,start({stage:t,root:a,env:o}){let s=o.on,c=0,l=0,u=0;return a.dataset.state=`breathing`,{frame(d,f){s&&(c=Math.min(1,c+f/n));let p=s?i(Math.min(1,Math.max(0,c*1.4-.25))):0;p>=1&&(l=e(l,1,1.2,f)),u+=f*r;let m=s?0:i(.5-.5*Math.cos(u*2*Math.PI));t.set(`a`,[p,+!!s,m,c]),t.set(`b`,[l,0,0,0]),t.set(`env`,[o.level,+!!s,0,0]),a.dataset.state=p>.5?`stone`:`breathing`},level:()=>s?0:.3,dispose(){}}},plates:[{name:`stone`,caption:{almanac:`By day: stone, with lichen on its shoulders and a bird on its head.`,cipher:`Plate I: mineralized, under direct sunlight.`},a:[1,1,0,1],b:[1,0,0,0]},{name:`breathing`,caption:{almanac:`By night: breathing among the stones, its breath steaming.`,cipher:`Plate II: active at night; respiration visible.`},a:[0,0,.85,0]}]};export{a as scene};