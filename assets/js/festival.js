/* ============================================================================
MOTORE DEL SITO — costruisce navbar, footer, home e pagine edizione dai dati,
con supporto a più lingue (IT / EN).
----------------------------------------------------------------------------
In genere NON serve toccare questo file: i contenuti stanno in
/editions/<anno>.js, le impostazioni e i testi della home in
/assets/js/config.js.
========================================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var BASE = window.BASE || "";     // "" in home, "../../" nelle pagine edizione
  var EDS = window.EDITIONS || {};
  var Q = String.fromCharCode(39);  // apice singolo, usato per evitare problemi di escaping nelle stringhe HTML generate

  /* --- LINGUA --------------------------------------------------------- */
  var LANGS = CFG.languages || ["it"];
  var DEFAULT = LANGS[0];
  var qLang = (new URLSearchParams(window.location.search)).get("lang");
  var LANG = LANGS.indexOf(qLang) >= 0 ? qLang : DEFAULT;

  /* t(): restituisce il testo nella lingua attiva.
     Accetta una stringa semplice (uguale per tutti) o un oggetto { it, en }. */
  function t(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[LANG] || v[DEFAULT] || "";
    return v == null ? "" : v;
  }

  /* ui(): etichetta dell'interfaccia dal dizionario in config.js. */
  function ui(key, vars) {
    var dict = (CFG.ui && CFG.ui[LANG]) || {};
    var s = dict[key] != null ? dict[key] : key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }

  /* suffisso ?lang per i link interni (vuoto nella lingua predefinita). */
  function langSuffix() { return LANG === DEFAULT ? "" : "?lang=" + LANG; }

  /* --- helper -------------------------------------------------------- */
  function el(html) { var x = document.createElement("template"); x.innerHTML = html.trim(); return x.content.firstChild; }
  function nl2br(s) { return String(s == null ? "" : s).split("\n").join("<br>"); }
  function brand() { return (CFG.name || "FESTIVAL").replace("{", "").replace("}", ""); }
  function bgStyle(img, c1, c2) {
    if (img) return "background-image:url(" + Q + img + Q + ");";
    return "--c1:" + c1 + ";--c2:" + c2 + ";";
  }

  /* Elenco edizioni passate normalizzato: accetta sia la vecchia forma
     (array di stringhe anno) sia la nuova (array di oggetti {year,slug,label}). */
  function pastEditions() {
    return (CFG.editions || []).map(function (e) {
      if (typeof e === "string") return { year: e, slug: e, label: null };
      return { year: e.year, slug: e.slug || e.year, label: e.label || null };
    });
  }

  /* URL corretto di una pagina (con lingua) in base alla profondità. */
  function url(href) {
    if (/^https?:|^mailto:|^tel:|^#/.test(href || "")) return href;
    var path;
    if (!href) path = BASE + "index.html";                       // home
    else if (/^\d{4}$/.test(href))                                // anno edizione
      path = (CFG.hasUpcoming && href === CFG.current) ? BASE + "index.html" : BASE + "editions/" + href + "/index.html";
    else path = BASE + href + ".html";                            // pagina generica
    return path + langSuffix();
  }

  function editionUrl(slug) { return BASE + "editions/" + slug + "/index.html" + langSuffix(); }

  /* ====================================================================
     SELETTORE LINGUA
  ================================================================== */
  function buildLangSwitch() {
    if (LANGS.length < 2) return null;
    var links = LANGS.map(function (l) {
      var params = new URLSearchParams(window.location.search);
      params.set("lang", l);
      var file = window.location.pathname.split("/").pop() || "index.html";
      var href = file + "?" + params.toString();
      return '<a href="' + href + '" class="' + (l === LANG ? "active" : "") + '">' + l.toUpperCase() + "</a>";
    }).join("");
    return '<div class="lang-switch">' + links + "</div>";
  }

  /* ====================================================================
     NAVBAR (overDark = true se la pagina ha un hero scuro)
     Il dropdown "Edizioni" si apre sia al passaggio del mouse (hover, con
     un piccolo margine invisibile che collega il link al menu, così non
     si chiude spostando il cursore) sia con un click/tap (utile su touch
     e per chi naviga da tastiera), e resta apribile/chiudibile finché non
     si clicca altrove.
  ================================================================== */
  function buildNav(active, overDark) {
    var links = "";
    (CFG.menu || []).forEach(function (m) {
      var on = (active === (m.href || "home")) ? ' class="active"' : "";
      links += "<li><a href=" + Q + url(m.href) + Q + on + ">" + t(m.label) + "</a></li>";
    });

    /* dropdown edizioni passate (appare solo se ce ne sono) */
    var past = pastEditions();
    if (past.length) {
      var items = past.map(function (e) {
        var label = e.label ? t(e.label) : (ui("editionsMenu") + " " + e.year);
        return "<a href=" + Q + editionUrl(e.slug) + Q + ">" + label + "</a>";
      }).join("");
      var onEd = (active === "editions") ? ' class="active"' : "";
      links += '<li class="nav-drop"><a' + onEd + ' aria-haspopup="true" aria-expanded="false">' + ui("editionsMenu") +
               '</a><div class="nav-drop-menu"><div class="nav-drop-inner">' + items + "</div></div></li>";
    }

    var lang = buildLangSwitch() || "";

    var nav = el(
      '<header class="nav' + (overDark ? " nav--on-dark" : "") + '">' +
        '<div class="wrap">' +
          '<a class="brand" href=' + Q + url("") + Q + ">" + brand().replace("{", "<span>").replace("}", "</span>") + "</a>" +
          '<div class="nav-right">' +
            '<nav><ul class="nav-links">' + links + "</ul></nav>" +
            lang +
            '<button class="nav-toggle" aria-label="Menu"><span></span></button>' +
          "</div>" +
        "</div>" +
      "</header>"
    );

    nav.querySelector(".nav-toggle").addEventListener("click", function () { nav.classList.toggle("is-open"); });
    window.addEventListener("scroll", function () { nav.classList.toggle("is-solid", window.scrollY > 40); });
    if (window.scrollY > 40) nav.classList.add("is-solid");

    /* Dropdown "Edizioni": click/tap per aprire e chiudere (oltre
       all'hover gestito via CSS), e chiusura cliccando fuori o con Esc. */
    var drop = nav.querySelector(".nav-drop");
    if (drop) {
      var dropLink = drop.querySelector("a");
      dropLink.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = !drop.classList.contains("is-open");
        drop.classList.toggle("is-open", willOpen);
        dropLink.setAttribute("aria-expanded", String(willOpen));
      });
      document.addEventListener("click", function (e) {
        if (!drop.contains(e.target)) {
          drop.classList.remove("is-open");
          dropLink.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          drop.classList.remove("is-open");
          dropLink.setAttribute("aria-expanded", "false");
        }
      });
    }

    return nav;
  }

  /* ====================================================================
     FOOTER
  ================================================================== */
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.8-11.2a1.54 1.54 0 1 0 1.54 1.54A1.54 1.54 0 0 0 18.8 5.1z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.9h-2.34v7A10 10 0 0 0 22 12z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.59 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.21c3.81-.87 7.08-.5 9.72 1.11.29.18.38.57.21.85zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.36.22.48.7.25 1.07zm.11-2.84C14.8 8.95 9.4 8.76 6.3 9.7a.93.93 0 1 1-.54-1.78c3.56-1.08 9.52-.87 13.27 1.35a.93.93 0 1 1-.95 1.6z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M22 3.5 2.6 11c-1.3.5-1.3 1.3-.2 1.6l5 1.6L19 6.4c.5-.3 1-.2.6.2l-9.3 8.4-.4 5.3c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.8l3.3-15.6c.3-1.2-.4-1.8-1.4-1.3z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2 8-5.2H4l8 5.2zM4 8.3V18h16V8.3l-8 5.2-8-5.2z"/></svg>'
  };

  function buildFooter() {
    var s = CFG.socials || {};
    var soc = "";
    ["instagram", "facebook", "spotify", "telegram"].forEach(function (k) {
      if (s[k]) soc += '<a href="' + s[k] + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ICONS[k] + "</a>";
    });
    if (s.email) soc += '<a href="mailto:' + s.email + '" aria-label="email">' + ICONS.email + "</a>";

    var past = pastEditions();
    var eds = past.map(function (e) {
      var label = e.label ? t(e.label) : (ui("editionsMenu") + " " + e.year);
      var current = (CFG.hasUpcoming && e.year === CFG.current);
      return "<li><a href=" + Q + editionUrl(e.slug) + Q + ">" + label + (current ? " &#10022;" : "") + "</a></li>";
    }).join("");

    var info = (CFG.menu || []).map(function (m) {
      return "<li><a href=" + Q + url(m.href) + Q + ">" + t(m.label) + "</a></li>";
    }).join("");
    if (s.email) info += '<li><a href="mailto:' + s.email + '">' + s.email + "</a></li>";

    return el(
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer-top">' +
          '<div class="f-brand-col"><div class="f-brand">' + brand().replace("{", "<span>").replace("}", "</span>") + "</div>" +
            '<p class="f-tag">' + t(CFG.footerTagline) + "</p>" +
            '<div class="socials">' + soc + "</div>" +
          "</div>" +
          (eds ? "<div><h4>" + ui("editionsMenu") + "</h4><ul>" + eds + "</ul></div>" : "") +
          "<div><h4>" + ui("footerInfo") + "</h4><ul>" + info + "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>&#169; " + new Date().getFullYear() + " &mdash; " + t(CFG.credits) + "</span>" +
          "<a href=" + Q + url("chi-siamo") + Q + ">" + ui("privacy") + "</a>" +
        "</div>" +
      "</div></footer>"
    );
  }

  /* ====================================================================
     CAROSELLO FOTO (home) — semplice, senza dipendenze esterne.
  ================================================================== */
  var SHOT_COLORS = [
    ["#3a5a40", "#1b2a1d"], ["#bc4b2b", "#5a1f10"], ["#2f4858", "#13202a"],
    ["#8a6d3b", "#3a2c14"], ["#1f5d3f", "#0f2a1c"], ["#a23e2c", "#4a160d"]
  ];

  function buildCarousel(items) {
    if (!items || !items.length) return null;
    var slides = items.map(function (it, i) {
      var c = SHOT_COLORS[i % SHOT_COLORS.length];
      var style = bgStyle(it.img, c[0], c[1]);
      return '<div class="car-slide' + (it.img ? " has-img" : "") + '" style="' + style + '">' +
               '<span class="cap">' + t(it.caption) + "</span>" +
             "</div>";
    }).join("");
    var dots = items.map(function (_, i) { return '<button class="car-dot' + (i === 0 ? " active" : "") + '" data-i="' + i + '" aria-label="slide ' + (i + 1) + '"></button>'; }).join("");

    var car = el(
      '<div class="carousel" data-reveal>' +
        '<div class="car-track">' + slides + "</div>" +
        '<button class="car-btn car-prev" aria-label="prev">&larr;</button>' +
        '<button class="car-btn car-next" aria-label="next">&rarr;</button>' +
        '<div class="car-dots">' + dots + "</div>" +
      "</div>"
    );

    var track = car.querySelector(".car-track");
    var dotEls = car.querySelectorAll(".car-dot");
    var idx = 0, n = items.length;

    function go(i) {
      idx = (i + n) % n;
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      dotEls.forEach(function (d, di) { d.classList.toggle("active", di === idx); });
    }
    car.querySelector(".car-prev").addEventListener("click", function () { go(idx - 1); });
    car.querySelector(".car-next").addEventListener("click", function () { go(idx + 1); });
    dotEls.forEach(function (d) { d.addEventListener("click", function () { go(+d.getAttribute("data-i")); }); });

    var timer = setInterval(function () { go(idx + 1); }, 5500);
    car.addEventListener("mouseenter", function () { clearInterval(timer); });
    car.addEventListener("mouseleave", function () { timer = setInterval(function () { go(idx + 1); }, 5500); });

    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      startX = null;
    });

    return car;
  }

  /* ====================================================================
     HOME (nessun evento in programma) — chi siamo + carosello foto.
  ================================================================== */
  function buildHome() {
    var h = CFG.home || {};
    var frag = document.createDocumentFragment();

    /* ---- HERO (chiaro, niente evento) ---- */
    frag.appendChild(el(
      '<section class="section home-hero">' +
        '<div class="wrap">' +
          '<span class="eyebrow" data-reveal>' + t(h.eyebrow) + "</span>" +
          '<h1 class="section-title home-title" data-reveal>' + nl2br(t(h.title)) + "</h1>" +
          '<p class="lead" data-reveal style="margin-top:22px">' + t(h.subtitle) + "</p>" +
          '<div class="hero-cta" data-reveal style="margin-top:32px">' +
            "<a class=\"btn-x\" href=" + Q + url(h.ctaHref || "chi-siamo") + Q + ">" + t(h.ctaLabel) + ' <span class="arr">&rarr;</span></a>' +
          "</div>" +
        "</div>" +
      "</section>"
    ));

    /* ---- CHI SIAMO (breve) ---- */
    if (h.aboutTitle || h.aboutText) {
      frag.appendChild(el(
        '<section class="section section--alt">' +
          '<div class="wrap intro-grid">' +
            '<div data-reveal><span class="eyebrow">' + ui("editionsMenu") + '</span>' +
              '<p class="big" style="margin-top:18px">' + t(h.aboutTitle) + "</p>" +
            "</div>" +
            '<div data-reveal><p class="lead" style="font-size:1.15rem">' + t(h.aboutText) + "</p></div>" +
          "</div>" +
        "</section>"
      ));
    }

    /* ---- CAROSELLO ---- */
    var car = buildCarousel(h.carousel);
    if (car) {
      var wrap = el(
        '<section class="section">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("gallery") + '</span>' +
            '<h2 class="section-title" data-reveal style="margin-bottom:40px">' + ui("moments") + "</h2>" +
          "</div>" +
        "</section>"
      );
      wrap.querySelector(".wrap").appendChild(car);
      frag.appendChild(wrap);
    }

    /* ---- LINK EDIZIONI PASSATE ---- */
    var past = pastEditions();
    if (past.length) {
      var cards = past.map(function (e) {
        var label = e.label ? t(e.label) : (ui("editionsMenu") + " " + e.year);
        return "<a class=\"ed-card\" href=" + Q + editionUrl(e.slug) + Q + ">" +
                 '<span class="ed-card-year">' + e.year + "</span>" +
                 '<span class="ed-card-label">' + label + ' <span class="arr">&rarr;</span></span>' +
               "</a>";
      }).join("");
      frag.appendChild(el(
        '<section class="section section--alt">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("otherEditions") + '</span>' +
            '<h2 class="section-title" data-reveal style="margin-bottom:36px">' + ui("editionsMenu") + "</h2>" +
            '<div class="ed-cards" data-reveal>' + cards + "</div>" +
          "</div>" +
        "</section>"
      ));
    }

    return frag;
  }

  /* ====================================================================
     PAGINA EDIZIONE (usata sia per l'edizione corrente, se presente,
     sia per ogni edizione passata in editions/<anno>/index.html)
  ================================================================== */
  function buildEdition(year) {
    var d = EDS[year];
    if (!d) return el('<div class="wrap section"><p>Edizione non trovata.</p></div>');

    var frag = document.createDocumentFragment();
    var isPast = d.status === "past";

    /* ---- HERO ---- */
    var meta = "<span>" + t(d.dates) + '</span><span class="dot"></span><span>' + t(d.location) + "</span>";
    if (d.edition) meta = "<span>" + t(d.edition) + '</span><span class="dot"></span>' + meta;
    if (isPast) meta = '<span class="tag-past">' + ui("pastEdition") + '</span><span class="dot"></span>' + meta;

    var cta = "";
    if (d.status === "upcoming") {
      cta = '<div class="hero-cta">' +
              (d.ticketUrl ? '<a class="btn-x" href="' + d.ticketUrl + '">' + t(d.ticketLabel || "Biglietti") + ' <span class="arr">&rarr;</span></a>' : "") +
              '<a class="btn-x btn-x--ghost" href="#lineup">' + ui("seeLineup") + "</a>" +
            "</div>";
    } else {
      cta = '<div class="hero-cta"><a class="btn-x btn-x--ghost" href="#gallery">' + ui("reliveEdition") + "</a></div>";
    }

    var heroTitle = d.title ? t(d.title) : (brand().replace(/<\/?span>/g, "") + " " + year);
    frag.appendChild(el(
      '<section class="hero">' +
        '<div class="hero-bg"></div>' +
        '<div class="wrap">' +
          '<div class="hero-meta">' + meta + "</div>" +
          '<h1 class="hero-title">' + heroTitle + "</h1>" +
          '<p class="hero-sub">' + t(d.tagline) + "</p>" +
          cta +
        "</div>" +
        '<div class="scroll-hint">' + ui("scroll") + "</div>" +
      "</section>"
    ));

    /* ---- MARQUEE ---- */
    if (d.lineup && d.lineup.length) {
      var mq = d.lineup.slice(0, 8).map(function (a) { return a.name; }).join("<span>&#10022;</span>");
      frag.appendChild(el('<div class="marquee"><div class="marquee-track"><span>' + mq + "</span><span>" + mq + "</span></div></div>"));
    }

    /* ---- INTRO ---- */
    if (d.intro || d.about) {
      var features = (d.about || []).map(function (f, i) {
        return '<div class="feature"><div class="num">0' + (i + 1) + "</div><div>" +
               "<h3>" + t(f.title) + "</h3><p>" + t(f.text) + "</p></div></div>";
      }).join("");
      frag.appendChild(el(
        '<section class="section">' +
          '<div class="wrap intro-grid">' +
            '<div data-reveal><span class="eyebrow">' + ui("editionLabel", { y: year }) + '</span>' +
              '<p class="big" style="margin-top:18px">' + t(d.intro) + "</p>" +
            "</div>" +
            '<div class="feature-list" data-reveal>' + features + "</div>" +
          "</div>" +
        "</section>"
      ));
    }

    /* ---- LINEUP ---- */
    if (d.lineup && d.lineup.length) {
      var heads = d.lineup.filter(function (a) { return a.headliner; });
      var rest = d.lineup.filter(function (a) { return !a.headliner; });
      function chip(a) { return '<a href="' + (a.url || "#") + '">' + a.name + (a.day ? '<span class="tag-day">' + t(a.day) + "</span>" : "") + "</a>"; }
      frag.appendChild(el(
        '<section class="section section--alt" id="lineup">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("lineup") + '</span>' +
            '<h2 class="section-title" data-reveal>' + ui("whoPlays") + "</h2>" +
            '<div class="lineup-headliners" data-reveal>' + heads.map(chip).join("") + "</div>" +
            (rest.length ? '<div class="lineup-rest" data-reveal>' + rest.map(chip).join("") + "</div>" : "") +
          "</div>" +
        "</section>"
      ));
    }

    /* ---- PROGRAMMA ---- */
    if (d.program && d.program.length) {
      var tabs = "", panels = "";
      d.program.forEach(function (day, i) {
        var on = i === 0 ? " active" : "";
        tabs += '<button class="day-tab' + on + '" data-day="' + i + '">' + t(day.day) + "</button>";
        var slots = day.items.map(function (s) {
          return '<div class="slot"><div class="time">' + t(s.time) + '</div><div class="act">' + s.name +
                 '</div><div class="stage">' + t(s.stage || "") + "</div></div>";
        }).join("");
        panels += '<div class="day-panel' + on + '" data-day="' + i + '">' + slots + "</div>";
      });
      var prog = el(
        '<section class="section">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("program") + '</span>' +
            '<h2 class="section-title" data-reveal>' + ui("dayByDay") + "</h2>" +
            '<div class="day-tabs" data-reveal>' + tabs + "</div>" +
            '<div class="day-panels" data-reveal>' + panels + "</div>" +
          "</div>" +
        "</section>"
      );
      prog.querySelectorAll(".day-tab").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var i = btn.getAttribute("data-day");
          prog.querySelectorAll(".day-tab").forEach(function (b) { b.classList.toggle("active", b === btn); });
          prog.querySelectorAll(".day-panel").forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-day") === i); });
        });
      });
      frag.appendChild(prog);
    }

    /* ---- LOCATION ---- */
    if (d.place) {
      frag.appendChild(el(
        '<section class="section section--alt">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("where") + '</span>' +
            '<h2 class="section-title" data-reveal style="margin-bottom:40px">' + ui("location") + "</h2>" +
            '<div class="loc-grid">' +
              '<div class="loc-map" data-reveal><span class="pin"></span><span class="map-label">' + t(d.place.name) + "</span></div>" +
              '<div class="loc-info" data-reveal>' +
                "<h3>" + t(d.place.name) + "</h3>" +
                '<div class="addr">' + t(d.place.address || "") + "</div>" +
                "<p>" + t(d.place.text || "") + "</p>" +
                (d.place.mapUrl ? '<a class="btn-x btn-x--ghost" style="margin-top:24px" href="' + d.place.mapUrl + '" target="_blank" rel="noopener">' + ui("openMap") + ' <span class="arr">&rarr;</span></a>' : "") +
              "</div>" +
            "</div>" +
          "</div>" +
        "</section>"
      ));
    }

    /* ---- GALLERY ---- */
    if (d.gallery && d.gallery.length) {
      var spans = ["span-7 tall", "span-5 tall", "span-4", "span-4", "span-4", "span-8", "span-6", "span-6"];
      var shots = d.gallery.map(function (g, i) {
        var cap = g && g.caption != null ? g.caption : g; /* retro-compatibile con vecchio formato stringa */
        var img = (g && g.img) || "";
        var c = SHOT_COLORS[i % SHOT_COLORS.length];
        var style = bgStyle(img, c[0], c[1]);
        return '<div class="shot ' + spans[i % spans.length] + (img ? " has-img" : "") + '" style="' + style + '">' +
               '<span class="cap">' + t(cap) + "</span></div>";
      }).join("");
      frag.appendChild(el(
        '<section class="section" id="gallery">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("gallery") + '</span>' +
            '<h2 class="section-title" data-reveal style="margin-bottom:40px">' + ui("moments") + "</h2>" +
            '<div class="gallery" data-reveal>' + shots + "</div>" +
          "</div>" +
        "</section>"
      ));
    }

    /* ---- ALTRE EDIZIONI (fondo pagina, solo se ce ne sono altre) ---- */
    var others = pastEditions().filter(function (e) { return e.year !== year; });
    if (others.length || (CFG.hasUpcoming && CFG.current !== year)) {
      var chips = others.map(function (e) {
        var label = e.label ? t(e.label) : e.year;
        return "<a class=\"btn-x btn-x--ghost\" href=" + Q + editionUrl(e.slug) + Q + ">" + label + "</a>";
      }).join("");
      if (CFG.hasUpcoming && CFG.current !== year) {
        chips = "<a class=\"btn-x\" href=" + Q + url("") + Q + ">" + CFG.current + "</a>" + chips;
      }
      frag.appendChild(el(
        '<section class="section section--alt">' +
          '<div class="wrap">' +
            '<span class="eyebrow" data-reveal>' + ui("otherEditions") + '</span>' +
            '<h2 class="section-title" data-reveal style="margin-bottom:32px">' + ui("editionsMenu") + "</h2>" +
            '<div class="hero-cta" data-reveal>' + chips + "<a class=\"btn-x btn-x--ghost\" href=" + Q + url("") + Q + ">" + ui("backHome") + "</a></div>" +
          "</div>" +
        "</section>"
      ));
    }

    return frag;
  }

  /* ====================================================================
     LINGUA: applica alla pagina e mostra/nasconde i blocchi [data-lang]
  ================================================================== */
  function applyLang() {
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-lang]").forEach(function (n) {
      n.style.display = (n.getAttribute("data-lang") === LANG) ? "" : "none";
    });
  }

  /* ====================================================================
     REVEAL
  ================================================================== */
  function reveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (n) { io.observe(n); });
  }

  /* ====================================================================
     API PUBBLICA
  ================================================================== */
  window.Festival = {
    lang: function () { return LANG; },

    /* Home: se hasUpcoming è true mostra l'edizione corrente (hero scuro),
       altrimenti mostra chi-siamo + carosello (hero chiaro). */
    renderHome: function (mountSelector) {
      var mount = document.querySelector(mountSelector || "#app");
      if (CFG.hasUpcoming && CFG.current) {
        document.body.prepend(buildNav("home", true));
        mount.appendChild(buildEdition(CFG.current));
        document.title = (CFG.name || "Festival").replace(/[{}]/g, "") + " " + CFG.current;
      } else {
        document.body.prepend(buildNav("home", false));
        mount.appendChild(buildHome());
        document.title = (CFG.name || "Festival").replace(/[{}]/g, "");
      }
      document.body.appendChild(buildFooter());
      applyLang(); reveal();
    },

    /* Pagina di una specifica edizione (passata o futura), in
       editions/<anno>/index.html. Hero sempre scuro. */
    renderEdition: function (year, mountSelector) {
      var mount = document.querySelector(mountSelector || "#app");
      document.body.prepend(buildNav("editions", true));
      mount.appendChild(buildEdition(year));
      document.body.appendChild(buildFooter());
      applyLang(); reveal();
      var d = EDS[year] || {};
      var titleName = d.title ? t(d.title) : ((CFG.name || "Festival").replace(/[{}]/g, "") + " " + year);
      document.title = titleName;
    },

    /* Solo header + footer per le pagine generiche (sfondo chiaro). */
    renderShell: function (activeMenu) {
      document.body.prepend(buildNav(activeMenu || "", false));
      document.body.appendChild(buildFooter());
      applyLang(); reveal();
    }
  };
})();
