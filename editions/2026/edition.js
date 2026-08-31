/* ============================================================================
CONTENUTI EDIZIONE 2026 — "Un giorno di fuochi" (passata) — bilingue IT / EN
----------------------------------------------------------------------------
Stessa struttura dei file edizione futuri: quando organizzerai una nuova
edizione, copia questo file (es. 2027.js), aggiorna i dati e:
  1. aggiungi la nuova edizione in "editions" di assets/js/config.js
     (se è passata) oppure imposta hasUpcoming:true e current:"<anno>"
     (se è la prossima in programma)
  2. crea la cartella editions/<anno>/index.html copiando quella di 2026/
     e aggiornando i percorsi (vedi README).

COME FUNZIONA LA TRADUZIONE
  • stringa semplice "Marlena Bay"      -> uguale in tutte le lingue
  • oggetto { it: "...", en: "..." }    -> testo tradotto
  I nomi dei palchi/luoghi stanno una sola volta in PALCHI qui sotto.
========================================================================= */
window.EDITIONS = window.EDITIONS || {};

(function () {
  var PALCHI = {
    riserva: { it: "Riserva del Vincheto di Celarda", en: "Vincheto di Celarda Reserve" },
    piazza: { it: "Area swap party", en: "Swap party area" },
    talk: { it: "Spazio dibattiti", en: "Talks area" },
    live: { it: "Area concerti", en: "Concert area" }
  };

  window.EDITIONS["2026"] = {
    year: "2026",
    slug: "2026",
    status: "past",
    edition: { it: "Prima edizione del rilancio", en: "First edition of the relaunch" },
    title: { it: "Un giorno di fuochi", en: "A day of wildfires" },
    dates: { it: "2026", en: "2026" },
    location: { it: "Feltre (BL)", en: "Feltre, Italy" },
    tagline: {
      it: "Una giornata sola, dalla natura alla musica: una passeggiata guidata, uno swap party, un dibattito pubblico e tre concerti live, per riportare la comunità di Feltre a incontrarsi.",
      en: "One single day, from nature to music: a guided walk, a swap party, a public talk and three live concerts, bringing the Feltre community back together."
    },

    intro: {
      it: "Un giorno di fuochi è la prima edizione del rilancio del festival: una sola giornata, pensata per riaccendere l'incontro tra le persone del territorio attraverso natura, sostenibilità, cultura e musica dal vivo.",
      en: "Un giorno di fuochi is the first edition of the festival's relaunch: a single day designed to bring people back together through nature, sustainability, culture and live music. "
    },

    /* Tre punti che raccontano l'edizione. */
    about: [
      { title: { it: "Natura e didattica ambientale", en: "Nature and environmental education" },
        text: { it: "Una passeggiata guidata nella riserva naturale del Vincheto di Celarda, realizzata con il Corpo Forestale dello Stato.",
                 en: "A guided walk through the Vincheto di Celarda nature reserve, organised with the State Forestry Corps." } },
      { title: { it: "Sostenibilità e comunità", en: "Sustainability and community" },
        text: { it: "Uno swap party di abiti usati, aperto a tutta la cittadinanza, diventato un momento di incontro fin dalle prime ore.",
                 en: "A clothes swap party open to the whole town, which became a moment of informal gathering from the very first hours." } },
      { title: { it: "Un solo giorno, tutto insieme", en: "One day, all together" },
        text: { it: "Dalla mattina a notte fonda: natura, mercatino, dibattito pubblico e concerti in un'unica data.",
                 en: "From morning to late night: nature, market, public talk and concerts in a single date." } }
    ],

    /* Lineup dei concerti serali. */
    lineup: [
      { name: "Fosca", headliner: true },
      { name: "Suspectra", headliner: true },
      { name: "Nic T", headliner: true },
    ],

    /* Programma della giornata. */
    program: [
      { day: { it: "Programma", en: "Programme" }, items: [
        { time: { it: "Mattina", en: "Morning" },
          name: { it: "Passeggiata", en: "Guided walk at Vincheto di Celarda" },
          stage: PALCHI.riserva },
        { time: { it: "Giornata", en: "All day" },
          name: { it: "Swap party — mercatino di scambio abiti", en: "Swap party — clothes exchange market" },
          stage: PALCHI.piazza },
        { time: { it: "Pomeriggio", en: "Afternoon" },
          name: { it: "Dibattito: abitare il Feltrino, tra spopolamento e nuovi sguardi", en: "Talk: living in the Feltre area, depopulation and new perspectives" },
          stage: PALCHI.talk },
        { time: { it: "Sera", en: "Evening" }, name: "Fosca", stage: PALCHI.live },
        { time: { it: "Sera", en: "Evening" }, name: "Suspectra", stage: PALCHI.live },
        { time: { it: "Sera", en: "Evening" }, name: "Nic T", stage: PALCHI.live }
      ]}
    ],

    place: {
      name: { it: "Celarda, Feltre", en: "Celarda, Feltre" },
      address: { it: "Celarda, Feltre (BL)", en: "Celarda, Feltre, Belluno, Italy" },
      text: {
        it: "Le attività della giornata si sono svolte tra la riserva naturale del Vincheto di Celarda e il centro storico di Feltre, richiamando pubblico anche da fuori città.",
        en: "The day's activities took place between the Vincheto di Celarda nature reserve and Feltre's historic centre, drawing visitors from outside the town too."
      },
      mapUrl: "https://maps.google.com/?q=Celarda+Feltre"
    },

    /* Galleria: ogni voce ha una didascalia (caption) e opzionalmente
       "img": "percorso/foto.jpg" per usare una foto reale al posto del
       riquadro colorato (vedi README -> "Foto reali"). */
    gallery: [
      { caption: { it: "Passeggiata guidata al Vincheto di Celarda", en: "Guided walk at Vincheto di Celarda" }, img: "" },
      { caption: { it: "Swap party", en: "Swap party" }, img: "" },
      { caption: { it: "Il dibattito pubblico", en: "The public talk" }, img: "" },
      { caption: { it: "Fosca in concerto", en: "Fosca live" }, img: "" },
      { caption: { it: "Suspectra in concerto", en: "Suspectra live" }, img: "" },
      { caption: { it: "Il pubblico della serata", en: "The evening crowd" }, img: "" }
    ]
  };
})();
