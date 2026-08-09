/**
 * יוצר את אייקוני ה-PWA מתוך SVG יחיד.
 * הרצה: node scripts/generate-icons.mjs
 * התוצרים נשמרים ב-public/ ומועלים ל-git, כדי שהבנייה לא תהיה תלויה ב-sharp.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const INK = '#12203a';
const PARCHMENT = '#fdfbf7';
const GOLD = '#c19a4b';

/** מגילה פתוחה עם ציר זמן — אותה שפה ויזואלית של הלוגו באתר */
function icon({ padding }) {
  const s = 512;
  const p = padding;
  const inner = s - p * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${INK}"/>
  <g transform="translate(${p} ${p})">
    <rect x="${inner * 0.08}" y="${inner * 0.16}" width="${inner * 0.84}" height="${inner * 0.68}" rx="${inner * 0.1}" fill="${PARCHMENT}"/>
    <g fill="${INK}">
      <rect x="${inner * 0.18}" y="${inner * 0.32}" width="${inner * 0.5}" height="${inner * 0.07}" rx="${inner * 0.035}"/>
      <rect x="${inner * 0.34}" y="${inner * 0.46}" width="${inner * 0.4}" height="${inner * 0.07}" rx="${inner * 0.035}"/>
      <rect x="${inner * 0.18}" y="${inner * 0.6}" width="${inner * 0.32}" height="${inner * 0.07}" rx="${inner * 0.035}"/>
    </g>
    <rect x="${inner * 0.18}" y="${inner * 0.46}" width="${inner * 0.12}" height="${inner * 0.07}" rx="${inner * 0.035}" fill="${GOLD}"/>
    <rect x="${inner * 0.56}" y="${inner * 0.6}" width="${inner * 0.18}" height="${inner * 0.07}" rx="${inner * 0.035}" fill="${GOLD}"/>
  </g>
</svg>`;
}

const targets = [
  { file: 'pwa-192.png', size: 192, padding: 40 },
  { file: 'pwa-512.png', size: 512, padding: 40 },
  // maskable — ריפוד גדול יותר, כדי שהחיתוך למעגל לא יאכל את התוכן
  { file: 'pwa-maskable-512.png', size: 512, padding: 96 },
  { file: 'apple-touch-icon.png', size: 180, padding: 40 },
];

await mkdir('public', { recursive: true });

for (const target of targets) {
  const png = await sharp(Buffer.from(icon({ padding: target.padding })))
    .resize(target.size, target.size)
    .png()
    .toBuffer();
  await writeFile(`public/${target.file}`, png);
  console.log('נוצר', target.file, `${target.size}×${target.size}`);
}

await writeFile('public/favicon.svg', icon({ padding: 40 }));
console.log('נוצר favicon.svg');
