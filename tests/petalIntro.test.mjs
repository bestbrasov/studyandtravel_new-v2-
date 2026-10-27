import test from 'node:test';
import assert from 'node:assert/strict';
import { createPetalField, petalPosition, shouldShowIntro, introSessionKey, lockIntroScroll } from '../src/petalIntro.js';

test('intro blocks wheel, touch and scroll keys until unlocked, then restores the page', () => {
  const listeners = new Map();
  const pageWindow = {
    addEventListener: (type, callback) => listeners.set(type, callback),
    removeEventListener: (type, callback) => { if (listeners.get(type) === callback) listeners.delete(type); },
  };
  const pageDocument = { documentElement: { style: { overflow: 'clip' } }, body: { style: { overflow: '' } } };
  const unlock = lockIntroScroll(pageWindow, pageDocument);
  assert.equal(pageDocument.documentElement.style.overflow, 'hidden');
  assert.equal(pageDocument.body.style.overflow, 'hidden');
  for (const type of ['wheel', 'touchmove']) {
    let prevented = false;
    listeners.get(type)({ preventDefault: () => { prevented = true; } });
    assert.equal(prevented, true);
  }
  for (const key of ['ArrowDown', 'PageDown', 'Home', 'End']) {
    let prevented = false;
    listeners.get('keydown')({ key, preventDefault: () => { prevented = true; } });
    assert.equal(prevented, true);
  }
  let activationBlocked = false;
  listeners.get('keydown')({ key: 'Enter', preventDefault: () => { activationBlocked = true; } });
  assert.equal(activationBlocked, false);
  unlock();
  unlock();
  assert.equal(pageDocument.documentElement.style.overflow, 'clip');
  assert.equal(pageDocument.body.style.overflow, '');
  assert.equal(listeners.size, 0);
});

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
