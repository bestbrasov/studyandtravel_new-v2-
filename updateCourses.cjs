// Script pentru actualizarea automată a cursurilor BEST în funcție de sezonul curent (sau specificat)
// Rulează: node updateCourses.cjs [sezon_optional] (ex: node updateCourses.cjs sau node updateCourses.cjs autumn26)

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.best.eu.org';
const COURSES_JSON_PATH = path.join(__dirname, 'src', 'courses.json');
if (fs.existsSync('.env')) process.loadEnvFile('.env');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const cleanText = value => value.replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u20E3]/gu, '').replace(/\s+/g, ' ').trim();

// Păstrăm imaginile existente din fișierul anterior pentru a nu reface cereri inutile
let existingImages = new Map();
if (fs.existsSync(COURSES_JSON_PATH)) {
  try {
    const raw = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf-8'));
    const prevCourses = Array.isArray(raw) ? raw : (raw.courses || []);
    for (const c of prevCourses) {
      if (c.title && c.img && !c.img.includes('BEST_signature.svg')) {
        existingImages.set(c.title, c.img);
      }
    }
  } catch (error) { console.warn('Nu s-au putut citi imaginile existente:', error.message); }
}

async function getUnsplashImage(query) {
  if (!UNSPLASH_ACCESS_KEY) return '';
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;
    const { data } = await axios.get(url, { timeout: 6000 });
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) { console.warn(`Unsplash: căutarea pentru ${query} a eșuat (${error.code || error.response?.status || 'eroare de rețea'}).`); }
  return '';
}

function parseCards($, targetUrl) {
  const heading = $('h1,h2').filter((_, el) => /^List of BEST Courses$/i.test($(el).text().trim())).first();
  if (!heading.length) throw new Error('Secțiunea BEST Courses nu a fost recunoscută; datele existente sunt păstrate.');
  const section = heading.nextUntil('h1,h2');
  $ = cheerio.load(section.toArray().map(el => $.html(el)).join('\n'));
  const courses = [];
  
  // 1. Noua structură BEST bazată pe carduri (.event-cards-grid)
  const courseGrid = $('.event-cards-grid').first();
  if (courseGrid.length > 0 && courseGrid.find('a.event-card').length > 0) {
    courseGrid.find('a.event-card').each((_, el) => {
      const card = $(el);
      const title = card.find('.event-card-name').text().trim();
      const place = card.find('.event-card-place').text().trim();
      const placeParts = place.split(',').map(p => p.trim());
      const city = placeParts[0] || '';
      const country = placeParts[1] || '';

      let dates = '';
      let fee = '';
      card.find('.event-card-row').each((_, r) => {
        const rowText = $(r).text().trim();
        if ($(r).hasClass('event-card-fee')) {
          fee = rowText;
        } else if (!dates && !rowText.includes('BEST Course') && !rowText.includes('Academic complexity')) {
          dates = rowText.replace(/\s+/g, ' ');
        }
      });

      const href = card.attr('href') || '';
      const link = href ? new URL(href, targetUrl).href : '';
      const img = existingImages.get(title) || '';

      courses.push({ title, city, country, dates, fee, link, img });
    });
  }

  // 2. Structura clasică (table) dacă există
  if (courses.length === 0) {
    $('table').each((i, table) => {
      $(table).find('tr').each((j, row) => {
        const tds = $(row).find('td');
        if (tds.length >= 6) {
          const title = $(tds[0]).text().trim();
          const cityCountry = $(tds[1]).text().trim().split(',');
          const city = cityCountry[0]?.trim() || '';
          const country = cityCountry[1]?.trim() || '';
          const dates = $(tds[2]).text().trim();
          const fee = $(tds[5]).text().trim();
          let link = '';
          const linkElem = $(tds[0]).find('a').attr('href');
          if (linkElem) link = new URL(linkElem, targetUrl).href;
          const img = existingImages.get(title) || '';
          courses.push({ title, city, country, dates, fee, link, img });
        }
      });
    });
  }

  for (const course of courses) {
    for (const field of ['title', 'city', 'country', 'dates', 'fee']) {
      if (typeof course[field] === 'string') course[field] = cleanText(course[field]);
    }
    if (['title', 'city', 'country', 'dates', 'fee', 'link'].some(field => typeof course[field] !== 'string' || !course[field].trim())) {
      throw new Error('Înregistrare incompletă; datele existente sunt păstrate.');
    }
    const link = new URL(course.link);
    if (link.protocol !== 'https:' || !['www.best.eu.org', 'best.eu.org'].includes(link.hostname) || !/\d|free|gratuit/i.test(course.fee)) {
      throw new Error('Link sau taxă invalidă; datele existente sunt păstrate.');
    }
  }
  const explicitlyEmpty = /Unfortunately, no Local BEST Group is organising a BEST Course this season/i.test($.root().text());
  if (!courses.length && !explicitlyEmpty) throw new Error('Lista goală nu este confirmată de BEST; posibil eșec de parsare.');
  if (courses.length && explicitlyEmpty) throw new Error('Date contradictorii în secțiunea de cursuri.');
  return courses;
}

async function updateCourses() {
  const targetSeasonArg = process.argv[2];
  let url = `${BASE_URL}/courses/list.jsp`;
  if (targetSeasonArg) {
    url += `?season=${encodeURIComponent(targetSeasonArg)}`;
  }

  console.log(`[1/4] Descărcare date de pe ${url}...`);
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const $ = cheerio.load(data);

  // Extrage denumirea sezonului curent
  let seasonName = '';
  const seasonBtn = $('button:contains("Season")').first().text().trim();
  if (seasonBtn) {
    seasonName = seasonBtn;
  } else if (targetSeasonArg) {
    seasonName = targetSeasonArg;
  } else {
    seasonName = 'Current season';
  }

  // Verifică mesajul informativ dacă nu sunt cursuri
  let notice = '';
  const noCourseEl = $(':contains("Unfortunately, no Local BEST Group")');
  if (noCourseEl.length > 0) {
    notice = 'Momentan niciun grup local BEST nu organizează un curs în acest sezon. Revino în curând pentru noi destinații!';
  }

  // Deadlines
  let deadlines = '';
  const deadH3 = $('h3:contains("Season deadlines")');
  if (deadH3.length) {
    const deadPanel = deadH3.closest('.panel');
    const deadText = (deadPanel.length ? deadPanel.text() : deadH3.parent().text())
      .replace(/\s+/g, ' ')
      .trim();
    const appBegins = deadText.match(/Application begins:\s*([0-9A-Za-z\s,:]+?)(?=Application ends|$)/);
    const appEnds = deadText.match(/Application ends:\s*([0-9A-Za-z\s,:]+?)(?=Selection of participants|$)/);
    if (appBegins && appEnds) {
      deadlines = `Înscrieri: ${appBegins[1].trim()} — ${appEnds[1].trim()}`;
    }
  }

  console.log(`[2/4] Sezon detectat: ${seasonName}`);

  // Extragere cursuri
  const courses = parseCards($, url);
  console.log(`[3/4] Cursuri găsite: ${courses.length}`);

  // Completare automată imagini Unsplash dacă sunt cursuri fără imagine
  if (courses.length > 0) {
    console.log('[3.5/4] Verificare și completare imagini...');
    for (const course of courses) {
      if (!course.img || course.img.includes('BEST_signature.svg')) {
        console.log(`  -> Căutare imagine pentru ${course.city}, ${course.country}...`);
        let img = await getUnsplashImage(`${course.city} ${course.country}`);
        if (!img) img = await getUnsplashImage(course.city);
        if (!img) img = await getUnsplashImage(course.country);
        if (img) course.img = img;
      }
    }
  }

  const payload = {
    season: cleanText(seasonName),
    seasonCode: targetSeasonArg || '',
    notice: notice,
    deadlines: deadlines,
    lastUpdated: new Date().toISOString(),
    courses: courses
  };

  const temporaryPath = `${COURSES_JSON_PATH}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(payload, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporaryPath, COURSES_JSON_PATH);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
  console.log(`[4/4] Fișierul ${COURSES_JSON_PATH} a fost actualizat cu succes!`);
  console.log(`Rezumat: ${courses.length} cursuri pentru ${seasonName}`);
}

if (require.main === module) updateCourses().catch((err) => {
  console.error('Eroare la actualizarea cursurilor:', err.message);
  process.exit(1);
});
module.exports = { parseCards, updateCourses };
