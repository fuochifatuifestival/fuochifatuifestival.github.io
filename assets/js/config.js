/* ============================================================================
CONFIGURAZIONE GLOBALE DEL SITO
----------------------------------------------------------------------------
Modifica QUESTO file per aggiornare: nome del festival, lingue, voci di menu,
contatti social, etichette tradotte, elenco delle edizioni, i contenuti
della HOME (quando non c'è un evento in programma) e Google Analytics.
========================================================================= */

window.SITE_CONFIG = {

  /* Nome mostrato nel logo. */
  name: "Fuochi Fatui Festival",

  /* Lingue disponibili. La prima è quella predefinita (URL "pulito").
     Le altre si raggiungono con ?lang=xx (es. ?lang=en). */
  languages: ["it", "en"],

  /* ------------------------------------------------------------------
     GOOGLE ANALYTICS (GA4)
     Metti qui il tuo Measurement ID (es. "G-XXXXXXXXXX") per attivare il
     tracciamento su TUTTE le pagine del sito. Lascia "" per non caricare
     nulla (nessuno script, nessun cookie). Non serve toccare altri file:
     ogni pagina HTML richiama automaticamente ga.js, che legge questo ID.
  ------------------------------------------------------------------ */
  googleAnalyticsId: "", // es: "G-XXXXXXXXXX"

  /* ------------------------------------------------------------------
     STATO DEL FESTIVAL
     Se NON c'è un'edizione futura confermata, lascia hasUpcoming: false.
     In questo caso la home mostra la pagina "chi siamo" + carosello foto
     invece della pagina di un evento.
     Quando annuncerai una nuova edizione:
       1. metti hasUpcoming: true
       2. metti current: "<anno nuovo>"
       3. crea editions/<anno nuovo>.js (copia da un anno passato)
       4. aggiungi lo script della nuova edizione in index.html
  ------------------------------------------------------------------ */
  hasUpcoming: false,

  /* Anno dell'edizione corrente (usato solo se hasUpcoming: true). */
  current: "",

  /* Elenco EDIZIONI PASSATE, dalla più recente alla più vecchia.
     Ognuna vive nella propria sottocartella /editions/<anno>/index.html
     e ha i contenuti in /editions/<anno>.js.
     "slug" è il nome della cartella (utile per titoli come
     "Un giorno di fuochi" invece del solo anno). */
  editions: [
    { year: "2026", slug: "2026", label: { it: "Un giorno di fuochi", en: "A day of wildfires" } }
  ],

  /* Voci di menu fisse (le edizioni passate vengono aggiunte in automatico
     nel menu "Edizioni"). href senza estensione: "" = home,
     "chi-siamo" = chi-siamo.html */
  menu: [
    { label: { it: "Home", en: "Home" }, href: "" },
    { label: { it: "Chi siamo", en: "About" }, href: "chi-siamo" }
  ],

  /* Contatti e social mostrati nel footer. Lascia vuota ("") una voce
     per nasconderla. */
  socials: {
    email: "fuochifatuifestival@gmail.com",
    instagram: "https://instagram.com/fuochi_fatui_festival",
    //facebook: "https://facebook.com/fuochifatui"
    //spotify: "https://open.spotify.com/",
    //telegram: "https://t.me/fuochifatui"
  },

  /* Riga di crediti nel footer (tradotta). */
  credits: { it: "Un progetto di Fuochi Fatui APS",
             en: "A project by Fuochi Fatui APS" },

  /* Slogan breve nel footer (tradotto). */
  footerTagline: { it: "Festival di comunità nel cuore del Feltrino, dal 2012.",
                   en: "A community festival in the heart of the Feltre area, since 2012." },

  /* ------------------------------------------------------------------
     CONTENUTI DELLA HOME (quando non c'è un evento in programma)
     Vedi buildHome() in festival.js.
  ------------------------------------------------------------------ */
  home: {
    eyebrow: { it: "Fuochi Fatui Festival", en: "Fuochi Fatui Festival" },
    title: { it: "TRA UN FUOCO\nE L'ALTRO", en: "BETWEEN ONE\nFIRE AND\nTHE NEXT" },
    subtitle: {
      it: "Non abbiamo un evento in programma in questo momento, ma il fuoco sotto la cenere non si è mai spento. Scopri chi siamo e rivivi le edizioni passate.",
      en: "We don't have an event scheduled right now, but the embers are still glowing. Discover who we are and relive past editions."
    },
    ctaLabel: { it: "Chi siamo", en: "About us" },
    ctaHref: "chi-siamo",

    /* Testo "chi siamo" mostrato in home (versione breve). Per il testo
       completo vedi chi-siamo.html. */
    aboutTitle: { it: "Un'eredità dal 2012", en: "A legacy since 2012" },
    aboutText: {
      it: "Fuochi Fatui nasce nel centro storico di Feltre e porta avanti l'eredità del festival che, dal 2012, ha trasformato la città con musica dal vivo, arti visive e installazioni, in un progetto costruito insieme alla comunità del Feltrino.",
      en: "Fuochi Fatui was born in Feltre's historic centre and carries forward the legacy of a festival that, since 2012, has transformed the city with live music, visual arts and installations, in a project built together with the local community."
    },

    /* Carosello: foto delle edizioni passate. "caption" accetta stringa
       o oggetto tradotto { it, en }. "img" è opzionale: se assente viene
       mostrato un riquadro colorato al posto della foto (comodo per
       partire subito senza materiale fotografico). */
    carousel: [
      { caption: { it: "Un giorno di fuochi · 2026", en: "A day of wildfires · 2026" }, img: "" },
      { caption: { it: "Pubblico al tramonto", en: "Crowd at sunset" }, img: "" },
      { caption: { it: "Concerti al Castello di Alboino", en: "Concerts at Castello di Alboino" }, img: "" },
      { caption: { it: "Swap party", en: "Swap party" }, img: "" },
      { caption: { it: "Passeggiata al Vincheto di Celarda", en: "Guided walk at Vincheto di Celarda" }, img: "" },
      { caption: { it: "Dibattito pubblico", en: "Public talk" }, img: "" }
    ]
  },

  /* ----------------------------------------------------------------------
     ETICHETTE DELL'INTERFACCIA (tradotte).
     {y} viene sostituito con l'anno.
  -------------------------------------------------------------------- */
  ui: {
    it: {
      editionsMenu: "Edizioni",
      editionLabel: "L'edizione {y}",
      lineup: "Lineup",
      whoPlays: "Chi suona",
      program: "Programma",
      dayByDay: "Giorno per giorno",
      where: "Dove",
      location: "Location",
      gallery: "Galleria",
      moments: "Momenti",
      scroll: "scorri",
      seeLineup: "Vedi la lineup",
      reliveEdition: "Rivivi l'edizione",
      openMap: "Apri mappa",
      footerInfo: "Info",
      privacy: "Privacy & Cookie",
      pastEdition: "Edizione passata",
      backHome: "Torna alla home",
      otherEditions: "Altre edizioni"
    },
    en: {
      editionsMenu: "Editions",
      editionLabel: "The {y} edition",
      lineup: "Line-up",
      whoPlays: "Who's playing",
      program: "Programme",
      dayByDay: "Day by day",
      where: "Where",
      location: "Location",
      gallery: "Gallery",
      moments: "Moments",
      scroll: "scroll",
      seeLineup: "See the line-up",
      reliveEdition: "Relive the edition",
      openMap: "Open map",
      footerInfo: "Info",
      privacy: "Privacy & Cookies",
      pastEdition: "Past edition",
      backHome: "Back to home",
      otherEditions: "Other editions"
    }
  }
};
