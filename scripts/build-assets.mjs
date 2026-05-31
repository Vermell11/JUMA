import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const A = (p) => path.join(root, p);

fs.mkdirSync(A('src/assets/gallery'), { recursive: true });
fs.mkdirSync(A('public'), { recursive: true });

// ---- 1. Trim logo margins ----
async function trim(input, output, maxW) {
  const buf = await sharp(input).trim({ threshold: 10 }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  let pipe = sharp(buf);
  if (maxW && meta.width > maxW) pipe = pipe.resize({ width: maxW });
  await pipe.png({ compressionLevel: 9 }).toFile(output);
  const m = await sharp(output).metadata();
  console.log(`trim ${path.basename(output)} ${m.width}x${m.height}`);
}
await trim(A('design-source/Logos/Logo01.png'), A('src/assets/logo-horizontal.png'), 1400);
await trim(A('design-source/Logos/Logo02.png'), A('src/assets/logo-stacked.png'), 1200);

// ---- 2. White versions (alpha mask -> white fill) for dark backgrounds ----
async function whiteVersion(input, output) {
  const meta = await sharp(input).metadata();
  const alpha = await sharp(input).ensureAlpha().extractChannel('alpha').toColourspace('b-w').toBuffer();
  await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha)
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`white ${path.basename(output)} ${meta.width}x${meta.height}`);
}
// Only the horizontal logo needs a white variant (navbar over dark hero).
// The stacked logo is shown on a white card in the footer, so it stays in color.
await whiteVersion(A('src/assets/logo-horizontal.png'), A('src/assets/logo-horizontal-white.png'));

// ---- 3. Favicon (stacked logo fitted on white square) ----
const seal = await sharp(A('src/assets/logo-stacked.png'))
  .resize(224, 224, { fit: 'inside' })
  .png()
  .toBuffer();
await sharp({ create: { width: 256, height: 256, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: seal, gravity: 'center' }])
  .png()
  .toFile(A('public/favicon.png'));
console.log('favicon 256x256');

// ---- 4. Pick photos ----
const files = fs.readdirSync(A('design-source/Fotos')).filter((f) => /\.jpe?g$/i.test(f)).sort();
console.log('total fotos:', files.length);
const F = (idx) => A(path.join('design-source/Fotos', files[idx - 1]));

// Clean gallery
fs.rmSync(A('src/assets/gallery'), { recursive: true, force: true });
fs.mkdirSync(A('src/assets/gallery'), { recursive: true });

fs.copyFileSync(F(15), A('src/assets/hero.jpeg'));
fs.copyFileSync(F(31), A('src/assets/about.jpeg'));
fs.copyFileSync(F(99), A('src/assets/donate.jpeg'));

const gal = [8, 12, 35, 45, 60, 70, 107, 113, 128, 133, 146, 156];
gal.forEach((idx, i) => fs.copyFileSync(F(idx), A(`src/assets/gallery/g${String(i + 1).padStart(2, '0')}.jpeg`)));

// dimensions report for chosen key images
for (const [name, idx] of [['hero', 15], ['about', 31], ['donate', 99]]) {
  const m = await sharp(F(idx)).metadata();
  console.log(`${name}=foto${idx} ${m.width}x${m.height}`);
}
console.log('gallery:', fs.readdirSync(A('src/assets/gallery')).sort().join(' '));
