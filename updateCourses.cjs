// Script pentru actualizarea automată a listei de cursuri BEST
// Rulează: node updateCourses.cjs

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.best.eu.org/courses/list.jsp';

async function fetchCourses() {
  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);
  const courses = [];

  // Caută toate tabelele de pe pagină și extrage rândurile cu 6 sau mai multe coloane
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
        if (linkElem) link = 'https://www.best.eu.org' + linkElem;
        courses.push({ title, city, country, dates, fee, link, img: '' });
      }
    });
  });

  // Extrage imaginea pentru fiecare curs (doar dacă există link)
  for (const course of courses) {
    if (course.link) {
      try {
        const { data: eventPage } = await axios.get(course.link);
        const $event = cheerio.load(eventPage);
        const imgElem = $event('img').first().attr('src') || '';
        course.img = imgElem.startsWith('http') ? imgElem : (imgElem ? 'https://www.best.eu.org' + imgElem : '');
      } catch {
        course.img = '';
      }
    }
  }

  fs.writeFileSync('src/courses.json', JSON.stringify(courses, null, 2));
  console.log('Cursurile au fost actualizate!');
}

fetchCourses();