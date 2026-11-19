/**
 * Parse a B11 entity section HTML string into a real <section> Astro can emit
 * as a direct .leaf child (B1 flat-DOM contract).
 */
export type ParsedSection = {
  attrs: Record<string, string>;
  inner: string;
};

export function parseSectionHtml(html: string): ParsedSection {
  const trimmed = html.trim();
  const open = trimmed.match(/^<section\b([^>]*)>/i);
  if (!open || !trimmed.toLowerCase().endsWith('</section>')) {
    throw new Error(`section HTML must be a single <section>…</section>; got: ${trimmed.slice(0, 80)}`);
  }
  const inner = trimmed.slice(open[0].length, trimmed.length - '</section>'.length);
  const attrs: Record<string, string> = {};
  const attrRe = /([:@\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(open[1] ?? '')) !== null) {
    const key = m[1];
    if (!key || key === '/') continue;
    attrs[key] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return { attrs, inner };
}
