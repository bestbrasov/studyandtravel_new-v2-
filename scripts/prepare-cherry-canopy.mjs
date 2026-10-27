import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const original = path.join(root, 'assets-originals/hero/cherry-branches-brushed.png');
await fs.mkdir(path.dirname(original), { recursive: true });
if (process.argv[2]) await fs.copyFile(process.argv[2], original, fs.constants.COPYFILE_EXCL);
const metadata = await sharp(original).metadata();
const stats = await sharp(original).stats();
if (!metadata.hasAlpha || stats.channels[3].min !== 0) throw new Error('Ilustrația trebuie să aibă fundal transparent.');
const full = await sharp(original).resize({ width: 1600, withoutEnlargement: true }).blur(.5).webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(root, 'public/images/cherry-branches-brushed-1600.webp'));
const small = await sharp(original).resize({ width: 1000, withoutEnlargement: true }).blur(.4).webp({ quality: 85, alphaQuality: 100 }).toFile(path.join(root, 'public/images/cherry-branches-brushed-1000.webp'));

// Punctele de emisie urmează marginea inferioară a florilor roz, nu trunchiul.
const { data, info } = await sharp(original).resize({ width: 320 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const emitters = [];
for (let x = 12; x < info.width - 8; x += 9) {
  const limit = Math.floor(info.height * (x < info.width * .25 ? .9 : x > info.width * .8 ? .92 : .46));
  for (let y = limit; y > 6; y--) {
    const offset = (y * info.width + x) * 4;
    const [r, g, b, a] = data.subarray(offset, offset + 4);
    if (a > 200 && r > 145 && g > 55 && g < 235 && b > 100 && r > g + 10 && r > b + 3 && b > g - 18) {
      emitters.push({ x: +(x / info.width).toFixed(4), y: +(y / info.height).toFixed(4), color: `rgb(${r}, ${g}, ${b})` });
      break;
    }
  }
}
if (emitters.length < 10) throw new Error('Nu au fost identificate suficiente puncte de emisie.');
await fs.writeFile(path.join(root, 'src/cherry-canopy.json'), JSON.stringify({ width: full.width, height: full.height, smallWidth: small.width, emitters }, null, 2) + '\n');
console.log(JSON.stringify({ alpha: true, width: full.width, height: full.height, emitters: emitters.length, bytes: full.size + small.size }));
