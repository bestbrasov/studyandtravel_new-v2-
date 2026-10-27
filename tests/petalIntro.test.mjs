import test from 'node:test';
import assert from 'node:assert/strict';
import { createPetalField, petalPosition, shouldShowIntro, introSessionKey } from '../src/petalIntro.js';

test('intro respects session memory, deep links, scroll restoration and reduced motion', () => {
  assert.equal(shouldShowIntro({}), true);
  assert.equal(shouldShowIntro({ storage: { getItem: key => key === introSessionKey ? '1' : null } }), false);
  assert.equal(shouldShowIntro({ reducedMotion: true }), false);
  assert.equal(shouldShowIntro({ hash: '#responsible' }), false);
  assert.equal(shouldShowIntro({ hash: '#hero' }), true);
  assert.equal(shouldShowIntro({ scrollY: 400 }), false);
  assert.equal(shouldShowIntro({ storage: { getItem: () => { throw new Error('Blocked'); } } }), true);
});

test('particle budget stays bounded on mobile and desktop and covers the full height', () => {
  for (const [width, height, limit] of [[320, 740, 340], [390, 844, 340], [1440, 900, 900], [1920, 1080, 900]]) {
    const petals = createPetalField(width, height, () => .5);
    assert.ok(petals.length <= limit);
    assert.ok(petals.some(petal => petal.y === 0));
    assert.ok(petals.some(petal => Math.abs(petal.y - height) < .001));
    assert.ok(petals.every(petal => Number.isFinite(petal.size)));
  }
});

test('petals disperse outward from the centre and disappear at completion', () => {
  const width = 390, height = 844;
  const petals = createPetalField(width, height, () => .5);
  for (const petal of petals) {
    assert.equal(petalPosition(petal, 0, width, height).x, petal.x);
    const middle = petalPosition(petal, .6, width, height);
    assert.ok(Math.hypot(middle.x - width / 2, middle.y - height / 2) >= Math.hypot(petal.x - width / 2, petal.y - height / 2));
    assert.equal(petalPosition(petal, 1, width, height).opacity, 0);
  }
});
