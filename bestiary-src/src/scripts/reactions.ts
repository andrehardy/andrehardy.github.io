import { mountFae } from './fae';
import type { Sample } from './input';
import { watchWalls } from './minotaur';
import { approach, clamp, falloff, smoothstep } from './smooth';

export type Env = { on: boolean; level: number; note?: string };
export type Visit = { returns: number; lastSeen: number | null };

export type Reaction = {
  frame: (time: number, dt: number, input: Sample) => void;
  level: () => number;
  dispose: () => void;
  pause?: () => void;
};

const setState = (root: HTMLElement, state: string) => {
  if (root.dataset.state !== state) root.dataset.state = state;
};

const putLife = (n: number) => {
  document.body.style.setProperty('--life', n.toFixed(3));
};

export function createReaction(slug: string, root: HTMLElement, env: Env, _visit: Visit): Reaction {
  switch (slug) {
    case 'orc':
      return orc(root, env);
    case 'vampire':
      return vampire(root, env);
    case 'sidhe':
      return sidhe(root, env);
    case 'kitsune':
      return kitsune(root, env);
    case 'troll':
      return troll(root, env);
    case 'golem':
      return golem(root, env);
    case 'unicorn':
      return unicorn(root, env);
    case 'minotaur':
      return minotaur(root, env);
    case 'fae':
      return fae(root, env);
    case 'will-o-the-wisp':
      return wisp(root, env);
    case 'ophanim':
      return ophanim(root, env);
    case 'djinn':
      return djinn(root, env);
    case 'lich':
      return lich(root, env);
    case 'wraith':
      return wraith(root, env);
    case 'succubus':
      return succubus(root, env);
    case 'lycanthrope':
      return lycanthrope(root, env);
    default:
      return { frame() {}, level: () => 0, dispose() {} };
  }
}

function orc(root: HTMLElement, env: Env): Reaction {
  let value = 0;
  let torn = false;
  let velocity = 0;
  let stillFor = 0;
  let lastScroll = scrollY;
  let grown = 0;
  let tear = 0;
  const fruiting = env.on;
  return {
    frame(_time, dt) {
      const moved = Math.abs(scrollY - lastScroll) / Math.max(1, innerHeight);
      lastScroll = scrollY;
      const instant = moved / Math.max(dt, 0.001);
      velocity += (instant - velocity) * Math.min(1, dt * 8);
      if (moved > 0) stillFor = 0;
      else stillFor += dt;
      torn = velocity > 0.6;
      if (torn) value = Math.max(0, value - dt * 2.5);
      else if (stillFor > 1) value = Math.min(1, value + dt / (fruiting ? 6 : 9));
      const ripe = value >= 0.85;
      grown = approach(grown, ripe ? 1 : 0, ripe ? 0.9 : 3, dt);
      tear = approach(tear, torn ? 1 : 0, torn ? 10 : 1.5, dt);
      document.body.style.setProperty('--mycelium', value.toFixed(2));
      document.body.toggleAttribute('data-torn', torn);
      putLife(Math.max(value * 0.5, grown));
      setState(root, grown > 0.5 ? 'grown' : 'pod');
    },
    level: () => Math.max(value * 0.5, grown),
    dispose() {
      document.body.style.removeProperty('--mycelium');
      document.body.style.removeProperty('--life');
      document.body.removeAttribute('data-torn');
    },
  };
}

function lycanthrope(root: HTMLElement, env: Env): Reaction {
  let form = env.on ? 1 : 0;
  let sprint = 0;
  const strainEl = document.querySelector<HTMLElement>('.leaf > .strain');
  const scoresEl = document.querySelector<HTMLElement>('.leaf > .scores');
  const trail = document.querySelector<SVGSVGElement>('.leaf > .cursor-trail');
  const leader = trail?.querySelector<SVGLineElement>('.probe-leader');
  const bead = trail?.querySelector<SVGCircleElement>('.probe-bead');
  return {
    frame(_t, dt, input) {
      const pace = clamp((input.pace - 1.2) / 2.8, 0, 1);
      sprint = approach(sprint, pace, pace > sprint ? 10 : 2, dt);
      const want = env.on || sprint > 0.15;
      form = approach(form, want ? 1 : 0, want ? 3 : 0.6, dt);
      const strain = Math.max(sprint, form * 0.55);
      const scored = clamp(sprint * 1.2, 0, 1);
      strainEl?.style.setProperty('--strain', strain.toFixed(3));
      scoresEl?.style.setProperty('--scored', scored.toFixed(3));
      document.body.style.setProperty('--strain', strain.toFixed(3));
      document.body.style.setProperty('--scored', scored.toFixed(3));
      putLife(Math.max(sprint, form * 0.6));
      if (trail && input.present && leader && bead) {
        trail.toggleAttribute('data-pointing', true);
        const target = document.querySelector<HTMLElement>('.anatomy dt, .prose dt, .passage dt');
        const tx = target ? target.getBoundingClientRect().left : input.px + 40;
        const ty = target ? target.getBoundingClientRect().top + 8 : input.py + 40;
        leader.setAttribute('x1', String(input.px));
        leader.setAttribute('y1', String(input.py));
        leader.setAttribute('x2', String(tx));
        leader.setAttribute('y2', String(ty));
        bead.setAttribute('cx', String(tx));
        bead.setAttribute('cy', String(ty));
      } else {
        trail?.removeAttribute('data-pointing');
      }
      setState(root, form > 0.5 ? 'wolf' : 'man');
    },
    level: () => Math.max(sprint, form * 0.6),
    dispose() {
      document.body.style.removeProperty('--strain');
      document.body.style.removeProperty('--scored');
      document.body.style.removeProperty('--life');
      strainEl?.style.removeProperty('--strain');
      scoresEl?.style.removeProperty('--scored');
    },
  };
}

function vampire(root: HTMLElement, env: Env): Reaction {
  let heat = 0;
  let drain = 0;
  let frost = env.on ? 0.3 : 0;
  let hx = -999;
  let hy = -999;
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  const warmth = document.querySelector<HTMLElement>('.leaf > .warmth');
  const needle = document.querySelector<SVGElement>('.leaf > .thermopile');
  const REST = 2;
  const FROST = 6;
  const floor = frost;
  return {
    frame(_t, dt, input) {
      const present = input.present;
      const wake = present ? falloff(Math.hypot(input.x, input.y), 2.4) : 0;
      const near = Math.max(input.near, input.dwell, env.on ? wake : 0, present ? 0.85 : 0);
      heat = approach(heat, near * (env.on ? 1 : 0.9), env.on ? 3 : 2, dt);
      drain = approach(drain, input.dwell, input.dwell > drain ? (env.on ? 0.8 : 0.5) : 0.15, dt);
      hx = approach(hx === -999 ? input.px : hx, present ? input.px : hx, 7, dt);
      hy = approach(hy === -999 ? input.py : hy, present ? input.py : hy, 7, dt);
      const still = present ? input.idle : 0;
      const want = Math.max(floor, Math.min(1, (still - REST) / FROST));
      frost = want > frost ? approach(frost, want, 0.8, dt) : approach(frost, want, 0.3, dt);
      if (readout) readout.textContent = heat.toFixed(2);
      document.body.style.setProperty('--drain', drain.toFixed(2));
      warmth?.style.setProperty('--hx', hx.toFixed(1));
      warmth?.style.setProperty('--hy', hy.toFixed(1));
      warmth?.style.setProperty('--warmth', heat.toFixed(3));
      needle?.style.setProperty('--warmth', heat.toFixed(3));
      needle?.style.setProperty('--frost', frost.toFixed(3));
      document.querySelectorAll<HTMLElement>('.passage, .accession, .prose').forEach((el) => {
        el.style.setProperty('--frost', frost.toFixed(3));
      });
      putLife(Math.max(heat, drain));
      setState(root, heat > 0.5 ? 'flushed' : env.on ? 'waking' : 'cold');
    },
    level: () => Math.max(heat, drain),
    pause() {},
    dispose() {
      document.body.style.removeProperty('--drain');
      document.body.style.removeProperty('--life');
      for (const v of ['--hx', '--hy', '--warmth']) warmth?.style.removeProperty(v);
      for (const v of ['--warmth', '--frost']) needle?.style.removeProperty(v);
    },
  };
}

function golem(root: HTMLElement, env: Env): Reaction {
  let scrub = 0;
  let shown = 0;
  let latched = false;
  const sparks = document.querySelector<HTMLElement>('.leaf > .sparks');
  let lastSpark = 0;
  return {
    frame(time, dt, input) {
      const target = env.on ? 0 : input.scrub;
      scrub = approach(scrub, target, target > scrub ? 5 : 0.5, dt);
      if (scrub >= 0.75) latched = true;
      else if (scrub < 0.3) latched = false;
      shown = approach(shown, latched ? 1 : 0, latched ? 3 : 1, dt);
      document.body.style.setProperty('--smooth', scrub.toFixed(3));
      document.querySelectorAll<HTMLElement>('.passage, .prose, .accession').forEach((el) => {
        el.style.setProperty('--smooth', scrub.toFixed(3));
      });
      if (sparks && scrub > 0.2 && input.present && time - lastSpark > 0.08) {
        lastSpark = time;
        const mote = document.createElement('span');
        mote.className = 'spark';
        mote.style.setProperty('--a', String(Math.random() * 360));
        mote.style.setProperty('--d', String(12 + Math.random() * 28));
        mote.style.left = `${input.px}px`;
        mote.style.top = `${input.py}px`;
        sparks.append(mote);
        while (sparks.childElementCount > 18) sparks.firstElementChild?.remove();
        window.setTimeout(() => mote.remove(), 500);
      }
      putLife(Math.max(scrub * 0.6, shown));
      setState(root, env.on ? 'sabbath' : shown > 0.5 ? 'awake' : 'asleep');
    },
    level: () => Math.max(scrub * 0.6, shown),
    dispose() {
      document.body.style.removeProperty('--smooth');
      document.body.style.removeProperty('--life');
    },
  };
}

function kitsune(root: HTMLElement, env: Env): Reaction {
  const cap = clamp(Math.round(env.level * 9), 1, 9);
  let tails = 1;
  let still = 0;
  let snow = 0;
  const snowfall = document.querySelector<HTMLElement>('.leaf > .snowfall');
  const foxfires = document.querySelectorAll<HTMLElement>('.foxfires .foxfire');
  return {
    frame(_t, dt, input) {
      const goal = input.speed > 0.15 ? 1 : Math.min(cap, 1 + Math.floor(input.idle / 1.2));
      tails = approach(tails, goal, goal < tails ? 7 : 3, dt);
      const quiet = input.speed < 0.12;
      still = approach(still, quiet ? Math.min(1, input.idle / 4) : 0, quiet ? 1.2 : 4, dt);
      snow = approach(snow, still > 0.2 ? still : 0, 0.8, dt);
      setState(root, tails >= 1.5 ? 'unfurled' : 'one-tail');
      root.dataset.tails = String(Math.round(tails));
      document.body.toggleAttribute('data-snowing', snow > 0.15);
      snowfall?.style.setProperty('--still', still.toFixed(3));
      snowfall?.style.setProperty('--snow', snow.toFixed(3));
      document.querySelector<HTMLElement>('.foxfires')?.style.setProperty('--still', still.toFixed(3));
      const lit = Math.round(tails);
      foxfires.forEach((el, i) => el.toggleAttribute('data-lit', i < lit));
      putLife((tails - 1) / 8);
    },
    level: () => (tails - 1) / 8,
    dispose() {
      delete root.dataset.tails;
      document.body.removeAttribute('data-snowing');
      document.body.style.removeProperty('--life');
    },
  };
}

function troll(root: HTMLElement, env: Env): Reaction {
  let sun = 0;
  let lichen = 0;
  let stillFor = 0;
  let lastScroll = scrollY;
  setState(root, 'breathing');
  return {
    frame(_t, dt, input) {
      if (env.on) sun = Math.min(1, sun + dt / 2.4);
      const stone = env.on ? smoothstep(clamp(sun * 1.4 - 0.25, 0, 1), 1) : 0;
      const moved = Math.abs(scrollY - lastScroll) > 2;
      lastScroll = scrollY;
      if (moved || input.speed > 0.2) stillFor = 0;
      else stillFor += dt;
      if (!env.on && stillFor > 1.2) lichen = Math.min(1, lichen + dt / 10);
      else if (env.on) lichen = Math.max(0, lichen - dt * 0.4);
      document.body.style.setProperty('--lichen', lichen.toFixed(3));
      document.querySelectorAll<HTMLElement>('.passage, .prose').forEach((el) => {
        el.style.setProperty('--lichen', lichen.toFixed(3));
      });
      putLife(env.on ? stone : Math.max(0.3, lichen));
      setState(root, stone > 0.5 ? 'stone' : 'breathing');
    },
    level: () => (env.on ? 0 : Math.max(0.3, lichen)),
    dispose() {
      document.body.style.removeProperty('--lichen');
      document.body.style.removeProperty('--life');
    },
  };
}

function unicorn(root: HTMLElement, env: Env): Reaction {
  let reveal = 0;
  let glare = 0;
  const pace = env.on ? 5 : 9;
  const glareEl = document.querySelector<HTMLElement>('.leaf > .glare');
  return {
    frame(_t, dt, input) {
      const calm = input.speed < 0.3 && input.idle > 0.5;
      const startle = input.speed > 1.6 && reveal > 0.25;
      if (calm) reveal = Math.min(1, reveal + dt / pace);
      else if (startle) reveal = Math.max(0.3, reveal - dt * 0.05);
      else if (input.speed > 0.3) reveal = Math.max(0, reveal - dt * 0.25);
      glare = approach(glare, startle ? 1 : 0, startle ? 0.6 : 0.35, dt);
      glareEl?.style.setProperty('--glare', glare.toFixed(3));
      document.body.style.setProperty('--glare', glare.toFixed(3));
      putLife(Math.max(reveal * 0.5, glare));
      setState(root, glare > 0.5 ? 'glaring' : reveal > 0.5 ? 'revealed' : 'hidden');
    },
    level: () => Math.max(reveal * 0.5, glare),
    dispose() {
      document.body.style.removeProperty('--glare');
      document.body.style.removeProperty('--life');
      glareEl?.style.removeProperty('--glare');
    },
  };
}

function sidhe(root: HTMLElement, env: Env): Reaction {
  const seasons = ['winter', 'spring', 'summer', 'autumn'] as const;
  const season = seasons[Math.max(0, seasons.indexOf((env.note as (typeof seasons)[number]) ?? 'winter'))] ?? 'winter';
  let touch = 0;
  const ring = root.querySelector<HTMLElement>('.iron-ring');
  const bare = document.querySelector<HTMLElement>('.glamour .bare');
  const stone = document.querySelector<HTMLElement>('.glamour .stone');
  return {
    frame(_t, dt, input) {
      const dist = Math.hypot(input.x, input.y + 0.05);
      const weight = input.present || input.near >= 1 ? clamp((0.72 - dist) / 0.5, 0, 1) : 0;
      touch = approach(touch, weight > 0.28 ? 1 : 0, weight > 0.28 ? 3 : 0.25, dt);
      if (ring) {
        ring.style.setProperty('--ix', `${50 + input.x * 28}%`);
        ring.style.setProperty('--iy', `${50 - input.y * 28}%`);
        ring.toggleAttribute('data-down', input.present || input.near >= 1);
      }
      const iron = touch;
      for (const el of [bare, stone]) {
        if (!el) continue;
        el.style.setProperty('--ix', input.px.toFixed(1));
        el.style.setProperty('--iy', input.py.toFixed(1));
        el.style.setProperty('--iron', iron.toFixed(3));
      }
      putLife(touch);
      setState(root, weight > 0.15 || touch > 0.5 ? 'recoil' : season);
    },
    level: () => touch,
    dispose() {
      document.body.style.removeProperty('--life');
    },
  };
}

function minotaur(root: HTMLElement, env: Env): Reaction {
  const walls = watchWalls();
  let share = 0;
  let tremor = 0.6;
  let laid = -1;
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  const world = root.querySelector<HTMLElement>('.window-stage');
  const leaf = document.querySelector<HTMLElement>('.creature.leaf');
  const thread = document.querySelector<SVGPathElement>('#ariadne-thread, .clew-line');
  const cells = [...document.querySelectorAll<HTMLElement>('.leaf .passage, .leaf [data-part]')];
  const layThread = () => {
    if (!leaf || !thread) return;
    const box = leaf.getBoundingClientRect();
    const read = cells.filter((c) => c.hasAttribute('data-read') || c.querySelector('[data-read]'));
    // Prefer IntersectionObserver share; also mark passages by scroll share for path points.
    const count = Math.max(1, Math.round(share * cells.length));
    const points: [number, number][] = [[box.width / 2, 0]];
    cells.slice(0, count).forEach((c) => {
      const r = c.getBoundingClientRect();
      points.push([r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]);
      c.toggleAttribute('data-read', true);
    });
    if (points.length < 2) {
      thread.setAttribute('d', '');
      return;
    }
    let d = `M${points[0]![0].toFixed(0)} ${points[0]![1].toFixed(0)}`;
    for (let i = 1; i < points.length; i++) {
      const py = points[i - 1]![1];
      const [x, y] = points[i]!;
      const mid = (py + y) / 2;
      d += `V${mid.toFixed(0)}H${x.toFixed(0)}V${y.toFixed(0)}`;
    }
    thread.setAttribute('d', d);
    thread.style.strokeDasharray = '1';
    thread.style.strokeDashoffset = '0';
    void read;
  };
  setState(root, 'agitated');
  return {
    frame(time, dt) {
      share = approach(share, walls.share, 2, dt);
      const narrow = clamp((1100 - innerWidth) / 680, 0, 1);
      const target = Math.max(0.08, (1 - share) * (1 - 0.3 * narrow));
      tremor = approach(tremor, target, target > tremor ? (env.on ? 0.55 : 0.2) : 0.6, dt);
      if (readout) readout.textContent = tremor.toFixed(2);
      const step = Math.round(share * 20);
      if (step !== laid) {
        laid = step;
        layThread();
      }
      if (world && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const amp = (Math.min(root.getBoundingClientRect().width, 640) / 2) * 0.012 * 1.6 * tremor;
        const x = (Math.sin(time * Math.PI * 2 * 1.7) * 0.6 + Math.sin(time * Math.PI * 2 * 0.9 + 1.3) * 0.4) * amp;
        const y = (Math.sin(time * Math.PI * 2 * 1.3 + 0.7) * 0.6 + Math.sin(time * Math.PI * 2 * 0.6) * 0.4) * amp;
        world.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      }
      putLife(1 - tremor);
      setState(root, tremor > 0.5 ? 'agitated' : 'contained');
    },
    level: () => tremor,
    dispose() {
      walls.stop();
      if (world) world.style.translate = '';
      thread?.setAttribute('d', '');
      cells.forEach((c) => c.removeAttribute('data-read'));
      document.body.style.removeProperty('--life');
    },
  };
}

function fae(root: HTMLElement, env: Env): Reaction {
  let shown = 0;
  let bound = false;
  let bind = 0;
  const binding = document.querySelector<HTMLElement>('.leaf > .binding');
  const lattices = document.querySelectorAll<HTMLElement>('.lattice');
  const terms = mountFae(root, env.on, (next) => {
    bound = next;
    setState(root, next ? 'bound' : 'waiting');
  });
  setState(root, 'waiting');
  return {
    frame(_t, dt, input) {
      const fromSelect = input.selected > 0 ? Math.min(1, input.selected / 40) : 0;
      const want = bound ? 1 : fromSelect;
      bind = approach(bind, want, want > bind ? 2.5 : 1, dt);
      shown = approach(shown, bound || bind > 0.4 ? 1 : 0, bound ? 3 : 1, dt);
      binding?.style.setProperty('--bind', bind.toFixed(3));
      lattices.forEach((el) => el.style.setProperty('--bind', bind.toFixed(3)));
      document.body.style.setProperty('--bind', bind.toFixed(3));
      putLife(shown);
    },
    level: () => shown,
    dispose() {
      terms.stop();
      document.body.style.removeProperty('--bind');
      document.body.style.removeProperty('--life');
    },
  };
}

function wisp(root: HTMLElement, env: Env): Reaction {
  const home = { x: 0.4, y: 0.05 };
  const edge = { x: 1.15, top: 0.4, bottom: -0.7 };
  const reach = 0.42;
  let x = home.x;
  let y = home.y;
  let glow = 1;
  let phase = 0;
  let flee = 0;
  let decoy = false;
  let interest = 0;
  let lx = 0;
  let ly = 0;
  const day = env.level < 0.3;
  const light = root.querySelector<HTMLElement>('.wisp-light');
  const lure = document.querySelector<HTMLElement>('.leaf > .lure');
  return {
    frame(time, dt, input) {
      let tx = home.x + 0.12 * Math.sin(time * 0.23);
      let ty = home.y + 0.05 * Math.sin(time * 0.37);
      const dx = x - input.x;
      const dy = y - input.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const chasing = input.present && dist < reach * 1.6;
      if (chasing && phase === 0) {
        tx = input.x + (dx / dist) * reach;
        ty = input.y + (dy / dist) * reach;
      }
      tx = clamp(tx, -edge.x, edge.x);
      ty = clamp(ty, edge.bottom, edge.top);
      const atEdge = Math.abs(x) > edge.x - 0.05 || y > edge.top - 0.05 || y < edge.bottom + 0.05;
      if (phase === 0 && chasing && atEdge && dist < reach) {
        phase = 1;
        flee = Math.sign(input.x || 1);
        decoy = true;
      }
      if (phase === 1) {
        glow = approach(glow, 0, 6, dt);
        if (glow < 0.02) {
          x = -flee * 0.85;
          y = home.y;
          phase = 2;
        }
      } else {
        glow = approach(glow, 1, phase === 2 ? 1.6 : 4, dt);
        if (phase === 2 && glow > 0.95) {
          phase = 0;
          decoy = false;
        }
        const rate = 4 + 3 * input.speed;
        x = approach(x, tx, rate, dt);
        y = approach(y, ty, rate, dt);
      }
      interest = approach(interest, chasing ? 1 - dist / (reach * 1.6) : 0, 3, dt);
      if (light) {
        light.style.setProperty('--wisp-x', `${(50 + x * 22).toFixed(1)}%`);
        light.style.setProperty('--wisp-y', `${(50 - y * 22).toFixed(1)}%`);
        light.style.opacity = String(glow * (day ? 0.45 : 1));
      }
      // Leaf lure ahead of the hand (page pixels)
      const ahead = 0.35;
      const vx = input.present ? (input.px - (lx || input.px)) : 0;
      const vy = input.present ? (input.py - (ly || input.py)) : 0;
      const targetLx = input.present ? input.px + vx * ahead * 60 : lx;
      const targetLy = input.present ? input.py + vy * ahead * 60 : ly;
      lx = approach(lx || targetLx, targetLx, 5, dt);
      ly = approach(ly || targetLy, targetLy, 5, dt);
      const burn = glow * (day ? 0.35 : 0.85) * (0.35 + interest * 0.65);
      lure?.style.setProperty('--lx', lx.toFixed(1));
      lure?.style.setProperty('--ly', ly.toFixed(1));
      lure?.style.setProperty('--burn', burn.toFixed(3));
      document.body.toggleAttribute('data-lure', chasing || decoy);
      putLife(Math.max(interest, decoy ? 0.8 : 0));
      setState(root, decoy ? 'decoy' : day ? 'shimmer' : 'lit');
    },
    level: () => Math.max(interest, decoy ? 0.8 : 0),
    dispose() {
      document.body.removeAttribute('data-lure');
      document.body.style.removeProperty('--life');
    },
  };
}

function ophanim(root: HTMLElement, env: Env): Reaction {
  let attend = 0;
  const gaze = document.querySelector<HTMLElement>('.leaf > .gaze');
  return {
    frame(_t, dt, input) {
      const gazing = input.near > 0.15 || input.present;
      attend = approach(attend, gazing ? 1 : 0, gazing ? 4 : 1.2, dt);
      if (gaze && input.present) {
        gaze.style.setProperty('--gx', input.px.toFixed(1));
        gaze.style.setProperty('--gy', input.py.toFixed(1));
        gaze.style.setProperty('--gaze', attend.toFixed(3));
      }
      putLife(Math.max(attend * 0.8, (env.on ? 1 : env.level * 0.35) * 0.3));
      setState(root, attend > 0.5 ? 'attending' : env.on ? 'blazing' : 'watching');
    },
    level: () => Math.max(attend * 0.8, (env.on ? 1 : env.level * 0.35) * 0.3),
    dispose() {
      document.body.style.removeProperty('--life');
    },
  };
}

function djinn(root: HTMLElement, env: Env): Reaction {
  let press = 0;
  let crack = 0;
  const smoke = document.querySelector<HTMLElement>('.leaf > .smoke');
  return {
    frame(_t, dt, input) {
      const holding = input.held > 0;
      press = holding ? Math.min(1, press + dt / 4) : approach(press, 0, 3, dt);
      const boost = env.on ? 2 : 1;
      crack = holding ? Math.min(1, crack + (dt / 5) * boost) : approach(crack, 0, 0.8, dt);
      const heat = press > 0.15;
      root.toggleAttribute('data-heat', heat);
      document.body.toggleAttribute('data-heat', heat);
      document.body.toggleAttribute('data-smoking', crack > 0.05);
      smoke?.style.setProperty('--smoke', Math.max(press, crack).toFixed(3));
      putLife(Math.max(press, crack));
      setState(root, crack > 0.05 ? 'cracked' : 'sealed');
    },
    level: () => Math.max(press, crack),
    pause() {
      press = 0;
    },
    dispose() {
      root.removeAttribute('data-heat');
      document.body.removeAttribute('data-heat');
      document.body.removeAttribute('data-smoking');
      document.body.style.removeProperty('--life');
      smoke?.style.removeProperty('--smoke');
    },
  };
}

function lich(root: HTMLElement, env: Env): Reaction {
  const vessel = root.querySelector<HTMLElement>('[data-vessel]');
  const script = root.querySelector<HTMLElement>('[data-lich-script]');
  const candle = document.querySelector<HTMLElement>('.leaf > .candlelight');
  let found = false;
  let shown = 0;
  const mark = () => {
    found = true;
    root.removeAttribute('data-dead-script');
    setState(root, 'found');
  };
  vessel?.addEventListener('focus', mark);
  script?.addEventListener('focus', mark);
  root.toggleAttribute('data-dead-script', true);
  setState(root, 'decoy');
  return {
    frame(_t, dt, input) {
      if (!found && vessel) {
        const rect = vessel.getBoundingClientRect();
        if (input.present) {
          const px = input.px;
          const py = input.py;
          const near =
            px >= rect.left - 36 && px <= rect.right + 36 && py >= rect.top - 36 && py <= rect.bottom + 36;
          if (near) mark();
        }
      }
      shown = approach(shown, found ? 1 : 0, 2, dt);
      if (candle && input.present) {
        candle.style.setProperty('--cx', input.px.toFixed(1));
        candle.style.setProperty('--cy', input.py.toFixed(1));
        candle.style.setProperty('--lit', (found ? 0.85 : 0.35).toFixed(3));
      } else if (candle) {
        candle.style.setProperty('--lit', found ? '0.4' : '0');
      }
      putLife(shown);
      void env;
    },
    level: () => shown,
    dispose() {
      vessel?.removeEventListener('focus', mark);
      script?.removeEventListener('focus', mark);
      root.removeAttribute('data-dead-script');
      document.body.style.removeProperty('--life');
    },
  };
}

function wraith(root: HTMLElement, env: Env): Reaction {
  let last: number | undefined;
  let torn = 0;
  let level = 0;
  let fray = 0;
  const staticEl = document.querySelector<HTMLElement>('.leaf > .static');
  const reset = () => {
    last = undefined;
  };
  return {
    frame(_t, dt, input) {
      const page = scrollY / Math.max(1, innerHeight);
      if (last !== undefined && page > last) torn += Math.min(0.05, page - last);
      last = page;
      if (input.heading === -1 && input.upFor >= 0.4) torn = 0;
      const broken = torn >= 0.12;
      level = approach(level, broken ? 0.6 + 0.4 * Math.min(1, input.pace * 2) : 0, broken ? 6 : 3, dt);
      fray = approach(fray, broken ? Math.min(1, torn * 4) : 0, broken ? 4 : 1.5, dt);
      staticEl?.style.setProperty('--fray', fray.toFixed(3));
      document.body.style.setProperty('--fray', fray.toFixed(3));
      document.querySelectorAll<HTMLElement>('.creature-head h1, .passage h2, h2').forEach((el) => {
        el.style.setProperty('--lag', (fray * 8).toFixed(1));
        el.toggleAttribute('data-ghost', fray > 0.4);
      });
      putLife(level);
      setState(root, broken ? 'torn' : 'playing');
      void env;
    },
    level: () => level,
    pause: reset,
    dispose() {
      document.body.style.removeProperty('--fray');
      document.body.style.removeProperty('--life');
    },
  };
}

function succubus(root: HTMLElement, env: Env): Reaction {
  let last = performance.now();
  const bump = () => {
    last = performance.now();
  };
  const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;
  for (const event of events) addEventListener(event, bump, { passive: true });
  let pressed = false;
  let weight = 0;
  const closing = document.querySelector<HTMLElement>('.leaf > .closing');
  const breathing = document.querySelector<HTMLElement>('.leaf > .breathing');
  const breath = document.querySelector<HTMLElement>('.leaf > .breath');
  setState(root, 'sleeping');
  return {
    frame(_t, dt, input) {
      const idle = Math.min(input.idle, (performance.now() - last) / 1000);
      const next = idle >= 5;
      if (next !== pressed) {
        pressed = next;
        setState(root, pressed ? 'pressed' : 'sleeping');
      }
      weight = approach(weight, pressed ? 1 : 0, pressed ? 0.6 : 5, dt);
      for (const el of [closing, breathing, breath]) {
        el?.style.setProperty('--flat', weight.toFixed(3));
      }
      document.body.style.setProperty('--flat', weight.toFixed(3));
      putLife(1 - weight);
      void env;
    },
    level: () => weight,
    pause: bump,
    dispose() {
      for (const event of events) removeEventListener(event, bump);
      document.body.style.removeProperty('--flat');
      document.body.style.removeProperty('--life');
    },
  };
}
