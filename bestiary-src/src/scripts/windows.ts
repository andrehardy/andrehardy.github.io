import manifest from '../data/manifest.json';
import { reducedMotion } from './smooth';

type CreatureAssets = (typeof manifest.creatures)[keyof typeof manifest.creatures];

const creatures = manifest.creatures as Record<string, CreatureAssets>;

const mobile = () => matchMedia('(max-width: 1099px), (max-height: 699px)').matches;

const layoutWatchers = new Set<() => void>();
export function onHallLayout(fn: () => void) {
  layoutWatchers.add(fn);
  return () => layoutWatchers.delete(fn);
}
export function notifyHall() {
  layoutWatchers.forEach((fn) => fn());
}

type Transition = { src: string; reverse: boolean; poster: string | null };

function findTransition(assets: CreatureAssets, from: string, to: string): Transition | null {
  const forward = assets.transitions.find((item) => item.from === from && item.to === to);
  if (forward) return { src: forward.src, reverse: false, poster: forward.poster };
  const backward = assets.transitions.find((item) => item.from === to && item.to === from);
  if (backward) return { src: backward.src, reverse: true, poster: backward.poster };
  return null;
}

function captionFor(assets: CreatureAssets, state: string) {
  const alias = assets.captionAlias?.[state] ?? state;
  return assets.plates[state] ?? assets.plates[alias] ?? null;
}

export function mountWindow(el: HTMLElement) {
  const slug = el.dataset.slug ?? '';
  const assets = creatures[slug];
  if (!assets) return () => {};
  const mode = el.dataset.mode ?? 'hall';
  const world = el.querySelector<HTMLElement>('.window-stage');
  const posters = [...el.querySelectorAll<HTMLImageElement>('.window-poster')];
  const video = el.querySelector<HTMLVideoElement>('.window-motion');
  const dust = el.querySelector<HTMLCanvasElement>('.window-dust');
  const frame = assets.frame;
  let state = el.dataset.state || assets.states[0];
  let shown = 0;
  let playing = false;
  let dustStop = () => {};
  let hovered = false;

  const posterOf = (name: string) => assets.posters[name] ?? null;
  const paintedStill = mode === 'specimen' && el.hasAttribute('data-art');

  const paintPoster = (name: string, fade: boolean) => {
    const src = posterOf(name);
    const incoming = posters[shown ^ 1];
    const outgoing = posters[shown];
    if (!incoming || !outgoing) return;
    if (!src) {
      el.classList.add('is-empty');
      incoming.removeAttribute('src');
      outgoing.removeAttribute('src');
      return;
    }
    el.classList.remove('is-empty');
    if (outgoing.src.endsWith(src) && outgoing.classList.contains('is-show')) return;
    incoming.onload = () => {
      incoming.classList.add('is-show');
      outgoing.classList.remove('is-show');
      shown ^= 1;
    };
    incoming.onerror = () => {
      el.classList.add('is-empty');
      incoming.removeAttribute('src');
    };
    if (!fade || reducedMotion()) incoming.classList.add('is-cut');
    else incoming.classList.remove('is-cut');
    incoming.src = src;
  };

  const settleIdle = (name: string) => {
    const idle = assets.idles[name];
    if (!video) return;
    if (!idle || reducedMotion() || (mode === 'hall' && !hovered)) {
      video.pause();
      video.removeAttribute('src');
      video.classList.remove('is-show');
      paintPoster(name, true);
      return;
    }
    video.loop = true;
    video.playbackRate = 1;
    video.poster = assets.idlePosters[name] || posterOf(name) || '';
    if (video.getAttribute('src') !== idle) {
      video.src = idle;
      video.load();
    }
    video.play().then(
      () => {
        video.classList.add('is-show');
      },
      () => {
        video.classList.remove('is-show');
        paintPoster(name, false);
      },
    );
  };

  const playClip = (clip: Transition) =>
    new Promise<void>((resolve) => {
      if (!video) {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        video.removeEventListener('ended', finish);
        video.removeEventListener('error', finish);
        resolve();
      };
      video.loop = false;
      video.poster = clip.poster || posterOf(state) || '';
      video.classList.add('is-show');
      video.onloadeddata = () => {
        if (!clip.reverse) return;
        const duration = video.duration;
        if (!Number.isFinite(duration)) return;
        try {
          video.currentTime = Math.max(0, duration - 0.05);
          video.playbackRate = -1;
        } catch {
          finish();
        }
      };
      video.addEventListener('ended', finish);
      video.addEventListener('error', finish);
      video.src = clip.src;
      video.play().catch(finish);
      window.setTimeout(finish, 8000);
    });

  const go = async (next: string) => {
    if (!assets.states.includes(next) || next === state || playing) {
      if (next !== state && !playing) state = next;
      return;
    }
    const from = state;
    state = next;
    el.dataset.state = next;
    publishCaption(next);
    const clip = findTransition(assets, from, next);
    if (!clip || reducedMotion() || mode === 'hall') {
      if (video) {
        video.pause();
        video.classList.remove('is-show');
      }
      paintPoster(next, true);
      return;
    }
    playing = true;
    el.classList.add('is-transition');
    await playClip(clip);
    playing = false;
    el.classList.remove('is-transition');
    settleIdle(next);
  };

  const swaps = new Map<HTMLElement, { index: number; token: number }>();
  const crossfadeCaption = (node: HTMLElement, text: string) => {
    const faces = [...node.querySelectorAll<HTMLElement>('.plate')];
    const slot = swaps.get(node) ?? { index: 0, token: 0 };
    swaps.set(node, slot);
    const shown = faces[slot.index];
    const next = faces[slot.index ^ 1];
    if (!shown || !next) return;
    if (shown.classList.contains('is-on') && (shown.textContent ?? '') === text) return;
    if (reducedMotion()) {
      shown.textContent = text;
      shown.classList.add('is-on');
      next.classList.remove('is-on');
      next.textContent = '';
      return;
    }
    const token = ++slot.token;
    next.textContent = text;
    next.classList.add('is-on');
    shown.classList.remove('is-on');
    slot.index ^= 1;
    window.setTimeout(() => {
      if (slot.token !== token) return;
      shown.textContent = '';
    }, 600);
  };
  const publishCaption = (name: string) => {
    const caption = captionFor(assets, name);
    const almanac = document.querySelector<HTMLElement>('[data-caption-almanac]');
    const cipher = document.querySelector<HTMLElement>('[data-caption-cipher]');
    if (!almanac || !cipher || el.dataset.mode !== 'specimen') return;
    crossfadeCaption(almanac, caption?.almanac || name);
    crossfadeCaption(cipher, caption?.cipher || name);
  };

  publishCaption(state);
  const wantsPixels = () => {
    if (mode === 'specimen') return true;
    if (mobile()) return intersecting;
    return el.hasAttribute('data-near') || hovered;
  };
  let intersecting = false;

  const onEnter = () => {
    hovered = true;
    el.classList.add('is-hot');
    if (mode === 'hall') settleIdle(state);
    const dx = el.dataset.px ? Number(el.dataset.px) : 0;
    void dx;
  };
  const onLeave = () => {
    hovered = false;
    el.classList.remove('is-hot');
    if (world) world.style.translate = '';
    if (mode === 'hall' && video) {
      video.pause();
      video.classList.remove('is-show');
    }
  };
  const onPointer = (event: PointerEvent) => {
    if (reducedMotion() || !world || paintedStill) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    world.style.translate = `${(px * 10).toFixed(1)}px ${(py * 8).toFixed(1)}px`;
  };
  el.addEventListener('pointerenter', onEnter);
  el.addEventListener('pointerleave', onLeave);
  el.addEventListener('pointermove', onPointer);

  const noop = () => {};
  dustStop = noop;
  const stopDust = () => {
    dustStop();
    dustStop = noop;
  };
  const sync = () => {
    if (!wantsPixels()) {
      stopDust();
      if (video && mode === 'hall') {
        video.pause();
        video.classList.remove('is-show');
      }
      return;
    }
    paintPoster(state, false);
    if (mode === 'specimen') settleIdle(state);
    if (!reducedMotion() && dust && dustStop === noop) {
      dustStop = startDust(dust, frame.particle, frame.glow, mode === 'hall' ? 18 : 42);
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      intersecting = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { rootMargin: mobile() ? '60% 0px' : '0px' },
  );
  observer.observe(el);
  const stopLayout = onHallLayout(sync);
  if (mode === 'specimen') sync();

  return {
    go,
    get state() {
      return state;
    },
    dispose() {
      observer.disconnect();
      stopLayout();
      dustStop();
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointermove', onPointer);
      video?.pause();
    },
  };
}

function startDust(canvas: HTMLCanvasElement, kind: string, color: string, count: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const parent = canvas.parentElement;
  if (!parent) return () => {};
  type Mote = { x: number; y: number; r: number; v: number; drift: number; a: number };
  let motes: Mote[] = [];
  const resize = () => {
    const rect = parent.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
  };
  resize();
  const seed = () => {
    motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * (kind === 'spore' ? 2.4 : 1.4),
      v: (kind === 'frost' ? 1 : -1) * (0.015 + Math.random() * 0.05),
      drift: (Math.random() - 0.5) * 0.02,
      a: 0.15 + Math.random() * 0.55,
    }));
  };
  seed();
  let raf = 0;
  const observer = new ResizeObserver(resize);
  observer.observe(parent);
  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    for (const mote of motes) {
      mote.y += mote.v * 0.016;
      mote.x += mote.drift * 0.016 + Math.sin(mote.y * 12) * 0.0008;
      if (mote.y < -0.02) mote.y = 1.02;
      if (mote.y > 1.02) mote.y = -0.02;
      if (mote.x < 0) mote.x += 1;
      if (mote.x > 1) mote.x -= 1;
      ctx.globalAlpha = mote.a;
      ctx.beginPath();
      ctx.arc(mote.x * canvas.width, mote.y * canvas.height, mote.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
  };
}

export type WindowHandle = ReturnType<typeof mountWindow>;
