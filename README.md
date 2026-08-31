# Fuochi Fatui Festival — sito

Sito statico (HTML + CSS + JS, responsive con Bootstrap), bilingue **IT / EN**.
I contenuti vivono in semplici file di dati, così aggiornarli, tradurli e
aggiungere nuove edizioni resta facile.

## Struttura

```
festival/
├── index.html               ← HOME: chi siamo + carosello (nessun evento in programma)
├── chi-siamo.html           ← pagina "chi siamo" completa (storia dal 2012), raggiungibile dal menu
├── editions/
│   ├── 2026.js               ← CONTENUTI "Un giorno di fuochi" (programma, lineup, location, galleria) bilingue
│   └── 2026/
│       └── index.html        ← pagina pubblica dell'edizione 2026
└── assets/
    ├── css/style.css        ← COLORI E FONT (blocco :root in cima) + stili carosello/card/dropdown
    ├── img/                  ← metti qui le foto reali (vedi sotto)
    └── js/
        ├── config.js         ← nome, lingue, menu, social, testi home, etichette tradotte, edizioni, Google Analytics
        ├── ga.js              ← caricamento di Google Analytics (non richiede modifiche)
        └── festival.js       ← motore (in genere si lascia così com'è)
```

---

## Guida rapida agli aggiornamenti più comuni

### 1. Aggiungere / sostituire le foto (carosello e gallerie)

- **Dove metterle**: cartella `assets/img/`. Usa nomi chiari, es.
  `2026-castello-alboino.jpg`.
- **Formato e peso consigliati**: JPG o WebP, lato lungo **1600–2000px**,
  peso sotto i **400 KB** per foto (comprimile con Squoosh o TinyPNG prima
  di caricarle: il sito non le ridimensiona da solo). Foto più pesanti
  rallentano il caricamento, soprattutto da telefono.
- **Proporzioni**:
  - carosello in home: le immagini vengono ritagliate a circa **16:7**
    (molto panoramiche); scegli foto larghe, con il soggetto centrato,
    perché i bordi laterali/superiori possono essere tagliati.
  - galleria di un'edizione: il riquadro di ogni foto ha proporzioni
    diverse (alcune quadrate, alcune panoramiche, alcune verticali —
    è un mosaico), quindi va bene qualunque proporzione: il sito la
    ritaglia automaticamente riempiendo lo spazio (come "object-fit: cover").
- **Come collegarle**: aggiungi il percorso nel campo `img` della voce
  corrispondente:
  - carosello home → `assets/js/config.js`, dentro `home.carousel`:
    ```js
    { caption: { it: "Concerti al Castello di Alboino", en: "Concerts at Castello di Alboino" }, img: "assets/img/2026-castello-alboino.jpg" }
    ```
  - galleria di un'edizione → `editions/<anno>.js`, dentro `gallery`:
    ```js
    { caption: { it: "Swap party" }, img: "../../assets/img/2026-swap-party.jpg" }
    ```
    (attenzione al percorso: dentro `editions/<anno>.js` il file immagine
    va raggiunto con `../../assets/img/...`, perché la pagina che lo
    userà si trova due cartelle sotto la radice, in `editions/<anno>/`)
  - Se lasci `img: ""`, al posto della foto compare un riquadro colorato
    con la didascalia (utile mentre aspetti il materiale fotografico).
- **Aggiungere o togliere foto**: aggiungi/rimuovi semplicemente voci
  nell'array (`home.carousel` o `gallery`); il carosello e la griglia si
  adattano da soli al numero di foto presenti.

### 2. Selezionare/cambiare l'edizione corrente (quando annunci un evento)

Tutto si decide in `assets/js/config.js`:

1. Copia `editions/2026.js` in `editions/<anno>.js`, aggiorna lineup,
   programma, date, location, e metti `status: "upcoming"`.
2. In `config.js` cambia:
   ```js
   hasUpcoming: true,
   current: "<anno>",
   ```
3. In `index.html`, aggiungi lo script della nuova edizione **prima** di
   `festival.js`:
   ```html
   <script src="editions/<anno>.js"></script>
   ```
   Da questo momento la home mostra automaticamente la pagina
   dell'evento al posto di "chi siamo".
4. Quando l'evento sarà concluso e diventerà un'edizione passata:
   - in `editions/<anno>.js` metti `status: "past"`
   - crea `editions/<anno>/index.html` copiando quella di `editions/2026/`
     e aggiornando i riferimenti all'anno (vedi commenti nel file)
   - aggiungi l'edizione in cima all'array `editions` di `config.js`:
     ```js
     { year: "<anno>", slug: "<anno>", label: { it: "...", en: "..." } }
     ```
   - rimetti `hasUpcoming: false` finché non annunci la prossima

Il menu "Edizioni" in navbar e l'elenco nel footer si aggiornano da soli
leggendo l'array `editions`: non serve toccarli a mano.

### 3. Testi, lineup, programma, location di un'edizione

Tutto in `editions/<anno>.js`: lineup (`lineup`), programma (`program`,
anche a fasce orarie testuali come "Mattina"/"Pomeriggio" oltre agli
orari fissi), location (`place`), testo introduttivo (`intro`, `about`).
Ogni campo di testo accetta una stringa semplice (uguale in tutte le
lingue) oppure `{ it: "...", en: "..." }` per una traduzione.

### 4. Testi e foto della home (quando non c'è un evento)

Tutto in `assets/js/config.js`, blocco `home`: titolo, sottotitolo, testo
"chi siamo" breve e foto del carosello.

### 5. Colori, font, nome del festival, social, menu

- Colori e font → `assets/css/style.css`, blocco `:root` in cima (cambia
  una variabile, es. `--accent`, e si aggiorna tutto il sito).
- Nome, social, voci di menu, crediti → `assets/js/config.js`.

---

## Google Analytics

Per attivare il tracciamento (GA4) su tutte le pagine del sito:

1. Crea una proprietà GA4 su [analytics.google.com](https://analytics.google.com)
   e copia il **Measurement ID** (ha la forma `G-XXXXXXXXXX`).
2. Incollalo in `assets/js/config.js`:
   ```js
   googleAnalyticsId: "G-XXXXXXXXXX",
   ```
3. Salva: tutte le pagine (home, chi-siamo, ogni edizione) caricano già
   `assets/js/ga.js`, che legge questo ID e attiva Google Analytics in
   automatico. Non serve aggiungere nessuno script manualmente.

Per disattivarlo di nuovo, rimetti `googleAnalyticsId: ""`: nessuno
script esterno verrà caricato e nessun cookie verrà impostato.

> Nota privacy: attivando Analytics probabilmente dovrai aggiornare la
> tua informativa privacy/cookie (link "Privacy & Cookie" nel footer,
> attualmente puntato su `chi-siamo.html`) per menzionare Google
> Analytics, e valutare un banner di consenso se il tuo pubblico è
> soprattutto in UE.

---

## Il menu a tendina "Edizioni" (dropdown)

Il menu a tendina delle edizioni passate resta aperto in modo affidabile:
si apre passando il mouse sopra oppure con un click/tap (utile su schermi
touch e per chi naviga da tastiera), e si chiude cliccando altrove o
premendo Esc. Non serve alcuna configurazione: il comportamento è già
attivo su tutte le pagine.

## Lingue (IT / EN)

La lingua predefinita è la prima in `SITE_CONFIG.languages` (italiano). Le altre
si aprono con `?lang=` nell'URL: `sito.it/?lang=en`, `sito.it/chi-siamo.html?lang=en`.
Il selettore **IT / EN** in alto a destra cambia lingua, e tutti i link interni
mantengono la lingua scelta.

Come si scrivono i testi tradotti:

- **Testi dell'interfaccia e della home**: in `config.js`, sezioni `ui.it`
  / `ui.en` e `home`. Le voci di menu usano `label: { it: "...", en: "..." }`.
- **Contenuti di un'edizione** (`editions/<anno>.js`): stringa semplice →
  uguale in tutte le lingue (nomi di artisti, orari…); oggetto
  `{ it: "...", en: "..." }` → testo tradotto. I nomi dei palchi/luoghi
  stanno una volta sola nella mappa `PALCHI` in cima al file.
- **Pagine generiche** (`chi-siamo.html`): ogni blocco di testo è
  duplicato con `data-lang="it"` e `data-lang="en"`; il sito mostra
  quello giusto in automatico.

## Avvio in locale

Apri `index.html` con un doppio clic, oppure servi la cartella:

```
python3 -m http.server 8000
```

e vai su `http://localhost:8000`. Per pubblicarlo, carica la cartella `festival/`
sul tuo hosting o su Netlify / Vercel / GitHub Pages.
