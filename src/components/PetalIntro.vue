<template>
  <Teleport to="body">
    <div v-if="visible" class="petal-intro" aria-hidden="true">
      <canvas ref="canvasElement" aria-hidden="true"></canvas>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { createPetalField, petalPosition, shouldShowIntro, introDuration, introSessionKey, lockIntroScroll } from '../petalIntro.js';

const emit = defineEmits(['active']);
const visible = ref(false);
const releasing = ref(false);
const canvasElement = ref(null);
let context;
let sprite;
let petals = [];
let width = 0;
let height = 0;
let frame = 0;
let startedAt = 0;
let finishTimer;
let resizeFrame = 0;
let storage;
let media;
let unlockScroll = () => {};
let disposed = false;
let progress = 0;

function draw(value = 0) {
  if (!context) return;
  context.clearRect(0, 0, width, height);
  // The veil reveals the real page, rather than a second copy of the hero.
  context.fillStyle = `rgba(255, 240, 245, ${.62 * (1 - value)})`;
  context.fillRect(0, 0, width, height);
  for (const petal of petals) {
    const position = petalPosition(petal, value, width, height);
    if (position.opacity <= 0 || position.x < -petal.size || position.x > width + petal.size || position.y < -petal.size || position.y > height + petal.size) continue;
    context.save();
    context.translate(position.x, position.y);
    context.rotate(position.rotation);
    context.globalAlpha = position.opacity;
    context.drawImage(sprite, -petal.size / 2, -petal.size / 2, petal.size, petal.size);
    context.restore();
  }
}

function resize() {
  resizeFrame = 0;
  const canvas = canvasElement.value;
  if (!canvas || !sprite) return;
  width = window.innerWidth;
  height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  petals = createPetalField(width, height);
  draw(progress);
}

function queueResize() {
  if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
}

function finish() {
  if (!visible.value) return;
  cancelAnimationFrame(frame);
  cancelAnimationFrame(resizeFrame);
  clearTimeout(finishTimer);
  try { storage?.setItem(introSessionKey, '1'); } catch { /* No storage is required to enter. */ }
  visible.value = false;
  unlockScroll();
  emit('active', false);
  window.removeEventListener('resize', queueResize);
  media?.removeEventListener('change', motionChanged);
}

function tick(time) {
  if (!startedAt) startedAt = time;
  progress = Math.min(1, (time - startedAt) / introDuration);
  draw(progress);
  if (progress < 1) frame = requestAnimationFrame(tick);
  else finish();
}

function release() {
  if (releasing.value) return;
  if (media.matches) { finish(); return; }
  releasing.value = true;
  frame = requestAnimationFrame(tick);
  // Guarantees entry even if animation frames are throttled in a background tab.
  finishTimer = setTimeout(finish, introDuration + 250);
}

function motionChanged() { if (media.matches) finish(); }

function clearBootScreen() { document.dispatchEvent(new Event('petal-intro-ready')); }

function createImmediatePetal() {
  const petal = document.createElement('canvas');
  petal.width = 96;
  petal.height = 96;
  const paint = petal.getContext('2d');
  if (!paint) return null;
  const gradient = paint.createLinearGradient(15, 80, 75, 15);
  gradient.addColorStop(0, '#ec77ab');
  gradient.addColorStop(.6, '#ff9a9e');
  gradient.addColorStop(1, '#fad0c4');
  paint.fillStyle = gradient;
  paint.beginPath();
  paint.moveTo(12, 84);
  paint.bezierCurveTo(19, 45, 32, 15, 60, 12);
  paint.bezierCurveTo(76, 9, 86, 17, 75, 29);
  paint.bezierCurveTo(94, 22, 92, 43, 80, 55);
  paint.bezierCurveTo(60, 76, 34, 72, 12, 84);
  paint.fill();
  return petal;
}

onMounted(async () => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  try { storage = window.sessionStorage; } catch { /* Private browsing may block storage. */ }
  if (!shouldShowIntro({ storage, reducedMotion: media.matches, hash: window.location.hash, scrollY: window.scrollY })) { clearBootScreen(); return; }
  sprite = createImmediatePetal();
  if (!sprite) { clearBootScreen(); return; }
  visible.value = true;
  unlockScroll = lockIntroScroll(window, document);
  emit('active', true);
  await nextTick();
  if (disposed || !canvasElement.value) return;
  context = canvasElement.value.getContext('2d');
  if (!context) { clearBootScreen(); finish(); return; }
  resize();
  clearBootScreen();
  window.addEventListener('resize', queueResize, { passive: true });
  media.addEventListener('change', motionChanged);
  // Never delay entry or scroll locking for an image download.
  const image = new Image();
  image.src = '/images/intro-petal.webp';
  image.decode().then(() => {
    if (!disposed && visible.value) { sprite = image; draw(progress); }
  }).catch(() => { /* The immediately available petal keeps the intro functional offline. */ });
  release();
});

onUnmounted(() => {
  disposed = true;
  cancelAnimationFrame(frame);
  cancelAnimationFrame(resizeFrame);
  clearTimeout(finishTimer);
  window.removeEventListener('resize', queueResize);
  media?.removeEventListener('change', motionChanged);
  unlockScroll();
  clearBootScreen();
});
</script>

<style scoped>
.petal-intro { position: fixed; inset: 0; width: 100%; height: 100dvh; z-index: 11000; display: block; background: transparent; }
.petal-intro canvas { display: block; width: 100%; height: 100%; pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .petal-intro { display: none; } }
</style>
