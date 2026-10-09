/* =====================================================
   MyALove · lógica de la web
   Lee ajustes de config.js y productos de data/products.json
   ===================================================== */
(function () {
  "use strict";
  var CFG = window.MYALOVE || {};
  CFG.social = CFG.social || {}; CFG.extras = CFG.extras || {}; CFG.colors = CFG.colors || [];
  var $ = function (s) { return document.querySelector(s); };
  var products = [];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades ---------- */
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 5000);
  }
  function money(n) { return CFG.currency + " " + Number(n).toFixed(2).replace(/\.00$/, ""); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.textContent = html;
    return e;
  }
  function find(id) { return products.filter(function (p) { return p.id === id; })[0]; }

  /* ---------- menú móvil ---------- */
  var burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  /* ---------- aparición suave ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: .15 });
    revealEls.forEach(function (n) { io.observe(n); });
  } else { revealEls.forEach(function (n) { n.classList.add("in"); }); }

  /* ---------- pétalos flotantes (pocos y suaves) ---------- */
  if (!reduced) {
    var box = $("#petals"), count = window.innerWidth < 700 ? 5 : 9;
    for (var i = 0; i < count; i++) {
      var p = el("span", { "class": "petal" });
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 14 + Math.random() * 12 + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      p.style.transform = "scale(" + (0.7 + Math.random() * 0.8) + ")";
      box.appendChild(p);
    }
  }

  /* ---------- ramo 3D: reacciona al cursor ---------- */
  var stage = $("#stage"), tilt = $("#tilt");
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "rotateY(" + (x * 20) + "deg) rotateX(" + (-y * 14) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
  }

  /* ---------- Spline (solo si pones la URL en config.js) ---------- */
  if (CFG.splineUrl && /^https:\/\//.test(CFG.splineUrl)) {
    var s = document.createElement("script");
    s.type = "module";
    // Si Spline te da otra versión en su opción Export > Viewer, cámbiala aquí.
    s.src = "https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js";
    s.onload = function () {
      var v = document.createElement("spline-viewer");
      v.setAttribute("url", CFG.splineUrl);
      v.setAttribute("loading-anim-type", "spinner-small-light");
      v.addEventListener("load-complete", function () {
        stage.classList.add("has-spline");
        tilt.style.transform = "";
        var fb = $("#heroFallback"); if (fb) fb.style.display = "none";
      });
      tilt.appendChild(v);
    };
    document.head.appendChild(s); // si falla, la imagen provisional sigue visible
  }

  /* ---------- WhatsApp ---------- */
  function waReady() { return /^\d{8,15}$/.test(String(CFG.whatsappNumber || "")); }
  function openWa(text) {
    if (!waReady()) { toast("Falta configurar el número de WhatsApp en js/config.js"); return; }
    var url = "https://wa.me/" + CFG.whatsappNumber + "?text=" + encodeURIComponent(text);
    // Copia el mensaje por si WhatsApp no lo carga: así no se pierde.
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
    var w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    toast("Abriendo WhatsApp. Copiamos tu mensaje por si lo necesitas pegar.");
  }
  function buildMessage(d) {
    var L = ["Hola, MyALove. 💗 Quisiera consultar por este ramo:", ""];
    L.push("* Modelo: " + d.model);
    if (d.colors) L.push("* Colores: " + d.colors);
    if (d.qty) L.push("* Cantidad: " + d.qty + " flores");
    if (d.led != null) L.push("* Luces LED: " + (d.led ? "sí" : "no"));
    if (d.plush != null) L.push("* Peluche: " + (d.plush ? "sí" : "no"));
    if (d.card != null) L.push("* Tarjeta: " + (d.card ? "sí" : "no"));
    if (d.note) L.push("* Dedicatoria: " + d.note);
    if (d.date) L.push("* Fecha deseada: " + d.date);
    L.push("", "¿Podrían confirmarme el precio final y la disponibilidad?");
    return L.join("\n");
  }

  /* ---------- catálogo ---------- */
  var WA_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.7.8 2 1 .3.1.5.2.5.3.1.1.1.6-.1 1.2z"/></svg>';
  function priceText(p) { return (p.price == null || p.price === "") ? "Precio por definir" : "Desde " + money(p.price); }
  function goCustomize(p) {
    $("#fModel").value = p.id; onModelChange(); update();
    $("#personaliza").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  function waProduct(p) { openWa(buildMessage({ model: p.name })); }
  function productImg(p) {
    return el("img", { src: p.image, alt: p.name + ": ramo artesanal de flores de limpiapipas", loading: "lazy", width: 400, height: 480 });
  }

  function renderCatalog() {
    var list = products.filter(function (p) { return p.available !== false; });
    var grid = $("#productGrid"), feat = $("#featuredGrid");
    grid.textContent = ""; feat.textContent = "";
    if (!list.length) { grid.appendChild(el("p", { "class": "muted" }, "Pronto tendremos nuevos ramos.")); return; }

    /* Destacados: los que tengan "featured": true (o los 3 primeros) */
    var fl = list.filter(function (p) { return p.featured; });
    if (!fl.length) fl = list.slice(0, 3);
    fl.slice(0, 3).forEach(function (p) {
      var a = el("article", { "class": "feat" });
      var im = el("div", { "class": "feat__img" }); im.appendChild(productImg(p));
      a.appendChild(im);
      a.appendChild(el("h3", {}, p.name));
      a.appendChild(el("p", { "class": "feat__price" }, priceText(p)));
      var row = el("div", { "class": "feat__btns" });
      var b1 = el("button", { "class": "btn btn--small", type: "button" }, "Personalizar");
      b1.addEventListener("click", function () { goCustomize(p); });
      var b2 = el("button", { "class": "circle circle--coral", type: "button", "aria-label": "Pedir por WhatsApp: " + p.name });
      b2.innerHTML = WA_ICON; b2.addEventListener("click", function () { waProduct(p); });
      row.appendChild(b1); row.appendChild(b2); a.appendChild(row); feat.appendChild(a);
    });

    initCollection(list);
  }

  /* ---------- colección: carrusel + categorías + búsqueda ---------- */
  var coll = [], state = { cat: "Todos", flower: "Todas", q: "" };
  function norm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  function buildArch(p) {
    var a = el("article", { "class": "arch" });
    var media = el("div", { "class": "arch__media" });
    media.appendChild(productImg(p));
    var body = el("div", { "class": "arch__body" });
    body.appendChild(el("h3", {}, p.name));
    body.appendChild(el("p", {}, p.description));
    if ((p.includes || []).length) {
      body.appendChild(el("p", { "class": "incl__t" }, "Incluye:"));
      var inc = el("ul", { "class": "incl" });
      p.includes.forEach(function (x) { inc.appendChild(el("li", {}, x)); });
      body.appendChild(inc);
    }
    var tags = el("ul", { "class": "tags" });
    if (p.theme) tags.appendChild(el("li", {}, "Tema: " + p.theme));
    if ((p.quantities || []).length) tags.appendChild(el("li", {}, p.quantities.join(" · ") + " flores"));
    if (p.allowLed) tags.appendChild(el("li", {}, "Luces LED"));
    if (p.allowPlush) tags.appendChild(el("li", {}, "Peluche"));
    if (p.allowCard) tags.appendChild(el("li", {}, "Tarjeta"));
    body.appendChild(tags);
    body.appendChild(el("p", { "class": "arch__price" }, priceText(p)));
    var btns = el("div", { "class": "arch__btns" });
    var c1 = el("button", { "class": "btn btn--small", type: "button" }, "Personalizar");
    c1.addEventListener("click", function () { goCustomize(p); });
    var c2 = el("button", { "class": "btn btn--ghost btn--small", type: "button" }, "Pedir por WhatsApp");
    c2.addEventListener("click", function () { waProduct(p); });
    btns.appendChild(c1); btns.appendChild(c2); body.appendChild(btns);
    a.appendChild(media); a.appendChild(body);
    return a;
  }

  function renderCollection() {
    var track = $("#productGrid"); track.textContent = "";
    var shown = coll.filter(function (p) {
      var okCat = state.cat === "Todos" || (p.categories || []).indexOf(state.cat) > -1;
      var okFlor = state.flower === "Todas" || (p.flowers || []).indexOf(state.flower) > -1;
      var hay = norm([p.name, p.description, p.theme, (p.categories || []).join(" "), (p.flowers || []).join(" ")].join(" "));
      return okCat && okFlor && (!state.q || hay.indexOf(state.q) > -1);
    });
    if (!shown.length) {
      var msg = "No encontramos ramos con ese filtro. Prueba con otra categoría, flor o palabra.";
      if (!state.q) {
        if (state.cat !== "Todos" && state.flower === "Todas") msg = "Pronto tendremos ramos en «" + state.cat + "».";
        else if (state.flower !== "Todas" && state.cat === "Todos") msg = "Pronto tendremos ramos con " + state.flower.toLowerCase() + ".";
      }
      track.appendChild(el("p", { "class": "muted" }, msg));
    }
    shown.forEach(function (p) { track.appendChild(buildArch(p)); });
    track.scrollLeft = 0;
    $("#catCount").textContent = shown.length + (shown.length === 1 ? " ramo" : " ramos");
  }

  /* Filtros: siempre se muestran las categorías de config.js (aunque aún no tengan ramos) */
  function buildFilters() {
    var order = (currentSeason ? [currentSeason.nombre] : []).concat(CFG.categoryOrder || []), seen = order.slice();
    coll.forEach(function (p) { (p.categories || []).forEach(function (c) { if (seen.indexOf(c) < 0) seen.push(c); }); });
    if (currentSeason && !coll.some(function (p) { return (p.categories || []).indexOf(currentSeason.nombre) > -1; })) {
      seen.splice(seen.indexOf(currentSeason.nombre), 1);
    }
    if (seen.indexOf(state.cat) < 0) state.cat = "Todos";
    var box = $("#catFilters"); box.textContent = "";
    ["Todos"].concat(seen).forEach(function (c) {
      var b = el("button", { type: "button", "class": "fchip", "aria-pressed": c === state.cat ? "true" : "false" }, c);
      b.addEventListener("click", function () {
        state.cat = c;
        box.querySelectorAll(".fchip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderCollection();
      });
      box.appendChild(b);
    });
  }

  function buildFlowerFilters() {
    var seen = (CFG.flowerOrder || []).slice();
    coll.forEach(function (p) { (p.flowers || []).forEach(function (f) { if (seen.indexOf(f) < 0) seen.push(f); }); });
    var box = $("#flowerFilters"); box.textContent = "";
    ["Todas"].concat(seen).forEach(function (f) {
      var b = el("button", { type: "button", "class": "fchip", "aria-pressed": f === state.flower ? "true" : "false" }, f);
      b.addEventListener("click", function () {
        state.flower = f;
        box.querySelectorAll(".fchip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderCollection();
      });
      box.appendChild(b);
    });
  }

  function initCollection(list) {
    coll = list;
    $("#catSearch").addEventListener("input", function (e) { state.q = norm(e.target.value.trim()); renderCollection(); });
    var track = $("#productGrid");
    function step(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduced ? "auto" : "smooth" }); }
    $("#carPrev").addEventListener("click", function () { step(-1); });
    $("#carNext").addEventListener("click", function () { step(1); });
    var tg = $("#gridToggle");
    tg.addEventListener("click", function () {
      var on = $("#carousel").classList.toggle("is-grid");
      tg.setAttribute("aria-pressed", on); tg.textContent = on ? "Ver como carrusel" : "Ver todo en cuadrícula";
    });
    buildFilters(); buildFlowerFilters(); renderCollection();
  }

  /* ---------- temática del mes ---------- */
  var seasonData = null, currentSeason = null;
  var THEME_VARS = { color: "--coral", colorSuave: "--coral-soft", rosa: "--pink", rosa2: "--pink2", fondo: "--bg",
    heroA: "--hero-a", heroB: "--hero-b", blob1: "--blob1", blob2: "--blob2", footer: "--deep", textoTitulo: "--title" };

  function inRange(s) {
    var d = new Date(), md = ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    if (!s.desde || !s.hasta) return false;
    return s.desde <= s.hasta ? (md >= s.desde && md <= s.hasta) : (md >= s.desde || md <= s.hasta);
  }
  function pickSeason(id) {
    if (!seasonData || !seasonData.temporadas) return null;
    var list = seasonData.temporadas, want = id || seasonData.activa || "ninguna";
    if (want === "ninguna") return null;
    if (want === "auto") return list.filter(inRange)[0] || null;
    return list.filter(function (s) { return s.id === want; })[0] || null;
  }
  function applySeason(s) {
    currentSeason = s;
    var root = document.documentElement.style;
    Object.keys(THEME_VARS).forEach(function (k) {
      if (s && s[k]) root.setProperty(THEME_VARS[k], s[k]); else root.removeProperty(THEME_VARS[k]);
    });
    if (s && s.textoTitulo) root.setProperty("--navy", s.textoTitulo); else root.removeProperty("--navy");

    var bar = $("#seasonBar");
    if (s && s.banner) {
      bar.textContent = (s.emoji ? s.emoji + " " : "") + s.banner;
      var lk = el("a", { href: "#temporada" }, "Ver temática"); bar.appendChild(lk); bar.hidden = false;
    } else { bar.hidden = true; bar.textContent = ""; }

    var eb = $("#heroEyebrow"); if (!eb.dataset.base) eb.dataset.base = eb.textContent;
    eb.textContent = (s && s.eyebrow) ? s.eyebrow : eb.dataset.base;
    var hero = $("#heroFallback");
    if (hero) { if (!hero.dataset.base) hero.dataset.base = hero.getAttribute("src"); hero.src = (s && s.imagenHero) ? s.imagenHero : hero.dataset.base; }

    /* Los ramos marcados con esta temática reciben una categoría extra con su nombre */
    coll.forEach(function (p) {
      if (!p._cats) p._cats = (p.categories || []).slice();
      p.categories = p._cats.slice();
      if (s && (p.seasons || []).indexOf(s.id) > -1) p.categories.unshift(s.nombre);
    });
    renderSeasonSection(s);
    if (coll.length) { buildFilters(); renderCollection(); }
  }
  function renderSeasonSection(s) {
    var sec = $("#temporada"), grid = $("#seasonGrid"); grid.textContent = "";
    var items = s ? coll.filter(function (p) { return (p.seasons || []).indexOf(s.id) > -1; }) : [];
    if (!s || !items.length) { sec.hidden = true; return; }
    $("#seasonKicker").textContent = "Temática del mes";
    $("#seasonTitle").textContent = (s.emoji ? s.emoji + " " : "") + (s.titulo || s.nombre);
    $("#seasonDesc").textContent = s.descripcion || "";
    items.forEach(function (p) { grid.appendChild(buildArch(p)); });
    sec.hidden = false;
  }
  /* Para probar: tu-web/?tema=navidad   (o desde la consola: MyALoveTheme.apply("halloween")) */
  window.MyALoveTheme = { apply: function (id) { applySeason(pickSeason(id)); }, list: function () { return seasonData; } };

  /* ---------- personalizador ---------- */
  var F = {};
  function initCustomizer() {
    ["Model", "Main", "Secondary", "Qty", "Led", "Plush", "Card", "Note", "Date"].forEach(function (k) { F[k] = $("#f" + k); });
    var list = products.filter(function (p) { return p.available !== false; });
    list.forEach(function (p) { F.Model.appendChild(el("option", { value: p.id }, p.name)); });
    CFG.colors.forEach(function (c) { F.Main.appendChild(el("option", { value: c.name }, c.name)); });
    CFG.colors.forEach(function (c) {
      var lab = el("label", { "class": "chip" });
      var inp = el("input", { type: "checkbox", value: c.name });
      var sp = el("span"); var dot = el("i"); dot.style.background = c.hex; dot.setAttribute("aria-hidden", "true");
      sp.appendChild(dot); sp.appendChild(document.createTextNode(c.name));
      lab.appendChild(inp); lab.appendChild(sp); F.Secondary.appendChild(lab);
    });
    // fecha mínima
    var d = new Date(); d.setDate(d.getDate() + (CFG.minDaysAhead || 0));
    var iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    F.Date.min = iso;
    $("#dateHint").textContent = "Fecha mínima: " + d.toLocaleDateString("es-PE") + ". Confirmaremos si hay disponibilidad.";

    $("#customForm").addEventListener("input", function (e) { if (e.target === F.Model) onModelChange(); if (e.target === F.Main) syncSecondary(); update(); });
    $("#customForm").addEventListener("submit", function (e) { e.preventDefault(); });
    $("#sendWa").addEventListener("click", sendCustom);
    onModelChange(); update();
  }
  function onModelChange() {
    var p = find(F.Model.value); if (!p) return;
    F.Qty.textContent = "";
    (p.quantities || []).forEach(function (q) { F.Qty.appendChild(el("option", { value: q }, q + " flores")); });
    [["Led", "allowLed", "#rowLed"], ["Plush", "allowPlush", "#rowPlush"], ["Card", "allowCard", "#rowCard"]].forEach(function (x) {
      var ok = !!p[x[1]]; F[x[0]].disabled = !ok; if (!ok) F[x[0]].checked = false;
      $(x[2]).classList.toggle("off", !ok);
    });
  }
  function syncSecondary() {
    F.Secondary.querySelectorAll("input").forEach(function (i) {
      var same = i.value === F.Main.value; i.disabled = same; if (same) i.checked = false;
    });
  }
  function read() {
    var p = find(F.Model.value);
    var sec = Array.prototype.map.call(F.Secondary.querySelectorAll("input:checked"), function (i) { return i.value; });
    return {
      p: p, model: p ? p.name : "", main: F.Main.value, sec: sec, qty: F.Qty.value,
      led: F.Led.checked, plush: F.Plush.checked, card: F.Card.checked,
      note: F.Note.value.trim(), date: F.Date.value
    };
  }
  function fmtDate(iso) { if (!iso) return ""; var a = iso.split("-"); return a[2] + "/" + a[1] + "/" + a[0]; }
  function estimate(d) {
    if (!d.p || d.p.price == null || d.p.price === "") return "Precio estimado: por definir. Lo confirmaremos por WhatsApp.";
    var total = Number(d.p.price), pending = false;
    [["led", d.led], ["plush", d.plush], ["card", d.card]].forEach(function (x) {
      if (!x[1]) return;
      var pr = CFG.extras[x[0]]; if (pr == null) pending = true; else total += Number(pr);
    });
    return "Precio estimado: " + money(total) + (pending ? " + extras por definir" : "") + " (el precio final se confirma por WhatsApp).";
  }
  function update() {
    var d = read(); if (!d.p) return;
    var img = $("#sumImg"); img.src = d.p.image; img.alt = "Vista previa: " + d.p.name;
    var rows = [
      ["Modelo", d.model], ["Color principal", d.main],
      ["Secundarios", d.sec.length ? d.sec.join(", ") : "Ninguno"],
      ["Cantidad", d.qty + " flores"], ["Luces LED", d.led ? "Sí" : "No"],
      ["Peluche", d.plush ? "Sí" : "No"], ["Tarjeta", d.card ? "Sí" : "No"],
      ["Dedicatoria", d.note || "—"], ["Fecha", d.date ? fmtDate(d.date) : "—"]
    ];
    var dl = $("#sumList"); dl.textContent = "";
    rows.forEach(function (r) { dl.appendChild(el("dt", {}, r[0])); dl.appendChild(el("dd", {}, r[1])); });
    $("#sumPrice").textContent = estimate(d);
  }
  function sendCustom() {
    var d = read(), err = $("#formError"), msg = "";
    if (!d.p) msg = "Elige un modelo de ramo.";
    else if (!d.main) msg = "Elige un color principal.";
    else if (!d.qty) msg = "Elige la cantidad de flores.";
    else if (d.card && !d.note) msg = "Escribe la dedicatoria para la tarjeta o desmarca la tarjeta.";
    else if (d.date && d.date < F.Date.min) msg = "La fecha debe ser el " + fmtDate(F.Date.min) + " o posterior.";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    var colors = [d.main].concat(d.sec).join(", ");
    openWa(buildMessage({ model: d.model, colors: colors, qty: d.qty, led: d.led, plush: d.plush, card: d.card, note: d.note, date: fmtDate(d.date) }));
  }

  /* ---------- pie ---------- */
  $("#year").textContent = new Date().getFullYear();
  $("#lnkIg").href = CFG.social.instagram; $("#lnkTt").href = CFG.social.tiktok; $("#lnkFb").href = CFG.social.facebook;
  $("#hdrIg").href = CFG.social.instagram;
  var catUrl = CFG.catalogUrl || CFG.catalogPdfUrl;
  if (catUrl) { $("#pdfView").href = catUrl; }
  $("#footerWa").addEventListener("click", function () { openWa("Hola, MyALove. 💗 Quisiera hacer una consulta."); });

  /* ---------- fotos en 3D: las tarjetas se inclinan con el cursor ---------- */
  function enableTilt(root) {
    if (!root || reduced || !window.matchMedia("(pointer:fine)").matches) return;
    root.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".arch,.feat"); if (!card || !root.contains(card)) return;
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", (x * 12) + "deg"); card.style.setProperty("--rx", (-y * 9) + "deg");
      card.style.setProperty("--tx", (-x * 18) + "px"); card.style.setProperty("--ty", (-y * 12) + "px");
    });
    root.addEventListener("pointerout", function (e) {
      var card = e.target.closest(".arch,.feat");
      if (card && !card.contains(e.relatedTarget)) ["--rx", "--ry", "--tx", "--ty"].forEach(function (k) { card.style.removeProperty(k); });
    });
  }
  ["#productGrid", "#featuredGrid", "#seasonGrid"].forEach(function (id) { enableTilt($(id)); });

  /* ---------- cargar productos y temática ---------- */
  function getJson(url, optional) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function (e) { if (optional) return null; throw e; });
  }
  Promise.all([getJson("data/products.json"), getJson("data/temporada.json", true)]).then(function (res) {
    products = res[0].products || []; seasonData = res[1];
    renderCatalog(); initCustomizer();
    var forced = null;
    try { forced = new URLSearchParams(location.search).get("tema"); } catch (e) {}
    applySeason(pickSeason(forced));
  }).catch(function () {
    $("#productGrid").textContent = "No se pudo cargar el catálogo. Si abriste el archivo con doble clic, usa Live Server (ver README) o la web publicada.";
  });
})();
