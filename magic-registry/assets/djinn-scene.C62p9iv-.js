import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=12,n=5;function r(){let e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);e.setAttribute(`aria-hidden`,`true`),e.setAttribute(`focusable`,`false`),e.setAttribute(`width`,`0`),e.setAttribute(`height`,`0`),e.style.position=`absolute`,e.innerHTML=`<filter id="djinn-heat" x="-2%" y="-5%" width="104%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>`,document.body.append(e);let r=e.querySelector(`feDisplacementMap`),i=0;return{set(e){let a=Math.round(Math.min(1,Math.max(0,e))*t);a!==i&&(i=a,r.setAttribute(`scale`,(a/t*n).toFixed(2)),document.body.toggleAttribute(`data-heat`,a>0))},stop(){e.remove(),document.body.removeAttribute(`data-heat`)}}}var i={source:`
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
float sdTri(vec2 p, float r) {
  const float k = 1.7320508;
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}
float star6(vec2 p) { return min(abs(sdTri(p, 0.55)), abs(sdTri(vec2(p.x, -p.y), 0.55))); }

vec3 swell(float d, float depth) {
  vec2 g = normalize(vec2(dFdx(d), dFdy(d)) + 1e-6);
  float r = clamp(-d / depth, 0.0, 1.0);
  return normalize(vec3(g * (1.0 - r), 0.2 + 0.8 * r));
}

vec3 shade(vec3 alb, vec3 N, float rough) {
  vec3 L = normalize(vec3(-0.58, 0.55, 0.58));
  float wr = max((dot(N, L) + 0.22) / 1.22, 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(80.0, 14.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.2);
  vec3 key = vec3(1.08, 0.8, 0.46);
  vec3 fill = vec3(0.045, 0.06, 0.12);
  return alb * (fill * (0.42 + 0.58 * max(N.y, 0.0)) + key * wr * 1.05)
       + key * (sp * 0.85 + rim * 0.18)
       + vec3(0.4, 0.65, 1.0) * rim * 0.28 * u_a.y;
}

// Belly, shoulder, neck, lip, stopper and a foot grown out of the same brass.
float vessel(vec2 q) {
  float d = sdEllipse(q, vec2(0.33, 0.27));
  d = smin(d, sdEllipse(q - vec2(0.0, 0.16), vec2(0.2, 0.12)), 0.09);
  d = smin(d, cone(q, vec2(0.0, 0.22), vec2(0.0, 0.46), 0.078, 0.04), 0.055);
  d = smin(d, sdEllipse(q - vec2(0.0, 0.47), vec2(0.086, 0.02)), 0.025);
  d = smin(d, sdEllipse(q - vec2(0.0, 0.535), vec2(0.046, 0.04)), 0.02);
  d = min(d, sdCircle(q - vec2(0.0, 0.582), 0.015));
  d = smin(d, cone(q, vec2(0.0, -0.16), vec2(0.0, -0.36), 0.22, 0.09), 0.12);
  d = smin(d, sdEllipse(q - vec2(0.0, -0.4), vec2(0.22, 0.05)), 0.08);
  return d;
}

// A niche with straight jambs and a pointed head, cut back into the wall.
float niche(vec2 p) {
  vec2 a = p - vec2(0.06, 0.02);
  float jamb = abs(a.x) - 0.66;
  float head = max(length(a - vec2(-0.36, 0.28)) - 0.74, length(a - vec2(0.36, 0.28)) - 0.74);
  return max(max(jamb, head), -0.04 - a.y);
}

vec3 scene(vec2 p) {
  float px = 1.5 / min(u_res.x, u_res.y);
  float hold = u_a.x;
  float run = u_a.y;
  float dusk = u_env.x;
  vec2 q = p - vec2(0.06, -0.02) - plateDrift(0.42);
  vec3 air = mix(vec3(0.025, 0.03, 0.06), vec3(0.06, 0.035, 0.05), dusk);
  vec2 lampAt = vec2(-1.02, 0.58);

  vec2 w = p + plateDrift(0.14);
  float stone = noise(rot(0.4) * w * 2.2) * 0.6 + noise(rot(1.35) * w * 5.4 + 2.0) * 0.4;
  vec3 lapis = mix(vec3(0.025, 0.04, 0.1), vec3(0.09, 0.14, 0.32), stone);
  float mote = noise(rot(0.55) * w * 3.2);
  lapis = mix(lapis, vec3(0.12, 0.1, 0.16), smoothstep(0.48, 0.78, mote) * 0.35);
  float lampReach = exp(-length(p - lampAt) * 0.9);
  vec3 plaster = vec3(0.36, 0.3, 0.24) * (0.78 + 0.3 * noise(rot(0.3) * w * 3.4));
  vec3 c = shade(plaster, normalize(vec3(-0.08, 0.12, 1.0)), 0.86);
  c += vec3(1.0, 0.72, 0.38) * lampReach * 0.16;
  c += vec3(0.4, 0.12, 0.08) * dusk * smoothstep(-0.05, 0.8, p.y) * 0.22;

  // The niche falls back into deeper lapis. Shadow gathers in the arris; a thin gilt line follows it.
  float nd = niche(p - plateDrift(0.2));
  vec3 recess = mix(lapis * 0.85, vec3(0.1, 0.16, 0.32), 0.35 + 0.4 * stone);
  recess += vec3(0.16, 0.1, 0.06) * dusk * smoothstep(0.5, -0.05, p.y);
  recess += vec3(0.22, 0.15, 0.07) * lampReach * 0.35;
  c = mix(c, recess, fill(nd, px));
  float ao = smoothstep(-0.1, -0.01, nd) * (1.0 - smoothstep(0.0, 0.015, nd));
  c *= 1.0 - 0.45 * ao;
  float gilt = smoothstep(0.003, 0.0, abs(nd + 0.008)) * step(-0.02, p.y);
  c += vec3(0.32, 0.22, 0.08) * gilt * smoothstep(0.6, -0.8, p.x);
  float band = smoothstep(0.055, 0.01, abs(nd)) * step(0.0, nd);
  vec2 tf = fract(p * 15.0) - 0.5;
  vec2 tr = rot(0.785) * tf;
  float zag = min(abs(tf.x) + abs(tf.y), abs(tr.x) + abs(tr.y));
  float tile = smoothstep(0.34, 0.16, zag);
  vec3 glaze = mix(vec3(0.06, 0.2, 0.36), vec3(0.62, 0.82, 0.78), pow(clamp(0.4 - zag, 0.0, 0.4), 1.4));
  c = mix(c, glaze, band * tile * 0.92);
  if (nd > 0.03 && abs(p.y - 0.36) < 0.04) {
    float u = fract(p.x * 4.2);
    float arch = length(vec2((u - 0.5) * 1.7, (p.y - 0.34) * 8.0));
    c *= 1.0 - 0.35 * smoothstep(0.85, 0.45, arch);
    c += vec3(0.2, 0.16, 0.1) * smoothstep(0.5, 0.35, arch) * 0.25;
  }

  // Round piers beside the niche, base and capital a little wider than the shaft.
  for (int i = 0; i < 2; i++) {
    float x = i == 0 ? -1.02 : 1.08;
    vec2 cp = p - vec2(x, 0.0);
    float shaft = sdSegment(cp, vec2(0.0, -0.02), vec2(0.0, 0.66)) - 0.042;
    float base = sdEllipse(cp - vec2(0.0, -0.02), vec2(0.075, 0.04));
    float cap = sdEllipse(cp - vec2(0.0, 0.66), vec2(0.068, 0.032));
    float pier = min(shaft, min(base, cap));
    if (pier < 0.03) {
      float tt = clamp(cp.x / 0.042, -0.98, 0.98);
      vec3 pN = normalize(vec3(tt, 0.04, sqrt(1.0 - tt * tt)));
      vec3 pst = vec3(0.11, 0.1, 0.12) * (0.8 + 0.3 * noise(vec2(cp.x * 8.0, p.y * 14.0 + float(i))));
      c = mix(c, shade(pst, pN, 0.72), fill(pier, px));
    }
  }

  // Dark stone underfoot, going away to the wall, shadowed in the near foreground.
  if (p.y < -0.02) {
    float dep = max(-0.02 - p.y, 0.02);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.32 + plateDrift(0.65);
    float g1 = noise(rot(0.2) * uv * 2.4);
    float g2 = noise(rot(1.5) * uv * 6.8 + 5.0);
    float vein = smoothstep(0.6, 0.78, noise(rot(0.1) * uv * vec2(1.2, 4.8)));
    vec3 marble = mix(vec3(0.06, 0.045, 0.04), vec3(0.15, 0.12, 0.1), g1 * 0.6 + g2 * 0.4);
    marble = mix(marble, vec3(0.24, 0.18, 0.12), vein * 0.28);
    float row = uv.y * 1.2 + 0.05 * noise(uv.xx * 1.5);
    float coln = uv.x * 0.7 + 0.37 * floor(row);
    float joints = smoothstep(0.012, 0.0, abs(fract(row) - 0.5) - 0.47);
    joints = max(joints, smoothstep(0.01, 0.0, abs(fract(coln) - 0.5) - 0.47) * 0.65);
    marble *= 1.0 - 0.35 * joints;
    marble *= mix(1.05, 0.62, smoothstep(0.04, 0.9, dep));
    c = shade(marble, normalize(vec3((g2 - 0.5) * 0.25, 0.5, 0.78)), 0.88);
    c += vec3(1.0, 0.7, 0.35) * exp(-length((p - vec2(-0.55, -0.15)) * vec2(0.7, 1.4)) * 1.1) * 0.07;
    float t = clamp((-0.2 - p.y) / 0.78, 0.0, 1.0);
    float side = abs(p.x - 0.05) - mix(0.26, 0.86, t);
    float rug = max(side, max(p.y + 0.18, -1.02 - p.y));
    if (rug < 0.03) {
      float weave = noise(vec2(p.x * 7.0, t * 5.0 + 2.0));
      float pile = noise(vec2((p.x - 0.05) * 22.0, t * 30.0));
      vec3 wool = mix(vec3(0.1, 0.03, 0.035), vec3(0.2, 0.06, 0.05), weave);
      wool *= 0.78 + 0.28 * pile;
      float along = (p.x - 0.05) / mix(0.26, 0.86, t);
      float diam = abs(fract(along * 5.0 + t * 8.0) - 0.5) + abs(fract(t * 12.0) - 0.5);
      float motif = smoothstep(0.62, 0.32, diam);
      float edge = smoothstep(-0.1, -0.02, side) * step(side, -0.002);
      wool = mix(wool, mix(vec3(0.08, 0.03, 0.03), vec3(0.55, 0.38, 0.16), motif), edge);
      c = mix(c, shade(wool, normalize(vec3(0.0, 0.32, 0.9)), 0.97), fill(rug, px));
    }
  }
  c *= 1.0 - 0.4 * smoothstep(0.07, 0.0, abs(p.y + 0.02)) * smoothstep(-0.2, 0.15, p.y + 0.02);

  c = gloom(c, p, vec2(0.06, -0.46), vec2(0.36, 0.055));
  c += vec3(0.18, 0.32, 0.5) * run * (0.2 + hold) * exp(-length((p - vec2(0.08, -0.55)) * vec2(1.15, 3.4)) * 2.8);

  vec2 sp = q - vec2(0.0, 0.6);
  if (run > 0.02 && sp.y > -0.02 && sp.y < 0.62 && abs(sp.x) < 0.48) {
    float rise = clamp(sp.y / 0.55, 0.0, 1.0);
    float curl = noise(vec2(sp.x * 2.2 + sin(sp.y * 3.0 - u_time * 0.55) * 0.35, sp.y * 1.5 - u_time * 0.3));
    float curl2 = noise(rot(0.5) * sp * vec2(3.8, 2.0) + vec2(-u_time * 0.18, u_time * 0.12));
    float wid = (0.07 + 0.34 * rise) * (0.55 + 0.85 * run);
    float plume = smoothstep(wid, wid * 0.2, abs(sp.x + (curl - 0.5) * 0.55 * rise));
    plume *= (1.0 - smoothstep(0.25, 0.92, rise)) * (0.35 + 0.65 * curl2) * run;
    vec3 fire = mix(vec3(0.22, 0.18, 0.48), vec3(0.65, 0.86, 1.0), hold);
    float core = smoothstep(wid, 0.0, abs(sp.x + (curl - 0.5) * 0.3 * rise));
    c += fire * plume * (0.45 + 0.7 * core);
  }

  vec2 lp = p - lampAt - plateDrift(0.28);
  c += vec3(1.0, 0.68, 0.3) * exp(-dot(lp, lp) * 5.5) * 0.4;
  float cage = sdBox(lp - vec2(0.0, 0.02), vec2(0.032, 0.048));
  float capL = sdEllipse(lp - vec2(0.0, 0.072), vec2(0.04, 0.012));
  float footL = sdEllipse(lp - vec2(0.0, -0.035), vec2(0.026, 0.01));
  float lampBody = min(cage, min(capL, footL));
  c = mix(c, shade(vec3(0.5, 0.32, 0.1), swell(lampBody, 0.02), 0.3), fill(lampBody, px));
  float pierce = step(0.62, hash(floor((lp + 0.02) * 36.0))) * fill(cage, px);
  c = mix(c, vec3(1.0, 0.72, 0.28), pierce * 0.85);
  vec2 lr = p - lampAt;
  vec2 dg = lr * 24.0;
  vec2 dc = floor(dg);
  vec2 dof = fract(dg) - 0.5 - (vec2(hash(dc + 1.7), hash(dc + 5.3)) - 0.5) * 0.5;
  float dots = step(0.8, hash(dc)) * (1.0 - smoothstep(0.04, 0.12, length(dof)));
  dots *= exp(-length(lr) * 2.4) * smoothstep(0.08, 0.14, length(lr)) * smoothstep(-0.02, 0.02, p.y) * smoothstep(0.0, 0.03, nd);
  c += vec3(1.0, 0.78, 0.4) * dots * 0.85;

  float d = vessel(q);
  float hammer = noise(rot(0.85) * q * vec2(8.0, 20.0));
  float cell = noise(q * vec2(36.0, 40.0));
  float cell2 = noise(q * vec2(36.0, 40.0) + 9.0);
  float R = max(abs(q.x) - d, 0.02);
  float u = clamp(q.x / R, -0.98, 0.98);
  float slope = clamp(dFdy(d) * 2.2, -0.5, 0.5);
  vec3 N = normalize(vec3(u, slope, sqrt(max(1.0 - u * u, 0.0))) + vec3(cell - 0.5, cell2 - 0.5, 0.0) * 0.32);
  float fine = noise(rot(1.3) * q * vec2(26.0, 12.0));
  float tarnish = noise(rot(0.45) * q * vec2(2.0, 5.5));
  vec3 brass = mix(vec3(0.38, 0.2, 0.07), vec3(0.86, 0.6, 0.26), 0.35 + 0.5 * hammer);
  brass *= 0.86 + 0.22 * fine;
  float recessN = smoothstep(0.55, 0.08, N.z);
  brass = mix(brass, vec3(0.14, 0.24, 0.16), recessN * 0.55);
  brass = mix(brass, vec3(0.22, 0.32, 0.24), smoothstep(0.66, 0.84, tarnish) * recessN * 0.45);
  brass = mix(brass, vec3(0.16, 0.28, 0.48), smoothstep(-0.05, 0.55, q.x) * pow(max(N.z, 0.0), 0.8) * 0.38);
  vec3 metal = shade(brass, N, 0.22);
  metal += vec3(1.0, 0.9, 0.62) * pow(max(dot(N, normalize(vec3(-0.45, 0.5, 0.7))), 0.0), 14.0) * smoothstep(0.55, 0.82, cell) * 0.4;
  metal += vec3(1.0, 0.7, 0.32) * smoothstep(0.1, -0.4, q.x) * smoothstep(0.08, 0.0, abs(q.y - 0.04)) * pow(max(N.z, 0.0), 1.2) * 0.35;
  float on = fill(d, px);
  // Turned rings on the neck, and two chased bands, bright along their upper lip.
  float rings = smoothstep(0.3, 0.36, q.y) * smoothstep(0.45, 0.4, q.y);
  rings *= smoothstep(0.35, 0.48, abs(fract(q.y * 22.0) - 0.5));
  float g1 = smoothstep(0.016, 0.004, abs(q.y - 0.08));
  float g2 = smoothstep(0.014, 0.003, abs(q.y + 0.16));
  float lipH = smoothstep(0.006, 0.0, abs(q.y - 0.095)) + smoothstep(0.005, 0.0, abs(q.y + 0.145));
  float lace = smoothstep(0.18, 0.05, min(abs(fract(q.x * 14.0 + sin(q.y * 48.0)) - 0.5), abs(fract(q.x * 9.0 - q.y * 22.0) - 0.5)));
  metal *= 1.0 - 0.38 * rings - 0.28 * max(g1, g2);
  metal *= 1.0 - 0.4 * lace * max(g1, g2);
  metal += vec3(1.0, 0.88, 0.6) * lipH * pow(max(N.z, 0.0), 1.4) * max(dot(N, normalize(vec3(-0.5, 0.4, 0.6))), 0.0);
  c = mix(c, metal, on);

  vec2 sealAt = q - vec2(0.0, 0.535);
  float wax = sdCircle(sealAt, 0.052);
  float star = star6(sealAt / 0.078);
  float split = smoothstep(0.01 + 0.008 * hold, 0.0, abs(sealAt.x)) * step(0.12, run);
  vec3 waxC = shade(vec3(0.4, 0.08, 0.06) * (0.85 + 0.25 * noise(sealAt * 30.0)), swell(wax, 0.035), 0.5);
  waxC *= mix(1.0, 0.4, 1.0 - smoothstep(0.012, 0.055, star));
  waxC = mix(waxC, vec3(0.7, 0.88, 1.0), split * (0.35 + 0.65 * hold));
  c = mix(c, waxC, fill(wax, px) * on);

  float reach = mix(0.5, -0.34, clamp(run * 1.08, 0.0, 1.0));
  float jag = (noise(vec2(q.y * 8.0, 1.7)) - 0.5) * 0.045 + (noise(vec2(q.y * 21.0, 4.0)) - 0.5) * 0.016;
  float cx = 0.03 + jag;
  float span = step(reach, q.y) * step(q.y, 0.5) * step(0.03, run) * on;
  float wid = 0.004 + 0.01 * hold + 0.005 * run;
  float core = smoothstep(wid, 0.0, abs(q.x - cx)) * span;
  float scorched = smoothstep(wid * 2.8, wid * 0.6, abs(q.x - cx)) * span;
  float branch = smoothstep(0.005, 0.0, abs((q.y + 0.02) - (q.x - 0.04) * 1.6)) * step(0.02, q.x) * step(q.x, 0.16);
  branch *= step(-0.08, q.y) * step(q.y, 0.08) * step(0.45, run) * on;
  c = mix(c, c * 0.22, max(scorched, branch) * (1.0 - core) * 0.9);
  vec3 leak = mix(vec3(0.22, 0.38, 0.75), vec3(0.62, 0.84, 1.0), hold);
  c = mix(c, leak, core * (0.55 + 0.4 * hold));
  c = mix(c, leak * 0.8, branch * 0.7);
  c += leak * exp(-abs(q.x - cx) * 22.0) * span * 0.08 * hold;

  c = veil(c, air, smoothstep(0.2, 1.05, p.y) * 0.2);
  c += vec3(0.07, 0.09, 0.18) * dusk * exp(-length(p - vec2(0.04, 0.08)) * 1.35) * 0.5;

  float shell = smoothstep(0.02, -0.002, d) * (1.0 - smoothstep(-0.008, -0.03, d));
  float hollow = smoothstep(-0.01, -0.04, d) * step(-0.28, q.y) * step(q.y, 0.46);
  float ang = atan(q.x, q.y + 0.02);
  float rad = length((q - vec2(0.0, -0.02)) * vec2(1.15, 1.0));
  float coil = smoothstep(0.045, 0.0, abs(fract(rad * 3.4 - ang * 0.18) - 0.5));
  coil *= hollow * step(0.02, run);
  float passes = mix(0.92, 0.06, shell);
  passes = mix(passes, 0.22, step(0.0, -d) * (1.0 - hollow) * on);
  passes = mix(passes, 0.38 + 0.15 * hold, hollow);
  passes = mix(passes, 1.05, coil);
  c = fluoroscope(c, p, passes);
  return c;
}
`,start({stage:t,root:n,env:i}){let a=0,o=0,s=r();return{frame(r,c,l){let u=l.held>0;a=u?Math.min(1,a+c/4):e(a,0,3,c);let d=1+ +!!i.on;o=u?Math.min(1,o+c/5*d):e(o,0,.8,c),t.set(`a`,[a,o,0,0]),t.set(`env`,[+!!i.on,0,0,0]),n.dataset.state=o>.05?`cracked`:`sealed`,s.set(a)},level:()=>Math.max(a,o),pause(){a=0,s.set(0)},dispose(){s.stop()}}},plates:[{name:`cracked`,caption:{almanac:`The sealed vessel, with its crack drawn in.`,cipher:`Plate: the vessel at the extent of a held press.`},a:[0,.6,0,0]}]};export{i as scene};