// a small auto layout pass over figma clipboard nodes. figma keeps pasted geometry as is,
// so hiding a layer or changing text needs the frame laid out again the way figma would
type Node = Record<string, any>;
type Size = { x: number; y: number };

export const gid = (g: { sessionID: number; localID: number }) => `${g.sessionID}:${g.localID}`;

export function childrenIndex(nodes: Node[]) {
  const kids = new Map<string, Node[]>();
  for (const n of nodes) {
    if (!n.parentIndex) continue;
    const k = gid(n.parentIndex.guid);
    if (!kids.has(k)) kids.set(k, []);
    kids.get(k)!.push(n);
  }
  for (const list of kids.values()) list.sort((a, b) => (a.parentIndex.position < b.parentIndex.position ? -1 : a.parentIndex.position > b.parentIndex.position ? 1 : 0));
  return kids;
}

const isStack = (n: Node) => n.stackMode === 'HORIZONTAL' || n.stackMode === 'VERTICAL';
const rotated = (n: Node) => Math.abs(n.transform.m01) > 1e-6 || Math.abs(n.transform.m10) > 1e-6;

// bounding box of a node in its parent's space, plus the offset of that box from the node origin
function extent(n: Node, s: Size = n.size) {
  const { m00, m01, m10, m11 } = n.transform;
  const xs = [0, m00 * s.x, m01 * s.y, m00 * s.x + m01 * s.y];
  const ys = [0, m10 * s.x, m11 * s.y, m10 * s.x + m11 * s.y];
  return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), ox: Math.min(...xs), oy: Math.min(...ys) };
}

const wraps = (n: Node) => n.stackWrap === 'WRAP';

// greedy rows for a wrapping stack
function rowsOf<T extends { p: number; cc: number }>(items: T[], avail: number, gap: number) {
  const rows: { items: T[]; cc: number }[] = [];
  let row: T[] = [], used = 0;
  for (const i of items) {
    if (row.length && used + gap + i.p > avail) { rows.push({ items: row, cc: Math.max(...row.map((r) => r.cc)) }); row = []; used = 0; }
    used += (row.length ? gap : 0) + i.p;
    row.push(i);
  }
  if (row.length) rows.push({ items: row, cc: Math.max(...row.map((r) => r.cc)) });
  return rows;
}

export function createLayout(kids: Map<string, Node[]>) {
  const flow = (n: Node) => (kids.get(gid(n.guid)) ?? []).filter((c) => c.visible !== false && c.stackPositioning !== 'ABSOLUTE');
  const pads = (n: Node) => {
    const l = n.stackHorizontalPadding ?? 0, r = n.stackPaddingRight ?? 0, t = n.stackVerticalPadding ?? 0, b = n.stackPaddingBottom ?? 0;
    return n.stackMode === 'HORIZONTAL' ? [l, r, t, b] : [t, b, l, r];
  };

  function measure(n: Node): Size {
    if (!isStack(n)) return { ...n.size };
    const h = n.stackMode === 'HORIZONTAL';
    const [p0, p1, c0, c1] = pads(n);
    const items = flow(n).map((c) => {
      const e = extent(c, rotated(c) ? c.size : measure(c));
      return h ? [e.w, e.h] : [e.h, e.w];
    });
    const gap = n.stackSpacing ?? 0;
    if (wraps(n)) {
      const rows = rowsOf(items.map(([p, c]) => ({ p, cc: c })), (h ? n.size.x : n.size.y) - p0 - p1, gap);
      const hugC = rows.reduce((a, r) => a + r.cc, 0) + (n.stackCounterSpacing ?? gap) * Math.max(rows.length - 1, 0) + c0 + c1;
      const ctr = !n.stackCounterSizing || n.stackCounterSizing === 'FIXED' ? (h ? n.size.y : n.size.x) : hugC;
      return h ? { x: n.size.x, y: ctr } : { x: ctr, y: n.size.y };
    }
    const hugP = items.reduce((a, [p]) => a + p, 0) + gap * Math.max(items.length - 1, 0) + p0 + p1;
    const hugC = Math.max(0, ...items.map(([, c]) => c)) + c0 + c1;
    const prim = n.stackPrimarySizing === 'FIXED' ? (h ? n.size.x : n.size.y) : hugP;
    const ctr = !n.stackCounterSizing || n.stackCounterSizing === 'FIXED' ? (h ? n.size.y : n.size.x) : hugC;
    return h ? { x: prim, y: ctr } : { x: ctr, y: prim };
  }

  function layout(n: Node, size: Size) {
    n.size = { x: size.x, y: size.y };
    if (!isStack(n)) return;
    const h = n.stackMode === 'HORIZONTAL';
    const [p0, p1, c0, c1] = pads(n);
    const availP = (h ? size.x : size.y) - p0 - p1;
    const availC = (h ? size.y : size.x) - c0 - c1;
    const gap = n.stackSpacing ?? 0;
    const items = flow(n).map((c) => {
      if (rotated(c)) {
        const e = extent(c);
        return { c, p: h ? e.w : e.h, cc: h ? e.h : e.w, grow: false, stretch: false };
      }
      const m = measure(c);
      const stretch = c.stackChildAlignSelf === 'STRETCH';
      return { c, p: h ? m.x : m.y, cc: stretch ? availC : h ? m.y : m.x, grow: (c.stackChildPrimaryGrow ?? 0) > 0, stretch };
    });
    if (wraps(n)) {
      // wrapped rows, each aligned on its own
      const cgap = n.stackCounterSpacing ?? gap;
      let y = c0;
      for (const row of rowsOf(items, availP, gap)) {
        const used = row.items.reduce((a, i) => a + i.p, 0) + gap * (row.items.length - 1);
        const align = n.stackPrimaryAlignItems;
        let x = p0 + (align === 'CENTER' ? (availP - used) / 2 : align === 'MAX' ? availP - used : 0);
        for (const i of row.items) {
          const ca = n.stackCounterAlignItems;
          const off = y + (ca === 'CENTER' ? (row.cc - i.cc) / 2 : ca === 'MAX' ? row.cc - i.cc : 0);
          layout(i.c, h ? { x: i.p, y: i.cc } : { x: i.cc, y: i.p });
          i.c.transform = { ...i.c.transform, m02: h ? x : off, m12: h ? off : x };
          x += i.p + gap;
        }
        y += row.cc + cgap;
      }
      return;
    }
    const growers = items.filter((i) => i.grow);
    const fixed = items.filter((i) => !i.grow).reduce((a, i) => a + i.p, 0);
    const free = availP - fixed - gap * Math.max(items.length - 1, 0);
    for (const g of growers) g.p = Math.max(0, free / growers.length);

    const used = items.reduce((a, i) => a + i.p, 0) + gap * Math.max(items.length - 1, 0);
    let cursor = p0;
    let step = gap;
    if (!growers.length) {
      const align = n.stackPrimaryAlignItems;
      if (align === 'CENTER') cursor += (availP - used) / 2;
      else if (align === 'MAX') cursor += availP - used;
      // figma stores the auto gap as SPACE_EVENLY, it spaces like space-between
      else if ((align === 'SPACE_BETWEEN' || align === 'SPACE_EVENLY') && items.length > 1) step = (availP - (used - gap * (items.length - 1))) / (items.length - 1);
    }
    for (const i of items) {
      const ca = n.stackCounterAlignItems;
      const off = i.stretch ? c0 : ca === 'CENTER' ? c0 + (availC - i.cc) / 2 : ca === 'MAX' ? c0 + availC - i.cc : c0;
      const [x, y] = h ? [cursor, off] : [off, cursor];
      if (rotated(i.c)) {
        const e = extent(i.c);
        i.c.transform = { ...i.c.transform, m02: x - e.ox, m12: y - e.oy };
      } else {
        layout(i.c, h ? { x: i.p, y: i.cc } : { x: i.cc, y: i.p });
        i.c.transform = { ...i.c.transform, m02: x, m12: y };
      }
      cursor += i.p + step;
    }
  }

  return { measure, layout, flow };
}
