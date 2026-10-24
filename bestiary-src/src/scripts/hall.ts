import { bayMetrics } from '../data/house';
import { reducedMotion } from './smooth';
import { notifyHall } from './windows';

const stackedQuery = '(max-width: 1099px), (max-height: 699px)';

export function mountHall(root: HTMLElement) {
  const world = root.querySelector<HTMLElement>('.nave-world');
  const dolly = root.querySelector<HTMLElement>('.nave-dolly');
  const bays = [...root.querySelectorAll<HTMLAnchorElement>('[data-bay]')].sort(
    (a, b) => Number(a.dataset.seq) - Number(b.dataset.seq),
  );
  if (!world || bays.length === 0) return () => {};
  let cursor = 0;
  const reduced = reducedMotion();
  const stacked = () => matchMedia(stackedQuery).matches;
  const origin = bayMetrics(0, 'north').along;
  const glows = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-glow]')].map((el) => [el.dataset.glow ?? '', el]),
  );
  const farMark = root.querySelector<HTMLElement>('[data-floor-far]');
  const nearMark = root.querySelector<HTMLElement>('[data-floor-near]');
  let tracking = 0;
  let trackUntil = 0;

  const placeGlows = () => {
    if (glows.size === 0 || !farMark || !nearMark) return;
    const stack = stacked();
    const rootRect = root.getBoundingClientRect();
    const farTop = farMark.getBoundingClientRect().top - rootRect.top;
    const nearTop = nearMark.getBoundingClientRect().top - rootRect.top;
    const span = nearTop > farTop + 20 ? nearTop - farTop : rootRect.height * 0.2;
    for (const bay of bays) {
      const glow = glows.get(bay.dataset.slug ?? '');
      if (!glow) continue;
      if (stack || bay.hasAttribute('data-gone')) {
        glow.style.setProperty('--strength', '0');
        continue;
      }
      const rect = bay.getBoundingClientRect();
      if (rect.width < 8 || rect.bottom < rootRect.top || rect.top > rootRect.bottom) {
        glow.style.setProperty('--strength', '0');
        continue;
      }
      const reach = Math.min(1, Math.max(0.16, rect.height / 340));
      glow.style.left = `${rect.left + rect.width / 2 - rootRect.left}px`;
      glow.style.top = `${Math.max(0, farTop)}px`;
      glow.style.width = `${Math.max(26, rect.width * 1.7)}px`;
      glow.style.height = `${Math.max(16, span * reach)}px`;
      glow.style.setProperty('--strength', Math.min(1, 0.42 + rect.height / 420).toFixed(3));
    }
  };

  const watchGlows = (ms: number) => {
    trackUntil = Math.max(trackUntil, performance.now() + ms);
    if (tracking) return;
    const tick = (now: number) => {
      placeGlows();
      tracking = now < trackUntil ? requestAnimationFrame(tick) : 0;
    };
    tracking = requestAnimationFrame(tick);
  };

  const layout = () => {
    const stack = stacked();
    root.classList.toggle('is-stacked', stack);
    const shift = stack ? 0 : bayMetrics(cursor, 'north').along - origin;
    (dolly ?? world).style.setProperty('--dolly', shift.toFixed(1));
    for (const bay of bays) {
      const rel = Number(bay.dataset.depth) - cursor;
      if (stack) {
        bay.style.setProperty('--name', '1');
        bay.tabIndex = 0;
        bay.removeAttribute('data-gone');
        continue;
      }
      const gone = rel < -0.35;
      bay.style.setProperty('--name', rel < 1.15 && rel > -0.2 ? '1' : '0');
      bay.tabIndex = gone ? -1 : 0;
      bay.toggleAttribute('data-gone', gone);
      bay.toggleAttribute('data-near', rel < 1.2 && rel > -0.2);
    }
    notifyHall();
    watchGlows(reduced || stack ? 32 : 780);
  };

  const focusBay = (bay: HTMLAnchorElement, smooth: boolean) => {
    cursor = Number(bay.dataset.depth);
    layout();
    bay.focus({ preventScroll: !stacked() });
    if (stacked()) bay.scrollIntoView({ block: 'start', behavior: smooth && !reduced ? 'smooth' : 'auto' });
  };

  const onKey = (event: KeyboardEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!root.contains(target) && target !== document.body) return;
    if (target.closest('input, textarea, select')) return;
    const current = bays.findIndex((bay) => bay === document.activeElement);
    const order = stacked() ? bays : bays.filter((bay) => bay.tabIndex === 0);
    let index = order.findIndex((bay) => bay === document.activeElement);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = order[Math.min(order.length - 1, (index < 0 ? current : index) + 1)] ?? order[0];
      if (next) focusBay(next, true);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const start = index < 0 ? 0 : index;
      const next = order[Math.max(0, start - 1)] ?? order[0];
      if (next) focusBay(next, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusBay(bays[0], true);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusBay(bays[bays.length - 1], true);
    }
  };

  const onPointer = (event: PointerEvent) => {
    if (reduced || stacked()) return;
    const rect = root.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    world.style.setProperty('--px', px.toFixed(3));
    world.style.setProperty('--py', py.toFixed(3));
    placeGlows();
  };

  const onClick = (event: MouseEvent) => {
    const link = event.currentTarget;
    if (!(link instanceof HTMLAnchorElement)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const slug = link.dataset.slug ?? '';
    sessionStorage.setItem('bestiary-arch', slug);
    const win = link.querySelector<HTMLElement>('.window');
    if (win) win.style.viewTransitionName = 'creature-arch';
  };

  for (const bay of bays) {
    bay.addEventListener('click', onClick);
    bay.addEventListener('focus', () => {
      const depth = Number(bay.dataset.depth);
      if (!stacked() && depth !== cursor) {
        cursor = depth;
        layout();
      }
    });
  }
  root.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('keydown', onKey);
  const media = matchMedia(stackedQuery);
  const onMedia = () => layout();
  media.addEventListener('change', onMedia);
  layout();

  const reveal = (event: Event) => {
    const slug = sessionStorage.getItem('bestiary-arch');
    if (!slug) return;
    const win = root.querySelector<HTMLElement>(`[data-slug="${CSS.escape(slug)}"] .window`);
    if (win) win.style.viewTransitionName = 'creature-arch';
    const bay = bays.find((item) => item.dataset.slug === slug);
    if (bay && !stacked()) {
      cursor = Number(bay.dataset.depth);
      layout();
    }
    void event;
  };
  window.addEventListener('pagereveal', reveal);

  return () => {
    if (tracking) cancelAnimationFrame(tracking);
    document.removeEventListener('keydown', onKey);
    root.removeEventListener('pointermove', onPointer);
    media.removeEventListener('change', onMedia);
    window.removeEventListener('pagereveal', reveal);
  };
}
