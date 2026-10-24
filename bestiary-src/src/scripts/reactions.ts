import { mountFae } from './fae';
import type { InputName, Sample } from './input';
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
      setState(root, grown > 0.5 ? 'grown' : 'pod');
    },
    level: () => Math.max(value * 0.5, grown),
    dispose() {
      document.body.style.removeProperty('--mycelium');
      document.body.removeAttribute('data-torn');
    },
  };
}

function lycanthrope(root: HTMLElement, env: Env): Reaction {
  let form = env.on ? 1 : 0;
  let sprint = 0;
  return {
    frame(_t, dt, input) {
      const pace = clamp((input.pace - 1.2) / 2.8, 0, 1);
      sprint = approach(sprint, pace, pace > sprint ? 10 : 2, dt);
      const want = env.on || sprint > 0.15;
      form = approach(form, want ? 1 : 0, want ? 3 : 0.6, dt);
      setState(root, form > 0.5 ? 'wolf' : 'man');
    },
    level: () => Math.max(sprint, form * 0.6),
    dispose() {},
  };
}

function vampire(root: HTMLElement, env: Env): Reaction {
  let heat = 0;
  let drain = 0;
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  return {
    frame(_t, dt, input) {
      const wake = input.present ? falloff(Math.hypot(input.x, input.y), 2.4) : 0;
      const near = Math.max(input.near, input.dwell, env.on ? wake : 0);
      heat = approach(heat, near * (env.on ? 1 : 0.9), env.on ? 3 : 2, dt);
      drain = approach(drain, input.dwell, input.dwell > drain ? (env.on ? 0.8 : 0.5) : 0.15, dt);
      if (readout) readout.textContent = heat.toFixed(2);
      document.body.style.setProperty('--drain', drain.toFixed(2));
      setState(root, heat > 0.5 ? 'flushed' : env.on ? 'waking' : 'cold');
    },
    level: () => Math.max(heat, drain),
    pause() {},
    dispose() {
      document.body.style.removeProperty('--drain');
    },
  };
}

function golem(root: HTMLElement, env: Env): Reaction {
  let scrub = 0;
  let shown = 0;
  let latched = false;
  return {
    frame(_t, dt, input) {
      const target = env.on ? 0 : input.scrub;
      scrub = approach(scrub, target, target > scrub ? 5 : 0.5, dt);
      if (scrub >= 0.75) latched = true;
      else if (scrub < 0.3) latched = false;
      shown = approach(shown, latched ? 1 : 0, latched ? 3 : 1, dt);
      setState(root, env.on ? 'sabbath' : shown > 0.5 ? 'awake' : 'asleep');
    },
    level: () => Math.max(scrub * 0.6, shown),
    dispose() {},
  };
}

function kitsune(root: HTMLElement, env: Env): Reaction {
  const cap = clamp(Math.round(env.level * 9), 1, 9);
  let tails = 1;
  return {
    frame(_t, dt, input) {
      const goal = input.speed > 0.15 ? 1 : Math.min(cap, 1 + Math.floor(input.idle / 1.2));
      tails = approach(tails, goal, goal < tails ? 7 : 3, dt);
      setState(root, tails >= 1.5 ? 'unfurled' : 'one-tail');
      root.dataset.tails = String(Math.round(tails));
    },
    level: () => (tails - 1) / 8,
    dispose() {
      delete root.dataset.tails;
    },
  };
}

function troll(root: HTMLElement, env: Env): Reaction {
  let sun = 0;
  setState(root, 'breathing');
  return {
    frame(_t, dt) {
      if (env.on) sun = Math.min(1, sun + dt / 2.4);
      const stone = env.on ? smoothstep(clamp(sun * 1.4 - 0.25, 0, 1), 1) : 0;
      setState(root, stone > 0.5 ? 'stone' : 'breathing');
    },
    level: () => (env.on ? 0 : 0.3),
    dispose() {},
  };
}

function unicorn(root: HTMLElement, env: Env): Reaction {
  let reveal = 0;
  let glare = 0;
  const pace = env.on ? 5 : 9;
  return {
    frame(_t, dt, input) {
      const calm = input.speed < 0.3 && input.idle > 0.5;
      const startle = input.speed > 1.6 && reveal > 0.25;
      if (calm) reveal = Math.min(1, reveal + dt / pace);
      else if (startle) reveal = Math.max(0.3, reveal - dt * 0.05);
      else if (input.speed > 0.3) reveal = Math.max(0, reveal - dt * 0.25);
      glare = approach(glare, startle ? 1 : 0, startle ? 0.6 : 0.35, dt);
      setState(root, glare > 0.5 ? 'glaring' : reveal > 0.5 ? 'revealed' : 'hidden');
    },
    level: () => Math.max(reveal * 0.5, glare),
    dispose() {},
  };
}

function sidhe(root: HTMLElement, env: Env): Reaction {
  const seasons = ['winter', 'spring', 'summer', 'autumn'] as const;
  const season = seasons[Math.max(0, seasons.indexOf((env.note as (typeof seasons)[number]) ?? 'winter'))] ?? 'winter';
  let touch = 0;
  const ring = root.querySelector<HTMLElement>('.iron-ring');
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
      setState(root, weight > 0.15 || touch > 0.5 ? 'recoil' : season);
    },
    level: () => touch,
    dispose() {},
  };
}

function minotaur(root: HTMLElement, env: Env): Reaction {
  const walls = watchWalls();
  let share = 0;
  let tremor = 0.6;
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  const world = root.querySelector<HTMLElement>('.window-stage');
  setState(root, 'agitated');
  return {
    frame(time, dt) {
      share = approach(share, walls.share, 2, dt);
      const narrow = clamp((1100 - innerWidth) / 680, 0, 1);
      const target = Math.max(0.08, (1 - share) * (1 - 0.3 * narrow));
      tremor = approach(tremor, target, target > tremor ? (env.on ? 0.55 : 0.2) : 0.6, dt);
      if (readout) readout.textContent = tremor.toFixed(2);
      if (world && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const amp = (Math.min(root.getBoundingClientRect().width, 640) / 2) * 0.012 * 1.6 * tremor;
        const x = (Math.sin(time * Math.PI * 2 * 1.7) * 0.6 + Math.sin(time * Math.PI * 2 * 0.9 + 1.3) * 0.4) * amp;
        const y = (Math.sin(time * Math.PI * 2 * 1.3 + 0.7) * 0.6 + Math.sin(time * Math.PI * 2 * 0.6) * 0.4) * amp;
        world.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      }
      setState(root, tremor > 0.5 ? 'agitated' : 'contained');
    },
    level: () => tremor,
    dispose() {
      walls.stop();
      if (world) world.style.translate = '';
    },
  };
}

function fae(root: HTMLElement, env: Env): Reaction {
  let shown = 0;
  let bound = false;
  const terms = mountFae(root, env.on, (next) => {
    bound = next;
    setState(root, next ? 'bound' : 'waiting');
  });
  setState(root, 'waiting');
  return {
    frame(_t, dt) {
      shown = approach(shown, bound ? 1 : 0, bound ? 3 : 1, dt);
    },
    level: () => shown,
    dispose() {
      terms.stop();
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
  const day = env.level < 0.3;
  const light = root.querySelector<HTMLElement>('.wisp-light');
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
      setState(root, decoy ? 'decoy' : day ? 'shimmer' : 'lit');
    },
    level: () => Math.max(interest, decoy ? 0.8 : 0),
    dispose() {},
  };
}

function ophanim(root: HTMLElement, env: Env): Reaction {
  let attend = 0;
  return {
    frame(_t, dt, input) {
      const gazing = input.near > 0.15;
      attend = approach(attend, gazing ? 1 : 0, gazing ? 4 : 1.2, dt);
      setState(root, attend > 0.5 ? 'attending' : env.on ? 'blazing' : 'watching');
    },
    level: () => Math.max(attend * 0.8, (env.on ? 1 : env.level * 0.35) * 0.3),
    dispose() {},
  };
}

function djinn(root: HTMLElement, env: Env): Reaction {
  let press = 0;
  let crack = 0;
  return {
    frame(_t, dt, input) {
      const holding = input.held > 0;
      press = holding ? Math.min(1, press + dt / 4) : approach(press, 0, 3, dt);
      const boost = env.on ? 2 : 1;
      crack = holding ? Math.min(1, crack + (dt / 5) * boost) : approach(crack, 0, 0.8, dt);
      root.toggleAttribute('data-heat', press > 0.15);
      setState(root, crack > 0.05 ? 'cracked' : 'sealed');
    },
    level: () => Math.max(press, crack),
    pause() {
      press = 0;
    },
    dispose() {
      root.removeAttribute('data-heat');
    },
  };
}

function lich(root: HTMLElement, env: Env): Reaction {
  const vessel = root.querySelector<HTMLElement>('[data-vessel]');
  const script = root.querySelector<HTMLElement>('[data-lich-script]');
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
        const pointer = root.querySelector('.window')?.getBoundingClientRect();
        if (pointer && input.present) {
          const px = pointer.left + pointer.width / 2 + input.x * (Math.min(pointer.width, pointer.height) / 2);
          const py = pointer.top + pointer.height / 2 - input.y * (Math.min(pointer.width, pointer.height) / 2);
          const near =
            px >= rect.left - 36 && px <= rect.right + 36 && py >= rect.top - 36 && py <= rect.bottom + 36;
          if (near) mark();
        }
      }
      shown = approach(shown, found ? 1 : 0, 2, dt);
    },
    level: () => shown,
    dispose() {
      vessel?.removeEventListener('focus', mark);
      script?.removeEventListener('focus', mark);
      root.removeAttribute('data-dead-script');
    },
  };
}

function wraith(root: HTMLElement, env: Env): Reaction {
  let last: number | undefined;
  let torn = 0;
  let level = 0;
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
      setState(root, broken ? 'torn' : 'playing');
      void env;
    },
    level: () => level,
    pause: reset,
    dispose() {},
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
      void env;
    },
    level: () => weight,
    pause: bump,
    dispose() {
      for (const event of events) removeEventListener(event, bump);
    },
  };
}
