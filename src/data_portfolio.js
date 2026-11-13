/* ===== Portfolio dataset: a fictional design firm, used by the Power BI, DAX and Fabric courses ===== */
const PORTFOLIO = (() => {
  let s = 20261113;
  const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const offices = [
    [1,"New York","Americas","USA",215],[2,"San Francisco","Americas","USA",225],[3,"Chicago","Americas","USA",195],
    [4,"London","EMEA","UK",190],[5,"Berlin","EMEA","Germany",175],[6,"Tokyo","APAC","Japan",185],
    [7,"Singapore","APAC","Singapore",170],[8,"Sydney","APAC","Australia",180]
  ];
  const clients = [
    [1,"Harbor Financial","Financial Services"],[2,"Lumen Health","Healthcare"],[3,"Northline Tech","Technology"],
    [4,"Civic Arts Trust","Culture"],[5,"Meridian Hotels","Hospitality"],[6,"Redwood University","Education"],
    [7,"Atlas Retail","Retail"],[8,"Kestrel Bank","Financial Services"]
  ];
  // id, name, client, office, practice, status, start (months from 2025-01), duration, gross_sf, monthly fee base
  const projects = [
    [1,"Harbor HQ Fit-Out",1,1,"Workplace","Active",0,22,185000,62000],
    [2,"Lumen Clinic Network",2,3,"Health & Wellness","Active",2,18,64000,38000],
    [3,"Northline Campus",3,2,"Workplace","Active",0,22,410000,91000],
    [4,"Civic Arts Museum Wing",4,4,"Culture & Museums","Active",4,20,52000,47000],
    [5,"Meridian Shibuya",5,6,"Hospitality","Active",1,21,230000,73000],
    [6,"Redwood Library",6,3,"Education","Complete",0,12,88000,29000],
    [7,"Atlas Flagship",7,1,"Mixed Use","Active",6,16,120000,41000],
    [8,"Kestrel Tower Floors",8,4,"Workplace","Active",3,19,140000,52000],
    [9,"Harbor Singapore",1,7,"Workplace","Active",8,14,76000,33000],
    [10,"Meridian Sydney Harbour",5,8,"Hospitality","Active",5,17,195000,58000],
    [11,"Lumen Research Labs",2,2,"Health & Wellness","Complete",0,10,99000,44000],
    [12,"Redwood Student Center",6,5,"Education","Active",7,15,71000,27000],
    [13,"Northline Berlin Studio",3,5,"Workplace","Active",9,13,null,24000],
    [14,"Civic Arts Pavilion",4,1,"Culture & Museums","Concept",18,4,0,15000],
    [15,"Atlas Pop-Up Program",7,6,"Mixed Use","Complete",2,8,18000,12000],
    [16,"Meridian London Rooftop",5,4,"Hospitality","Active",12,10,34000,26000]
  ];
  const staff = [
    [1,"Maya Chen","Design Director",1],[2,"Omar Haddad","Project Architect",1],[3,"Priya Nair","Interior Designer",2],
    [4,"Luca Romano","Design Technologist",4],[5,"Sofia Alvarez","Project Manager",3],[6,"Kenji Mori","Project Architect",6],
    [7,"Ava Thompson","Interior Designer",8],[8,"Noah Fischer","Design Director",5],[9,"Lin Wei","Project Manager",7],
    [10,"Hannah Okafor","Design Technologist",1],[11,"Tom Becker","Project Architect",4],[12,"Grace Kim","Interior Designer",2]
  ];
  const team = {1:[1,2,10],2:[5,12],3:[3,12,10],4:[11,4],5:[6,1],6:[5],7:[2,10],8:[11,4,1],9:[9],10:[7,6],11:[3],12:[8,4],13:[8],14:[1,2],15:[6],16:[11]};
  const months = [];
  for (let i = 0; i < 24; i++) { const y = 2025 + Math.floor(i / 12), m = i % 12 + 1; months.push(`${y}-${String(m).padStart(2, "0")}-01`); }
  const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const lastActual = 21; // data through 2026-10
  const fees = [];
  projects.forEach(p => {
    const [id, , client, office, , , start, dur, , base] = p;
    for (let i = start; i < Math.min(start + dur, lastActual + 1); i++) {
      const ramp = i - start < 2 ? 0.6 : 1;
      const fee = Math.round(base * ramp * (0.8 + 0.4 * rnd()) / 10) * 10;
      const rate = offices[office - 1][4];
      const hours = Math.round(fee / (rate * (0.9 + 0.2 * rnd())));
      fees.push([id, office, client, months[i], fee, hours]);
    }
  });
  // two rows with a project key that's missing from dim_project (a data quality issue)
  fees.push([99, 1, 1, "2026-09-01", 8400, 40], [99, 1, 1, "2026-10-01", 9100, 43]);

  // Bronze timesheets: raw, messy exports
  const officeSp = { 1: ["New York", " new york", "NYC"], 4: ["London", "london ", "LDN"], 6: ["Tokyo", "tokyo"] };
  const emails = { 1: "maya.chen", 2: "omar.haddad", 10: "hannah.okafor", 4: "luca.romano", 11: "tom.becker", 6: "kenji.mori" };
  const codes = { 1: "P-0001", 7: "P-0007", 4: "P-0004", 8: "P-0008", 16: "P-0016", 5: "P-0005" };
  const plan = [[1, 1, 1], [2, 1, 7], [10, 1, 1], [4, 4, 8], [11, 4, 4], [11, 4, 16], [6, 6, 5]];
  const bronze = [];
  plan.forEach(([sid, off, pid]) => {
    for (let d = 3; d <= 7; d++) {
      const sp = officeSp[off][Math.floor(rnd() * officeSp[off].length)];
      let em = emails[sid] + "@atelier.example";
      if (rnd() < 0.3) em = em.toUpperCase();
      const r = rnd();
      const hrs = r < 0.08 ? "n/a" : r < 0.14 ? "" : String([6, 7, 7.5, 8, 8, 8.5][Math.floor(rnd() * 6)]);
      bronze.push([em, codes[pid], sp, `2026-11-0${d}`, hrs]);
    }
  });
  [3, 9, 17, 22, 30].forEach(i => bronze.push(bronze[i].slice()));

  const q = v => v === null ? "NULL" : typeof v === "number" ? String(v) : "'" + String(v).replace(/'/g, "''") + "'";
  const ins = (t, rows) => rows.map(r => `INSERT INTO ${t} VALUES (${r.map(q).join(", ")});`).join("\n");
  const sql = [
    "CREATE TABLE dim_office (office_id INTEGER PRIMARY KEY, office_name TEXT, region TEXT, country TEXT, bill_rate INTEGER);",
    "CREATE TABLE dim_client (client_id INTEGER PRIMARY KEY, client_name TEXT, sector TEXT);",
    "CREATE TABLE dim_project (project_id INTEGER PRIMARY KEY, project_name TEXT, client_id INTEGER, office_id INTEGER, practice_area TEXT, status TEXT, gross_sf INTEGER);",
    "CREATE TABLE dim_staff (staff_id INTEGER PRIMARY KEY, staff_name TEXT, role TEXT, office_id INTEGER);",
    "CREATE TABLE project_staff (project_id INTEGER, staff_id INTEGER);",
    "CREATE TABLE dim_date (date_key TEXT PRIMARY KEY, year INTEGER, quarter TEXT, month_num INTEGER, month_name TEXT);",
    "CREATE TABLE fact_fees (project_id INTEGER, office_id INTEGER, client_id INTEGER, month_date TEXT, fee_usd INTEGER, hours INTEGER);",
    "CREATE TABLE bronze_timesheets (staff_email TEXT, project_code TEXT, office TEXT, work_date TEXT, hours TEXT);",
    ins("dim_office", offices), ins("dim_client", clients),
    ins("dim_project", projects.map(p => [p[0], p[1], p[2], p[3], p[4], p[5], p[8]])),
    ins("dim_staff", staff),
    ins("project_staff", Object.entries(team).flatMap(([p, ss]) => ss.map(x => [+p, x]))),
    ins("dim_date", months.map(m => { const y = +m.slice(0, 4), mo = +m.slice(5, 7); return [m, y, "Q" + Math.ceil(mo / 3), mo, MN[mo - 1]]; })),
    ins("fact_fees", fees), ins("bronze_timesheets", bronze)
  ].join("\n");
  const schema = [
    {table:"fact_fees", cols:[["project_id","INTEGER"],["office_id","INTEGER"],["client_id","INTEGER"],["month_date","TEXT"],["fee_usd","INTEGER"],["hours","INTEGER"]]},
    {table:"dim_project", cols:[["project_id","INTEGER"],["project_name","TEXT"],["client_id","INTEGER"],["office_id","INTEGER"],["practice_area","TEXT"],["status","TEXT"],["gross_sf","INTEGER"]]},
    {table:"dim_office", cols:[["office_id","INTEGER"],["office_name","TEXT"],["region","TEXT"],["country","TEXT"],["bill_rate","INTEGER"]]},
    {table:"dim_client", cols:[["client_id","INTEGER"],["client_name","TEXT"],["sector","TEXT"]]},
    {table:"dim_date", cols:[["date_key","TEXT"],["year","INTEGER"],["quarter","TEXT"],["month_num","INTEGER"],["month_name","TEXT"]]},
    {table:"dim_staff", cols:[["staff_id","INTEGER"],["staff_name","TEXT"],["role","TEXT"],["office_id","INTEGER"]]},
    {table:"project_staff", cols:[["project_id","INTEGER"],["staff_id","INTEGER"]]}
  ];
  const bronzeSchema = [{table:"bronze_timesheets", cols:[["staff_email","TEXT"],["project_code","TEXT"],["office","TEXT"],["work_date","TEXT"],["hours","TEXT"]]}];
  return { sql, schema, bronzeSchema };
})();
