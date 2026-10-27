<template>
  <div class="landing-container" :class="{ 'intro-active': introActive }">
    <PetalIntro :label="t('introEnter')" @active="introActive = $event" />
    <a class="skip-link" href="#main-content" :inert="isModalOpen || introActive">{{ t('text000') }}</a>
    <Teleport to="body">
      <div id="sakura-container" ref="sakuraContainer" :class="{ 'intro-paused': introActive }" aria-hidden="true"></div>
    </Teleport>

    <transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-overlay active" @click.self="closeModal">
        <div ref="modalElement" class="modal-content" :class="{ 'gallery-dialog': galleryIndex !== null }" role="dialog" aria-modal="true" :aria-labelledby="galleryIndex !== null ? 'gallery-dialog-title' : 'course-dialog-title'" tabindex="-1">
          <button ref="modalClose" type="button" class="modal-close" :aria-label="t('text001')" @click="closeModal">
            {{ t('text002') }}
          </button>

          <template v-if="galleryIndex !== null">
            <h2 id="gallery-dialog-title" class="sr-only">{{ t('text003') }}</h2>
            <div class="gallery-stage" @touchstart.passive="startGallerySwipe" @touchend.passive="endGallerySwipe">
              <Transition name="photo" mode="out-in">
                <img :key="galleryIndex" :src="`/images/wallofmemories/${wallPhotos[galleryIndex].src}`" :width="wallPhotos[galleryIndex].width" :height="wallPhotos[galleryIndex].height" :alt="t('photo') + (galleryIndex + 1)" decoding="async">
              </Transition>
            </div>
            <div class="gallery-controls">
              <button type="button" @click="changePhoto(-1)">{{ t('text004') }}</button>
              <span role="status" aria-live="polite">{{ galleryIndex + 1 }} / {{ wallPhotos.length }}</span>
              <button type="button" @click="changePhoto(1)">{{ t('text005') }}</button>
            </div>
          </template>
          <template v-else>
          <img :src="getCourseImg(currentModalData)" @error="handleImageError" :alt="currentModalData.city" class="modal-img" width="800" height="500">

          <div class="modal-header-info">
            <span class="badge" style="font-size: 0.9rem;">{{ currentModalData.dates }}</span>
            <span class="badge" style="background: var(--pink-pop); color: white;">{{ currentModalData.fee }}</span>
          </div>

          <h2 id="course-dialog-title" class="modal-title">{{ currentModalData.city }}</h2>
          <h4 style="color: #666; margin-bottom: 15px;">{{ currentModalData.title }}</h4>

          <p class="modal-desc">
            {{ t('text006') }} <strong>{{ currentModalData.country }}</strong>{{ t('text007') }}
          </p>

          <a :href="currentModalData.link" target="_blank" rel="noopener noreferrer" class="btn-pop" style="padding: 10px 30px; font-size: 0.9rem;">
            {{ t('text008') }}
          </a>
          </template>
        </div>
      </div>
    </transition>

    <nav ref="headerElement" :inert="isModalOpen || introActive" :aria-label="t('text009')" @keydown.esc="closeMenu(true)">
      <div class="logo mouse-hover">
        <img src="/images/logo_best_courses.png" :alt="t('text010')" class="nav-logo-img" style="height: 55px">
      </div>
      <button ref="menuToggle" type="button" class="menu-toggle" :aria-expanded="isMenuOpen" aria-controls="navigation-links" :aria-label="t('text011')" @click="isMenuOpen = !isMenuOpen">{{ t('text012') }}</button>
      <div id="navigation-links" class="nav-links" :class="{ 'is-open': isMenuOpen }" @click="closeMenu()">
        <a v-for="item in navigationItems" :key="item.id" :href="`#${item.id}`" class="mouse-hover" :aria-current="activeSection === item.id ? 'location' : undefined">{{ translateText(item.label) }}</a>
      </div>
      <button type="button" class="btn-pop language-toggle" :aria-label="locale === 'ro' ? t('switchEn') : t('switchRo')" @click="toggleLanguage(); closeMenu()"><span :class="{ 'language-current': locale === 'ro' }" lang="ro">RO</span><span aria-hidden="true"> / </span><span :class="{ 'language-current': locale === 'en' }" lang="en">EN</span></button>
    </nav>

    <main id="main-content" tabindex="-1" :inert="isModalOpen || introActive">
    <section id="hero" ref="heroElement" class="hero">
      <div class="hero-copy">
      <p class="hero-season">{{ currentSeasonName.toUpperCase() }}</p>
      <h1>{{ t('text014') }} <span class="hero-typed-line"><span ref="typedText" class="highlight">{{ t('text015') }}</span></span></h1>
      <p>{{ t('text016') }}</p>
      <div class="hero-actions">
        <a href="#courses" class="btn-pop mouse-hover">{{ t('text017') }}</a>
      </div>
      </div>
      <div ref="treeElement" class="hero-art" aria-hidden="true">
        <picture v-if="canopyVisible">
          <img class="cherry-canopy" src="/images/cherry-branches-brushed-1600.webp"
            :srcset="`/images/cherry-branches-brushed-1000.webp ${cherryCanopy.smallWidth}w, /images/cherry-branches-brushed-1600.webp ${cherryCanopy.width}w`"
            sizes="100vw" :width="cherryCanopy.width" :height="cherryCanopy.height"
            alt="" fetchpriority="high" decoding="async" draggable="false"
            @load="onCanopyImageLoad" @error="onCanopyImageError">
        </picture>
      </div>
    </section>

    <section class="stats-bar" data-aos="fade-up">
      <div v-if="isSeasonClosed" class="stat-item">
        <h3 class="season-closed-title">{{ t('text018') }}</h3>
        <p>{{ translateText(seasonDeadlines) }}</p>
      </div>
      <template v-else>
      <div class="stat-item">
        <h3>{{ destinationsCount }}</h3>
        <p>{{ t('text019') }}</p>
      </div>
      <div class="stat-item">
        <h3>{{ averageFeeDisplay }}</h3>
        <p>{{ t('text020') }}</p>
      </div>
      <div class="stat-item">
        <h3>{{ t('text021') }}</h3>
        <p>{{ t('text022') }}</p>
      </div>
      </template>
    </section>

    <section id="about" ref="aboutElement" class="section-padding about-section" aria-labelledby="about-title">
      <div class="about-layout">
      <div class="about-heading">
        <h2 id="about-title">{{ t('text023') }}</h2>
        <svg class="about-blossom" viewBox="0 0 120 100" aria-hidden="true" focusable="false">
          <path d="M18 89C44 70 54 50 87 24M45 65C42 48 36 39 25 29M66 43C82 47 95 43 107 34" fill="none" stroke="#a18cd1" stroke-width="1.8" stroke-linecap="round"/>
          <g fill="#fad0c4" stroke="#ff9a9e" stroke-width="1">
            <path d="M87 24C69 27 67 15 79 13C75 0 90 0 92 12C105 8 111 21 98 26C106 38 93 43 87 32C78 42 67 33 79 26Z"/>
            <path d="M25 29C14 31 12 23 20 21C17 13 26 12 29 20C37 18 41 27 33 30C37 38 28 41 25 34C19 40 12 34 20 30Z"/>
          </g>
          <circle cx="89" cy="24" r="2.5" fill="#a18cd1"/>
          <circle cx="26" cy="28" r="1.8" fill="#a18cd1"/>
        </svg>
      </div>
      <div class="document-copy about-copy"><p>{{ t('text024') }}</p><p>{{ t('text025') }}</p></div>
      </div>
    </section>


    <section id="process" class="section-padding" data-aos="fade-up">
      <svg class="travel-route travel-route-left" viewBox="0 0 100 480" fill="none" aria-hidden="true" focusable="false">
        <path class="travel-route-line" d="M25 20C95 70 5 120 45 180S100 260 45 320S5 400 70 460"/>
        <circle cx="25" cy="20" r="5"/><circle cx="70" cy="460" r="5"/>
      </svg>
      <h2 class="text-center">{{ t('text026') }}</h2>

      <div class="tabs-container">
        <div ref="tabsElement" class="tabs-header" role="tablist" :aria-label="t('text026')" @keydown="handleTabKey">
          <button v-for="tab in guideTabs" :key="tab.id" :id="`tab-${tab.id}`" type="button" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`panel-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1" @click="activeTab = tab.id" :class="{active: activeTab === tab.id}">{{ translateText(tab.label) }}</button>
        </div>

        <div class="tab-content card-pop document-copy">
          <div v-show="activeTab === 'cine'" id="panel-cine" role="tabpanel" aria-labelledby="tab-cine" tabindex="0">
<h3>{{ t('text027') }}</h3>
<p>{{ t('text028') }}</p>
<p>{{ t('text029') }}</p>
<div class="eligibility-grid"><div class="eligibility-col"><h4>{{ t('text030') }}</h4><ul class="guide-list">
<li>{{ t('text031') }}</li>
<li>{{ t('text032') }}</li>
</ul></div><div class="eligibility-col"><h4>{{ t('text033') }}</h4><ul class="guide-list">
<li>{{ t('text034') }}</li>
<li>{{ t('text035') }}</li>
<li>{{ t('text036') }}</li>
<li>{{ t('text037') }}</li>
</ul></div></div>
          </div>

          <div v-show="activeTab === 'cum'" id="panel-cum" role="tabpanel" aria-labelledby="tab-cum" tabindex="0">
<h3>{{ t('text038') }}</h3>
<p>{{ t('text039') }}</p>
<h4>{{ t('text040') }}</h4>
<ul class="guide-list">
<li>{{ t('text041') }} <a href="https://best.eu.org/" target="_blank" rel="noopener noreferrer">{{ t('text042') }}</a> {{ t('text043') }}</li>
<li>{{ t('text044') }}</li>
<li>{{ t('text045') }}</li>
</ul>
<h4>{{ t('text046') }}</h4>
<ol class="guide-list">
<li>{{ t('text047') }} <a href="https://www.best.eu.org/courses/list.jsp" target="_blank" rel="noopener noreferrer">{{ t('text048') }}</a>{{ t('text049') }}</li>
<li>{{ t('text050') }} <a href="https://best.eu.org/account/registration.jsp" target="_blank" rel="noopener noreferrer">{{ t('text051') }}</a>).</li>
<li>{{ t('text052') }} <a href="#responsible">{{ t('text053') }}</a> {{ t('text054') }}</li>
<li>{{ t('text055') }}</li>
<li>{{ t('text056') }}</li>
<li>{{ t('text057') }}</li>
<li>{{ t('text058') }}</li>
<li>{{ t('text059') }}</li>
<li>{{ t('text060') }}</li>
<li>{{ t('text061') }} <a href="https://best.eu.org/account/applications.jsp" target="_blank" rel="noopener noreferrer">{{ t('text042') }}</a>.</li>
</ol>
<h4>{{ t('text062') }}</h4>
<p>{{ t('text063') }} <a href="#responsible">{{ t('text064') }}</a> {{ t('text065') }}</p>
          </div>

          <div v-show="activeTab === 'scrisoare'" id="panel-scrisoare" role="tabpanel" aria-labelledby="tab-scrisoare" tabindex="0">
<h3>{{ t('text066') }}</h3>
<p>{{ t('text067') }}</p>
<p>{{ t('text068') }}</p>
<p>{{ t('text069') }}</p>
<p>{{ t('text070') }}</p>
<p>{{ t('text071') }}</p>
<p>{{ t('text072') }}</p>
<p>{{ t('text073') }}</p>
          </div>

          <div v-show="activeTab === 'validare'" id="panel-validare" role="tabpanel" aria-labelledby="tab-validare" tabindex="0">
<h3>{{ t('text074') }}</h3>
<p>{{ t('text075') }}</p>
<h4>{{ t('text076') }}</h4>
<p>{{ t('text077') }} <a href="#responsible">{{ t('text078') }}</a>{{ t('text079') }}</p>
<ul class="guide-list">
<li>{{ t('text080') }}</li>
<li>{{ t('text081') }}</li>
<li>{{ t('text082') }}</li>
<li>{{ t('text083') }}</li>
<li>{{ t('text084') }}</li>
<li>{{ t('text085') }}</li>
</ul>
<p>{{ t('text086') }}</p>
<p>{{ t('text087') }}</p>
          </div>
        </div>
      </div>
    </section>


    <section id="costs" class="section-padding costs-section" data-aos="fade-up">
      <h2 class="text-center">{{ t('text088') }}</h2>
      <div class="card-container">
        <div class="cost-card"><h3>{{ t('text089') }}</h3><p>{{ t('text059') }}</p></div>
        <div class="cost-card"><h3>{{ t('text090') }}</h3><p>{{ t('text056') }}</p></div>
        <div class="cost-card"><h3>{{ t('text091') }}</h3><p>{{ t('text057') }}</p><p>{{ t('text092') }}</p></div>
      </div>
    </section>

    <section id="courses" class="section-padding" data-aos="fade-up">
      <svg class="travel-route travel-route-right" viewBox="0 0 100 480" fill="none" aria-hidden="true" focusable="false">
        <path class="travel-route-line" d="M70 20C5 80 95 125 55 190S5 270 60 330S95 410 30 460"/>
        <circle cx="70" cy="20" r="5"/><circle cx="30" cy="460" r="5"/>
      </svg>
      <h2 class="text-center" style="margin-bottom: 20px;">{{ t('text093') }}</h2>
      <p v-if="coursesList.length > 0" class="text-center" style="margin-bottom: 28px; color: var(--pink-pop); font-weight: 700; letter-spacing: 1px;">{{ t('text094') }}</p>

      <div v-if="coursesList.length > 0" class="swiper mySwiper">
        <div class="swiper-wrapper">
          <article
              v-for="(course, index) in coursesList"
              :key="index"
              class="swiper-slide mouse-hover"
          >
            <img :src="getCourseImg(course)" @error="handleImageError" :alt="course.city" class="course-image" loading="lazy" width="800" height="1100">
            <span class="slide-content">
              <span class="badge">{{ course.country }}</span>
              <span class="course-city">{{ course.city }}</span>
              <span style="font-size: 0.85rem; opacity: 0.9; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                {{ course.title }}
              </span>
            </span>
            <button type="button" class="course-open" @click="openModal(course)"><span class="sr-only">{{ t('text095') }} {{ course.title }}, {{ course.city }}</span></button>
          </article>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <div v-else class="no-courses-box">
        <div class="no-courses-icon">
          <i class="fa-solid fa-calendar-xmark"></i>
        </div>
        <h3>{{ t('text096') }} {{ currentSeasonName }}</h3>
        <p class="no-courses-desc">
          {{ coursesNotice ? translateText(coursesNotice) : t('emptyFallback') }}
        </p>
        <div v-if="seasonDeadlines" class="no-courses-deadlines">
          <i class="fa-regular fa-clock"></i> {{ translateText(seasonDeadlines) }}
        </div>
        <div>
          <a href="https://www.best.eu.org/courses/list.jsp" target="_blank" rel="noopener noreferrer" class="btn-pop mouse-hover" style="display: inline-block; margin-top: 10px;">
            {{ t('text097') }}
          </a>
        </div>
      </div>
    </section>

    <section id="rules" class="section-padding" data-aos="fade-up">
      <h2 class="text-center">{{ t('text098') }}</h2>
      <div class="rules-grid document-copy">
        <div class="rules-column rules-benefits" :class="{ 'rules-expanded': openRules.benefits }"><h3><button id="benefits-toggle" type="button" class="rules-toggle" :aria-expanded="openRules.benefits" aria-controls="benefits-content" @click="openRules.benefits = !openRules.benefits"><span class="rules-heading-label">{{ t('text099') }}</span><span class="rules-toggle-action">{{ openRules.benefits ? t('collapse') : t('showAll') }}<span class="rules-chevron" aria-hidden="true"></span></span></button></h3><div class="rules-preview"><p>{{ t('text100') }}</p><div class="rules-preview-tags" aria-hidden="true"><span>{{ t('text101') }}</span><span>{{ t('text102') }}</span></div></div><div id="benefits-content" class="rules-disclosure" :class="{ expanded: openRules.benefits }" :inert="!openRules.benefits" :aria-hidden="!openRules.benefits" role="region" aria-labelledby="benefits-toggle"><div class="rules-disclosure-clip"><div class="rule-card"><p>{{ t('text103') }}</p><ul class="guide-list">
<li>{{ t('text104') }}</li>
<li>{{ t('text105') }}</li>
<li>{{ t('text106') }}</li>
<li>{{ t('text107') }}</li>
<li>{{ t('text108') }}</li>
<li>{{ t('text109') }}</li>
<li>{{ t('text110') }}</li>
<li>{{ t('text111') }}</li>
</ul><div class="rules-exclusions"><h4>{{ t('text112') }}</h4><ul class="guide-list">
<li>{{ t('text113') }}</li>
<li>{{ t('text114') }}</li>
<li>{{ t('text115') }}</li>
<li>{{ t('text116') }}</li>
</ul></div></div></div></div></div>
        <div class="rules-column rules-responsibilities" :class="{ 'rules-expanded': openRules.responsibilities }"><h3><button id="responsibilities-toggle" type="button" class="rules-toggle" :aria-expanded="openRules.responsibilities" aria-controls="responsibilities-content" @click="openRules.responsibilities = !openRules.responsibilities"><span class="rules-heading-label">{{ t('text117') }}</span><span class="rules-toggle-action">{{ openRules.responsibilities ? t('collapse') : t('showAll') }}<span class="rules-chevron" aria-hidden="true"></span></span></button></h3><div class="rules-preview"><p>{{ t('text118') }}</p><div class="rules-preview-tags" aria-hidden="true"><span>{{ t('text119') }}</span><span>{{ t('text120') }}</span></div></div><div id="responsibilities-content" class="rules-disclosure" :class="{ expanded: openRules.responsibilities }" :inert="!openRules.responsibilities" :aria-hidden="!openRules.responsibilities" role="region" aria-labelledby="responsibilities-toggle"><div class="rules-disclosure-clip"><div class="rule-card"><p>{{ t('text121') }}</p><ul class="guide-list">
<li>{{ t('text122') }}</li>
<li>{{ t('text123') }}</li>
<li>{{ t('text124') }}</li>
<li>{{ t('text125') }}</li>
<li>{{ t('text126') }}</li>
<li>{{ t('text127') }}</li>
<li>{{ t('text128') }}</li>
<li>{{ t('text129') }}</li>
<li>{{ t('text130') }}</li>
<li>{{ t('text131') }}</li>
<li>{{ t('text132') }}</li>
<li>{{ t('text133') }}</li>
</ul><p class="rules-note">{{ t('text134') }}</p></div></div></div></div>
      </div>
    </section>


    <section id="faq" class="section-padding" data-aos="fade-up">
      <h2 class="text-center">{{ t('text135') }}</h2>
      <div class="faq-container">
        <div class="faq-item" v-for="(faq, i) in faqs" :key="i" :class="{ open: faq.open }">
          <button type="button" class="faq-question" :aria-expanded="faq.open" :aria-controls="`faq-answer-${i}`" @click="faq.open = !faq.open">
            <span>{{ translateText(faq.question) }}</span>
          </button>
          <div :id="`faq-answer-${i}`" class="faq-reveal" :class="{ expanded: faq.open }" :inert="!faq.open" :aria-hidden="!faq.open"><div class="faq-clip"><div class="faq-answer">
            <p v-html="translateText(faq.answer).replace(/<b><b>/g, '<b>').replace(/<\/b><\/b>/g, '</b>')"></p>
          </div></div></div>
        </div>
      </div>
    </section>

    <section id="responsible" class="section-padding" data-aos="fade-up">
      <h2 class="text-center">{{ t('text136') }}</h2>

      <div class="responsible-wrapper">
        <article class="responsible-card mouse-hover">
          <svg class="postcard-stamp" viewBox="0 0 88 106" fill="none" aria-hidden="true" focusable="false">
            <path d="M8 4H80V102H8Z" fill="#fff8fa" stroke="#ff9a9e" stroke-width="5" stroke-dasharray="3 5"/>
            <path d="M17 14H71V92H17Z" stroke="#f3b5c6"/>
            <path d="M44 71C44 60 42 53 44 43M43 58L32 51M44 62L56 53" stroke="#cc8d9e" stroke-width="2" stroke-linecap="round"/>
            <path d="M44 43C27 48 25 35 37 32C30 19 45 16 49 29C60 20 69 32 57 40C70 49 56 59 49 47C42 60 29 52 37 43Z" fill="#fad0c4" stroke="#ff9a9e" stroke-width="1.5"/>
            <circle cx="46" cy="39" r="3" fill="#ec77ab"/>
            <path d="M27 82H61" stroke="#f3b5c6" stroke-linecap="round"/>
          </svg>
          <figure class="resp-polaroid">
            <img src="/images/ioana_vivaldi.jpeg" class="resp-img" :alt="t('text137')" loading="lazy" decoding="async" width="440" height="440">
          </figure>
          <div class="resp-content">
            <h3>{{ t('text137') }}</h3>
            <p class="resp-message">{{ t('text138') }}</p>
            <p class="resp-email-row">
              <a class="resp-email" href="mailto:ioana-bianca.renea@best-eu.org">
                <i class="fa-solid fa-envelope" aria-hidden="true"></i><span>{{ t('text139') }}</span>
              </a>
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="section-padding" data-aos="fade-up">
      <h2 class="text-center" style="margin-bottom: 24px;">{{ t('text003') }}</h2>
      <div class="gallery-wrapper">
        <div v-for="(img, index) in wallPhotos" :key="img.src" class="gallery-memory">
        <svg class="memory-cord" viewBox="0 0 320 42" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 10Q160 38 320 10" fill="none" stroke="#cda6a0" stroke-width="1.5"/></svg>
        <button type="button" class="gallery-trigger" :aria-label="t('openPhoto') + (index + 1)" @click="openGallery(index)"><img
            :src="`/images/wallofmemories/${img.src}`"
            :srcset="`/images/wallofmemories/${img.small} ${img.smallWidth}w, /images/wallofmemories/${img.src} ${img.width}w`"
            sizes="(max-width: 540px) 78vw, (max-width: 1000px) 40vw, 28vw"
            loading="lazy"
            decoding="async"
            :width="img.width"
            :height="img.height"
            class="gallery-img"
            :alt="t('photo') + (index + 1)"
        ></button>
        </div>
      </div>
    </section>


    </main>
    <footer :inert="isModalOpen || introActive">
      <div class="footer-content">
        <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="/images/logo_best_courses.png" :alt="t('text140')" loading="lazy" decoding="async">
        <div class="footer-socials">
          <a href="https://www.instagram.com/bestbrasov/" target="_blank" rel="noopener noreferrer" class="social-icon" :aria-label="t('text141')">
            <i class="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.facebook.com/BESTBrasov" target="_blank" rel="noopener noreferrer" class="social-icon" :aria-label="t('text142')">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
        </div>
        </div>
        <div class="footer-location">
          <div class="footer-location-info">
          <address>{{ t('text143') }}</address>
          <a class="footer-map-link" href="https://www.google.com/maps/search/?api=1&amp;query=BEST%20Bra%C8%99ov%2C%20C%C4%83minul%2015%2C%20Strada%20Universit%C4%83%C8%9Bii%201%2C%20Bra%C8%99ov%20500068" target="_blank" rel="noopener noreferrer">{{ t('text144') }}</a>
          </div>
          <div class="footer-map">
            <iframe :title="t('text145')" src="https://maps.google.com/maps?q=BEST%20Bra%C8%99ov%2C%20C%C4%83minul%2015%2C%20Strada%20Universit%C4%83%C8%9Bii%201%2C%20Bra%C8%99ov%20500068&amp;output=embed" width="600" height="260" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          </div>
        </div>
        </div>
        <div class="footer-bottom">
          <p>{{ t('text146') }}</p>
          <div class="footer-credit">
            <p>{{ t('text147') }}</p>
            <a class="footer-best-link" href="https://bestbrasov.ro/" target="_blank" rel="noopener noreferrer" :aria-label="t('bestBrasovWebsite')">
              <img src="/images/best-brasov-logo.webp" alt="BEST Brașov" width="240" height="122" loading="lazy" decoding="async">
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import coursesData from './courses.json';
import galleryData from './gallery.json';
import cherryCanopy from './cherry-canopy.json';
import Typed from 'typed.js';
import { useLanguage } from './i18n.js';
import PetalIntro from './components/PetalIntro.vue';

const introActive = ref(false);
const { locale, t, translateText, toggleLanguage } = useLanguage();
watch(locale, async () => {
  document.documentElement.lang = locale.value;
  document.title = t('pageTitle');
  const metadata = {
    'meta[name="description"]': t('description'),
    'meta[property="og:title"]': t('ogTitle'),
    'meta[property="og:description"]': t('ogDescription'),
    'meta[property="og:locale"]': locale.value === 'ro' ? 'ro_RO' : 'en_GB',
    'meta[name="twitter:title"]': t('ogTitle'),
    'meta[name="twitter:description"]': t('twitterDescription'),
  };
  for (const [selector, content] of Object.entries(metadata)) document.querySelector(selector)?.setAttribute('content', content);
  await nextTick();
  updateTabIndicator();
  previousIntroProgress = null;
  queueIntroTransition();
}, { immediate: true });

const headerElement = ref(null);
const heroElement = ref(null);
const aboutElement = ref(null);
let introFrame = 0;
let introObserver;
let previousIntroProgress = null;
function updateIntroTransition() {
  introFrame = 0;
  const hero = heroElement.value;
  const about = aboutElement.value;
  if (!hero || !about) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rect = hero.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * .75)));
  const progressKey = reduced ? -1 : progress;
  if (previousIntroProgress === progressKey) return;
  previousIntroProgress = progressKey;
  const eased = progress * progress * (3 - 2 * progress);
  hero.style.setProperty('--intro-copy-opacity', reduced ? '1' : String(Math.max(0, 1 - eased * 1.25)));
  hero.style.setProperty('--intro-copy-shift', `${reduced ? 0 : -eased * 64}px`);
  hero.style.setProperty('--intro-tree-shift', `${reduced ? 0 : eased * 54}px`);
  hero.style.setProperty('--intro-tree-opacity', reduced ? '1' : String(1 - eased * .55));
  about.style.setProperty('--intro-about-opacity', reduced ? '1' : String(.2 + eased * .8));
  about.style.setProperty('--intro-about-shift', `${reduced ? 0 : (1 - eased) * 42}px`);
}
function queueIntroTransition() {
  if (!introFrame) introFrame = requestAnimationFrame(updateIntroTransition);
}
onUnmounted(() => {
  cancelAnimationFrame(introFrame);
  introObserver?.disconnect();
  window.removeEventListener('scroll', queueIntroTransition);
  window.removeEventListener('resize', queueIntroTransition);
});
const menuToggle = ref(null);
const isMenuOpen = ref(false);
const activeSection = ref('hero');
const navigationItems = [
  { id: 'hero', label: 'Acasă' }, { id: 'process', label: 'Ghid' },
  { id: 'costs', label: 'Costuri' }, { id: 'courses', label: 'Destinații' },
  { id: 'faq', label: 'FAQ' }, { id: 'responsible', label: 'Contact' },
];
const tabsElement = ref(null);
let interactionObserver;
let interactionResize;
let interactionFrame = 0;
let pointerFrame = 0;
let tiltTarget = null;
let cleanupInteractions = () => {};
let headerObserver;
function closeMenu(restoreFocus = false) {
  isMenuOpen.value = false;
  if (restoreFocus) menuToggle.value?.focus();
}
onUnmounted(() => {
  headerObserver?.disconnect();
});
const fallbackImg = '/images/fallback_course.jpg';
function handleImageError(event) {
  const image = event.target;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.removeAttribute('srcset');
  image.src = fallbackImg;
}
function getCourseImg(course) {
  if (!course.img || course.img.includes('BEST_signature.svg')) {
    return fallbackImg;
  }
  try {
    const imgUrl = new URL(course.img);
    if (imgUrl.hostname.includes('unsplash.com')) {
      imgUrl.searchParams.set('auto', 'format');
      imgUrl.searchParams.set('q', '75');
      imgUrl.searchParams.set('w', '800');
      imgUrl.searchParams.set('dpr', '1');
    }
    return imgUrl.toString();
  } catch {
    return course.img;
  }
}
const isWrapped = coursesData && !Array.isArray(coursesData) && Array.isArray(coursesData.courses);
const rawCourses = isWrapped ? coursesData.courses : (Array.isArray(coursesData) ? coursesData : []);
const coursesList = ref(rawCourses);

const currentSeasonName = computed(() => {
  if (coursesData && !Array.isArray(coursesData) && coursesData.season) {
    return coursesData.season.replace(/\s+Season\b/i, '');
  }
  return 'Season';
});

const coursesNotice = computed(() => {
  if (coursesData && !Array.isArray(coursesData) && coursesData.notice) {
    return coursesData.notice;
  }
  return '';
});

const seasonDeadlines = computed(() => {
  if (coursesData && !Array.isArray(coursesData) && coursesData.deadlines) {
    return coursesData.deadlines;
  }
  return '';
});
const now = ref(Date.now());
let seasonClock;
const isSeasonClosed = computed(() => {
  const end = seasonDeadlines.value.split('—').at(-1)?.trim();
  const match = end?.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4}),\s*(\d{1,2}):(\d{2})$/);
  if (!match) return false;
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[2]);
  if (month < 0) return false;
  const deadline = new Date(+match[3], month, +match[1], +match[4], +match[5]);
  if (deadline.getMonth() !== month || deadline.getDate() !== +match[1] || +match[4] > 23 || +match[5] > 59) return false;
  return now.value >= deadline.getTime();
});
onUnmounted(() => clearInterval(seasonClock));

const destinationsCount = computed(() => coursesList.value.length);
const averageFee = computed(() => {
  const fees = coursesList.value
    .map((course) => {
      const fee = String(course.fee);
      if (/free|gratuit/i.test(fee)) return 0;
      const amount = fee.match(/\d+(?:[.,]\d+)?/);
      return amount ? Number(amount[0].replace(',', '.')) : NaN;
    })
    .filter((fee) => Number.isFinite(fee));

  if (!fees.length) return null;
  const total = fees.reduce((sum, fee) => sum + fee, 0);
  return Math.round(total / fees.length);
});

const averageFeeDisplay = computed(() => {
  if (destinationsCount.value === 0 || averageFee.value === null) return '-';
  return `${averageFee.value}€`;
});

const typedText = ref(null);
let typedInstance;
onUnmounted(() => typedInstance?.destroy());
const sakuraContainer = ref(null);
const treeElement = ref(null);
const heroTreeEnabled = true;
const canopyVisible = ref(false);
const canopyReady = ref(false);
let refreshCanopyPetals = () => {};
function onCanopyImageLoad() {
  canopyReady.value = true;
  refreshCanopyPetals();
}
function onCanopyImageError() {
  canopyReady.value = false;
  refreshCanopyPetals();
}
let treeObserver;
let motionMedia;
let treeMedia;
let syncMotion;
watch(introActive, active => {
  if (active) typedInstance?.stop();
  else if (typedInstance) typedInstance.start();
  else syncMotion?.();
});
onUnmounted(() => {
  treeObserver?.disconnect();
  motionMedia?.removeEventListener('change', syncMotion);
  treeMedia?.removeEventListener('change', syncMotion);
});
const isModalOpen = ref(false);
const currentModalData = ref(rawCourses[0] ?? {
  city: '',
  country: '',
  title: '',
  dates: '',
  fee: '',
  img: fallbackImg,
  link: '#'
});

const wallPhotos = ref(galleryData);
const galleryIndex = ref(null);
let swipeStart = null;
function startGallerySwipe(event) {
  const touch = event.changedTouches[0];
  swipeStart = { x: touch.clientX, y: touch.clientY };
}
function endGallerySwipe(event) {
  if (!swipeStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - swipeStart.x;
  const dy = touch.clientY - swipeStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) changePhoto(dx < 0 ? 1 : -1);
  swipeStart = null;
}
function changePhoto(direction) {
  galleryIndex.value = (galleryIndex.value + direction + wallPhotos.value.length) % wallPhotos.value.length;
}
async function openGallery(index) {
  galleryIndex.value = index;
  await openModal(null);
}

const activeTab = ref('cine');
const openRules = ref({ benefits: false, responsibilities: false });
watch(activeTab, async () => {
  await nextTick();
  const panel = document.getElementById(`panel-${activeTab.value}`);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    panel?.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  updateTabIndicator();
});
function updateTabIndicator() {
  const container = tabsElement.value;
  const selected = container?.querySelector('[aria-selected="true"]');
  if (!selected) return;
  container.style.setProperty('--tab-x', `${selected.offsetLeft}px`);
  container.style.setProperty('--tab-y', `${selected.offsetTop}px`);
  container.style.setProperty('--tab-width', `${selected.offsetWidth}px`);
  container.style.setProperty('--tab-height', `${selected.offsetHeight}px`);
  container.classList.add('indicator-ready');
}

onMounted(() => {
  const main = document.getElementById('main-content');
  // Observe individual elements rather than stacking their entrance on a section entrance.
  interactionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      interactionObserver.unobserve(entry.target);
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  main.querySelectorAll('section[data-aos]').forEach(section => {
    section.removeAttribute('data-aos');
    const elements = section.querySelectorAll(':scope > h2, .cost-card, .faq-item, .gallery-trigger, .responsible-card, .details-card, .tabs-container, .no-courses-box, .stat-item');
    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`);
      interactionObserver.observe(element);
    });
  });
  const updateNavigation = () => {
    interactionFrame = 0;
    const marker = headerElement.value.getBoundingClientRect().bottom + 80;
    let current = 'hero';
    for (const item of navigationItems) {
      if (document.getElementById(item.id).getBoundingClientRect().top <= marker) current = item.id;
    }
    activeSection.value = current;
  };
  const queueNavigation = () => {
    if (!interactionFrame) interactionFrame = requestAnimationFrame(updateNavigation);
  };
  const resetTilt = () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (tiltTarget) {
      tiltTarget.style.removeProperty('--tilt-x');
      tiltTarget.style.removeProperty('--tilt-y');
      tiltTarget = null;
    }
  };
  const onPointerMove = event => {
    const target = event.target.closest('.cost-card, .gallery-trigger');
    if (!target || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { resetTilt(); return; }
    if (target !== tiltTarget) { resetTilt(); tiltTarget = target; }
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 5}deg`);
      target.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 5}deg`);
    });
  };
  window.addEventListener('scroll', queueNavigation, { passive: true });
  window.addEventListener('resize', queueNavigation);
  main.addEventListener('pointermove', onPointerMove, { passive: true });
  main.addEventListener('pointerleave', resetTilt);
  interactionResize = new ResizeObserver(updateTabIndicator);
  interactionResize.observe(tabsElement.value);
  document.fonts.ready.then(updateTabIndicator);
  updateNavigation();
  updateTabIndicator();
  cleanupInteractions = () => {
    window.removeEventListener('scroll', queueNavigation);
    window.removeEventListener('resize', queueNavigation);
    main.removeEventListener('pointermove', onPointerMove);
    main.removeEventListener('pointerleave', resetTilt);
    resetTilt();
  };
});
onUnmounted(() => {
  interactionObserver?.disconnect();
  interactionResize?.disconnect();
  cancelAnimationFrame(interactionFrame);
  cleanupInteractions();
});
const guideTabs = [
  { id: 'cine', label: 'Cine poate aplica?' },
  { id: 'cum', label: 'Cum pot aplica?' },
  { id: 'scrisoare', label: 'Cum arată scrisoarea de motivație?' },
  { id: 'validare', label: 'Cum se validează contul?' },
];
async function handleTabKey(event) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  let index = guideTabs.findIndex(tab => tab.id === activeTab.value);
  if (event.key === 'Home') index = 0;
  else if (event.key === 'End') index = guideTabs.length - 1;
  else index = (index + (event.key === 'ArrowRight' ? 1 : -1) + guideTabs.length) % guideTabs.length;
  activeTab.value = guideTabs[index].id;
  await nextTick();
  document.getElementById(`tab-${activeTab.value}`)?.focus();
}

const faqs = ref([
  {
    "question": "Care este taxa maximă pentru un eveniment de educație (Event on Education)?",
    "answer": "În ceea ce îi privește pe participanții români, aceștia plătesc o taxă de participare care reprezintă doar 60% din costul cursului pe care îl aleg. Această politică tarifară are scopul de a face educația mai accesibilă și de a încuraja membrii comunității să se implice activ la aceste cursuri.",
    "open": false
  },
  {
    "question": "Care este motivul pentru care evenimentele BEST au prețuri atât de accesibile?",
    "answer": "Grupul local BEST care se ocupă de organizarea cursurilor face eforturi constante pentru a stabili colaborări cu organizații, companii și universitatea noastră. Scopul acestor colaborări este strângerea de fonduri suplimentare pentru a sprijini organizarea cursurilor BEST. Resursele obținute prin aceste colaborări sunt importante pentru a acoperi diferite costuri necesare, precum materialele de studiu, facilitățile și susținerea financiară a participanților. Prin intermediul acestor colaborări, costurile pot fi menținute cât mai accesibile și se poate oferi o experiență de învățare de calitate în cadrul programelor BEST.",
    "open": false
  },
  {
    "question": "Care este procedura pentru selectarea participanților?",
    "answer": "Grupul local BEST organizator primește toate scrisorile de motivație ale studenților care au aplicat la curs și selectează participanții în funcție de mai multe criterii, cum ar fi: locația geografică, având în vedere că, de obicei, se alege un singur student dintr-un oraș sau dintr-o țară; creativitatea și originalitatea scrisorii de motivație prezentate de aplicanți; experiența anterioară a candidaților în domeniul abordat în cadrul cursului.",
    "open": false
  },
  {
    "question": "Ce ar trebui să fac în cazul în care nu am fost ales să particip la un eveniment?",
    "answer": "Dacă nu ai fost acceptat la evenimentul respectiv, nu trebuie să te descurajezi. În schimb, poți să-ți analizezi aplicația și să lucrezi la îmbunătățirea ei pentru viitoarele oportunități. Aprofundează-ți cunoștințele sau dezvoltă-ți abilitățile și nu ezita să revii cu o aplicație mai bine pregătită pentru a obține acceptarea în viitor.",
    "open": false
  },
  {
    "question": "Se pot obține credite ECTS în urma participării la un eveniment BEST?",
    "answer": "După încheierea procesului de evaluare finală în cadrul cursului, vei primi un certificat BEST care servește drept dovadă a participării și va oferi o descriere detaliată a conținutului cursului. Certificatul BEST va fi autentificat cu ștampila universității și semnătura profesorului coordonator, iar pe lângă acestea, va include informații cu privire la numărul de credite ECTS alocat cursului, oferind astfel o recunoaștere oficială a eforturilor și a performanțelor tale în cadrul acestuia.",
    "open": false
  },
  {
    "question": "Trebuie să completez formularul de evaluare online la un moment specific?",
    "answer": "Participanții la fiecare curs trebuie să completeze un formular de evaluare după încheierea evenimentului și înainte de data-limită specificată pentru fiecare sezon. Detaliile sunt disponibile pe <a href=\"#process\">pagina de aplicare</a>, la secțiunea Beneficii. În cazul în care un participant omite să completeze evaluarea evenimentului, acesta va primi doar jumătate din depozitul inițial.",
    "open": false
  },
  {
    "question": "Unde pot accesa formularul de evaluare?",
    "answer": "Pentru a completa formularul de evaluare, este necesar să intri în contul tău și să accesezi secțiunea <a href=\"https://best.eu.org/account/applications.jsp\" target=\"_blank\" rel=\"noopener noreferrer\">„My Applications”</a>, unde îl vei avea disponibil. Asigură-te că ești autentificat pentru a putea accesa acest formular și pentru a-ți exprima evaluarea cu privire la evenimentul respectiv.",
    "open": false
  }
]);

const modalElement = ref(null);
const modalClose = ref(null);
let previousFocus;
let previousOverflow = '';
const openModal = async (course) => {
  previousFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  if (course) {
    galleryIndex.value = null;
    currentModalData.value = course;
  }
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
  await nextTick();
  modalClose.value?.focus();
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = previousOverflow;
  nextTick(() => previousFocus?.isConnected && previousFocus.focus());
};
function handleGlobalKey(event) {
  if (isModalOpen.value && galleryIndex.value !== null && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    changePhoto(event.key === 'ArrowRight' ? 1 : -1);
  }
  if (event.key === 'Escape') {
    if (isModalOpen.value) { event.preventDefault(); closeModal(); }
    else if (isMenuOpen.value) closeMenu(true);
  }
  if (!isModalOpen.value || event.key !== 'Tab') return;
  const controls = [...modalElement.value.querySelectorAll('button, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
  const first = controls[0];
  const last = controls.at(-1);
  if (!first) { event.preventDefault(); modalElement.value.focus(); return; }
  if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) { event.preventDefault(); first.focus(); }
}
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKey);
  if (isModalOpen.value) document.body.style.overflow = previousOverflow;
});

onMounted(async () => {
  seasonClock = setInterval(() => { now.value = Date.now(); }, 60000);
  document.addEventListener('keydown', handleGlobalKey);
  headerObserver = new ResizeObserver(([entry]) => {
    document.documentElement.style.setProperty('--header-height', `${entry.target.getBoundingClientRect().height}px`);
  });
  headerObserver.observe(headerElement.value);
  if (coursesList.value.length > 0) {
    const [{ default: Swiper }] = await Promise.all([import('swiper/bundle'), import('swiper/css/bundle')]);
    new Swiper(".mySwiper", {
      effect: "coverflow",
      a11y: { slideRole: 'group', slideLabelMessage: null, paginationBulletMessage: t('pagination') },
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      touchRatio: 1.1,
      threshold: 2,
      shortSwipes: true,
      longSwipesRatio: 0.2,
      preventClicks: false,
      preventClicksPropagation: false,
      centeredSlides: true,
      slidesPerView: 3.4,
      initialSlide: 1,
      loop: coursesList.value.length > 3,
      coverflowEffect: {
        rotate: 18,
        stretch: -52,
        depth: 190,
        modifier: 1,
        slideShadows: false,
      },
      pagination: { el: ".swiper-pagination", clickable: true },
      mousewheel: {
        forceToAxis: false,
        releaseOnEdges: true,
        sensitivity: 1,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        0: { slidesPerView: 1.1 },
        640: { slidesPerView: 1.9 },
        1024: { slidesPerView: 2.8 },
        1360: { slidesPerView: 3.4 }
      }
    });
  }

  let petalLayoutKey = '';
  const createPetals = () => {
    const container = sakuraContainer.value;
    if(!container) return;
    const desktop = treeMedia.matches;
    const treeSize = desktop ? treeElement.value.getBoundingClientRect() : null;
    // Mobile browser chrome resizes the viewport during a swipe. Keep the
    // existing particles and their animation phase for height-only changes.
    const layoutKey = [
      container.clientWidth, desktop ? container.clientHeight : 0,
      treeSize?.width || 0, treeSize?.height || 0,
      desktop, motionMedia.matches, canopyVisible.value, canopyReady.value,
    ].join(':');
    if (layoutKey === petalLayoutKey) return;
    petalLayoutKey = layoutKey;
    container.replaceChildren();
    if (motionMedia.matches || (canopyVisible.value && !canopyReady.value)) return;
    const count = treeMedia.matches ? 16 : 8;
    const getOrigins = () => {
      const viewport = container.getBoundingClientRect();
      const tree = treeElement.value.getBoundingClientRect();
      const scale = Math.max(tree.width / cherryCanopy.width, tree.height / cherryCanopy.height);
      const offsetX = tree.left + (tree.width - cherryCanopy.width * scale) / 2;
      const offsetY = tree.top + (tree.height - cherryCanopy.height * scale) / 2;
      const crown = treeMedia.matches && canopyReady.value ? cherryCanopy.emitters.map(origin => ({
        x: origin.x * cherryCanopy.width * scale + offsetX,
        y: origin.y * cherryCanopy.height * scale + offsetY,
        color: origin.color,
      })).filter(origin => origin.x > 12 && origin.x < viewport.width - 12 && origin.y > 0 && origin.y < viewport.height - 36) : [];
      return { viewport, crown };
    };
    const positionPetal = (petal, index) => {
      const { viewport, crown } = getOrigins();
      const colorSource = cherryCanopy.emitters[index * 2 % cherryCanopy.emitters.length];
      const origin = crown.length ? crown[Math.floor(index * crown.length / count)] : {
        x: (index + .5) / count * viewport.width,
        y: -24,
        color: colorSource.color,
      };
      petal.style.left = `${origin.x}px`;
      petal.style.top = `${origin.y}px`;
      petal.style.backgroundColor = origin.color;
      petal.style.setProperty('--fall-distance', `${viewport.height - origin.y + 24}px`);
      return crown.length > 0;
    };
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      const duration = Math.random() * 7 + 16;
      const size = Math.random() * 8 + 8;
      const startsInCrown = positionPetal(petal, i);
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = `${startsInCrown ? i * .65 : -i * duration / count}s`;
      petal.style.setProperty('--drift', `${-80 + Math.random() * 130}px`);
      petal.addEventListener('animationiteration', () => positionPetal(petal, i));
      container.appendChild(petal);
    }
  };
  refreshCanopyPetals = createPetals;
  motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  treeMedia = window.matchMedia('(min-width: 768px)');
  syncMotion = () => {
    canopyVisible.value = heroTreeEnabled && treeMedia.matches;
    if (!treeMedia.matches) canopyReady.value = false;
    if (treeMedia.matches) closeMenu();
    typedInstance?.destroy();
    typedInstance = null;
    typedText.value.textContent = 'BEST.';
    if (!motionMedia.matches && !introActive.value) typedInstance = new Typed(typedText.value, {
      strings: ['Learn.', 'Travel.', 'Connect.', 'BEST.'],
      typeSpeed: 80, backSpeed: 50, loop: true,
    });
    createPetals();
    queueIntroTransition();
  };
  motionMedia.addEventListener('change', syncMotion);
  treeMedia.addEventListener('change', syncMotion);
  treeObserver = new ResizeObserver(createPetals);
  treeObserver.observe(treeElement.value);
  treeObserver.observe(sakuraContainer.value);
  window.addEventListener('scroll', queueIntroTransition, { passive: true });
  window.addEventListener('resize', queueIntroTransition, { passive: true });
  introObserver = new ResizeObserver(queueIntroTransition);
  introObserver.observe(heroElement.value);
  syncMotion();

});
</script>

<style>
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

:root {
  --pink-pop: #ff9a9e;
  --pink-soft: #fad0c4;
  --blue-sky: #a18cd1;
  --blue-soft: #fbc2eb;
  --accent-gold: #ffdd00;
  --text-main: #2d3748;
  --white: #ffffff;
  --shadow-pop: 0 10px 30px rgba(83, 56, 102, .08);
  --card-radius: 24px;
}

* { margin: 0; padding: 0; box-sizing: border-box; cursor: auto; }

html, body {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Nunito', sans-serif;
  color: var(--text-main);
  line-height: 1.6;
}
html { scroll-padding-top: var(--header-height, 90px); scroll-behavior: smooth; }
section[id] { scroll-margin-top: 20px; }
.menu-toggle { display: none; border: 0; background: transparent; font-size: 1.8rem; padding: 8px; cursor: pointer; }

.landing-container {
  background:
    radial-gradient(ellipse 48% 340px at 5% 350px, #ff9a9e33, transparent 75%) 0 0 / 100% 2300px repeat-y,
    radial-gradient(ellipse 48% 380px at 96% 1150px, #a18cd12e, transparent 75%) 0 0 / 100% 2300px repeat-y,
    radial-gradient(ellipse 38% 280px at 24% 1950px, #fad0c44d, transparent 75%) 0 0 / 100% 2300px repeat-y,
    repeating-linear-gradient(180deg, #fdfbfb 0, #fff4f8 550px, #f8f5fc 1100px, #fdfbfb 1650px);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

#sakura-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 900;
  pointer-events: none;
  overflow: hidden;
}
@media (max-width: 767px) {
  #sakura-container { height: 100lvh; }
}

.petal {
  position: absolute;
  top: 0;
  background: var(--pink-pop);
  border-radius: 150% 0 150% 0;
  opacity: 0.45;
  animation: fall linear infinite;
  box-shadow: none;
  will-change: transform, opacity;
}

@keyframes fall {
  0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
  15% { opacity: 0.45; }
  50% { transform: translate3d(calc(var(--drift) * .35), calc(var(--fall-distance) * .5), 0) rotate(170deg); opacity: .6; }
  100% { transform: translate3d(var(--drift), var(--fall-distance), 0) rotate(360deg); opacity: 0; }
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

h1, h2, h3, h4 { font-family: 'Baloo 2', sans-serif; font-weight: 700; }
.highlight { color: var(--pink-pop); }
.section-padding { padding: 48px max(6%, calc((100% - 1180px) / 2)); position: relative; z-index: 2; }
.text-center { text-align: center; }
h2 { font-size: 3rem; margin-bottom: 40px; letter-spacing: -1px; color: #1a202c; }

.btn-pop {
  display: inline-block; padding: 16px 45px;
  background: linear-gradient(45deg, var(--pink-pop), #ec77ab);
  color: white; border-radius: 50px; font-weight: 700;
  text-decoration: none; box-shadow: 0 10px 25px rgba(255, 154, 158, 0.4);
  transition: all 0.3s; border: none; font-family: 'Baloo 2', sans-serif;
  font-size: 1.1rem; cursor: pointer; letter-spacing: 0.5px;
}
.btn-pop:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(255, 154, 158, 0.6); }

nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 5%; position: fixed; width: 90%; left: 5%; top: 20px;
  border-radius: 50px; background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(8px); box-shadow: var(--shadow-pop);
  z-index: 1000; border: 1px solid rgba(255,255,255,0.55);
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

.stats-bar {
  display: flex; justify-content: center; gap: 50px; flex-wrap: wrap;
  padding: 40px; background: rgba(255,255,255,0.6);
  margin: 0 10%; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transform: translateY(-50px); z-index: 5; position: relative;
}
.stat-item { text-align: center; }
.stat-item h3 { font-size: 2.5rem; color: var(--blue-sky); margin-bottom: 5px; }
.stat-item p { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem; opacity: 0.7; }

.card-container {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 40px; padding: 20px;
}
.swiper {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-top: 22px;
  padding-bottom: 46px;
  overflow: visible;
}
.swiper.mySwiper {
  touch-action: pan-y;
}
.swiper-slide {
  background-position: center; background-size: cover;
  width: 300px; height: 440px; border-radius: 22px;
  overflow: hidden; box-shadow: 0 16px 34px rgba(15, 23, 42, 0.24);
  position: relative; transition: transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease, filter 0.35s ease;
}
.swiper-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 10%, rgba(15, 23, 42, 0.32) 46%, rgba(15, 23, 42, 0.04) 78%);
  z-index: 1;
}
.course-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.swiper-slide-active {
  transform: scale(1.08);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.34);
  z-index: 5;
}
.swiper-slide-prev,
.swiper-slide-next {
  opacity: 0.98;
}
.swiper-slide:not(.swiper-slide-active) {
  filter: saturate(0.95);
}
.slide-content {
  position: absolute; bottom: 0; left: 0; width: 100%;
  z-index: 2;
  padding: 22px 20px;
  color: white;
  transform: translateY(6px);
  transition: transform 0.35s ease;
}
.swiper-slide:hover .slide-content { transform: translateY(0); }
.slide-content .course-city {
  display: block; font-family: 'Baloo 2', sans-serif; font-weight: 700;
  font-size: 1.55rem;
  line-height: 1.1;
  margin-bottom: 6px;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
}
.badge {
  background: #facc15;
  color: #111827;
  padding: 5px 11px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.66rem;
  display: inline-block;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.swiper-pagination {
  margin-top: 2px;
}
.swiper-pagination-bullet {
  width: 6px;
  height: 6px;
  background: #d1d5db;
  opacity: 1;
}
.swiper-pagination-bullet-active {
  background: #3b82f6;
}

.faq-container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.faq-item {
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: 0.3s;
  border: 1px solid #f0f0f0;
}
.faq-question {
  width: 100%; border: 0; text-align: left; color: inherit; font: inherit;
  padding: 25px; display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; background: #fff;
}
.faq-question span { margin: 0; font-size: 1.1rem; font-family: 'Baloo 2', sans-serif; font-weight: 700; }
.faq-answer { padding: 0 25px 25px; color: #666; display: none; }
.faq-item.open .faq-answer { display: block; animation: fadeIn 0.3s; }
.faq-item.open .faq-question { color: var(--pink-pop); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(40, 40, 40, 0.6); backdrop-filter: blur(10px);
  z-index: 9999; display: flex; justify-content: center; align-items: center;
  transition: 0.4s ease;
}
.modal-content {
  max-height: calc(100dvh - 32px); overflow-y: auto; overflow-wrap: anywhere;
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

.responsible-wrapper { display: flex; justify-content: center; margin-top: 30px; }
.responsible-card {
  display: flex; align-items: center; background: white;
  padding: 40px 45px; border-radius: 40px; max-width: 850px; width: 100%;
  box-shadow: var(--shadow-pop); border: 2px solid var(--pink-soft);
  gap: 40px; transition: 0.3s;
}
.responsible-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(255, 154, 158, 0.2); }
.resp-img {
  width: 220px;
  height: 220px;
  min-width: 220px;
  min-height: 220px;
  max-width: 220px;
  max-height: 220px;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 25%;
  border: 5px solid var(--pink-pop);
  box-shadow: 0 10px 25px rgba(255, 154, 158, 0.35);
  display: block;
}
.resp-content { flex: 1; min-width: 0; text-align: left; }
.resp-content h3 { font-size: 2rem; color: var(--text-main); margin-bottom: 5px; }
.resp-role { color: var(--pink-pop); font-weight: 800; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }
.resp-content p { margin-top: 15px; opacity: 0.8; }
.resp-socials { margin-top: 20px; font-size: 1.5rem; color: #aaa; }
.resp-socials i { margin-right: 15px; transition: 0.3s; cursor: pointer; }
.resp-socials i:hover { color: var(--blue-sky); }

@media(max-width: 768px) {
  .responsible-card { flex-direction: column; text-align: center; padding: 35px 25px; gap: 25px; }
  .resp-img {
    width: 190px;
    height: 190px;
    min-width: 190px;
    min-height: 190px;
    max-width: 190px;
    max-height: 190px;
  }
  .resp-content { text-align: center; }
}

@media(max-width: 480px) {
  .resp-img {
    width: 160px;
    height: 160px;
    min-width: 160px;
    min-height: 160px;
    max-width: 160px;
    max-height: 160px;
  }
}

.gallery-wrapper { column-count: 3; column-gap: 25px; }
.gallery-img {
  height: auto;
  width: 100%; border-radius: 25px; margin-bottom: 25px;
  transition: transform 0.4s ease; box-shadow: var(--shadow-pop);
  filter: grayscale(20%);
}
.gallery-img:hover { transform: scale(1.03); filter: grayscale(0%); z-index: 2; position: relative;}





@media (max-width: 768px) {
  .gallery-wrapper { column-count: 1; }
  .hero h1 { font-size: 3rem; }
  .section-padding { padding: 80px 5%; }
  nav { width: 95%; left: 2.5%; padding: 15px; }
  .nav-links { display: none; }
  .menu-toggle { display: block; }
  .nav-links.is-open { display: flex; position: absolute; top: calc(100% + 8px); left: 0; right: 0; flex-direction: column; background: white; border-radius: 24px; padding: 16px; box-shadow: var(--shadow-pop); }
  .nav-links a { margin: 0; padding: 10px 16px; }

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

.no-courses-box {
  max-width: 680px;
  margin: 30px auto 10px;
  padding: 50px 35px;
  background: linear-gradient(135deg, #ffffff 0%, #fffbfb 100%);
  border-radius: 28px;
  border: 2px dashed var(--pink-soft);
  text-align: center;
  box-shadow: 0 10px 30px rgba(255, 154, 158, 0.12);
  position: relative;
  z-index: 2;
}

.no-courses-icon {
  font-size: 3.5rem;
  color: var(--pink-pop);
  margin-bottom: 18px;
}

.no-courses-box h3 {
  font-size: 1.6rem;
  color: var(--blue-dark);
  margin-bottom: 14px;
  font-weight: 700;
}

.no-courses-desc {
  color: #666;
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 580px;
  margin: 0 auto 20px;
}

.no-courses-deadlines {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f5ff;
  color: var(--blue-dark);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  margin-bottom: 15px;
  border: 1px solid rgba(137, 247, 254, 0.3);
}

.skip-link { position: fixed; top: 8px; left: 8px; z-index: 10001; padding: 12px 20px; background: white; color: #21152e; transform: translateY(-180%); }
.skip-link:focus { transform: translateY(0); }
:focus-visible { outline: 3px solid #49316f; outline-offset: 4px; }
button { font-family: inherit; }
button:disabled { cursor: wait; }
.swiper-slide { border: 0; text-align: left; font: inherit; }
.btn-pop, .tabs-header button.active { color: white; }

.highlight { color: var(--pink-pop); }
.faq-item.open .faq-question { color: var(--pink-pop); }
.resp-role { color: #92365b; }
.stat-item h3, .hero > h4, .resp-content > p[style] { color: #604180 !important; }
#courses > p[style] { color: #92365b !important; }
.modal-header-info .badge { color: #21152e !important; }
.nav-links a:hover { color: #92365b; }


@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  #sakura-container { display: none; }
  [data-aos] { opacity: 1 !important; transform: none !important; }
}
main, section { min-width: 0; }
.resp-content a { overflow-wrap: anywhere; }
.modal-header-info { flex-wrap: wrap; }
@media (max-width: 480px) {
  nav { gap: 5px; padding: 10px; }
  .nav-logo-img { width: 90px; height: auto !important; }
  nav > .btn-pop { padding: 10px 12px !important; font-size: .8rem !important; }
  .hero { padding: 140px 5% 40px; }
  .hero h1 { font-size: 2.5rem; }
  h2 { font-size: 2.2rem; overflow-wrap: anywhere; }



  .modal-content { padding: 25px 20px; border-radius: 25px; }
  .modal-img { height: 180px; }
  .tabs-header button { max-width: 100%; }
  .stats-bar { margin-inline: 5%; padding: 25px 15px; }
  .no-courses-box { padding: 30px 20px; }
}
footer p { opacity: .85 !important; }
footer h2 { color: #604180 !important; }
/* Shared rhythm and the existing pastel identity. */
h2 { font-size: clamp(2rem, 3.5vw, 2.65rem); line-height: 1.2; margin-bottom: 28px; letter-spacing: -.6px; }
h3 { line-height: 1.3; }
.hero { display: flex; flex-direction: column; justify-content: center; min-height: clamp(640px, 56.25vw, 820px); padding: 160px 6% 80px; text-align: center; background: radial-gradient(ellipse at 75% 45%, #fff0f5 0%, transparent 65%); isolation: isolate; overflow: hidden; }
.hero-copy { min-width: 0; width: 100%; max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }
.hero h1 { font-size: clamp(3.3rem, 5.3vw, 5rem); line-height: 1.08; margin-bottom: 24px; }
.hero-typed-line { display: inline; }
.hero p { margin: 0 auto; max-width: 600px; font-size: 1.15rem; opacity: 1; color: #596175; }
.hero .hero-season { color: #604180; font-size: .9rem; font-weight: 800; letter-spacing: .18em; margin-bottom: 20px; }
.hero-actions { margin-top: 28px; }
.hero-art { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.hero-art picture, .cherry-canopy { display: block; width: 100%; height: 100%; }
.cherry-canopy { object-fit: cover; object-position: center; opacity: .48; -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,.75) 68%, rgba(0,0,0,.35) 78%, rgba(0,0,0,.08) 88%, transparent 96%); mask-image: linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,.75) 68%, rgba(0,0,0,.35) 78%, rgba(0,0,0,.08) 88%, transparent 96%); }
.stats-bar { transform: none; width: 88%; max-width: 1180px; margin: 0 auto 12px; padding: 24px; border-radius: var(--card-radius); background: #ffffffd9; gap: 32px; }
.stat-item h3 { font-size: 1.65rem; }
.stat-item p { font-size: .85rem; text-transform: none; letter-spacing: 0; opacity: 1; color: #596175; }
.card-container { padding: 0; gap: 16px; }
.cost-card { border: 1px solid var(--pink-soft); background: #fffbfc; border-radius: var(--card-radius); padding: 24px; box-shadow: var(--shadow-pop); }
.cost-card h3 { font-size: 1.4rem; color: var(--pink-pop); margin-bottom: 12px; }
.cost-card p { line-height: 1.7; }
.cost-card, .faq-item, .responsible-card, .no-courses-box, .tab-content, .modal-content, .details-card { border-radius: var(--card-radius); box-shadow: var(--shadow-pop); }
.tabs-header { gap: 8px; margin-bottom: 18px; }
.tabs-header button { padding: 12px 18px; font: 700 .95rem 'Nunito', sans-serif; cursor: pointer; }
.tab-content { max-width: 960px; padding: 28px; min-height: 0; }
.tab-content p + p { margin-top: 12px; }
.tab-content li { margin-bottom: 8px; }
.guide-list { padding-left: 22px; margin: 20px 0; }
.eligibility-grid { gap: 20px; }
.eligibility-col { padding: 24px; border-radius: 18px; font-size: 1rem; }
.details-card { background: white; padding: 24px; }
.details-card > summary { font: 600 1.5rem 'Baloo 2', sans-serif; color: #604180; cursor: pointer; }
.rules-grid { margin-top: 24px; gap: 24px; }
.rules-grid h2 { font-size: 1.65rem !important; margin-bottom: 16px; }
.rule-card { box-shadow: none; background: #fffbfc; border: 1px solid #f6e5ee; border-radius: 18px; padding: 24px; }
.faq-container { gap: 12px; }
.faq-question { padding: 22px 24px; }
.faq-question span { font-size: 1.05rem; }
.faq-answer { padding: 0 24px 24px; }
.responsible-card { padding: 32px; gap: 32px; }
.resp-img { width: 170px; height: 170px; min-width: 170px; min-height: 170px; max-width: 170px; max-height: 170px; }
.resp-content h3 { font-size: 1.75rem; }
.gallery-wrapper { column-gap: 16px; }
.gallery-img { border-radius: 18px; margin-bottom: 16px; box-shadow: var(--shadow-pop); filter: none; }


.btn-pop, .tabs-header button, .menu-toggle, .modal-close, .faq-question { transition: background .18s ease, box-shadow .18s ease, transform .18s ease; }
.btn-pop { padding: 14px 28px; box-shadow: 0 6px 18px rgba(236, 119, 171, .22); }
.btn-pop:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(236, 119, 171, .27); }
.btn-pop:active, .tabs-header button:active, .menu-toggle:active { transform: translateY(1px); }
.btn-pop:disabled { transform: none; opacity: .7; }
.btn-pop, .tabs-header button, .menu-toggle, .modal-close { min-height: 44px; }
.modal-close:hover { color: white; }
nav { padding: 12px 24px; gap: 16px; }
.nav-logo-img { max-width: 138px; object-fit: contain; }
.nav-links { display: flex; gap: clamp(8px, 1.4vw, 20px); align-items: center; }
.nav-links a { margin: 0; font-size: .9rem; white-space: nowrap; }
nav > .btn-pop { white-space: nowrap; }
.menu-toggle { font-size: .9rem; font-weight: 800; align-items: center; gap: 8px; }
.menu-toggle::before { content: ''; width: 16px; height: 12px; background: linear-gradient(currentColor, currentColor) top / 100% 2px no-repeat, linear-gradient(currentColor, currentColor) center / 100% 2px no-repeat, linear-gradient(currentColor, currentColor) bottom / 100% 2px no-repeat; }
.modal-close { width: auto; height: auto; min-height: 36px; padding: 8px 12px; border: 0; border-radius: 999px; font: 700 .85rem 'Nunito', sans-serif; }
.modal-close:hover { transform: none; }
.modal-content { padding: 48px 28px 28px; }
.modal-img { border-radius: 16px; }
.modal-title { font-size: 2rem; }
.modal-desc { margin-bottom: 24px; }
.swiper-slide { height: 380px; border-radius: var(--card-radius); box-shadow: var(--shadow-pop); }
.swiper-slide:hover { box-shadow: 0 14px 34px rgba(83, 56, 102, .15); }
.course-open { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: transparent; z-index: 3; border-radius: inherit; cursor: pointer; }
.course-open:focus-visible { outline-offset: -6px; outline-color: #49316f; box-shadow: inset 0 0 0 3px white; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
@media (min-width: 768px) and (max-width: 1000px) {
  .hero-copy { max-width: 600px; }
  nav { width: 96%; left: 2%; padding: 12px 16px; gap: 10px; }
  .nav-logo-img { max-width: 105px; }
  .nav-links a { font-size: .8rem; }
  nav > .btn-pop { padding: 10px 14px !important; font-size: .8rem !important; }
}
@media (max-width: 767px) {
  .hero { grid-template-columns: minmax(0, 1fr); min-height: 0; padding: 148px 6% 48px; text-align: center; }
  .hero p { margin: 0 auto; }
  .hero-art { display: none; }
  .hero h1 { font-size: clamp(3rem, 12vw, 4rem); }
  .section-padding { padding: 36px 6%; }
  .stats-bar { width: 88%; padding: 22px 18px; margin-bottom: 0; }
  .menu-toggle { display: inline-flex; }
  .nav-links { display: none; }
  .nav-links.is-open { align-items: stretch; }
  .nav-links.is-open { max-height: calc(100dvh - var(--header-height, 90px) - 48px); overflow-y: auto; }
  .tab-content { padding: 24px 20px; }
  .cost-card { padding: 20px; }
  .details-card { padding: 22px 18px; }

  .responsible-card { padding: 28px 22px; gap: 24px; }
}
@media (max-width: 390px) {
  nav { gap: 6px; }
  .menu-toggle { padding: 8px 4px; font-size: .8rem; }
  .menu-toggle::before { width: 14px; }
  .nav-logo-img { width: 78px; }
  nav > .btn-pop { padding-inline: 10px !important; font-size: .75rem !important; }
  .hero h1 { font-size: 3rem; }
  .modal-content { width: calc(100% - 24px); padding: 52px 20px 24px; }
  .tabs-header button { width: 100%; }

}
.stat-item h3.season-closed-title { color: var(--pink-pop) !important; }
.document-copy { font-size: 1.05rem; line-height: 1.8; }
.document-copy h3 { margin-bottom: 20px; }
.document-copy h4 { margin: 24px 0 12px; font-size: 1.15rem; }
.document-copy p + p { margin-top: 18px; }
.document-copy .guide-list { padding-left: 24px; margin: 16px 0 24px; list-style: disc; }
.document-copy ol.guide-list { list-style: decimal; }
.document-copy .guide-list li { display: list-item; margin-bottom: 12px; }
.about-section { padding-top: 36px; padding-bottom: 48px; background: radial-gradient(ellipse at 12% 45%, #fff0f5 0%, transparent 52%); }
.about-layout { display: grid; grid-template-columns: minmax(180px, .65fr) minmax(0, 1.65fr); align-items: start; gap: clamp(28px, 5vw, 72px); max-width: 1100px; margin: 0 auto; padding: 12px 0; }
.about-heading { padding-top: 4px; }
.about-eyebrow { display: block; margin-bottom: 18px; color: #80649d; font-size: .8rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
.about-heading h2 { margin: 0; font-size: clamp(3rem, 5vw, 4.4rem); letter-spacing: -1.5px; line-height: 1.1; }
.about-blossom { display: block; width: 100px; height: 84px; margin-top: 30px; opacity: .8; }
.about-copy { max-width: 720px; margin: 0; color: #495364; font-size: 1.06rem; line-height: 1.9; }
.about-copy p { margin: 0; }
.about-copy p:first-child { color: #2d3748; }
.about-copy p + p { margin-top: 24px; }
@media (max-width: 767px) {
  .about-section { padding-top: 24px; padding-bottom: 36px; }
  .about-layout { grid-template-columns: minmax(0, 1fr); gap: 20px; padding: 0; }
  .about-heading { position: relative; padding-right: 90px; }
  .about-eyebrow { margin-bottom: 12px; font-size: .75rem; }
  .about-heading h2 { font-size: 2.7rem; }
  .about-blossom { position: absolute; right: 0; top: 4px; width: 72px; height: 64px; margin: 0; }
  .about-copy { font-size: 1rem; line-height: 1.85; }
}
.cost-card p + p { margin-top: 16px; }
section[data-aos="fade-up"]:not(.aos-animate) { transform: translate3d(0, 22px, 0); }
.hero-copy { opacity: var(--intro-copy-opacity, 1); transform: translate3d(0, var(--intro-copy-shift, 0px), 0); }
.hero-art { opacity: var(--intro-tree-opacity, 1); transform: translate3d(0, var(--intro-tree-shift, 0px), 0); }
.about-section { opacity: var(--intro-about-opacity, 1); transform: translate3d(0, var(--intro-about-shift, 0px), 0); }
@media (prefers-reduced-motion: reduce) {
  .hero-copy, .hero-art, .about-section { opacity: 1 !important; transform: none !important; }
}
/* One motion language: staggered entrances, gentle depth, quick feedback. */
.scroll-reveal { opacity: 0; translate: 0 28px; transition: opacity .65s ease var(--reveal-delay, 0ms), translate .75s cubic-bezier(.16,1,.3,1) var(--reveal-delay, 0ms); }
.scroll-reveal.is-revealed { opacity: 1; translate: 0 0; }
.scroll-reveal:focus-within { opacity: 1; translate: 0 0; }
.nav-links a { position: relative; padding-block: 6px; }
.nav-links a::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; border-radius: 2px; background: var(--pink-pop); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
.nav-links a[aria-current="location"]::after, .nav-links a:hover::after { transform: scaleX(1); }
.btn-pop { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease; }
.btn-pop:active { transform: translateY(1px) scale(.96); }
.course-image { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
.swiper-slide:hover .course-image, .swiper-slide:focus-within .course-image { transform: scale(1.06); }
.cost-card, .gallery-trigger { transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)); transition: transform .25s ease, box-shadow .3s ease, opacity .65s ease var(--reveal-delay, 0ms), translate .75s cubic-bezier(.16,1,.3,1) var(--reveal-delay, 0ms); }
.cost-card:hover, .cost-card:focus-within { box-shadow: 0 18px 36px #a18cd126; }
.tabs-header { position: relative; isolation: isolate; }
.tabs-header::before { content: ''; position: absolute; top: 0; left: 0; width: var(--tab-width, 0px); height: var(--tab-height, 0px); transform: translate(var(--tab-x, 0px), var(--tab-y, 0px)); background: var(--pink-pop); border-radius: 30px; box-shadow: 0 5px 15px #ff9a9e66; z-index: -1; transition: transform .4s cubic-bezier(.22,1,.36,1), width .4s ease, height .4s ease; }
.tabs-header.indicator-ready button.active { background: transparent; box-shadow: none; }
.tabs-header button { transition: color .2s ease, border-color .2s ease, transform .2s ease; }
.tab-content { overflow: clip; }
.faq-question::after { content: ''; width: 9px; height: 9px; margin-left: 18px; flex: 0 0 auto; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); transition: transform .35s ease; }
.faq-item.open .faq-question::after { transform: rotate(225deg); }
.faq-reveal { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .4s cubic-bezier(.22,1,.36,1), opacity .3s ease; }
.faq-reveal.expanded { grid-template-rows: 1fr; opacity: 1; }
.faq-clip { min-height: 0; overflow: hidden; }
.faq-answer, .faq-item.open .faq-answer { display: block; animation: none; }
.gallery-trigger { display: block; width: 100%; border: 0; background: transparent; padding: 0; margin: 0 0 16px; border-radius: 18px; break-inside: avoid; cursor: zoom-in; }
.gallery-trigger .gallery-img { display: block; margin: 0; transition: transform .45s ease; }
.gallery-trigger:focus-visible .gallery-img { transform: scale(1.03); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .3s ease; }
.modal-fade-enter-active .modal-content, .modal-fade-leave-active .modal-content { transition: transform .4s cubic-bezier(.22,1,.36,1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content { transform: translateY(24px) scale(.94); }
.gallery-dialog { max-width: 1100px; width: calc(100% - 32px); padding: 60px 20px 20px; }
.gallery-stage { display: grid; place-items: center; height: min(65dvh, 720px); touch-action: pan-y; overflow: hidden; border-radius: 16px; background: #fff8fb; }
.gallery-stage img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
.gallery-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
.gallery-controls button { min-height: 44px; padding: 10px 18px; border: 1px solid var(--pink-soft); border-radius: 24px; background: #fff0f5; color: var(--text-main); font-weight: 800; cursor: pointer; transition: transform .2s ease, background .2s ease; }
.gallery-controls button:hover { background: var(--pink-soft); }
.gallery-controls button:active { transform: scale(.95); }
.photo-enter-active, .photo-leave-active { transition: opacity .16s ease, transform .16s ease; }
.photo-enter-from { opacity: 0; transform: translateX(16px) scale(.98); }
.photo-leave-to { opacity: 0; transform: translateX(-16px) scale(.98); }
@keyframes menuLinkIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes menuPanelIn { from { opacity: 0; transform: translateY(-10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (max-width: 767px) {
  .nav-links.is-open { animation: menuPanelIn .25s ease both; transform-origin: top; }
  .nav-links.is-open a { animation: menuLinkIn .3s ease both; }
  .nav-links.is-open a:nth-child(2) { animation-delay: .035s; }
  .nav-links.is-open a:nth-child(3) { animation-delay: .07s; }
  .nav-links.is-open a:nth-child(4) { animation-delay: .105s; }
  .nav-links.is-open a:nth-child(5) { animation-delay: .14s; }
  .nav-links.is-open a:nth-child(6) { animation-delay: .175s; }
  .gallery-stage { height: 58dvh; }
}
@media (hover: none) {
  .cost-card, .gallery-trigger { transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; translate: none; }
  .cost-card, .gallery-trigger, .course-image, .gallery-img { transform: none !important; }
}
/* Static paper grain and route sketches complement the existing falling petals. */
.landing-container::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 800;
  pointer-events: none;
  opacity: .16;
  background-image: url('/images/paper-grain.png');
  background-size: 180px 180px;
  background-repeat: repeat;
}
.travel-route {
  position: absolute;
  width: clamp(32px, 4.5vw, 80px);
  height: clamp(260px, 32vw, 480px);
  max-height: calc(100% - 100px);
  top: 64px;
  stroke: var(--blue-sky);
  stroke-width: 1.8;
  opacity: .4;
  pointer-events: none;
  user-select: none;
}
.travel-route-left { left: .4%; }
.travel-route-right { right: .4%; stroke: var(--pink-pop); }
.travel-route-line { stroke-dasharray: 1 10; stroke-linecap: round; }
.travel-route circle { fill: #fffafc; }
@media (max-width: 767px) {
  .travel-route { display: none; }
  .landing-container::after { opacity: .12; }
}
@media (forced-colors: active) {
  .travel-route, .landing-container::after { display: none; }
}
/* A single continuous backdrop avoids hard edges between section backgrounds. */
.hero, .about-section { background: transparent; }
footer {
  position: relative;
  z-index: 2;
  margin-top: 24px;
  border-top: 1px solid #a18cd14d;
  border-radius: 48px 48px 0 0;
  background:
    radial-gradient(ellipse at 15% 100%, #ff9a9e38, transparent 65%),
    linear-gradient(135deg, #f4eaf8, #fce5ee);
  box-shadow: 0 -12px 40px #6041800a;
}
.footer-content { max-width: 1180px; margin: 0 auto; padding: 64px 24px 40px; }
footer .footer-socials { display: flex; justify-content: center; align-items: center; gap: 16px; }
footer .social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #ffffffa6;
  border: 1px solid #a18cd133;
  color: #604180;
  opacity: 1;
  font-size: 1.4rem;
}
footer .social-icon:hover { background: white; box-shadow: 0 8px 20px #60418014; }
@media (max-width: 767px) {
  footer { border-radius: 32px 32px 0 0; margin-top: 16px; }
  .footer-content { padding: 44px 20px 32px; }
}
.footer-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
.footer-brand h2 { margin-bottom: 24px; }
.footer-grid h3 { font-size: 1.4rem; color: #604180; margin-bottom: 16px; }
footer .footer-brand .footer-socials { justify-content: flex-start; }
.footer-location address { font-style: normal; font-size: 1rem; line-height: 1.7; margin-bottom: 20px; overflow-wrap: anywhere; }
.footer-map { overflow: hidden; border: 1px solid #a18cd140; border-radius: 20px; background: #fff8fb; box-shadow: var(--shadow-pop); }
.footer-map iframe { display: block; width: 100%; height: 260px; border: 0; }
.footer-map-link { display: inline-block; color: #604180; font-weight: 800; text-underline-offset: 4px; margin-top: 14px; padding-block: 8px; }
.footer-map-link:hover { color: #92365b; }
.footer-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px 24px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #a18cd133; font-size: .9rem; }
@media (max-width: 767px) {
  .footer-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .footer-bottom { margin-top: 28px; }
  .footer-map iframe { height: 230px; }
}
/* Long-form information reads as two editorial panels, rather than narrow columns. */
#rules > h2 { margin-bottom: 24px; }
#rules .rules-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; max-width: 1180px; margin-inline: auto; }
.rules-column {
  display: grid;
  grid-template-columns: minmax(150px, .3fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(24px, 4vw, 52px);
  padding: clamp(24px, 3.5vw, 44px);
  border: 1px solid #eadfea;
  border-radius: 28px;
  background: #ffffffbd;
  box-shadow: 0 12px 32px #60418006;
  min-width: 0;
}
.rules-column > h3 { margin: 0; font-size: clamp(1.5rem, 2.3vw, 1.9rem); line-height: 1.2; overflow-wrap: anywhere; color: #604180; }
.rules-column > h3::before { content: ''; display: block; width: 36px; height: 4px; background: var(--pink-pop); border-radius: 4px; margin-bottom: 16px; }
#rules .rule-card { min-width: 0; padding: 0; background: transparent; border: 0; border-radius: 0; box-shadow: none; font-size: 1rem; line-height: 1.75; }
#rules .rule-card > p:first-child { color: #596175; margin-bottom: 24px; }
#rules .guide-list { list-style: none; padding: 0; margin: 0; }
#rules .guide-list li { display: block; position: relative; margin: 0; padding: 16px 0 16px 24px; border-bottom: 1px solid #eee5ef; }
#rules .guide-list li::before { content: ''; position: absolute; left: 1px; top: 27px; width: 6px; height: 6px; border-radius: 50%; background: var(--pink-pop); }
#rules .rules-benefits .rule-card > .guide-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 28px; }
.rules-exclusions { margin-top: 28px; padding: 20px 24px; border-radius: 18px; background: #f7f2fa; }
#rules .rules-exclusions h4 { margin: 0 0 8px; font-size: 1.15rem; color: #604180; }
#rules .rules-exclusions .guide-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 24px; }
#rules .rules-exclusions li { padding-block: 10px; border: 0; }
#rules .rules-exclusions li::before { top: 21px; background: var(--blue-sky); }
#rules .rules-responsibilities .guide-list { counter-reset: responsibility; }
#rules .rules-responsibilities li { counter-increment: responsibility; padding-left: 44px; }
#rules .rules-responsibilities li::before { content: counter(responsibility, decimal-leading-zero); top: 16px; left: 0; width: 30px; height: auto; background: none; border-radius: 0; color: #80649b; font: 600 1rem/1.75 'Baloo 2', sans-serif; }
#rules .rules-note { margin-top: 24px; padding: 20px 24px; border-left: 3px solid var(--pink-pop); border-radius: 0 16px 16px 0; background: #fff0f5; }
@media (max-width: 900px) {
  .rules-column { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .rules-column > h3::before { margin-bottom: 12px; }
}
@media (max-width: 600px) {
  #rules .rules-benefits .rule-card > .guide-list, #rules .rules-exclusions .guide-list { grid-template-columns: minmax(0, 1fr); }
  .rules-column { border-radius: 22px; padding: 24px 20px; }
  .rules-exclusions, #rules .rules-note { padding: 18px; }
}
/* A quieter footer keeps the address and useful links easy to scan. */
footer {
  border-radius: 0;
  border-top: 1px solid #e4d9e9;
  background: #f4edf7;
  box-shadow: none;
}
.footer-content { padding: 44px max(24px, 3%) 24px; }
.footer-grid { grid-template-columns: minmax(150px, .65fr) minmax(0, 2fr); gap: clamp(28px, 4vw, 56px); align-items: center; }
.footer-brand { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }
.footer-location { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); align-items: center; gap: 28px; }
.footer-location-info { min-width: 0; }
.footer-brand h2 { font-size: 1.8rem; margin-bottom: 20px; }
.footer-grid h3 { font: 700 .95rem 'Nunito', sans-serif; color: #596175; margin-bottom: 12px; }
.footer-location address { margin-bottom: 8px; max-width: 280px; color: #495364; font-size: .95rem; line-height: 1.8; text-wrap: pretty; }
.footer-map { border-radius: 14px; box-shadow: none; border-color: #dfd4e5; }
.footer-map iframe { height: 190px; }
footer .social-icon { width: 44px; height: 44px; font-size: 1.2rem; background: #ffffff80; border-color: #dfd4e5; }
.footer-map-link { font-size: .85rem; margin-top: 0; }
.footer-bottom { margin-top: 32px; padding-top: 20px; font-size: .85rem; color: #596175; border-color: #dfd4e5; }
@media (max-width: 767px) {
  footer { border-radius: 0; }
  .footer-content { padding: 36px 20px 24px; }
  .footer-grid { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .footer-brand { flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; }
  .footer-location { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .footer-location address { max-width: none; }
  .footer-bottom { flex-direction: column; gap: 6px; margin-top: 24px; }
  .footer-map iframe { height: 200px; }
}
.footer-logo { display: block; width: 160px; max-width: 100%; height: auto; margin: 0; }
@media (max-width: 767px) {
  .footer-logo { width: 130px; }
  footer .footer-brand .footer-socials { gap: 10px; }
}
@media (min-width: 768px) and (max-width: 1000px) {
  .footer-grid { grid-template-columns: minmax(140px, .6fr) minmax(0, 1.4fr); }
  .footer-location { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .footer-location address { max-width: none; }
}
#rules .rules-grid { max-width: 960px; gap: 14px; }
#rules .rules-column { display: block; padding: 0; overflow: hidden; border-radius: 16px; border-color: #ff9a9e45; background: #ffffffb8; box-shadow: none; transition: border-color .25s ease, background .25s ease; }
#rules .rules-column.rules-expanded { border-color: #ff9a9e80; background: #fffcfd; }
#rules .rules-column > h3 { font-size: clamp(1.2rem, 1.8vw, 1.4rem); }
#rules .rules-column > h3::before { display: none; }
.rules-toggle { display: flex; justify-content: space-between; align-items: center; gap: 20px; width: 100%; min-height: 68px; padding: 18px 24px; border: 0; background: transparent; color: var(--pink-pop); font: inherit; text-align: left; cursor: pointer; transition: background .2s ease, color .2s ease; }
.rules-toggle:hover { background: #fff0f5; }
.rules-toggle:focus-visible { outline: 3px solid var(--pink-pop); outline-offset: -4px; border-radius: 16px; }
.rules-chevron { flex-shrink: 0; width: 10px; height: 10px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); transition: transform .35s ease; }
.rules-expanded .rules-chevron { transform: rotate(225deg); }
.rules-disclosure { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .45s cubic-bezier(.22,1,.36,1), opacity .3s ease; }
.rules-disclosure.expanded { grid-template-rows: 1fr; opacity: 1; }
.rules-disclosure-clip { min-height: 0; overflow: hidden; }
#rules .rules-disclosure .rule-card { margin: 0 24px; padding: 20px 0 24px; border-top: 1px solid #ff9a9e33; }
#rules .rules-exclusions { background: #fff0f5; }
#rules .rules-exclusions h4 { color: var(--pink-pop); }
#rules .rules-exclusions li::before { background: var(--pink-pop); }
#rules .rules-responsibilities li::before { color: var(--pink-pop); }
@media (max-width: 600px) {
  .rules-toggle { padding: 18px 20px; min-height: 64px; }
  #rules .rules-disclosure .rule-card { margin-inline: 20px; padding-bottom: 24px; }
}
/* Informative previews make the disclosures useful before they are opened. */
#rules .rules-grid { max-width: 1040px; gap: 20px; }
#rules .rules-column { border-radius: 22px; border-color: #f4d9df; background: #fffcfdeb; box-shadow: 0 8px 24px #ff9a9e0a; }
#rules .rules-toggle { align-items: center; padding: 24px 28px 12px; gap: 20px; }
.rules-heading-label { font-size: clamp(1.4rem, 2vw, 1.65rem); }
.rules-toggle-action { display: inline-flex; align-items: center; justify-content: center; gap: 14px; flex-shrink: 0; min-height: 44px; padding: 10px 16px; border: 1px solid #ff9a9e66; border-radius: 999px; color: #92365b; font: 700 .85rem 'Nunito', sans-serif; background: #fff0f5; }
.rules-toggle-action .rules-chevron { width: 7px; height: 7px; }
.rules-preview { padding: 0 28px 24px; max-width: 760px; }
.rules-preview p { margin: 0; font: 400 1rem/1.65 'Nunito', sans-serif; color: #596175; }
.rules-preview-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.rules-preview-tags span { padding: 5px 12px; border-radius: 8px; color: #70525e; background: #fcebf0; font: 700 .78rem/1.5 'Nunito', sans-serif; }
#rules .rules-disclosure .rule-card { margin-inline: 28px; padding-top: 24px; }
#rules .rules-expanded { box-shadow: 0 12px 28px #ff9a9e10; }
@media (max-width: 600px) {
  #rules > h2 { margin-bottom: 24px; }
  #rules .rules-grid { gap: 14px; }
  #rules .rules-toggle { align-items: flex-start; flex-direction: column; padding: 20px 20px 12px; gap: 12px; position: relative; }
  .rules-heading-label { font-size: 1.4rem; }
  .rules-toggle-action { min-height: 44px; padding: 8px 14px; }
  .rules-preview { padding: 0 20px 20px; }
  #rules .rules-disclosure .rule-card { margin-inline: 20px; }
}
.section-padding > h2 { margin-bottom: 22px; }
.responsible-wrapper { margin-top: 20px; }
.faq-question { padding: 18px 22px; }
@media (max-width: 767px) {
  .section-padding > h2, #rules > h2 { margin-bottom: 18px; }
  .card-container { gap: 12px; }
  .faq-container { gap: 10px; }
  .faq-question { padding: 18px; }
  .responsible-wrapper { margin-top: 16px; }
}
@media (min-width: 768px) {
  .hero + .stats-bar { margin-top: -72px; z-index: 3; }
}
nav > .language-toggle { display: inline-flex; justify-content: center; align-items: center; gap: 5px; padding: 10px 18px; min-width: 90px; font-size: .9rem; white-space: nowrap; flex-shrink: 0; }
.language-toggle span[lang] { font-weight: 500; }
.language-toggle .language-current { font-weight: 800 !important; text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 480px) {
  nav > .language-toggle { min-width: 78px; padding: 10px 12px !important; font-size: .8rem !important; }
}
#sakura-container.intro-paused .petal { animation-play-state: paused; }
/* A postcard layout, with the original contact copy in both languages. */
#responsible .responsible-card { position: relative; display: grid; grid-template-columns: 220px minmax(0, 1fr); align-items: center; max-width: 1000px; gap: 36px; padding: 38px; border: 1px solid #f3d3dd; border-radius: 24px; background: linear-gradient(115deg, #fff6f8, #fffdf9 55%, #fffafb); box-shadow: 0 12px 32px #92365b0a; }
#responsible .responsible-card:hover { transform: none; box-shadow: 0 16px 36px #92365b12; }
.resp-polaroid { position: relative; margin: 0; padding: 10px 10px 30px; background: #fffdfb; border: 1px solid #f0e4e2; box-shadow: 0 10px 20px #71364b1a; transform: rotate(-4deg); transition: transform .45s cubic-bezier(.22,1,.36,1); }
.resp-polaroid::before { content: ''; position: absolute; top: -12px; left: 32%; width: 36%; height: 24px; background: #f4bdc999; border: 1px solid #edbac533; transform: rotate(5deg); z-index: 1; }
#responsible .resp-img { display: block; width: 100%; height: auto; min-width: 0; min-height: 0; max-width: none; max-height: none; aspect-ratio: 1 / 1; border: 0; border-radius: 2px; box-shadow: none; object-fit: cover; object-position: center 25%; }
#responsible .resp-content { min-width: 0; padding: 24px 68px 24px 32px; border-left: 1px dashed #edb5c5; text-align: left; }
#responsible .resp-content h3 { font-size: clamp(1.6rem, 2.5vw, 2rem); line-height: 1.2; margin: 0; color: var(--text-main); }
#responsible .resp-content p { opacity: 1; }
#responsible .resp-message { margin: 16px 0 20px; color: #596175; line-height: 1.7; }
#responsible .resp-email-row { margin: 0; }
.resp-email { display: inline-flex; align-items: center; gap: 10px; max-width: 100%; min-height: 46px; padding: 10px 14px; border: 1px solid #ff9a9e80; border-radius: 12px; background: #fff0f5; color: #92365b; text-decoration: none; font-size: .9rem; font-weight: 700; transition: background .2s ease, box-shadow .2s ease; }
.resp-email span { min-width: 0; overflow-wrap: anywhere; }
.resp-email:hover { background: #ffe5ee; box-shadow: 0 5px 14px #ff9a9e20; }
.postcard-stamp { position: absolute; top: 20px; right: 20px; width: 60px; height: 74px; opacity: .8; pointer-events: none; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .responsible-card:hover .resp-polaroid, .responsible-card:focus-within .resp-polaroid { transform: rotate(-1deg) translateY(-3px); }
}
@media (max-width: 767px) {
  #responsible .responsible-card { grid-template-columns: minmax(0, 1fr); padding: 28px 22px 22px; gap: 24px; }
  .resp-polaroid { width: 174px; justify-self: center; padding: 8px 8px 24px; }
  #responsible .resp-content { padding: 24px 0 0; border-left: 0; border-top: 1px dashed #edb5c5; text-align: center; }
  #responsible .resp-content h3 { font-size: 1.65rem; }
  .resp-email { width: 100%; justify-content: center; font-size: .85rem; }
  .postcard-stamp { width: 46px; height: 58px; top: 14px; right: 12px; }
}
@media (prefers-reduced-motion: reduce) { .resp-polaroid { transform: none; } }
.landing-container.intro-active *, .landing-container.intro-active *::before, .landing-container.intro-active *::after { animation-play-state: paused !important; }
/* Photos pinned to a continuous-looking garland, with the lightbox unchanged. */
.gallery-wrapper { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-count: auto; gap: 36px 32px; max-width: 1120px; margin: 0 auto; padding: 8px 14px 16px; }
.gallery-memory { position: relative; min-width: 0; padding-top: 36px; }
.memory-cord { position: absolute; top: 0; left: -18px; width: calc(100% + 36px); height: 42px; pointer-events: none; }
.gallery-memory:nth-child(3n+1) { --memory-angle: -3deg; }
.gallery-memory:nth-child(3n+2) { --memory-angle: 2deg; }
.gallery-memory:nth-child(3n) { --memory-angle: -1deg; }
.gallery-memory .gallery-trigger { position: relative; margin: 0; padding: 10px 10px 32px; border: 1px solid #eee0db; border-radius: 3px; background: #fffdf9; box-shadow: 0 8px 18px #71364b1a; transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) rotateZ(var(--memory-angle)); transform-origin: 50% 0; }
.gallery-memory .gallery-trigger::before { content: ''; position: absolute; z-index: 2; top: -18px; left: calc(50% - 5px); width: 10px; height: 29px; border: 1px solid #c59883; border-radius: 2px; background: linear-gradient(90deg, #dfb79f 0 40%, #b98b75 40% 55%, #ebcbb7 55%); box-shadow: 1px 2px 3px #71364b14; }
.gallery-memory .gallery-trigger .gallery-img { width: 100%; height: auto; border-radius: 1px; box-shadow: none; transform: none; filter: none; }
.gallery-memory .gallery-trigger:hover .gallery-img { transform: none; }
.gallery-memory .gallery-trigger:focus-visible { outline-color: #92365b; outline-offset: 5px; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .gallery-memory .gallery-trigger:hover, .gallery-memory .gallery-trigger:focus-visible { transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) rotateZ(0deg); box-shadow: 0 14px 28px #71364b26; z-index: 3; }
}
@media (min-width: 541px) and (max-width: 1000px) { .gallery-wrapper { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 540px) {
  .gallery-wrapper { grid-template-columns: minmax(0, 1fr); max-width: 360px; padding-inline: 18px; row-gap: 20px; }
  .gallery-memory .gallery-trigger { padding: 9px 9px 28px; }
  .gallery-memory:nth-child(odd) { --memory-angle: -2deg; }
  .gallery-memory:nth-child(even) { --memory-angle: 2deg; }
}
@media (prefers-reduced-motion: reduce) { .gallery-memory .gallery-trigger { transform: none; } }
.footer-credit { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }
.footer-bottom { align-items: center; }
.footer-best-link { display: inline-flex; align-items: center; justify-content: center; padding: 9px 14px; border-radius: 12px; background: transparent; transition: background .2s ease; }
.footer-best-link img { display: block; width: 96px; height: auto; filter: brightness(0); }
.footer-best-link:hover { background: #ffffff80; }
@media (max-width: 767px) {
  .footer-bottom { align-items: flex-start; gap: 14px; }
  .footer-credit { gap: 12px; }
}
</style>
