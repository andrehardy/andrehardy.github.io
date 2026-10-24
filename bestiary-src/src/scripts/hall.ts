import { reducedMotion } from './smooth';
import { notifyHall } from './windows';

const stackedQuery = '(max-width: 1099px), (max-height: 699px)';

export function mountHall(root: HTMLElement) {
  const world = root.querySelector<HTMLElement>('.nave-world');
  const bays = [...root.querySelectorAll<HTMLAnchorElement>('[data-bay]')];
  if (!world || bays.length === 0) return () => {};
  const depths = [...new Set(bays.map((bay) => Number(bay.dataset.depth)))].sort((a, b) => a - b);
  let cursor = 0;
  const reduced = reducedMotion();
  const stacked = () => matchMedia(stackedQuery).matches;

  const layout = () => {
    const stack = stacked();
    root.classList.toggle('is-stacked', stack);
    for (const bay of bays) {
      const depth = Number(bay.dataset.depth) - cursor;
      if (stack) {
        bay.style.setProperty('--fade', '1');
        bay.style.setProperty('--name', '1');
        bay.tabIndex = 0;
        continue;
      }
      const t = Math.min(Math.max(depth, 0) / 3.2, 1);
      const e = t * t * (3 - 2 * t);
      const height = 58 + (15 - 58) * e;
      const bottom = 15 + (38 - 15) * e;
      const inset = 1.2 + (31 - 1.2) * e;
      const fade = depth <= -0.55 || depth >= 3.45 ? 0 : depth < 0 ? Math.max(0, 1 + depth / 0.55) : 1;
      bay.style.setProperty('--h', height.toFixed(2));
      bay.style.setProperty('--bottom', bottom.toFixed(2));
      bay.style.setProperty('--inset', inset.toFixed(2));
      bay.style.setProperty('--z', String(Math.round(40 - depth * 6)));
      bay.style.setProperty('--fade', fade.toFixed(2));
      bay.style.setProperty('--name', depth < 1.25 && depth > -0.2 ? '1' : '0');
      bay.tabIndex = fade > 0.15 ? 0 : -1;
      bay.toggleAttribute('data-near', depth < 0.6 && depth > -0.2);
    }
    notifyHall();
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
    document.removeEventListener('keydown', onKey);
    root.removeEventListener('pointermove', onPointer);
    media.removeEventListener('change', onMedia);
    window.removeEventListener('pagereveal', reveal);
    void depths;
  };
}
