// Копирует index.html в 404.html — так GitHub Pages открывает React-страницы
// с прямыми адресами вида /monument/29 вместо ошибки 404.
import { copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));
console.log('dist/404.html создан');
