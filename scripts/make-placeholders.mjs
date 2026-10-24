// Генератор SVG-иллюстраций для объектов без фотографий (стилистика сайта)
// Запуск: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
mkdirSync(outDir, { recursive: true });

const palettes = {
  monument: '#b54b35', museum: '#485c5a', architecture: '#6e765d',
  memorial: '#984437', leisure: '#73815c', hidden: '#9a7132',
};

const pictograms = {
  monument: `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M320 88 L362 162 L362 322 H278 L278 162 Z"/>
      <path d="M252 322 H388"/><path d="M238 350 H402"/>
      <circle cx="320" cy="205" r="20"/>
    </g>`,
  museum: `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="218,182 320,106 422,182"/>
      <path d="M244 204 V322 M284 204 V322 M320 204 V322 M356 204 V322 M396 204 V322"/>
      <path d="M226 204 H414 M220 350 H420"/>
      <circle cx="320" cy="150" r="14" fill="COLOR" stroke="none"/>
    </g>`,
  architecture: `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M320 66 V104 M303 82 H337"/>
      <path d="M320 104 C 300 104 292 122 292 140 H348 C 348 122 340 104 320 104 Z"/>
      <path d="M288 140 H352 V322 H288 Z"/>
      <path d="M228 322 V232 H288 M352 232 H412 V322"/>
      <path d="M216 350 H424"/>
    </g>`,
  memorial: (() => {
    const cx = 320, cy = 214, R = 92, r = 38, pts = [];
    for (let i = 0; i < 5; i++) {
      const a1 = (-90 + i * 72) * Math.PI / 180;
      const a2 = (-90 + i * 72 + 36) * Math.PI / 180;
      pts.push(`${(cx + R * Math.cos(a1)).toFixed(1)},${(cy + R * Math.sin(a1)).toFixed(1)}`);
      pts.push(`${(cx + r * Math.cos(a2)).toFixed(1)},${(cy + r * Math.sin(a2)).toFixed(1)}`);
    }
    return `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linejoin="round">
      <polygon points="${pts.join(' ')}"/>
      <path d="M236 322 H404" stroke-linecap="round"/>
    </g>`;
  })(),
  leisure: `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="408" cy="112" r="26"/>
      <path d="M320 322 V268"/>
      <path d="M320 92 L244 186 H396 Z"/>
      <path d="M320 136 L228 240 H412 Z"/>
      <path d="M238 322 H402"/>
    </g>`,
  hidden: `
    <g fill="none" stroke="COLOR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M196 322 L262 200 L328 322 Z"/>
      <path d="M286 322 L366 158 L446 322 Z"/>
      <path d="M320 118 L338 148 L320 178 L302 148 Z"/>
      <path d="M182 350 H458"/>
    </g>`,
};

const places = [
  { id: 13, category: 'monument', name: 'Монумент «Горняцкая слава»' },
  { id: 14, category: 'monument', name: 'Памятник Льву Брусницыну' },
  { id: 15, category: 'memorial', name: 'Обелиск на месте открытия первого золота России' },
  { id: 16, category: 'architecture', name: 'Церковь Сретения Господня' },
  { id: 17, category: 'architecture', name: 'Храм мученика Иоанна Воина' },
  { id: 18, category: 'architecture', name: 'Мечеть «Айгуль»' },
  { id: 19, category: 'architecture', name: 'Дом купца Гавриила Рожкова' },
  { id: 20, category: 'architecture', name: 'Резной дом Вольхина' },
  { id: 21, category: 'architecture', name: 'Дом купчихи Бойцовой' },
  { id: 22, category: 'leisure', name: 'Скульптурная композиция «Дворик»' },
  { id: 24, category: 'leisure', name: 'Арт-объект «Дерево Желаний»' },
  { id: 25, category: 'leisure', name: 'Скульптура «Мать и дитя»' },
  { id: 26, category: 'memorial', name: 'Ротонда Эристовых-Кокшаровых' },
  { id: 27, category: 'monument', name: 'Памятник С. М. Кирову' },
  { id: 28, category: 'memorial', name: 'Знак первой советской шахты' },
  { id: 29, category: 'architecture', name: 'Первый панельный дом СССР' },
  { id: 30, category: 'leisure', name: 'Экстрим-парк «Горизонт»' },
  { id: 31, category: 'hidden', name: 'Берёзовские пески' },
  { id: 32, category: 'hidden', name: 'Ушаковский карьер' },
];

const categoryLabels = {
  monument: 'Исторический памятник', museum: 'Музей', architecture: 'Архитектура',
  memorial: 'Памятное место', leisure: 'Культура и отдых', hidden: 'Малоизвестное место',
};

function svgFor(place) {
  const color = palettes[place.category];
  const lines = place.name.length > 28
    ? [place.name.slice(0, place.name.lastIndexOf(' ', 30)), place.name.slice(place.name.lastIndexOf(' ', 30) + 1)]
    : [place.name];
  const textBlock = lines.length > 1
    ? `<text x="320" y="392" class="t">${lines[0]}</text><text x="320" y="424" class="t">${lines[1]}</text>`
    : `<text x="320" y="408" class="t">${lines[0]}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="#f7f4ed"/>
  <g fill="none" stroke="#deded3" stroke-width="1.5">
    ${[0,1,2,3,4].map(i => `<path d="M${-40 - i*26} ${340 + i*22} C 120 ${120 + i*24}, 300 ${560 - i*20}, 680 ${220 + i*30}"/>`).join('\n    ')}
  </g>
  <text x="36" y="52" class="b">НЕИЗВЕСТНЫЙ БЕРЁЗОВСКИЙ</text>
  <text x="604" y="52" text-anchor="end" class="b" fill="${color}">${categoryLabels[place.category].toUpperCase()}</text>
  ${pictograms[place.category].replaceAll('COLOR', color)}
  ${textBlock}
  <text x="604" y="452" text-anchor="end" class="s">Иллюстрация школьного проекта</text>
  <style>
    .t { font: 600 30px Georgia, 'Times New Roman', serif; fill: #292c29; text-anchor: middle; letter-spacing: -0.02em; }
    .b { font: 600 13px 'Segoe UI', Arial, sans-serif; fill: #6d7068; letter-spacing: 0.14em; }
    .s { font: 400 12px 'Segoe UI', Arial, sans-serif; fill: #a9ac9f; letter-spacing: 0.08em; }
  </style>
</svg>\n`;
}

for (const place of places) {
  writeFileSync(join(outDir, `placeholder-${place.id}.svg`), svgFor(place));
}
console.log(`Готово: ${places.length} иллюстраций в public/images`);
