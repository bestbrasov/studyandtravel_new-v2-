/* Eligibilitate grid styling */
.eligibility-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.eligibility-col {
  background: #fff8f8;
  border-radius: 20px;
  padding: 35px 30px;
  font-size: 1.1rem;
  box-shadow: 0 4px 18px rgba(255,154,158,0.08);
  border: 1.5px solid var(--pink-soft);
}
@media (max-width: 900px) {
  .eligibility-grid { grid-template-columns: 1fr; }
}
<template>
  <div class="landing-container">

    <div id="sakura-container" ref="sakuraContainer"></div>

    <div class="side-decorations">
      <div class="paper-plane">
        <i class="fa-solid fa-paper-plane"></i>
      </div>
      <div class="deco-lantern left-lantern">
        <div class="lantern-body"></div>
        <div class="lantern-string"></div>
      </div>
      <div class="deco-lantern right-lantern">
        <div class="lantern-body" style="background: var(--blue-soft)"></div>
        <div class="lantern-string"></div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-overlay active" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-close" @click="closeModal">
            <i class="fa-solid fa-xmark"></i>
          </div>

          <img :src="currentModalData.img" alt="City" class="modal-img">

          <div class="modal-header-info">
            <span class="badge" style="font-size: 0.9rem;">{{ currentModalData.dates }}</span>
            <span class="badge" style="background: var(--pink-pop); color: white;">{{ currentModalData.fee }}</span>
          </div>

          <h2 class="modal-title">{{ currentModalData.city }}</h2>
          <h4 style="color: #666; margin-bottom: 15px;">{{ currentModalData.title }}</h4>

          <p class="modal-desc">
            Eveniment academic BEST în <strong>{{ currentModalData.country }}</strong>.
            <br>O oportunitate unică de a învăța și a călători.
          </p>

          <a :href="currentModalData.link" target="_blank" class="btn-pop" style="padding: 10px 30px; font-size: 0.9rem;">
            <i class="fa-solid fa-heart"></i> Mă înscriu
          </a>
        </div>
      </div>
    </transition>

    <nav>
      <div class="logo mouse-hover">
        <img src="/images/logo_best_courses.png" alt="BEST Courses Logo" class="nav-logo-img" style="height: 55px">
      </div>
      <div class="nav-links">
        <a href="#hero" class="mouse-hover">Home</a>
        <a href="#courses" class="mouse-hover">Destinații</a>
        <a href="#process" class="mouse-hover">Proces</a>
        <a href="#faq" class="mouse-hover">FAQ</a>
        <a href="#contact" class="mouse-hover">Contact</a>
      </div>
      <a href="#contact" class="btn-pop mouse-hover" style="padding: 10px 25px; font-size: 0.9rem;">Leave a message</a>
    </nav>

    <section id="hero" class="hero">
      <div class="blob-bg" style="background: var(--pink-soft); top: 10%; left: 10%; width: 300px; height: 300px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;"></div>
      <div class="blob-bg" style="background: var(--blue-soft); bottom: 10%; right: 10%; width: 400px; height: 400px; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;"></div>

      <h4 style="color: var(--blue-sky); letter-spacing: 4px; margin-bottom: 15px; font-weight: 800;">SEASON 2026</h4>
      <h1>Time to <span ref="typedText" class="highlight"></span></h1>
      <p>Experiențe legendare, prieteni noi și cursuri academice de calitate/calitative în toată Europa. <br>Aventura ta începe aici.</p>
      <div style="margin-top: 40px;">
        <a href="#courses" class="btn-pop mouse-hover"><i class="fa-solid fa-rocket"></i> Explorează Cursuri</a>
      </div>
    </section>

    <section class="stats-bar" data-aos="fade-up">
        <div class="blob-bg" style="background: var(--pink-soft); top: 5%; left: 5%; width: 220px; height: 220px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; z-index:0; position:absolute; filter: blur(8px); opacity:0.35;"></div>
      <div class="stat-item">
        <h3>18</h3>
        <p>Destinații</p>
      </div>
      <div class="stat-item">
        <h3>76€</h3>
        <p>Cost Mediu</p>
      </div>
      <div class="stat-item">
        <h3>100%</h3>
        <p>Fun Garantat</p>
      </div>
    </section>

    <section class="section-padding">
        <div class="blob-bg" style="background: var(--pink-soft); top: 10%; left: 80%; width: 200px; height: 200px; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; z-index:0; position:absolute; filter: blur(8px); opacity:0.32;"></div>
      <h2 class="text-center" data-aos="fade-up">De ce sa aplici?</h2>
      <div class="card-container">
        <div class="tilt-card" ref="tiltElements" data-tilt data-tilt-glare data-tilt-max-glare="0.8">
          <div class="tilt-icon"><i class="fa-solid fa-piggy-bank" style="color: var(--pink-pop)"></i></div>
          <h3>Super Cheap</h3>
          <p>Cazare, masă și distracție asigurate la un preț studențesc imbatabil.</p>
        </div>
        <div class="tilt-card" ref="tiltElements" data-tilt data-tilt-glare data-tilt-max-glare="0.8">
          <div class="tilt-icon"><i class="fa-solid fa-graduation-cap" style="color: var(--blue-sky)"></i></div>
          <h3>Academic Boost</h3>
          <p>Primești diplomă recunoscută internațional și credite ECTS extra.</p>
        </div>
        <div class="tilt-card" ref="tiltElements" data-tilt data-tilt-glare data-tilt-max-glare="0.8">
          <div class="tilt-icon"><i class="fa-solid fa-champagne-glasses" style="color: var(--accent-gold)"></i></div>
          <h3>Social Life</h3>
          <p>Petreceri tematice, International Evening și prieteni din toată Europa.</p>
        </div>
      </div>
    </section>

    <section id="courses" class="section-padding" style="background: rgba(255,255,255,0.4);">
        <div class="blob-bg" style="background: var(--pink-soft); top: 15%; left: 10%; width: 180px; height: 180px; border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; z-index:0; position:absolute; filter: blur(8px); opacity:0.28;"></div>
      <h2 class="text-center" style="margin-bottom: 50px;" data-aos="zoom-in">Destinatii Europene</h2>
      <p class="text-center" style="margin-top: -30px; margin-bottom: 50px; color: var(--pink-pop); font-weight: 700; letter-spacing: 1px;">CLICK PE IMAGINI PENTRU DETALII</p>

      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          <div
              v-for="(course, index) in coursesList"
              :key="index"
              class="swiper-slide mouse-hover"
              @click="openModal(course)"
              :style="{ backgroundImage: `url(${course.img})` }"
          >
            <div class="slide-content">
              <span class="badge">{{ course.country }}</span>
              <h3>{{ course.city }}</h3>
              <p style="font-size: 0.85rem; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                {{ course.title }}
              </p>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </section>

    <section id="process" class="section-padding" style="background: #fff;">
        <div class="blob-bg" style="background: var(--pink-soft); top: 8%; left: 70%; width: 170px; height: 170px; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; z-index:0; position:absolute; filter: blur(8px); opacity:0.25;"></div>
      <h2 class="text-center" data-aos="fade-down">Ghid de Aplicare</h2>

      <div class="tabs-container">
        <div class="tabs-header">
          <button @click="activeTab = 'cine'" :class="{active: activeTab === 'cine'}">Cine poate aplica?</button>
          <button @click="activeTab = 'cum'" :class="{active: activeTab === 'cum'}">Cum pot aplica?</button>
          <button @click="activeTab = 'scrisoare'" :class="{active: activeTab === 'scrisoare'}">Cum arata scrisoarea de motivatie?</button>
          <button @click="activeTab = 'validare'" :class="{active: activeTab === 'validare'}">Cum se valideaza contul?</button>
        </div>

        <div class="tab-content card-pop" data-aos="fade-up">
          <div v-if="activeTab === 'cine'">
            <h3><i class="fa-solid fa-user-graduate"></i> Eligibilitate</h3>
            <p style="max-width:600px;margin:0 auto 25px auto;line-height:1.7;">
              Orice student din cadrul Universităţii Transilvania poate aplica la cursurile de sezon BEST.<br>
              Dacă este în an terminal, acesta trebuie să fie student doar în momentul aplicării.
            </p>
            <div class="eligibility-grid">
              <div class="eligibility-col">
                <strong>Un student poate aplica la:</strong><br>
                maxim 3 cursuri BEST (BEST Courses)<br>
                maxim 3 evenimente despre educație (Symposium on Education)
              </div>
              <div class="eligibility-col">
                <strong>Un student poate participa la:</strong><br>
                maxim 3 cursuri BEST (BEST Courses) în timpul perioadei de studii<br>
                maxim 2 cursuri BEST (BEST Courses) în sezoanele de vară<br>
                maxim 1 curs BEST (BEST Courses) pe fiecare sezon<br>
                maxim 3 evenimente despre educație (Symposium on Education) în timpul perioadei de studii
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'cum'">
            <h3><i class="fa-solid fa-list-check"></i> Cum pot aplica?</h3>
            <div style="max-width:900px;margin:0 auto;line-height:1.7;font-size:1.08rem;">
              <p><strong>Pentru a aplica la un eveniment BEST, există câteva reguli pe care trebuie să le îndeplineşti şi o procedură ce trebuie respectată:</strong></p>
              <p style="margin-bottom:0.7em;"><strong>O aplicaţie este formată din:</strong></p>
              <ul style="margin-bottom:1.2em;">
                <li>crearea contului pe <a href="https://www.best.eu.org" target="_blank">www.best.eu.org</a> (site-ul general BEST)</li>
                <li>o scrisoare de motivație</li>
                <li>răspunsul la întrebările evenimentului BEST la care aplici (pot fi de la 1 la 3 întrebări)</li>
              </ul>
              <p style="margin-bottom:0.7em;"><strong>Ce trebuie să faci?</strong></p>
              <ol style="margin-bottom:1.2em; padding-left:1.2em;">
                <li><b>Mergi la lista de evenimente</b>, alege evenimentul la care doreşti să aplici și apasă butonul “Apply”.</li>
                <li><b>Introdu adresa ta de e-mail și parola</b>, dacă nu eşti deja conectat (dacă nu ai încă un cont, înregistrează-te aici).</li>
                <li><b>După crearea contului, contactează-ne</b> să ne soliciţi să-ţi validăm contul.</li>
                <li><b>Aplică la cursul/cursurile pe care le-ai ales.</b></li>
                <li><b>Plăteşte depozitul de 40 de euro la BEST Braşov</b>, dacă ai fost acceptat la unul dintre evenimente. <br><span style="font-size:0.97em;">Această sumă o vei primi înapoi în urma participării fără probleme la curs şi a completării formularului de feedback, de după întoarcerea în ţară).</span></li>
                <li><b>Caută şi găseşte o metodă de a ajunge la eveniment</b> (avion, tren, autocar).</li>
                <li><b>Participă la eveniment respectând programul realizat de Grupul Local BEST</b> care organizează cursul.</li>
                <li><b>Plăteşte taxa de participare</b> (taxa pentru participanții din Romania este de 60% din taxa cursului ales).</li>
                <li><b>Bucură-te de cele trei mese pe zi</b>, oferite de Grupul Local BEST organizator.</li>
                <li><b>Evaluează la final cursul pe</b> <a href="https://www.best.eu.org" target="_blank">www.best.eu.org</a>.</li>
              </ol>
              <p style="margin-top:1.2em;"><strong>Ai întrebări?</strong><br>
              Ia legătura cu noi prin responsabilul de cursuri de sezon prin telefon la număr, email la adresă sau prin formularul de contact.</p>
            </div>
          </div>

          <div v-if="activeTab === 'scrisoare'">
            <h3><i class="fa-solid fa-pen-nib"></i> Cum arată o scrisoare de motivație?</h3>
            <div style="max-width:900px;margin:0 auto;line-height:1.7;font-size:1.08rem;">
              <p>Pentru orice curs vă decideţi să aplicaţi, trebuie să ştiţi că este necesară o scrisoare de motivaţie, în funcţie de care Grupurile Locale BEST din toată Europa îşi vor selecta participanţii. Criteriile de selecţie variază de la un grup la altul, dar scrisoarea de motivaţie are cu siguranţă cea mai mare pondere în alegerea participanţilor.</p>
              <p>Nu există o reţetă perfectă, datorită multitudinii de criterii, dar cu siguranţă organizatorii vor vrea să ştie:</p>
              <ul style="margin-bottom:1.2em;">
                <li><b>Cine eşti?</b> Care îţi sunt studiile, pasiunile, care sunt cunoştinţele tale în domeniul cursului şi cum îţi place să te distrezi. Prezentarea ta nu trebuie să fie lungă, dar să cuprindă informaţii relevante despre preocupările tale, şi despre cum ai putea contribui tu la formarea unui grup de participanţi diversificat şi receptiv.</li>
                <li><b>De ce ai ales cursul acesta?</b> Citeşte cu atenţie descrierea cursului şi ai grijă, în cazul în care aplici la mai multe cursuri să nu le încurci. Grupurile BEST vor fi curioase să audă motivaţia ta şi de multe ori aceasta cântăreşte cel mai mult în decizia lor. Scrie motive specifice! Aşa vor şti că scrisoarea ta nu e una standard cu care aplici la toate cursurile şi interesul tău e real!</li>
                <li><b>De ce ai ales oraşul/ţara aceasta?</b> Vrei sau nu, cei care vor face selecţia, întotdeauna se vor simţi puţin gâdilaţi în orgoliu dacă le dai şi un motiv legat de ţara lor pentru care vrei să mergi acolo! Nu insista însă prea mult căci există riscul să dai impresia că mergi acolo ca turist şi cursurile cad pe locul doi.</li>
              </ul>
              <p>Dacă la aceste informaţii adaugi şi puţină originalitate în formulare, cu siguranţă că vei avea o şansă în plus. Oricine apreciază simţul umorului şi creativitatea aşa că nu ezita să le foloseşti când ai ocazia.</p>
              <p style="margin-top:1.2em;">Acum nu mai rămâne decât să aplici! Fă-ţi curaj, apucă-te de scris şi poţi petrece o săptămână cum nici nu ai îndrăznit să speri.</p>
            </div>
          </div>

          <div v-if="activeTab === 'validare'">
            <h3><i class="fa-solid fa-user-check"></i> Cum se validează contul?</h3>
            <div style="max-width:900px;margin:0 auto;line-height:1.7;font-size:1.08rem;">
              <p>Pentru ca aplicaţia ta la curs să devină vizibilă, trebuie să ai contul activat.</p>
              <p style="margin-bottom:0.7em;"><strong>Cum îmi activez contul?</strong></p>
              <p>Trimite-ne un mesaj prin formularul de contact, specificând următoarele:</p>
              <ul style="margin-bottom:1.2em;">
                <li><b>Numele complet</b></li>
                <li><b>Adresa de email</b></li>
                <li><b>Numărul de telefon</b></li>
                <li><b>Facultatea</b></li>
                <li><b>Anul universitar</b></li>
                <li><b>Când eşti disponibil pentru a fi contactat telefonic</b></li>
              </ul>
              <p>Te vom contacta telefonic pentru confirmarea cererii şi pentru o scurtă conversaţie în limba engleză.</p>
              <p style="margin-top:1.2em;">Dacă totul este în regulă, vei avea contul activat în cel mai scurt timp.</p>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section id="rules" class="section-padding" style="background: linear-gradient(to right, #fdfbfb, #ebedee);">
        <div class="blob-bg" style="background: var(--pink-soft); top: 12%; left: 15%; width: 210px; height: 210px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; z-index:0; position:absolute; filter: blur(8px); opacity:0.30;"></div>
      <div class="rules-grid">
        <div class="rules-column" data-aos="fade-right">
          <h2 style="font-size: 2rem;"><i class="fa-solid fa-gift" style="color: var(--pink-pop)"></i> Beneficii</h2>
          <div class="rule-card" style="font-size:1.08rem;line-height:1.7;max-width:900px;">
            <p><b>Organizatorii vă vor oferi fără niciun cost suplimentar:</b></p>
            <ul style="margin-bottom:1.2em;">
              <li>Un „kit de supravieţuire” care conţine informaţii despre eveniment. Acest kit va fi oferit cu cel puţin trei săptămâni înaintea începerii evenimentului.</li>
              <li>Aproximativ 20 de ore de cursuri academice pe săptămână (cursuri, vizite la companii, studii de caz, lucru de laborator şi sesiuni de training)</li>
              <li>Materiale de curs scrise în limba engleză</li>
              <li>Un certificat de participare</li>
              <li>Transport gratuit la sesiunile de curs şi la toate activităţile organizate</li>
              <li>Un program cultural/social</li>
              <li>Trei mese pe zi, cel puţin o masă caldă, pe parcursul întregului eveniment, inclusiv în weekend</li>
              <li>Facilităţi de dormit corespunzătoare precum şi acces la un duş</li>
            </ul>
            <p><b>Ce nu este inclus:</b></p>
            <ul style="margin-bottom:1.2em;">
              <li>Călătoria la eveniment şi întoarcerea de la acesta</li>
              <li>Băuturi şi alimente suplimentare</li>
              <li>Unele din activităţile de seară (de exemplu biletul la club)</li>
              <li>Asigurarea de călătorie şi de sănătate</li>
            </ul>
          </div>
        </div>
        <div class="rules-column" data-aos="fade-left">
          <h2 style="font-size: 2rem;"><i class="fa-solid fa-shield-halved" style="color: var(--blue-sky)"></i> Responsabilităţi</h2>
          <div class="rule-card" style="font-size:1.08rem;line-height:1.7;max-width:900px;">
            <p><b>Există anumite cerinţe care trebuie respectate pentru a putea participa la un eveniment BEST:</b></p>
            <ul style="margin-bottom:1.2em;">
              <li>Dacă eşti sigur că vei participa la un curs unde ai fost acceptat, nu uita să achiţi acest depozit către Grupul Local BEST Brașov. Este necesar, pentru a confirma participarea la eveniment.</li>
              <li>În timpul evenimentului, participanţii trebuie să se comporte într-o manieră civilizată, respectând oamenii, independent de naţionalitate sau convingerile lor şi în conformitate cu legile ţării în care evenimentul are loc.</li>
              <li>Participanţii trebuie să informeze grupul Local BEST care organizează evenimentul despre data de sosire la locaţia specificată pe site-ul evenimentului cu cel puțin o săptămâna înainte de începerea evenimentului.</li>
              <li>Participanţii trebuie să sosească la locaţia specificată pe site-ul evenimentului cel târziu în Ziua Sosirii la oră specificată. Participanţii urmând să plece cel mai devreme în Ziua Plecării.</li>
              <li>La evenimentele cu o componentă academică, participanţii trebuie să fie prezenţi la întreaga parte academică a evenimentului. Participanţii trebuie să fie la timp la începutul sesiunilor academice.</li>
              <li>Participanţii trebuie să participe activ la toate activităţile și nu pot părăsi grupul cu excepţia cazurilor convenite cu organizatorii.</li>
              <li>În timpul evenimentului participanţii trebuie să plătească taxa de participare specificată, această taxă variind în funcţie de țara din care provin.</li>
              <li>Participanţii nu pot consuma băuturi alcoolice sau să fie sub influența băuturilor alcoolice în timpul cursurilor academice, sau alte activităţi stabilite în avans de către organizatori.</li>
              <li>Dacă nu sunt motive medicale, participanţii nu pot consuma substanţe cu efect stupefiant sau medicamente cu efecte similare.</li>
              <li>Participanţii nu vor dormi în timpul cursurilor academice sau în timpul altor activităţi stabilite de organizatori.</li>
              <li>Participanţii vor trebui să plătească orice obiecte deteriorate, dacă se dovedeşte că a fost deteriorat de către aceştia.</li>
              <li>Participanţii au obligaţia de a completa formularul de evaluare a evenimentului, pe site-ul BEST, după participare. Acest lucru trebuie făcut înainte de termenul limită specificat pe site-ul BEST.</li>
            </ul>
            <p style="margin-top:1.2em;"><b>Important:</b> Depozitul va fi returnat după ce ai participat la eveniment, ţi-ai respectat responsabilităţile și ai răspuns la mai mult de 70% din întrebările din formularul de evaluare de pe site-ul BEST.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="section-padding" style="background: #fdfbfb;">
        <div class="blob-bg" style="background: var(--pink-soft); top: 18%; left: 75%; width: 160px; height: 160px; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; z-index:0; position:absolute; filter: blur(8px); opacity:0.22;"></div>
      <h2 class="text-center">Întrebari Frecvente</h2>
      <div class="faq-container">
        <div class="faq-item" v-for="(faq, i) in faqs" :key="i" @click="faq.open = !faq.open" :class="{ open: faq.open }">
          <div class="faq-question">
            <h4>{{ faq.question }}</h4>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div class="faq-answer" v-if="faq.open">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="responsible" class="section-padding" style="background: linear-gradient(to bottom, #fff, #fff0f5);">
      <h2 class="text-center" data-aos="zoom-in">Responsabil Vivaldi</h2>

      <div class="responsible-wrapper" data-aos="flip-up">
        <div class="responsible-card mouse-hover">
          <img src="/images/diana.jpg" class="resp-img" alt="Diana Georgescu">
          <div class="resp-content">
            <h3>Diana Georgescu</h3>
            <p style="margin-bottom: 8px;">Ea se asigură că ajungi cu bine la destinație și că ai cea mai tare experiență academică. Orice întrebare ai, ea este persoana potrivită!</p>
            <p style="font-size: 1rem; color: var(--blue-sky); font-weight: 600; margin: 0;">
              <i class="fa-solid fa-envelope"></i> diana.georgescu@best-eu.org
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding" style="background: #fff;">
      <h2 class="text-center" style="margin-bottom: 40px;">Wall of Memories</h2>
      <div class="gallery-wrapper">
        <img
            v-for="(img, index) in wallPhotos"
            :key="index"
            :src="`/images/wallofmemories/${img}`"
            class="gallery-img"
            data-aos="fade-up"
            :alt="'Memory ' + index"
        >
      </div>
    </section>

    <section id="contact" class="section-padding">
        <div class="blob-bg" style="background: var(--pink-soft); top: 10%; left: 10%; width: 180px; height: 180px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; z-index:0; position:absolute; filter: blur(8px); opacity:0.28;"></div>
      <h2 class="text-center" style="margin-bottom: 50px;">Hai sa povestim</h2>
      <div class="contact-box" data-aos="zoom-in">
        <div class="contact-info">
          <h3>BEST Brasov</h3>
          <p>bv-board@best-eu.org</p>
        </div>
        <div class="contact-form">
          <form>
            <input type="text" placeholder="Numele tău" class="mouse-hover">
            <input type="email" placeholder="Email" class="mouse-hover">
            <textarea rows="3" placeholder="Mesaj..." class="mouse-hover"></textarea>
            <button type="button" class="btn-pop mouse-hover" style="width: 100%;">Trimite Mesaj</button>
          </form>
        </div>
      </div>
    </section>

    <footer>
      <div class="text-center" style="padding: 60px 40px;">
        <h2 style="color: var(--blue-sky); margin-bottom: 20px;">BEST Travel</h2>

        <div class="footer-socials" style="margin-bottom: 25px;">
          <a href="https://www.instagram.com/bestbrasov/" target="_blank" class="social-icon">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/BESTBrasov" target="_blank" class="social-icon">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
        </div>

        <p style="font-size: 0.9rem; opacity: 0.6;">
          Designed with <i class="fa-solid fa-heart" style="color:var(--pink-pop)"></i> for BEST Brasov
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Typed from 'typed.js';
import VanillaTilt from 'vanilla-tilt';

const cursorDot = ref(null);
const cursorOutline = ref(null);
const typedText = ref(null);
const tiltElements = ref([]);
const sakuraContainer = ref(null);

const isModalOpen = ref(false);
const currentModalData = ref({});

const coursesList = ref([
  {
    city: 'Bordeaux',
    country: 'France',
    title: 'Surf on an ecological wave: Designing the next gen surf Board',
    dates: '14 - 21 June 2026',
    fee: '70.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2mno9q',
    img: 'https://st4.depositphotos.com/1000633/38184/i/450/depositphotos_381841026-stock-photo-bordeaux-france-june-2016-place.jpg'
  },
  {
    city: 'Istanbul',
    country: 'Turkiye',
    title: 'The Wolf of Digital Street: Sell Me This Product!',
    dates: '17 - 24 June 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11q',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Maribor',
    country: 'Slovenia',
    title: 'Pax Informatica: Advanced usage of Generative AI and LLMs',
    dates: '27 June - 4 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3ljmak',
    img: 'https://media.istockphoto.com/id/1163181078/photo/maribor-and-its-bridges-over-drava-river.jpg?s=612x612&w=0&k=20&c=cJwvBcBqGpx7tYVDf0KabnXy_U0eVYoLOipgaMmGTbQ='
  },
  {
    city: 'Tallinn',
    country: 'Estonia',
    title: 'Think Like a CFO, Act Like a Leader - The Basics of Finance, Investing & Leadership',
    dates: '28 June - 8 July 2026',
    fee: '75.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=o1nrq8q',
    img: 'https://media.digitalnomads.world/wp-content/uploads/2021/03/20120553/tallinn-digital-nomads-1024x683.jpg'
  },
  {
    city: 'Louvain-la-Neuve',
    country: 'Belgium',
    title: 'Giving shape to the unknown: Machine Design and Rapid Prototyping',
    dates: '2 - 11 July 2026',
    fee: '85.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11y',
    img: 'https://blog.martinshotels.com/content/images/2024/11/12-MLLN-vue-aerienne-2022-PTE-CMYK---copyright-Simon-Schmitt.jpg'
  },
  {
    city: 'Istanbul',
    country: 'Turkiye',
    title: 'Paradise on Marketing: Where Brands Catch Waves',
    dates: '4 - 12 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3ljmah',
    img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Košice',
    country: 'Slovakia',
    title: 'Lord of the Things: Create your own smart household with IoT!',
    dates: '5 - 12 July 2026',
    fee: '65.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=i4afz2n',
    img: 'https://s.inyourpocket.com/gallery/253753.jpg'
  },
  {
    city: 'Patras',
    country: 'Greece',
    title: 'Journal 4: Clean energy, New technologies & suSTANable buildings',
    dates: '5 - 13 July 2026',
    fee: '72.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=i4afz2p',
    img: 'https://www.greeka.com/photos/peloponnese/patra/hero/patra-1920.jpg'
  },
  {
    city: 'Skopje',
    country: 'North Macedonia',
    title: 'Designing Digital Experiences: Why Some Apps Feel Amazing',
    dates: '5 - 13 July 2026',
    fee: '66.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11g',
    img: 'https://cdn.tripspoint.com/uploads/photos/5106/skopje-city-tour-the-best-of-skopje_VlPmA.jpeg'
  },
  {
    city: 'Leuven',
    country: 'Belgium',
    title: 'Double Trouble: When Physical Systems Go Digital',
    dates: '7 - 16 July 2026',
    fee: '100.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11n',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/4e/92/c5/old-market-square-oude.jpg?w=1200&h=700&s=1'
  },
  {
    city: 'Vienna',
    country: 'Austria',
    title: "Gru's Guide for Minion Space Engineering: Tonight we steal the moon!",
    dates: '11 - 19 July 2026',
    fee: '75.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11k',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/78/c3/76/caption.jpg?w=1200&h=-1&s=1'
  },
  {
    city: 'Iași',
    country: 'Romania',
    title: 'Empowered Diversity: International Mobility, Wellbeing, and Inclusive Campus Cultures',
    dates: '11 - 22 July 2026',
    fee: '50.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=g59bx2x',
    img: 'https://covinnus.com/wp-content/uploads/2021/11/Palace-of-Culture-Iasi.jpg'
  },
  {
    city: 'Bucharest',
    country: 'Romania',
    title: 'Once Upon a Model: Bring Your Design Concepts to Life in Software',
    dates: '12 - 21 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2mno9k',
    img: 'https://static01.nyt.com/images/2018/11/18/travel/18Hours-Bucharest1/18Hours-Bucharest1-superJumbo-v3.jpg'
  },
  {
    city: 'Wrocław',
    country: 'Poland',
    title: 'Racing against hackers: Advanced Cybersecurity and Digital Forensics for IoT',
    dates: '14 - 22 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=i4afz2k',
    img: 'https://wa-uploads.profitroom.com/hastonoldtown/1920x850/17472937705063_wroclove.jpeg'
  },
  {
    city: 'Coimbra',
    country: 'Portugal',
    title: 'Space Safety: Your Guide to the Final Frontier',
    dates: '15 - 24 July 2026',
    fee: '90.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2co30m',
    img: 'https://images.winalist.com/blog/wp-content/uploads/2025/03/23063825/adobestock-164104316-1500x734.jpeg'
  },
  {
    city: 'Chișinău',
    country: 'Moldova',
    title: 'When Code Makes Decisions: A Gentle Introduction to Agentic AI',
    dates: '21 - 28 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3ljman',
    img: 'https://www.aviontourism.com/images/1260-2600-fix/573c3c8e-00d8-4a30-9384-3aeddfa9f5fc'
  },
  {
    city: 'Aveiro',
    country: 'Portugal',
    title: 'Data Science: Turning Stranger Data the Rightside Up',
    dates: '22 - 29 July 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2mno9n',
    img: 'https://bulgarianonthego.blog/wp-content/uploads/2022/05/things-to-do-in-aveiro-25-min.jpg'
  },
  {
    city: 'Rome',
    country: 'Italy',
    title: 'Fly Me To The Moon: Engineering The BEST Space Supply Chain',
    dates: '26 July - 1 August 2026',
    fee: '70.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11s',
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Messina',
    country: 'Italy',
    title: 'TRON: The Rise of Autonomous Vehicles',
    dates: '26 July - 2 August 2026',
    fee: '50.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11j',
    img: 'https://www.sightseeing-experience.com/magazine/wp-content/uploads/2024/08/AdobeStock_46229260-scaled.jpeg'
  },
  {
    city: 'Mostar',
    country: 'Bosnia and Herzegovina',
    title: 'Attention Economy: How Brands Win Minds',
    dates: '26 July - 1 August 2026',
    fee: '70.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2co30g',
    img: 'https://media.cntraveller.com/photos/650c037b9a4941357e144469/16:9/w_2112,h_1188,c_limit/Mostar,%20Bosnia%20and%20Herzegovina-GettyImages-909655800.jpeg'
  },
  {
    city: 'Cluj-Napoca',
    country: 'Romania',
    title: 'Where is Perry? Bring your own Summer Invention to life!',
    dates: '27 July - 3 August 2026',
    fee: '70.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=i4afz2d',
    img: 'https://cdn.britannica.com/09/226309-050-F0352A58/City-of-Cluj-Napoca-in-Romania.jpg'
  },
  {
    city: 'Belgrade',
    country: 'Serbia',
    title: 'The Alchemy of Startup Creation: Turn Your Idea into Gold!',
    dates: '8 - 15 August 2026',
    fee: '60.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=g59bx3h',
    img: 'https://lp-cms-production.imgix.net/2023-03/shutterstockRF_383722246.jpg'
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    title: 'Hash me if you can: Blockchain most wanted',
    dates: '14 - 23 August 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=k3bk11v',
    img: 'https://www.gokitetours.com/wp-content/uploads/2025/01/Top-10-Must-See-Tourist-Attractions-in-Prague-Czech-Republic.webp'
  },
  {
    city: 'Ljubljana',
    country: 'Slovenia',
    title: 'Solving Cold Cases in the Genome: Mystery of Gene and Cell Therapies',
    dates: '24 - 31 August 2026',
    fee: '80.0€',
    link: 'https://best-eu.org/event/details.jsp?activity=m2co30y',
    img: 'https://images.goway.com/production/hero_image/Ljubljana_Slovenia_AdobeStock_262853364.jpeg'
  }
]);

const wallPhotos = ref([
  'PIQ_0381.JPG',
  'PIQ_0461.JPG',
  'PIQ_9483.jpg',
  'PIQ_9533.jpg',
  'PIQ_9687.jpg',
  'PIQ_9925.jpg',
]);

const activeTab = ref('cine');

const aplicareContent = {
  cine: {
    title: "Cine poate aplica?",
    text: `Orice student din cadrul Universităţii Transilvania poate aplica la cursurile de sezon BEST. Dacă este în an terminal, acesta trebuie să fie student doar în momentul aplicării.`,
    rules: [
      "Un student poate aplica la:",
      " maxim 3 cursuri BEST (BEST Courses)",
      " maxim 3 evenimente despre educație (Symposium on Education)",
      "Un student poate participa la:",
      " maxim 3 cursuri BEST (BEST Courses) în timpul perioadei de studii",
      " maxim 2 cursuri BEST (BEST Courses) în sezoanele de vară",
      " maxim 1 curs BEST (BEST Courses) pe fiecare sezon",
      " maxim 3 evenimente despre educație (Symposium on Education) în timpul perioadei de studii"
    ]
  },
  cum: {
    title: "Procedura de Aplicare",
    steps: [
      "Creează cont pe www.best.eu.org",
      "Scrie o scrisoare de motivație (Motivation Letter)",
      "Răspunde la întrebările specifice cursului",
      "Contactează-ne pentru validarea contului",
      "Plătește depozitul de 40€ (returnabil) după acceptare"
    ]
  },
  motivație: {
    title: "Scrisoarea de Motivație",
    tips: "Organizatorii vor să știe: Cine ești? De ce acest curs? De ce acest oraș? Fii creativ, adaugă puțin umor și evită scrisorile standard!"
  }
};

const faqs = ref([
  {
    question: "Care este taxa maximă pentru un eveniment de educație (Event on Education)?",
    answer: `În ceea ce îi privește pe participanții români, aceștia plătesc o taxă de participare care reprezintă doar <b>60% din costul cursului</b> pe care îl aleg. Această politică tarifară are scopul de a face educația mai accesibilă și de a încuraja membrii comunității să se implice activ la aceste cursuri.`,
    open: false
  },
  {
    question: "Care este motivul pentru care evenimentele BEST au prețuri atât de accesibile?",
    answer: `Grupul Local BEST care se ocupă de organizarea cursurilor face eforturi constante pentru a stabili colaborări cu organizații, companii și universitatea noastră. Scopul acestei colaborări este să strângem fonduri suplimentare pentru a sprijini procesul de organizare al cursurilor BEST. Resursele obținute prin aceste colaborări sunt importante pentru a acoperi diferite costuri necesare, precum materialele de studiu, facilitățile și susținerea financiară pentru participanți. Prin intermediul acestor colaborări se pot menține costurile cât mai accesibile și odată cu acestea și o experiență de învățare de calitate în cadrul programelor BEST.`,
    open: false
  },
  {
    question: "Care este procedura pentru selectarea participanților?",
    answer: `Grupul local BEST organizator primește toate scrisorile de motivație ale studenților care au aplicat pentru curs, urmând să selecteze participanții în funcție de mai multe criterii cum ar fi: locația geografică, având în vedere că de obicei se alege un singur student dintr-un oraș sau o țară; creativitatea și originalitatea scrisorii de motivație prezentate de aplicanți; experiența anterioară a candidaților în domeniul abordat în cadrul cursului.`,
    open: false
  },
  {
    question: "Ce ar trebui să fac în cazul în care nu am fost ales să particip la un eveniment?",
    answer: `Dacă nu ai fost acceptat la evenimentul respectiv, nu trebuie să te descurajezi. În schimb, poți să-ți analizezi aplicația și să lucrezi la îmbunătățirea ei pentru viitoarele oportunități. Aprofundează-ți cunoștințele sau abilitățile și nu ezita să revii cu o aplicație mai pregătită pentru a obține acceptarea în viitor.`,
    open: false
  },
  {
    question: "Se pot obține credite ECTS în urma participării la un eveniment BEST?",
    answer: `După încheierea procesului de evaluare finală în cadrul cursului, vei primi un <b>certificat BEST</b> care servește drept dovadă a participării și va oferi o descriere detaliată a conținutului cursului. Certificatul BEST va fi autentificat prin intermediul ștampilei universității și a semnăturii profesorului coordonator, iar pe lângă acestea, va include informații cu privire la numărul de <b>credite ECTS</b> alocat cursului, oferind astfel o recunoaștere oficială a eforturilor și a performanțelor tale în cadrul acestuia.`,
    open: false
  },
  {
    question: "Trebuie să completez formularul de evaluare online la un moment specific?",
    answer: `Participanții la fiecare curs trebuie să completeze un formular de evaluare după încheierea evenimentului și înainte de data limită specificată pentru fiecare sezon, detaliile fiind disponibile pe pagina aplicare la secțiunea beneficii. În cazul în care un participant omite să furnizeze o evaluare pentru eveniment, acesta va primi doar jumătate din depozitul inițial.`,
    open: false
  },
  {
    question: "Unde pot accesa formularul de evaluare?",
    answer: `Pentru a completa formularul de evaluare este necesar să intri în contul tău și să accesezi secțiunea My Applications, iar acolo îl vei avea disponibil. Asigură-te că ești autentificat pentru a putea accesa acest formular și pentru a-ți exprima evaluarea cu privire la evenimentul respectiv.`,
    open: false
  },
]);

const openModal = (course) => {
  currentModalData.value = course;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const checklistItems = ref([
  { icon: 'fa-solid fa-passport', text: 'Pașaport/ID', checked: false },
  { icon: 'fa-solid fa-utensils', text: 'Mâncare Tradițională', checked: false },
  { icon: 'fa-solid fa-bottle-water', text: 'Apă', checked: false },
  { icon: 'fa-solid fa-camera', text: 'Cameră Foto', checked: false },
  { icon: 'fa-solid fa-flag', text: 'Steag RO', checked: false },
  { icon: 'fa-solid fa-face-smile-wink', text: 'Good Mood', checked: false },
]);

const toggleCheck = (index) => {
  checklistItems.value[index].checked = !checklistItems.value[index].checked;
};

onMounted(() => {
  AOS.init({ duration: 1000, once: true });

  if (tiltElements.value.length) {
    VanillaTilt.init(tiltElements.value);
  }

  new Typed(typedText.value, {
    strings: ['Travel.', 'Learn.', 'Party.', 'Explore.', 'BEST.'],
    typeSpeed: 80, backSpeed: 50, loop: true
  });

  new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    initialSlide: 1,
    coverflowEffect: {
      rotate: 30, stretch: 0, depth: 200, modifier: 1, slideShadows: true,
    },
    pagination: { el: ".swiper-pagination" },
    autoplay: { delay: 3000, disableOnInteraction: false },
  });

  const createPetals = () => {
    const container = sakuraContainer.value;
    if(!container) return;

    const petalCount = 40;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');

      const startLeft = Math.random() * 100;
      // Durata mai mare pentru cădere mai lentă
      const duration = Math.random() * 7 + 13; // 13-20s
      const delay = Math.random() * 8;
      const size = Math.random() * 15 + 10;

      petal.style.left = startLeft + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = delay + 's';

      petal.style.position = 'absolute';
      petal.style.background = '#ff9a9e';
      petal.style.borderRadius = '150% 0 150% 0';
      petal.style.top = '-10%';
      petal.style.opacity = '0.45'; // Mai transparent

      container.appendChild(petal);
    }
  };
  createPetals();

  const hoverElements = document.querySelectorAll('.mouse-hover');
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    if(cursorDot.value) {
      cursorDot.value.style.left = `${posX}px`;
      cursorDot.value.style.top = `${posY}px`;
    }
    if(cursorOutline.value) {
      cursorOutline.value.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    }
  });

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
});
</script>

<style>
:root {
  --pink-pop: #ff9a9e;
  --pink-soft: #fad0c4;
  --blue-sky: #a18cd1;
  --blue-soft: #fbc2eb;
  --accent-gold: #ffdd00;
  --text-main: #2d3748;
  --white: #ffffff;
  --shadow-pop: 0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 20px -6px rgba(0, 0, 0, 0.05);
  --radius-blob: 30px;
}

* { margin: 0; padding: 0; box-sizing: border-box; cursor: auto; }

html, body {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Nunito', sans-serif;
  color: var(--text-main);
  line-height: 1.6;
}

.landing-container {
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

#sakura-container {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 999;
  pointer-events: none;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -10%;
  background: var(--pink-pop);
  border-radius: 150% 0 150% 0;
  opacity: 0.45;
  animation: fall linear infinite;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 999;
}

@keyframes fall {
  0% { top: -10%; transform: translateX(0) rotate(0deg); opacity: 0; }
  15% { opacity: 0.45; }
  100% { top: 110%; transform: translateX(50px) rotate(360deg); opacity: 0; }
}

.side-decorations {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 1;
}

.deco-lantern {
  position: absolute; width: 40px; height: 60px;
  animation: floatLantern 5s ease-in-out infinite;
}

.footer-socials {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  font-size: 1.8rem;
  color: var(--text-main);
  transition: all 0.3s ease;
  opacity: 0.7;
  text-decoration: none;
}

.social-icon:hover {
  opacity: 1;
  transform: translateY(-5px);
}

.social-icon .fa-instagram:hover {
  color: #E1306C;
}

.social-icon .fa-facebook-f:hover {
  color: #1877F2;
}

.lantern-body {
  width: 100%; height: 100%; background: var(--pink-pop);
  border-radius: 10px; opacity: 0.7; box-shadow: 0 5px 15px rgba(255, 154, 158, 0.4);
}
.lantern-string {
  position: absolute; top: -100px; left: 50%; width: 2px; height: 100px;
  background: #ccc; transform: translateX(-50%);
}
.left-lantern { top: 30%; left: 3%; }
.right-lantern { top: 60%; right: 3%; animation-delay: 1s; }

@keyframes floatLantern {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.paper-plane {
  position: absolute; top: 20%; left: -50px;
  font-size: 2rem; color: var(--blue-sky); opacity: 0.6;
  animation: flyPlane 15s linear infinite;
}
@keyframes flyPlane {
  0% { transform: translate(-50px, 0) rotate(10deg); }
  100% { transform: translate(110vw, 20vh) rotate(20deg); }
}

@media (max-width: 1024px) {
  .side-decorations { display: none; }
}

.cursor-dot, .cursor-outline {
  display: none;
  position: fixed; top: 0; left: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 10000;
  pointer-events: none;
}
.cursor-dot { width: 8px; height: 8px; background-color: var(--pink-pop); }
.cursor-outline {
  width: 40px; height: 40px;
  border: 2px solid var(--pink-pop);
  transition: width 0.2s, height 0.2s, background-color 0.2s;
}
:global(body.hovering) .cursor-outline {
  width: 60px; height: 60px;
  background-color: rgba(255, 154, 158, 0.1);
  border-color: transparent;
}

h1, h2, h3, h4 { font-family: 'Fredoka', sans-serif; font-weight: 700; }
.highlight { color: var(--pink-pop); }
.section-padding { padding: 120px 8%; position: relative; z-index: 2;}
.text-center { text-align: center; }
h2 { font-size: 3rem; margin-bottom: 40px; letter-spacing: -1px; color: #1a202c; }

.btn-pop {
  display: inline-block; padding: 16px 45px;
  background: linear-gradient(45deg, var(--pink-pop), #ec77ab);
  color: white; border-radius: 50px; font-weight: 700;
  text-decoration: none; box-shadow: 0 10px 25px rgba(255, 154, 158, 0.4);
  transition: all 0.3s; border: none; font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem; cursor: pointer; letter-spacing: 0.5px;
}
.btn-pop:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(255, 154, 158, 0.6); }

nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 5%; position: fixed; width: 90%; left: 5%; top: 20px;
  border-radius: 50px; background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px); box-shadow: var(--shadow-pop);
  z-index: 1000; border: 1px solid rgba(255,255,255,0.8);
}
.logo { font-size: 1.5rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
.nav-links a { margin-left: 25px; text-decoration: none; color: var(--text-main); font-weight: 700; transition: 0.3s; font-size: 1rem;}
.nav-links a:hover { color: var(--pink-pop); }

.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center; text-align: center;
  position: relative; padding-top: 80px; z-index: 1;
}
.hero h1 { font-size: 5rem; margin-bottom: 25px; line-height: 1.1; letter-spacing: -2px; font-weight: 800; }
.hero p { font-size: 1.25rem; opacity: 0.8; max-width: 600px; margin: 0 auto; }
.blob-bg {
  position: absolute; filter: blur(90px); z-index: -1; opacity: 0.5;
  animation: floatBlob 10s infinite alternate;
}
@keyframes floatBlob { from { transform: translate(0,0); } to { transform: translate(30px, -30px); }}

.stats-bar {
  display: flex; justify-content: center; gap: 50px; flex-wrap: wrap;
  padding: 40px; background: rgba(255,255,255,0.6); backdrop-filter: blur(10px);
  margin: 0 10%; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transform: translateY(-50px); z-index: 5; position: relative;
}
.stat-item { text-align: center; }
.stat-item h3 { font-size: 2.5rem; color: var(--blue-sky); margin-bottom: 5px; }
.stat-item p { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem; opacity: 0.7; }

.card-container {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px; padding: 20px;
}
.tilt-card {
  background: var(--white); border-radius: var(--radius-blob); padding: 40px 30px;
  box-shadow: var(--shadow-pop); transform-style: preserve-3d;
  transform: perspective(1000px); text-align: center;
  border: 1px solid rgba(255,255,255,0.5);
}
.tilt-icon { font-size: 3.5rem; margin-bottom: 25px; transform: translateZ(30px); display: inline-block; }
.tilt-card h3 { font-size: 1.5rem; margin-bottom: 15px; }
.tilt-card p { opacity: 0.7; }

.swiper { width: 100%; padding-top: 50px; padding-bottom: 60px; }
.swiper-slide {
  background-position: center; background-size: cover;
  width: 340px; height: 500px; border-radius: 35px;
  overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  position: relative; transition: 0.3s;
}
.swiper-slide:hover { transform: scale(1.02); }
.slide-content {
  position: absolute; bottom: 0; left: 0; width: 100%;
  padding: 40px 25px;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%);
  color: white; transform: translateY(10px); transition: 0.4s;
}
.swiper-slide:hover .slide-content { transform: translateY(0); }
.badge { background: var(--accent-gold); color: black; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.75rem; display: inline-block; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;}

.process-container { display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap; text-align: center; }
.process-step { flex: 1; min-width: 250px; padding: 20px; }
.step-num {
  width: 60px; height: 60px; background: var(--pink-pop); color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 800; margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(255, 154, 158, 0.4);
}
.process-line { width: 100px; height: 4px; background: #eee; border-radius: 2px; }

@media (max-width: 768px) {
  .process-line { display: none; }
  .process-container { flex-direction: column; gap: 50px; }
}

.faq-container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.faq-item {
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: 0.3s;
  border: 1px solid #f0f0f0;
}
.faq-question {
  padding: 25px; display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; background: #fff;
}
.faq-question h4 { margin: 0; font-size: 1.1rem; }
.faq-answer { padding: 0 25px 25px; color: #666; display: none; }
.faq-item.open .faq-answer { display: block; animation: fadeIn 0.3s; }
.faq-item.open .faq-question { color: var(--pink-pop); }
.faq-item.open i { transform: rotate(180deg); transition: 0.3s; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(40, 40, 40, 0.6); backdrop-filter: blur(10px);
  z-index: 9999; display: flex; justify-content: center; align-items: center;
  transition: 0.4s ease;
}
.modal-content {
  background: white; width: 90%; max-width: 550px;
  border-radius: 40px; padding: 40px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  text-align: center; position: relative; border: none;
}
.modal-close {
  position: absolute; top: 20px; right: 20px;
  background: #f1f1f1; color: #333;
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; cursor: pointer; transition: 0.3s;
}
.modal-close:hover { background: var(--pink-pop); color: white; transform: rotate(90deg); }
.modal-img {
  width: 100%; height: 250px; object-fit: cover;
  border-radius: 25px; margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
.modal-title { color: var(--text-main); font-size: 2.2rem; margin-bottom: 10px; }
.modal-desc { color: #666; font-size: 1.05rem; line-height: 1.7; margin-bottom: 30px; }
.modal-header-info { display: flex; justify-content: center; gap: 10px; margin-bottom: 15px; }

.checklist-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 25px; margin-top: 40px; }
.check-item {
  background: white; padding: 25px; border-radius: 25px; text-align: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: 0.3s; border: 2px solid transparent;
}
.check-item.checked { border-color: #4ade80; background: #f0fdf4; transform: scale(0.95); }
.check-item i { font-size: 2.2rem; margin-bottom: 15px; color: var(--blue-sky); }
.check-item p { font-weight: 600; }

.responsible-wrapper { display: flex; justify-content: center; margin-top: 30px; }
.responsible-card {
  display: flex; align-items: center; background: white;
  padding: 40px; border-radius: 40px; max-width: 800px; width: 100%;
  box-shadow: var(--shadow-pop); border: 2px solid var(--pink-soft);
  gap: 40px; transition: 0.3s;
}
.responsible-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(255, 154, 158, 0.2); }
.resp-img { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 5px solid var(--pink-pop); }
.resp-content { text-align: left; }
.resp-content h3 { font-size: 2rem; color: var(--text-main); margin-bottom: 5px; }
.resp-role { color: var(--pink-pop); font-weight: 800; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
.resp-content p { margin-top: 15px; opacity: 0.8; }
.resp-socials { margin-top: 20px; font-size: 1.5rem; color: #aaa; }
.resp-socials i { margin-right: 15px; transition: 0.3s; cursor: pointer; }
.resp-socials i:hover { color: var(--blue-sky); }

@media(max-width: 768px) {
  .responsible-card { flex-direction: column; text-align: center; }
  .resp-content { text-align: center; }
}

.gallery-wrapper { column-count: 3; column-gap: 25px; }
.gallery-img {
  width: 100%; border-radius: 25px; margin-bottom: 25px;
  transition: transform 0.4s ease; box-shadow: var(--shadow-pop);
  filter: grayscale(20%);
}
.gallery-img:hover { transform: scale(1.03); filter: grayscale(0%); z-index: 2; position: relative;}

.contact-box {
  background: var(--white); border-radius: 40px; box-shadow: var(--shadow-pop);
  overflow: hidden; display: flex; flex-wrap: wrap; position: relative;
}
.contact-info { flex: 1; padding: 60px; background: linear-gradient(135deg, var(--blue-sky), #8fd3f4); color: white; display: flex; flex-direction: column; justify-content: center; }
.contact-info h3 { font-size: 2.5rem; margin-bottom: 10px; }
.contact-form { flex: 1.5; padding: 60px; }
input, textarea {
  width: 100%; padding: 18px 25px; margin-bottom: 25px;
  border: 2px solid #f0f0f0; border-radius: 18px; background: #fcfcfc; outline: none; transition: 0.3s;
  font-family: inherit;
}
input:focus, textarea:focus { border-color: var(--pink-pop); background: white; }

@media (max-width: 768px) {
  .gallery-wrapper { column-count: 1; }
  .hero h1 { font-size: 3rem; }
  .section-padding { padding: 80px 5%; }
  nav { width: 95%; left: 2.5%; padding: 15px; }
  .nav-links { display: none; }
  .contact-box { flex-direction: column; }
  .stats-bar { gap: 30px; }
}

.tabs-header {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tabs-header button {
  padding: 12px 25px;
  border-radius: 30px;
  border: 2px solid var(--pink-soft);
  background: white;
  font-weight: 700;
  transition: 0.3s;
}

.tabs-header button.active {
  background: var(--pink-pop);
  color: white;
  border-color: var(--pink-pop);
  box-shadow: 0 5px 15px rgba(255, 154, 158, 0.4);
}

.tab-content {
  background: white;
  padding: 70px 60px;
  border-radius: 40px;
  box-shadow: var(--shadow-pop);
  min-height: 400px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.styled-list {
  list-style: none;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.styled-list li::before {
  content: '✦';
  color: var(--pink-pop);
  margin-right: 10px;
  font-weight: bold;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.rule-card {
  background: white;
  padding: 30px;
  border-radius: 30px;
  box-shadow: var(--shadow-pop);
}

.rule-card ul { list-style: none; }
.rule-card li { margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }

.tip-box {
  background: #fff8e1;
  padding: 20px;
  border-radius: 20px;
  margin-top: 20px;
  border-left: 5px solid var(--accent-gold);
}

@media (max-width: 768px) {
  .rules-grid { grid-template-columns: 1fr; }
  .tab-content { padding: 30px 20px; }
}
</style>