# Study & Travel — BEST Brașov

Site-ul de prezentare pentru cursurile de sezon BEST (Board of European Students of Technology).

Când vrei să aduci cursurile la zi (sau când se deschide un sezon nou):
npm run update-courses

## Configurare după audit

Copiază `.env.example` în `.env`. `VITE_FORMSPREE_ENDPOINT` este opțional:
cu endpointul propriului formular Formspree configurat, mesajele sunt trimise prin HTTPS;
fără el, formularul deschide aplicația de email către adresa existentă BEST Brașov și
utilizatorul finalizează trimiterea acolo. După modificarea unei variabile `VITE_`, repornește
serverul de dezvoltare sau rulează din nou buildul pentru publicare.

`UNSPLASH_ACCESS_KEY` este folosit numai de `updateCourses.cjs` și `completeImages.cjs`.
`VITE_CONTACT_EMAIL` permite configurarea destinatarului pentru alternativa mailto; implicit se folosește adresa BEST Brașov existentă în proiect.
Scripturile încarcă `.env`; cheia poate fi furnizată și în mediul procesului. Nu folosi prefixul `VITE_` pentru această cheie.
Fără cheie, se păstrează imaginile existente și se folosește placeholderul pentru cele lipsă.

Originalele galeriei sunt în `assets-originals/wallofmemories/`, în afara fișierelor publicate.
Poți regenera WebP-urile și metadatele cu `node scripts/optimize-gallery.mjs`.
Verifică parserul fără cereri externe cu `node --test tests/updateCourses.test.cjs`.
După actualizarea cursurilor trebuie refăcute buildul și publicarea.

  ## Tehnologii folosite

  • Vue 3 (<script setup>) + Vite
  • Swiper.js (caruselul 3D cu destinații)
  • AOS (animații la scroll), SVG inline și cod propriu pentru petalele copacului
  • Axios & Cheerio (pentru preluarea automată a datelor de pe best.eu.org)
  • Unsplash API (pentru fotografiile orașelor)
  
