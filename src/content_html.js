/* ===== Introduction to HTML and CSS ===== */
/* Checks run against the rendered preview. They receive h (helpers), doc (the preview document) and code (the raw source).
   Call h.need(condition, message) for each requirement; the first failing message is shown to the learner. */
COURSES.push({
  id:"intro-html", title:"Introduction to HTML and CSS", tech:"HTML", level:"Beginner", hours:3, lang:"html",
  desc:"Build your first web pages. Learn the structure of HTML documents, text, links, images, semantic layout, forms, and how to style it all with CSS.",
  long:"Every web page you've ever visited is built with HTML and styled with CSS. In this course you'll write real pages and see them render instantly in the browser tab below the editor. You'll learn how elements, tags and attributes work, structure documents properly, add text, lists, links and images, use semantic elements and tables, build accessible forms, and finish by styling your pages with CSS selectors, the box model and flexbox.",
  pkgs:[], pre:"",
  datasets:[],
  chapters:[
  { title:"HTML Basics", desc:"Learn what HTML is, how elements and attributes work, and how every HTML document is structured.",
    lessons:[
    {type:"video", title:"What is HTML?", slides:[
      {h:"HTML", b:["HyperText Markup Language","Describes the structure and meaning of content on a web page","Browsers read HTML and render it as a page","CSS styles it, JavaScript adds behavior"]},
      {h:"Elements and tags", b:["An element usually has an opening tag, content and a closing tag","The closing tag has a forward slash"], code:"<p>This is a paragraph.</p>"},
      {h:"Attributes", b:["Extra information about an element","Written inside the opening tag as name=\"value\""], code:"<a href=\"https://example.com\">Visit Example</a>"},
      {h:"Empty elements", b:["Some elements have no content and no closing tag","Examples: <br>, <img>, <input>"], code:"<img src=\"cat.jpg\" alt=\"A sleeping cat\">"},
      {h:"Nesting", b:["Elements can contain other elements","Close them in the reverse order you opened them"], code:"<p>My cat is <strong>very</strong> grumpy.</p>"}
    ]},
    {type:"code", title:"Your first web page", xp:100,
      context:"The editor on the right holds an HTML file, `index.html`. Click **Run Code** to render it in the **Browser** tab below the editor, or **Submit Answer** to render it and get feedback.\n\nHeadings are created with `<h1>` to `<h6>`, and paragraphs with `<p>`.",
      instr:["Add an `<h1>` heading with the text `Hello, world!`.","Below it, add a paragraph (`<p>`) that contains any text you like."],
      hint:"Write `<h1>Hello, world!</h1>` and then `<p>Your text here</p>`.",
      starter:"<!-- Add a heading -->\n\n\n<!-- Add a paragraph -->\n",
      solution:"<!-- Add a heading -->\n<h1>Hello, world!</h1>\n\n<!-- Add a paragraph -->\n<p>This is my first web page.</p>\n",
      check:(h)=>{
        h.need(h.q("h1"), "Add an `<h1>` element.");
        h.need(h.text("h1") === "Hello, world!", "The `<h1>` should say exactly `Hello, world!`.");
        h.need(h.q("p") && h.text("p").length > 0, "Add a `<p>` element with some text inside it.");
        h.need(h.q("h1").compareDocumentPosition(h.q("p")) & 4, "The paragraph should come after the heading.");
      }},
    {type:"code", title:"Heading levels", xp:100,
      context:"HTML has six heading levels. `<h1>` is the main title of the page; `<h2>` marks sections, `<h3>` subsections, and so on. Headings describe the outline of your page, so pick the level by meaning, not by how big you want the text to be.",
      instr:["Add an `<h2>` with the text `Ingredients` below the `<h1>`.","Add an `<h3>` with the text `For the dough` below the `<h2>`."],
      hint:"`<h2>Ingredients</h2>` then `<h3>For the dough</h3>`.",
      starter:"<h1>Pizza Margherita</h1>\n\n<!-- Add an h2 called Ingredients -->\n\n\n<!-- Add an h3 called For the dough -->\n",
      solution:"<h1>Pizza Margherita</h1>\n\n<!-- Add an h2 called Ingredients -->\n<h2>Ingredients</h2>\n\n<!-- Add an h3 called For the dough -->\n<h3>For the dough</h3>\n",
      check:(h)=>{
        h.need(h.text("h1") === "Pizza Margherita", "Keep the `<h1>` as it is.");
        h.need(h.text("h2") === "Ingredients", "Add an `<h2>` with the text `Ingredients`.");
        h.need(h.text("h3") === "For the dough", "Add an `<h3>` with the text `For the dough`.");
        h.need(h.q("h2").compareDocumentPosition(h.q("h3")) & 4, "The `<h3>` should come after the `<h2>`.");
      }},
    {type:"mcq", title:"Anatomy of an element",
      context:"Being able to name the parts of an element makes documentation much easier to read.",
      q:"In the element below, what is `href`?", code:"<a href=\"https://example.com\">Visit Example</a>",
      options:["A tag","An attribute","The element's content","A closing tag"], answer:1,
      fb:["The tag is `<a ...>`. `href` lives inside it.","Correct! `href` is an attribute that sets where the link points.","The content is `Visit Example`.","The closing tag is `</a>`."]},
    {type:"code", title:"Document structure", xp:100,
      context:"A complete HTML document has a standard skeleton:\n\n- `<!DOCTYPE html>` tells the browser to use modern standards mode.\n- `<html lang=\"en\">` wraps everything and declares the page's language.\n- `<head>` holds information about the page, such as `<meta charset=\"utf-8\">` and the `<title>` shown in the browser tab.\n- `<body>` holds everything visible on the page.",
      instr:["Start the file with `<!DOCTYPE html>`.","Add an `<html>` element with `lang=\"en\"` that wraps a `<head>` and a `<body>`.","In the head, add `<meta charset=\"utf-8\">` and a `<title>` of `My Page`.","Move the existing `<h1>` into the body."],
      hint:"Put the `<h1>` between `<body>` and `</body>`, and the `<title>` inside `<head>`.",
      starter:"<h1>Welcome to my page</h1>\n",
      solution:"<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome to my page</h1>\n  </body>\n</html>\n",
      check:(h,doc,code)=>{
        h.need(/^\s*<!doctype html>/i.test(code), "Start the file with `<!DOCTYPE html>`.");
        h.need(/<html[\s>]/i.test(code) && /<\/html>/i.test(code), "Wrap the document in `<html>` and `</html>`.");
        h.need(doc.documentElement.getAttribute("lang") === "en", "Add `lang=\"en\"` to the `<html>` tag.");
        h.need(/<head[\s>]/i.test(code) && /<body[\s>]/i.test(code), "Add both a `<head>` and a `<body>` element.");
        h.need(doc.querySelector("head meta[charset]") && /utf-8/i.test(doc.querySelector("head meta[charset]").getAttribute("charset")), "Add `<meta charset=\"utf-8\">` inside the head.");
        h.need(doc.title === "My Page", "Add `<title>My Page</title>` inside the head.");
        h.need(doc.querySelector("body > h1") && h.text("h1") === "Welcome to my page", "Put the `<h1>` inside the body.");
      }}
  ]},
  { title:"Text, Links and Images", desc:"Format text, build lists, link pages together and add images with useful alternative text.",
    lessons:[
    {type:"video", title:"Working with text", slides:[
      {h:"Paragraphs and line breaks", b:["<p> wraps a paragraph","Browsers collapse extra spaces and new lines","<br> forces a line break inside text"], code:"<p>Line one<br>Line two</p>"},
      {h:"Emphasis", b:["<strong>: strong importance, bold by default","<em>: stress emphasis, italic by default","Choose them for meaning, not just looks"], code:"<p>Do <strong>not</strong> touch the <em>red</em> button.</p>"},
      {h:"Lists", b:["<ul>: unordered list, bullets","<ol>: ordered list, numbers","Every item is an <li>"], code:"<ul>\n  <li>Flour</li>\n  <li>Water</li>\n</ul>"}
    ]},
    {type:"code", title:"Emphasis", xp:100,
      context:"`<strong>` marks text that is important, serious or urgent. `<em>` marks stress emphasis that changes the meaning of a sentence. Screen readers can announce both, so they carry meaning beyond bold and italic.",
      instr:["Wrap the word `never` in a `<strong>` element.","Wrap the word `really` in an `<em>` element."],
      hint:"`<strong>never</strong>` and `<em>really</em>`.",
      starter:"<p>You should never leave the oven on overnight.</p>\n<p>I really mean it.</p>\n",
      solution:"<p>You should <strong>never</strong> leave the oven on overnight.</p>\n<p>I <em>really</em> mean it.</p>\n",
      check:(h)=>{
        h.need(h.text("strong") === "never", "Wrap exactly the word `never` in `<strong>`.");
        h.need(h.text("em") === "really", "Wrap exactly the word `really` in `<em>`.");
        h.need(h.qa("p").length === 2, "Keep both paragraphs.");
      }},
    {type:"code", title:"Lists", xp:100,
      context:"Use an unordered list (`<ul>`) when order doesn't matter, like ingredients, and an ordered list (`<ol>`) when it does, like steps in a recipe. Each item goes in an `<li>`.",
      instr:["Under `Ingredients`, add an unordered list with three items: `Flour`, `Water` and `Salt`.","Under `Steps`, add an ordered list with two items: `Mix` and `Bake`."],
      hint:"`<ul><li>Flour</li>...</ul>` and `<ol><li>Mix</li><li>Bake</li></ol>`.",
      starter:"<h2>Ingredients</h2>\n\n\n<h2>Steps</h2>\n\n",
      solution:"<h2>Ingredients</h2>\n<ul>\n  <li>Flour</li>\n  <li>Water</li>\n  <li>Salt</li>\n</ul>\n\n<h2>Steps</h2>\n<ol>\n  <li>Mix</li>\n  <li>Bake</li>\n</ol>\n",
      check:(h)=>{
        h.need(h.q("ul"), "Add a `<ul>` for the ingredients.");
        h.need(h.qa("ul > li").map(e=>e.textContent.trim()).join("|") === "Flour|Water|Salt", "The `<ul>` should have three `<li>` items: Flour, Water, Salt.");
        h.need(h.q("ol"), "Add an `<ol>` for the steps.");
        h.need(h.qa("ol > li").map(e=>e.textContent.trim()).join("|") === "Mix|Bake", "The `<ol>` should have two `<li>` items: Mix, Bake.");
      }},
    {type:"video", title:"Links and images", slides:[
      {h:"Links", b:["<a> creates a hyperlink","href sets the destination","Absolute URLs include the domain, relative URLs point to files on the same site"], code:"<a href=\"https://developer.mozilla.org\">MDN</a>\n<a href=\"about.html\">About us</a>"},
      {h:"Opening in a new tab", b:["target=\"_blank\" opens the link in a new tab","Use it sparingly: let people choose"], code:"<a href=\"https://example.com\" target=\"_blank\">Example</a>"},
      {h:"Images", b:["<img> is an empty element","src: the image file","alt: a text alternative, read by screen readers and shown if the image fails to load"], code:"<img src=\"dog.jpg\" alt=\"A golden retriever catching a frisbee\">"}
    ]},
    {type:"code", title:"Links", xp:100,
      context:"Links are what make the web a web. An `<a>` element needs an `href` attribute that says where it goes, and link text that tells people what they'll find there. Avoid vague text like `click here`.",
      instr:["Turn the text `MDN Web Docs` into a link to `https://developer.mozilla.org`.","Make the link open in a new tab with `target=\"_blank\"`."],
      hint:"`<a href=\"https://developer.mozilla.org\" target=\"_blank\">MDN Web Docs</a>`.",
      starter:"<p>The best reference for HTML is MDN Web Docs.</p>\n",
      solution:"<p>The best reference for HTML is <a href=\"https://developer.mozilla.org\" target=\"_blank\">MDN Web Docs</a>.</p>\n",
      check:(h)=>{
        const a = h.q("a");
        h.need(a, "Add an `<a>` element.");
        h.need(/^https:\/\/developer\.mozilla\.org\/?$/.test(a.getAttribute("href") || ""), "Set `href` to `https://developer.mozilla.org`.");
        h.need(a.textContent.trim() === "MDN Web Docs", "The link text should be `MDN Web Docs`.");
        h.need(a.getAttribute("target") === "_blank", "Add `target=\"_blank\"` to the link.");
      }},
    {type:"code", title:"Images and alt text", xp:100,
      context:"The image file `cat.jpg` doesn't exist in this exercise, which is useful: when an image can't load, the browser shows its `alt` text instead. Good alt text describes what the image shows, so people who can't see it get the same information.",
      instr:["Add an `<img>` with `src=\"cat.jpg\"`.","Give it an `alt` attribute that describes the image, for example `A cat asleep on a keyboard`.","Run the code and look at the Browser tab: the alt text appears in place of the image."],
      hint:"`<img src=\"cat.jpg\" alt=\"A cat asleep on a keyboard\">`. Images don't have a closing tag.",
      starter:"<h1>My cat</h1>\n\n<!-- Add an image -->\n",
      solution:"<h1>My cat</h1>\n\n<!-- Add an image -->\n<img src=\"cat.jpg\" alt=\"A cat asleep on a keyboard\">\n",
      check:(h)=>{
        const img = h.q("img");
        h.need(img, "Add an `<img>` element.");
        h.need(img.getAttribute("src") === "cat.jpg", "Set `src=\"cat.jpg\"`.");
        h.need((img.getAttribute("alt") || "").trim().length >= 5, "Add an `alt` attribute that describes the image.");
      }},
    {type:"mcq", title:"Alternative text",
      context:"Accessibility is part of writing correct HTML, not an extra.",
      q:"An image is purely decorative and adds no information. What should its `alt` attribute be?",
      options:["Leave out the alt attribute","alt=\"image\"","alt=\"\" (empty)","alt=\"decorative image of a swirl\""], answer:2,
      fb:["Without alt, screen readers may read out the file name.","\"image\" adds noise without information.","Correct! An empty alt tells assistive technology to skip the image.","Describing a decoration makes screen reader users listen to something meaningless."]}
  ]},
  { title:"Page Structure and Semantics", desc:"Organize pages with semantic elements, group content, and present data in tables.",
    lessons:[
    {type:"video", title:"Semantic HTML", slides:[
      {h:"Generic containers", b:["<div>: a block-level box with no meaning","<span>: an inline container with no meaning","Useful for styling, but they say nothing about content"]},
      {h:"Semantic elements", b:["<header>: introductory content or navigation","<nav>: a block of navigation links","<main>: the main content, once per page","<article>, <section>: self-contained content and thematic groups","<footer>: footer of a page or section"]},
      {h:"Why semantics matter", b:["Screen readers let people jump between landmarks","Search engines understand your page better","Your code is easier to read"], code:"<header>...</header>\n<nav>...</nav>\n<main>...</main>\n<footer>...</footer>"}
    ]},
    {type:"code", title:"Semantic layout", xp:100,
      context:"The page on the right is built only from `<div>` elements. Replace them with semantic elements so assistive technology and search engines understand the layout.",
      instr:["Replace the first `<div>` with `<header>`.","Replace the `<div>` holding the links with `<nav>`.","Replace the `<div>` holding the article with `<main>`.","Replace the last `<div>` with `<footer>`. Remember to change the closing tags too."],
      hint:"Change both `<div>` and `</div>` for each block, for example `<header>` ... `</header>`.",
      starter:"<div>\n  <h1>The Daily Loaf</h1>\n</div>\n<div>\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Recipes</a>\n</div>\n<div>\n  <h2>Why sourdough rises</h2>\n  <p>Wild yeast and bacteria produce gas as they feed.</p>\n</div>\n<div>\n  <p>Baked fresh daily.</p>\n</div>\n",
      solution:"<header>\n  <h1>The Daily Loaf</h1>\n</header>\n<nav>\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Recipes</a>\n</nav>\n<main>\n  <h2>Why sourdough rises</h2>\n  <p>Wild yeast and bacteria produce gas as they feed.</p>\n</main>\n<footer>\n  <p>Baked fresh daily.</p>\n</footer>\n",
      check:(h)=>{
        h.need(h.q("header h1"), "Wrap the `<h1>` in a `<header>`.");
        h.need(h.qa("nav a").length === 2, "Wrap the two links in a `<nav>`.");
        h.need(h.q("main h2") && h.q("main p"), "Wrap the article heading and paragraph in `<main>`.");
        h.need(h.q("footer p"), "Wrap the last paragraph in a `<footer>`.");
        h.need(h.qa("div").length === 0, "Replace every `<div>` with a semantic element.");
      }},
    {type:"code", title:"Tables", xp:100,
      context:"Tables are for tabular data: information with rows and columns. A table is built from rows (`<tr>`), header cells (`<th>`) and data cells (`<td>`). Header rows go in `<thead>` and the data in `<tbody>`.",
      instr:["Add a `<thead>` row with two header cells: `City` and `Population`.","Add a `<tbody>` with two rows: `Tokyo` with `37 million`, and `Delhi` with `33 million`."],
      hint:"`<thead><tr><th>City</th><th>Population</th></tr></thead>`, then one `<tr>` with two `<td>` per city inside `<tbody>`.",
      starter:"<table>\n  <!-- Header row -->\n\n  <!-- Data rows -->\n\n</table>\n",
      solution:"<table>\n  <!-- Header row -->\n  <thead>\n    <tr><th>City</th><th>Population</th></tr>\n  </thead>\n  <!-- Data rows -->\n  <tbody>\n    <tr><td>Tokyo</td><td>37 million</td></tr>\n    <tr><td>Delhi</td><td>33 million</td></tr>\n  </tbody>\n</table>\n",
      check:(h)=>{
        h.need(/<thead[\s>]/i.test(h.code), "Add a `<thead>` element.");
        h.need(h.qa("thead th").map(e=>e.textContent.trim()).join("|") === "City|Population", "The header row should have `<th>` cells `City` and `Population`.");
        h.need(/<tbody[\s>]/i.test(h.code), "Put the data rows in a `<tbody>`.");
        const rows = h.qa("tbody tr").map(r => [...r.querySelectorAll("td")].map(c=>c.textContent.trim()).join("|"));
        h.need(rows.length === 2, "Add exactly two data rows.");
        h.need(rows[0] === "Tokyo|37 million" && rows[1] === "Delhi|33 million", "Check the text in your data cells: Tokyo, 37 million, then Delhi, 33 million.");
      }},
    {type:"mcq", title:"Choosing an element",
      context:"Picking the most specific element helps everyone who reads your page.",
      q:"Which element best wraps a group of links to the main sections of a site?",
      options:["<div>","<section>","<nav>","<ul> on its own"], answer:2,
      fb:["A div works, but tells nobody what it contains.","Section is for a thematic group of content, not navigation.","Correct! nav marks a major block of navigation links.","Lists are often used inside nav, but on their own they don't mark it as navigation."]}
  ]},
  { title:"Forms", desc:"Collect input from people with accessible forms: labels, input types, choices and buttons.",
    lessons:[
    {type:"video", title:"Building forms", slides:[
      {h:"The form element", b:["<form> groups inputs that are submitted together","action: where the data goes; method: GET or POST"], code:"<form action=\"/signup\" method=\"post\">\n  ...\n</form>"},
      {h:"Labels and inputs", b:["Every input needs a label","Connect them: the label's for matches the input's id","Clicking the label focuses the input"], code:"<label for=\"email\">Email</label>\n<input type=\"email\" id=\"email\" name=\"email\">"},
      {h:"Input types and validation", b:["type=\"email\", \"number\", \"date\", \"password\" and more","required makes a field mandatory","The browser checks the format before submitting"], code:"<input type=\"email\" id=\"email\" name=\"email\" required>"},
      {h:"Choices and buttons", b:["<select> with <option> for drop-downs","type=\"radio\" with a shared name for one-of-many","<button type=\"submit\"> sends the form"]}
    ]},
    {type:"code", title:"A signup form", xp:100,
      context:"A label is connected to its input when the label's `for` attribute matches the input's `id`. This lets screen readers announce the label, and makes the label clickable.",
      instr:["Inside the form, add a `<label>` with the text `Email` and `for=\"email\"`.","Add an `<input>` with `type=\"email\"`, `id=\"email\"`, `name=\"email\"` and the `required` attribute.","Add a `<button>` with `type=\"submit\"` and the text `Sign up`."],
      hint:"`<label for=\"email\">Email</label>`, then `<input type=\"email\" id=\"email\" name=\"email\" required>`.",
      starter:"<form>\n  <!-- Label -->\n\n  <!-- Email input -->\n\n  <!-- Submit button -->\n\n</form>\n",
      solution:"<form>\n  <!-- Label -->\n  <label for=\"email\">Email</label>\n  <!-- Email input -->\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n  <!-- Submit button -->\n  <button type=\"submit\">Sign up</button>\n</form>\n",
      check:(h)=>{
        const lab = h.q("form label"), inp = h.q("form input");
        h.need(lab && lab.textContent.trim() === "Email", "Add a `<label>` with the text `Email` inside the form.");
        h.need(inp, "Add an `<input>` inside the form.");
        h.need(inp.getAttribute("type") === "email", "Set `type=\"email\"` on the input.");
        h.need(inp.id === "email" && inp.getAttribute("name") === "email", "Give the input `id=\"email\"` and `name=\"email\"`.");
        h.need(lab.getAttribute("for") === "email", "Connect the label with `for=\"email\"`.");
        h.need(inp.hasAttribute("required"), "Add the `required` attribute to the input.");
        const b = h.q("form button");
        h.need(b && b.getAttribute("type") === "submit" && b.textContent.trim() === "Sign up", "Add `<button type=\"submit\">Sign up</button>`.");
      }},
    {type:"code", title:"Drop-downs and radio buttons", xp:100,
      context:"A `<select>` holds `<option>` elements. Each option's `value` is what gets submitted. Radio buttons that share a `name` form a group where only one can be selected.",
      instr:["Add a `<select>` with `id=\"size\"` and `name=\"size\"` containing three options with the values `small`, `medium` and `large`.","Add two radio inputs with `name=\"crust\"`: one with `value=\"thin\"` and one with `value=\"thick\"`. Give each its own label."],
      hint:"`<input type=\"radio\" id=\"thin\" name=\"crust\" value=\"thin\"> <label for=\"thin\">Thin</label>`.",
      starter:"<form>\n  <label for=\"size\">Size</label>\n  <!-- Add the select -->\n\n\n  <p>Crust</p>\n  <!-- Add two radio buttons -->\n\n</form>\n",
      solution:"<form>\n  <label for=\"size\">Size</label>\n  <!-- Add the select -->\n  <select id=\"size\" name=\"size\">\n    <option value=\"small\">Small</option>\n    <option value=\"medium\">Medium</option>\n    <option value=\"large\">Large</option>\n  </select>\n\n  <p>Crust</p>\n  <!-- Add two radio buttons -->\n  <input type=\"radio\" id=\"thin\" name=\"crust\" value=\"thin\">\n  <label for=\"thin\">Thin</label>\n  <input type=\"radio\" id=\"thick\" name=\"crust\" value=\"thick\">\n  <label for=\"thick\">Thick</label>\n</form>\n",
      check:(h)=>{
        const s = h.q("select");
        h.need(s, "Add a `<select>` element.");
        h.need(s.id === "size" && s.getAttribute("name") === "size", "Give the select `id=\"size\"` and `name=\"size\"`.");
        h.need([...s.querySelectorAll("option")].map(o=>o.value).join("|") === "small|medium|large", "Add three options with the values `small`, `medium` and `large`.");
        const r = h.qa("input[type=radio]");
        h.need(r.length === 2, "Add two inputs with `type=\"radio\"`.");
        h.need(r.every(x => x.getAttribute("name") === "crust"), "Give both radio buttons `name=\"crust\"`.");
        h.need(r.map(x=>x.value).sort().join("|") === "thick|thin", "Use the values `thin` and `thick`.");
        h.need(r.every(x => x.id && h.q(`label[for="${x.id}"]`)), "Give each radio button an `id` and a label whose `for` matches it.");
      }},
    {type:"mcq", title:"Connecting labels",
      context:"Labels are one of the easiest accessibility wins in HTML.",
      q:"Which attribute pair connects a `<label>` to an `<input>`?",
      options:["label name and input name","label for and input id","label id and input for","label href and input id"], answer:1,
      fb:["name is what the form submits, it doesn't connect labels.","Correct! The label's for must match the input's id.","It's the other way round.","Labels don't have an href."]}
  ]},
  { title:"Styling with CSS", desc:"Make your pages look good with CSS: selectors, colors, classes, the box model and flexbox layouts.",
    lessons:[
    {type:"video", title:"Introduction to CSS", slides:[
      {h:"CSS", b:["Cascading Style Sheets","Describes how HTML elements are displayed","Put it in a <style> element in the head, or a separate .css file"]},
      {h:"Rules", b:["A selector picks elements","Declarations set property: value pairs"], code:"<style>\n  h1 {\n    color: #2457f5;\n    font-size: 40px;\n  }\n</style>"},
      {h:"Selectors", b:["Type: p selects every paragraph","Class: .note selects class=\"note\"","ID: #intro selects id=\"intro\"","Classes can be reused, IDs must be unique"], code:".note { background: #fff7d6; }\n#intro { font-weight: bold; }"},
      {h:"The cascade", b:["When rules conflict, the more specific selector wins","IDs beat classes, classes beat element types","With equal specificity, the later rule wins"]}
    ]},
    {type:"code", title:"Your first CSS rule", xp:100,
      context:"CSS colors can be written as names (`red`), hex codes (`#2457f5`) or `rgb()` values. Font sizes are commonly written in pixels (`px`) or `rem`.",
      instr:["Inside the `<style>` element, write a rule for `h1` that sets `color` to `#2457f5`.","In the same rule, set `font-size` to `48px`."],
      hint:"`h1 { color: #2457f5; font-size: 48px; }`",
      starter:"<style>\n  /* Style the h1 here */\n\n</style>\n\n<h1>Styled heading</h1>\n<p>This paragraph keeps the default style.</p>\n",
      solution:"<style>\n  /* Style the h1 here */\n  h1 {\n    color: #2457f5;\n    font-size: 48px;\n  }\n</style>\n\n<h1>Styled heading</h1>\n<p>This paragraph keeps the default style.</p>\n",
      check:(h)=>{
        h.need(h.css("h1","color") === h.rgb("#2457f5"), "Set the `h1` color to `#2457f5`.");
        h.need(h.css("h1","font-size") === "48px", "Set the `h1` font-size to `48px`.");
        h.need(h.css("p","color") !== h.rgb("#2457f5"), "Only style the `h1`, not the paragraph.");
      }},
    {type:"code", title:"Classes", xp:100,
      context:"A class lets you style some elements but not others. Add `class=\"name\"` to the elements in HTML, and select them with `.name` in CSS. One element can have several classes, separated by spaces.",
      instr:["Add `class=\"highlight\"` to the second paragraph only.","Write a CSS rule for `.highlight` that sets `background-color` to `#fff3bf`."],
      hint:"In CSS: `.highlight { background-color: #fff3bf; }`. In HTML: `<p class=\"highlight\">`.",
      starter:"<style>\n  /* Add a .highlight rule */\n\n</style>\n\n<p>Preheat the oven to 250°C.</p>\n<p>Don't open the oven door during the first 10 minutes.</p>\n<p>Let the bread cool before slicing.</p>\n",
      solution:"<style>\n  /* Add a .highlight rule */\n  .highlight {\n    background-color: #fff3bf;\n  }\n</style>\n\n<p>Preheat the oven to 250°C.</p>\n<p class=\"highlight\">Don't open the oven door during the first 10 minutes.</p>\n<p>Let the bread cool before slicing.</p>\n",
      check:(h)=>{
        const ps = h.qa("p");
        h.need(ps.length === 3, "Keep all three paragraphs.");
        h.need(ps[1].classList.contains("highlight"), "Add `class=\"highlight\"` to the second paragraph.");
        h.need(!ps[0].classList.contains("highlight") && !ps[2].classList.contains("highlight"), "Only the second paragraph should have the class.");
        h.need(h.css(ps[1],"background-color") === h.rgb("#fff3bf"), "Set `background-color: #fff3bf` in a `.highlight` rule.");
      }},
    {type:"video", title:"The box model and layout", slides:[
      {h:"The box model", b:["Every element is a box","content, then padding, then border, then margin","padding is space inside the border, margin is space outside it"], code:".card {\n  padding: 16px;\n  border: 1px solid #ddd;\n  margin: 24px;\n}"},
      {h:"Flexbox", b:["display: flex on a parent lays its children out in a row","gap sets the space between them","justify-content and align-items control alignment"], code:".row {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n}"},
      {h:"Units", b:["px: fixed pixels","rem: relative to the root font size","%: relative to the parent"]}
    ]},
    {type:"code", title:"The box model", xp:100,
      context:"The `.card` below has no spacing, so its text touches the edges. Use padding for space inside the border and margin for space outside it.",
      instr:["Give `.card` a `padding` of `20px`.","Give it a `border` of `2px solid #d0d7e2`.","Give it a `margin` of `30px`."],
      hint:"Add three declarations inside the `.card { }` rule.",
      starter:"<style>\n  .card {\n    background: #ffffff;\n    /* Add padding, border and margin */\n\n  }\n</style>\n\n<div class=\"card\">\n  <h2>Sourdough</h2>\n  <p>Flour, water, salt and time.</p>\n</div>\n",
      solution:"<style>\n  .card {\n    background: #ffffff;\n    /* Add padding, border and margin */\n    padding: 20px;\n    border: 2px solid #d0d7e2;\n    margin: 30px;\n  }\n</style>\n\n<div class=\"card\">\n  <h2>Sourdough</h2>\n  <p>Flour, water, salt and time.</p>\n</div>\n",
      check:(h)=>{
        h.need(h.css(".card","padding-top") === "20px" && h.css(".card","padding-left") === "20px", "Set `padding: 20px` on `.card`.");
        h.need(h.css(".card","border-top-width") === "2px" && h.css(".card","border-top-style") === "solid" && h.css(".card","border-top-color") === h.rgb("#d0d7e2"), "Set `border: 2px solid #d0d7e2` on `.card`.");
        h.need(h.css(".card","margin-top") === "30px" && h.css(".card","margin-left") === "30px", "Set `margin: 30px` on `.card`.");
      }},
    {type:"code", title:"Flexbox", xp:100,
      context:"By default, block elements stack vertically. Setting `display: flex` on a parent turns its children into flex items laid out in a row. `gap` adds space between them.",
      instr:["Make `.menu` a flex container with `display: flex`.","Add a `gap` of `16px` between the items.","Center the items vertically with `align-items: center`."],
      hint:"`.menu { display: flex; gap: 16px; align-items: center; }`",
      starter:"<style>\n  .menu {\n    /* Turn this into a flex row */\n\n  }\n  .menu a {\n    padding: 8px 12px;\n    background: #eef3ff;\n  }\n</style>\n\n<nav class=\"menu\">\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Recipes</a>\n  <a href=\"#\">About</a>\n</nav>\n",
      solution:"<style>\n  .menu {\n    /* Turn this into a flex row */\n    display: flex;\n    gap: 16px;\n    align-items: center;\n  }\n  .menu a {\n    padding: 8px 12px;\n    background: #eef3ff;\n  }\n</style>\n\n<nav class=\"menu\">\n  <a href=\"#\">Home</a>\n  <a href=\"#\">Recipes</a>\n  <a href=\"#\">About</a>\n</nav>\n",
      check:(h)=>{
        h.need(h.css(".menu","display") === "flex", "Set `display: flex` on `.menu`.");
        h.need(h.css(".menu","column-gap") === "16px", "Set `gap: 16px` on `.menu`.");
        h.need(h.css(".menu","align-items") === "center", "Set `align-items: center` on `.menu`.");
      }},
    {type:"mcq", title:"Specificity",
      context:"When two rules target the same element, the browser uses specificity to decide which one wins.",
      q:"Which color will the paragraph be?", code:"<style>\n  #intro { color: green; }\n  .lead { color: red; }\n  p { color: blue; }\n</style>\n<p id=\"intro\" class=\"lead\">Hello</p>",
      options:["blue","red","green","black"], answer:2,
      fb:["Type selectors are the least specific.","Class selectors lose to ID selectors.","Correct! The ID selector is the most specific, so it wins.","All three rules match, so the default color doesn't apply."]}
  ]}
  ],
  practice:[
    {q:"Which element creates the largest heading?", options:["<heading>","<h6>","<h1>","<head>"], answer:2},
    {q:"Which tag creates a line break?", options:["<lb>","<br>","<break>","<newline>"], answer:1},
    {q:"Where does the `<title>` element belong?", options:["In the body","In the head","Inside an h1","In the footer"], answer:1},
    {q:"Which CSS selector targets elements with `class=\"card\"`?", options:["#card","card",".card","*card"], answer:2},
    {q:"Which property adds space inside an element's border?", options:["margin","padding","gap","spacing"], answer:1},
    {q:"Which input type makes the browser check for an @ sign?", options:["type=\"text\"","type=\"mail\"","type=\"email\"","type=\"at\""], answer:2}
  ]
});
TRACKS.push({id:"web-foundations", title:"Web Foundations", desc:"Learn to build and style web pages with HTML and CSS.", courses:["intro-html"]});
