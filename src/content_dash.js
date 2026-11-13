/* ===== HTML Dashboard Visuals ===== */
COURSES.push({
  id:"html-dashboards", title:"HTML Dashboard Visuals", tech:"HTML", level:"Intermediate", hours:3, lang:"html",
  desc:"Design dashboard components in plain HTML and CSS: KPI cards, grid layouts, bars, sparklines, and HTML that works inside Power BI measures.",
  long:"Hand-built HTML gives you full design control over dashboards, from KPI cards that match your Figma file to charts drawn with a few lines of SVG. In this course you'll build the components of a firm portfolio dashboard: cards, grids, progress bars, bar charts and sparklines. You'll finish by learning how HTML is generated from DAX measures in Power BI's HTML Content visual, and how to write markup that survives being placed inside a DAX string.",
  pkgs:[], pre:"", datasets:[], prereq:["intro-html"],
  chapters:[
  { title:"KPI Cards", desc:"Build the most common dashboard component, with a clear hierarchy and numbers that line up.",
    lessons:[
    {type:"video", title:"Anatomy of a KPI card", slides:[
      {h:"Four parts", b:["Label: what the number is, in Title Case","Value: the number, biggest thing on the card","Comparison: change against a target or last period","Context: the period or filter it covers"]},
      {h:"Hierarchy", b:["Make the value large and bold","Keep labels small and muted","Color only what carries meaning, like up or down"]},
      {h:"Markup", b:["A container with a class, and a child for each part","Classes describe the role, not the look"], code:"<div class=\"kpi\">\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta\">+12% vs Last Year</div>\n</div>"}
    ]},
    {type:"code", title:"Build a KPI card", xp:100,
      context:"Start with structure. Styling comes next.",
      instr:["Inside the `.kpi` div, add a `div` with class `label` and the text `Total Fees`.","Add a `div` with class `value` and the text `$4.2M`.","Add a `div` with class `delta` and the text `+12% vs Last Year`."],
      hint:"`<div class=\"label\">Total Fees</div>` and so on, in that order.",
      starter:"<div class=\"kpi\">\n  <!-- Label, value and delta -->\n\n</div>\n",
      solution:"<div class=\"kpi\">\n  <!-- Label, value and delta -->\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta\">+12% vs Last Year</div>\n</div>\n",
      check:(h)=>{
        h.need(h.q(".kpi"), "Keep the `.kpi` container.");
        h.need(h.text(".kpi .label") === "Total Fees", "Add `<div class=\"label\">Total Fees</div>` inside `.kpi`.");
        h.need(h.text(".kpi .value") === "$4.2M", "Add `<div class=\"value\">$4.2M</div>` inside `.kpi`.");
        h.need(h.text(".kpi .delta") === "+12% vs Last Year", "Add `<div class=\"delta\">+12% vs Last Year</div>` inside `.kpi`.");
        const kids = [...h.q(".kpi").children].map(e => e.className);
        h.need(kids.join(" ") === "label value delta", "Put the label first, then the value, then the delta.");
      }},
    {type:"code", title:"Style the card", xp:100,
      context:"A light border and generous padding make a card feel like a unit. Size and weight create the hierarchy between label and value.",
      instr:["Give `.kpi` a `padding` of `20px`, a `border` of `1px solid #e5e7eb` and a `border-radius` of `12px`.","Give `.label` a `color` of `#64748b` and a `font-size` of `13px`.","Give `.value` a `font-size` of `36px` and a `font-weight` of `700`."],
      hint:"Three rules: `.kpi { ... }`, `.label { ... }`, `.value { ... }`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; }\n  /* Style .kpi, .label and .value */\n\n</style>\n\n<div class=\"kpi\">\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta\">+12% vs Last Year</div>\n</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; }\n  /* Style .kpi, .label and .value */\n  .kpi {\n    padding: 20px;\n    border: 1px solid #e5e7eb;\n    border-radius: 12px;\n  }\n  .label {\n    color: #64748b;\n    font-size: 13px;\n  }\n  .value {\n    font-size: 36px;\n    font-weight: 700;\n  }\n</style>\n\n<div class=\"kpi\">\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta\">+12% vs Last Year</div>\n</div>\n",
      check:(h)=>{
        h.need(h.css(".kpi","padding-top") === "20px" && h.css(".kpi","padding-left") === "20px", "Set `padding: 20px` on `.kpi`.");
        h.need(h.css(".kpi","border-top-width") === "1px" && h.css(".kpi","border-top-color") === h.rgb("#e5e7eb"), "Set `border: 1px solid #e5e7eb` on `.kpi`.");
        h.need(h.css(".kpi","border-top-left-radius") === "12px", "Set `border-radius: 12px` on `.kpi`.");
        h.need(h.css(".label","color") === h.rgb("#64748b") && h.css(".label","font-size") === "13px", "Style `.label` with `color: #64748b` and `font-size: 13px`.");
        h.need(h.css(".value","font-size") === "36px" && h.css(".value","font-weight") === "700", "Style `.value` with `font-size: 36px` and `font-weight: 700`.");
      }},
    {type:"code", title:"Numbers that line up", xp:100,
      context:"In most fonts, digits have different widths, so a `1` is narrower than an `8`. On a dashboard that makes numbers jitter when filters change, and columns of figures stop lining up. `font-variant-numeric: tabular-nums` gives every digit the same width.",
      instr:["Add `font-variant-numeric: tabular-nums` to the `.value` rule."],
      hint:"Add the declaration inside `.value { }`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; }\n  .value {\n    font-size: 36px;\n    font-weight: 700;\n  }\n</style>\n\n<div class=\"value\">$1,111,111</div>\n<div class=\"value\">$8,888,888</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; }\n  .value {\n    font-size: 36px;\n    font-weight: 700;\n    font-variant-numeric: tabular-nums;\n  }\n</style>\n\n<div class=\"value\">$1,111,111</div>\n<div class=\"value\">$8,888,888</div>\n",
      check:(h)=>{
        h.need(h.css(".value","font-variant-numeric") === "tabular-nums", "Add `font-variant-numeric: tabular-nums` to `.value`.");
      }},
    {type:"code", title:"Up and down", xp:100,
      context:"Color the comparison so people can read direction at a glance. Combine classes: `class=\"delta up\"` gets the styles of both `.delta` and `.up`.",
      instr:["Add a rule `.delta.up` with `color: #16a34a`.","Add a rule `.delta.down` with `color: #dc2626`.","Add the class `up` to the first card's delta, and `down` to the second card's delta."],
      hint:"In HTML: `<div class=\"delta up\">`. In CSS: `.delta.up { color: #16a34a; }`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; }\n  .delta { font-size: 13px; font-weight: 600; }\n  /* Add .delta.up and .delta.down */\n\n</style>\n\n<div class=\"kpi\">\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta\">+12% vs Last Year</div>\n</div>\n<div class=\"kpi\">\n  <div class=\"label\">Utilization</div>\n  <div class=\"value\">78%</div>\n  <div class=\"delta\">-3 pts vs Target</div>\n</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; }\n  .delta { font-size: 13px; font-weight: 600; }\n  /* Add .delta.up and .delta.down */\n  .delta.up { color: #16a34a; }\n  .delta.down { color: #dc2626; }\n</style>\n\n<div class=\"kpi\">\n  <div class=\"label\">Total Fees</div>\n  <div class=\"value\">$4.2M</div>\n  <div class=\"delta up\">+12% vs Last Year</div>\n</div>\n<div class=\"kpi\">\n  <div class=\"label\">Utilization</div>\n  <div class=\"value\">78%</div>\n  <div class=\"delta down\">-3 pts vs Target</div>\n</div>\n",
      check:(h)=>{
        const d = h.qa(".delta");
        h.need(d.length === 2, "Keep both cards.");
        h.need(d[0].classList.contains("up") && !d[0].classList.contains("down"), "Add the class `up` to the first delta.");
        h.need(d[1].classList.contains("down") && !d[1].classList.contains("up"), "Add the class `down` to the second delta.");
        h.need(h.css(d[0],"color") === h.rgb("#16a34a"), "Set `.delta.up { color: #16a34a; }`.");
        h.need(h.css(d[1],"color") === h.rgb("#dc2626"), "Set `.delta.down { color: #dc2626; }`.");
      }},
    {type:"mcq", title:"Why tabular numbers?",
      context:"Small typographic choices make a dashboard feel solid.",
      q:"What problem does `font-variant-numeric: tabular-nums` solve?",
      options:["It makes numbers bolder","It gives every digit the same width, so figures align and don't jump","It adds thousands separators","It converts numbers to Title Case"], answer:1,
      fb:["Weight is set with font-weight.","Correct! Equal-width digits keep columns aligned and values steady when they update.","Separators come from your formatting, like FORMAT in DAX.","Numbers don't have case."]}
  ]},
  { title:"Dashboard Layout", desc:"Arrange cards and charts with CSS grid, make components span columns, and theme everything with CSS variables.",
    lessons:[
    {type:"video", title:"CSS grid", slides:[
      {h:"Grid layout", b:["display: grid on a container","grid-template-columns defines the columns","gap sets spacing between cells"], code:".kpis {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 16px;\n}"},
      {h:"The fr unit", b:["One fraction of the free space","repeat(4, 1fr) gives four equal columns","2fr 1fr gives a two-to-one split"]},
      {h:"Spanning", b:["grid-column: span 2 makes an item two columns wide","Great for a wide chart next to narrow cards"], code:".wide { grid-column: span 2; }"},
      {h:"Theming with variables", b:["Define colors once with custom properties","Reuse them with var()","Change the theme in one place"], code:":root { --accent: #2457f5; }\n.value { color: var(--accent); }"}
    ]},
    {type:"code", title:"A row of KPIs", xp:100,
      context:"Four KPI cards should sit side by side in equal columns.",
      instr:["Make `.kpis` a grid with `display: grid`.","Give it four equal columns with `grid-template-columns: repeat(4, 1fr)`.","Set `gap` to `16px`."],
      hint:"All three declarations go in the `.kpis` rule.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .kpis {\n    /* Make this a 4-column grid */\n\n  }\n  .kpi { padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; }\n  .label { color: #64748b; font-size: 13px; }\n  .value { font-size: 28px; font-weight: 700; }\n</style>\n\n<div class=\"kpis\">\n  <div class=\"kpi\"><div class=\"label\">Total Fees</div><div class=\"value\">$4.2M</div></div>\n  <div class=\"kpi\"><div class=\"label\">Active Projects</div><div class=\"value\">14</div></div>\n  <div class=\"kpi\"><div class=\"label\">Utilization</div><div class=\"value\">78%</div></div>\n  <div class=\"kpi\"><div class=\"label\">Gross Area</div><div class=\"value\">1.8M SF</div></div>\n</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .kpis {\n    /* Make this a 4-column grid */\n    display: grid;\n    grid-template-columns: repeat(4, 1fr);\n    gap: 16px;\n  }\n  .kpi { padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; }\n  .label { color: #64748b; font-size: 13px; }\n  .value { font-size: 28px; font-weight: 700; }\n</style>\n\n<div class=\"kpis\">\n  <div class=\"kpi\"><div class=\"label\">Total Fees</div><div class=\"value\">$4.2M</div></div>\n  <div class=\"kpi\"><div class=\"label\">Active Projects</div><div class=\"value\">14</div></div>\n  <div class=\"kpi\"><div class=\"label\">Utilization</div><div class=\"value\">78%</div></div>\n  <div class=\"kpi\"><div class=\"label\">Gross Area</div><div class=\"value\">1.8M SF</div></div>\n</div>\n",
      check:(h)=>{
        h.need(h.css(".kpis","display") === "grid", "Set `display: grid` on `.kpis`.");
        const cols = h.css(".kpis","grid-template-columns").trim().split(/\s+/);
        h.need(cols.length === 4, "Use `grid-template-columns: repeat(4, 1fr)` for four columns.");
        h.need(new Set(cols).size === 1, "Make the four columns equal with `1fr` each.");
        h.need(h.css(".kpis","column-gap") === "16px", "Set `gap: 16px` on `.kpis`.");
      }},
    {type:"code", title:"Spanning columns", xp:100,
      context:"Dashboards mix narrow cards and wide charts. In this three-column grid, the trend chart should take two columns and the card one.",
      instr:["Add a `.wide` rule with `grid-column: span 2`.","Add the class `wide` to the chart div (the one labeled `Fees Trend`)."],
      hint:"`<div class=\"cell wide\">` and `.wide { grid-column: span 2; }`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n  .cell { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; min-height: 120px; }\n  /* Add a .wide rule */\n\n</style>\n\n<div class=\"grid\">\n  <div class=\"cell\">Fees Trend</div>\n  <div class=\"cell\">Top Clients</div>\n</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }\n  .cell { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; min-height: 120px; }\n  /* Add a .wide rule */\n  .wide { grid-column: span 2; }\n</style>\n\n<div class=\"grid\">\n  <div class=\"cell wide\">Fees Trend</div>\n  <div class=\"cell\">Top Clients</div>\n</div>\n",
      check:(h)=>{
        const c = h.qa(".cell");
        h.need(c.length === 2 && c[0].classList.contains("wide"), "Add the class `wide` to the `Fees Trend` cell.");
        h.need(!c[1].classList.contains("wide"), "Only the chart cell should be wide.");
        h.need(c[0].getBoundingClientRect().width > c[1].getBoundingClientRect().width * 1.8, "Add `.wide { grid-column: span 2; }`.");
      }},
    {type:"code", title:"Theme with CSS variables", xp:100,
      context:"Hard-coded colors scattered across rules are hard to change. Define them once on `:root` and reuse them. When a client wants their brand color, you change one line.",
      instr:["On `:root`, define `--accent: #2457f5` and `--muted: #64748b`.","Use `var(--accent)` for the `.value` color and `var(--muted)` for the `.label` color."],
      hint:"`:root { --accent: #2457f5; --muted: #64748b; }` then `color: var(--accent);`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  /* Define variables on :root */\n\n  .label { font-size: 13px; }\n  .value { font-size: 32px; font-weight: 700; }\n</style>\n\n<div class=\"label\">Total Fees</div>\n<div class=\"value\">$4.2M</div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  /* Define variables on :root */\n  :root {\n    --accent: #2457f5;\n    --muted: #64748b;\n  }\n  .label { font-size: 13px; color: var(--muted); }\n  .value { font-size: 32px; font-weight: 700; color: var(--accent); }\n</style>\n\n<div class=\"label\">Total Fees</div>\n<div class=\"value\">$4.2M</div>\n",
      check:(h,doc,code)=>{
        const root = doc.defaultView.getComputedStyle(doc.documentElement);
        h.need(root.getPropertyValue("--accent").trim().toLowerCase() === "#2457f5", "Define `--accent: #2457f5` on `:root`.");
        h.need(root.getPropertyValue("--muted").trim().toLowerCase() === "#64748b", "Define `--muted: #64748b` on `:root`.");
        h.need(/var\(\s*--accent\s*\)/.test(code) && h.css(".value","color") === h.rgb("#2457f5"), "Use `color: var(--accent)` on `.value`.");
        h.need(/var\(\s*--muted\s*\)/.test(code) && h.css(".label","color") === h.rgb("#64748b"), "Use `color: var(--muted)` on `.label`.");
      }},
    {type:"mcq", title:"The fr unit",
      context:"fr is the unit you'll use most in dashboard grids.",
      q:"What does `grid-template-columns: 2fr 1fr` produce?",
      options:["Two columns of 2px and 1px","Two columns, the first twice as wide as the second","Three equal columns","One column with two rows"], answer:1,
      fb:["fr is a fraction of free space, not pixels.","Correct! The free space is split into three parts: two for the first column, one for the second.","That would be repeat(3, 1fr).","Columns, not rows."]}
  ]},
  { title:"Charts Without a Library", desc:"Draw progress bars, bar charts and sparklines with plain HTML and SVG, scaling data values to pixels yourself.",
    lessons:[
    {type:"video", title:"Scaling data to pixels", slides:[
      {h:"Bars with divs", b:["A track div and a fill div inside it","The fill's width is the value as a percent of the maximum"], code:"<div class=\"track\"><div class=\"fill\" style=\"width: 72%\"></div></div>"},
      {h:"SVG basics", b:["viewBox sets the coordinate system: \"0 0 300 120\"","x grows to the right, y grows downward","rect, line, polyline, circle and text are shapes you place by coordinates"]},
      {h:"Bars that stand up", b:["Because y grows downward, a bar of height h on a chart of height H starts at y = H - h"], code:"<svg viewBox=\"0 0 300 120\">\n  <rect x=\"20\" y=\"20\" width=\"60\" height=\"100\" />\n</svg>"},
      {h:"Sparklines", b:["A polyline through x,y points","No axes, just the shape of the trend"], code:"<polyline points=\"0,40 50,25 100,30\" fill=\"none\" stroke=\"#2457f5\" />"}
    ]},
    {type:"code", title:"Progress bar", xp:100,
      context:"Utilization is 72% of target. A track with a filled portion shows it at a glance, and works great inside table rows.",
      instr:["Give `.track` a `height` of `8px` and a `background` of `#eef0f3`.","Give `.fill` a `height` of `100%` and a `background` of `#2457f5`.","Set the fill's width to `72%` with an inline `style` attribute."],
      hint:"`<div class=\"fill\" style=\"width: 72%\"></div>`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .track {\n    border-radius: 99px;\n    overflow: hidden;\n    /* height and background */\n\n  }\n  .fill {\n    /* height and background */\n\n  }\n</style>\n\n<div class=\"label\">Utilization</div>\n<div class=\"track\"><div class=\"fill\"></div></div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .track {\n    border-radius: 99px;\n    overflow: hidden;\n    /* height and background */\n    height: 8px;\n    background: #eef0f3;\n  }\n  .fill {\n    /* height and background */\n    height: 100%;\n    background: #2457f5;\n  }\n</style>\n\n<div class=\"label\">Utilization</div>\n<div class=\"track\"><div class=\"fill\" style=\"width: 72%\"></div></div>\n",
      check:(h)=>{
        h.need(h.css(".track","height") === "8px" && h.css(".track","background-color") === h.rgb("#eef0f3"), "Give `.track` `height: 8px` and `background: #eef0f3`.");
        h.need(h.css(".fill","background-color") === h.rgb("#2457f5"), "Give `.fill` `background: #2457f5`.");
        h.need(h.css(".fill","height") === "8px", "Give `.fill` `height: 100%`.");
        const r = h.q(".fill").getBoundingClientRect().width / h.q(".track").getBoundingClientRect().width;
        h.need(Math.abs(r - 0.72) < 0.01, "Set the fill's width to `72%` with `style=\"width: 72%\"`.");
      }},
    {type:"code", title:"Bar chart with divs", xp:100,
      context:"Fees by office: New York $50K, London $30K, Tokyo $20K. Scale each bar against the largest value, so New York is 100%.",
      instr:["Set the width of each `.bar` with an inline style: New York `100%`, London `60%`, Tokyo `40%`."],
      hint:"London is 30 / 50 = 60% of New York.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .row { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 12px; margin-bottom: 8px; }\n  .bar { height: 18px; background: #2457f5; border-radius: 4px; }\n</style>\n\n<div class=\"row\"><span>New York</span><div class=\"bar\"></div></div>\n<div class=\"row\"><span>London</span><div class=\"bar\"></div></div>\n<div class=\"row\"><span>Tokyo</span><div class=\"bar\"></div></div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .row { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 12px; margin-bottom: 8px; }\n  .bar { height: 18px; background: #2457f5; border-radius: 4px; }\n</style>\n\n<div class=\"row\"><span>New York</span><div class=\"bar\" style=\"width: 100%\"></div></div>\n<div class=\"row\"><span>London</span><div class=\"bar\" style=\"width: 60%\"></div></div>\n<div class=\"row\"><span>Tokyo</span><div class=\"bar\" style=\"width: 40%\"></div></div>\n",
      check:(h)=>{
        const b = h.qa(".bar").map(e => e.style.width.replace(/\s/g, ""));
        h.need(b.length === 3, "Keep all three rows.");
        h.need(b[0] === "100%", "New York is the largest value, so its bar is `width: 100%`.");
        h.need(b[1] === "60%", "London is 30 out of 50, so `width: 60%`.");
        h.need(b[2] === "40%", "Tokyo is 20 out of 50, so `width: 40%`.");
      }},
    {type:"code", title:"SVG bar chart", xp:100,
      context:"The chart is 120 units tall. Values are 100, 60 and 40, already in chart units. Because y grows downward, each bar's `y` is `120 - height` so all bars sit on the bottom edge.",
      instr:["The first bar is done for you.","Add a second `rect` at `x=\"110\"` with `width=\"60\"`, `height=\"60\"` and the right `y`.","Add a third `rect` at `x=\"200\"` with `width=\"60\"`, `height=\"40\"` and the right `y`."],
      hint:"The second bar's `y` is `120 - 60 = 60`; the third's is `80`.",
      starter:"<svg viewBox=\"0 0 300 120\" width=\"300\" height=\"120\">\n  <rect x=\"20\" y=\"20\" width=\"60\" height=\"100\" fill=\"#2457f5\" />\n  <!-- Add two more bars -->\n\n</svg>\n",
      solution:"<svg viewBox=\"0 0 300 120\" width=\"300\" height=\"120\">\n  <rect x=\"20\" y=\"20\" width=\"60\" height=\"100\" fill=\"#2457f5\" />\n  <!-- Add two more bars -->\n  <rect x=\"110\" y=\"60\" width=\"60\" height=\"60\" fill=\"#2457f5\" />\n  <rect x=\"200\" y=\"80\" width=\"60\" height=\"40\" fill=\"#2457f5\" />\n</svg>\n",
      check:(h)=>{
        const r = h.qa("svg rect").map(e => ({ x: +e.getAttribute("x"), y: +e.getAttribute("y"), w: +e.getAttribute("width"), h: +e.getAttribute("height") }));
        h.need(r.length === 3, "The chart should have three `rect` elements.");
        h.need(r[1].x === 110 && r[1].w === 60 && r[1].h === 60, "The second bar needs `x=\"110\"`, `width=\"60\"` and `height=\"60\"`.");
        h.need(r[2].x === 200 && r[2].w === 60 && r[2].h === 40, "The third bar needs `x=\"200\"`, `width=\"60\"` and `height=\"40\"`.");
        h.need(r.every(b => b.y + b.h === 120), "Each bar's `y` should be `120 - height`, so it sits on the bottom.");
      }},
    {type:"code", title:"Sparkline", xp:100,
      context:"A sparkline shows the shape of a trend in a tiny space, often right inside a KPI card. Monthly fees, scaled to a chart 200 wide and 50 tall, give these points: `0,40 50,25 100,30 150,10 200,15`.",
      instr:["Add a `polyline` with exactly those `points`.","Set `fill=\"none\"`, `stroke=\"#2457f5\"` and `stroke-width=\"2\"`."],
      hint:"`<polyline points=\"0,40 50,25 100,30 150,10 200,15\" fill=\"none\" stroke=\"#2457f5\" stroke-width=\"2\" />`",
      starter:"<div style=\"font-family: system-ui, sans-serif; color: #64748b; font-size: 13px\">Fees Trend</div>\n<svg viewBox=\"0 0 200 50\" width=\"200\" height=\"50\">\n  <!-- Add the sparkline -->\n\n</svg>\n",
      solution:"<div style=\"font-family: system-ui, sans-serif; color: #64748b; font-size: 13px\">Fees Trend</div>\n<svg viewBox=\"0 0 200 50\" width=\"200\" height=\"50\">\n  <!-- Add the sparkline -->\n  <polyline points=\"0,40 50,25 100,30 150,10 200,15\" fill=\"none\" stroke=\"#2457f5\" stroke-width=\"2\" />\n</svg>\n",
      check:(h)=>{
        const p = h.q("svg polyline");
        h.need(p, "Add a `polyline` inside the `svg`.");
        h.need((p.getAttribute("points") || "").trim().split(/\s+/).join(" ") === "0,40 50,25 100,30 150,10 200,15", "Use the points `0,40 50,25 100,30 150,10 200,15`.");
        h.need(p.getAttribute("fill") === "none", "Set `fill=\"none\"` so the area under the line isn't filled.");
        h.need((p.getAttribute("stroke") || "").toLowerCase() === "#2457f5" && p.getAttribute("stroke-width") === "2", "Set `stroke=\"#2457f5\"` and `stroke-width=\"2\"`.");
      }},
    {type:"mcq", title:"SVG coordinates",
      context:"The SVG coordinate system trips up almost everyone once.",
      q:"In an SVG with `viewBox=\"0 0 300 120\"`, where is the point (0, 0)?",
      options:["Bottom left","Top left","Center","Bottom right"], answer:1,
      fb:["That's the math convention, but SVG's y axis points down.","Correct! The origin is the top left, and y grows downward.","The viewBox starts at its min-x and min-y, here 0 and 0.","Not in SVG."]}
  ]},
  { title:"HTML in Power BI", desc:"Learn how the HTML Content visual turns DAX measures into HTML, and write markup that's safe to put inside a DAX string.",
    lessons:[
    {type:"video", title:"How HTML Content visuals work", slides:[
      {h:"A measure that returns HTML", b:["The HTML Content custom visual renders text as HTML","You write a DAX measure that builds an HTML string","Slicers and filters recalculate the measure, so the HTML updates"]},
      {h:"What it can't do", b:["Scripts don't run, so no JavaScript","Clicking inside it doesn't cross-filter other visuals","Use it for cards, text, tables and static charts"]},
      {h:"Building the string", b:["Concatenate text with &","Format numbers with FORMAT()","Keep the HTML in a variable to stay readable"], code:"KPI Card =\nVAR fees = FORMAT ( [Total Fees], \"$#,0\" )\nRETURN\n\"<div class='kpi'><div class='label'>Total Fees</div>\" &\n\"<div class='value'>\" & fees & \"</div></div>\""}
    ]},
    {type:"video", title:"Quotes and conditions", slides:[
      {h:"The quote problem", b:["DAX strings are wrapped in double quotes","A double quote inside the string must be doubled: \"\"","Easier: use single quotes in your HTML attributes"], code:"-- Hard to read\n\"<div class=\"\"kpi\"\">\"\n-- Easy to read\n\"<div class='kpi'>\""},
      {h:"Conditional classes", b:["Pick a class with IF or SWITCH","Keep colors in CSS, not in DAX"], code:"VAR cls = IF ( [Fees vs PY %] >= 0, \"up\", \"down\" )\nRETURN \"<div class='delta \" & cls & \"'>...</div>\""},
      {h:"Design first", b:["Design the card in Figma","Build it in plain HTML and CSS, like in this course","Then move it into the measure piece by piece"]}
    ]},
    {type:"code", title:"Measure-safe HTML", xp:100,
      context:"This card works, but every attribute uses double quotes, so it would need lots of escaping inside a DAX string. HTML accepts single quotes for attribute values just as well.",
      instr:["Rewrite every attribute value in the code to use single quotes instead of double quotes, so the code contains no double quote characters.","Keep the card working: the styles and text should stay the same."],
      hint:"Change `class=\"kpi\"` to `class='kpi'`, and the same for every other attribute.",
      starter:"<div class=\"kpi\" style=\"padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-family: system-ui\">\n  <div class=\"label\" style=\"color: #64748b; font-size: 13px\">Total Fees</div>\n  <div class=\"value\" style=\"font-size: 32px; font-weight: 700\">$4.2M</div>\n</div>\n",
      solution:"<div class='kpi' style='padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-family: system-ui'>\n  <div class='label' style='color: #64748b; font-size: 13px'>Total Fees</div>\n  <div class='value' style='font-size: 32px; font-weight: 700'>$4.2M</div>\n</div>\n",
      check:(h,doc,code)=>{
        h.need(!code.includes('"'), "There are still double quotes in your code. Replace them all with single quotes.");
        h.need(h.text(".kpi .label") === "Total Fees" && h.text(".kpi .value") === "$4.2M", "Keep the label and value text the same.");
        h.need(h.css(".kpi","padding-top") === "16px" && h.css(".value","font-size") === "32px" && h.css(".label","color") === h.rgb("#64748b"), "Keep the inline styles the same.");
      }},
    {type:"code", title:"Conditional classes", xp:100,
      context:"In a measure you'd pick the class with `IF ( [Change] >= 0, \"up\", \"down\" )`. Here, apply that rule by hand to three office rows: New York `+8%`, London `-3%`, Tokyo `0%`. Zero counts as up.",
      instr:["Add the class `up` or `down` to each `.delta` span based on its value, following the rule above."],
      hint:"`+8%` and `0%` get `up`; `-3%` gets `down`.",
      starter:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .row { display: flex; justify-content: space-between; width: 240px; padding: 6px 0; border-bottom: 1px solid #eef0f3; }\n  .up { color: #16a34a; }\n  .down { color: #dc2626; }\n</style>\n\n<div class='row'><span>New York</span><span class='delta'>+8%</span></div>\n<div class='row'><span>London</span><span class='delta'>-3%</span></div>\n<div class='row'><span>Tokyo</span><span class='delta'>0%</span></div>\n",
      solution:"<style>\n  body { font-family: system-ui, sans-serif; margin: 24px; }\n  .row { display: flex; justify-content: space-between; width: 240px; padding: 6px 0; border-bottom: 1px solid #eef0f3; }\n  .up { color: #16a34a; }\n  .down { color: #dc2626; }\n</style>\n\n<div class='row'><span>New York</span><span class='delta up'>+8%</span></div>\n<div class='row'><span>London</span><span class='delta down'>-3%</span></div>\n<div class='row'><span>Tokyo</span><span class='delta up'>0%</span></div>\n",
      check:(h)=>{
        const d = h.qa(".delta").map(e => (e.classList.contains("up") ? "up" : "") + (e.classList.contains("down") ? "down" : ""));
        h.need(d.length === 3, "Keep all three rows.");
        h.need(d.every(x => x === "up" || x === "down"), "Give every `.delta` exactly one of `up` or `down`.");
        h.need(d.join(" ") === "up down up", "Check the rule: values of 0 or more are `up`, negatives are `down`.");
      }},
    {type:"mcq", title:"Single quotes in measures",
      context:"This small habit saves a lot of escaping.",
      q:"Why use single quotes for HTML attributes inside a DAX measure?",
      options:["HTML requires single quotes","DAX strings are wrapped in double quotes, so double quotes inside would need escaping","Single quotes render faster","Power BI strips double quotes"], answer:1,
      fb:["HTML accepts both.","Correct! Single quotes avoid having to write every inner double quote as two.","There's no rendering difference.","It doesn't strip them, but they need escaping in DAX."]},
    {type:"mcq", title:"Interactivity",
      context:"Knowing a visual's limits helps you choose the right one.",
      q:"Someone clicks a bar drawn with SVG inside an HTML Content visual. What happens to the other visuals on the page?",
      options:["They filter to that bar's category","Nothing: the HTML visual doesn't send selections to other visuals","They highlight the matching data","The page refreshes"], answer:1,
      fb:["That needs a visual that supports selection, like a native chart or Deneb.","Correct! HTML Content visuals respond to filters but don't create them.","Cross-highlighting needs selection support too.","Nothing reloads."]}
  ]}
  ],
  practice:[
    {q:"Which CSS gives four equal columns?", options:["columns: 4","grid-template-columns: repeat(4, 1fr)","display: four","flex: 4"], answer:1},
    {q:"How do you write a double quote inside a DAX string?", options:["\\\"","''","\"\"","&quot; only"], answer:2},
    {q:"In SVG, a bar of height 30 on a 100-tall chart should start at y =", options:["30","0","70","100"], answer:2},
    {q:"Which element draws a sparkline through several points?", options:["rect","polyline","circle","path only"], answer:1},
    {q:"Where do you define CSS variables for the whole page?", options:["body","html or :root","head","style"], answer:1}
  ]
});
TRACKS.push({id:"bi-developer", title:"Power BI and Fabric Developer", desc:"Model data, write DAX, build lakehouse pipelines and design custom HTML visuals for dashboards.", courses:["intro-sql","pbi-modeling","dax","fabric","html-dashboards"]});
TRACKS.find(t => t.id === "web-foundations").courses.push("html-dashboards");
