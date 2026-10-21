(function () {
  const CARD_W = 168;
  const CARD_H = 46;
  const GAP_X = 12;
  const ROW_GAP = 34;
  const LABEL_W = 188;
  const TOP = 56;
  const state = { tradition: "greek", positions: {}, width: 1200, height: 800 };

  function pack() { return window.PANTHEON; }
  function all() { return pack().deities; }

  function mapById() {
    const map = {};
    all().forEach((d) => { map[d.id] = d; });
    return map;
  }

  function childIndex() {
    const children = {};
    const add = (parent, child, kind) => {
      if (!children[parent]) children[parent] = [];
      children[parent].push({ id: child, kind });
    };
    all().forEach((d) => {
      (d.parents || []).forEach((p) => add(p, d.id, "parent"));
      (d.emergence || []).forEach((p) => add(p, d.id, "emergence"));
      (d.descent || []).forEach((p) => add(p, d.id, "descent"));
      (d.cult || []).forEach((p) => add(p, d.id, "cult"));
    });
    return children;
  }

  function consortsOf(id) {
    const out = new Set();
    all().forEach((d) => {
      (d.consorts || []).forEach((c) => {
        if (d.id === id) out.add(c);
        if (c === id) out.add(d.id);
      });
    });
    return [...out];
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function layout(tradition) {
    const spec = pack().traditions[tradition];
    const people = all().filter((d) => d.tradition === tradition);
    const positions = {};
    let maxCol = 1;
    spec.rows.forEach((row, index) => {
      people.filter((d) => d.row === row.row).forEach((d, col) => {
        positions[d.id] = {
          x: LABEL_W + col * (CARD_W + GAP_X),
          y: TOP + index * (CARD_H + ROW_GAP),
        };
        maxCol = Math.max(maxCol, col + 1);
      });
    });
    return {
      positions,
      width: Math.max(960, LABEL_W + maxCol * (CARD_W + GAP_X) + 28),
      height: TOP + spec.rows.length * (CARD_H + ROW_GAP) + 28,
    };
  }

  function curve(from, to) {
    const x1 = from.x + CARD_W / 2;
    const y1 = from.y + CARD_H;
    const x2 = to.x + CARD_W / 2;
    const y2 = to.y;
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
  }

  const strokeFor = {
    parent: ["#dfb15b", ""],
    emergence: ["#a78bfa", "5 4"],
    descent: ["#94a3b8", "2 4"],
    cult: ["#2dd4bf", "7 4"],
  };

  function render(tradition) {
    const root = document.getElementById("pantheonWorld");
    if (!root || !pack()) return;
    state.tradition = tradition;
    const spec = pack().traditions[tradition];
    const laid = layout(tradition);
    state.positions = laid.positions;
    state.width = laid.width;
    state.height = laid.height;
    const people = all().filter((d) => d.tradition === tradition);
    let markup = "";
    markup += `<text x="${LABEL_W}" y="24" font-family="Cinzel, serif" font-size="14" font-weight="700" fill="${spec.accent}">${esc(spec.title)}</text>`;
    markup += `<text x="${LABEL_W}" y="42" font-family="Cormorant Garamond, serif" font-size="14" fill="#cbd5e1">${esc(spec.blurb)}</text>`;
    spec.rows.forEach((row, index) => {
      const y = TOP + index * (CARD_H + ROW_GAP);
      markup += `<text x="12" y="${y + 20}" font-family="Cinzel, serif" font-size="8" font-weight="700" fill="${spec.accent}">${esc(row.label)}</text>`;
      markup += `<text x="12" y="${y + 34}" font-family="Cormorant Garamond, serif" font-size="11" fill="#94a3b8">${esc(row.hint)}</text>`;
    });
    people.forEach((d) => {
      [["parents", "parent"], ["emergence", "emergence"], ["descent", "descent"], ["cult", "cult"]].forEach(([key, kind]) => {
        (d[key] || []).forEach((pid) => {
          const from = laid.positions[pid];
          const to = laid.positions[d.id];
          if (!from || !to) return;
          const [stroke, dash] = strokeFor[kind];
          const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
          markup += `<g class="edge-group edge-${kind}" data-source="${pid}" data-target="${d.id}" data-layer="pantheon"><path class="edge-line" d="${curve(from, to)}" fill="none" stroke="${stroke}" stroke-width="1.5"${dashed}></path></g>`;
        });
      });
    });
    people.forEach((d) => {
      const at = laid.positions[d.id];
      if (!at) return;
      const card = d.card || d.name;
      const size = card.length > 18 ? 7.4 : 8.4;
      markup += `<g class="tree-node strand-divine" id="pnode-${d.id}" data-id="${d.id}" data-layer="pantheon" data-act="1" transform="translate(${at.x}, ${at.y})"><rect class="node-box" width="${CARD_W}" height="${CARD_H}" rx="6"></rect><rect width="3" height="${CARD_H}" fill="${spec.accent}"></rect><circle cx="22" cy="23" r="12" fill="#070a12" stroke="${spec.accent}" stroke-width="1.2"></circle><text x="22" y="27" font-size="12" text-anchor="middle" fill="${spec.accent}">${esc(d.symbol || "*")}</text><text class="node-name" x="40" y="20" font-family="Cinzel, serif" font-size="${size}" font-weight="700" fill="#f8fafc">${esc(card)}</text><text class="node-meta" x="40" y="34" font-family="Cormorant Garamond, serif" font-size="12" fill="#94a3b8">${esc(d.tier)}</text></g>`;
    });
    const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, "image/svg+xml");
    root.replaceChildren(...doc.documentElement.childNodes);
    root.querySelectorAll(".tree-node").forEach((node) => {
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        if (window.PantheonLayer.onPick) window.PantheonLayer.onPick(node.dataset.id);
      });
    });
  }

  function kin(id) {
    const map = mapById();
    const figure = map[id];
    const children = childIndex();
    const grouped = { parent: [], emergence: [], descent: [], cult: [], consort: [], child: [] };
    (figure.parents || []).forEach((pid) => grouped.parent.push(map[pid]));
    (figure.emergence || []).forEach((pid) => grouped.emergence.push(map[pid]));
    (figure.descent || []).forEach((pid) => grouped.descent.push(map[pid]));
    (figure.cult || []).forEach((pid) => grouped.cult.push(map[pid]));
    consortsOf(id).forEach((cid) => grouped.consort.push(map[cid]));
    (children[id] || []).forEach((child) => grouped.child.push({ figure: map[child.id], kind: child.kind }));
    return grouped;
  }

  function trace(id) {
    const keep = new Set([id]);
    const map = mapById();
    const children = childIndex();
    const up = (current) => {
      const figure = map[current];
      if (!figure) return;
      [...(figure.parents || []), ...(figure.emergence || []), ...(figure.descent || []), ...(figure.cult || [])].forEach((pid) => {
        if (!keep.has(pid)) {
          keep.add(pid);
          up(pid);
        }
      });
    };
    const down = (current) => {
      (children[current] || []).forEach((child) => {
        if (!keep.has(child.id)) {
          keep.add(child.id);
          down(child.id);
        }
      });
    };
    up(id);
    down(id);
    consortsOf(id).forEach((cid) => keep.add(cid));
    document.querySelectorAll("#pantheonWorld .tree-node").forEach((node) => {
      const on = keep.has(node.dataset.id);
      node.classList.toggle("traced", on);
      node.classList.toggle("dimmed", !on);
    });
    document.querySelectorAll("#pantheonWorld .edge-group").forEach((group) => {
      const on = keep.has(group.dataset.source) && keep.has(group.dataset.target);
      group.classList.toggle("traced", on);
      group.classList.toggle("dimmed", !on);
    });
  }

  function clearTrace() {
    document.querySelectorAll("#pantheonWorld .tree-node, #pantheonWorld .edge-group").forEach((el) => {
      el.classList.remove("traced", "dimmed");
    });
  }

  function search(query) {
    const needle = query.toLowerCase();
    const pool = document.body.classList.contains("layer-pantheon")
      ? all().filter((d) => d.tradition === state.tradition)
      : all();
    return pool.find((d) =>
      d.name.toLowerCase().includes(needle) ||
      (d.card || "").toLowerCase().includes(needle) ||
      d.id.includes(needle) ||
      (d.title || "").toLowerCase().includes(needle)
    ) || null;
  }

  window.PantheonLayer = {
    show(tradition) {
      render(tradition || state.tradition);
      clearTrace();
    },
    tradition() { return state.tradition; },
    worldSize() { return { w: state.width, h: state.height }; },
    position(id) { return state.positions[id]; },
    card() { return { w: CARD_W, h: CARD_H }; },
    figure(id) { return mapById()[id]; },
    kin,
    trace,
    clearTrace,
    search,
    forCodex(codexId) {
      return all().find((d) => (d.media || []).some((item) => item.id === codexId)) || null;
    },
    onPick: null,
  };
})();
