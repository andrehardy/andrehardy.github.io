"""Pull creature prose out of the published bestiary pages.

The GitHub Pages repo stores the built HTML, not the Astro source. This
script keeps the accession, account, anatomy, habits, neighbour, and
exemplars verbatim so the new pages do not invent or drop text.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path("/workspace/magic-registry/bestiary")
OUT = Path("/workspace/bestiary-src/src/data/entities")

ORDER = [
    "lycanthrope",
    "vampire",
    "sidhe",
    "kitsune",
    "orc",
    "troll",
    "golem",
    "unicorn",
    "minotaur",
    "fae",
    "will-o-the-wisp",
    "ophanim",
    "djinn",
    "lich",
    "wraith",
    "succubus",
]


def text_of(node) -> str:
    if node is None:
        return ""
    return " ".join(node.get_text(" ", strip=True).split())


def layer_pair(node) -> dict[str, str]:
    if node is None:
        return {"almanac": "", "cipher": ""}
    almanac = node.select_one('[data-layer="almanac"]')
    cipher = node.select_one('[data-layer="cipher"]')
    if almanac or cipher:
        return {"almanac": text_of(almanac), "cipher": text_of(cipher)}
    return {"almanac": text_of(node), "cipher": ""}


def clean(fragment) -> str:
    if fragment is None:
        return ""
    for tag in fragment.select(".lens-view, script, style"):
        tag.decompose()
    for tag in fragment.find_all(True):
        attrs = dict(tag.attrs)
        for key in list(attrs):
            if key.startswith("data-astro"):
                del tag[key]
        # Drop empty class attributes left by the cleaner.
        if tag.get("class") == []:
            del tag["class"]
    html = fragment.decode()
    html = re.sub(r"\s+", " ", html)
    html = re.sub(r">\s+<", "><", html)
    return html.strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for index, slug in enumerate(ORDER):
        path = ROOT / slug / "index.html"
        soup = BeautifulSoup(path.read_text(), "lxml")
        specimen = soup.select_one("[data-specimen]")
        if specimen is None:
            raise SystemExit(f"no specimen in {slug}")
        title = soup.title.get_text(strip=True) if soup.title else slug
        description = ""
        desc = soup.find("meta", attrs={"name": "description"})
        if desc and desc.get("content"):
            description = desc["content"]
        og = {}
        for meta in soup.find_all("meta"):
            prop = meta.get("property") or ""
            if prop.startswith("og:") or prop.startswith("twitter:"):
                og[prop] = meta.get("content") or ""
        style = soup.body.get("style") or ""
        colors = dict(re.findall(r"(--[a-z0-9-]+)\s*:\s*([^;]+)", style))
        head = soup.select_one(".room-head")
        mark = ""
        mark_el = soup.select_one(".room-head .label")
        if mark_el:
            mark = text_of(mark_el)
        name_el = soup.select_one(".room-head h1")
        name = text_of(name_el) if name_el else slug
        epithet = layer_pair(soup.select_one(".room-head .epithet"))
        plates = []
        for plate in soup.select("[data-plate]"):
            plates.append(
                {
                    "name": plate.get("data-plate"),
                    **layer_pair(plate.find("figcaption")),
                }
            )
        state_notes = []
        for item in soup.select("li[data-state]"):
            state_notes.append({"name": item.get("data-state"), **layer_pair(item)})
        accession = soup.select_one("#accession-title")
        accession_html = ""
        if accession:
            block = accession.find_parent("div", class_="depth") or accession.parent
            # Keep the heading and the definition list, not the habitat rails.
            keep = BeautifulSoup("<div class='accession'></div>", "lxml")
            wrap = keep.select_one(".accession")
            heading = accession
            dl = block.find("dl")
            mark_p = block.find("p", class_="mark")
            wrap.append(heading)
            if mark_p:
                wrap.append(mark_p)
            if dl:
                wrap.append(dl)
            accession_html = clean(wrap)
        sections = []
        for section in soup.select("section.text, section.exemplars"):
            sections.append(clean(section))
        # Hooks that lived inside the old case, not in the prose sections.
        hooks = []
        for node in soup.select("[data-vessel], [data-lich-script]"):
            if node.find_parent("section"):
                continue
            hooks.append(clean(node))
        neighbour = None
        neighbour_link = soup.select_one("#neighbour-title")
        if neighbour_link:
            anchor = neighbour_link.find_parent("section").select_one("a[href]") if neighbour_link.find_parent("section") else None
            if anchor:
                neighbour = {"href": anchor.get("href"), "name": text_of(anchor)}
        data = {
            "slug": slug,
            "order": index,
            "title": title,
            "description": description,
            "og": og,
            "name": name,
            "mark": mark,
            "epithet": epithet,
            "input": specimen.get("data-input"),
            "link": specimen.get("data-link"),
            "voice": specimen.get("data-voice"),
            "setting": specimen.get("data-setting"),
            "ariaLabel": specimen.get("data-label") or "",
            "colors": colors,
            "plates": plates,
            "stateNotes": state_notes,
            "neighbour": neighbour,
            "accession": accession_html,
            "hooks": hooks,
            "sections": sections,
        }
        (OUT / f"{slug}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"{slug:20} mark={mark:4} input={data['input']:18} link={data['link']:16} sections={len(sections)} plates={len(plates)}")


if __name__ == "__main__":
    main()
