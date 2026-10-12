import{t as e}from"./Specimen.astro_astro_type_script_index_0_lang.B3eJV5EZ.js";var t=180,n=220,r=e=>e.replace(/[a-z]/gi,e=>{let t=e<=`Z`?65:97;return String.fromCharCode(t+25-(e.charCodeAt(0)-t))}),i=(e,t)=>{let n=e.indexOf(t);if(n<0)return t;let r=e.slice(0,n),i=Math.max(...[`. `,`! `,`? `,`; `].map(e=>r.lastIndexOf(e))),a=i<0?0:i+2,o=e.slice(n+t.length).search(/[.!?;](\s|$)/),s=o<0?e.length:n+t.length+o+1;return e.slice(a,s).trim()},a=e=>{let t=e.parentElement;return!t||t.closest(`[aria-hidden="true"]`)?!1:t.checkVisibility?.()??t.offsetParent!==null};function o(e){let t=document.createTreeWalker(e.commonAncestorContainer,NodeFilter.SHOW_TEXT),n=``;for(let r=t.currentNode;r;r=t.nextNode()){if(r.nodeType!==Node.TEXT_NODE||!e.intersectsNode(r)||!a(r))continue;let t=r.textContent??``,i=r===e.startContainer?e.startOffset:0,o=r===e.endContainer?e.endOffset:t.length;n+=t.slice(i,o)+` `}return n.replace(/\s+/g,` `).trim()}function s(e,a,s=()=>{}){let l=document.createElement(`div`);l.className=`fae-terms`,l.setAttribute(`aria-hidden`,`true`);let u=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);u.setAttribute(`focusable`,`false`);let d=document.createElement(`p`);d.className=`fae-echo`,l.append(u,d),document.body.append(l);let f=document.createElement(`div`);f.className=`fae-space`,f.setAttribute(`aria-hidden`,`true`);let p=!1,m={x:0,y:-.6},h=0,g=e=>{e!==p&&s(e),p=e},_=()=>{g(!1),l.removeAttribute(`data-shown`),f.remove()},v=()=>{h=0;let s=getSelection();if(!s||s.isCollapsed||!s.rangeCount)return _();let p=s.getRangeAt(0),v=[...document.querySelectorAll(`[data-room-text]`)].find(e=>p.intersectsNode(e)&&(e.checkVisibility?.()??e.offsetParent!==null));if(!v)return _();let y=document.createRange();y.selectNodeContents(v),p.compareBoundaryPoints(Range.START_TO_START,y)>0&&y.setStart(p.startContainer,p.startOffset),p.compareBoundaryPoints(Range.END_TO_END,y)<0&&y.setEnd(p.endContainer,p.endOffset);let b=o(y),x=[...y.getClientRects()].filter(e=>e.width>1&&e.height>1);if(!b||x.length===0)return _();let S=y.startContainer.parentElement?.closest(`p, li, dd`)??v,C=a?i(o(c(S)),b):b;C.length>t&&(C=`${C.slice(0,179).trimEnd()}…`),d.textContent=r(C);let w=v.getBoundingClientRect(),T=innerWidth-w.right,E=T>=n,D=x[0],O=x[x.length-1];l.toggleAttribute(`data-below`,!E);let k=E?w.right+24:w.left;l.style.width=`${E?Math.min(320,T-48):w.width}px`;let A=D.top;if(E)f.remove();else{let e=y.endContainer.parentElement??v,t=e.closest(`ul, ol, dl`)??e.closest(`p`),n=t&&v.contains(t)?t:null;(n?f.previousElementSibling===n:f.parentElement===v&&!f.nextElementSibling)||(n?n.after(f):v.append(f)),f.style.height=`${d.offsetHeight+16}px`,A=f.getBoundingClientRect().top+8}l.style.left=`${k+scrollX}px`,l.style.top=`${A+scrollY}px`;let j=d.offsetWidth,M=x.map(e=>{let t=e.bottom-A;return`M${(e.left-k).toFixed(1)} ${t.toFixed(1)}H${(e.right-k).toFixed(1)}`+(E?`M${(w.right-k).toFixed(1)} ${t.toFixed(1)}L-4 ${(t/3).toFixed(1)}`:``)});E||M.push(`M${(O.right-k).toFixed(1)} ${(O.bottom-A).toFixed(1)}L${j.toFixed(1)} 4`),u.innerHTML=`<path d="${M.join(``)}"/>`;let N=e.querySelector(`.case`)?.getBoundingClientRect();if(N){let e=Math.min(N.width,N.height)/2,t=(D.left+O.right)/2;m.x=Math.max(-1.2,Math.min(1.2,(t-N.left-N.width/2)/e)),m.y=D.top>N.bottom?-.7:D.bottom<N.top?.7:0}g(!0),l.toggleAttribute(`data-shown`,!0)},y=()=>{h||=requestAnimationFrame(v)},b=()=>{l.hasAttribute(`data-shown`)&&y()};return document.addEventListener(`selectionchange`,y),document.addEventListener(`animationend`,b,{passive:!0}),addEventListener(`resize`,y),{get bound(){return p},toward:m,stop(){cancelAnimationFrame(h),document.removeEventListener(`selectionchange`,y),document.removeEventListener(`animationend`,b),removeEventListener(`resize`,y),l.remove(),f.remove()}}}function c(e){let t=document.createRange();return t.selectNodeContents(e),t}var l={source:`
const vec3 GOLD = vec3(0.85, 0.66, 0.2);
const vec3 BOLE = vec3(0.36, 0.1, 0.06);
const vec2 KNOT = vec2(0.0, 0.1);
const vec2 FLAME = vec2(-1.0, 0.62);
vec2 pinO;
float pinR;
float pinPe;

// Where the term of cell id is pinned (xy), and its two draws of chance (zw). It lies within a
// fifth of a cell of the cell's centre, and is drawn at most a quarter of a cell further toward
// the words taken, so every line near a point joins nodes of the cells about it.
vec4 node(vec2 id, float s) {
  float k = hash(id);
  vec2 h = vec2(k, fract(k * 91.7));
  vec2 q = (id + 0.5 + (h - 0.5) * 0.4) * s;
  if (u_a.x > 0.0) {
    vec2 to = u_b.xy - q;
    q += to * u_a.x * 0.75 * s * exp(-length(to) * 1.1);
  }
  return vec4(q, h);
}

// One term: the line from a to b, a gilt thread twisted fine and written in a broken hand.
float term(vec2 p, vec2 a, vec2 b, float seed, float px) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float d = length(pa - ba * h);
  float along = h * length(ba);
  float script = 0.68 + 0.32 * step(0.42, hash(vec2(floor(along * 140.0), seed)));
  float twist = 0.72 + 0.28 * sin(along * 520.0 + seed);
  return stroke(d, 0.0019 + 0.0008 * u_a.x, px) * script * twist;
}

// The lattice near p: how much line (x), how much pin (y), how much pearl (z), from the nine
// nodes of the cells about p (rows a, b, d from below) and the lines among them: each row and
// column joined, and each square crossed by one diagonal, or none. The nearest pin is kept for
// its shading.
#define TERM(A, B, K) line = max(line, term(p, A.xy, B.xy, A.z * 50.0 + K, px))
#define CROSS(A, R, U, UR) if (fract(A.w * 7.3) > 0.45) { if (fract(A.z * 11.7) > 0.5) TERM(A, UR, 14.0); else TERM(R, U, 14.0); }
#define PIN(A) { vec2 o = p - A.xy; float r = length(o); if (r < pinR) { pinR = r; pinO = o; pinPe = step(0.8, fract(A.w * 3.1 + A.z)); } }
vec3 lattice(vec2 p, float s, float px) {
  vec2 c = floor(p / s);
  vec4 a0 = node(c + vec2(-1.0, -1.0), s), a1 = node(c + vec2(0.0, -1.0), s), a2 = node(c + vec2(1.0, -1.0), s);
  vec4 b0 = node(c + vec2(-1.0, 0.0), s), b1 = node(c, s), b2 = node(c + vec2(1.0, 0.0), s);
  vec4 d0 = node(c + vec2(-1.0, 1.0), s), d1 = node(c + vec2(0.0, 1.0), s), d2 = node(c + vec2(1.0, 1.0), s);
  float line = 0.0;
  pinR = 1.0;
  TERM(a0, a1, 0.0); TERM(a1, a2, 0.0); TERM(b0, b1, 0.0); TERM(b1, b2, 0.0); TERM(d0, d1, 0.0); TERM(d1, d2, 0.0);
  TERM(a0, b0, 7.0); TERM(a1, b1, 7.0); TERM(a2, b2, 7.0); TERM(b0, d0, 7.0); TERM(b1, d1, 7.0); TERM(b2, d2, 7.0);
  CROSS(a0, a1, b0, b1) CROSS(a1, a2, b1, b2) CROSS(b0, b1, d0, d1) CROSS(b1, b2, d1, d2)
  PIN(a0) PIN(a1) PIN(a2) PIN(b0) PIN(b1) PIN(b2) PIN(d0) PIN(d1) PIN(d2)
  return vec3(line, fill(pinR - 0.0075, px) * (1.0 - pinPe), fill(pinR - 0.011, px) * pinPe);
}

// The name: three loops through one another, the knot at the lattice's heart.
float nameKnot(vec2 p, float px) {
  float k = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 q = rot(float(i) * 2.0944) * (p - KNOT);
    k = max(k, stroke(sdEllipse(q - vec2(0.0, 0.045), vec2(0.035, 0.07)), 0.004, px));
  }
  return k;
}

vec2 boxGrad(vec2 p, vec2 b) {
  vec2 e = vec2(0.002, 0.0);
  return vec2(sdBox(p + e.xy, b) - sdBox(p - e.xy, b), sdBox(p + e.yx, b) - sdBox(p - e.yx, b)) / 0.004;
}

vec3 scene(vec2 p) {
  float px = 2.0 / min(u_res.x, u_res.y);
  float s = mix(0.27, 0.19, u_env.x);
  float t = u_time;
  float flick = 0.92 + 0.05 * sin(t * 7.0) * sin(t * 2.3 + 1.0) + 0.04 * noise(vec2(t * 3.0, 2.0));
  vec2 fd = FLAME - p;
  float reach = flick / (1.0 + 1.6 * dot(fd, fd));
  vec3 L = normalize(vec3(fd, 1.0));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  // Behind the glass, painted on the board: their country at dusk. A meadow at the edge of a
  // wood, a thorn standing alone, foxgloves, a ring of pale toadstools in the grass, the mist lying
  // in the hollow, and their lights going about.
  vec3 c = mix(vec3(0.62, 0.38, 0.2), vec3(0.16, 0.1, 0.24), smoothstep(-0.05, 0.55, p.y));
  c = mix(c, vec3(0.03, 0.03, 0.09), smoothstep(0.45, 1.0, p.y));
  c *= 0.9 + 0.15 * fbm(p * vec2(1.5, 5.0) + vec2(t * 0.01, 0.0));
  vec2 sg = floor(p * 70.0);
  c += vec3(0.8, 0.82, 1.0) * step(0.992, hash(sg)) * smoothstep(0.35, 0.0, length(fract(p * 70.0) - 0.5)) * smoothstep(0.4, 0.8, p.y);
  float far = -0.02 + 0.07 * noise(vec2(p.x * 1.6, 1.0)) + 0.03 * noise(vec2(p.x * 5.0, 2.0));
  c = mix(c, mix(vec3(0.13, 0.1, 0.2), c, 0.35), fill(p.y - far, px * 2.0));
  float mound = -1.0;
  // The edge of a wood beyond the meadow, dark against the afterglow, taller toward the sides.
  float wood = -1.0;
  for (int k = 0; k < 2; k++) {
    float w = 0.11 + 0.04 * float(k);
    float xc = p.x / w + float(k) * 0.5;
    float id = floor(xc);
    float u = (fract(xc) - 0.5) * 2.0;
    float ht = 0.02 + 0.09 * hash(vec2(id, float(k) + 1.0)) + 0.2 * smoothstep(0.35, 1.2, abs(id * w - 0.1));
    wood = max(wood, -0.04 + ht * (0.55 + 0.45 * sqrt(max(1.0 - u * u, 0.0))) + 0.014 * (noise(vec2(p.x * 60.0, p.y * 40.0 + float(k) * 7.0)) - 0.5) + 0.02 * (noise(vec2(p.x * 20.0, float(k))) - 0.5));
  }
  if (p.y < wood + 0.01) {
    vec3 wc = vec3(0.025, 0.03, 0.035) * (0.7 + 0.5 * noise(p * vec2(40.0, 16.0)));
    wc += vec3(0.4, 0.22, 0.1) * 0.12 * smoothstep(0.03, 0.0, wood - p.y) * smoothstep(0.4, -0.6, p.x);
    c = mix(c, wc, fill(p.y - wood, px * 2.0));
  }  if (p.y < -0.02) {
    float dep = max(-0.02 - p.y, 0.01);
    vec2 uv = vec2(p.x / dep, 1.0 / dep) * 0.25;
    vec3 grass = mix(vec3(0.035, 0.06, 0.035), vec3(0.08, 0.12, 0.06), noise(uv * vec2(2.0, 0.6)));
    grass *= 0.75 + 0.4 * noise(vec2(p.x * 90.0, p.y * 10.0 + noise(vec2(p.x * 20.0, 0.0)) * 3.0));
    grass += vec3(0.25, 0.14, 0.06) * 0.15 * smoothstep(-0.25, -0.02, p.y);
    float ring = stroke(length((p - vec2(-0.02, -0.44)) / vec2(0.52, 0.1)) - 1.0, 0.12, 0.08);
    grass = mix(grass, grass * vec3(0.8, 1.35, 0.85), ring);
    c = mix(c, grass, mix(smoothstep(-0.02, -0.06, p.y), smoothstep(-0.07, -0.16, p.y), step(p.y, mound)));
  }
  // The thorn, alone on the slope, bent all one way by the wind and white with may.
  vec2 th = p - vec2(0.8, -0.2);
  if (th.x > -0.4 && th.x < 0.3 && th.y > -0.05 && th.y < 0.42) {
    float trunk = sdSegment(th, vec2(0.0), vec2(-0.05, 0.12)) - 0.018 + 0.05 * th.y;
    trunk = min(trunk, sdSegment(th, vec2(-0.05, 0.12), vec2(-0.22, 0.22)) - 0.008);
    trunk = min(trunk, sdSegment(th, vec2(-0.05, 0.12), vec2(0.02, 0.26)) - 0.008);
    trunk = min(trunk, sdSegment(th, vec2(-0.03, 0.13), vec2(0.15, 0.2)) - 0.006);
    trunk = min(trunk, sdSegment(th, vec2(-0.14, 0.18), vec2(-0.3, 0.2)) - 0.004);
    trunk += 0.004 * (noise(th * 90.0) - 0.5);
    vec3 bark = vec3(0.05, 0.035, 0.03) * (0.7 + 0.5 * noise(vec2(th.x * 30.0, th.y * 120.0)));
    float crown = min(min(length((th - vec2(-0.21, 0.24)) / vec2(0.14, 0.065)) - 1.0, length((th - vec2(-0.03, 0.28)) / vec2(0.15, 0.075)) - 1.0),
                      min(length((th - vec2(0.12, 0.22)) / vec2(0.1, 0.055)) - 1.0, length((th - vec2(-0.1, 0.19)) / vec2(0.13, 0.05)) - 1.0)) * 0.06;
    crown += 0.03 * (noise(th * vec2(12.0, 20.0)) - 0.5) + 0.018 * (noise(th * 45.0) - 0.5);
    float gap = smoothstep(0.68, 0.74, noise(th * vec2(18.0, 26.0) + 5.0)) * smoothstep(-0.03, -0.01, crown);
    float leafy = fill(crown, px * 2.0) * (1.0 - gap);
    c = mix(c, bark * 0.8, fill(trunk + 0.003, px) * (1.0 - leafy));
    vec2 cell = rot(0.5) * th * 120.0;
    vec2 cid = floor(cell);
    vec2 co = fract(cell) - 0.5 - (vec2(hash(cid), hash(cid + 3.0)) - 0.5) * 0.6;
    float bloom = smoothstep(0.3, 0.45, noise(th * 16.0)) * step(0.3, hash(cid + 7.0)) * smoothstep(0.32, 0.1, length(co));
    float top = smoothstep(-0.035, 0.0, crown) * step(0.0, -crown);
    float upper = smoothstep(0.12, 0.3, th.y);
    vec3 foliage = vec3(0.03, 0.05, 0.03) * (0.5 + 0.7 * noise(th * 60.0)) * (0.55 + 0.6 * upper);
    foliage = mix(foliage, vec3(0.86, 0.78, 0.72) * (0.3 + 0.7 * upper) * (0.75 + 0.25 * hash(cid)), bloom * 0.8);
    foliage += vec3(0.3, 0.16, 0.08) * top * upper * 0.35;
    c = mix(c, foliage, leafy);
    c = mix(c, bark, fill(max(trunk, -crown - 0.02), px) * fill(trunk, px));
  }
  // Foxgloves at the left, their bells hung down one side of the spike.
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    vec2 fq = (p - vec2(-1.0 + 0.17 * fk, -0.78 + 0.05 * sin(fk * 2.0))) / 1.5;
    float ht = 0.5 - 0.09 * fk;
    if (abs(fq.x) > 0.09 || fq.y < 0.0 || fq.y > ht + 0.02) continue;
    float lean = 0.04 * fq.y * fq.y;
    float lv = min(sdEllipse(rot(0.5) * (fq - vec2(-0.04, 0.03)), vec2(0.05, 0.012)), sdEllipse(rot(-0.6) * (fq - vec2(0.04, 0.04)), vec2(0.05, 0.012)));
    c = mix(c, vec3(0.04, 0.07, 0.035) * (0.7 + 0.5 * noise(fq * 90.0)), fill(lv, px));
    c = mix(c, vec3(0.05, 0.08, 0.04), fill(abs(fq.x - lean) - 0.004, px));
    // Each bell a tube hung from the stem, widening to its mouth, the one above overlapping the
    // one below; lit along its top, its lip catching the light, its throat dark and speckled.
    // Smaller toward the tip, where the last are still buds.
    float dim = 0.5 + 0.5 * smoothstep(-0.6, 0.0, p.x);
    float sp = 0.034;
    float row = floor(fq.y / sp);
    for (int j = 1; j >= -1; j--) {
      float cy = (row + float(j)) * sp + sp * 0.5;
      if (cy < 0.12 || cy > ht) continue;
      float taper = 1.0 - 0.62 * smoothstep(ht * 0.45, ht, cy);
      vec2 at = vec2(0.04 * cy * cy + 0.003, cy);
      vec2 bl = (fq - at) / taper;
      vec2 mouth = vec2(0.034, -0.03);
      vec2 along = normalize(mouth);
      float h = clamp(dot(bl, mouth) / dot(mouth, mouth), 0.0, 1.0);
      float across = dot(bl - mouth * h, vec2(-along.y, along.x));
      float rad = mix(0.004, 0.0145, h * h * (3.0 - 2.0 * h));
      float tube = (length(bl - mouth * h) - rad) * taper;
      if (tube > px * 2.0) continue;
      float side = clamp(across / rad, -1.0, 1.0);
      vec3 pc = mix(vec3(0.34, 0.08, 0.26), vec3(0.82, 0.44, 0.66), smoothstep(-0.7, 0.8, side));
      pc *= 0.75 + 0.3 * h;
      pc += vec3(0.25, 0.14, 0.2) * pow(max(side, 0.0), 6.0) * 0.6;
      float throat = sdEllipse(vec2(dot(bl - mouth, along), dot(bl - mouth, vec2(-along.y, along.x))), vec2(0.005, 0.0138));
      vec3 inner = vec3(0.1, 0.02, 0.07);
      vec2 sq = (bl - mouth) * 900.0;
      inner = mix(inner, vec3(0.86, 0.8, 0.86), step(0.82, hash(floor(sq))) * step(length(fract(sq) - 0.5), 0.3));
      pc = mix(pc, inner, fill(throat * taper, px) * step(0.85, h));
      pc = mix(pc, vec3(0.96, 0.72, 0.86), stroke(throat * taper, 0.0012, px) * step(0.0, side + 0.3));
      pc = mix(pc, vec3(0.3, 0.42, 0.18), smoothstep(0.08, 0.0, h) * 0.8);
      c = gloom(c, fq, at + mouth * taper * vec2(0.5, 1.3), vec2(0.016, 0.006) * taper);
      c = mix(c, pc * dim, fill(tube, px));
    }
  }
  // The ring of toadstools in the grass, pale, giving a little light of their own.
  if (abs(p.y + 0.44) < 0.2 && abs(p.x) < 0.66) {
    for (int k = 0; k < 18; k++) {
      float a = float(k) / 18.0 * 6.2832 + 0.2 * sin(float(k) * 3.1);
      vec2 at = vec2(-0.02, -0.44) + vec2(cos(a) * 0.52, sin(a) * 0.1);
      float sz = 0.028 * (1.0 + (-0.44 - at.y) * 3.0) * (0.8 + 0.4 * hash(vec2(float(k), 4.0)));
      vec2 q = (p - at) / sz;
      if (dot(q, q) > 9.0) continue;
      float stem = sdBox(q - vec2(0.0, 0.5), vec2(0.18, 0.5));
      float cap = max(sdEllipse(q - vec2(0.0, 1.0), vec2(0.75, 0.42)), 0.85 - q.y);
      vec3 cn = normalize(vec3(q.x * 0.9, (q.y - 1.0) * 1.4 + 0.4, 0.7));
      vec3 mc = vec3(0.72, 0.66, 0.52) * (0.3 + 0.7 * max(dot(cn, normalize(vec3(-0.5, 0.6, 0.4))), 0.0)) + vec3(0.25, 0.35, 0.22) * 0.25;
      c = gloom(c, p, at, vec2(0.9, 0.2) * sz);
      c = mix(c, vec3(0.6, 0.56, 0.46) * 0.55, fill(stem * sz, px));
      c = mix(c, mc, fill(cap * sz, px));
      c += vec3(0.5, 0.7, 0.45) * 0.05 * exp(-length(q - vec2(0.0, 1.0)) * 1.2);
    }
  }
  // The mist in the hollow, and their lights going about in it.
  c = mix(c, vec3(0.32, 0.3, 0.36), smoothstep(0.12, 0.0, abs(p.y + 0.1)) * (0.35 + 0.3 * noise(vec2(p.x * 3.0 - t * 0.04, p.y * 10.0))));
  for (int k = 0; k < 6; k++) {
    float fk = float(k);
    vec2 at = vec2(0.85 * sin(t * (0.07 + 0.02 * fk) + fk * 2.1), -0.25 + 0.2 * sin(t * (0.11 + 0.03 * fk) + fk * 4.0));
    float pulse = 0.6 + 0.4 * sin(t * 1.3 + fk * 2.7);
    c += vec3(0.95, 0.85, 0.5) * pulse * (0.4 * exp(-length(p - at) * 90.0) + 0.06 * exp(-length(p - at) * 18.0));
  }
  c *= vec3(0.95, 0.88, 0.74) * 0.85;
  c += vec3(0.08, 0.055, 0.035) * reach * 0.6;

  // The lattice, above the threshold only: gilt thread over the glass like gossamer, catching
  // the candle, the pins of gilt and the pearls of dew.
  float above = smoothstep(-0.8, -0.72, p.y);
  vec3 l = above > 0.0 ? lattice(p, s, px) * above : vec3(0.0);
  float shine = mix(0.6, 1.1, u_a.x);
  if (l.x > 0.0) c = mix(c, GOLD * (0.3 + 0.95 * reach) * shine, l.x * mix(0.55, 1.0, u_a.x));
  if (above > 0.0 && pinR < 0.03) {
    float pr = pinPe > 0.5 ? 0.011 : 0.0075;
    c *= 1.0 - 0.55 * above * fill(length(pinO - vec2(0.007, -0.007)) - pr, px * 4.0);
    vec2 q = pinO / pr;
    vec3 N = normalize(vec3(q, sqrt(max(1.0 - dot(q, q), 0.0))));
    float dif = max(dot(N, L), 0.0);
    float sp = pow(max(dot(N, H), 0.0), 40.0);
    vec3 alb = pinPe > 0.5 ? vec3(0.86, 0.84, 0.8) : GOLD;
    vec3 pin = alb * (0.1 + 0.9 * dif * (0.35 + reach)) * shine + vec3(1.0, 0.92, 0.78) * sp * (0.35 + reach);
    pin += pinPe * vec3(0.07, 0.09, 0.12) * (1.0 - dif);
    c = mix(c, pin, max(l.y, l.z));
  }

  // The name, smoked over: soot on the inside of the glass, never still, never thin enough.
  float toKnot = length(p - KNOT);
  float name = toKnot < 0.14 ? nameKnot(p, px) : 0.0;
  c = mix(c, GOLD * 0.9, name);
  float soot = fbm(rot(t * 0.02) * (p - KNOT) * 9.0 + t * 0.05);
  float smoke = fill(toKnot - 0.13 - 0.05 * (soot - 0.5), 0.07);
  if (smoke > 0.0) c = mix(c, vec3(0.022, 0.018, 0.02) + vec3(0.05, 0.044, 0.04) * soot, smoke * 0.93);

  // The threshold: a gilt moulding across the foot of the case, the leaf worn through to the red
  // bole beneath; below it the oak doorstep, worn pale where feet have not crossed.
  float sill = p.y + 0.8;
  if (sill < 0.0) {
    vec3 oak = vec3(0.09, 0.06, 0.04) * (0.75 + 0.35 * fbm(vec2(p.x * 4.0, p.y * 60.0)));
    oak *= 1.0 + 0.4 * exp(-pow(p.x / 0.5, 2.0)) * smoothstep(-0.95, -0.85, p.y);
    c = oak * (0.35 + 1.2 * reach) + vec3(0.01);
    c *= 1.0 - 0.5 * exp(sill * 30.0);
  }
  float mt = clamp(sill / 0.014, -1.0, 1.0);
  vec3 mN = normalize(vec3(0.0, mt, sqrt(1.0 - mt * mt) + 0.05));
  float wear = smoothstep(0.62, 0.78, fbm(p * vec2(18.0, 50.0)));
  vec3 leaf = mix(GOLD, BOLE, wear * 0.8);
  vec3 moulding = leaf * (0.12 + 0.9 * max(dot(mN, L), 0.0) * (0.4 + reach)) + vec3(1.0, 0.9, 0.7) * pow(max(dot(mN, H), 0.0), 30.0) * 0.5 * (1.0 - wear);
  c = mix(c, moulding, fill(abs(sill) - 0.014, px));

  // Rowan on the step: a stalk of leaflets in pairs, and the red berries clustered at its end.
  vec2 r = p - vec2(0.82, -0.88);
  if (length(r) < 0.2) {
    c = gloom(c, p, vec2(0.83, -0.905), vec2(0.13, 0.02));
    vec2 a = vec2(-0.14, -0.025), b = vec2(0.05, 0.02);
    float stalk = sdSegment(r, a, b);
    vec3 green = vec3(0.13, 0.19, 0.08);
    vec2 dir = normalize(b - a);
    for (int i = 0; i < 5; i++) {
      float side = mod(float(i), 2.0) * 2.0 - 1.0;
      vec2 at = a + (b - a) * (0.15 + 0.17 * float(i));
      vec2 lq = rot(side * 0.95 - atan(dir.y, dir.x)) * (r - at);
      lq.x -= 0.022;
      float lf = sdEllipse(lq, vec2(0.024, 0.0075)) + 0.0012 * sin(lq.x * 600.0);
      vec3 lc = green * (0.8 + 0.3 * grain(r * 300.0)) * (0.6 + 1.4 * reach) * (lq.y > 0.0 ? 1.15 : 0.75);
      lc = mix(lc, lc * 0.6, stroke(lq.y, 0.0008, px));
      c = mix(c, lc, fill(lf, px));
    }
    c = mix(c, vec3(0.12, 0.09, 0.05) * (0.4 + reach), stroke(stalk, 0.002, px));
    for (int i = 0; i < 7; i++) {
      vec2 bc = b + vec2(0.012 * float(i % 3) - 0.005, 0.011 * float(i / 3) - 0.012);
      bc += 0.008 * (vec2(hash(vec2(float(i), 1.0)), hash(vec2(float(i), 2.0))) - 0.5);
      vec2 bq = (r - bc) / 0.0095;
      vec3 bn = normalize(vec3(bq, sqrt(max(1.0 - dot(bq, bq), 0.0))));
      vec3 berry = vec3(0.6, 0.1, 0.05) * (0.3 + 0.9 * max(dot(bn, L), 0.0) * (0.4 + reach));
      berry += vec3(1.0, 0.85, 0.7) * pow(max(dot(bn, H), 0.0), 50.0) * 0.6;
      c = mix(c, berry, fill(length(r - bc) - 0.0095, px));
    }
  }

  // The glass: the candle's flame caught in it, and a long faint sheen.
  vec2 g = p - FLAME;
  c += vec3(1.0, 0.78, 0.45) * flick * (exp(-length(g) * 7.0) * 0.08 + exp(-length(g) * 30.0) * 0.18);
  c += vec3(1.0, 0.86, 0.6) * 0.45 * flick * fill(length(g / vec2(0.45, 1.0)) - 0.012, px * 3.0);
  c += vec3(0.04, 0.038, 0.05) * smoothstep(0.08, 0.0, abs(p.x * 0.6 + p.y * 0.8 - 0.75));

  // The cabinet's frame: a gilt moulding, its leaf worn to the bole at the arrises, shading the
  // glass at its inner edge.
  float fb = sdBox(p, vec2(1.31, 0.97));
  c *= 1.0 - 0.4 * smoothstep(-0.07, 0.0, fb);
  float ft = clamp((fb - 0.012) / 0.018, -1.0, 1.0);
  vec3 fN = normalize(vec3(boxGrad(p, vec2(1.31, 0.97)) * ft, sqrt(1.0 - ft * ft) + 0.05));
  float fwear = smoothstep(0.6, 0.8, fbm(p * 22.0)) * smoothstep(0.3, 1.0, abs(ft));
  vec3 fleaf = mix(GOLD * (0.85 + 0.25 * grain(p * 200.0)), BOLE, fwear);
  vec3 frame = fleaf * (0.1 + 0.9 * max(dot(fN, L), 0.0) * (0.4 + reach)) + vec3(1.0, 0.9, 0.7) * pow(max(dot(fN, H), 0.0), 30.0) * 0.45 * (1.0 - fwear);
  c = mix(c, frame, smoothstep(-px, px, fb + 0.006));
  c *= 1.0 - 0.15 * dot(p * 0.5, p * 0.5);

  if (lensIn(p) > 0.0) c = fluoroscope(c, p, 1.0 - 0.5 * l.x - name);
  return c;
}
`,start({stage:t,root:n,env:r}){let i=e=>n.dataset.state=e?`bound`:`waiting`,a=s(n,r.on,i);i(a.bound);let o=0,c=0,l=-.6;return{frame(n,i){o=e(o,+!!a.bound,a.bound?3:1,i),c=e(c,a.toward.x,4,i),l=e(l,a.toward.y,4,i),t.set(`a`,[o,0,0,0]),t.set(`b`,[c,l,0,0]),t.set(`env`,[r.level,+!!r.on,0,0])},level:()=>o,dispose(){a.stop()}}},plates:[{name:`waiting`,caption:{almanac:`Waiting: the lattice fine and still, and no term struck.`,cipher:`Plate I: no agreement in force.`}},{name:`bound`,caption:{almanac:`Bound: the lattice drawn tight toward the words that were taken.`,cipher:`Plate II: agreement in force.`},a:[1,0,0,0],b:[.3,-.7,0,0]}]};export{l as scene};