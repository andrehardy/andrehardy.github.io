import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=`
const float HORIZON = 0.22;
const vec2 POOL = vec2(0.4, 0.05);
const vec3 COLD = vec3(0.50, 0.95, 0.84);

float glowAt(vec2 p, vec2 at, float size) { vec2 d = p - at; return size * size / (dot(d, d) + size * size); }

// The bog's floor in perspective: depth rises toward the horizon.
vec2 ground(vec2 p) { float z = 0.6 / max(HORIZON - p.y + 0.02, 0.02); return vec2(p.x * z, z); }
float poolAt(vec2 g) { return fbm(g * vec2(1.4, 2.4) + 4.0) - 0.43; }
float pool(vec2 g) { return smoothstep(0.012, -0.012, poolAt(g)); }

// What the peat keeps, as the rays find it: 1 where they pass, toward 0 where something stops them.
float peat(vec2 p, vec2 g) {
  float passes = mix(0.72, 0.9, pool(g));
  float path = abs(g.x + 0.6 - 0.18 * g.y) - 0.35;
  float planks = step(path, 0.0) * step(fract(g.y * 3.5), 0.62) * step(g.y, 3.6);
  passes = mix(passes, 0.32, planks);
  vec2 b = rot(0.55) * (p - vec2(-0.62, -0.62));
  float blade = min(sdEllipse(b - vec2(0.0, 0.07), vec2(0.03, 0.13)), sdBox(b + vec2(0.0, 0.09), vec2(0.008, 0.05)));
  passes = mix(passes, 0.06, fill(blade, 0.004));
  vec2 f = p - vec2(0.55, -0.5);
  float face = fill(sdEllipse(f, vec2(0.10, 0.13)), 0.006);
  float holes = fill(sdCircle(vec2(abs(f.x) - 0.038, f.y - 0.03), 0.02), 0.004)
              + fill(sdEllipse(f + vec2(0.0, 0.06), vec2(0.03, 0.01)), 0.004);
  passes = mix(passes, 0.3, face);
  return mix(passes, 0.78, clamp(holes, 0.0, 1.0) * face);
}

// Sedge at the near edge of the bog: a blade per column, bent, the near ones taller.
float sedge(vec2 p, float px) {
  float w = 0.018;
  float blades = 0.0;
  for (int i = -1; i <= 1; i++) {
    float id = floor(p.x / w) + float(i);
    float h = hash(vec2(id, 4.2));
    float tall = 0.06 + 0.2 * h * h;
    float base = -1.0 + 0.03 * hash(vec2(id, 1.3));
    float lean = (hash(vec2(id, 8.8)) - 0.5) * 0.12 + 0.01 * sin(u_time * 0.7 + id);
    float v = clamp((p.y - base) / tall, 0.0, 1.0);
    float x = (id + 0.5) * w + lean * v * v;
    float half_ = 0.0035 * (1.0 - v);
    blades = max(blades, (1.0 - smoothstep(half_ - px, half_ + px, abs(p.x - x))) * step(p.y, base + tall) * step(base, p.y));
  }
  return blades;
}

vec3 scene(vec2 p) {
  float day = u_a.w;
  float lit = (1.0 - u_a.z) * mix(1.0, 0.0, day);
  vec2 wisp = POOL + u_a.xy;
  float px = 1.5 / min(u_res.x, u_res.y);
  float flick = 0.85 + 0.15 * noise(vec2(u_time * 3.0, 7.0));

  // The sky: a faint band of air over the horizon, the stars soft and of many magnitudes.
  vec3 sky = mix(vec3(0.06, 0.075, 0.085), vec3(0.01, 0.014, 0.026), smoothstep(HORIZON, 1.0, p.y));
  vec3 daySky = mix(vec3(0.46, 0.48, 0.45), vec3(0.34, 0.37, 0.38), smoothstep(HORIZON, 1.0, p.y));
  vec3 c = mix(sky, daySky, day);
  vec2 sg = floor(p * 90.0);
  vec2 so = vec2(hash(sg + 3.1), hash(sg + 7.7)) * 0.6 + 0.2;
  float mag = step(0.993 - 0.004 * u_env.x, hash(sg)) * (0.3 + 0.7 * hash(sg + 11.0));
  float star = mag * exp(-length(fract(p * 90.0) - so) * 9.0 / (0.4 + mag));
  c += mix(vec3(0.9, 0.85, 0.75), vec3(0.7, 0.8, 1.0), hash(sg + 5.0)) * star * (1.0 - day)
     * smoothstep(HORIZON + 0.05, HORIZON + 0.3, p.y) * (0.5 + 0.7 * u_env.x);

  // The moon low behind drifting cloud, silvering its edges.
  vec2 moonAt = vec2(-0.78, 0.6);
  float cl = fbm(vec2(p.x * 1.1 + u_time * 0.006, p.y * 3.6) + 3.0);
  float cloud = smoothstep(0.4, 0.66, cl) * smoothstep(HORIZON + 0.05, HORIZON + 0.35, p.y) * smoothstep(1.0, 0.45, p.y);
  float moonGlow = exp(-length(p - moonAt) * 3.5) * (1.0 - day);
  c += vec3(0.16, 0.18, 0.2) * moonGlow * (0.4 + 0.6 * u_env.x);
  c = mix(c, vec3(0.86, 0.88, 0.84) * (0.9 + 0.1 * noise((p - moonAt) * 50.0)), fill(length(p - moonAt) - 0.045, px) * (1.0 - day) * (1.0 - 0.8 * cloud));
  vec3 cloudC = mix(vec3(0.035, 0.042, 0.05), mix(vec3(0.3, 0.32, 0.33), vec3(0.62, 0.62, 0.6), smoothstep(0.5, 0.8, cl + 0.15 * (p.y - 0.5))), day)
              + vec3(0.25, 0.27, 0.28) * moonGlow * smoothstep(0.72, 0.5, cl);
  c = mix(c, cloudC, cloud * 0.85);

  // Two lines of hills, the far one gone into the air.
  float far = HORIZON + 0.06 + 0.05 * fbm(vec2(p.x * 0.9 + 7.0, 1.0));
  vec3 farHill = mix(vec3(0.02, 0.025, 0.028), vec3(0.3, 0.32, 0.3), day);
  c = mix(c, veil(farHill, c, 0.5), fill(p.y - far - plateDrift(0.8).y, px));
  float hills = HORIZON + 0.035 + 0.05 * fbm(vec2(p.x * 1.4, 2.0));
  vec3 hill = mix(vec3(0.012, 0.014, 0.013), vec3(0.22, 0.24, 0.2), day);
  hill *= 0.72 + 0.4 * fbm(vec2(p.x * 1.6, 3.0));
  c = mix(c, veil(hill, c, 0.3), fill(p.y - hills - plateDrift(0.6).y, px));

  // A bog oak, long dead, standing in the moss: its limbs broken short, silver where the moon has it.
  vec2 oq = p - vec2(-0.62, HORIZON - 0.09);
  if (abs(oq.x) < 0.25 && oq.y > -0.02 && oq.y < 0.62) {
    float tr = sdSegment(oq, vec2(0.0, -0.02), vec2(0.03, 0.34)) - mix(0.04, 0.016, clamp(oq.y / 0.34, 0.0, 1.0)) - 0.025 * smoothstep(0.05, -0.02, oq.y);
    float k = 0.025;
    float br = sdSegment(oq, vec2(0.03, 0.32), vec2(-0.02, 0.5)) - mix(0.014, 0.004, clamp((oq.y - 0.32) / 0.18, 0.0, 1.0));
    br = min(br, sdSegment(oq, vec2(0.025, 0.2), vec2(0.15, 0.33)) - mix(0.014, 0.006, clamp((oq.x - 0.02) / 0.13, 0.0, 1.0)));
    br = min(br, sdSegment(oq, vec2(0.15, 0.33), vec2(0.2, 0.44)) - 0.004);
    br = min(br, sdSegment(oq, vec2(0.025, 0.27), vec2(-0.11, 0.38)) - mix(0.012, 0.005, clamp(-oq.x / 0.11, 0.0, 1.0)));
    br = min(br, sdSegment(oq, vec2(-0.11, 0.38), vec2(-0.17, 0.37)) - 0.003);
    br = min(br, sdSegment(oq, vec2(0.01, 0.1), vec2(-0.08, 0.16)) - 0.008);
    float h_ = clamp(0.5 + 0.5 * (br - tr) / k, 0.0, 1.0);
    tr = mix(br, tr, h_) - k * h_ * (1.0 - h_);
    tr += 0.006 * (noise(oq * vec2(60.0, 15.0)) - 0.5);
    float silver = smoothstep(0.0, -0.012, tr) * smoothstep(-0.02, 0.0, tr + 0.01) * step(oq.x, 0.02 + 0.1 * oq.y);
    vec3 bark = mix(vec3(0.012, 0.013, 0.014), vec3(0.15, 0.14, 0.12), day) * (0.7 + 0.5 * noise(vec2(oq.x * 200.0, oq.y * 20.0)));
    bark += vec3(0.22, 0.24, 0.25) * silver * (1.0 - day) * (0.4 + 0.6 * u_env.x) * 0.5;
    c = mix(c, bark, fill(tr, px));
  }

  if (p.y < HORIZON) {
    vec2 g = ground(p);
    float near = smoothstep(HORIZON, -1.0, p.y);
    // The moss in hummocks: sphagnum red, ochre and olive, heather dark in the hollows, the rises
    // turned to the sky and the sedge standing in tussocks.
    float moss = fbm(g * vec2(2.5, 1.2));
    float patchy = noise(rot(0.6) * g * vec2(7.0, 4.0));
    vec2 hq = g * vec2(3.0, 1.6);
    float h0 = noise(hq);
    vec2 hg = vec2(noise(hq + vec2(0.15, 0.0)) - h0, noise(hq + vec2(0.0, 0.15)) - h0) * 6.0 * near;
    float tx = p.x * mix(90.0, 260.0, near);
    float tuss = mix(0.5, noise(vec2(tx, p.y * 24.0 + floor(tx) * 0.37)), near);
    vec3 land = mix(vec3(0.24, 0.25, 0.12), vec3(0.40, 0.31, 0.15), smoothstep(0.35, 0.65, moss));
    land = mix(land, vec3(0.34, 0.17, 0.1), smoothstep(0.5, 0.85, patchy) * 0.45);
    land = mix(land, vec3(0.12, 0.10, 0.08), smoothstep(0.58, 0.78, noise(g * 1.7 + 2.0)) * 0.7);
    land *= (0.75 + 0.5 * clamp(dot(hg, vec2(-0.5, 0.8)), -0.6, 0.6)) * (0.8 + 0.45 * tuss)
          * (0.85 + 0.3 * grain(g * vec2(30.0, 14.0)));
    vec3 col = land * mix(vec3(0.15, 0.17, 0.21), vec3(1.0), day);
    vec2 toW = normalize(wisp - p);
    float turn = 0.6 + 0.8 * clamp(dot(-hg, toW), -0.5, 1.0);
    // The pools: black water holding the sky's last light, the wisp's double, and a ripple.
    float f = poolAt(g);
    float wet = smoothstep(0.012, -0.012, f);
    float bank = smoothstep(0.08, 0.0, f) * (1.0 - wet);
    col *= 1.0 - 0.5 * bank;
    float ripple = noise(g * vec2(6.0, 24.0) + vec2(0.0, u_time * 0.8));
    // Peat water is black; only the far pools, seen low, give back the sky.
    float fres = mix(0.95, 0.3, near);
    vec3 night = mix(vec3(0.05, 0.06, 0.07), vec3(0.01, 0.014, 0.022), smoothstep(0.0, 0.7, near)) * (0.85 + 0.3 * ripple);
    night += vec3(0.4, 0.42, 0.4) * exp(-abs(p.x + 0.78 + 0.01 * sin(p.y * 60.0 + u_time)) * 40.0) * (0.5 + 0.5 * ripple) * (0.3 + 0.7 * u_env.x) * 0.35;
    vec3 mirrored = mix(vec3(0.56, 0.57, 0.54), vec3(0.34, 0.37, 0.38), near);
    vec3 water = mix(night, mix(vec3(0.04, 0.032, 0.022), mirrored, fres) + (ripple - 0.5) * 0.07, day);
    water += vec3(0.5, 0.5, 0.46) * day * smoothstep(0.012, 0.0, f) * smoothstep(-0.03, 0.0, f) * 0.35;
    float rim = wet * (1.0 - wet) * 4.0;
    col = mix(col, water, wet);
    col *= 1.0 - 0.3 * rim * (1.0 - day);
    // The light falls on the moss near it, and stands again in the pools beneath it.
    col += COLD * glowAt(p, wisp - vec2(0.0, 0.1), 0.22) * 0.12 * lit * (1.0 - wet * 0.5) * mix(1.0, turn, 1.0 - wet);
    float drop = HORIZON - (wisp.y - 0.12);
    vec2 mirror = vec2(wisp.x, 2.0 * (wisp.y - 0.12) - wisp.y + 0.02 * sin(p.x * 40.0 + u_time * 2.0));
    col += COLD * glowAt(p * vec2(1.0, 0.45), mirror * vec2(1.0, 0.45), 0.03) * wet * lit * 0.8 * step(0.0, drop);
    col *= mix(0.6, 1.0, smoothstep(-1.0, HORIZON, p.y));
    c = col;

    // Cotton-grass: soft white heads nodding on thin stalks, larger toward the glass, the side
    // toward the light catching it.
    vec2 cell = vec2(0.075, 0.06);
    vec2 id = floor(p / cell);
    float h = hash(id + 3.1);
    if (h > 0.5 && noise(id * 0.35) > 0.45 && p.y < HORIZON - 0.1) {
      vec2 at = (id + 0.5 + (vec2(hash(id), hash(id + 9.0)) - 0.5) * 0.8) * cell;
      float an = smoothstep(HORIZON, -1.0, at.y);
      float r = mix(0.004, 0.013, an);
      float sway = 0.006 * sin(u_time * 0.9 + h * 30.0) * an;
      vec2 head = at + vec2(sway, mix(0.01, 0.04, an));
      vec2 hd = (p - head - vec2(0.0, -0.4 * r)) / vec2(r * 0.75, r * 1.55);
      float fluff = length(hd) - 1.0 + 0.55 * (noise(vec2(atan(hd.y, hd.x) * 4.0, length(hd) * 2.5) + h * 10.0) - 0.5);
      float tuft = smoothstep(0.3, -0.35, fluff) * (0.75 + 0.25 * noise(hd * 8.0 + h * 5.0));
      float stalk = stroke(sdSegment(p, at - vec2(0.0, 0.01), head), mix(0.0006, 0.0012, an), px) * 0.7;
      vec3 white = mix(vec3(0.26, 0.28, 0.28), vec3(0.80, 0.79, 0.74), day) * (0.75 + 0.35 * dot(normalize(hd + 1e-4), vec2(-0.3, 0.6)));
      white += COLD * glowAt(head, wisp, 0.35) * lit * (0.35 + 0.5 * max(dot(normalize(hd + 1e-4), normalize(wisp - head)), 0.0));
      vec3 stem = mix(vec3(0.05, 0.06, 0.04), vec3(0.3, 0.32, 0.2), day);
      float land = 1.0 - pool(ground(at));
      c = mix(c, stem, stalk * land);
      c = mix(c, white, tuft * land);
    }
  }

  // Mist lies in bands over the bog, lit where the light is.
  float bands = fbm(vec2(p.x * 1.3 + u_time * 0.025, p.y * 6.0 - u_time * 0.01));
  float mist = smoothstep(0.45, 0.8, bands) * smoothstep(HORIZON + 0.12, HORIZON - 0.05, p.y) * smoothstep(-0.9, -0.1, p.y);
  c += (mix(vec3(0.035, 0.045, 0.045), vec3(0.12, 0.12, 0.11), day) + COLD * glowAt(p, wisp, 0.3) * 0.35 * lit) * mist;
  // By day the air over the pools wavers, and that is all.
  c += vec3(0.05, 0.06, 0.055) * day * (noise(vec2(p.x * 30.0, p.y * 80.0 - u_time * 2.0)) - 0.4) * smoothstep(HORIZON, -0.2, p.y) * 0.5;

  // The far lights of a dark night.
  for (int i = 0; i < 3; i++) {
    float k = float(i);
    vec2 at = vec2(-0.95 + 0.62 * k + 0.1 * sin(k * 3.0), HORIZON + 0.015 - 0.02 * k);
    float on = smoothstep(0.55 + 0.15 * k, 0.75 + 0.15 * k, u_env.x) * (1.0 - day);
    c += COLD * glowAt(p, at, 0.008) * on * (0.6 + 0.4 * noise(vec2(u_time * 2.0, k * 5.0)));
  }

  // The drawn light, going down into its pool and leaving rings on the water.
  if (u_b.w > 0.0) {
    float surface = u_b.y - 0.07;
    vec2 at = u_b.xy - vec2(0.0, u_b.z * 0.11);
    float under = smoothstep(surface + 0.005, surface - 0.03, p.y);
    float shine = glowAt(p, at, 0.035) * u_b.w * (1.0 - u_b.z) * mix(1.0, 0.25, under);
    c += COLD * shine;
    float r = length((p - vec2(u_b.x, surface)) * vec2(1.0, 3.4));
    c += COLD * 0.08 * u_b.z * (1.0 - u_b.z) * u_b.w * stroke(fract(r * 12.0 - u_b.z * 3.0) - 0.5, 0.08, 0.06) * smoothstep(0.3, 0.0, r);
  }

  // The light itself, cold, with its ring of mist.
  float d = length(p - wisp);
  c += COLD * (glowAt(p, wisp, 0.05) * 0.9 + exp(-d * d / 0.0004)) * lit * flick;
  c += COLD * 0.12 * stroke(d - 0.11, 0.025, 0.03) * (0.5 + noise(p * 18.0 + u_time * 0.5)) * lit;
  c += vec3(0.5, 0.55, 0.5) * 0.05 * day * glowAt(p, wisp, 0.05) * noise(vec2(u_time * 5.0, 1.0));

  // The sedge at the glass, black against the bog, its edges caught by the light.
  if (p.y < -0.72) {
    float s = sedge(p + plateDrift(-0.4), px);
    vec3 blade = mix(vec3(0.012, 0.015, 0.01), vec3(0.08, 0.09, 0.06), day) * (0.7 + 0.6 * hash(vec2(floor(p.x / 0.018), 2.0)));
    blade += COLD * glowAt(p, wisp, 0.5) * 0.09 * lit;
    c = mix(c, blade, s);
  }

  c *= 1.0 - 0.25 * dot(p * 0.6, p * 0.6);
  if (lensIn(p) > 0.0) c = fluoroscope(c, p, peat(p, ground(min(p, vec2(9.0, HORIZON - 0.01)))));
  return c;
}
`,n=[.4,.05],r=.42,i={x:1.15,top:.4,bottom:-.7},a=(e,t,n)=>Math.min(n,Math.max(t,e)),o={source:t,start({stage:t,root:o,env:s}){let c=+(s.level<.3),l=n[0],u=n[1],d=1,f=0,p=0,m=0,h,g={},_=(e,t)=>{g[e]!==t&&(g[e]=t,o.style.setProperty(e,t))};return o.toggleAttribute(`data-lead`,!0),{frame(g,v,y){let b=n[0]+.12*Math.sin(g*.23),x=n[1]+.05*Math.sin(g*.37),S=l-y.x,C=u-y.y,w=Math.hypot(S,C)||.001,T=y.present&&w<r*1.6;T&&p===0&&(b=y.x+S/w*r,x=y.y+C/w*r);let E=a(b,-i.x,i.x),D=a(x,i.bottom,i.top),O=.05,k=Math.abs(l)>i.x-O||u>i.top-O||u<i.bottom+O;if(p===0&&T&&k&&w<r&&(h={x:l,y:u,t:0},p=1,m=Math.sign(y.x||1)),p===1)d=e(d,0,6,v),d<.02&&(l=-m*.85,u=n[1],p=2);else{d=e(d,1,p===2?1.6:4,v),p===2&&d>.95&&(p=0);let t=4+3*y.speed;l=e(l,E,t,v),u=e(u,D,t,v)}f=e(f,T?1-w/(r*1.6):0,3,v);let A=[0,0,0,0];if(h){h.t+=v;let e=Math.min(1,h.t/2.6);A=[h.x,h.y,e,1],e>=1&&(h=void 0)}t.set(`a`,[l-n[0],u-n[1],1-d,c]),t.set(`b`,A),t.set(`env`,[s.level,+!!s.on,0,0]);let j=t.canvas.clientWidth||1,M=t.canvas.clientHeight||1,N=Math.min(j,M)/2;_(`--wisp-x`,`${(50+l*N*100/j).toFixed(1)}%`),_(`--wisp-y`,`${(50-u*N*100/M).toFixed(1)}%`),_(`--wisp-glow`,(d*(c?.45:1)).toFixed(2)),o.dataset.state=h?`decoy`:c?`shimmer`:`lit`,o.toggleAttribute(`data-day`,c>.5)},level:()=>Math.max(f,h?.8:0),dispose(){o.removeAttribute(`data-lead`),o.removeAttribute(`data-day`);for(let e of Object.keys(g))o.style.removeProperty(e)}}},plates:[{name:`lit`,caption:{almanac:`Lit, over the farthest pool.`,cipher:`Plate I: active, at night.`},a:[0,0,0,0]},{name:`shimmer`,caption:{almanac:`By day, a shimmer on the water and nothing more.`,cipher:`Plate II: daytime; minimal visibility.`},a:[0,0,0,1]}]};export{o as scene};