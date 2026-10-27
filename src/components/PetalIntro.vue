<template>
  <Teleport to="body">
    <button v-if="visible" ref="entryButton" type="button" class="petal-intro" :class="{ 'is-releasing': releasing }"
      :aria-label="label" :aria-busy="releasing" @click="release" @keydown.esc.prevent="release" @keydown.tab.prevent>
      <canvas ref="canvasElement" aria-hidden="true"></canvas>
      <span class="petal-intro-invitation" aria-hidden="true">
        <span class="petal-intro-brand">BEST Courses</span>
        <span>{{ label }}</span>
      </span>
    </button>
  </Teleport>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { createPetalField, petalPosition, shouldShowIntro, introDuration, introSessionKey, lockIntroScroll } from '../petalIntro.js';

defineProps({ label: { type: String, required: true } });
const emit = defineEmits(['active']);
const visible = ref(false);
const releasing = ref(false);
const canvasElement = ref(null);
const entryButton = ref(null);
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
let previousFocus;
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
  nextTick(() => {
    if (disposed) return;
    const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected
      ? previousFocus : document.querySelector('.hero-actions a');
    target?.focus({ preventScroll: true });
  });
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

onMounted(async () => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  try { storage = window.sessionStorage; } catch { /* Private browsing may block storage. */ }
  if (!shouldShowIntro({ storage, reducedMotion: media.matches, hash: window.location.hash, scrollY: window.scrollY })) return;
  sprite = new Image();
  sprite.src = '/images/intro-petal.webp';
  try { await sprite.decode(); } catch { return; }
  if (disposed || media.matches) return;
  visible.value = true;
  previousFocus = document.activeElement;
  unlockScroll = lockIntroScroll(window, document);
  emit('active', true);
  await nextTick();
  if (disposed || !canvasElement.value) return;
  context = canvasElement.value.getContext('2d');
  if (!context) { finish(); return; }
  resize();
  entryButton.value.focus({ preventScroll: true });
  window.addEventListener('resize', queueResize, { passive: true });
  media.addEventListener('change', motionChanged);
});

onUnmounted(() => {
  disposed = true;
  cancelAnimationFrame(frame);
  cancelAnimationFrame(resizeFrame);
  clearTimeout(finishTimer);
  window.removeEventListener('resize', queueResize);
  media?.removeEventListener('change', motionChanged);
  unlockScroll();
});
</script>

<style scoped>
.petal-intro { position: fixed; inset: 0; width: 100%; height: 100dvh; z-index: 11000; display: block; padding: 0; border: 0; background: transparent; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.petal-intro canvas { display: block; width: 100%; height: 100%; pointer-events: none; }
.petal-intro:focus-visible { outline: 3px solid #92365b; outline-offset: -6px; }
.petal-intro-invitation { position: absolute; left: 50%; bottom: max(8vh, 32px); transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; width: max-content; max-width: calc(100% - 40px); padding: 16px 28px; border: 1px solid #ff9a9e66; border-radius: 24px; background: #fff9f4ed; color: #71364b; box-shadow: 0 8px 24px #92365b14; font: 700 .95rem/1.5 'Nunito', sans-serif; transition: opacity .18s ease, translate .18s ease; }
.petal-intro-brand { font: 600 1.3rem/1.2 'Baloo 2', sans-serif; color: #92365b; }
.is-releasing { cursor: default; }
.is-releasing .petal-intro-invitation { opacity: 0; translate: 0 8px; }
@media (max-width: 767px) { .petal-intro-invitation { bottom: max(9vh, env(safe-area-inset-bottom, 24px)); padding: 14px 22px; font-size: .9rem; } }
@media (prefers-reduced-motion: reduce) { .petal-intro { display: none; } }
</style>
