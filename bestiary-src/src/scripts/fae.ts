/** The fae's agreement: a selection is answered in atbash, and the lattice binds. */

const LIMIT = 180;

const atbash = (text: string) =>
  text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + 25 - (ch.charCodeAt(0) - base));
  });

const visible = (node: Node | null) => {
  const el = node instanceof Element ? node : node?.parentElement;
  if (!el || el.closest('[aria-hidden="true"]')) return false;
  return el.checkVisibility?.() ?? el.offsetParent !== null;
};

export function mountFae(root: HTMLElement, festival: boolean, onBound: (bound: boolean) => void) {
  const panel = document.createElement('div');
  panel.className = 'fae-terms';
  panel.setAttribute('aria-hidden', 'true');
  const echo = document.createElement('p');
  echo.className = 'fae-echo';
  panel.append(echo);
  document.body.append(panel);

  let bound = false;
  let frame = 0;
  const setBound = (next: boolean) => {
    if (next !== bound) onBound(next);
    bound = next;
  };
  const hide = () => {
    setBound(false);
    panel.removeAttribute('data-shown');
  };
  const show = () => {
    frame = 0;
    const selection = getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      hide();
      return;
    }
    const range = selection.getRangeAt(0);
    const host = [...document.querySelectorAll('[data-room-text]')].find(
      (node) => range.intersectsNode(node) && visible(node),
    );
    if (!host) {
      hide();
      return;
    }
    let text = selection.toString().replace(/\s+/g, ' ').trim();
    if (festival) {
      const block = range.startContainer.parentElement?.closest('p, li, dd') ?? host;
      text = (block.textContent ?? text).replace(/\s+/g, ' ').trim();
    }
    if (!text) {
      hide();
      return;
    }
    if (text.length > LIMIT) text = `${text.slice(0, LIMIT - 1).trimEnd()}…`;
    echo.textContent = atbash(text);
    const rect = range.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.left));
    const top = Math.min(window.innerHeight - 16, rect.bottom + 10);
    panel.style.width = `${width}px`;
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    setBound(true);
    panel.toggleAttribute('data-shown', true);
  };
  const queue = () => {
    frame ||= requestAnimationFrame(show);
  };
  document.addEventListener('selectionchange', queue);
  addEventListener('resize', queue);
  return {
    get bound() {
      return bound;
    },
    stop() {
      cancelAnimationFrame(frame);
      document.removeEventListener('selectionchange', queue);
      removeEventListener('resize', queue);
      panel.remove();
    },
  };
}
