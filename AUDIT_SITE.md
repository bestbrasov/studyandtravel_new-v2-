# Audit Study & Travel — 26 octombrie 2026

## Petale pe întregul site

La cererea utilizatorului, stratul unic de petale a fost mutat prin Teleport direct în body și fixat peste viewport. Nu mai este decupat de secțiunea hero și rămâne vizibil peste Despre, ghid, costuri, destinații, FAQ, galerie și contact. Pointer-events rămâne none, iar meniul și modalurile sunt deasupra stratului decorativ.

La începutul fiecărui ciclu, originile sunt recalculate: petalele pornesc din florile vizibile ale copacului când coroana este pe ecran, respectiv de deasupra viewportului când utilizatorul a derulat la alte secțiuni. Pe desktop sunt 16 petale, iar pe mobil 8; preferința pentru mișcare redusă le dezactivează. Redimensionarea regenerează același container, fără dubluri. Buildul a trecut; git diff --check nu a raportat erori.

## Cireș pictural după referința utilizatorului

Copacul simplificat SVG din hero a fost înlocuit cu o ilustrație picturală transparentă generată prin ImageGen, pornind de la referința atașată de utilizator: trunchi în dreapta și coroană arcuită deasupra textului centrat. Originalul este păstrat în assets-originals/hero/cherry-canopy-v1.png; promptul integral este lângă acesta, în cherry-canopy-v1.prompt.md. Variantele publice WebP de 1600 și 1000 px păstrează transparența și ocupă împreună 733.248 bytes.

Generatorul unic de petale este reutilizat. Punctele de emisie și culorile sunt calculate din 34 de poziții de flori roz detectate în ilustrație și salvate în src/cherry-canopy.json. La redimensionare sunt aplicate exact scara și decuparea object-fit: cover a imaginii. Se generează 16 petale, fără acumulare de dubluri, pornite eșalonat după încărcarea ilustrației. Mișcarea folosește transform/opacity, cu durate de 16–23 secunde și deplasare laterală ușoară. Sub 768 px imaginea nu este montată și nu se generează petale. Codul păstrează copacul static la prefers-reduced-motion și elimină petalele.

Verificări: build de producție reușit și 6 teste existente trecute. În browser, ilustrația s-a încărcat corect pe desktop, cu 1 container și 16 petale. La 375 px: 0 imagini de coroană, 0 petale, fără overflow; la 850 px: imagine încărcată, 16 petale, 1 container, fără overflow. Verificarea suplimentară pentru mișcare redusă pe desktop a fost oprită de refuzul permisiunii de acces la localhost; nu este raportată ca verificată în browser. Fișierele temporare de test au fost eliminate după verificări.

## Text integral din documentul STUDY&TRAVEL

La cererea utilizatorului, textele scurtate au fost înlocuite cu întregul conținut al documentului Google furnizat: https://docs.google.com/document/d/1MjJWVycEVonMoOmvaTDfa8fIGOGCYGBeYrgZAlkGdcA/edit?tab=t.0 . Au fost păstrate toate cele 77 de paragrafe de conținut, cele patru părți ale ghidului, beneficiile și responsabilitățile, cele două paragrafe Despre și toate cele șapte întrebări și răspunsuri FAQ. Titlurile duplicate din document au fost reunite, fără eliminarea explicațiilor. Corecturile privesc gramatica, diacriticele, acordurile și punctuația, fără schimbarea taxelor sau condițiilor din document.

Costurile nu mai folosesc formulări rezumate: cardurile redau pasajele complete relevante, cu titlul Costuri. Beneficiile și responsabilitățile sunt afișate integral, fără panou details închis. Linkul de înregistrare și cel My Applications provin din hyperlinkurile documentului; legăturile sale interne localhost către contact/aplicare au fost adaptate la ancorele site-ului.

Documentul nu precizează numărul de telefon în formularea de contact. Nu a fost inventat unul; propoziția a fost corectată pentru a enumera canalele de contact fără câmpuri goale. Mesajul Înscrieri închise folosește exact var(--pink-pop), aceeași culoare ca textul animat.

Documentul Google a fost doar citit, fără modificări. Nu s-a păstrat o copie separată a documentului sursă în proiect; textul autorizat a fost inserat direct în conținutul site-ului. Completitudinea celor 77 de paragrafe a fost verificată în memorie față de sursă. Buildul de producție a trecut.

## Ajustări vizuale ulterioare cerute de utilizator

- Hero este din nou centrat. Cuvintele animate și FAQ-ul deschis folosesc rozul original #ff9a9e, iar butoanele au text alb, conform preferinței explicite a utilizatorului, care înlocuiește cerința anterioară de contrast pentru aceste elemente.
- Au fost eliminate doar din secțiunea Destinații rândurile „Înscrieri închise” și „Ultima actualizare”. Mesajul de sezon din banda separată este păstrat. Secțiunea și meniul folosesc eticheta FAQ.
- Copacul SVG are ramuri curbe, mai fine, flori mici în grupuri și poziționare laterală discretă; generatorul unic de petale este păstrat. Referința vizuală de copac menționată în mesaj nu a fost primită: atașamentul vizibil prezintă costurile. Aspectul exact rămâne de ajustat după primirea referinței.
- Sursa pentru „Costuri, pe scurt” este codul original din Git, accesibil cu `git show HEAD:src/App.vue`: ghidul de aplicare menționa depozitul de 40 euro și taxa de 60% pentru participanții din România; „Ce nu este inclus” menționa călătoria la eveniment și întoarcerea; responsabilitățile precizau condițiile returnării depozitului. Cardurile rezumă aceste texte, nu o verificare nouă a regulilor BEST în vigoare. Valabilitatea lor actuală trebuie confirmată cu BEST Brașov dacă este necesar.

Verificare: build reușit; în browser, centrul textului hero coincide cu centrul viewportului (diferență sub 1 px), culoarea animată este rgb(255,154,158), textul butoanelor este alb, cele două rânduri nu există în Destinații și rămâne un singur sistem cu 10 petale.

## Actualizare de design și reverificare

Au fost aplicate cerințele noi de design, apoi verificate în ordine cele 13 puncte tehnice, cu build reușit după fiecare pas. Secțiunile ulterioare păstrează istoricul auditului inițial.

- Tema pastelată și fonturile Fredoka/Nunito sunt păstrate. Sezoanele și titlul mare rămân în engleză, conform preferinței explicite anterioare; descrierea hero și conținutul informativ sunt în română.
- „De ce să aplici”, stilurile Tilt și dependența Vanilla Tilt au fost eliminate, împreună cu avionul, felinarele și decorațiunile redundante. Butoanele nu conțin emoji sau imagini/iconițe; meniul are indicator hamburger desenat în CSS și etichetă text.
- Hero are copac SVG inline și descriere scurtă. Se reutilizează generatorul propriu de petale: un singur container, 10 petale desktop, formă roz identică și durată de 16–23 secunde; origini calculate din florile coroanei. Mișcarea folosește transform/opacity, fără animarea top. La resize se înlocuiesc elementele, fără acumulare.
- Sub 768 px copacul este ascuns și nu se generează petale. Cu mișcare redusă rămâne copacul static, fără Typed sau petale; schimbarea preferinței în timpul sesiunii este tratată.
- Ghidul și rezumatul costurilor apar înaintea destinațiilor și detaliilor. Taxa de 60%, depozitul de 40 € și transportul separat provin din textele existente; nu s-au inventat taxe. Beneficiile și responsabilitățile sunt într-un element details nativ; ghidul și FAQ au fost scurtate.
- Spațiere, raze, umbre și interacțiuni uniformizate. Pentru cerința nouă de contrast, textul butoanelor este închis pe pastel; cuvintele animate și întrebările deschise folosesc același roz închis. Fundalurile pastelate sunt păstrate.
- Contactul păstrează Formspree configurabil și alternativa mailto; destinatarul poate fi setat prin VITE_CONTACT_EMAIL, cu adresa existentă drept valoare implicită. Galeria WebP, originalele separate, fallback-ul JPG, accesibilitatea și metadatele sunt păstrate și reverificate.
- Importurile de cursuri elimină emoji din câmpurile text, validează înregistrările și nu suprascriu JSON-ul la erori. Scrierea atomică, timeoutul și configurarea Unsplash prin mediu sunt păstrate.

Verificări noi: 6 teste Node trecute; npm audit fix fără force, 0 vulnerabilități; build după fiecare pas. În browser: 320/375/390 px fără elemente de conținut ieșite orizontal din viewport, scrollWidth egal cu clientWidth, 0 petale mobile și scroll-padding identic cu înălțimea antetului. Meniu/Escape/selecție și taburi din tastatură verificate. Pe desktop: 1 container și 10 petale. Pe o copie temporară cu date fictive și preferință reduced-motion simulată: copac prezent, 0 petale, 0 cursoare Typed, focus trap/Escape/restaurare focus, fallback și validarea spațiilor în formular verificate. Datele cursurilor reale au rămas nemodificate.

Rămân configurările externe din TODO: endpoint Formspree pentru livrare directă (mailto este funcțional), cheie Unsplash nouă/rotație de către proprietar, număr de telefon și URL direct de înregistrare dacă se dorește publicarea lor, domeniu public pentru URL-uri absolute Open Graph. Nu au fost trimise mesaje reale, modificate taxe sau inventate date de contact.

## Remedieri implementate după audit

Cele 13 puncte solicitate au fost implementate în ordine, cu `npm run build` reușit după fiecare pas.
Textul auditului de mai jos descrie starea inițială, anterioară remedierilor.

- Contact: etichete, validare, stări de trimitere/succes/eroare; Formspree configurabil prin `VITE_FORMSPREE_ENDPOINT`, cu mailto către adresa existentă când endpointul este gol. În modul mailto se confirmă pregătirea mesajului, fără a pretinde că emailul a fost trimis.
- Galerie: maximum 1600 px, WebP de 1600/800 px, dimensiuni, srcset și lazy loading; 1.136.348 bytes pentru toate cele 12 variante față de 32.565.456 bytes pentru originalele mutate în `assets-originals/` (reducere de aproximativ 96,5%).
- Meniu mobil accesibil, închidere după selectare/Escape, spațiu de scroll măsurat prin ResizeObserver.
- Actualizare prin `npm audit fix`, fără force; audit final: 0 vulnerabilități. Axios/Cheerio sunt devDependencies; cheia Unsplash este citită din mediu, iar `.env` este ignorat.
- Butoane native, taburi cu tastele săgeți/Home/End, FAQ cu aria-expanded, dialog cu focus inițial/trap/Escape/restaurare, main și skip-link.
- Text închis pe butoanele și contactul pastelate, text de accent mai închis și focus vizibil; culorile de bază și structura vizuală sunt păstrate.
- CSS-ul eligibilității este în style; placeholder JPG local și fallback la eroare pe carduri și modal.
- Parser delimitat la BEST Courses, validare și timeout, protecție la liste goale neconfirmate, scriere prin fișier temporar și rename; erori Unsplash logate fără cheie.
- Sezon închis și ultima actualizare vizibile; statistici înlocuite când înscrierile s-au încheiat; metadate românești, Open Graph/Twitter și preferință de mișcare redusă.
- Ajustări pentru 320–390 px, modal cu scroll și texte indicate uniformizate în română, folosind numai adresele și destinațiile deja existente.

Verificări: cinci teste Node pentru parser și păstrarea JSON-ului la erori; builduri pentru toți pașii; verificare vizuală desktop și în cadre de 320/375/390 px. În browser au fost verificate taburile cu săgeți, meniul mobil/Escape, dialogul cu Shift+Tab/Tab/Escape și restaurarea focusului, fallback-ul după o imagine defectă și validarea câmpurilor cu spații. Modalul a fost testat pe o copie temporară a componentei cu date fictive, fără modificarea cursurilor reale.

### TODO / configurare rămasă

- TODO: furnizarea endpointului Formspree și testarea livrării reale, dacă se dorește trimitere fără aplicație de email. Până atunci funcționează alternativa mailto; nu au fost trimise mesaje reale în timpul testelor.
- TODO: furnizarea unei chei Unsplash valide și rotația cheii vechi dacă a fost distribuită; rotația necesită accesul proprietarului la cont.
- TODO: numărul de telefon al responsabilului și linkul direct de înregistrare nu există în datele proiectului. Ghidul folosește emailul existent și pagina principală BEST; nu au fost inventate date sau URL-uri.
- TODO: domeniul public pentru URL-uri absolute de distribuire și o imagine Open Graph, dacă se dorește; nu a fost inventat un domeniu. Metadatele text și cardul Twitter sunt configurate.


## Domeniu și verificări

Analiză a proiectului local Vue 3 + Vite, a șabloanelor, stilurilor, datelor, scripturilor de actualizare și imaginilor. Verificare vizuală în browserul integrat la aproximativ 600 × 450 px, testarea celor patru taburi ale ghidului, deschiderea unui răspuns FAQ și navigarea la contact. Compilarea de producție a reușit. Nu au fost modificate sursele aplicației sau datele cursurilor.

Nu este un audit al hostingului public: HTTPS, antete HTTP, cache CDN și configurația serverului nu au fost verificate. Nu s-au măsurat Lighthouse sau Core Web Vitals. Caruselul și modalul nu au fost testate interactiv, deoarece lista actuală de cursuri este goală; constatările despre acestea provin din cod. Afișarea desktop și ecranele de 320–390 px necesită verificare vizuală separată.

## Concluzie

Site-ul are o identitate vizuală coerentă și acoperă informațiile de bază pentru studenți. Principalele probleme sunt formularul fără funcționalitate, imaginile foarte mari, navigarea absentă pe mobil și accesibilitatea insuficientă. Buildul reușit nu elimină aceste probleme.

## Probleme cu prioritate ridicată

### 1. Formularul de contact nu trimite mesaje

Loc: `src/App.vue:386–390`.

Formularul nu are handler de submit, integrare cu un serviciu sau legare a datelor. Butonul este `type="button"`, fără acțiune. Câmpurile nu au etichete, nume sau cerințe de completare. Problema blochează inclusiv fluxul de validare a contului, care îi îndrumă pe studenți spre acest formular.

Remediere: serviciu real de trimitere, validare și stări de trimitere/succes/eroare; etichete explicite și informație despre utilizarea datelor. Până atunci, o acțiune clară de contact prin email este mai utilă decât formularul inert.

### 2. Galeria are 32.565.456 bytes, aproximativ 32,6 MB

Loc: `public/images/wallofmemories/`, `src/App.vue:363–372`.

Cele două fișiere cele mai mari au 12,84 MB și 12,66 MB. Toate cele șase imagini sunt în pagină fără `loading="lazy"`, `srcset` sau dimensiuni explicite. Aceasta poate prelungi încărcarea, consuma trafic mobil și provoca deplasări de layout. Dimensiunea fișierelor este măsurată; timpul de încărcare nu a fost măsurat.

Remediere: redimensionare, WebP/AVIF, variante responsive, lazy loading pentru galerie și dimensiuni declarate. Eliminarea imaginilor nefolosite din public reduce și volumul livrabilului.

### 3. Meniul dispare sub 768 px

Loc: `src/App.vue:1164`.

`.nav-links` primește `display: none`, fără meniu alternativ. Confirmat în browser: antetul păstrează logo-ul și butonul de contact, dar nu oferă acces direct la ghid sau FAQ. La navigarea la contact, antetul fix acoperă parțial titlul secțiunii.

Remediere: meniu mobil accesibil, închidere după selectare și spațiu pentru ancore prin `scroll-margin-top`/`scroll-padding-top`.

### 4. Contrast insuficient în elementele pastelate

Loc: culorile și `.btn-pop` din `src/App.vue:727–885`, zona de contact.

Contrast calculat pentru alb față de culorile definite: roz #ff9a9e = 2,03:1; roz #ec77ab = 2,69:1; violet #a18cd1 = 2,92:1; albastru #8fd3f4 = 1,64:1. Textul alb de pe butoane și anumite zone de contact este greu de citit; raportul depinde local și de gradient. Aceste valori sunt sub reperul de 4,5:1 pentru text obișnuit și chiar sub 3:1 pentru text mare.

Remediere: fundaluri mai închise pentru text alb sau text închis pe fundaluri pastelate; stări de focus vizibile.

### 5. Accesibilitate incompletă pentru controale

Loc: `src/App.vue:40–46`, `:143`, `:183–186`, `:332`, `:386–390`, footer.

FAQ-ul și cardurile de curs folosesc elemente `div` cu click, fără comportament nativ de tastatură. Modalul nu implementează semantică de dialog, focus inițial, captarea/restaurarea focusului sau închidere Escape; închiderea este un `div`. Taburile nu expun selecția și relația cu panourile. Linkurile sociale au doar iconițe, iar câmpurile nu au etichete explicite.

Remediere: butoane native, `aria-expanded`, relații tab/panel, dialog accesibil și nume pentru controale. Adăugarea unui reper `main` și a unui link de salt la conținut ajută navigarea asistată.

### 6. Dependențe semnalate de npm audit

`npm audit --omit=dev --json` a raportat 11 pachete vulnerabile, toate cu severitate agregată high; 0 critical. Au fost identificate, între altele, axios 1.15.2 și Vue 3.5.27 / server-renderer. Raportul indică remedieri disponibile.

Acesta este rezultatul registrului npm la verificare, nu demonstrarea unui atac asupra site-ului. Axios și Cheerio sunt folosite în scripturile locale, iar aplicația nu utilizează SSR; expunerea fiecărui advisory trebuie evaluată separat. Auditul exclude dependențele exclusiv de dezvoltare.

Remediere: actualizări controlate, verificarea lockfile-ului și repetarea buildului și a fluxurilor relevante. Separarea dependențelor folosite doar de scripturile de actualizare clarifică suprafața de producție.

## Probleme cu prioritate medie

### 7. Stilurile de eligibilitate sunt în afara blocului style

Primele 19 linii din `src/App.vue` conțin CSS înainte de `<template>`. Nu fac parte dintr-un bloc `<style>` al componentei; regulile pentru `.eligibility-grid` și `.eligibility-col` nu sunt aplicate în mod normal de compilatorul SFC. Buildul poate reuși chiar și cu acest fragment ignorat.

Remediere: mutarea regulilor în blocul `<style>`.

### 8. Datele sunt statice și nu exprimă starea înscrierilor

`src/courses.json` are ultima actualizare la 22 septembrie 2026 și termenul 11 octombrie 2026. La data auditului, termenul a trecut, dar UI afișează doar intervalul înscrierilor.

Lipsa cursurilor NU este o eroare demonstrată: pagina oficială confirmă Winter Season 2026, zero BEST Courses și înscrieri încheiate la 11 octombrie 2026, 23:00: https://www.best.eu.org/courses/list.jsp

Fișierul este importat la build; rularea scriptului fără rebuild și redeploy nu actualizează site-ul public. Nu a fost găsită automatizare de actualizare în proiect.

Remediere: date structurate pentru termene, stare „Înscrieri închise”, afișarea ultimei actualizări și procedură de actualizare/build/deploy.

### 9. Imagine fallback absentă și utilizată inconsecvent

`src/App.vue:427` indică `/images/fallback_course.jpg`, dar fișierul nu există. Cardurile folosesc `getCourseImg`, în timp ce modalul folosește direct `currentModalData.img`. Un curs fără imagine poate avea imagine defectă, mai ales în modal. Nu există handler pentru erori de încărcare.

### 10. Actualizarea cursurilor poate confunda o eroare de parsare cu o listă goală

`updateCourses.cjs` selectează primul `.event-cards-grid`, are un fallback generic pentru toate tabelele și suprascrie JSON-ul chiar dacă nu poate extrage cursuri. Dacă structura BEST se schimbă, o parsare nereușită poate șterge logic lista existentă. Cererea principală nu are timeout explicit; erorile Unsplash sunt ascunse.

Remediere: verificarea secțiunii de cursuri, validarea fiecărei înregistrări, distingerea unei liste explicit goale de o parsare nereușită și scriere atomică cu păstrarea datelor anterioare la erori.

### 11. Cheie Unsplash inclusă în două scripturi

Loc: `updateCourses.cjs:11`, `completeImages.cjs:10`.

Cheia de acces este în cod. Nu s-a verificat dacă este validă sau dacă repository-ul este public. Dacă a fost distribuită, poate permite consumarea cotei aplicației. Nu este importată de codul client analizat.

Remediere: configurare prin variabile de mediu și rotație dacă cheia a fost expusă.

### 12. SEO și metadate minimale

`index.html:2` are `lang=""`; titlul este generic. Lipsesc meta description, Open Graph, Twitter metadata și canonical. Conținutul este randat în client, fără prerandare configurată. Nu există sitemap sau robots.txt în public. Absența acestora nu demonstrează că site-ul nu este indexat.

Remediere: `lang="ro"`, titlu și descriere relevante, metadate de distribuire; canonical și sitemap după confirmarea domeniului public. Prerandarea poate fi evaluată în funcție de obiective.

### 13. Preferința pentru mișcare redusă este respectată parțial

`src/App.vue:606–695`: AOS și Tilt sunt condiționate, dar Typed și petalele pornesc oricum. Animațiile CSS decorative nu au alternativă reduced-motion. Petalele animă `top`, nu doar transformări.

Remediere: titlu static și oprirea animațiilor decorative când utilizatorul solicită mișcare redusă.

### 14. Layout vulnerabil la ecrane foarte înguste

`.card-container` folosește coloane cu minim 300 px plus padding de 40 px. La 320–375 px, spațiul util al secțiunii este insuficient. `overflow-x: hidden` poate masca tăierea. Emailul lung, butonul din antet și modalul fără `max-height`/scroll intern necesită teste la aceste dimensiuni. Această observație este dedusă din CSS; nu a fost verificată vizual la 320 px.

## Conținut, design și mentenanță

- Identitate coerentă: culori pastelate, fonturi rotunjite, fotografii autentice și contact uman.
- Textul introductiv conține „calitate/calitative”, aparent o variantă editorială rămasă nefinalizată.
- Etichetele alternează româna și engleza: Home, Leave a message, Super Cheap, Wall of Memories. Diacriticele sunt inconsecvente.
- Prima întrebare FAQ cere taxa maximă, dar răspunsul oferă un procent, fără a răspunde la plafon.
- „Diplomă recunoscută internațional și credite ECTS extra” este formulat prea categoric; trebuie precizat ce certifică BEST și în ce condiții universitatea recunoaște creditele.
- În ghid rămân formulări incomplete: „telefon la număr, email la adresă”, respectiv „înregistrează-te aici” fără link.
- „0 destinații / - cost mediu / 100% fun” ocupă o zonă importantă fără a ajuta decizia în sezonul fără cursuri. Un mesaj de sezon închis și acces la arhivă ar fi mai util.
- Pagina este lungă, cu responsabilități dense și spațiere mare. Ghidul și costurile pot fi sintetizate înaintea detaliilor.
- `App.vue` depășește 1.200 de linii, cu stiluri inline și date duplicate. Există cod nefolosit pentru checklist, cursor și `aplicareContent`.
- Instanțele Typed/Swiper/Tilt și listenerii nu au cleanup la demontare. Impactul actual este limitat de faptul că aplicația este o singură pagină fără router.
- Se importă întregul bundle Swiper, chiar dacă sezonul curent nu afișează carusel. Importurile modulare sau condiționate ar reduce codul inițial.
- Nu există scripturi pentru teste sau lint în package.json. Testele utile sunt cele pentru parser, stările de sezon, contact și navigarea cu tastatura.

## Rezultatele buildului

- Build Vite: reușit, 54 module transformate.
- JavaScript generat: 288,23 kB; gzip 93,17 kB.
- CSS generat: 58,26 kB; gzip 8,88 kB.
- Aceste valori nu includ imaginile, fonturile și iconițele externe. Galeria domină volumul static identificat.

## Ordine propusă de remediere

1. Contact funcțional și etichete accesibile.
2. Optimizarea galeriei și meniu mobil cu ancore corecte.
3. Evaluarea și actualizarea dependențelor; eliminarea cheii din cod.
4. Contrast, controale de tastatură, modal și reduced-motion.
5. CSS-ul de eligibilitate, fallback pentru imagini și layout la 320–390 px.
6. Stări de înscriere, parser robust și actualizare reproductibilă.
7. Revizie editorială, metadate și împărțirea componentei.
