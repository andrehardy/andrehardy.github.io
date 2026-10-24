import { reducedMotion } from './smooth';

const phoneQuery = '(max-width: 760px), (max-height: 520px)';
/** Window union, normalised to the 16:9 plate. Kept inside the viewport. */
const WIN = { x0: 0.02, y0: 0.145, x1: 0.985, y1: 0.855 };
const ASPECT = 16 / 9;

export function mountHall(root: HTMLElement) {
  const scene = root.querySelector<HTMLElement>('[data-scene]');
  const fit = root.querySelector<HTMLElement>('[data-scene-fit]');
  const bays = [...root.querySelectorAll<HTMLElement>('[data-scene-bay]')].sort(
    (a, b) => Number(a.dataset.n) - Number(b.dataset.n),
  );
  const phoneBays = [...root.querySelectorAll<HTMLAnchorElement>('[data-phone-bay]')];
  const media = matchMedia(phoneQuery);
  const stacked = () => media.matches;
  const reduced = () => reducedMotion();
  let current = Math.min(3, Math.max(1, Number(scene?.dataset.bay || 1)));
  let busy = false;
  let hot: HTMLElement | null = null;

  const bayEl = (n: number) => bays[n - 1];

  const placeStage = () => {
    if (!scene || !fit || stacked()) return;
    const vw = scene.clientWidth;
    const vh = scene.clientHeight;
    if (vw < 20 || vh < 20) return;
    const winW = WIN.x1 - WIN.x0;
    const winH = WIN.y1 - WIN.y0;
    const hFit = Math.min(vw / (winW * ASPECT), vh / winH);
    const hCover = Math.max(vh, vw / ASPECT);
    const H = Math.min(hFit, hCover);
    const W = H * ASPECT;
    const winCx = ((WIN.x0 + WIN.x1) / 2) * W;
    const winCy = ((WIN.y0 + WIN.y1) / 2) * H;
    let left = vw / 2 - winCx;
    let top = vh / 2 - winCy;
    if (W >= vw - 0.5) {
      const winLeft = WIN.x0 * W;
      const winRight = WIN.x1 * W;
      const low = Math.max(vw - W, -winLeft);
      const high = Math.min(0, vw - winRight);
      left = high >= low ? Math.min(high, Math.max(low, left)) : (low + high) / 2;
    }
    if (H >= vh - 0.5) {
      const winTop = WIN.y0 * H;
      const winBottom = WIN.y1 * H;
      const low = Math.max(vh - H, -winTop);
      const high = Math.min(0, vh - winBottom);
      top = high >= low ? Math.min(high, Math.max(low, top)) : (low + high) / 2;
    }
    fit.style.width = `${W.toFixed(2)}px`;
    fit.style.height = `${H.toFixed(2)}px`;
    fit.style.transform = `translate(${left.toFixed(2)}px, ${top.toFixed(2)}px)`;
  };

  const loadBay = (n: number, on: boolean) => {
    const bay = bayEl(n);
    if (!bay) return;
    bay.querySelectorAll<HTMLImageElement>('[data-src]').forEach((img) => {
      if (on) {
        if (!img.getAttribute('src')) img.src = img.dataset.src ?? '';
      } else if (img.getAttribute('src')) {
        img.removeAttribute('src');
      }
    });
  };

  const retain = (n: number) => {
    for (let i = 1; i <= 3; i += 1) loadBay(i, Math.abs(i - n) <= 1);
  };

  const paintChrome = () => {
    if (!scene) return;
    scene.dataset.bay = String(current);
    root.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((button) => {
      const on = Number(button.dataset.jump) === current;
      if (on) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    const back = root.querySelector<HTMLButtonElement>('[data-walk="-1"]');
    const on = root.querySelector<HTMLButtonElement>('[data-walk="1"]');
    if (back) back.disabled = current <= 1;
    if (on) on.disabled = current >= 3;
    bays.forEach((bay) => {
      const active = Number(bay.dataset.n) === current;
      bay.toggleAttribute('aria-hidden', !active);
      if (!active) bay.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
      else bay.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
    });
  };

  const hashFor = (n: number) => `#bay-${n}`;

  const writeHash = (n: number) => {
    const next = hashFor(n);
    if (location.hash === next) return;
    history.replaceState(null, '', next);
  };

  const doorOf = (bay: HTMLElement) => {
    const night = document.documentElement.dataset.night === 'on';
    const variant = bay.querySelector<HTMLElement>(night ? '.variant-night' : '.variant-day');
    const x = Number(variant?.dataset.doorX);
    const y = Number(variant?.dataset.doorY);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  };

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const clearMotion = (el: HTMLElement) => {
    el.style.transition = '';
    el.style.transform = '';
    el.style.transformOrigin = '';
    el.style.opacity = '';
    el.style.visibility = '';
    el.style.pointerEvents = '';
    el.style.filter = '';
  };

  async function walk(dir: number) {
    if (!scene || stacked() || busy) return;
    const next = current + dir;
    if (next < 1 || next > 3) return;
    busy = true;
    scene.classList.add('is-walking');
    const from = bayEl(current);
    const to = bayEl(next);
    retain(next);
    const ms = reduced() ? 0 : 860;
    if (from && to && ms > 0) {
      const doorBay = dir > 0 ? from : to;
      const door = doorOf(doorBay);
      const origin = door ? `${(door.x * 100).toFixed(2)}% ${(door.y * 100).toFixed(2)}%` : '50% 58%';
      const cue = (el: HTMLElement, start: { opacity: string; transform: string; origin?: string }, end: { opacity: string; transform: string }, duration: number) => {
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'none';
        el.style.transition = 'none';
        el.style.opacity = start.opacity;
        el.style.transform = start.transform;
        if (start.origin) el.style.transformOrigin = start.origin;
        void el.offsetWidth;
        el.style.transition = `transform ${duration}ms cubic-bezier(.33,.7,.2,1), opacity ${duration}ms ease`;
        el.style.opacity = end.opacity;
        el.style.transform = end.transform;
      };
      if (dir > 0) {
        cue(from, { opacity: '1', transform: 'scale(1)', origin }, { opacity: '0', transform: 'scale(2.55)' }, ms);
        cue(to, { opacity: '0', transform: 'scale(1.14)', origin: '50% 54%' }, { opacity: '1', transform: 'scale(1)' }, Math.round(ms * 0.78));
      } else {
        cue(from, { opacity: '1', transform: 'scale(1)', origin: '50% 50%' }, { opacity: '0', transform: 'scale(0.9)' }, Math.round(ms * 0.75));
        cue(to, { opacity: '0', transform: 'scale(2.45)', origin }, { opacity: '1', transform: 'scale(1)' }, ms);
      }
      await wait(ms + 40);
    }
    current = next;
    paintChrome();
    if (from) clearMotion(from);
    if (to) clearMotion(to);
    writeHash(current);
    retain(current);
    scene.classList.remove('is-walking');
    busy = false;
  }

  const stopVideo = (link: HTMLElement) => {
    const video = link.querySelector('video');
    if (!video) return;
    video.pause();
  };

  const playVideo = (link: HTMLElement) => {
    const src = link.dataset.idle;
    if (!src || reduced()) return;
    let video = link.querySelector('video');
    if (!video) {
      video = document.createElement('video');
      video.className = 'scene-still';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('playsinline', '');
      link.append(video);
    }
    const absolute = new URL(src, location.href).href;
    if (video.src !== absolute) {
      video.classList.remove('is-playing');
      video.src = src;
    }
    video.onplaying = () => video?.classList.add('is-playing');
    void video.play().catch(() => {});
  };

  const setHot = (link: HTMLElement | null) => {
    if (hot === link) return;
    if (hot) {
      stopVideo(hot);
      const id = hot.dataset.for ?? '';
      root.querySelectorAll(`[data-for="${CSS.escape(id)}"]`).forEach((el) => el.classList.remove('is-hot'));
    }
    hot = link;
    if (!link) return;
    const id = link.dataset.for ?? '';
    root.querySelectorAll(`[data-for="${CSS.escape(id)}"]`).forEach((el) => el.classList.add('is-hot'));
    playVideo(link);
  };

  async function pushWindow(link: HTMLAnchorElement) {
    if (busy || !scene) {
      location.href = link.href;
      return;
    }
    busy = true;
    const bay = link.closest<HTMLElement>('.scene-bay');
    const slug = link.dataset.slug ?? '';
    if (slug) {
      try {
        sessionStorage.setItem('bestiary-arch', slug);
        sessionStorage.setItem('bestiary-bay', String(current));
      } catch {
        /* storage refused */
      }
    }
    link.style.viewTransitionName = 'creature-arch';
    if (!bay || reduced() || stacked()) {
      location.href = link.href;
      return;
    }
    const host = bay.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const ox = rect.left + rect.width / 2 - host.left;
    const oy = rect.top + rect.height / 2 - host.top;
    const scale = Math.min(7.5, Math.max(sceneRect.width / rect.width, sceneRect.height / rect.height) * 1.04);
    const desiredX = sceneRect.left + sceneRect.width / 2 - host.left;
    const desiredY = sceneRect.top + sceneRect.height / 2 - host.top;
    const tx = desiredX - ox * scale;
    const ty = desiredY - oy * scale;
    scene.classList.add('is-entering');
    bay.style.transformOrigin = '0 0';
    bay.style.transition = 'transform 680ms cubic-bezier(.4,0,.2,1), filter 680ms ease';
    void bay.offsetWidth;
    bay.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
    bay.style.filter = 'saturate(1.05) brightness(1.08)';
    await wait(640);
    location.href = link.href;
  }

  const onPointer = (event: PointerEvent) => {
    if (!fit || stacked() || reduced() || busy) return;
    const bay = bayEl(current);
    if (!bay) return;
    const rect = fit.getBoundingClientRect();
    if (rect.width < 20) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    bay.style.setProperty('--pan-x', `${(-px * 3.4).toFixed(2)}%`);
    bay.style.setProperty('--pan-y', `${(-py * 2.4).toFixed(2)}%`);
  };

  let swipe: { x: number; y: number; id: number } | null = null;
  const onDown = (event: PointerEvent) => {
    if (stacked() || event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('a, button')) return;
    swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const onUp = (event: PointerEvent) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.hypot(dx, dy) < 56) return;
    const dir = Math.abs(dx) > Math.abs(dy) ? -Math.sign(dx) : -Math.sign(dy);
    if (dir) void walk(dir);
  };

  let wheelAt = 0;
  const onWheel = (event: WheelEvent) => {
    if (stacked()) return;
    event.preventDefault();
    if (busy) return;
    const now = performance.now();
    if (now - wheelAt < 700) return;
    const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(dominant) < 4) return;
    wheelAt = now;
    void walk(Math.sign(dominant));
  };

  const focusPhone = (index: number) => {
    const bay = phoneBays[index];
    if (!bay) return;
    bay.focus({ preventScroll: true });
    bay.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
  };

  const onKey = (event: KeyboardEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('input, textarea, select')) return;
    if (!root.contains(target) && target !== document.body && target !== document.documentElement) return;
    if (stacked()) {
      const index = phoneBays.findIndex((bay) => bay === document.activeElement || bay.contains(document.activeElement));
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        focusPhone(Math.min(phoneBays.length - 1, (index < 0 ? 0 : index) + 1));
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        focusPhone(Math.max(0, (index < 0 ? 0 : index) - 1));
      }
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      void walk(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      void walk(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      void (async () => {
        while (current > 1) await walk(-1);
      })();
    } else if (event.key === 'End') {
      event.preventDefault();
      void (async () => {
        while (current < 3) await walk(1);
      })();
    }
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !scene || stacked()) return;
    const jump = target.closest<HTMLButtonElement>('[data-jump]');
    if (jump) {
      const n = Number(jump.dataset.jump);
      if (n !== current) {
        const dir = Math.sign(n - current);
        const steps = Math.abs(n - current);
        void (async () => {
          for (let i = 0; i < steps; i += 1) await walk(dir);
        })();
      }
      return;
    }
    const step = target.closest<HTMLButtonElement>('[data-walk]');
    if (step) {
      void walk(Number(step.dataset.walk));
      return;
    }
    const link = target.closest<HTMLAnchorElement>('a.scene-window');
    if (!link || !scene.contains(link)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    void pushWindow(link);
  };

  scene?.querySelectorAll<HTMLAnchorElement>('a.scene-window').forEach((link) => {
    link.addEventListener('pointerenter', () => setHot(link));
    link.addEventListener('pointerleave', () => {
      if (hot === link) setHot(null);
    });
    link.addEventListener('focus', () => setHot(link));
    link.addEventListener('blur', () => {
      if (hot === link) setHot(null);
    });
  });

  const fromHash = () => {
    const match = location.hash.match(/^#bay-([123])$/);
    return match ? Number(match[1]) : current;
  };

  const reveal = () => {
    let slug = '';
    let bay = 0;
    try {
      slug = sessionStorage.getItem('bestiary-arch') ?? '';
      bay = Number(sessionStorage.getItem('bestiary-bay') ?? '');
    } catch {
      /* storage refused */
    }
    if (bay >= 1 && bay <= 3) {
      current = bay;
      paintChrome();
      retain(current);
    }
    if (!slug || !scene) return;
    const link = scene.querySelector<HTMLElement>(`[data-scene-bay="${current}"] a[data-slug="${CSS.escape(slug)}"]`);
    if (link) link.style.viewTransitionName = 'creature-arch';
  };

  scene?.addEventListener('pointermove', onPointer, { passive: true });
  scene?.addEventListener('pointerdown', onDown);
  scene?.addEventListener('pointerup', onUp);
  scene?.addEventListener('pointercancel', () => {
    swipe = null;
  });
  scene?.addEventListener('wheel', onWheel, { passive: false });
  scene?.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  window.addEventListener('hashchange', () => {
    const n = fromHash();
    if (n === current || busy) return;
    current = n;
    paintChrome();
    retain(current);
    placeStage();
  });
  window.addEventListener('pagereveal', reveal);
  media.addEventListener('change', () => {
    placeStage();
    paintChrome();
  });
  window.addEventListener('resize', placeStage);

  current = fromHash();
  paintChrome();
  retain(current);
  placeStage();
  reveal();

  return () => {
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', placeStage);
    window.removeEventListener('pagereveal', reveal);
  };
}
