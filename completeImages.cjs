// Script pentru completarea automată a imaginilor lipsă cu poze relevante de pe Unsplash
// Rulează: node completeImages.cjs

const axios = require('axios');
const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('src/courses.json', 'utf-8'));
const isWrapped = !Array.isArray(raw) && Array.isArray(raw.courses);
const courses = isWrapped ? raw.courses : (Array.isArray(raw) ? raw : []);
const UNSPLASH_ACCESS_KEY = 'Z3NBxrIlKlBQYgQdcKqLw7nCNWW8St0m_NbobTkhV9U';

async function getUnsplashImage(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;
    const { data } = await axios.get(url, { timeout: 6000 });
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (e) {}
  return '';
}

(async () => {
  if (courses.length === 0) {
    console.log('Nu există cursuri în fișierul courses.json.');
    return;
  }
  let updated = 0;
  for (const course of courses) {
    if (!course.img || course.img.includes('BEST_signature.svg')) {
      let img = await getUnsplashImage(`${course.city} ${course.country}`);
      if (!img) img = await getUnsplashImage(course.city);
      if (!img) img = await getUnsplashImage(course.country);
      if (img) {
        course.img = img;
        updated++;
      }
    }
  }
  if (isWrapped) {
    raw.courses = courses;
    fs.writeFileSync('src/courses.json', JSON.stringify(raw, null, 2));
  } else {
    fs.writeFileSync('src/courses.json', JSON.stringify(courses, null, 2));
  }
  console.log(`Imaginile au fost verificate/completate! (${updated} actualizate)`);
})();
