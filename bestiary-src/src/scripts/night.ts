import { reducedMotion } from './smooth';

const KEY = 'mr-bestiary-night';

/** Dark from 19:00 through 05:59 in the visitor's local timezone. */
export function nightByClock(date = new Date()) {
  const hour = date.getHours();
  return hour >= 19 || hour < 6;
}

function storedNight(): 'on' | 'off' | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'on' || value === 'off' ? value : null;
  } catch {
    return null;
  }
}

function nightNow(override: 'on' | 'off' | null) {
  if (override) return override === 'on';
  return nightByClock();
}

export function bindNight() {
  const root = document.documentElement;
  let override = storedNight();
  const dust = document.querySelector<HTMLCanvasElement>('[data-hall-dust]');
  let stopDust = () => {};
  let dusting = false;
  const paint = () => {
    const on = root.dataset.night === 'on';
    document.querySelectorAll<HTMLButtonElement>('[data-night-switch]').forEach((button) => {
      button.setAttribute('aria-pressed', String(on));
      button.setAttribute('aria-label', on ? 'Switch to day' : 'Switch to night');
    });
    syncDust();
  };
  const apply = (on: boolean) => {
    root.dataset.night = on ? 'on' : 'off';
    paint();
  };

  apply(nightNow(override));
  if (!reducedMotion()) {
    requestAnimationFrame(() => root.classList.add('is-night-ready'));
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest('[data-night-switch]')) return;
    const on = root.dataset.night !== 'on';
    override = on ? 'on' : 'off';
    try {
      localStorage.setItem(KEY, override);
    } catch {
      /* storage refused; the choice still holds for this visit */
    }
    apply(on);
  });

  window.setInterval(() => {
    if (override) return;
    const on = nightByClock();
    if ((root.dataset.night === 'on') !== on) apply(on);
  }, 60_000);

  function syncDust() {
    const on = root.dataset.night === 'on';
    const hidden = !dust || getComputedStyle(dust).display === 'none';
    const run = Boolean(dust) && on && !hidden && !reducedMotion() && document.visibilityState === 'visible';
    if (run && !dusting && dust) {
      dusting = true;
      stopDust = startShaftDust(dust);
    } else if (!run && dusting) {
      dusting = false;
      stopDust();
      stopDust = () => {};
    }
  }
  document.addEventListener('visibilitychange', syncDust);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', syncDust);
  syncDust();
}

function startShaftDust(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  if (!ctx || !parent) return () => {};
  const bands = [0.18, 0.5, 0.82];
  type Mote = { band: number; x: number; y: number; r: number; v: number; a: number; tw: number };
  let motes: Mote[] = [];
  const resize = () => {
    const rect = parent.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
  };
  const seed = () => {
    motes = Array.from({ length: 56 }, () => ({
      band: bands[Math.floor(Math.random() * bands.length)] ?? 0.5,
      x: (Math.random() - 0.5) * 0.08,
      y: Math.random(),
      r: 0.5 + Math.random() * 1.6,
      v: 0.01 + Math.random() * 0.045,
      a: 0.18 + Math.random() * 0.6,
      tw: Math.random() * Math.PI * 2,
    }));
  };
  resize();
  seed();
  const observer = new ResizeObserver(resize);
  observer.observe(parent);
  let raf = 0;
  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f6e2b0';
    for (const mote of motes) {
      mote.y -= mote.v * 0.016;
      mote.tw += 0.018;
      mote.x += Math.sin(mote.tw) * 0.00035;
      if (mote.y < -0.04) mote.y = 1.02;
      ctx.globalAlpha = mote.a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(mote.tw)));
      ctx.beginPath();
      ctx.arc((mote.band + mote.x) * canvas.width, mote.y * canvas.height, mote.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
