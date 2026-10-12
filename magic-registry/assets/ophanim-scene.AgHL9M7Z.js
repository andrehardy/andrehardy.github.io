import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
const float R = 0.56;
const float FIELD = 0.94;
const float EYES = 16.0;
const float W = 0.042;
const vec3 KEY = vec3(-0.45, 0.6, 0.66);

// The wheels' askew: turned about the upright, then tipped toward the eye.
vec3 askew(vec3 v) {
  float cy = cos(0.6), sy = sin(0.6), cx = cos(0.5), sx = sin(0.5);
  v = vec3(cy * v.x + sy * v.z, v.y, -sy * v.x + cy * v.z);
  return vec3(v.x, cx * v.y - sx * v.z, sx * v.y + cx * v.z);
}

// Nearness to one rim (a circle of radius R spanned by u and v), the angle round it of the
// nearest point, that point's depth (toward the eye is positive), and the way out across it.
float rim(vec2 p, vec3 u, vec3 v, out float phi, out float z, out vec2 g) {
  mat2 inv = inverse(mat2(u.xy, v.xy) * R);
  vec2 cs = inv * p;
  float k = length(cs);
  phi = atan(cs.y, cs.x);
  z = R * (cos(phi) * u.z + sin(phi) * v.z);
  vec2 grad = transpose(inv) * (cs / max(k, 1e-4));
  g = normalize(grad) * sign(k - 1.0);
  // The ellipse's level, divided by its slope: a distance with no seam in it.
  return abs(k - 1.0) / length(grad);
}

// An almond with its points along x: the eye, without a lid.
float almond(vec2 e) {
  e = abs(e.yx);
  const float r = 1.0, d = 0.6, b = 0.8;
  return ((e.y - b) * d > e.x * b) ? length(e - vec2(0.0, b)) : length(e - vec2(-d, 0.0)) - r;
}

// One eye on a rim, sunk in its socket: its colour (rgb) and how much of it there is (a).
vec4 eye(vec2 p, vec3 u, vec3 v, float phi, float ring, float px) {
  float k = floor(phi / (2.0 * PI) * EYES + 0.5 - ring * 0.37);
  float at = (k + ring * 0.37) * 2.0 * PI / EYES;
  vec2 c = R * (cos(at) * u.xy + sin(at) * v.xy);
  float z = R * (cos(at) * u.z + sin(at) * v.z);
  vec2 t = normalize(-sin(at) * u.xy + cos(at) * v.xy);
  vec2 n = vec2(-t.y, t.x);
  float size = 0.058 * (z < 0.0 ? 0.8 : 1.0);
  vec2 e = vec2(dot(p - c, t), dot(p - c, n)) / size;
  float edge = almond(e) * size;
  float socket = fill(edge - 0.016, px);
  if (socket <= 0.0) return vec4(0.0);
  float h = hash(vec2(k, ring * 7.0));
  vec2 wander = vec2(sin(u_time * 0.31 + h * 6.28), cos(u_time * 0.23 + h * 9.1));
  vec2 toward = u_b.xy - c;
  vec2 look = normalize(toward + 1e-4) * smoothstep(0.0, 0.4, length(toward)) * (1.0 - u_b.z);
  vec2 gz = mix(wander * 0.7, look, u_a.x);
  vec2 iris = vec2(dot(gz, t) * 0.32, dot(gz, n) * 0.12);
  // The ball: wet, bulging out of the socket, shadowed where it sinks under the metal.
  vec3 bn = normalize(vec3(e * 0.9, 1.0));
  float dif = 0.5 + 0.5 * max(dot(bn, normalize(KEY)), 0.0);
  vec3 c3 = mix(vec3(0.55, 0.46, 0.38), vec3(0.95, 0.92, 0.87), u_a.y) * dif;
  c3 = mix(c3, c3 * vec3(1.0, 0.72, 0.68), smoothstep(0.45, 0.85, abs(e.x)));
  c3 *= 1.0 - 0.55 * smoothstep(0.3, 1.0, length(e * vec2(0.85, 1.8)));
  float vein = 1.0 - abs(noise(vec2(e.x * 6.0, e.y * 22.0) + h * 9.0) * 2.0 - 1.0);
  c3 = mix(c3, vec3(0.62, 0.2, 0.16), 0.45 * smoothstep(0.86, 0.97, vein) * smoothstep(0.4, 0.8, abs(e.x)));
  // The iris: its fibres, its dark limbal ring, burning from within at night; the pupil.
  vec2 ie = e - iris;
  float ir = length(ie);
  float ang = atan(ie.y, ie.x);
  float fib = 0.6 * noise(vec2(ang * 9.0 + h * 20.0, ir * 6.0)) + 0.4 * noise(vec2(ang * 26.0 + h * 7.0, ir * 14.0));
  vec3 irisC = mix(vec3(0.8, 0.46, 0.1), vec3(0.32, 0.36, 0.14), smoothstep(0.16, 0.34, ir + 0.04 * (fib - 0.5))) * (0.45 + 0.85 * fib);
  irisC = mix(irisC, vec3(0.95, 0.68, 0.25), 0.5 * stroke(ir - 0.2 - 0.025 * sin(ang * 9.0 + h * 5.0), 0.015, 0.02));
  irisC *= 1.0 - 0.75 * smoothstep(0.29, 0.37, ir);
  irisC *= 0.8 + 0.3 * smoothstep(0.37, 0.0, length(ie - vec2(-0.12, 0.12)));
  irisC += vec3(1.0, 0.55, 0.14) * (1.0 - u_a.y) * fib * fib * 1.6 * smoothstep(0.37, 0.12, ir) * smoothstep(0.08, 0.16, ir);
  c3 = mix(c3, irisC * mix(1.0, 0.8, u_a.y), fill(ir - 0.37, 0.04));
  c3 = mix(c3, vec3(0.008), fill(ir - mix(0.1, 0.15, u_b.z * u_a.x), 0.02));
  c3 += vec3(1.0, 0.98, 0.94) * 0.7 * fill(sdBox(rot(0.3) * (e - vec2(-0.2, 0.17)), vec2(0.07, 0.045)) - 0.02, 0.03);
  c3 += vec3(1.0) * 0.15 * fill(length(e - vec2(0.24, -0.16)) - 0.03, 0.04);
  c3 *= 1.0 - 0.5 * smoothstep(0.18, -0.02, -edge / size);
  // The bezel of raised gold it is set in, like a stone, so that it stands out of its wheel.
  float lip = socket * (1.0 - fill(edge, px));
  vec2 out_ = normalize(vec2(dot(p - c, t), dot(p - c, n)) + 1e-4);
  float bev = clamp(edge / 0.016, 0.0, 1.0) * 2.0 - 1.0;
  vec3 ln = normalize(vec3(out_ * bev, 0.8));
  float ld = max(dot(ln, normalize(KEY)), 0.0);
  vec3 bez = vec3(0.6, 0.44, 0.18) * (0.08 + 0.6 * ld) * mix(0.5, 1.4, u_a.y) + vec3(1.0, 0.9, 0.65) * 0.5 * pow(max(dot(ln, normalize(normalize(KEY) + vec3(0.0, 0.0, 1.0))), 0.0), 30.0);
  bez += vec3(1.0, 0.55, 0.15) * 0.25 * (1.0 - u_a.y) * smoothstep(0.016, 0.0, edge);
  c3 = mix(c3, bez, lip);
  return vec4(c3 * (z < 0.0 ? 0.45 : 1.0) * mix(1.0, 1.25, u_a.y), socket);
}

vec3 scene(vec2 p) {
  float px = 2.0 / min(u_res.x, u_res.y);
  float r = length(p);
  float fire = u_a.y;

  // The field: lapis by day; by night a deep sky, a faint drift of nebula, the stars steady in
  // their magnitudes and colours.
  float neb = fbm(p * 1.6 + 4.0), neb2 = fbm(rot(0.7) * p * 3.2 - 2.0);
  vec3 night = vec3(0.006, 0.01, 0.035) + vec3(0.07, 0.03, 0.09) * smoothstep(0.4, 0.85, neb) + vec3(0.0, 0.05, 0.07) * smoothstep(0.45, 0.85, neb2);
  night += vec3(0.08, 0.05, 0.03) * smoothstep(0.7, 0.1, r) * (0.5 + 0.5 * neb2);
  night *= 0.8 + 0.4 * smoothstep(0.55, 0.75, neb2 + 0.2 * neb);
  vec3 day = vec3(0.08, 0.13, 0.32) * (0.9 + 0.15 * fbm(p * 2.0));
  vec3 c = mix(night, day, fire * 0.85);
  for (int l = 0; l < 2; l++) {
    float sc = 40.0 + 45.0 * float(l);
    vec2 sg = floor(p * sc);
    float sh = hash(sg + float(l) * 31.0);
    vec2 so = vec2(hash(sg + 3.1), hash(sg + 7.7)) * 0.6 + 0.2;
    float mag = step(0.985, sh) * (0.4 + 0.6 * hash(sg + 11.0));
    float star = mag * exp(-length(fract(p * sc) - so) * sc * 0.9 / (0.5 + mag));
    vec3 hue = mix(vec3(1.0, 0.85, 0.7), vec3(0.75, 0.85, 1.0), hash(sg + 5.0));
    c += hue * star * (1.0 - fire) * 0.9;
  }

  // The reticle: two hairs etched fine in the glass, their ticks, a small circle at the centre.
  vec3 hair = vec3(0.48, 0.44, 0.36) * 0.7;
  float hairs = max(stroke(p.x, 0.0012, px), stroke(p.y, 0.0012, px));
  float ticks = max(
    stroke(p.x, 0.012, px) * stroke(fract(p.y * 10.0 + 0.5) - 0.5, 0.006, px * 10.0),
    stroke(p.y, 0.012, px) * stroke(fract(p.x * 10.0 + 0.5) - 0.5, 0.006, px * 10.0));
  hairs = max(max(hairs, ticks), stroke(r - 0.12, 0.0012, px));
  c = mix(c, hair, hairs);

  // The wheels: beaten gold, banded and chased, drawn the far parts first so that the near pass
  // over them and shade them; then their eyes.
  vec3 us[3] = vec3[3](vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1));
  vec3 vs[3] = vec3[3](vec3(0, 1, 0), vec3(0, 0, 1), vec3(1, 0, 0));
  float ds[3], zs[3], phis[3];
  vec2 gs[3];
  for (int i = 0; i < 3; i++) {
    ds[i] = rim(p, askew(us[i]), askew(vs[i]), phis[i], zs[i], gs[i]);
  }
  int o0 = 0, o1 = 1, o2 = 2, tmp;
  if (zs[o0] > zs[o1]) { tmp = o0; o0 = o1; o1 = tmp; }
  if (zs[o1] > zs[o2]) { tmp = o1; o1 = o2; o2 = tmp; }
  if (zs[o0] > zs[o1]) { tmp = o0; o0 = o1; o1 = tmp; }
  int order[3] = int[3](o0, o1, o2);
  vec3 glow = vec3(0.0);
  vec3 L = normalize(KEY);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  for (int j = 0; j < 3; j++) {
    int i = order[j];
    vec3 u = askew(us[i]), v = askew(vs[i]);
    float d = ds[i], phi = phis[i], z = zs[i];
    float facing = smoothstep(-0.08, 0.08, z);
    float depth = mix(0.5, 1.0, facing);
    c *= 1.0 - 0.45 * smoothstep(0.075, W, d) * (j > 0 ? 1.0 : 0.0);
    float band = fill(d - W, px);
    float across = clamp(d / W, 0.0, 1.0);
    vec3 N = normalize(vec3(gs[i] * across, sqrt(1.0 - across * across) + 0.02));
    float beaten = 0.6 * noise(vec2(phi * 38.0 + float(i) * 5.0, across * 3.0)) + 0.4 * noise(vec2(phi * 110.0, across * 9.0 + float(i)));
    N = normalize(N + vec3(0.12 * (beaten - 0.5), 0.12 * (noise(vec2(phi * 38.0 + 9.0, across * 3.0)) - 0.5), 0.0));
    vec3 gold = vec3(0.58, 0.42, 0.17) * (0.8 + 0.35 * beaten);
    gold *= 1.0 - 0.55 * stroke(across - 0.62, 0.07, 0.03);
    float chase = stroke(fract(phi / (2.0 * PI) * EYES * 6.0 + float(i) * 0.37) - 0.5, 0.12, 0.05) * stroke(across - 0.82, 0.06, 0.03);
    gold *= 1.0 - 0.45 * chase;
    float diff = max(dot(N, L), 0.0);
    float sp = pow(max(dot(N, H), 0.0), 36.0);
    vec3 Rv = vec3(2.0 * N.z * N.xy, 2.0 * N.z * N.z - 1.0);
    vec3 sky = mix(vec3(0.03, 0.025, 0.06), vec3(0.3, 0.22, 0.4), smoothstep(-0.3, 0.9, Rv.y)) + vec3(0.25, 0.18, 0.1) * smoothstep(0.2, -0.6, Rv.y);
    float nearEye = pow(0.5 + 0.5 * cos((phi / (2.0 * PI) * EYES - float(i) * 0.37) * 2.0 * PI), 6.0);
    vec3 dark = gold * (0.02 + 0.14 * diff + 0.7 * sky) + vec3(0.95, 0.85, 0.6) * sp * 0.22;
    dark += gold * vec3(1.0, 0.45, 0.12) * 1.3 * nearEye * (1.0 - across * 0.6);
    vec3 blaze = mix(vec3(1.0, 0.6, 0.12), vec3(1.0, 0.96, 0.84), N.z * N.z) * (1.05 + 0.25 * diff) + vec3(1.0) * sp * 0.4;
    c = mix(c, mix(dark, blaze, fire) * depth, band * mix(0.85, 1.0, facing));
    glow += vec3(1.0, 0.68, 0.25) * exp(-d * 22.0) * fire * 0.5 * depth;
    vec4 e = eye(p, u, v, phi, float(i), px);
    c = mix(c, e.rgb, e.a);
    glow += vec3(1.0, 0.5, 0.14) * exp(-max(d, 0.0) * 30.0) * (1.0 - fire) * (0.03 + 0.22 * nearEye) * depth;
  }
  c += glow + vec3(1.0, 0.85, 0.55) * exp(-r * 2.6) * fire * 0.18;

  // The eyepiece: the edge of the field, its colour fringe, and the knurled brass of the collar.
  c *= mix(1.0, 0.72, smoothstep(FIELD - 0.25, FIELD, r));
  c = mix(c, c * vec3(0.85, 0.92, 1.18), smoothstep(FIELD - 0.08, FIELD, r));
  if (lensIn(p) > 0.0) c = fluoroscope(c, p, 1.0);
  c = mix(vec3(0.006, 0.005, 0.008), c, fill(r - FIELD, px * 1.5));
  float ct = clamp((r - FIELD - 0.03) / 0.022, -1.0, 1.0);
  vec2 rd = p / max(r, 1e-4);
  vec3 cN = normalize(vec3(rd * ct, sqrt(1.0 - ct * ct) + 0.05));
  float knurl = 0.8 + 0.2 * step(0.5, fract(atan(p.y, p.x) * 60.0 / 6.2832));
  vec3 collar = vec3(0.52, 0.4, 0.2) * knurl * (0.12 + 0.6 * max(dot(cN, L), 0.0)) + vec3(1.0, 0.9, 0.7) * 0.25 * pow(max(dot(cN, H), 0.0), 30.0);
  c = mix(c, collar, fill(abs(r - FIELD - 0.03) - 0.022, px));
  c = mix(c, vec3(0.01), stroke(r - FIELD - 0.003, 0.003, px));
  return c;
}
`,n=.15,r={source:t,start({stage:t,root:r,env:i}){let a=i.on?1:i.level*.35,o=0,s=0,c=0,l=0;return{frame(u,d,f){let p=f.near>n;o=e(o,+!!p,p?4:1.2,d);let m=document.activeElement===r&&!f.present;l=e(l,+!!m,5,d),s=e(s,f.x,8,d),c=e(c,f.y,8,d),t.set(`a`,[o,a,0,0]),t.set(`b`,[s,c,l,0]),t.set(`env`,[i.level,+!!i.on,0,0]),r.dataset.state=o>.5?`attending`:i.on?`blazing`:`watching`},level:()=>Math.max(o*.8,a*.3),dispose(){}}},plates:[{name:`blazing`,caption:{almanac:`At noon, the rims blazing and every eye looking out.`,cipher:`Plate I: full intensity; all eyes forward.`},a:[1,1,0,0],b:[0,0,1,0]},{name:`watching`,caption:{almanac:`At night, the rims dark and only the eyes alight.`,cipher:`Plate II: rings dark; eyes lit, forward.`},a:[1,0,0,0],b:[0,0,1,0]}]};export{r as scene};