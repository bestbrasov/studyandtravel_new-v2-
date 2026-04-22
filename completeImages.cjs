// Script pentru completarea automată a imaginilor lipsă cu poze relevante de pe Unsplash
// Rulează: node completeImages.cjs
// Necesită axios și fs (npm install axios)

const axios = require('axios');
const fs = require('fs');

const courses = JSON.parse(fs.readFileSync('src/courses.json', 'utf-8'));
const UNSPLASH_ACCESS_KEY = 'Z3NBxrIlKlBQYgQdcKqLw7nCNWW8St0m_NbobTkhV9U'; // Cheie Unsplash furnizată de utilizator

async function getUnsplashImage(query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;
    const { data } = await axios.get(url);
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (e) {}
  return '';
}

(async () => {
  for (const course of courses) {
    if (!course.img || course.img.includes('BEST_signature.svg')) {
      // Caută imagine după oraș și țară
      let img = await getUnsplashImage(`${course.city} ${course.country}`);
      if (!img) img = await getUnsplashImage(course.city);
      if (!img) img = await getUnsplashImage(course.country);
      course.img = img || course.img;
    }
  }
  fs.writeFileSync('src/courses.json', JSON.stringify(courses, null, 2));
  console.log('Imaginile lipsă au fost completate!');
})();
