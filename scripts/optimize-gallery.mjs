import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public/images/wallofmemories');
const originals = path.join(root, 'assets-originals/wallofmemories');
await fs.mkdir(originals, { recursive: true });
for (const name of await fs.readdir(publicDir)) {
  if (/\.jpe?g$/i.test(name)) {
    await fs.copyFile(path.join(publicDir, name), path.join(originals, name), fs.constants.COPYFILE_EXCL);
    await fs.unlink(path.join(publicDir, name));
  }
}
const photos = [];
for (const name of (await fs.readdir(originals)).filter(name => /\.jpe?g$/i.test(name)).sort()) {
  const base = path.parse(name).name;
  const input = path.join(originals, name);
  const full = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(publicDir, `${base}.webp`));
  const small = await sharp(input).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(publicDir, `${base}-800.webp`));
  photos.push({ src: `${base}.webp`, small: `${base}-800.webp`, width: full.width, height: full.height, smallWidth: small.width });
}
await fs.writeFile(path.join(root, 'src/gallery.json'), JSON.stringify(photos, null, 2) + '\n');
console.log(`Optimizate ${photos.length} fotografii; originalele sunt în assets-originals/.`);
