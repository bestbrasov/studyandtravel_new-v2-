import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import messages from '../src/locales/messages.json' with { type: 'json' };
import { readLanguage, translateMessage, translateContent, languageStorageKey } from '../src/i18n.js';

test('every message has complete Romanian and English versions', () => {
  for (const [id, message] of Object.entries(messages)) {
    assert.ok(message.ro.trim(), `${id}: missing Romanian`);
    assert.ok(message.en.trim(), `${id}: missing English`);
    assert.equal(translateMessage(id, 'ro'), message.ro);
    assert.equal(translateMessage(id, 'en'), message.en);
    const links = text => [...text.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links(message.en), links(message.ro), `${id}: links changed in translation`);
  }
});

test('every template translation key exists', () => {
  const app = readFileSync(new URL('../src/App.vue', import.meta.url), 'utf8');
  for (const match of app.matchAll(/\bt\('([^']+)'\)/g)) assert.ok(messages[match[1]], match[1]);
});

test('benefits, exclusions, responsibilities and refund conditions are present in both languages', () => {
  const keys = [...Array.from({ length: 8 }, (_, i) => 104 + i), ...Array.from({ length: 4 }, (_, i) => 113 + i), ...Array.from({ length: 12 }, (_, i) => 122 + i), 134];
  const app = readFileSync(new URL('../src/App.vue', import.meta.url), 'utf8');
  for (const key of keys) {
    const id = `text${key}`;
    assert.ok(app.includes(`t('${id}')`), `${id}: not rendered`);
    assert.ok(messages[id].ro && messages[id].en);
  }
  assert.ok(messages.text056.en.includes('€40'));
  assert.ok(messages.text059.en.includes('60%'));
  assert.ok(messages.text134.en.includes('70%'));
});

test('saved language is respected and unavailable storage safely defaults to Romanian', () => {
  assert.equal(readLanguage({ getItem: key => key === languageStorageKey ? 'en' : null }), 'en');
  assert.equal(readLanguage({ getItem: () => 'invalid' }), 'ro');
  assert.equal(readLanguage({ getItem: () => { throw new Error('Storage blocked'); } }), 'ro');
  assert.equal(readLanguage(), 'ro');
});

test('dynamic content switches language without modifying season dates or external course titles', () => {
  assert.equal(translateContent('Acasă', 'en'), 'Home');
  assert.equal(translateContent(messages.text149.ro, 'en'), messages.text149.en);
  assert.equal(translateContent('Înscrieri: 13 Sep 2026, 23:00', 'en'), 'Applications: 13 Sep 2026, 23:00');
  assert.equal(translateContent('Winter 2026', 'ro'), 'Winter 2026');
  assert.equal(translateContent('External course title', 'en'), 'External course title');
});
