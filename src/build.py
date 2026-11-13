import json
css=open('style.css').read(); content='\n'.join(open(f).read() for f in ['content.js','data_portfolio.js','content_html.js','content_bi.js','content_dash.js']); app=open('app.js').read(); harness=open('harness.py').read()
logo='<svg width="28" height="28" viewBox="0 0 28 28"><rect width="28" height="28" rx="7" fill="#2457f5"/><rect x="7" y="15" width="3.2" height="6" rx="1.2" fill="#fff"/><rect x="12.4" y="10" width="3.2" height="11" rx="1.2" fill="#fff"/><rect x="17.8" y="6" width="3.2" height="15" rx="1.2" fill="#fff" opacity=".7"/></svg>'
def ic(name): return '${I.%s}'%name
nav=[('home','Home','home'),('courses','Courses','grid'),('tracks','Tracks','route'),('practice','Practice','target'),('workspace','Workspace','term')]
html=f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Datum: Learn Data Science</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body>
<header class="top">
  <a class="logo" href="#home">{logo}Datum</a>
  <nav class="nav">{''.join(f'<a href="#{h}" data-n="{h}">{t}</a>' for h,t,_ in nav)}</nav>
  <div class="stats"><span class="pill" id="streakPill" title="Day streak"></span><span class="pill" id="xpPill" title="Total XP"></span></div>
</header>
<main id="app"></main>
<div id="lesson" class="lesson hidden"></div>
<nav class="mnav" id="mnav"></nav>
<div class="toast" id="toast"></div>
<script>
const HARNESS = {json.dumps(harness)};
{content}
{app}
document.getElementById("mnav").innerHTML = {json.dumps(nav)}.map(([h,t,i]) => `<a href="#${{h}}" data-n="${{h}}">${{I[i]}}${{t}}</a>`).join("");
{{ const on = $(".nav a.on"); if (on) setNav(on.dataset.n); }}
</script>
</body></html>'''
open('../index.html','w').write(html)
print(len(html))
