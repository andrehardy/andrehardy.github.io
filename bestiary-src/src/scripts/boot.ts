import { listen, type InputName } from './input';
import { mountHall } from './hall';
import { bindNight } from './night';
import { createReaction, type Env, type Visit } from './reactions';
import { mountTrail } from './trail';
import { mountWindow } from './windows';
import { a as skyNow, o as rollVisit, r as record } from '../vendor/journal.js';
import { a as soundOn, i as setSound, n as startVoices, r as bindLevel, t as SOUND_EVENT } from '../vendor/sound.js';

type Sky = { on: boolean; level: number; note?: string };

const sky = skyNow as (link: string, visit: Visit, date?: Date) => Sky;
const roll = rollVisit as (
  prev: { days: string[]; last: number | null },
  now: number,
  offset: number,
) => [{ days: string[]; last: number }, Visit];
const note = record as (id: string, link: string, visit: Visit, date?: Date) => void;

function visitsFor(slug: string): Visit {
  const key = `mr-bestiary-visits:${slug}`;
  const now = Date.now();
  const offset = new Date().getTimezoneOffset();
  try {
    const prev = JSON.parse(localStorage.getItem(key) ?? 'null') as { days: string[]; last: number | null } | null;
    const [next, stats] = roll(prev ?? { days: [], last: null }, now, offset);
    localStorage.setItem(key, JSON.stringify(next));
    return stats;
  } catch {
    return { returns: 0, lastSeen: null };
  }
}

function bindCipher() {
  const root = document.documentElement;
  const paint = () => {
    const on = root.hasAttribute('data-cipher');
    document.querySelectorAll<HTMLButtonElement>('[data-cipher-switch]').forEach((button) => {
      button.setAttribute('aria-pressed', String(on));
      const label = button.querySelector('span');
      if (label) label.textContent = on ? 'Read the Almanac' : 'Read the Cipher';
    });
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest('[data-cipher-switch]')) return;
    const on = !root.hasAttribute('data-cipher');
    root.toggleAttribute('data-cipher', on);
    try {
      localStorage.setItem('mr-cipher', on ? '1' : '0');
    } catch {
      /* storage refused */
    }
    paint();
  });
  paint();
}

function bindSound() {
  const paint = () => {
    const on = Boolean(soundOn());
    document.querySelectorAll<HTMLButtonElement>('[data-sound-switch]').forEach((button) => {
      button.setAttribute('aria-pressed', String(on));
    });
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest('[data-sound-switch]')) return;
    setSound(!soundOn());
  });
  document.addEventListener(String(SOUND_EVENT), () => {
    paint();
    startVoices();
  });
  paint();
  startVoices();
}

function mountSpecimen() {
  const root = document.querySelector<HTMLElement>('[data-specimen]');
  if (!root) return;
  const slug = root.dataset.specimen ?? '';
  const link = root.dataset.link ?? '';
  const input = (root.dataset.input ?? 'calm') as InputName;
  const visit = visitsFor(slug);
  const env: Env = link ? sky(link, visit) : { on: false, level: 0 };
  if (link) note(slug, link, visit);
  document.body.dataset.sky = env.on ? 'on' : 'off';
  document.body.style.setProperty('--sky', env.level.toFixed(2));
  if (env.note) document.body.dataset.skyNote = env.note;

  const windowEl = root.querySelector<HTMLElement>('[data-window]');
  const handle = windowEl ? mountWindow(windowEl) : null;
  const reaction = createReaction(slug, root, env, visit);
  if (root.dataset.state) markState(root.dataset.state);
  bindLevel(root, () => reaction.level());
  const leaf = document.querySelector<HTMLElement>('.creature.leaf') ?? document.body;
  const pointer = listen(leaf, input, { specimen: root });
  const dropTrail = mountTrail(slug);
  let raf = 0;
  let running = false;
  let marked = root.dataset.state ?? '';
  let last = performance.now();
  const started = last;
  const loop = (now: number) => {
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    const sample = pointer.read(dt);
    reaction.frame((now - started) / 1000, dt, sample);
    const next = root.dataset.state;
    if (next && next !== marked) {
      marked = next;
      markState(next);
    }
    if (next && handle && 'go' in handle) void handle.go(next);
    if (running) raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || document.visibilityState !== 'visible') return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    reaction.pause?.();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') start();
    else stop();
  });
  addEventListener('pagehide', () => {
    dropTrail();
    pointer.dispose();
    reaction.dispose();
  });
  start();
}

const ROOM_CURSORS: Record<string, string> = {
  djinn: 'cursor-seal-ring',
  fae: 'cursor-quill',
  golem: 'cursor-stylus',
  kitsune: 'cursor-foxfire',
  lich: 'cursor-candle',
  lycanthrope: 'cursor-probe',
  minotaur: 'cursor-clew',
  ophanim: 'cursor-reticle',
  orc: 'cursor-trowel',
  sidhe: 'cursor-iron',
  succubus: 'cursor-ember',
  troll: 'cursor-chisel',
  unicorn: 'cursor-needle',
  vampire: 'cursor-thermopile',
  'will-o-the-wisp': 'cursor-reed',
  wraith: 'cursor-playhead',
};

function bindRoomCursor() {
  const room = document.body.dataset.room;
  if (!room) {
    document.body.classList.add('hall-cursor');
    return;
  }
  const cls = ROOM_CURSORS[room];
  if (cls) document.body.classList.add(cls);
}

function unsealRoom() {
  const room = document.body.dataset.room;
  if (!room) return;
  const key = `mr-bestiary-unsealed:${room}`;
  let seen = false;
  try {
    seen = sessionStorage.getItem(key) === '1';
    if (!seen) sessionStorage.setItem(key, '1');
  } catch {
    seen = false;
  }
  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('room-unsealing');
  window.setTimeout(() => document.body.classList.remove('room-unsealing'), 1600);
}

export function boot() {
  bindCipher();
  bindSound();
  bindNight();
  bindRoomCursor();
  unsealRoom();
  document.querySelectorAll<HTMLElement>('[data-window]').forEach((el) => {
    if (el.dataset.mode === 'hall') mountWindow(el);
  });
  const hall = document.querySelector<HTMLElement>('[data-hall]');
  if (hall) mountHall(hall);
  mountSpecimen();
}

function markState(state: string) {
  document.querySelectorAll<HTMLElement>('.states li[data-state]').forEach((item) => {
    item.toggleAttribute('data-current', item.dataset.state === state);
  });
}
