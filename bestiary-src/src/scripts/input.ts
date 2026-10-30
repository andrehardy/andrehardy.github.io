import { clamp, falloff } from './smooth';

export type InputName =
  | 'scroll-speed'
  | 'warmth'
  | 'iron-lens'
  | 'stillness-gathers'
  | 'lingering'
  | 'sunstrike'
  | 'friction'
  | 'calm'
  | 'reading-walls'
  | 'selection'
  | 'lead'
  | 'gaze'
  | 'hold'
  | 'phylactery'
  | 'scroll-direction'
  | 'idle';

export type Sample = {
  x: number;
  y: number;
  /** Page / client pixels for leaf CSS vars (--hx/--hy, --lx/--ly, …). */
  px: number;
  py: number;
  present: boolean;
  speed: number;
  idle: number;
  near: number;
  dwell: number;
  scrub: number;
  held: number;
  selected: number;
  pace: number;
  heading: number;
  upFor: number;
};

const CHANNELS: Record<InputName, string[]> = {
  'scroll-speed': ['scroll'],
  warmth: ['proximity', 'dwell'],
  'iron-lens': ['proximity'],
  'stillness-gathers': ['idle', 'velocity'],
  lingering: ['dwell', 'scroll'],
  sunstrike: [],
  friction: ['scrub'],
  calm: ['velocity', 'idle'],
  'reading-walls': ['scroll'],
  selection: ['selection'],
  lead: ['proximity', 'velocity'],
  gaze: ['proximity'],
  hold: ['hold'],
  phylactery: ['proximity'],
  'scroll-direction': ['scroll'],
  idle: ['idle'],
};

const KEYBOARD: Record<InputName, string> = {
  'scroll-speed': 'paging',
  warmth: 'focus-is-near',
  'iron-lens': 'arrows-move-lens',
  'stillness-gathers': 'stillness',
  lingering: 'stillness',
  sunstrike: 'automatic',
  friction: 'alternate-arrows',
  calm: 'stillness',
  'reading-walls': 'paging',
  selection: 'select-all-or-shift-arrows',
  lead: 'tab-to-it',
  gaze: 'focus-is-near',
  hold: 'hold-space-or-enter',
  phylactery: 'tab-to-it',
  'scroll-direction': 'up-arrow',
  idle: 'any-key',
};

const REST = new Set<InputName>(['lead', 'warmth', 'gaze', 'phylactery']);
const CONTROL = 'a, button, summary, label, [role="button"], input, select, textarea, .house-bar';

const decay = (peak: number, age: number, halfLife: number) => (age <= 0 ? peak : peak * 0.5 ** (age / halfLife));

class Speed {
  peak = 0;
  at = 0;
  last: { x: number; y: number; t: number } | null = null;
  constructor(private halfLife = 0.15) {}
  sample(x: number, y: number, t: number) {
    const current = this.value(t);
    if (this.last && t > this.last.t) {
      const v = Math.hypot(x - this.last.x, y - this.last.y) / (t - this.last.t);
      this.peak = Math.max(current, v);
    } else this.peak = current;
    this.at = t;
    this.last = { x, y, t };
  }
  lift() {
    this.last = null;
  }
  value(t: number) {
    return decay(this.peak, t - this.at, this.halfLife);
  }
}

class Idle {
  last: number;
  constructor(now: number) {
    this.last = now;
  }
  stir(t: number) {
    this.last = t;
  }
  idleFor(t: number) {
    return Math.max(0, t - this.last);
  }
}

class Dwell {
  seconds = 0;
  constructor(private full = 6) {}
  step(dt: number, near: number, moving: boolean) {
    this.seconds = near > 0.5 && !moving ? Math.min(this.full, this.seconds + dt * near) : Math.max(0, this.seconds - dt * 2);
    return this.seconds / this.full;
  }
}

class Scrub {
  charge = 0;
  at = 0;
  direction = 0;
  travel = 0;
  last: number | undefined;
  constructor(
    private stroke = 0.15,
    private turns = 8,
    private halfLife = 2,
  ) {}
  sample(x: number, t: number) {
    this.charge = this.value(t);
    this.at = t;
    if (this.last === undefined) {
      this.last = x;
      return;
    }
    const delta = x - this.last;
    this.last = x;
    if (delta === 0) return;
    const dir = Math.sign(delta);
    if (dir !== this.direction) {
      if (this.direction !== 0 && this.travel >= this.stroke) this.charge = Math.min(1, this.charge + 1 / this.turns);
      this.direction = dir;
      this.travel = 0;
    }
    this.travel += Math.abs(delta);
  }
  lift() {
    this.last = undefined;
    this.direction = 0;
    this.travel = 0;
  }
  value(t: number) {
    return decay(this.charge, t - this.at, this.halfLife);
  }
}

class Hold {
  since: number | undefined;
  press(t: number) {
    this.since ??= t;
  }
  release() {
    this.since = undefined;
  }
  held(t: number) {
    return this.since === undefined ? 0 : Math.max(0, t - this.since);
  }
}

class ScrollPace {
  speed = new Speed(0.25);
  last: number | undefined;
  upSince: number | undefined;
  dir = 0;
  sample(page: number, t: number) {
    this.speed.sample(0, page, t);
    if (this.last !== undefined && page !== this.last) {
      this.dir = page > this.last ? 1 : -1;
      this.upSince = this.dir === -1 ? (this.upSince ?? t) : undefined;
    }
    this.last = page;
  }
  upFor(t: number) {
    return this.upSince === undefined ? 0 : t - this.upSince;
  }
  pace(t: number) {
    return this.speed.value(t);
  }
}

const arrowNudge = (key: string, step = 0.08): [number, number] => {
  switch (key) {
    case 'ArrowLeft':
      return [-step, 0];
    case 'ArrowRight':
      return [step, 0];
    case 'ArrowUp':
      return [0, step];
    case 'ArrowDown':
      return [0, -step];
    default:
      return [0, 0];
  }
};

const isPress = (key: string) => key === ' ' || key === 'Enter';

export const CALM: Sample = {
  x: 0,
  y: 0,
  px: -999,
  py: -999,
  present: false,
  speed: 0,
  idle: 0,
  near: 0,
  dwell: 0,
  scrub: 0,
  held: 0,
  selected: 0,
  pace: 0,
  heading: 0,
  upFor: 0,
};

export type ListenOpts = {
  /** Specimen figure — near/scrub still measured against its window. */
  specimen?: HTMLElement | null;
};

/**
 * Leaf-wide hand: pointer events on the leaf (not only the case). Specimen-normalized x/y
 * remain for window rituals; px/py are client pixels for leaf CSS blooms.
 */
export function listen(leaf: HTMLElement, name: InputName, opts: ListenOpts = {}) {
  if (!(name in CHANNELS)) name = 'calm';
  const channels = new Set(CHANNELS[name]);
  const specimen = opts.specimen ?? leaf.querySelector<HTMLElement>('[data-specimen]') ?? leaf;
  const now = () => performance.now() / 1000;
  const speed = new Speed();
  const idle = new Idle(now());
  const dwell = new Dwell();
  const scrub = new Scrub();
  const hold = new Hold();
  const scroll = new ScrollPace();
  let x = 0;
  let y = 0;
  let px = -999;
  let py = -999;
  let inside = false;
  let focused = false;
  let touching = false;
  let selected = 0;
  let scrubX = 0;

  const windowBox = () =>
    (specimen.querySelector('.window') ?? specimen).getBoundingClientRect();
  const leafBox = () => leaf.getBoundingClientRect();
  const isControl = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest(CONTROL));

  const place = (event: PointerEvent) => {
    px = event.clientX;
    py = event.clientY;
    const rect = windowBox();
    const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
    x = (event.clientX - rect.left - rect.width / 2) / radius;
    y = -(event.clientY - rect.top - rect.height / 2) / radius;
  };

  const overLeaf = (event: PointerEvent) => {
    const rect = leafBox();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  };

  const onMove = (event: PointerEvent) => {
    if (isControl(event.target)) {
      inside = false;
      speed.lift();
      scrub.lift();
      return;
    }
    place(event);
    inside = overLeaf(event) || event.pointerType === 'touch';
    const t = now();
    speed.sample(x, y, t);
    idle.stir(t);
    if (channels.has('scrub') && inside) scrub.sample(x, t);
  };
  const onLeave = (event: PointerEvent) => {
    if (event.relatedTarget instanceof Node && leaf.contains(event.relatedTarget)) return;
    inside = false;
    speed.lift();
    scrub.lift();
  };
  const onDown = (event: PointerEvent) => {
    if (isControl(event.target)) return;
    idle.stir(now());
    if (event.button !== 0) return;
    place(event);
    inside = true;
    if (channels.has('hold')) hold.press(now());
    if (event.pointerType === 'touch') touching = true;
  };
  const onUp = () => {
    hold.release();
    touching = false;
  };
  const onKey = (event: KeyboardEvent) => {
    idle.stir(now());
    if (event.target !== specimen && event.target !== leaf) return;
    if (channels.has('hold') && isPress(event.key)) {
      event.preventDefault();
      if (event.type === 'keydown') hold.press(now());
      else hold.release();
    }
    if (channels.has('scrub') && event.type === 'keydown') {
      const nudge = event.key === 'ArrowLeft' ? -0.25 : event.key === 'ArrowRight' ? 0.25 : 0;
      if (nudge) {
        event.preventDefault();
        scrubX += nudge;
        scrub.sample(scrubX, now());
      }
    }
    if (KEYBOARD[name] === 'arrows-move-lens' && event.type === 'keydown') {
      const [dx, dy] = arrowNudge(event.key);
      if (dx || dy) {
        event.preventDefault();
        x = clamp(x + dx, -1.4, 1.4);
        y = clamp(y + dy, -1.4, 1.4);
        inside = true;
        const rect = windowBox();
        const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
        px = rect.left + rect.width / 2 + x * radius;
        py = rect.top + rect.height / 2 - y * radius;
      }
    }
  };
  const onFocus = () => {
    focused = true;
  };
  const onBlur = () => {
    focused = false;
    hold.release();
  };
  const onScroll = () => {
    scroll.sample(scrollY / Math.max(1, innerHeight), now());
    idle.stir(now());
  };
  const onSelect = () => {
    const selection = getSelection();
    const range = selection && !selection.isCollapsed && selection.rangeCount ? selection.getRangeAt(0) : null;
    selected =
      range && [...document.querySelectorAll('[data-room-text]')].some((node) => range.intersectsNode(node))
        ? selection!.toString().length
        : 0;
  };

  leaf.addEventListener('pointermove', onMove, { passive: true });
  leaf.addEventListener('pointerleave', onLeave, { passive: true });
  leaf.addEventListener('pointerdown', onDown);
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onUp);
  addEventListener('keydown', onKey);
  addEventListener('keyup', onKey);
  specimen.addEventListener('focus', onFocus);
  specimen.addEventListener('blur', onBlur);
  addEventListener('scroll', onScroll, { passive: true });
  if (channels.has('selection')) document.addEventListener('selectionchange', onSelect);
  scroll.sample(scrollY / Math.max(1, innerHeight), now());

  return {
    read(dt: number): Sample {
      const t = now();
      const velocity = speed.value(t);
      const pointerNear = inside ? falloff(Math.hypot(x, y), 1.6) : 0;
      const focusNear = focused && KEYBOARD[name] === 'focus-is-near' ? 1 : 0;
      const near = Math.max(pointerNear, focusNear, touching ? 1 : 0);
      return {
        x,
        y,
        px,
        py,
        present: inside,
        speed: velocity,
        idle: idle.idleFor(t),
        near,
        dwell: channels.has('dwell') ? dwell.step(dt, near, velocity > 1.5) : 0,
        scrub: scrub.value(t),
        held: hold.held(t),
        selected,
        pace: scroll.pace(t),
        heading: scroll.dir,
        upFor: scroll.upFor(t),
      };
    },
    dispose() {
      leaf.removeEventListener('pointermove', onMove);
      leaf.removeEventListener('pointerleave', onLeave);
      leaf.removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      removeEventListener('keydown', onKey);
      removeEventListener('keyup', onKey);
      specimen.removeEventListener('focus', onFocus);
      specimen.removeEventListener('blur', onBlur);
      removeEventListener('scroll', onScroll);
      document.removeEventListener('selectionchange', onSelect);
    },
  };
}

export const restsOnPointer = (name: string) => REST.has(name as InputName);
