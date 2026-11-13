/* ===== Icons ===== */
const sv = (p, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||2}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I = {
  video: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>'),
  code: sv('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>'),
  mcq: sv('<circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M11 7h9M11 17h9"/>'),
  check: sv('<path d="m5 12 5 5 9-10"/>', 3),
  chev: sv('<path d="m6 9 6 6 6-6"/>'),
  clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  book: sv('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
  bolt: sv('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  flame: sv('<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-9-1 2-2 3-4 3 0-2 0-4-1-6-3 3-5 7-5 12 0 4 3 7 7 7z"/>'),
  left: sv('<path d="m15 18-6-6 6-6"/>'),
  right: sv('<path d="m9 18 6-6-6-6"/>'),
  menu: sv('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  reset: sv('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
  x: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
  home: sv('<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  grid: sv('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  route: sv('<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>'),
  target: sv('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  term: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>'),
  trophy: sv('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
  bulb: sv('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>'),
  eye: sv('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  db: sv('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>')
};
const typeIcon = t => t === "video" ? I.video : t === "mcq" ? I.mcq : I.code;
const typeXP = l => l.type === "code" ? (l.xp || 100) : 50;

/* ===== Utils ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(s) {
  return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}
function md(text) {
  return text.split(/\n\n+/).map(block => {
    const lines = block.split("\n");
    if (lines.every(l => l.startsWith("- "))) return "<ul>" + lines.map(l => "<li>" + inline(l.slice(2)) + "</li>").join("") + "</ul>";
    return "<p>" + lines.map(inline).join("<br>") + "</p>";
  }).join("");
}
function toast(msg) {
  const t = $("#toast");
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}
const fmtNum = n => n.toLocaleString("en-US");
function dkey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

/* ===== Progress store ===== */
const KEY = "datum-progress-v1";
let S = { xp: 0, done: {}, days: {}, last: null, goal: 250, drafts: {}, certs: {} };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function addXP(n) {
  const k = dkey(new Date());
  S.days[k] = (S.days[k] || 0) + n;
  S.xp += n;
  save(); updateTop();
}
function award(key, xp) {
  if (S.done[key] !== undefined) return -1;
  S.done[key] = xp;
  addXP(xp);
  return xp;
}
function streak() {
  const d = new Date(); let n = 0;
  if (!(dkey(d) in S.days)) d.setDate(d.getDate() - 1);
  while (dkey(d) in S.days) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function todayXP() { return S.days[dkey(new Date())] || 0; }

/* ===== Course helpers ===== */
const courseById = id => COURSES.find(c => c.id === id);
const lkey = (c, ci, li) => c.id + ":" + ci + ":" + li;
const lhash = (c, ci, li) => "#l-" + c.id + "-" + (ci + 1) + "-" + (li + 1);
function flat(c) {
  const out = [];
  c.chapters.forEach((ch, ci) => ch.lessons.forEach((l, li) => out.push({ ci, li, l, key: lkey(c, ci, li) })));
  return out;
}
function prog(c) {
  const f = flat(c); const d = f.filter(x => S.done[x.key] !== undefined).length;
  return { done: d, total: f.length, pct: f.length ? Math.round(d / f.length * 100) : 0 };
}
function chapProg(c, ci) {
  const ls = c.chapters[ci].lessons;
  const d = ls.filter((l, li) => S.done[lkey(c, ci, li)] !== undefined).length;
  return { done: d, total: ls.length };
}
function nextUndone(c) { return flat(c).find(x => S.done[x.key] === undefined) || flat(c)[0]; }
function courseXP(c) { return flat(c).reduce((a, x) => a + typeXP(x.l), 0); }
function counts(c) {
  const f = flat(c);
  return { videos: f.filter(x => x.l.type === "video").length, ex: f.filter(x => x.l.type !== "video").length };
}
function techTag(c) { return `<span class="tag ${c.tech === "SQL" ? "sql" : c.tech === "HTML" ? "html" : "py"}">${c.tech}</span>`; }
const langOf = c => c.lang === "sql" ? "sql" : c.lang === "html" ? "html" : "py";
const techColor = c => c.tech === "SQL" ? ["#fff4ed", "var(--sql)"] : c.tech === "HTML" ? ["#ecfdf5", "var(--html)"] : ["#eef3ff", "var(--py)"];

/* ===== Syntax highlighting ===== */
const PYRE = /(#.*)|("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d+)?\b)|(\b(?:False|None|True|and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b)|(\b[A-Za-z_]\w*(?=\())/g;
const SQLRE = /(--.*)|('(?:''|[^'])*'?)|(\b\d+(?:\.\d+)?\b)|(\b(?:SELECT|FROM|WHERE|AND|OR|NOT|AS|DISTINCT|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|ASC|DESC|LIKE|IN|IS|NULL|BETWEEN|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|USING|UNION|ALL|CASE|WHEN|THEN|ELSE|END|CREATE|TABLE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DROP|WITH)\b)|(\b(?:COUNT|SUM|AVG|MIN|MAX|ROUND|UPPER|LOWER|LENGTH|COALESCE|CAST|ABS|SUBSTR)\b(?=\s*\())/gi;
const HTMLRE = /(<!--[\s\S]*?(?:-->|$)|\/\*[\s\S]*?(?:\*\/|$))|("[^"\n]*"?)|(&#?\w+;|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%)?)|(<\/?[A-Za-z][\w-]*|\/?>|<!DOCTYPE)|(\b[a-zA-Z-]+(?=\s*=)|\b[a-z-]+(?=\s*:\s*[^;{}]*;))/gi;
function hl(code, lang) {
  const re = lang === "sql" ? SQLRE : lang === "html" ? HTMLRE : PYRE; re.lastIndex = 0;
  let out = "", last = 0, m;
  const cls = ["", "c", "s", "n", "k", "f"];
  while ((m = re.exec(code))) {
    if (m[0] === "") { re.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    let g = 1; while (!m[g]) g++;
    out += `<span class="${cls[g]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

/* ===== Editor ===== */
function makeEditor(host, lang, value, hooks) {
  host.innerHTML = `<div class="ed"><div class="in"><div class="gut"></div><div class="code"><pre></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Code editor"></textarea></div></div></div>`;
  const ta = $("textarea", host), pre = $("pre", host), gut = $(".gut", host), box = $(".ed", host);
  ta.value = value;
  function sync() {
    pre.innerHTML = hl(ta.value, lang) + "\n";
    const n = ta.value.split("\n").length;
    let g = ""; for (let i = 1; i <= n; i++) g += i + "\n";
    gut.textContent = g;
  }
  function ins(text) {
    ta.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input"));
    }
  }
  function keepCaret() {
    // keep caret visible inside the scroll box
    const before = ta.value.slice(0, ta.selectionStart).split("\n");
    const line = before.length - 1, col = before[before.length - 1].length;
    const y = 12 + line * 21, x = col * 8.1 + 62;
    if (y < box.scrollTop) box.scrollTop = y - 10;
    else if (y + 30 > box.scrollTop + box.clientHeight) box.scrollTop = y + 40 - box.clientHeight;
    if (x > box.scrollLeft + box.clientWidth - 30) box.scrollLeft = x - box.clientWidth + 60;
    else if (x < box.scrollLeft + 60) box.scrollLeft = Math.max(0, x - 80);
  }
  ta.addEventListener("input", () => { sync(); hooks.onChange && hooks.onChange(ta.value); keepCaret(); });
  ta.addEventListener("keydown", e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === "Enter") { e.preventDefault(); if (e.shiftKey) hooks.onSubmit && hooks.onSubmit(); else hooks.onRun && hooks.onRun(); return; }
    if (e.key === "Tab") { e.preventDefault(); ins("    "); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const start = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
      const line = ta.value.slice(start, ta.selectionStart);
      let ind = line.match(/^\s*/)[0];
      if (lang === "py" && /:\s*$/.test(line)) ind += "    ";
      if (lang === "html" && /<(?!\/)(?!(?:br|img|input|meta|link|hr)\b)[a-zA-Z][^>]*[^/]>\s*$|\{\s*$/.test(line)) ind += "  ";
      ins("\n" + ind);
    }
  });
  ta.addEventListener("click", keepCaret);
  sync();
  return { get: () => ta.value, set: v => { ta.value = v; sync(); hooks.onChange && hooks.onChange(v); }, focus: () => ta.focus() };
}

/* ===== Python runtime (Pyodide) ===== */
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
let py = null, pyBoot = null, mplReady = false;
const loaded = new Set();
const rtListeners = new Set();
let rtState = "idle";
function setRT(s) { rtState = s; rtListeners.forEach(f => f(s)); }
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src)); document.head.appendChild(s); });
}
async function ensurePy(pkgs) {
  if (!py) {
    if (!pyBoot) {
      setRT("loading");
      pyBoot = (async () => {
        await loadScript(PYODIDE_URL + "pyodide.js");
        const p = await loadPyodide({ indexURL: PYODIDE_URL });
        p.runPython(HARNESS);
        p.globals.set("SEED_SQL", SEED_SQL);
        py = p;
      })();
      pyBoot.catch(() => { pyBoot = null; setRT("error"); });
    }
    await pyBoot;
  }
  const need = (pkgs || []).filter(p => !loaded.has(p));
  if (need.length) {
    setRT("loading");
    await py.loadPackage(need);
    need.forEach(p => loaded.add(p));
  }
  await setupMpl();
  setRT("ready");
  return py;
}
async function setupMpl() {
  if (!mplReady && py && py.loadedPackages && py.loadedPackages.matplotlib) { py.runPython("_mpl_setup()"); mplReady = true; }
}
const tick = () => new Promise(r => setTimeout(r, 20));
function rtBadge() {
  const el = document.createElement("span");
  el.className = "rt";
  const upd = s => {
    el.className = "rt" + (s === "ready" ? " ready" : "");
    el.innerHTML = "<i></i>" + (s === "ready" ? "Session ready" : s === "loading" ? "Starting session" : s === "error" ? "Session failed to start" : "Session idle");
  };
  upd(rtState); rtListeners.add(upd);
  return el;
}

/* ===== IDE (editor + console) ===== */
function IDE(host, o) {
  const sql = o.lang === "sql", html = o.lang === "html";
  const fname = sql ? "query.sql" : html ? "index.html" : "script.py";
  host.innerHTML = `
    <div class="edhead"><button class="tab on">${sql ? I.db : I.code}${fname}</button><div class="sp"></div>
      ${o.onReset ? `<button class="iconbtn" data-a="reset" title="Reset to starter code">${I.reset}</button>` : ""}</div>
    <div class="edwrap"></div>
    <div class="runbar"><span class="kbd">Ctrl+Enter to run${o.onSubmit ? " · Ctrl+Shift+Enter to submit" : ""}</span><div class="sp"></div>
      <button class="btn sm" data-a="run">Run Code</button>
      ${o.onSubmit ? `<button class="btn sm pri" data-a="submit">Submit Answer</button>` : ""}</div>
    <div class="console">
      <div class="edhead">
        <button class="tab on" data-p="0">${sql ? "Query Result" : html ? "Browser" : "IPython Shell"}</button>
        ${html ? "" : `<button class="tab" data-p="1">${sql ? "Tables" : "Plots"}</button>`}
        <div class="sp"></div>${html ? "" : `<button class="btn sm" data-a="clear">Clear</button>`}
      </div>
      <div class="pane p0" style="flex:1;display:flex;flex-direction:column;min-height:0">
        ${html ? `<iframe class="preview" sandbox="allow-same-origin" title="Page preview"></iframe>` : sql ? `<div class="tblwrap"><div class="cbody"><span class="note">Run your query to see the result here.</span></div></div>`
              : `<div class="cbody"><span class="note">Python shell. Run your script, or type a command below and press Enter.</span>\n</div>
                 <div class="cin"><span>In [<b class="cnt">1</b>]:</span><input aria-label="Shell input" spellcheck="false" autocapitalize="off"></div>`}
      </div>
      <div class="pane p1 hidden" style="flex:1;min-height:0;overflow:auto">
        ${html ? "" : sql ? `<div class="schema">${SQL_SCHEMA.map(t => `<b>${t.table}</b><table>${t.cols.map(c => `<tr><td>${c[0]}</td><td>${c[1]}</td></tr>`).join("")}</table>`).join("")}<p class="muted" style="margin-top:12px">${FILMS.length} rows. Try <code>SELECT * FROM films LIMIT 5;</code></p></div>`
              : `<div class="plots"><span class="note muted">Plots you create will appear here.</span></div>`}
      </div>
    </div>`;
  let liveT;
  const ed = makeEditor($(".edwrap", host), o.lang, o.value, {
    onChange: v => { o.onChange && o.onChange(v); if (html) { clearTimeout(liveT); liveT = setTimeout(() => renderHTML(v), 450); } }, onRun: () => run("run"), onSubmit: () => o.onSubmit && submit()
  });
  const showPane = i => { $$(".console .tab", host).forEach(t => t.classList.toggle("on", t.dataset.p == i)); $(".p0", host).classList.toggle("hidden", i != 0); $(".p1", host).classList.toggle("hidden", i != 1); };
  $$(".console .tab", host).forEach(t => t.onclick = () => showPane(+t.dataset.p));
  const cbody = $(".p0 .cbody", host);
  let n = 1, busy = false;
  const hist = []; let hi = 0;
  function write(html) { cbody.insertAdjacentHTML("beforeend", html); cbody.scrollTop = cbody.scrollHeight; }
  function showFigs(figs) {
    if (!figs || !figs.length) return;
    $(".plots", host).innerHTML = figs.map(b => `<img alt="Plot" src="data:image/png;base64,${b}">`).join("");
    showPane(1);
  }
  function setBusy(b) { busy = b; $$("[data-a=run],[data-a=submit]", host).forEach(x => x.disabled = b); }
  async function exec(mode) {
    if (busy) return null;
    setBusy(true);
    const code = ed.get();
    if (html) {
      try {
        const fr = await renderHTML(code);
        return mode === "submit" ? htmlCheck(fr.contentDocument, code, o.check) : { ok: null, msg: "" };
      } finally { setBusy(false); }
    }
    try {
      if (!py || o.pkgs.some(p => !loaded.has(p))) {
        if (!sql) write(`<span class="note">Starting Python session. The first run takes a few seconds.</span>\n`);
        else $(".tblwrap", host).innerHTML = `<div class="cbody"><span class="note">Starting SQL engine. The first run takes a few seconds.</span></div>`;
      }
      await ensurePy(o.pkgs);
      if (o.workspace && !sql) { await py.loadPackagesFromImports(code); await setupMpl(); }
      await tick();
      let res;
      if (sql) {
        py.globals.set("_a", code); py.globals.set("_m", mode); py.globals.set("_s", o.solution || "");
        res = JSON.parse(py.runPython(`run_sql(_a, _m, _s, ${o.workspace ? "True" : "False"})`));
        renderSQL(res);
      } else {
        py.globals.set("_a", code); py.globals.set("_p", o.pre || ""); py.globals.set("_m", mode);
        py.globals.set("_s", o.solution || ""); py.globals.set("_c", o.check || "");
        res = JSON.parse(py.runPython("run_py(_a, _p, _m, _s, _c)"));
        showPane(0);
        write(`<span class="inp">In [${n}]: %run ${fname}</span>\n`);
        $(".cnt", host).textContent = ++n;
        if (res.out) write(esc(res.out));
        if (res.err) write(`<span class="err">${esc(res.err)}</span>`);
        if (!res.out && !res.err) write(`<span class="note">(no output)</span>\n`);
        write("\n");
        showFigs(res.figs);
      }
      return res;
    } catch (e) {
      const msg = "Couldn't start the code session. Check your connection and try again.";
      if (sql) $(".tblwrap", host).innerHTML = `<div class="cbody"><span class="err">${msg}</span></div>`;
      else write(`<span class="err">${msg}</span>\n`);
      return { ok: false, msg, fatal: true };
    } finally { setBusy(false); }
  }
  function renderHTML(code) {
    const fr = $("iframe.preview", host);
    return new Promise(res => { fr.onload = () => res(fr); fr.srcdoc = code; });
  }
  function renderSQL(res) {
    showPane(0);
    const w = $(".tblwrap", host);
    if (res.err) { w.innerHTML = `<div class="cbody"><span class="err">${esc(res.err)}</span></div>`; return; }
    if (!res.cols.length) { w.innerHTML = `<div class="cbody"><span class="note">Query ran, but returned no columns. Write a SELECT statement to see results.</span></div>`; return; }
    const cell = v => v === null ? `<td class="null">null</td>` : `<td>${esc(v)}</td>`;
    w.innerHTML = `<table class="res"><thead><tr>${res.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${res.rows.map(r => `<tr>${r.map(cell).join("")}</tr>`).join("")}</tbody></table>
      <div class="cbody"><span class="note">${res.count} row${res.count === 1 ? "" : "s"}${res.count > res.rows.length ? ", showing the first " + res.rows.length : ""}</span></div>`;
  }
  async function run(mode) { return exec(mode); }
  async function submit() { const r = await exec("submit"); if (r) o.onSubmit(r); }
  $("[data-a=run]", host).onclick = () => run("run");
  if (o.onSubmit) $("[data-a=submit]", host).onclick = submit;
  if (o.onReset) $("[data-a=reset]", host).onclick = () => { ed.set(o.onReset()); toast("Code reset"); };
  if (!html) $("[data-a=clear]", host).onclick = () => {
    if (sql) $(".tblwrap", host).innerHTML = `<div class="cbody"><span class="note">Run your query to see the result here.</span></div>`;
    else { cbody.innerHTML = ""; $(".plots", host).innerHTML = `<span class="note muted">Plots you create will appear here.</span>`; }
  };
  if (!sql && !html) {
    const inp = $(".cin input", host);
    inp.addEventListener("keydown", async e => {
      if (e.key === "ArrowUp") { if (hi > 0) { hi--; inp.value = hist[hi]; } e.preventDefault(); return; }
      if (e.key === "ArrowDown") { if (hi < hist.length) { hi++; inp.value = hist[hi] || ""; } e.preventDefault(); return; }
      if (e.key !== "Enter") return;
      const code = inp.value; if (!code.trim()) return;
      hist.push(code); hi = hist.length; inp.value = "";
      write(`<span class="inp">In [${n}]: ${esc(code)}</span>\n`);
      $(".cnt", host).textContent = ++n;
      try {
        await ensurePy(o.pkgs);
        await py.loadPackagesFromImports(code); await setupMpl();
        py.globals.set("_a", code);
        const r = JSON.parse(py.runPython("shell(_a)"));
        if (r.out) write(esc(r.out));
        if (r.err) write(`<span class="err">${esc(r.err)}</span>`);
        showFigs(r.figs);
      } catch (err) { write(`<span class="err">Session unavailable.</span>\n`); }
      write("\n");
    });
  }
  // warm up in the background
  if (html) renderHTML(o.value); else ensurePy(o.pkgs).catch(() => {});
  return { ed, run, write };
}
class HFail extends Error {}
function htmlHelpers(doc, code) {
  const win = doc.defaultView, el = s => typeof s === "string" ? doc.querySelector(s) : s;
  return {
    code,
    need: (c, m) => { if (!c) throw new HFail(m); },
    q: s => doc.querySelector(s), qa: s => [...doc.querySelectorAll(s)],
    text: s => { const e = el(s); return e ? e.textContent.trim() : null; },
    css: (s, p) => { const e = el(s); return e ? win.getComputedStyle(e).getPropertyValue(p) : null; },
    rgb: hex => { const n = parseInt(hex.slice(1), 16); return `rgb(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255})`; }
  };
}
function htmlCheck(doc, code, check) {
  try { check(htmlHelpers(doc, code), doc, code); return { ok: true, msg: "" }; }
  catch (e) { return { ok: false, msg: e instanceof HFail ? e.message : "Something isn't right yet. Compare your code with the instructions." }; }
}

/* ===== Top bar ===== */
function updateTop() {
  $("#xpPill").innerHTML = I.bolt + fmtNum(S.xp) + " XP";
  $("#streakPill").innerHTML = I.flame + streak();
}
function setNav(name) {
  $$(".nav a, .mnav a").forEach(a => a.classList.toggle("on", a.dataset.n === name));
}

/* ===== Pages ===== */
function courseCard(c) {
  const p = prog(c), k = counts(c);
  return `<div class="card cc" onclick="location.hash='course-${c.id}'">
    <div style="display:flex;gap:8px;align-items:center">${techTag(c)}<span class="tag">${c.level}</span>${p.pct === 100 ? `<span class="tag" style="color:var(--ok)">Completed</span>` : ""}</div>
    <h3>${esc(c.title)}</h3>
    <p>${esc(c.desc)}</p>
    <div class="meta"><span>${I.clock}${c.hours} hours</span><span>${I.video}${k.videos} videos</span><span>${I.code}${k.ex} exercises</span></div>
    ${p.done ? `<div class="bar"><i style="width:${p.pct}%"></i></div><div class="muted" style="font-size:12.5px">${p.pct}% complete</div>` : ""}
  </div>`;
}

function pageHome() {
  setNav("home");
  const totalDone = Object.keys(S.done).length;
  const completed = COURSES.filter(c => prog(c).pct === 100).length;
  const last = S.last && courseById(S.last.course);
  const lc = last || COURSES[0];
  const lp = prog(lc);
  const nx = nextUndone(lc);
  const tx = todayXP(), goal = S.goal, pct = Math.min(1, tx / goal);
  const R = 46, C = 2 * Math.PI * R;
  const wk = []; const d = new Date(); d.setDate(d.getDate() - 6);
  for (let i = 0; i < 7; i++) { wk.push({ l: "SMTWTFS"[d.getDay()], on: dkey(d) in S.days }); d.setDate(d.getDate() + 1); }
  $("#app").innerHTML = `<div class="page">
    <h1 class="h1">${totalDone ? "Welcome back" : "Welcome to Datum"}</h1>
    <div class="sub">${totalDone ? "Pick up where you left off and keep your streak going." : "Learn Python and SQL by writing real code in your browser. Start with a course below."}</div>
    <div class="kpis">
      <div class="kpi"><div class="l">Total XP</div><div class="v">${fmtNum(S.xp)}</div></div>
      <div class="kpi"><div class="l">Day streak</div><div class="v">${streak()}</div></div>
      <div class="kpi"><div class="l">Exercises completed</div><div class="v">${totalDone}</div></div>
      <div class="kpi"><div class="l">Courses completed</div><div class="v">${completed} <span class="muted" style="font-size:15px;font-weight:500">of ${COURSES.length}</span></div></div>
    </div>
    <div class="sec two">
      <div class="card">
        <div class="ex-h">${last ? "Continue learning" : "Start learning"}</div>
        <div class="cont" style="margin-top:14px">
          <div class="ic" style="background:${techColor(lc)[0]};color:${techColor(lc)[1]}">${lc.tech === "SQL" ? I.db : I.code}</div>
          <div style="flex:1;min-width:0">
            <h3 style="font-size:18px">${esc(lc.title)}</h3>
            <div class="muted" style="font-size:13.5px;margin-top:2px">Chapter ${nx.ci + 1}: ${esc(lc.chapters[nx.ci].title)} · ${esc(nx.l.title)}</div>
            <div class="bar" style="margin-top:12px"><i style="width:${lp.pct}%"></i></div>
            <div class="muted" style="font-size:12.5px;margin-top:6px">${lp.done} of ${lp.total} exercises · ${lp.pct}%</div>
          </div>
        </div>
        <div style="margin-top:18px;display:flex;gap:8px"><button class="btn pri" onclick="location.hash='${lhash(lc, nx.ci, nx.li).slice(1)}'">${lp.done ? "Continue" : "Start course"}</button><button class="btn" onclick="location.hash='course-${lc.id}'">Course overview</button></div>
      </div>
      <div class="card">
        <div class="ex-h">Daily XP goal</div>
        <div class="ring"><svg width="110" height="110"><circle cx="55" cy="55" r="${R}" stroke="#eef0f3" stroke-width="10" fill="none"/><circle cx="55" cy="55" r="${R}" stroke="${pct >= 1 ? "var(--ok)" : "var(--acc)"}" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
          <div class="t"><div>${tx}<small>of ${goal} XP</small></div></div></div>
        <div class="week">${wk.map(w => `<div><i class="${w.on ? "on" : ""}"></i>${w.l}</div>`).join("")}</div>
        <div style="display:flex;gap:6px;justify-content:center;margin-top:14px">${[100, 250, 500].map(g => `<button class="chip ${g === goal ? "on" : ""}" onclick="S.goal=${g};save();pageHome()">${g} XP</button>`).join("")}</div>
      </div>
    </div>
    <div class="sec"><div class="sec-h"><h2>Courses</h2><a href="#courses">Browse all</a></div><div class="grid">${COURSES.map(courseCard).join("")}</div></div>
    <div class="sec"><div class="sec-h"><h2>Tracks</h2><a href="#tracks">See tracks</a></div><div class="grid">${TRACKS.map(trackMini).join("")}</div></div>
  </div>`;
}
function trackProg(t) {
  let d = 0, n = 0; t.courses.forEach(id => { const p = prog(courseById(id)); d += p.done; n += p.total; });
  return n ? Math.round(d / n * 100) : 0;
}
function trackMini(t) {
  const p = trackProg(t);
  return `<div class="card cc" onclick="location.hash='tracks'"><div class="ex-h">${I.route.replace("<svg", '<svg width="14" height="14"')} Skill track · ${t.courses.length} course${t.courses.length > 1 ? "s" : ""}</div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="bar"><i style="width:${p}%"></i></div><div class="muted" style="font-size:12.5px">${p}% complete</div></div>`;
}

let F = { q: "", tech: "All", level: "All" };
function pageCourses() {
  setNav("courses");
  $("#app").innerHTML = `<div class="page">
    <h1 class="h1">Courses</h1><div class="sub">Interactive courses with real code that runs in your browser.</div>
    <div class="filters">
      <input class="search" placeholder="Search courses" value="${esc(F.q)}" aria-label="Search courses">
      ${["All", "Python", "SQL", "HTML"].map(t => `<button class="chip ${F.tech === t ? "on" : ""}" data-t="${t}">${t === "All" ? "All technologies" : t}</button>`).join("")}
      ${["All", "Beginner", "Intermediate"].map(t => `<button class="chip ${F.level === t ? "on" : ""}" data-l="${t}">${t === "All" ? "All levels" : t}</button>`).join("")}
    </div>
    <div class="grid" id="cgrid"></div></div>`;
  const draw = () => {
    const q = F.q.toLowerCase();
    const list = COURSES.filter(c => (F.tech === "All" || c.tech === F.tech) && (F.level === "All" || c.level === F.level) && (!q || (c.title + " " + c.desc).toLowerCase().includes(q)));
    $("#cgrid").innerHTML = list.length ? list.map(courseCard).join("") : `<div class="empty">No courses match your filters.</div>`;
  };
  $(".search").oninput = e => { F.q = e.target.value; draw(); };
  $$("[data-t]").forEach(b => b.onclick = () => { F.tech = b.dataset.t; pageCourses(); });
  $$("[data-l]").forEach(b => b.onclick = () => { F.level = b.dataset.l; pageCourses(); });
  draw();
}

function pageCourse(id) {
  const c = courseById(id); if (!c) return pageCourses();
  setNav("courses");
  const p = prog(c), k = counts(c), nx = nextUndone(c);
  const pre = (c.prereq || []).map(courseById).filter(Boolean);
  $("#app").innerHTML = `
  <div class="chero"><div class="in">
    <div>
      <a href="#courses" class="muted" style="font-size:13px">Courses</a>
      <div style="display:flex;gap:8px;margin-top:14px">${techTag(c)}<span class="tag">${c.level}</span></div>
      <h1>${esc(c.title)}</h1>
      <p>${esc(c.long)}</p>
      <div class="facts">
        <div><b>${c.hours} hours</b>Duration</div><div><b>${k.videos}</b>Videos</div><div><b>${k.ex}</b>Exercises</div><div><b>${fmtNum(courseXP(c))} XP</b>Available</div>
      </div>
      <div style="display:flex;gap:10px;margin-top:24px">
        <button class="btn pri" onclick="location.hash='${lhash(c, nx.ci, nx.li).slice(1)}'">${p.pct === 100 ? "Review course" : p.done ? "Continue course" : "Start course"}</button>
        ${p.pct === 100 ? `<button class="btn" onclick="showCert('${c.id}')">${I.trophy}View statement</button>` : ""}
      </div>
    </div>
    <div class="side">
      <h4>Your progress</h4>
      <div style="font-size:24px;font-weight:700">${p.pct}%</div>
      <div class="bar ${p.pct === 100 ? "ok" : ""}" style="margin:8px 0 6px"><i style="width:${p.pct}%"></i></div>
      <div class="muted" style="font-size:13px">${p.done} of ${p.total} exercises</div>
      ${c.datasets.length ? `<h4 style="margin-top:20px">Datasets</h4>` : ""}
      ${c.datasets.map(d => `<div style="font-size:13.5px;margin-bottom:6px">${esc(d)}</div>`).join("")}
      ${pre.length ? `<h4 style="margin-top:20px">Prerequisites</h4>${pre.map(x => `<a href="#course-${x.id}" style="font-size:13.5px;display:block">${esc(x.title)}</a>`).join("")}` : ""}
    </div>
  </div></div>
  <div class="page" style="padding-top:28px">
    ${c.chapters.map((ch, ci) => {
      const cp = chapProg(c, ci); const done = cp.done === cp.total;
      const open = ci === nx.ci;
      return `<div class="chap ${open ? "open" : ""}">
        <div class="chap-h" onclick="this.parentNode.classList.toggle('open')">
          <div class="chap-n ${done ? "done" : ""}">${done ? I.check.replace("<svg", '<svg width="16" height="16"') : ci + 1}</div>
          <div><h3>${esc(ch.title)}</h3><p>${esc(ch.desc)}</p>
            <div class="muted" style="font-size:12.5px;margin-top:8px">${cp.done}/${cp.total} complete</div></div>
          <span class="chev">${I.chev.replace("<svg", '<svg width="20" height="20"')}</span>
        </div>
        <div class="lessons">${ch.lessons.map((l, li) => lessonRow(c, ci, li)).join("")}</div>
      </div>`;
    }).join("")}
  </div>`;
}
function lessonRow(c, ci, li, cur) {
  const l = c.chapters[ci].lessons[li], key = lkey(c, ci, li), done = S.done[key] !== undefined;
  return `<div class="lrow ${done ? "done" : ""}" ${cur ? 'style="background:var(--acc-soft)"' : ""} onclick="location.hash='${lhash(c, ci, li).slice(1)}'">
    <span class="li">${typeIcon(l.type)}</span><span>${esc(l.title)}</span>
    <span class="xp">${typeXP(l)} XP</span><span class="ck">${done ? I.check : ""}</span></div>`;
}

function pageTracks() {
  setNav("tracks");
  $("#app").innerHTML = `<div class="page"><h1 class="h1">Skill tracks</h1><div class="sub">Curated sequences of courses that build one skill set from the ground up.</div>
    ${TRACKS.map(t => {
      const p = trackProg(t);
      const next = t.courses.map(courseById).find(c => prog(c).pct < 100);
      return `<div class="card sec">
        <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
          <div style="flex:1;min-width:260px"><div class="ex-h">Skill track</div><h2 style="font-size:21px;margin-top:6px">${esc(t.title)}</h2><p class="muted" style="margin:6px 0 0">${esc(t.desc)}</p></div>
          <div style="width:220px"><div style="font-weight:700">${p}%</div><div class="bar" style="margin:6px 0 12px"><i style="width:${p}%"></i></div>
            ${next ? `<button class="btn pri sm" onclick="location.hash='course-${next.id}'">${p ? "Continue track" : "Start track"}</button>` : `<span class="tag" style="color:var(--ok)">Track complete</span>`}</div>
        </div>
        <div style="margin-top:18px;border-top:1px solid var(--line2)">
          ${t.courses.map((id, i) => { const c = courseById(id), cp = prog(c); return `<div class="lrow ${cp.pct === 100 ? "done" : ""}" style="padding-left:4px" onclick="location.hash='course-${c.id}'">
            <span class="chap-n" style="width:26px;height:26px;font-size:12px">${i + 1}</span><span style="font-weight:600">${esc(c.title)}</span>${techTag(c)}
            <span class="xp">${cp.pct}%</span><span class="ck">${cp.pct === 100 ? I.check : ""}</span></div>`; }).join("")}
        </div></div>`;
    }).join("")}</div>`;
}

/* ===== Practice ===== */
let P = null;
function practicePool(c) {
  const pool = (c.practice || []).map(q => ({ q: q.q, code: q.code, options: q.options, answer: q.answer }));
  flat(c).forEach(x => { if (x.l.type === "mcq") pool.push({ q: x.l.q, code: x.l.code, options: x.l.options, answer: x.l.answer, fb: x.l.fb }); });
  return pool;
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pagePractice() {
  setNav("practice");
  if (!P) {
    $("#app").innerHTML = `<div class="page"><h1 class="h1">Practice</h1><div class="sub">Quick five-question sessions to keep your skills sharp. Earn 10 XP for each correct answer.</div>
      <div class="grid sec">${COURSES.map(c => `<div class="card cc" onclick="startPractice('${c.id}')"><div style="display:flex;gap:8px">${techTag(c)}</div><h3>${esc(c.title)}</h3><p>${practicePool(c).length} questions in the pool</p><div><span class="btn sm">${I.target}Practice</span></div></div>`).join("")}</div></div>`;
    return;
  }
  const q = P.qs[P.i];
  $("#app").innerHTML = `<div class="page pq">
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="ex-h">${esc(P.course.title)} · Question ${P.i + 1} of ${P.qs.length}</div><button class="btn sm" onclick="P=null;pagePractice()">End session</button></div>
    <div class="bar" style="margin:12px 0 26px"><i style="width:${(P.i) / P.qs.length * 100}%"></i></div>
    <h2 style="font-size:21px;margin-bottom:16px">${inline(q.q)}</h2>
    ${q.code ? `<div class="qcode">${hl(q.code, langOf(P.course))}</div>` : ""}
    <div id="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="r"></span><span>${inline(o)}</span><i class="k">${i + 1}</i></button>`).join("")}</div>
    <div id="pfb"></div></div>`;
  $$(".opt").forEach(b => b.onclick = () => answerPractice(+b.dataset.i));
}
function startPractice(id) {
  const c = courseById(id);
  P = { course: c, qs: shuffle(practicePool(c)).slice(0, 5), i: 0, score: 0, answered: false };
  pagePractice();
}
function answerPractice(i) {
  if (!P || P.answered) return;
  P.answered = true;
  const q = P.qs[P.i], right = i === q.answer;
  $$(".opt").forEach((b, j) => { if (j === q.answer) b.classList.add("right"); else if (j === i) b.classList.add("wrong"); b.disabled = true; });
  if (right) { P.score++; addXP(10); }
  const last = P.i === P.qs.length - 1;
  $("#pfb").innerHTML = `<div class="fb ${right ? "good" : "bad"}"><b>${right ? "Correct! +10 XP" : "Not quite."}</b>${q.fb ? inline(q.fb[i]) : right ? "Nice work." : "The correct answer is highlighted in green."}</div>
    <div style="margin-top:16px"><button class="btn pri" id="pnext">${last ? "See results" : "Next question"}</button></div>`;
  $("#pnext").onclick = () => {
    if (last) {
      $("#app").innerHTML = `<div class="page pq" style="text-align:center"><div style="color:var(--acc);display:inline-block;width:48px">${I.trophy}</div><h1 class="h1" style="margin-top:10px">${P.score} of ${P.qs.length} correct</h1>
        <div class="sub">You earned ${P.score * 10} XP in this session.</div>
        <div style="margin-top:22px;display:flex;gap:10px;justify-content:center"><button class="btn pri" onclick="startPractice('${P.course.id}')">Practice again</button><button class="btn" onclick="P=null;pagePractice()">Choose another topic</button></div></div>`;
    } else { P.i++; P.answered = false; pagePractice(); }
  };
}

/* ===== Workspace ===== */
let WS = { lang: "python" };
const WS_DEFAULT = {
  python: "# Your scratchpad. Imports like numpy, pandas and matplotlib load automatically.\nimport numpy as np\n\nheights = np.array([1.73, 1.68, 1.71, 1.89, 1.79])\nprint(heights.mean())\n",
  html: "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Scratchpad</title>\n    <style>\n      body { font-family: system-ui, sans-serif; margin: 40px; }\n      h1 { color: #2457f5; }\n    </style>\n  </head>\n  <body>\n    <h1>Hello!</h1>\n    <p>Edit the code and the preview updates as you type.</p>\n  </body>\n</html>\n",
  sql: "-- Query the films table\nSELECT title, release_year, country\nFROM films\nORDER BY release_year DESC\nLIMIT 10;\n"
};
function pageWorkspace() {
  setNav("workspace");
  $("#app").innerHTML = `<div class="page"><h1 class="h1">Workspace</h1><div class="sub">A scratchpad for experimenting outside of courses. Your code is saved in this browser.</div>
    <div class="filters" style="margin-bottom:0">${["python", "sql", "html"].map(l => `<button class="chip ${WS.lang === l ? "on" : ""}" data-w="${l}">${l === "python" ? "Python" : l.toUpperCase()}</button>`).join("")}<span style="flex:1"></span><span id="wsrt"></span></div>
    <div class="wsgrid"><div class="lright" id="wside"></div></div></div>`;
  if (WS.lang !== "html") $("#wsrt").appendChild(rtBadge());
  $$("[data-w]").forEach(b => b.onclick = () => { WS.lang = b.dataset.w; pageWorkspace(); });
  const k = "ws:" + WS.lang;
  IDE($("#wside"), {
    lang: WS.lang === "sql" ? "sql" : WS.lang === "html" ? "html" : "py", value: S.drafts[k] || WS_DEFAULT[WS.lang],
    pkgs: WS.lang === "sql" ? ["sqlite3"] : [], workspace: true,
    onChange: v => { S.drafts[k] = v; saveSoon(); },
    onReset: () => WS_DEFAULT[WS.lang]
  });
}
let _st; function saveSoon() { clearTimeout(_st); _st = setTimeout(save, 400); }

/* ===== Lesson view ===== */
let L = null;
function openLesson(cid, ci, li) {
  const c = courseById(cid);
  if (!c || !c.chapters[ci] || !c.chapters[ci].lessons[li]) { location.hash = "courses"; return; }
  const l = c.chapters[ci].lessons[li], key = lkey(c, ci, li);
  S.last = { course: c.id, ci, li }; save();
  L = { c, ci, li, l, key, xp: typeXP(l), hint: false, ans: false, wrong: 0, slide: 0, sel: null, solved: S.done[key] !== undefined };
  const root = $("#lesson"); root.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  const ch = c.chapters[ci];
  const prevH = prevOf(c, ci, li), nextH = nextOf(c, ci, li);
  root.innerHTML = `
    <div class="lbar">
      <button class="iconbtn" title="Back to course" onclick="location.hash='course-${c.id}'">${I.x}</button>
      <button class="iconbtn" title="Course outline" id="olbtn">${I.menu}</button>
      <div class="t">${esc(c.title)} <span class="muted" style="font-weight:500">· ${esc(ch.title)}</span></div>
      <div class="seg">${ch.lessons.map((x, j) => `<i title="${esc(x.title)}" class="${j === li ? "c" : S.done[lkey(c, ci, j)] !== undefined ? "d" : ""}" onclick="location.hash='${lhash(c, ci, j).slice(1)}'"></i>`).join("")}</div>
      <span id="rtslot"></span>
      <span class="pill" id="lxp">${I.bolt}<span></span></span>
      <button class="iconbtn" title="Previous" ${prevH ? `onclick="location.hash='${prevH}'"` : "disabled"}>${I.left}</button>
      <button class="iconbtn" title="Next" ${nextH ? `onclick="location.hash='${nextH}'"` : "disabled"}>${I.right}</button>
    </div>
    <div class="lbody" id="lbody"></div>
    <div class="outline hidden" id="outline"></div>`;
  $("#olbtn").onclick = () => {
    const o = $("#outline");
    if (o.classList.toggle("hidden")) return;
    o.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>Course outline</b><button class="iconbtn" onclick="$('#outline').classList.add('hidden')">${I.x}</button></div>` +
      c.chapters.map((chh, i) => `<h4>Chapter ${i + 1}: ${esc(chh.title)}</h4>` + chh.lessons.map((_, j) => lessonRow(c, i, j, i === ci && j === li)).join("")).join("");
  };
  if (l.type !== "video" && c.lang !== "html") $("#rtslot").appendChild(rtBadge());
  updXP();
  if (l.type === "video") renderVideo();
  else if (l.type === "mcq") renderMCQ();
  else renderCode();
}
function updXP() {
  const el = $("#lxp span"); if (!el) return;
  el.textContent = L.solved ? "Completed" : L.xp + " XP";
}
function closeLesson() {
  const r = $("#lesson"); r.classList.add("hidden"); r.innerHTML = ""; document.body.style.overflow = ""; L = null;
}
function prevOf(c, ci, li) { if (li > 0) return lhash(c, ci, li - 1).slice(1); if (ci > 0) return lhash(c, ci - 1, c.chapters[ci - 1].lessons.length - 1).slice(1); return null; }
function nextOf(c, ci, li) { if (li < c.chapters[ci].lessons.length - 1) return lhash(c, ci, li + 1).slice(1); if (ci < c.chapters.length - 1) return lhash(c, ci + 1, 0).slice(1); return null; }
function goNext() {
  const { c, ci, li } = L;
  const n = nextOf(c, ci, li);
  if (prog(c).pct === 100 && !S.certs[c.id]) { S.certs[c.id] = dkey(new Date()); save(); location.hash = "course-" + c.id; setTimeout(() => showCert(c.id, true), 60); return; }
  if (n) location.hash = n;
  else location.hash = "course-" + c.id;
}
function complete() {
  const got = award(L.key, L.xp);
  L.solved = true; updXP();
  return got;
}

function renderVideo() {
  const s = L.l.slides;
  $("#lbody").innerHTML = `<div class="slides"><div class="slide" id="slide"></div>
    <div class="snav"><button class="btn sm" id="sprev">${I.left}Previous</button><div class="dots">${s.map(() => "<i></i>").join("")}</div><button class="btn sm pri" id="snext">Next${I.right}</button></div></div>`;
  const draw = () => {
    const x = s[L.slide];
    $("#slide").innerHTML = `<div class="ex-h" style="margin-bottom:14px">${esc(L.l.title)}</div><h3>${esc(x.h)}</h3>
      ${x.b ? `<ul>${x.b.map(b => `<li>${inline(b)}</li>`).join("")}</ul>` : ""}
      ${x.code ? `<pre>${hl(x.code, langOf(L.c))}</pre>` : ""}
      ${x.out ? `<pre class="out">${esc(x.out)}</pre>` : ""}`;
    $$(".dots i").forEach((d, i) => d.classList.toggle("on", i === L.slide));
    $("#sprev").disabled = L.slide === 0;
    const last = L.slide === s.length - 1;
    $("#snext").innerHTML = last ? (L.solved ? "Continue" + I.right : "Got it! +50 XP") : "Next" + I.right;
  };
  $("#sprev").onclick = () => { if (L.slide > 0) { L.slide--; draw(); } };
  $("#snext").onclick = () => {
    if (L.slide < s.length - 1) { L.slide++; draw(); return; }
    const got = complete(); if (got > 0) toast(I.bolt.replace("<svg", '<svg width="16" height="16"') + " +" + got + " XP");
    goNext();
  };
  L.keys = e => { if (e.key === "ArrowRight") $("#snext").click(); if (e.key === "ArrowLeft") $("#sprev").click(); };
  draw();
}

function renderMCQ() {
  const l = L.l;
  $("#lbody").innerHTML = `<div style="flex:1;overflow:auto"><div class="mcq">
    <div class="ex-h">${I.mcq.replace("<svg", '<svg width="15" height="15"')} Multiple choice exercise <span class="xpb" style="margin-left:auto">${L.solved ? "Completed" : L.xp + " XP"}</span></div>
    <h2 style="font-size:24px;margin:10px 0 12px">${esc(l.title)}</h2>
    <div class="prose">${md(l.context)}</div>
    <h3 style="font-size:17px;margin:20px 0 14px">${inline(l.q)}</h3>
    ${l.code ? `<div class="qcode">${hl(l.code, langOf(L.c))}</div>` : ""}
    <div id="opts">${l.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="r"></span><span>${inline(o)}</span><i class="k">${i + 1}</i></button>`).join("")}</div>
    <div style="margin-top:14px;display:flex;gap:10px"><button class="btn pri" id="msub" disabled>Submit Answer</button></div>
    <div id="mfb"></div></div></div>`;
  const pick = i => { if (L.mDone) return; L.sel = i; $$(".opt").forEach((b, j) => b.classList.toggle("sel", j === i)); $("#msub").disabled = false; };
  $$(".opt").forEach(b => b.onclick = () => pick(+b.dataset.i));
  $("#msub").onclick = () => {
    if (L.sel === null) return;
    const i = L.sel, ok = i === l.answer;
    if (L.mDone) { goNext(); return; }
    $$(".opt")[i].classList.add(ok ? "right" : "wrong");
    if (ok) {
      L.mDone = true;
      const got = complete();
      $$(".opt").forEach(b => b.disabled = true);
      $("#mfb").innerHTML = `<div class="fb good"><b>${got > 0 ? "Well done! +" + got + " XP" : "Well done!"}</b>${inline(l.fb[i])}</div>`;
      $("#msub").textContent = "Continue"; $("#msub").classList.remove("pri"); $("#msub").classList.add("ok");
    } else {
      L.wrong++; if (!L.solved) { L.xp = Math.max(15, 50 - 15 * L.wrong); updXP(); }
      $("#mfb").innerHTML = `<div class="fb bad"><b>Incorrect.</b>${inline(l.fb[i])}</div>`;
    }
  };
  L.keys = e => { if (e.target.tagName === "INPUT") return; const n = +e.key; if (n >= 1 && n <= l.options.length) pick(n - 1); if (e.key === "Enter" && !$("#msub").disabled) $("#msub").click(); };
}

function renderCode() {
  const l = L.l, c = L.c;
  $("#lbody").innerHTML = `
    <div class="lleft">
      <div class="ex-h">${I.code.replace("<svg", '<svg width="15" height="15"')} Exercise</div>
      <h2>${esc(l.title)}</h2>
      <div class="prose">${md(l.context)}</div>
      <div class="instr">
        <div class="instr-h"><span>Instructions</span><span class="xpb" id="ixp"></span></div>
        <ul>${l.instr.map(x => `<li>${inline(x)}</li>`).join("")}</ul>
        <div class="acts" id="acts"></div>
        <div id="hintslot"></div>
      </div>
      <div id="cfb"></div>
    </div>
    <div class="lright" id="ide"></div>`;
  const updI = () => {
    $("#ixp").textContent = L.solved ? "Completed" : L.xp + " XP";
    $("#acts").innerHTML = !L.hint
      ? `<button class="btn sm" id="hbtn">${I.bulb}Take Hint ${L.solved ? "" : "(-30 XP)"}</button>`
      : !L.ans ? `<button class="btn sm" id="abtn">${I.eye}Show Answer ${L.solved ? "" : "(-40 XP)"}</button>` : "";
    if ($("#hbtn")) $("#hbtn").onclick = () => { L.hint = true; if (!L.solved) L.xp -= 30; $("#hintslot").innerHTML = `<div class="hintbox">${inline(l.hint)}</div>`; updI(); updXP(); };
    if ($("#abtn")) $("#abtn").onclick = () => { L.ans = true; if (!L.solved) L.xp -= 40; ide.ed.set(l.solution); updI(); updXP(); toast("Solution loaded into the editor"); };
  };
  updI();
  const ide = IDE($("#ide"), {
    lang: langOf(c),
    value: S.drafts[L.key] || l.starter,
    pkgs: c.pkgs, pre: c.pre || "", solution: l.solution, check: l.check || "",
    onChange: v => { S.drafts[L.key] = v; saveSoon(); },
    onReset: () => l.starter,
    onSubmit: res => {
      if (res.fatal) return;
      if (res.ok) {
        const got = complete();
        $("#cfb").innerHTML = `<div class="fb good"><b>${got > 0 ? "Great work! +" + got + " XP" : "Correct!"}</b>${["Well done.", "You nailed it.", "That's exactly right.", "Nice job."][Math.floor(Math.random() * 4)]}
          <div style="margin-top:12px"><button class="btn ok sm" id="cnext">Continue${I.right}</button></div></div>`;
        $("#cnext").onclick = goNext;
        updI();
      } else {
        $("#cfb").innerHTML = `<div class="fb bad"><b>Not quite right.</b>${inline(res.msg || "Check the instructions and try again.")}</div>`;
      }
      $("#cfb").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  L.keys = null;
}

function showCert(id, fresh) {
  const c = courseById(id);
  const date = S.certs[id] || dkey(new Date());
  const d = new Date(date + "T12:00:00");
  const m = document.createElement("div"); m.className = "modal";
  m.innerHTML = `<div class="box">
    ${fresh ? `<div style="color:var(--ok);width:44px;margin:0 auto">${I.trophy}</div><h2 style="font-size:24px;margin-top:8px">Course complete!</h2><p class="muted" style="margin:6px 0 0">You finished every exercise in this course.</p>` : ""}
    <div class="cert"><div class="ex-h" style="justify-content:center">Statement of Accomplishment</div>
      <div class="cn">${esc(c.title)}</div>
      <div class="muted" style="font-size:13.5px">Completed ${d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${c.hours} hours · ${fmtNum(flat(c).reduce((a, x) => a + (S.done[x.key] || 0), 0))} XP earned</div></div>
    <div style="display:flex;gap:10px;justify-content:center"><button class="btn pri" id="mclose">Done</button>${fresh ? `<button class="btn" onclick="this.closest('.modal').remove();location.hash='courses'">Browse courses</button>` : ""}</div></div>`;
  document.body.appendChild(m);
  $("#mclose", m).onclick = () => m.remove();
  m.onclick = e => { if (e.target === m) m.remove(); };
}

/* ===== Router ===== */
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || "home";
  const lm = h.match(/^l-(.+)-(\d+)-(\d+)$/);
  if (lm) { openLesson(lm[1], +lm[2] - 1, +lm[3] - 1); return; }
  if (L) closeLesson();
  window.scrollTo(0, 0);
  if (h === "courses") pageCourses();
  else if (h.startsWith("course-")) pageCourse(h.slice(7));
  else if (h === "tracks") pageTracks();
  else if (h === "practice") pagePractice();
  else if (h === "workspace") pageWorkspace();
  else pageHome();
}
document.addEventListener("keydown", e => {
  if (!L || !L.keys) return;
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
  L.keys(e);
});
window.addEventListener("hashchange", route);
updateTop();
route();
