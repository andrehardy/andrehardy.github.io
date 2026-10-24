/** Reading the walls: a passage held in view for a moment counts as read. */

const HOLD = 1.2;

export function watchWalls(scope: ParentNode = document) {
  const nodes = [...scope.querySelectorAll<HTMLElement>('[data-room-text] p, [data-room-text] li')].filter(
    (node) => !node.closest('[aria-hidden="true"]'),
  );
  const read = new Set<Element>();
  const waiting = new Map<Element, number>();
  const groups = new Map<Element, Map<string, HTMLElement[]>>();
  for (const node of nodes) {
    const layer = node.closest<HTMLElement>('[data-layer]');
    const group = layer?.parentElement ?? node;
    const bag = groups.get(group) ?? new Map<string, HTMLElement[]>();
    const key = layer?.dataset.layer ?? '';
    bag.set(key, [...(bag.get(key) ?? []), node]);
    groups.set(group, bag);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (read.has(entry.target)) continue;
        const tall = entry.rootBounds ? entry.intersectionRect.height >= entry.rootBounds.height / 2 : false;
        const seen = entry.isIntersecting && (entry.intersectionRatio >= 0.5 || tall);
        if (seen) {
          if (!waiting.has(entry.target)) {
            waiting.set(
              entry.target,
              window.setTimeout(() => {
                read.add(entry.target);
                waiting.delete(entry.target);
                observer.unobserve(entry.target);
              }, HOLD * 1000),
            );
          }
        } else {
          const timer = waiting.get(entry.target);
          if (timer) clearTimeout(timer);
          waiting.delete(entry.target);
        }
      }
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
  );
  for (const node of nodes) observer.observe(node);
  return {
    get share() {
      let hit = 0;
      let total = 0;
      for (const layers of groups.values()) {
        const columns = [...layers.values()];
        const longest = Math.max(...columns.map((col) => col.length));
        const fraction = Math.max(...columns.map((col) => col.filter((node) => read.has(node)).length / col.length));
        hit += longest * fraction;
        total += longest;
      }
      return total === 0 ? 0 : hit / total;
    },
    stop() {
      observer.disconnect();
      for (const timer of waiting.values()) clearTimeout(timer);
      waiting.clear();
    },
  };
}
