/* ============================================================================
GOOGLE ANALYTICS (GA4) — caricamento facoltativo
----------------------------------------------------------------------------
Non serve toccare questo file. Per attivare Google Analytics su tutto il
sito basta scrivere il tuo Measurement ID (es. "G-XXXXXXXXXX") nel campo
googleAnalyticsId di assets/js/config.js.

Se il campo è vuoto, questo script non fa nulla: nessuna richiesta esterna,
nessun cookie, nessun impatto sulle prestazioni o sulla privacy.
========================================================================= */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var ID = CFG.googleAnalyticsId;
  if (!ID) return; // GA disattivato: nessun ID configurato

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", ID);
})();
