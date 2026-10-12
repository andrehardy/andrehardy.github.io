const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/orc-scene.DqTdJmV7.js","assets/life.CiMj1Ee-.js","assets/vampire-scene.BU3syYg0.js","assets/input.CdXIQc7H.js"])))=>i.map(i=>d[i]);
import{a as e,o as t,r as n,t as r}from"./life.CiMj1Ee-.js";import{n as i,o as a,r as o,s,t as c}from"./sound.CqCHCl3G.js";import{a as l,o as u,r as d}from"./journal.B0SpQfKY.js";import{c as f,o as p,r as m,t as h}from"./input.CdXIQc7H.js";var g=`#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`,_=`#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec4 u_ptr;
uniform vec4 u_a;
uniform vec4 u_b;
uniform vec4 u_env;
uniform vec4 u_lens;
out vec4 o_color;
#define PI 3.14159265
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float grain(vec2 p) { float s = 0.0, a = 0.55; for (int i = 0; i < 3; i++) { s += a * noise(p); p = p * 2.07 + 9.1; a *= 0.5; } return s; }
vec2 plateDrift(float depth) { return u_ptr.xy * u_ptr.z * depth * 0.03; }
vec3 veil(vec3 c, vec3 air, float depth) { return mix(c, air, clamp(depth, 0.0, 0.7)); }
vec3 gloom(vec3 c, vec2 p, vec2 at, vec2 r) {
  return c * (1.0 - 0.5 * smoothstep(1.0, 0.18, length((p - at) / r)));
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdCircle(vec2 p, float r) { return length(p) - r; }
float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
float sdSegment(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
float sdEllipse(vec2 p, vec2 r) { float k = length(p / r); return (k - 1.0) * min(r.x, r.y); }
float fill(float d, float px) { return 1.0 - smoothstep(-px, px, d); }
float stroke(float d, float w, float px) { return 1.0 - smoothstep(w - px, w + px, abs(d)); }
float lensIn(vec2 p) { return u_lens.w * (1.0 - smoothstep(u_lens.z - 0.012, u_lens.z, length(p - u_lens.xy))); }
// One house light. n is a gradient of the form (not yet normalised). rough 0 is wet ivory,
// rough 1 is hide or leaf. emit is light the material makes itself.
vec3 lit(vec3 albedo, vec2 n, vec2 light, float rough, float emit) {
  vec2 N = normalize(n + vec2(1e-4, 0.0));
  vec2 L = normalize(light);
  float ndl = clamp(dot(N, L), 0.0, 1.0);
  float wrap = ndl * (1.0 - 0.45 * rough) + 0.45 * rough;
  float rim = pow(1.0 - clamp(dot(N, vec2(0.0, 1.0)), 0.0, 1.0), 2.0);
  vec2 H = normalize(L + vec2(0.0, 1.0));
  float spec = pow(clamp(dot(N, H), 0.0, 1.0), mix(10.0, 56.0, 1.0 - rough));
  vec3 c = albedo * (0.16 + 0.84 * wrap);
  c += vec3(0.93, 0.90, 0.82) * spec * (1.0 - rough) * 0.38;
  c += albedo * rim * 0.12;
  return c + albedo * emit;
}
vec3 lay(vec3 under, vec3 albedo, float d, vec2 n, vec2 light, float rough, float px) {
  vec3 ink = lit(albedo * (0.8 + 0.4 * grain(n + albedo.xy)), n, light, rough, 0.0);
  return mix(under, ink, fill(d, px));
}
void blot(inout vec3 c, vec2 q, vec2 r, vec3 alb, vec2 light, float rough, float px) {
  c = lay(c, alb, sdEllipse(q, r), q, light, rough, px);
}
// The case, over every plate: a soft edge, one reflection, and a fine pigment grain.
vec3 plateGlass(vec3 c, vec2 p) {
  float edge = smoothstep(0.62, 1.42, length(p * vec2(0.82, 1.05)));
  c *= 1.0 - 0.28 * edge;
  float streak = smoothstep(0.04, 0.0, abs(p.y - 0.28 - p.x * 0.16)) * smoothstep(1.1, 0.2, abs(p.x + 0.15));
  c += vec3(0.82, 0.88, 0.86) * streak * 0.055;
  c *= 0.94 + 0.1 * grain(gl_FragCoord.xy * 0.35);
  return c;
}
// The screen glows yellow-green where the rays pass (passes = 1) and stays dark where bone or
// metal stops them (passes = 0); it is ringed by its lead-glass rim and brass collar.
vec3 fluoroscope(vec3 c, vec2 p, float passes) {
  float speck = hash(floor(p * 260.0) + floor(u_time * 18.0)) - 0.5;
  vec3 screen = vec3(0.025, 0.045, 0.028) + vec3(0.62, 0.80, 0.42) * clamp(passes + speck * 0.06, 0.0, 1.2);
  c = mix(c, screen, lensIn(p));
  float r = length(p - u_lens.xy) - u_lens.z;
  c = mix(c, vec3(0.02), u_lens.w * stroke(r - 0.012, 0.012, 0.004));
  return mix(c, vec3(0.62, 0.48, 0.24), u_lens.w * stroke(r - 0.028, 0.004, 0.003));
}
vec3 scene(vec2 p);
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / (0.5 * min(u_res.x, u_res.y));
  vec3 c = plateGlass(scene(p), p);
  c += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;
  o_color = vec4(clamp(c, 0.0, 1.0), 1.0);
}
`;function v(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`bestiary: a scene failed to compile`,e.getShaderInfoLog(r)),e.deleteShader(r),null)):null}function y(e,t){let n=e.getContext(`webgl2`,{antialias:!1,alpha:!1,depth:!1,stencil:!1,powerPreference:`low-power`,preserveDrawingBuffer:!1});if(!n)return null;let r=()=>(n.getExtension(`WEBGL_lose_context`)?.loseContext(),null),i=v(n,n.VERTEX_SHADER,g),a=v(n,n.FRAGMENT_SHADER,_+t);if(!i||!a)return r();let o=n.createProgram();if(!o||(n.attachShader(o,i),n.attachShader(o,a),n.bindAttribLocation(o,0,`a_pos`),n.linkProgram(o),n.deleteShader(i),n.deleteShader(a),!n.getProgramParameter(o,n.LINK_STATUS)))return r();let s=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.useProgram(o);let c=e=>n.getUniformLocation(o,e),l={res:c(`u_res`),time:c(`u_time`),ptr:c(`u_ptr`),a:c(`u_a`),b:c(`u_b`),env:c(`u_env`),lens:c(`u_lens`)},u={a:[0,0,0,0],b:[0,0,0,0],env:[0,0,0,0]},d=[0,0,0,0],f=[0,0,.32,0];return{canvas:e,draw(t){n.viewport(0,0,e.width,e.height),n.uniform2f(l.res,e.width,e.height),n.uniform1f(l.time,t),n.uniform4fv(l.ptr,d),n.uniform4fv(l.a,u.a),n.uniform4fv(l.b,u.b),n.uniform4fv(l.env,u.env),n.uniform4fv(l.lens,f),n.drawArrays(n.TRIANGLES,0,3)},set(e,t){u[e]=t},pointer(e,t,n,r){d[0]=e,d[1]=t,d[2]=n,d[3]=r},lens(e,t,n,r){f[0]=e,f[1]=t,f[2]=n,f[3]=r},lensAt:()=>f,resize(t){let n=Math.max(1,Math.round(e.clientWidth*t)),r=Math.max(1,Math.round(e.clientHeight*t));(e.width!==n||e.height!==r)&&(e.width=n,e.height=r)},dispose(){n.deleteBuffer(s),n.deleteProgram(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}}}var b=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),x=.32,S=.06;function C(e,t,n){let r=0,i=0,a=0,o=0,s=0,c=0,l=!1,u,d=()=>(e.querySelector(`.case`)??e).getBoundingClientRect(),f=e=>{let t=d(),n=Math.min(t.width,t.height)/2;r=(e.clientX-t.left-t.width/2)/n,i=-(e.clientY-t.top-t.height/2)/n},m=[0,0],h=e=>{if(e.pointerType!==`touch`){if(f(e),l=!1,!n.rest){a=1;return}(u===void 0||Math.hypot(r-m[0],i-m[1])>S)&&(m=[r,i],u=0,a=0)}},g=e=>{e.pointerType===`touch`||l||(a=0,u=void 0)},_=t=>{t.pointerType===`touch`&&(e.contains(t.target)?(f(t),a=1):a=0)},v=t=>{if(t.target!==e)return;if(t.key===`Escape`){a=0,u=void 0;return}if(!n.arrows)return;let[o,s]=p(t.key);if(!o&&!s)return;t.preventDefault();let c=d(),f=c.width/Math.min(c.width,c.height),m=c.height/Math.min(c.width,c.height);r=Math.max(-f,Math.min(f,(a?r:0)+o)),i=Math.max(-m,Math.min(m,(a?i:0)+s)),a=1,l=!0},y=()=>{l&&(a=0)};return e.addEventListener(`pointermove`,h,{passive:!0}),e.addEventListener(`pointerleave`,g,{passive:!0}),document.addEventListener(`pointerdown`,_,{passive:!0}),e.addEventListener(`keydown`,v),e.addEventListener(`blur`,y),{frame(n){u!==void 0&&!l&&(u+=n,u>=.6&&(a=1)),o=b(o,r,18,n),s=b(s,i,18,n),c=e.hasAttribute(`data-lens-held`)?0:b(c,a,8,n),t.lens(o,s,x,c);let d=c>.5?`down`:`up`;e.dataset.lens!==d&&(e.dataset.lens=d)},dispose(){e.removeEventListener(`pointermove`,h),e.removeEventListener(`pointerleave`,g),document.removeEventListener(`pointerdown`,_),e.removeEventListener(`keydown`,v),e.removeEventListener(`blur`,y),delete e.dataset.lens}}}var w=Object.assign({"../rooms/djinn/djinn-scene.ts":()=>s(()=>import(`./djinn-scene.C62p9iv-.js`).then(e=>e.scene),[]),"../rooms/fae/fae-scene.ts":()=>s(()=>import(`./fae-scene.au9LtgXl.js`).then(e=>e.scene),[]),"../rooms/golem/golem-scene.ts":()=>s(()=>import(`./golem-scene.UYEoeh57.js`).then(e=>e.scene),[]),"../rooms/kitsune/kitsune-scene.ts":()=>s(()=>import(`./kitsune-scene.olHpsRiC.js`).then(e=>e.scene),[]),"../rooms/lich/lich-scene.ts":()=>s(()=>import(`./lich-scene.Dk0qIs4m.js`).then(e=>e.scene),[]),"../rooms/lycanthrope/lycanthrope-scene.ts":()=>s(()=>import(`./lycanthrope-scene.D3uaNfvD.js`).then(e=>e.scene),[]),"../rooms/minotaur/minotaur-scene.ts":()=>s(()=>import(`./minotaur-scene.CusuxGOI.js`).then(e=>e.scene),[]),"../rooms/ophanim/ophanim-scene.ts":()=>s(()=>import(`./ophanim-scene.AgHL9M7Z.js`).then(e=>e.scene),[]),"../rooms/orc/orc-scene.ts":()=>s(()=>import(`./orc-scene.DqTdJmV7.js`).then(e=>e.scene),__vite__mapDeps([0,1])),"../rooms/sidhe/sidhe-scene.ts":()=>s(()=>import(`./sidhe-scene.BK5iGevK.js`).then(e=>e.scene),[]),"../rooms/succubus/succubus-scene.ts":()=>s(()=>import(`./succubus-scene.JL9ozQqv.js`).then(e=>e.scene),[]),"../rooms/troll/troll-scene.ts":()=>s(()=>import(`./troll-scene.DYEzFUjK.js`).then(e=>e.scene),[]),"../rooms/unicorn/unicorn-scene.ts":()=>s(()=>import(`./unicorn-scene.DzAioqvV.js`).then(e=>e.scene),[]),"../rooms/vampire/vampire-scene.ts":()=>s(()=>import(`./vampire-scene.BU3syYg0.js`).then(e=>e.scene),__vite__mapDeps([2,3])),"../rooms/will-o-the-wisp/will-o-the-wisp-scene.ts":()=>s(()=>import(`./will-o-the-wisp-scene.CD_B04Ck.js`).then(e=>e.scene),[]),"../rooms/wraith/wraith-scene.ts":()=>s(()=>import(`./wraith-scene.RUtCg5CS.js`).then(e=>e.scene),[])}),T={full:60,light:30},E={full:1.5,light:.75};function D(e){let t=`mr-bestiary-visits:${e}`,n=Date.now(),r=new Date().getTimezoneOffset();try{let e=JSON.parse(localStorage.getItem(t)??`null`),[i,a]=u(e??{days:[],last:null},n,r);return localStorage.setItem(t,JSON.stringify(i)),a}catch{return{returns:0,lastSeen:null}}}function O(e,t,r){let i=e.getContext(`2d`);if(i&&t.complete&&t.naturalWidth!==0)return e.dataset.tier=`canvas`,n(n=>{let r=e.width=e.clientWidth,a=e.height=e.clientHeight;i.drawImage(t,0,0,r,a);let o=n/1e3,s=r*(.5+.3*Math.sin(o*.21)),c=i.createRadialGradient(s,a*.3,0,s,a*.3,Math.max(r,a)*.7);c.addColorStop(0,`rgba(255, 240, 210, 0.10)`),c.addColorStop(1,`rgba(0, 0, 0, 0.18)`),i.fillStyle=c,i.fillRect(0,0,r,a)},12*(r===`full`?1:.5))}function k(e){let t=document.body;t.dataset.sky=e.on?`on`:`off`,t.style.setProperty(`--sky`,e.level.toFixed(2)),e.note&&(t.dataset.skyNote=e.note)}async function A(i,a){let s=i.dataset.specimen??``,c=i.dataset.link,u=w[`../rooms/${s}/${s}-scene.ts`],d=i.querySelector(`canvas.stage`),p=i.querySelector(`img.poster`),g=c?l(c,a):{on:!1,level:0};if(i.dataset.env=g.on?`on`:`off`,s===document.body.dataset.room&&k(g),!u||!d||e())return;let _=r(),v=await u(),x=y(d,v.source);if(!x)return p?t(i,()=>O(d,p,_)??(()=>{})):void 0;i.dataset.tier=_,i.toggleAttribute(`data-live`,!0),i.tabIndex=0,i.dataset.label&&i.setAttribute(`aria-label`,i.dataset.label);let S=i.dataset.input??`calm`,D=f(i,S),A=C(i,x,{arrows:m[S].keyboard!==`alternate-arrows`,rest:h.has(S)}),j=0,M=v.start({stage:x,root:i,env:g,tier:_});o(i,()=>M.level());let N=performance.now(),P=N,F=1e3/T[_],I=Math.min(devicePixelRatio,E[_]),L=F,R=N,z=t(i,()=>{P=performance.now();let e=n(e=>{let t=Math.min(.1,(e-P)/1e3);L+=(e-P-L)*.1,P=e,L>F*1.3&&e-R>1e3&&I>.5&&(I=Math.max(.5,I*.8),R=e,i.dataset.scale=I.toFixed(2)),x.resize(I);let n=D.read(t);j=b(j,+!!n.present,4,t),x.pointer(n.x,n.y,j,n.speed),A.frame(t),M.frame((e-N)/1e3,t,n),x.draw((e-N)/1e3),i.drawn=(i.drawn??0)+1},T[_]);return()=>{e(),M.pause?.()}}),B=!1,V=()=>{B||(B=!0,d.removeEventListener(`webglcontextlost`,H),z(),M.dispose(),A.dispose(),D.dispose(),x.dispose(),i.removeAttribute(`data-live`),i.removeAttribute(`tabindex`),i.removeAttribute(`aria-label`))},H=()=>{V(),i.toggleAttribute(`data-lost`,!0)};return d.addEventListener(`webglcontextlost`,H),V}var j=[],M=0,N=new Map;function P(){N.clear();let e=document.body.dataset.room;if(!e)return;let t=D(e);N.set(e,t);let n=document.querySelector(`[data-specimen="${e}"]`)?.dataset.link;n&&d(e,n,t)}function F(){let e=M;for(let t of document.querySelectorAll(`[data-specimen]`)){let n=t.dataset.specimen;A(t,N.get(n)??{returns:0,lastSeen:null}).then(t=>{t&&(e===M?j.push(t):t())})}}function I(){M++,j.forEach(e=>e()),j=[]}document.addEventListener(`astro:page-load`,()=>{P(),F(),i()}),document.addEventListener(`astro:before-swap`,()=>{I(),a()}),document.addEventListener(c,i),matchMedia(`(prefers-reduced-motion: reduce)`).addEventListener(`change`,()=>{I(),F()});export{b as t};