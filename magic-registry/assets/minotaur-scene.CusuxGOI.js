import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=1.2;function n(e=document){let n=[...e.querySelectorAll(`[data-room-text] p, [data-room-text] li`)].filter(e=>!e.closest(`[aria-hidden="true"]`)),r=new Set,i=new Map,a=new IntersectionObserver(e=>{for(let n of e){if(r.has(n.target))continue;let e=n.rootBounds?n.intersectionRect.height>=n.rootBounds.height/2:!1;n.isIntersecting&&(n.intersectionRatio>=.5||e)?i.has(n.target)||i.set(n.target,setTimeout(()=>{r.add(n.target),i.delete(n.target),a.unobserve(n.target)},t*1e3)):(clearTimeout(i.get(n.target)),i.delete(n.target))}},{threshold:Array.from({length:21},(e,t)=>t/20)});for(let e of n)a.observe(e);let o=new Map;for(let e of n){let t=e.closest(`[data-layer]`),n=t?.parentElement??e,r=o.get(n)??new Map,i=t?.dataset.layer??``;r.set(i,[...r.get(i)??[],e]),o.set(n,r)}return{get share(){let[e,t]=[0,0];for(let n of o.values()){let i=[...n.values()],a=Math.max(...i.map(e=>e.length)),o=Math.max(...i.map(e=>e.filter(e=>r.has(e)).length/e.length));e+=a*o,t+=a}return t===0?0:e/t},stop(){a.disconnect();for(let e of i.values())clearTimeout(e);i.clear()}}}var r=.012,i=1.6,a=`
const float SHAKE = ${r};
const float MARK_SHAKE = ${i};
const float COURSES = 7.0;
const vec3 INK = vec3(0.105, 0.072, 0.045);
const vec3 WASH = vec3(0.43, 0.12, 0.065);
const vec3 BRASS = vec3(0.58, 0.40, 0.14);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}
vec3 shade(vec3 alb, vec3 N, float rough) {
  vec3 key = normalize(vec3(-0.55, 0.72, 0.55));
  vec3 fillc = vec3(0.13, 0.11, 0.09);
  vec3 keyc = vec3(1.0, 0.78, 0.48);
  float wr = max((dot(N, key) + 0.3) / 1.3, 0.0);
  vec3 H = normalize(key + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(N, H), 0.0), mix(64.0, 9.0, rough)) * (1.0 - rough);
  float rim = pow(1.0 - clamp(N.z, 0.0, 1.0), 2.5);
  return alb * (fillc + keyc * wr) + keyc * sp * 0.35 + alb * rim * 0.12;
}

// A course of the labyrinth, broken at its gate.
float course(vec2 p, float i) {
  float r = 0.27 + i * 0.078;
  float a = atan(p.y * 1.04, p.x);
  float gate = -2.45 + i * 1.71;
  float gap = abs(mod(a - gate + PI, 2.0 * PI) - PI) * r;
  float ring = abs(length(p * vec2(1.0, 1.04)) - r);
  return max(ring, 0.026 - gap);
}
float turn(vec2 p, float i) {
  float r = 0.27 + i * 0.078;
  float a = -2.45 + i * 1.71 + 0.034 / r;
  vec2 d = vec2(cos(a), sin(a) / 1.04);
  return sdSegment(p, d * r, d * (r + 0.078));
}

vec2 beastP(vec2 q) { return vec2(q.x / 0.72, (q.y + 0.33) / 0.67); }

// The engraved beast: a bull-headed man in profile, chest broad above a human waist and stride.
float beastShape(vec2 q) {
  vec2 f = beastP(q);
  float chest = sdEllipse(f - vec2(0.0, 0.62), vec2(0.17, 0.16));
  float waist = sdEllipse(f - vec2(0.02, 0.45), vec2(0.10, 0.10));
  float hump = sdCircle(f - vec2(0.07, 0.75), 0.12);
  float head = cone(f, vec2(-0.05, 0.77), vec2(-0.25, 0.70), 0.09, 0.055);
  float muzzle = sdBox(f - vec2(-0.26, 0.69), vec2(0.035, 0.045)) - 0.014;
  float dewlap = cone(f, vec2(-0.12, 0.69), vec2(-0.02, 0.62), 0.055, 0.04);
  float ear = cone(f, vec2(-0.03, 0.82), vec2(0.09, 0.83), 0.027, 0.003);
  float d = smin(chest, waist, 0.045);
  d = smin(d, hump, 0.045);
  d = smin(d, head, 0.035);
  d = smin(d, muzzle, 0.025);
  d = smin(d, dewlap, 0.03);
  d = min(d, ear);
  // Far limbs swing behind; near limbs carry the readable human gesture.
  d = smin(d, cone(f, vec2(0.07, 0.66), vec2(0.14, 0.51), 0.052, 0.04), 0.035);
  d = smin(d, cone(f, vec2(0.14, 0.51), vec2(0.18, 0.41), 0.04, 0.03), 0.025);
  d = smin(d, sdCircle(f - vec2(0.18, 0.40), 0.045), 0.02);
  d = smin(d, cone(f, vec2(-0.03, 0.66), vec2(-0.09, 0.50), 0.055, 0.042), 0.04);
  d = smin(d, cone(f, vec2(-0.09, 0.50), vec2(-0.03, 0.39), 0.042, 0.035), 0.03);
  d = smin(d, sdCircle(f - vec2(-0.03, 0.37), 0.045), 0.02);
  d = smin(d, cone(f, vec2(0.06, 0.38), vec2(0.11, 0.20), 0.07, 0.045), 0.04);
  d = smin(d, cone(f, vec2(0.11, 0.20), vec2(0.18, 0.05), 0.045, 0.03), 0.025);
  d = smin(d, sdBox(f - vec2(0.19, 0.025), vec2(0.045, 0.023)) - 0.008, 0.018);
  d = smin(d, cone(f, vec2(-0.02, 0.38), vec2(-0.10, 0.20), 0.075, 0.045), 0.045);
  d = smin(d, cone(f, vec2(-0.10, 0.20), vec2(-0.08, 0.04), 0.045, 0.03), 0.028);
  d = smin(d, sdBox(f - vec2(-0.11, 0.022), vec2(0.048, 0.024)) - 0.008, 0.018);
  float tail = cone(f, vec2(0.10, 0.43), vec2(0.18, 0.30), 0.012, 0.005);
  tail = min(tail, sdEllipse(f - vec2(0.185, 0.285), vec2(0.025, 0.04)));
  return min(d, tail) * 0.67;
}
float hornLine(vec2 q) {
  vec2 f = beastP(q);
  float near = cone(f, vec2(-0.07, 0.84), vec2(-0.14, 0.92), 0.024, 0.018);
  near = smin(near, cone(f, vec2(-0.14, 0.92), vec2(-0.22, 0.97), 0.018, 0.009), 0.014);
  near = smin(near, cone(f, vec2(-0.22, 0.97), vec2(-0.27, 0.955), 0.010, 0.004), 0.008);
  float far = cone(f, vec2(-0.035, 0.85), vec2(-0.09, 0.94), 0.021, 0.015);
  far = smin(far, cone(f, vec2(-0.09, 0.94), vec2(-0.17, 1.0), 0.015, 0.007), 0.012);
  far = smin(far, cone(f, vec2(-0.17, 1.0), vec2(-0.22, 0.99), 0.008, 0.003), 0.007);
  return min(near, far) * 0.67;
}

// The rays find the horn cores, bull skull, collarbones and the dense graft seam.
float xray(vec2 p) {
  vec2 shake = u_b.xy * SHAKE * u_a.y;
  vec2 q = (p - vec2(-0.09, -0.025) - shake * MARK_SHAKE) / vec2(1.05, 1.2);
  vec2 f = beastP(q);
  float body = fill(beastShape(q), 0.003);
  float passes = mix(0.9, 0.63, body);
  float skull = fill(cone(f, vec2(-0.05, 0.77), vec2(-0.25, 0.70), 0.062, 0.038) * 0.67, 0.003);
  float jaw = fill(sdBox(f - vec2(-0.25, 0.68), vec2(0.03, 0.03)) * 0.67, 0.003);
  skull = max(skull, jaw);
  float cores = fill(hornLine(q) + 0.008, 0.003);
  float collar = stroke(sdSegment(f, vec2(-0.12, 0.63), vec2(0.12, 0.63)) * 0.67, 0.006, 0.003);
  float seam = stroke((f.y - 0.62) * 0.67, 0.009, 0.003) * step(abs(f.x), 0.12);
  passes = mix(passes, 0.22, clamp(skull + cores + collar, 0.0, 1.0) * body);
  float sockets = fill(sdEllipse(f - vec2(-0.13, 0.79), vec2(0.018, 0.012)) * 0.67, 0.003);
  passes = mix(passes, 0.72, sockets * skull);
  return mix(passes, 0.06, seam * body);
}

vec3 scene(vec2 p) {
  float walls = u_a.x, tremor = u_a.y;
  float px = 1.5 / min(u_res.x, u_res.y);
  vec2 shake = u_b.xy * SHAKE * tremor;
  float edge = u_res.x / min(u_res.x, u_res.y);

  // Oak drafting board around the vellum, with worn grain and a raised near edge.
  float wg = 0.55 * noise(vec2(p.x * 2.3, p.y * 24.0)) + 0.3 * noise(vec2(p.x * 7.0, p.y * 55.0)) + 0.15 * noise(vec2(p.x * 22.0, p.y * 110.0));
  vec3 wood = vec3(0.20, 0.105, 0.045) * (0.55 + 0.75 * wg);
  wood = shade(wood, normalize(vec3((wg - 0.5) * 0.35, 0.15, 0.9)), 0.62);
  vec3 c = wood;
  vec2 sheetR = vec2(min(edge - 0.13, 1.19), 0.87);
  vec2 sq = p - vec2(-0.025, 0.025);
  float sheet = sdBox(sq, sheetR);
  c = gloom(c, p, vec2(0.015, -0.87), vec2(sheetR.x * 1.03, 0.055));
  c *= 1.0 - 0.22 * fill(sheet - 0.025, 0.025) * (1.0 - fill(sheet, px));

  if (sheet < 0.015) {
    float fibres = 0.55 * grain(rot(0.07) * p * vec2(3.0, 45.0)) + 0.45 * grain(rot(1.48) * p * vec2(4.0, 35.0));
    float stain = 0.55 * noise(p * 2.4 + 4.0) + 0.3 * noise(rot(0.6) * p * 7.0) + 0.15 * noise(p * 24.0);
    vec3 vellum = mix(vec3(0.69, 0.53, 0.30), vec3(0.86, 0.72, 0.46), fibres);
    vellum *= 0.78 + 0.32 * stain;
    float worn = smoothstep(-0.22, 0.0, sheet);
    vellum *= 1.0 - worn * (0.12 + 0.15 * noise(p * 18.0));
    vec3 paperN = normalize(vec3((fibres - 0.5) * 0.09, (stain - 0.5) * 0.08, 1.0));
    c = mix(c, shade(vellum, paperN, 0.92), fill(sheet, px));
    // Foxing and pooled ink spots in the old sheet.
    vec2 fid = floor((p + 2.0) * 15.0);
    vec2 fp = fract((p + 2.0) * 15.0) - 0.5;
    float fox = smoothstep(0.24, 0.03, length(fp - (vec2(hash(fid), hash(fid + 2.3)) - 0.5) * 0.45));
    fox *= step(0.84, hash(fid + 7.0)) * fill(sheet + 0.025, px);
    c = mix(c, vec3(0.32, 0.17, 0.07), fox * 0.32);
  }

  // The copper plate left a shallow rectangular bite and a faded maker's rose in the corner.
  float plateMark = sdBox(sq, sheetR - vec2(0.055, 0.065));
  c = mix(c, INK * 1.8, stroke(plateMark, 0.0015, px) * 0.24);
  vec2 rose = p - vec2(-0.92, 0.65);
  float roseInk = stroke(sdCircle(rose, 0.052), 0.0018, px);
  for (int k = 0; k < 4; k++) {
    float a = float(k) * PI * 0.25;
    roseInk = max(roseInk, stroke(sdSegment(rose, -vec2(cos(a), sin(a)) * 0.065, vec2(cos(a), sin(a)) * 0.065), 0.0015, px));
  }
  c = mix(c, INK, roseInk * 0.28 * fill(sheet + 0.02, px));

  vec2 lp = p - vec2(-0.09, -0.025);
  // Every course begins as a fine engraved plan with dry burr and pooled ink.
  for (int k = 0; k < 7; k++) {
    float i = float(k);
    float w = min(course(lp, i), turn(lp, i)) + 0.0015 * (noise(lp * 80.0 + i * 11.0) - 0.5);
    float burr = stroke(w, 0.0048, px);
    float pool = stroke(w - 0.006, 0.002, px) * (0.5 + 0.5 * noise(lp * 65.0 + i * 8.0));
    c = mix(c, INK * (0.72 + 0.28 * grain(lp * 80.0 + i)), max(burr, pool * 0.65));
  }

  // Read courses rise outermost first into individually jointed, lamp-lit masonry.
  float laid = walls * COURSES;
  for (int k = 6; k >= 0; k--) {
    float i = float(k);
    float amount = clamp(laid - (6.0 - i), 0.0, 1.0);
    if (amount <= 0.0) continue;
    float near = 1.0 - i / 6.0;
    vec2 q = lp - shake * near;
    float ang = atan(q.y, q.x);
    float swept = step(mod(ang - (-2.45 + 1.71 * i) + 2.0 * PI, 2.0 * PI) / (2.0 * PI), amount);
    float w = min(course(q, i), turn(q, i));
    float side = fill(w - 0.018, px) * swept;
    float top = fill(w - 0.0075, px) * swept;
    float joints = smoothstep(0.88, 0.98, abs(sin(ang * (12.0 + i * 2.0) + i))) * top;
    float stoneN = 0.6 * noise(q * 35.0 + i) + 0.4 * noise(rot(0.7) * q * 90.0);
    vec3 masonry = mix(vec3(0.20, 0.19, 0.17), vec3(0.55, 0.45, 0.32), stoneN);
    masonry = mix(masonry, vec3(0.29, 0.12, 0.065), near * tremor * 0.32);
    c = mix(c, masonry * 0.46, side);
    c = mix(c, shade(masonry, normalize(vec3(-0.25, 0.42, 0.87)), 0.88), top);
    c = mix(c, vec3(0.11, 0.085, 0.06), joints * 0.7);
    c *= 1.0 - 0.25 * fill(min(course(q + vec2(0.018, -0.017), i), turn(q + vec2(0.018, -0.017), i)) - 0.022, px) * swept * (1.0 - top);
  }

  // The central figure is inked and washed, with crossed burin lines in its shaded flesh.
  vec2 m = (lp - shake * MARK_SHAKE) / vec2(1.05, 1.2);
  vec2 mf = beastP(m);
  float bd = min(beastShape(m), hornLine(m));
  float body = fill(beastShape(m), px / 1.12);
  float horns = fill(hornLine(m), px / 1.12);
  vec2 grad = normalize(vec2(dFdx(bd), dFdy(bd)) + 1e-6);
  float depth = clamp(-bd / 0.08, 0.0, 1.0);
  vec3 N = normalize(vec3(grad * (1.0 - depth), 0.3 + depth));
  float dark = clamp(0.8 - dot(N, normalize(vec3(-0.5, 0.7, 0.5))), 0.0, 1.0);
  vec3 wash = shade(vec3(0.49, 0.255, 0.13) * (0.76 + 0.2 * grain(mf * 28.0)), N, 0.9);
  c = mix(c, wash, body * 0.68);
  float hatch1 = smoothstep(0.90, 0.985, sin((mf.x * 0.82 + mf.y * 0.57 + 0.12 * mf.y * mf.y) * 150.0) * 0.5 + 0.5);
  float hatch2 = smoothstep(0.92, 0.99, sin((mf.x * 0.7 - mf.y * 0.76) * 145.0) * 0.5 + 0.5);
  float bare = max(1.0 - smoothstep(0.05, 0.2, length((mf - vec2(0.02, 0.78)) / vec2(0.18, 0.08))),
                   1.0 - smoothstep(0.02, 0.23, length((mf - vec2(-0.09, 0.5)) / vec2(0.07, 0.18))));
  float inkHatch = hatch1 * smoothstep(0.28, 0.72, dark) + hatch2 * smoothstep(0.62, 0.96, dark);
  c = mix(c, INK, body * inkHatch * (1.0 - 0.72 * bare));
  // Far arm and rear leg sit behind the torso in a second, darker wash.
  float farArm = min(cone(mf, vec2(0.07, 0.66), vec2(0.14, 0.51), 0.052, 0.04),
                     cone(mf, vec2(0.14, 0.51), vec2(0.18, 0.41), 0.04, 0.03));
  float farLeg = min(cone(mf, vec2(0.06, 0.38), vec2(0.11, 0.20), 0.07, 0.045),
                     cone(mf, vec2(0.11, 0.20), vec2(0.18, 0.05), 0.045, 0.03));
  c = mix(c, c * 0.64, max(fill(farArm * 0.67, px / 1.12), fill(farLeg * 0.67, px / 1.12)) * body * 0.55);
  float nearArm = min(cone(mf, vec2(-0.03, 0.66), vec2(-0.09, 0.50), 0.055, 0.042),
                      cone(mf, vec2(-0.09, 0.50), vec2(-0.03, 0.39), 0.042, 0.035));
  nearArm = min(nearArm, sdCircle(mf - vec2(-0.03, 0.37), 0.045));
  c = mix(c, wash * 1.08, fill(nearArm * 0.67, px) * body * 0.32);
  c = mix(c, INK, stroke(nearArm * 0.67, 0.002, px) * body * 0.7);
  c = mix(c, vec3(0.54, 0.46, 0.31), horns);
  float hornTip = max(fill(cone(mf, vec2(-0.23, 0.97), vec2(-0.27, 0.955), 0.008, 0.003) * 0.67, px),
                      fill(cone(mf, vec2(-0.18, 1.0), vec2(-0.22, 0.99), 0.006, 0.002) * 0.67, px));
  c = mix(c, INK, hornTip);
  float contour = stroke(beastShape(m), mix(0.0025, 0.0052, dark) + 0.001 * noise(m * 25.0), px / 1.12);
  c = mix(c, INK, contour + stroke(hornLine(m), 0.0011, px / 1.12));
  // Bull face: almond eye, squared muzzle, nostril and the mouth beneath the heavy brow.
  float eye = sdEllipse(rot(-0.08) * (mf - vec2(-0.13, 0.79)), vec2(0.022, 0.010));
  c = mix(c, vec3(0.50, 0.35, 0.16), fill(eye, px / 0.75));
  c = mix(c, INK, fill(sdEllipse(mf - vec2(-0.135, 0.79), vec2(0.008, 0.007)), px / 0.75));
  c += vec3(0.76, 0.63, 0.37) * fill(sdCircle(mf - vec2(-0.142, 0.794), 0.0025), px / 0.75);
  c = mix(c, INK, fill(sdCircle(mf - vec2(-0.28, 0.70), 0.009), px / 0.75));
  c = mix(c, INK, stroke(sdSegment(mf, vec2(-0.29, 0.66), vec2(-0.20, 0.655)), 0.0025, px / 0.75));
  float muzzleEnd = sdBox(mf - vec2(-0.26, 0.69), vec2(0.035, 0.045)) - 0.014;
  c = mix(c, INK, stroke(muzzleEnd * 0.67, 0.0018, px));
  float earD = cone(mf, vec2(-0.03, 0.82), vec2(0.09, 0.83), 0.027, 0.003);
  c = mix(c, vec3(0.39, 0.20, 0.11), fill(earD * 0.67, px) * 0.45);
  c = mix(c, INK, stroke(earD * 0.67, 0.0015, px));
  c = mix(c, INK, stroke(sdSegment(mf, vec2(-0.015, 0.82), vec2(0.065, 0.828)) * 0.67, 0.001, px));
  // Linen loincloth, its narrow belt and three engraved fold lines.
  float ct = clamp((0.40 - mf.y) / 0.12, 0.0, 1.0);
  float cloth = max(abs(mf.x - 0.02) - mix(0.10, 0.08, ct), max(mf.y - 0.40, 0.28 - mf.y));
  c = mix(c, vec3(0.42, 0.32, 0.19) * (0.8 + 0.2 * grain(mf * 70.0)), fill(cloth * 0.67, px) * body * 0.78);
  c = mix(c, INK, stroke(sdSegment(mf, vec2(-0.08, 0.40), vec2(0.12, 0.40)) * 0.67, 0.0025, px));
  for (int k = 0; k < 3; k++) {
    float x = -0.025 + float(k) * 0.045;
    c = mix(c, INK, stroke(sdSegment(mf, vec2(x, 0.38), vec2(x + 0.006, 0.30)) * 0.67, 0.0014, px) * fill(cloth * 0.67, px));
  }
  // Fist creases and the cloven notches finish the human gesture and bull feet.
  c = mix(c, INK, stroke(sdSegment(mf, vec2(-0.065, 0.37), vec2(0.005, 0.37)) * 0.67, 0.0018, px));
  c = mix(c, INK, stroke(sdSegment(mf, vec2(-0.11, 0.0), vec2(-0.11, 0.035)) * 0.67, 0.002, px));
  c = mix(c, INK, stroke(sdSegment(mf, vec2(0.19, 0.0), vec2(0.19, 0.035)) * 0.67, 0.002, px));
  c = mix(c, INK, fill(sdEllipse(mf - vec2(0.185, 0.285), vec2(0.025, 0.04)) * 0.67, px) * 0.55);
  c += WASH * tremor * 0.1 * exp(-length(lp) * 5.5);

  // Brass dividers and a blackwood pen lie across the right margin and cast small shadows.
  vec2 dv = p - vec2(0.84, 0.2);
  dv = rot(-0.18) * dv;
  float leg1 = cone(dv, vec2(0.0, 0.18), vec2(-0.19, -0.31), 0.019, 0.006);
  float leg2 = cone(dv, vec2(0.0, 0.18), vec2(0.16, -0.32), 0.019, 0.006);
  float hinge = sdCircle(dv - vec2(0.0, 0.2), 0.045);
  float divider = min(min(leg1, leg2), hinge);
  float dividerShadow = min(cone(dv - vec2(0.025, -0.022), vec2(0.0, 0.18), vec2(-0.19, -0.31), 0.025, 0.01),
                            cone(dv - vec2(0.025, -0.022), vec2(0.0, 0.18), vec2(0.16, -0.32), 0.025, 0.01));
  c *= 1.0 - fill(dividerShadow, 0.018) * 0.22;
  c = mix(c, shade(BRASS * 1.25 * (0.82 + 0.25 * noise(dv * 90.0)), normalize(vec3(0.3, 0.2, 0.93)), 0.23), fill(divider, px));
  float shine = max(stroke(sdSegment(dv, vec2(-0.004, 0.16), vec2(-0.18, -0.29)), 0.002, px),
                    stroke(sdSegment(dv, vec2(0.005, 0.16), vec2(0.15, -0.30)), 0.002, px));
  c = mix(c, vec3(0.95, 0.72, 0.34), shine);
  c = mix(c, vec3(0.14, 0.09, 0.045), stroke(sdCircle(dv - vec2(0.0, 0.2), 0.028), 0.005, px));
  c = mix(c, vec3(0.68, 0.67, 0.62), fill(cone(dv, vec2(-0.18, -0.28), vec2(-0.20, -0.36), 0.006, 0.001), px));
  c = mix(c, vec3(0.68, 0.67, 0.62), fill(cone(dv, vec2(0.15, -0.29), vec2(0.17, -0.37), 0.006, 0.001), px));
  vec2 pn = rot(0.68) * (p - vec2(0.62, -0.40));
  float holder = cone(pn, vec2(-0.25, 0.0), vec2(0.31, 0.0), 0.012, 0.021);
  float nib = max(sdEllipse(pn - vec2(-0.31, 0.0), vec2(0.075, 0.026)), pn.x + 0.37);
  float penShadow = min(cone(pn - vec2(0.018, -0.018), vec2(-0.25, 0.0), vec2(0.31, 0.0), 0.018, 0.027),
                        sdEllipse(pn - vec2(-0.31, 0.0) - vec2(0.018, -0.018), vec2(0.08, 0.032)));
  c *= 1.0 - fill(penShadow, 0.014) * 0.24;
  c = mix(c, shade(vec3(0.07, 0.035, 0.018), normalize(vec3(0.0, 0.35, 0.94)), 0.3), fill(holder, px));
  c = mix(c, shade(vec3(0.58, 0.55, 0.46), vec3(0.0, 0.3, 0.95), 0.2), fill(nib, px));
  c = mix(c, vec3(0.05, 0.035, 0.025), stroke(sdSegment(pn, vec2(-0.37, 0.0), vec2(-0.285, 0.0)), 0.0018, px) * fill(nib, px));
  c = mix(c, vec3(0.025, 0.018, 0.012), fill(sdCircle(pn - vec2(-0.375, 0.0), 0.008), px));

  // A dark dovetailed lip along the near edge fixes the sheet to a real board.
  float lip = sdBox(p - vec2(0.0, -0.965), vec2(edge, 0.055));
  vec3 lipc = shade(vec3(0.12, 0.055, 0.025) * (0.7 + 0.45 * noise(vec2(p.x * 16.0, p.y * 5.0))), vec3(0.0, 0.75, 0.66), 0.42);
  c = mix(c, lipc, fill(lip, px));

  if (lensIn(p) > 0.0) c = fluoroscope(c, p, xray(p));
  return c;
}
`,o={taurus:.55,else:.2},s=.08,c=1100,l={source:a,start({stage:t,root:a,env:l}){let u=l.on,d=n(),f=a.closest(`.instrument`),p=0,m=.6;a.dataset.state=`agitated`;let h=0,g=0,_=0,v=new ResizeObserver(([e])=>{e&&(_=.5*Math.min(e.contentRect.width,e.contentRect.height))}),y=a.querySelector(`canvas.stage`);return y&&v.observe(y),{frame(n,v){p=e(p,d.share,2,v);let y=Math.min(1,Math.max(0,(c-innerWidth)/680)),b=Math.max(s,(1-p)*(1-.3*y));m=e(m,b,b>m?u?o.taurus:o.else:.6,v),h=Math.sin(n*2*Math.PI*1.7)*.6+Math.sin(n*2*Math.PI*.9+1.3)*.4,g=Math.sin(n*2*Math.PI*1.3+.7)*.6+Math.sin(n*2*Math.PI*.6)*.4,t.set(`a`,[p,m,0,0]),t.set(`b`,[h,g,0,0]),t.set(`env`,[l.level,+!!u,0,0]),f?.style.setProperty(`--reading`,m.toFixed(2)),a.dataset.state=m>.5?`agitated`:`contained`,a.dataset.walls=p.toFixed(2);let x=_*r*i*m;a.dataset.shake=`${(h*x).toFixed(2)} ${(g*x).toFixed(2)}`},level:()=>m,dispose(){d.stop(),v.disconnect(),f?.style.removeProperty(`--reading`),delete a.dataset.walls,delete a.dataset.shake}}},plates:[{name:`contained`,caption:{almanac:`Every wall drawn, and the mark at the centre still.`,cipher:`Plate I: full containment; no tremor.`},a:[1,0,0,0]}]};export{l as scene};