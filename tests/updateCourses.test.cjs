const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const axios = require('axios');
const { parseCards, updateCourses } = require('../updateCourses.cjs');
const base = 'https://www.best.eu.org/courses/list.jsp';
const heading = '<h2>List of BEST Courses</h2>';
const card = '<a class="event-card" href="/courses/test.jsp"><div class="event-card-name">Test course</div><div class="event-card-place">Test city, Test country</div><div class="event-card-row">1–8 Jan 2027</div><div class="event-card-row event-card-fee">20 EUR</div></a>';
const parse = html => parseCards(cheerio.load(html), base);

test('imports only BEST Courses, excluding later event categories', () => {
  const result = parse(`${heading}<div class="event-cards-grid">${card}</div><h1>BEST Symposia on Education</h1><div class="event-cards-grid">${card}</div>`);
  assert.equal(result.length, 1);
  assert.equal(result[0].link, 'https://www.best.eu.org/courses/test.jsp');
});
test('allows an explicitly empty season', () => {
  assert.deepEqual(parse(`${heading}<div>Unfortunately, no Local BEST Group is organising a BEST Course this season.</div><div class="event-cards-grid"></div>`), []);
});
test('rejects unrecognized pages, silent empty lists and incomplete cards', () => {
  assert.throws(() => parse('<html>Service unavailable</html>'));
  assert.throws(() => parse(`${heading}<div class="event-cards-grid"></div>`));
  assert.throws(() => parse(`${heading}<div class="event-cards-grid">${card.replace('Test city, Test country', '')}</div>`));
});
test('rejects unsafe course links', () => {
  assert.throws(() => parse(`${heading}<div class="event-cards-grid">${card.replace('/courses/test.jsp', 'javascript:alert(1)')}</div>`));
});
test('removes emoji from imported course text without changing the fee', () => {
  const emoji = String.fromCodePoint(0x1f338);
  const result = parse(`${heading}<div class="event-cards-grid">${card.replace('Test course', `${emoji} Test course`)}</div>`);
  assert.equal(result[0].title, 'Test course');
  assert.equal(result[0].fee, '20 EUR');
});
test('parsing and request failures leave courses.json unchanged', async () => {
  const file = path.join(__dirname, '../src/courses.json');
  const before = fs.readFileSync(file);
  const get = axios.get;
  try {
    axios.get = async () => ({ data: '<html>Changed structure</html>' });
    await assert.rejects(updateCourses());
    assert.deepEqual(fs.readFileSync(file), before);
    axios.get = async () => { throw new Error('Request timed out'); };
    await assert.rejects(updateCourses());
    assert.deepEqual(fs.readFileSync(file), before);
  } finally { axios.get = get; }
});
