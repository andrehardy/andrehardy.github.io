import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=.12,n=.05,r=.4,i={source:`
vec3 KEY, KEYC, SKYC;
float LAMP, HUM;
const vec3 STEEL = vec3(0.55, 0.58, 0.62);
const vec3 AMBER = vec3(1.0, 0.72, 0.38);
const float FLOOR = -0.36;
const vec2 PLAY = vec2(-0.12, 0.22);
const vec2 PLAY_R = vec2(0.62, 0.4);
const vec2 REC = vec2(0.58, -0.62);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
// The bare bulb, the cool of the empty room, and a rim where the light turns the form.
vec3 shade(vec3 alb, vec3 N, float rough) {
  float wr = max((dot(N, KEY) + 0.3) / 1.3, 0.0);
  vec3 H = normalize(KEY + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(64.0, 12.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.4);
  rim *= max(dot(normalize(N.xy + vec2(1e-4, 0.0)), normalize(KEY.xy)), 0.0);
  return alb * (SKYC * (0.55 + 0.45 * N.y) + KEYC * wr * LAMP) + KEYC * LAMP * (sp * 0.4 + rim * 0.22);
}

// A readable shroud in its own units: round cowl, narrow shoulders, a long cloth that
// tears into strands streaming back, and one sleeve reaching toward the bulb.
float shadeForm(vec2 sw) {
  vec2 w = sw / 0.42;
  float fall = clamp((-0.18 - w.y) / 0.42, 0.0, 1.0);
  vec2 ws = vec2(w.x - fall * 0.34, w.y);
  float cowl = sdEllipse(w - vec2(-0.03, 0.57), vec2(0.125, 0.115));
  float shoulder = sdEllipse(w - vec2(0.02, 0.42), vec2(0.16, 0.07));
  float body = cone(ws, vec2(0.0, 0.36), vec2(-0.04, -0.5), 0.15, 0.26);
  float d = smin(smin(cowl, shoulder, 0.03), body, 0.035);
  float strands = sin(ws.x * 95.0 + 1.6 * noise(vec2(w.y * 2.5, 1.1)));
  d += smoothstep(-0.16, -0.38, w.y) * smoothstep(0.35, -0.2, strands) * 0.16;
  float sleeve = cone(w, vec2(-0.07, 0.38), vec2(-0.25, 0.2), 0.045, 0.035);
  d = smin(d, sleeve, 0.025);
  float threads = cone(w, vec2(-0.24, 0.21), vec2(-0.36, 0.1), 0.012, 0.003);
  threads = min(threads, cone(w, vec2(-0.23, 0.19), vec2(-0.33, 0.12), 0.01, 0.0025));
  threads = min(threads, cone(w, vec2(-0.22, 0.18), vec2(-0.31, 0.08), 0.009, 0.002));
  threads = min(threads, cone(w, vec2(-0.26, 0.2), vec2(-0.34, 0.14), 0.008, 0.002));
  return min(d, threads) * 0.42;
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float t = u_time;
  float tear = u_a.x;
  float moon = u_env.x;
  vec2 bulb = vec2(-0.58 + 0.01 * sin(t * 0.5), 0.7);
  HUM = 0.94 + 0.05 * noise(vec2(t * 2.2, 1.4));
  vec2 ld = bulb - p;
  KEY = normalize(vec3(ld, 0.55));
  KEYC = AMBER;
  SKYC = vec3(0.045, 0.05, 0.055);
  LAMP = 0.28 + 0.85 * HUM / (1.0 + 0.85 * dot(ld, ld));

  // Faded green paper, the pattern worn almost out of it, damp climbing from the skirting.
  vec2 pw = p + plateDrift(0.22);
  float n1 = noise(rot(0.45) * pw * 1.4);
  float n3 = noise(rot(2.1) * pw * 14.0 + 1.0);
  vec3 paper = vec3(0.28, 0.31, 0.22) * (0.94 + 0.08 * n1);
  float damp = smoothstep(0.25, -0.55, p.y);
  paper = mix(paper, vec3(0.3, 0.2, 0.12), damp * damp * 0.55);
  paper *= 0.94 + 0.08 * n3;
  float seam = fract(pw.x * 1.7 + 0.2);
  float seamLine = smoothstep(0.02, 0.0, min(seam, 1.0 - seam));
  float b0 = noise(pw * 18.0);
  vec3 wallN = normalize(vec3(vec2(b0 - noise(pw * 18.0 + vec2(0.2, 0.0)), b0 - noise(pw * 18.0 + vec2(0.0, 0.2))) * 0.7, 1.0));
  wallN = normalize(wallN + vec3(seamLine * sign(seam - 0.5) * 0.35, 0.0, 0.0));
  vec3 c = shade(paper, wallN, 0.88);
  c *= 1.0 - 0.18 * seamLine;
  float tide = smoothstep(0.03, 0.0, abs(damp - 0.72));
  c *= 1.0 - 0.12 * tide;

  // Skirting, the top edge catching the bulb.
  float sk = p.y - FLOOR;
  if (sk > 0.0 && sk < 0.07) {
    float grainW = noise(vec2(p.x * 16.0, sk * 40.0));
    vec3 wood = shade(vec3(0.18, 0.12, 0.07) * (0.75 + 0.35 * grainW), normalize(vec3(0.0, smoothstep(0.7, 1.0, sk / 0.07), 0.8)), 0.55);
    c = wood;
  }

  // Floorboards running away under the bulb, worn where someone used to walk.
  if (p.y < FLOOR) {
    float fy = FLOOR - p.y;
    float dep = max(fy, 0.02);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.55;
    float lane = floor(uv.x * 3.2);
    float lx = fract(uv.x * 3.2);
    float along = uv.y * 0.35 + hash(vec2(lane, 2.0)) * 4.0;
    float gap = max(smoothstep(0.06, 0.0, min(lx, 1.0 - lx)), smoothstep(0.97, 1.0, fract(along)));
    float g1 = noise(rot(0.3) * vec2(lx * 3.0 + lane, along * 0.4));
    float g2 = noise(vec2(lx * 14.0, along * 1.2));
    vec3 wood = vec3(0.22, 0.13, 0.06) * (0.45 + 0.35 * hash(vec2(lane, floor(along)))) * (0.7 + 0.45 * g1);
    wood *= 0.85 + 0.15 * g2;
    vec3 fl = shade(wood, normalize(vec3((g2 - 0.5) * 0.3, 0.9, 0.35)), 0.62);
    fl *= 1.0 - 0.55 * gap;
    fl += AMBER * 0.08 * HUM * exp(-abs(p.x - bulb.x) * 1.6) * exp(-fy * 1.8);
    c = mix(c, fl, smoothstep(FLOOR + 0.01, FLOOR - 0.02, p.y));
  }
  c *= 1.0 - 0.4 * exp(-abs(p.y - FLOOR) * 48.0);

  // The paper gone cold where the moment plays. Torn, the lines shift, the picture rolls, and
  // some lines drop to a flat grey. The shade itself is never bright.
  vec2 e0 = (p - PLAY) / PLAY_R;
  float edge = length(max(abs(e0) - vec2(0.78, 0.62), 0.0)) + 0.1 * (noise(p * 2.4 + 2.0) - 0.5);
  float field = smoothstep(0.5, 0.02, edge);
  float tick = floor(t * 7.0);
  float band = floor(e0.y * 24.0);
  float thrown = step(1.0 - 0.55 * tear, hash(vec2(band, tick)));
  float roll = tear * 0.28 * fract(t * 0.4);
  vec2 ps = p - vec2(tear * thrown * (hash(vec2(tick, band)) - 0.5) * 0.22, roll);
  c = mix(c, c * 0.62 + vec3(0.1, 0.11, 0.12), field * 0.8);
  float k = fract(t / 4.0);
  vec2 at = PLAY + vec2((-0.42 + 0.84 * k) * PLAY_R.x, -0.02);
  at.y += 0.012 * abs(sin(k * 18.85));
  vec2 w = ps - at;
  w.x -= 0.02 * sin(t * 1.4 + w.y * 6.0);
  vec2 sw = w / 1.45;
  bool nearShade = abs(sw.x) < 0.55 && sw.y > -0.55 && sw.y < 0.45;
  float fig = nearShade ? shadeForm(sw) : 1.0;
  if (fig < 0.04) {
    vec2 g = normalize(vec2(dFdx(fig), dFdy(fig)) + 1e-5);
    float facing = clamp(-fig / 0.06, 0.0, 1.0);
    vec2 loc = sw / 0.42;
    float warp = noise(vec2(loc.y * 2.2, 0.7));
    float ridge = pow(0.5 + 0.5 * cos(loc.x * 52.0 + warp * 2.0), 2.3);
    vec3 N = normalize(vec3(g.x * 0.4 - (ridge - 0.5) * 0.35 * facing, g.y * 0.25, 0.85));
    vec3 smoke = vec3(0.10, 0.12, 0.15) * (0.6 + 0.8 * ridge);
    vec3 wc = mix(smoke * 0.8, shade(smoke * 2.2, N, 0.85), 0.5);
    float toLamp = max(dot(g, normalize(bulb - at)), 0.0);
    wc += vec3(0.30, 0.36, 0.42) * (smoothstep(-0.035, 0.0, fig) * toLamp + 0.25 * ridge * facing * smoothstep(0.1, -0.25, loc.x)) * 0.6;
    wc += AMBER * 0.035 * LAMP * smoothstep(0.02, -0.3, loc.x);
    float voidE = sdEllipse(loc - vec2(-0.035, 0.53), vec2(0.055, 0.07));
    float hole = smoothstep(0.0, -0.045, voidE);
    wc = mix(wc, vec3(0.012, 0.014, 0.018), hole);
    float fray = noise(vec2(loc.x * 8.0, loc.y * 4.0 + t * 0.08));
    float alpha = smoothstep(0.02, -0.008, fig) * 0.86;
    alpha *= 1.0 - 0.5 * smoothstep(0.0, 0.025, fig) * smoothstep(0.3, 0.75, fray);
    float fade = smoothstep(-0.22, -0.6, loc.y);
    alpha *= 1.0 - fade * (0.35 + 0.65 * smoothstep(0.15, 0.7, fray));
    alpha *= 1.0 - smoothstep(0.02, 0.34, loc.x) * fade;
    alpha = mix(alpha, 0.94, hole);
    alpha *= field;
    c = mix(c, wc, clamp(alpha, 0.0, 1.0));
  }
  if (nearShade) {
    float halo = exp(-max(fig, 0.0) * 4.5) * smoothstep(-0.01, 0.02, fig);
    c = mix(c, c * vec3(0.78, 0.88, 0.95) + vec3(0.01, 0.02, 0.03), halo * 0.22 * field);
  }
  // A smear of the same cold, trailing the steps, not a second body.
  vec2 behind = w - vec2(-0.12, 0.02);
  float smear = exp(-dot(behind * vec2(2.2, 3.5), behind * vec2(2.2, 3.5)) * 8.0) * field;
  c = mix(c, vec3(0.12, 0.13, 0.14), smear * 0.12 * (1.0 - smoothstep(0.15, -0.2, w.y)));
  float speck = hash(floor(p * 170.0) + tick) - 0.5;
  float hiss = step(0.988 - 0.035 * moon, hash(vec2(floor(e0.y * 80.0), floor(t * 11.0))));
  c += (vec3(0.04) * speck * (0.25 + moon) + vec3(0.035) * hiss * (0.35 + moon)) * field;
  float dropped = tear * step(0.84, hash(vec2(band + 5.0, tick)));
  c = mix(c, vec3(0.09, 0.09, 0.085), dropped * field * 0.9);

  // The recorder on the floor: a steel case, two spools, the wire past the head. Torn, the wire shakes.
  vec2 d = p - REC;
  c = gloom(c, p, REC + vec2(0.02, -0.13), vec2(0.4, 0.035));
  float box = sdBox(d, vec2(0.38, 0.12)) - 0.008;
  float hb0 = noise(d * 40.0);
  vec2 hammer = vec2(hb0 - noise(d * 40.0 + vec2(0.2, 0.0)), hb0 - noise(d * 40.0 + vec2(0.0, 0.2)));
  vec3 caseAlb = STEEL * 0.32 * (0.8 + 0.35 * noise(rot(0.4) * d * 10.0));
  if (box < 0.03) {
    vec3 frontN = normalize(vec3(hammer * 1.4, 1.0));
    c = mix(c, shade(caseAlb, frontN, 0.42), fill(box, px));
  }
  vec2 gq = d - vec2(-0.16, 0.0);
  float grille = sdBox(gq, vec2(0.1, 0.06));
  float slots = smoothstep(0.35, 0.15, abs(fract(gq.y * 28.0) - 0.5)) * step(abs(gq.x), 0.09);
  c = mix(c, c * 0.45, fill(grille, px) * slots);
  c = mix(c, shade(STEEL * 0.45, vec3(0.0, 0.2, 1.0), 0.35), stroke(grille, 0.004, px));
  vec2 lq = d - vec2(0.28, 0.05);
  c = mix(c, vec3(0.85, 0.4, 0.12) * (0.5 + 0.15 * HUM), fill(length(lq) - 0.012, px));
  c += vec3(0.9, 0.42, 0.12) * 0.1 * exp(-length(lq) * 36.0);
  float shake = tear * 0.007 * sin(t * 36.0 + p.x * 24.0);
  float wire = min(sdSegment(d, vec2(-0.2, 0.22), vec2(0.0, 0.16)), sdSegment(d, vec2(0.0, 0.16), vec2(0.2, 0.22)));
  c = mix(c, shade(vec3(0.72, 0.58, 0.36), vec3(0.15, 0.5, 0.85), 0.18), stroke(wire + shake, 0.0022, px));
  vec2 head = d - vec2(0.0, 0.15);
  c = mix(c, shade(STEEL * 0.55, vec3(0.0, 0.35, 0.94), 0.3), fill(sdBox(head, vec2(0.028, 0.02)) - 0.004, px));
  c = gloom(c, p, REC + vec2(0.0, 0.05), vec2(0.24, 0.018));
  for (int i = 0; i < 2; i++) {
    float side = float(i) * 2.0 - 1.0;
    vec2 s = d - vec2(0.2 * side, 0.26);
    float spin = t * (1.2 + 0.25 * side) * (1.0 - 0.65 * tear);
    float rad = length(s);
    vec2 a = rot(spin) * s;
    float spoke = smoothstep(0.45, 0.7, abs(cos(atan(a.y, a.x) * 3.0))) * step(0.03, rad) * step(rad, 0.09);
    float wind = 0.75 + 0.25 * sin(rad * 220.0);
    vec3 wound = shade(vec3(0.28, 0.2, 0.12) * wind, vec3(0.0, 0.15, 1.0), 0.45);
    vec3 flange = shade(STEEL * 0.4, vec3(0.0, 0.0, 1.0), 0.32);
    vec3 reel = mix(flange, mix(wound, flange * 0.5, spoke), step(rad, 0.09));
    float rt = clamp((rad - 0.1) / 0.012, -1.0, 1.0);
    vec3 rimN = normalize(vec3(normalize(s + vec2(1e-4, 0.0)) * rt, 0.35 + 0.65 * sqrt(max(1.0 - rt * rt, 0.0))));
    reel = mix(reel, shade(STEEL * 0.55, rimN, 0.22), step(0.09, rad));
    c = mix(c, reel, fill(rad - 0.112, px));
    c = mix(c, shade(vec3(0.35, 0.24, 0.14), normalize(vec3(s / 0.02, 0.8)), 0.3), fill(rad - 0.02, px));
  }

  // The bulb on its flex: clear glass, the filament, a warm pool on the air.
  vec2 holder = bulb + vec2(0.0, 0.06);
  c = mix(c, vec3(0.04, 0.035, 0.03), stroke(sdSegment(p, vec2(bulb.x, 1.15), holder), 0.003, px));
  c = mix(c, shade(vec3(0.12, 0.1, 0.08), vec3(0.0, 0.2, 0.9), 0.35), fill(sdBox(p - holder, vec2(0.016, 0.02)) - 0.003, px));
  c += AMBER * HUM * (0.14 * exp(-length(p - bulb) * 3.4) + 0.28 * exp(-length(p - bulb) * 12.0));
  vec2 bq = p - bulb;
  float glass = min(length(bq / vec2(0.85, 1.05)) - 0.042, sdBox(bq - vec2(0.0, 0.038), vec2(0.014, 0.02)));
  c = mix(c, c * 0.75 + AMBER * 0.4 * HUM, fill(glass, px));
  float coil = stroke(bq.y - 0.003 * sin(bq.x * 240.0), 0.002, px) * step(abs(bq.x), 0.014) * step(abs(bq.y), 0.02);
  c = mix(c, vec3(1.0, 0.9, 0.65), coil * HUM);

  // Dust in the bulb's light. The moon puts more grain on the whole plate.
  vec2 mp = p * 8.0 + vec2(0.0, t * 0.035);
  vec2 mc = floor(mp);
  float mote = smoothstep(0.035, 0.0, length(fract(mp) - 0.5 - (vec2(hash(mc), hash(mc + 4.0)) - 0.5) * 0.6));
  mote *= step(0.74, hash(mc + 2.0));
  c += AMBER * mote * 0.3 * LAMP;
  c += (hash(floor(p * 220.0) + floor(t * 8.0)) - 0.5) * moon * 0.04;

  c *= 1.0 - 0.16 * dot(p * vec2(0.4, 0.5), p * vec2(0.4, 0.5));

  float metal = max(fill(box, px), fill(min(length(d - vec2(-0.2, 0.26)), length(d - vec2(0.2, 0.26))) - 0.112, px));
  c = fluoroscope(c, p, 1.0 - 0.65 * metal);
  float warm = smoothstep(0.42, 0.78, noise(p * 2.4 + vec2(0.0, -t * 0.22))) * step(FLOOR, p.y);
  warm *= 1.0 - smoothstep(FLOOR, 0.9, p.y) * 0.65;
  c = mix(c, vec3(0.72, 0.28, 0.1), 0.5 * warm * lensIn(p));
  return c;
}
`,start({stage:i,root:a,env:o}){let s,c=0,l=0,u=e=>a.dataset.state=e?`torn`:`playing`;return u(!1),{frame(a,d,f){let p=scrollY/Math.max(1,innerHeight);s!==void 0&&p>s&&(c+=Math.min(n,p-s)),s=p,f.heading===-1&&f.upFor>=r&&(c=0);let m=c>=t;u(m),l=e(l,m?.6+.4*Math.min(1,f.pace*2):0,m?6:3,d),i.set(`a`,[l,0,0,0]),i.set(`env`,[o.level,+!!o.on,0,0])},level:()=>l,pause(){s=void 0},dispose(){}}},plates:[{name:`playing`,caption:{almanac:`The moment playing on the wall, the figure taking its few steps.`,cipher:`Plate I: impression in playback.`}},{name:`torn`,caption:{almanac:`The wire torn, and the moment jumping on the wall.`,cipher:`Plate II: playback disrupted.`},a:[.9,0,0,0]}]};export{i as scene};