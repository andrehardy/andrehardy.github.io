import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t={x:1.05,y:-.46},n=.3,r={source:`
vec3 KEY, KEYC, SKYC;
float LAMP, FLICK, PULSE;
const vec2 STONE = vec2(1.05, -0.46);
const vec2 CANDLE = vec2(-1.12, 0.06);
const vec2 ORG = vec2(-0.06, -0.18);
const vec3 COLD = vec3(0.35, 1.0, 0.55);
const vec3 IVORY = vec3(0.62, 0.55, 0.42);
const vec3 GOLD = vec3(0.68, 0.48, 0.18);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
// A slow pulse, short and soft, three in four seconds.
float beat() {
  float s = 0.5 + 0.5 * sin(u_time * 4.712);
  return s * s * s * s;
}
// The candle, the cool air of the tomb, and a rim where the light comes round the form.
vec3 shade(vec3 alb, vec3 N, float rough) {
  float wr = max((dot(N, KEY) + 0.32) / 1.32, 0.0);
  vec3 H = normalize(KEY + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(68.0, 11.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.3);
  rim *= max(dot(normalize(N.xy + vec2(1e-4, 0.0)), normalize(KEY.xy)), 0.0);
  return alb * (SKYC * (0.5 + 0.5 * N.y) + KEYC * wr * LAMP) + KEYC * LAMP * (sp * 0.5 + rim * 0.3);
}

// A palm and four fingers of three bones each, plus a thumb. Lengths are relative to the hand.
float skeletalHand(vec2 p, float side) {
  float f = sdBox(p - vec2(0.0, -0.06), vec2(0.14, 0.08)) - 0.03;
  for (int i = 0; i < 4; i++) {
    float fi = float(i) - 1.5;
    float x = fi * 0.085;
    float curl = fi * 0.04;
    vec2 a = vec2(x, 0.02);
    vec2 b = a + vec2(curl, 0.45);
    vec2 c = b + vec2(curl * 0.45, 0.3);
    vec2 tip = c + vec2(curl * 0.15, 0.22);
    f = min(f, cone(p, a, b, 0.05, 0.038));
    f = min(f, cone(p, b, c, 0.038, 0.028));
    f = min(f, cone(p, c, tip, 0.028, 0.014));
    f = min(f, sdCircle(p - b, 0.07));
    f = min(f, sdCircle(p - c, 0.055));
  }
  vec2 t0 = vec2(0.15 * side, -0.05);
  vec2 t1 = t0 + vec2(0.16 * side, 0.12);
  vec2 t2 = t1 + vec2(0.06 * side, 0.16);
  f = min(f, cone(p, t0, t1, 0.046, 0.03));
  f = min(f, cone(p, t1, t2, 0.03, 0.015));
  f = min(f, sdCircle(p - t1, 0.046));
  return f;
}

// Seated in the reliquary. The skull is built in its own units, then set on the collar.
// Forearms are bone only where they leave the cloth. skel is bone for the rays.
float sorcerer(vec2 q, out float bare, out float skel, out float metal) {
  float d = cone(q, vec2(0.01, 0.1), vec2(0.02, -0.5), 0.14, 0.34);
  float mantle = smin(sdEllipse(q - vec2(0.0, 0.16), vec2(0.26, 0.06)), sdEllipse(q - vec2(0.0, 0.26), vec2(0.09, 0.05)), 0.035);
  d = smin(d, mantle, 0.035);
  d += 0.02 * (noise(vec2(q.x * 11.0, 1.7)) - 0.4) * smoothstep(-0.15, -0.42, q.y);
  const float SS = 0.2;
  vec2 s = (q - vec2(0.0, 0.4)) / SS;
  float cranium = sdEllipse(s - vec2(0.0, 0.14), vec2(0.34, 0.4));
  float pinch = min(sdEllipse(s - vec2(-0.32, -0.02), vec2(0.1, 0.16)), sdEllipse(s - vec2(0.32, -0.02), vec2(0.1, 0.16)));
  cranium = -smin(-cranium, pinch, 0.04);
  float skull = smin(cranium, sdEllipse(s - vec2(0.0, -0.13), vec2(0.36, 0.13)), 0.03);
  float upper = sdBox(s - vec2(0.0, -0.33), vec2(0.15, 0.05)) - 0.02;
  float jaw = sdBox(s - vec2(0.0, -0.49), vec2(0.18, 0.055)) - 0.015;
  skull = smin(skull, upper, 0.03);
  skull = smin(skull, jaw, 0.035);
  float corner = min(cone(s, vec2(-0.16, -0.5), vec2(-0.3, -0.16), 0.05, 0.025), cone(s, vec2(0.16, -0.5), vec2(0.3, -0.16), 0.05, 0.025));
  skull = smin(skull, corner, 0.03);
  float neck = sdEllipse(s - vec2(0.0, -0.64), vec2(0.09, 0.07));
  skull = smin(skull, neck, 0.05);
  float band = abs(length((s - vec2(0.0, 0.16)) / vec2(0.3, 0.38)) - 1.0) * 0.2 - 0.025;
  band = max(band, abs(s.y - 0.48) - 0.03);
  band += 0.012 * (noise(vec2(s.x * 16.0, 2.0)) - 0.5);
  float tine = cone(s, vec2(-0.16, 0.48), vec2(-0.2, 0.6), 0.035, 0.006);
  tine = min(tine, cone(s, vec2(-0.07, 0.5), vec2(-0.05, 0.64), 0.03, 0.005));
  tine = min(tine, cone(s, vec2(0.02, 0.49), vec2(0.04, 0.58), 0.038, 0.006));
  tine = min(tine, cone(s, vec2(0.1, 0.5), vec2(0.08, 0.63), 0.028, 0.005));
  tine = min(tine, cone(s, vec2(0.17, 0.47), vec2(0.21, 0.57), 0.032, 0.005));
  metal = min(band, tine) * SS;
  skull *= SS;
  d = smin(d, skull, 0.02);
  d = min(d, metal);
  float sl = cone(q, vec2(-0.12, 0.14), vec2(-0.32, 0.22), 0.12, 0.08);
  float sr = cone(q, vec2(0.12, 0.1), vec2(0.34, -0.14), 0.11, 0.065);
  d = smin(d, min(sl, sr), 0.03);
  const float HS = 0.13;
  float handL = skeletalHand(rot(0.55) * ((q - vec2(-0.42, 0.32)) / HS), -1.0) * HS;
  float handR = skeletalHand(rot(2.2) * ((q - vec2(0.46, -0.24)) / HS), 1.0) * HS;
  float ulnaL = cone(q, vec2(-0.3, 0.2), vec2(-0.4, 0.3), 0.009, 0.005);
  float radL = cone(q, vec2(-0.25, 0.18), vec2(-0.35, 0.28), 0.008, 0.004);
  float ulnaR = cone(q, vec2(0.32, -0.12), vec2(0.44, -0.22), 0.008, 0.0045);
  float radR = cone(q, vec2(0.28, -0.13), vec2(0.4, -0.22), 0.007, 0.004);
  float bones = min(min(handL, handR), min(min(ulnaL, radL), min(ulnaR, radR)));
  d = min(d, bones);
  bare = min(skull, bones);
  skel = bare;
  return d;
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float found = u_a.x;
  float dust = u_env.x;
  FLICK = 0.94 + 0.045 * sin(t * 7.3) * sin(t * 2.9 + 1.0) + 0.035 * noise(vec2(t * 3.0, 0.4));
  PULSE = beat() * (0.42 + 0.58 * found) + 0.07 + 0.34 * found;
  vec2 ld = CANDLE - p;
  KEY = normalize(vec3(ld, 0.62));
  KEYC = vec3(1.2, 0.64, 0.28);
  SKYC = vec3(0.05, 0.052, 0.07);
  LAMP = 0.32 + 0.9 * FLICK / (1.0 + 0.72 * dot(ld, ld));

  // The tomb: fitted stone gone brown with age, cooler and darker as it climbs into the vault.
  vec2 wp = p + plateDrift(0.18);
  float n1 = noise(rot(0.5) * wp * 2.4);
  float n2 = noise(rot(1.4) * wp * 6.5 + 4.0);
  float n3 = noise(rot(2.2) * wp * 13.0 + 1.7);
  vec3 stone = vec3(0.24, 0.19, 0.15) * (0.62 + 0.45 * n1 + 0.28 * n2);
  stone = mix(stone, vec3(0.12, 0.13, 0.11), smoothstep(0.58, 0.82, n1) * 0.45);
  vec2 coursing = wp * vec2(1.7, 2.8);
  coursing.x += 0.42 * noise(vec2(floor(coursing.y + 2.0), 1.3));
  float mortar = smoothstep(0.46, 0.5, abs(fract(coursing.x) - 0.5));
  mortar = max(mortar, smoothstep(0.47, 0.5, abs(fract(coursing.y) - 0.5)));
  stone *= 1.0 - 0.28 * mortar * (0.7 + 0.3 * n3);
  float b0 = noise(wp * 11.0);
  vec3 wallN = normalize(vec3(vec2(b0 - noise(wp * 11.0 + vec2(0.18, 0.0)), b0 - noise(wp * 11.0 + vec2(0.0, 0.18))) * 2.2, 1.0));
  vec3 c = shade(stone, wallN, 0.92);
  c = mix(c, c * 0.45, smoothstep(0.15, 0.85, p.y));

  // A recessed arch behind the sorcerer, the wall falling away into the dark.
  vec2 ap = p - vec2(-0.04, 0.02);
  float arch = max(length(ap / vec2(0.58, 0.78)) - 1.0, -0.62 - p.y);
  c = mix(c, c * 0.42, (1.0 - smoothstep(0.0, 0.35, arch)) * step(-0.6, p.y));

  // The library, pressed to either side of the arch: leather spines, a board under each row.
  float shelf = max(step(0.74, -p.x) * step(-0.05, p.y), step(0.7, p.x) * step(0.0, p.y));
  shelf *= step(p.y, 0.96);
  if (shelf > 0.5) {
    float row = floor(p.y * 3.6 + 1.2);
    float fy = fract(p.y * 3.6 + 1.2);
    float xw = p.x * 7.2 + row * 0.37 + noise(vec2(p.x * 1.6, row)) * 0.55;
    float id = floor(xw);
    float fx = fract(xw);
    float hsh = hash(vec2(id, row + 2.0));
    float tall = 0.62 + 0.32 * hash(vec2(id, row + 8.0));
    float gap = smoothstep(0.0, 0.045, fx) * smoothstep(1.0, 0.93, fx);
    float book = step(0.1, fy) * step(fy, 0.1 + tall * 0.78) * gap;
    vec3 leather = mix(vec3(0.16, 0.06, 0.045), vec3(0.28, 0.1, 0.07), step(0.28, hsh));
    leather = mix(leather, vec3(0.1, 0.16, 0.1), step(0.55, hsh));
    leather = mix(leather, vec3(0.32, 0.24, 0.12), step(0.78, hsh));
    leather *= 0.6 + 0.55 * hash(vec2(id, row + 5.0));
    leather += vec3(0.4, 0.3, 0.12) * smoothstep(0.05, 0.0, abs(fx - 0.16)) * step(0.4, hash(vec2(id, 1.0)));
    leather = mix(leather, vec3(0.55, 0.48, 0.36), smoothstep(0.08, 0.0, abs(fy - (0.1 + tall * 0.78))));
    vec3 bc = shade(leather, normalize(vec3((fx - 0.5) * 1.6, 0.2, 0.8)), 0.7);
    bc *= 0.7 + 0.3 * smoothstep(0.1, 0.5, fy);
    float board = smoothstep(0.1, 0.04, fy);
    vec3 wood = shade(vec3(0.18, 0.11, 0.06) * (0.75 + 0.3 * n2), vec3(0.0, 0.65, 0.75), 0.6);
    c = mix(c, mix(bc, wood, board), book);
    c = mix(c, wood * 0.7, board * (1.0 - book) * step(fy, 0.12));
  }

  // The silver plate the inscription sits on, tarnished, brushed, sunk into the stone.
  vec2 w = p - vec2(-0.02, 0.74);
  float panel = sdBox(w, vec2(0.5, 0.18)) - 0.02;
  if (panel < 0.04) {
    float tarn = noise(rot(0.3) * w * 5.0);
    float brush = noise(vec2(w.x * 2.0, w.y * 70.0));
    vec3 plate = shade(vec3(0.28, 0.27, 0.25) * (0.65 + 0.4 * tarn) * (0.8 + 0.3 * brush), vec3(0.05, 0.1, 1.0), 0.45);
    plate *= 0.55 + 0.45 * smoothstep(0.0, -0.08, panel);
    c = mix(c, plate, fill(panel, px));
    c = mix(c, shade(vec3(0.55, 0.52, 0.46) * (0.6 + 0.4 * tarn), normalize(vec3(w * 3.0, 1.0)), 0.28), stroke(panel, 0.012, px));
  }

  // The floor, flags going back under the tomb, the candle's pool lying on them.
  float horizon = -0.7;
  if (p.y < horizon) {
    float dep = max(horizon - p.y, 0.02);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.42;
    float f1 = noise(rot(0.4) * uv * 2.2);
    float f2 = noise(rot(1.2) * uv * 7.0 + 2.0);
    vec2 gv = uv * vec2(1.35, 2.1);
    gv.x += 0.5 * mod(floor(gv.y), 2.0) + 0.28 * noise(gv * 0.35);
    gv.y += 0.12 * noise(gv.yx * 0.4 + 3.0);
    float gap = smoothstep(0.4, 0.5, max(abs(fract(gv.x) - 0.5), abs(fract(gv.y) - 0.5)));
    vec3 flags = vec3(0.16, 0.13, 0.1) * (0.6 + 0.5 * f1 + 0.25 * f2);
    vec3 fl = shade(flags, normalize(vec3((f2 - 0.5) * 0.4, 0.85, 0.4)), 0.9);
    fl *= 1.0 - 0.28 * gap;
    c = mix(c, fl, smoothstep(horizon, horizon - 0.04, p.y));
  }

  // The reliquary: a stone chest, its lip catching the candle, a band of tarnished silver.
  vec2 tb = p - vec2(-0.02, -0.7);
  c = gloom(c, p, vec2(-0.02, -0.86), vec2(0.72, 0.05));
  float chest = sdBox(tb - vec2(0.0, -0.1), vec2(0.6, 0.11));
  if (chest < 0.03) {
    float wear = noise(rot(0.6) * tb * 7.0);
    vec3 tombAlb = vec3(0.26, 0.22, 0.18) * (0.7 + 0.4 * wear);
    vec3 tN = normalize(vec3((tb.x) * 0.15, -0.25, 1.0));
    c = mix(c, shade(tombAlb, tN, 0.84), fill(chest, px));
    float mould = smoothstep(0.01, 0.0, abs(abs(tb.y + 0.1) - 0.05)) * step(abs(tb.x), 0.48);
    c = mix(c, shade(tombAlb * 0.5, vec3(0.0, 0.15, 1.0), 0.7), mould);
  }
  float topF = sdBox(tb + vec2(0.0, 0.012), vec2(0.64, 0.03));
  float frontF = sdBox(tb - vec2(0.0, -0.068), vec2(0.58, 0.046));
  vec3 topC = shade(vec3(0.4, 0.34, 0.28) * (0.78 + 0.28 * n2), normalize(vec3(-0.35, 0.78, 0.52)), 0.5);
  vec3 frontC = shade(vec3(0.2, 0.16, 0.13) * (0.75 + 0.3 * noise(rot(0.5) * tb * 6.0)), vec3(-0.08, -0.2, 0.97), 0.82);
  frontC *= 1.0 - 0.5 * fill(sdBox(tb - vec2(0.0, -0.068), vec2(0.36, 0.022)), px);
  frontC *= 1.0 - 0.3 * smoothstep(0.01, 0.0, abs(abs(tb.x) - 0.2)) * fill(frontF + 0.01, px);

  // The sorcerer. The candle rakes the skull and the near folds; the phylactery answers on the far side.
  vec2 q = p - ORG;
  float bare = 1.0, skel = 1.0, metal = 1.0, body = 1.0;
  bool onBody = abs(q.x) < 0.85 && q.y > -0.7 && q.y < 0.95;
  if (onBody) body = sorcerer(q, bare, skel, metal);
  c = gloom(c, p, ORG + vec2(0.08, -0.4), vec2(0.46, 0.05));
  if (body < 0.025) {
    vec2 g = normalize(vec2(dFdx(body), dFdy(body)) + 1e-5);
    float facing = clamp(-body / 0.08, 0.0, 1.0);
    float boneM = 1.0 - smoothstep(-0.008, 0.012, bare);
    float goldM = 1.0 - smoothstep(-0.004, 0.01, metal);
    float cloth = 1.0 - max(boneM, goldM);
    vec2 s = (q - vec2(0.0, 0.4)) / 0.2;
    float dome = sdEllipse(s - vec2(0.0, 0.14), vec2(0.34, 0.4));
    vec2 sg = vec2(dFdx(dome), dFdy(dome));
    vec3 N = vec3(g * (1.0 - facing), 0.25 + 0.8 * facing);
    if (boneM > 0.4) N = vec3(sg.x, sg.y * 0.85, 0.28);
    if (goldM > 0.45) N = vec3(-0.2, 0.62, 0.72);
    N = normalize(N);
    float warp = noise(vec2(q.y * 1.8, 0.6));
    float u = q.x / max(0.34 - q.y, 0.07) + 0.45 * warp + 0.12 * sin(q.y * 5.0);
    float ridge = pow(0.5 + 0.5 * cos(u * 7.5), 2.8);
    float armU = (q.x + 0.22) / max(0.2 - q.y, 0.06);
    float armV = (q.x - 0.2) / max(0.16 - q.y, 0.06);
    float sleeves = max(pow(0.5 + 0.5 * cos(armU * 2.6), 2.0), pow(0.5 + 0.5 * cos(armV * 2.6), 2.0));
    float torso = smoothstep(0.28, 0.06, abs(q.x));
    float folds = mix(sleeves, ridge, torso);
    float pool = smoothstep(-0.18, -0.46, q.y);
    folds = mix(folds, pow(0.5 + 0.5 * cos(q.x * 3.5 + warp * 2.0), 1.5), pool);
    float rotPatch = noise(rot(0.7) * q * 3.5);
    vec3 robe = mix(vec3(0.09, 0.028, 0.024), vec3(0.18, 0.08, 0.045), smoothstep(0.55, 0.82, rotPatch));
    robe *= 0.22 + 0.95 * folds;
    robe *= 0.88 + 0.18 * noise(rot(1.2) * q * vec2(1.5, 12.0));
    vec3 bone = IVORY * (0.9 + 0.15 * noise(s * 5.0));
    float stain = smoothstep(0.45, 0.8, noise(s * vec2(2.2, 3.0)));
    stain *= smoothstep(0.2, -0.15, s.y) + smoothstep(-0.25, -0.45, s.y);
    bone = mix(bone, vec3(0.36, 0.26, 0.16), clamp(stain, 0.0, 1.0) * 0.65);
    float crack = smoothstep(0.012, 0.0, abs(s.y - 0.22 - 0.03 * sin(s.x * 7.0)));
    bone *= 1.0 - 0.5 * crack * boneM * smoothstep(0.28, 0.02, abs(s.x));
    float flake = noise(vec2(s.x * 9.0, 1.5));
    vec3 circlet = mix(vec3(0.32, 0.28, 0.2), vec3(0.14, 0.13, 0.1), 0.35 + 0.4 * flake);
    circlet = mix(circlet, vec3(0.18, 0.22, 0.16), smoothstep(0.6, 0.85, noise(s * 6.0)) * 0.45);
    vec3 alb = mix(robe, bone, boneM);
    alb = mix(alb, circlet, goldM);
    vec3 bc = shade(alb, N, mix(0.8, mix(0.5, 0.55, goldM), boneM));
    bc += KEYC * 0.07 * LAMP * cloth * smoothstep(0.6, 0.95, folds);
    bc += vec3(0.45, 0.5, 0.62) * 0.12 * boneM * smoothstep(-0.02, 0.3, s.x);
    bc += vec3(0.5, 0.42, 0.28) * 0.35 * LAMP * goldM * smoothstep(0.46, 0.52, s.y);
    // Sockets are deep holes. The brow rim above them is the brightest bone.
    vec2 el = rot(0.4) * (s - vec2(-0.14, -0.01));
    vec2 er = rot(-0.4) * (s - vec2(0.14, -0.01));
    float sock = min(sdEllipse(el, vec2(0.12, 0.1)), sdEllipse(er, vec2(0.12, 0.1)));
    float pit = smoothstep(0.01, -0.09, sock);
    bc = mix(bc, vec3(0.01, 0.008, 0.006), pit * boneM);
    vec2 dl = s - vec2(-0.14, -0.01);
    vec2 drs = s - vec2(0.14, -0.01);
    float brow = smoothstep(0.04, 0.0, abs(sdEllipse(el, vec2(0.12, 0.1)))) * smoothstep(-0.005, 0.04, dl.y);
    brow = max(brow, smoothstep(0.04, 0.0, abs(sdEllipse(er, vec2(0.12, 0.1)))) * smoothstep(-0.005, 0.04, drs.y));
    bc += bone * 0.4 * LAMP * brow * boneM * smoothstep(0.12, -0.2, s.x);
    float lowR = smoothstep(0.035, 0.0, abs(sock)) * smoothstep(0.01, -0.04, max(dl.y, -1.0) * step(s.x, 0.0) + drs.y * step(0.0, s.x));
    bc += bone * 0.12 * lowR * boneM;
    vec2 np = s - vec2(0.0, -0.19);
    float nt = clamp((np.y + 0.055) / 0.11, 0.0, 1.0);
    float na = max(abs(np.x) - 0.045 * (1.0 - nt), abs(np.y) - 0.055);
    bc = mix(bc, vec3(0.01), smoothstep(0.02, -0.01, na) * boneM);
    float upT = smoothstep(0.018, 0.0, abs(s.y + 0.39)) * smoothstep(0.16, 0.1, abs(s.x));
    float loT = smoothstep(0.016, 0.0, abs(s.y + 0.47)) * smoothstep(0.16, 0.1, abs(s.x));
    float tooth = smoothstep(0.05, 0.45, 0.5 + 0.5 * sin(s.x * 157.0));
    bc = mix(bc, bone * 1.15, (upT + loT) * tooth * boneM);
    bc = mix(bc, vec3(0.02), (upT + loT) * (1.0 - tooth) * boneM);
    bc = mix(bc, vec3(0.015), smoothstep(0.012, 0.0, abs(s.y + 0.425)) * smoothstep(0.15, 0.08, abs(s.x)) * boneM);
    bc = mix(bc, vec3(0.012), smoothstep(0.02, 0.0, abs(s.y + 0.44)) * smoothstep(0.14, 0.06, abs(s.x)) * boneM);
    float gleam = max(1.0 - smoothstep(0.0, 0.03, length(s - vec2(-0.14, -0.01))), 1.0 - smoothstep(0.0, 0.03, length(s - vec2(0.14, -0.01))));
    bc += vec3(0.7, 0.9, 0.8) * found * gleam * boneM;
    float hemHole = smoothstep(0.45, 0.75, noise(vec2(q.x * 18.0, q.y * 6.0))) * step(q.y, -0.34) * cloth;
    c = mix(c, bc, fill(body, px) * (1.0 - 0.65 * hemHole));
  }
  // The reliquary rim: a lit top face, and a darker carved front below it.
  c = mix(c, frontC, fill(frontF, px));
  c = mix(c, topC, fill(topF, px));

  // Ribs and the spine, only where the rays would find them, kept for the lens.
  float ribs = 0.0;
  if (onBody) {
    float chest = smoothstep(0.04, -0.02, body) * smoothstep(0.14, 0.02, abs(q.x)) * step(-0.05, q.y) * step(q.y, 0.28);
    ribs = chest * smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(q.y * 70.0 + abs(q.x) * 12.0));
    ribs = max(ribs, chest * smoothstep(0.012, 0.0, abs(q.x)) * 0.8);
  }

  // The candle: a pillar of wax, a pewter cup, the flame and the air it warms.
  vec2 cq = p - CANDLE;
  float wax = sdBox(cq + vec2(0.0, 0.2), vec2(0.032, 0.16)) - 0.004;
  wax = min(wax, sdEllipse(cq + vec2(-0.02, 0.08), vec2(0.012, 0.05)));
  if (wax < 0.02) {
    float u = clamp(cq.x / 0.036, -1.0, 1.0);
    vec3 waxC = shade(vec3(0.78, 0.7, 0.52) * (0.85 + 0.2 * noise(cq * 30.0)), normalize(vec3(u, 0.05, sqrt(max(1.0 - u * u, 0.0)))), 0.55);
    waxC += vec3(1.0, 0.55, 0.25) * 0.45 * FLICK * exp(-max(-cq.y - 0.02, 0.0) * 7.0);
    c = mix(c, waxC, fill(wax, px));
  }
  vec2 cup = cq + vec2(0.0, 0.4);
  float cupD = sdBox(cup, vec2(0.07, 0.02)) - 0.008;
  c = mix(c, shade(vec3(0.4, 0.39, 0.36), normalize(vec3(clamp(cup.x / 0.08, -1.0, 1.0), 0.35, 0.85)), 0.32), fill(cupD, px));
  vec2 fl = cq - vec2(0.0, 0.02);
  fl.x -= (0.01 * sin(t * 2.4) + 0.005 * sin(t * 5.5)) * clamp((fl.y + 0.03) / 0.08, 0.0, 1.0);
  float taper = 1.0 + 2.2 * clamp(fl.y / 0.06, 0.0, 1.0);
  float flame = length(vec2(fl.x * taper, fl.y * 0.4)) - 0.02;
  float core = length(vec2(fl.x * taper, (fl.y + 0.012) * 0.55)) - 0.008;
  c += KEYC * FLICK * (0.16 * exp(-length(cq) * 3.2) + 0.4 * exp(-length(cq) * 18.0));
  c = mix(c, vec3(1.0, 0.58, 0.2), fill(flame, px * 1.5) * 0.95);
  c = mix(c, vec3(1.0, 0.94, 0.8), fill(core, px * 2.0));
  c = mix(c, vec3(0.28, 0.4, 0.85), 0.55 * fill(length((fl + vec2(0.0, 0.028)) / vec2(1.0, 0.45)) - 0.01, px));

  // The phylactery, in the margin: a pewter stand, a grey stone in a twist of wire, its cold beat.
  vec2 s = p - STONE;
  float stem = sdBox(s + vec2(0.0, 0.2), vec2(0.014, 0.14));
  float su = clamp(s.x / 0.016, -1.0, 1.0);
  c = mix(c, shade(vec3(0.38, 0.38, 0.36), normalize(vec3(su, 0.0, sqrt(max(1.0 - su * su, 0.0)))), 0.32), fill(stem, px));
  c = mix(c, shade(vec3(0.36, 0.36, 0.34), vec3(0.0, 0.7, 0.7), 0.35), fill(sdEllipse(s + vec2(0.0, 0.35), vec2(0.08, 0.02)), px));
  vec2 dq = s + vec2(0.0, 0.055);
  float dish = sdEllipse(dq, vec2(0.15, 0.038));
  vec3 dishN = normalize(vec3(dq.x / 0.15, 0.55, 0.7));
  vec3 dishC = shade(vec3(0.42, 0.42, 0.4), dishN, 0.28);
  dishC += COLD * 0.16 * PULSE * exp(-length(s) * 9.0);
  c = gloom(c, p, STONE + vec2(0.03, -0.32), vec2(0.16, 0.03));
  c = mix(c, dishC, fill(dish, px));
  float rock = length(s / vec2(1.05, 0.82)) - 0.058 + 0.012 * (noise(rot(0.5) * s * 14.0) - 0.5);
  float vn = noise(rot(0.8) * s * 18.0);
  vec3 rockN = normalize(vec3(s / vec2(0.07, 0.05), 0.9) + vec3(vn - 0.5, noise(s * 18.0 + 2.0) - 0.5, 0.0) * 0.6);
  vec3 rockC = shade(vec3(0.28, 0.3, 0.27) * (0.65 + 0.5 * vn), rockN, 0.55);
  float vein = smoothstep(0.12, 0.0, abs(noise(rot(1.1) * s * 9.0) - 0.5));
  rockC += COLD * (0.08 + 0.45 * PULSE) * vein * 0.85;
  c += COLD * (0.03 + 0.1 * PULSE) * exp(-max(rock, 0.0) * 14.0);
  c = mix(c, rockC, fill(rock, px));
  float wire = max(stroke(length(s / vec2(1.0, 0.78)) - 0.048, 0.0035, px), stroke(length(s / vec2(0.7, 1.05)) - 0.04, 0.0035, px));
  c = mix(c, shade(vec3(0.72, 0.58, 0.3), normalize(vec3(s, 0.45)), 0.15) + COLD * 0.12 * PULSE, wire);

  // Dust in the candle's reach, and the dust of a long absence lying on the glass.
  vec2 mp = p * 8.0 + vec2(0.0, t * 0.04);
  vec2 mc = floor(mp);
  vec2 off = vec2(hash(mc), hash(mc + 7.1)) - 0.5;
  float mote = smoothstep(0.04, 0.0, length(fract(mp) - 0.5 - off * 0.6)) * step(0.72, hash(mc + 2.0));
  c += KEYC * mote * 0.35 * LAMP * FLICK;
  float film = dust * (0.22 + 0.28 * smoothstep(0.25, 1.15, length(p * vec2(0.72, 1.0))));
  film *= 0.65 + 0.35 * noise(p * 5.0);
  c = mix(c, vec3(0.4, 0.37, 0.31), film);
  c = mix(c, vec3(0.48, 0.44, 0.36), dust * smoothstep(0.9, 0.97, noise(p * 48.0)) * 0.22);
  c += COLD * PULSE * 0.045 * exp(-length((p - STONE) * vec2(0.9, 1.2)) * 1.6);

  c *= 1.0 - 0.22 * dot(p * vec2(0.45, 0.55), p * vec2(0.45, 0.55));

  float blocks = fill(skel, px) * 0.72 + ribs * 0.4 + fill(metal, px) * 0.5 + fill(rock, px) * 0.8;
  blocks = max(blocks, fill(min(topF, min(frontF, chest)), px) * 0.18);
  c = fluoroscope(c, p, 1.0 - blocks);
  c += COLD * beat() * 0.75 * exp(-length(s) * 12.0) * lensIn(p);
  return c;
}
`,start({stage:r,root:i,env:a}){let o=i.querySelector(`[data-vessel]`),s=i.querySelector(`[data-lich-script]`),c=!1,l=0;i.toggleAttribute(`data-dead-script`,!0);let u=()=>{c=!0,i.removeAttribute(`data-dead-script`),i.dataset.state=`found`};return o?.addEventListener(`focus`,u),s?.addEventListener(`focus`,u),i.dataset.state=`decoy`,{frame(i,o,s){let d=Math.hypot(s.x-t.x,s.y-t.y)<n;!c&&d&&(s.present||s.near>=1)&&u(),l=e(l,+!!c,2,o),r.set(`a`,[l,0,0,0]),r.set(`env`,[a.level,+!!a.on,0,0])},level:()=>l,dispose(){o?.removeEventListener(`focus`,u),s?.removeEventListener(`focus`,u),i.removeAttribute(`data-dead-script`)}}},plates:[{name:`decoy`,caption:{almanac:`The body in its reliquary, and the stone unregarded in the margin.`,cipher:`Plate I: attention on the husk; vessel not located.`}},{name:`found`,caption:{almanac:`The stone found, and its light come up.`,cipher:`Plate II: vessel located.`},a:[1,0,0,0]}]};export{r as scene};