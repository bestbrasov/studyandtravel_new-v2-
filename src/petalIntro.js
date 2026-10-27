export const introSessionKey = 'study-travel-petal-intro-seen';
export const introDuration = 1200;

export function shouldShowIntro({ storage, reducedMotion = false, hash = '', scrollY = 0 }) {
  if (reducedMotion || (hash && hash !== '#hero') || scrollY > 120) return false;
  try { return storage?.getItem(introSessionKey) !== '1'; }
  catch { return true; }
}

export function createPetalField(width, height, random = Math.random) {
  const mobile = width < 768;
  const limit = mobile ? 340 : 900;
  const columns = Math.max(3, Math.floor(Math.sqrt(limit * width / height)));
  const rows = Math.max(3, Math.floor(limit / columns));
  const stepX = width / (columns - 1);
  const stepY = height / (rows - 1);
  const spacing = Math.max(stepX, stepY);
  const petals = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = column * stepX;
      const y = row * stepY;
      const px = x + (random() - .5) * spacing;
      const py = y + (random() - .5) * spacing;
      petals.push({
        x: px, y: py, size: spacing * (2.1 + random() * .9),
        angle: Math.atan2(py - height / 2, px - width / 2),
        rotation: random() * Math.PI * 2,
        spin: (random() - .5) * 2.5,
        delay: Math.min(.18, Math.hypot(px - width / 2, py - height / 2) / Math.hypot(width, height) * .3),
        opacity: .75 + random() * .25,
      });
    }
  }
  return petals;
}

export function petalPosition(petal, progress, width, height) {
  const phase = Math.max(0, Math.min(1, (progress - petal.delay) / (1 - petal.delay)));
  const outward = phase * phase * Math.max(width, height) * 1.3;
  const curl = Math.sin(phase * Math.PI) * petal.spin * 35;
  return {
    x: petal.x + Math.cos(petal.angle) * outward - Math.sin(petal.angle) * curl,
    y: petal.y + Math.sin(petal.angle) * outward + Math.cos(petal.angle) * curl,
    rotation: petal.rotation + petal.spin * phase,
    opacity: petal.opacity * (1 - Math.max(0, (phase - .65) / .35)),
  };
}
