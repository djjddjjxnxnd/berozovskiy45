// Загрузчик JavaScript API Яндекс.Карт 2.1 (единый синглтон для всего сайта)
// API-ключ не обязателен для запуска на localhost (школьный проект, демо-режим).
// Для публикации в интернете можно бесплатно получить ключ на developer.tech.yandex.ru
// и вписать его ниже — тогда карта заработает и на внешнем домене.
const YANDEX_MAPS_API_KEY = '';

let loaderPromise = null;

export function loadYmaps() {
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    if (window.ymaps) {
      window.ymaps.ready(() => resolve(window.ymaps));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU' + (YANDEX_MAPS_API_KEY ? '&apikey=' + YANDEX_MAPS_API_KEY : '');
    script.async = true;
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = () => {
      loaderPromise = null;
      script.remove();
      reject(new Error('Не удалось загрузить Яндекс.Карты'));
    };
    document.head.appendChild(script);
  });
  return loaderPromise;
}

export function isValidPosition(position) {
  return Array.isArray(position) && position.length === 2 &&
    Number.isFinite(position[0]) && Math.abs(position[0]) <= 90 &&
    Number.isFinite(position[1]) && Math.abs(position[1]) <= 180;
}

// Стилизованная метка-капля в духе сайта.
// Геометрия задана инлайн: обёртка позиционируется так, чтобы остриё капли
// попадало ровно в точку привязки на карте — от этого зависит и хит-тест клика.
export function createPinLayout(ymaps, color = '#b54b35', label = '') {
  const safeColor = /^#[0-9a-f]{3,8}$/i.test(color) ? color : '#b54b35';
  const safeLabel = String(label).replace(/[&<>"']/g, '');
  return ymaps.templateLayoutFactory.createClass(
    `<div class="heritage-marker-wrap" style="position:absolute;left:-17px;top:-44px;width:34px;height:44px;display:grid;place-items:center;cursor:pointer;">` +
      `<span class="heritage-marker${safeLabel ? ' heritage-marker-number' : ''}" style="--marker-color:${safeColor};position:relative;">` +
        (safeLabel ? `<b>${safeLabel}</b>` : '') +
      `</span>` +
    `</div>`
  );
}

// HTML-«балун» (всплывающая карточка места) в стилистике сайта
export function balloonHtml(monument, categoryLabel) {
  const name = String(monument.name).replace(/[<>"']/g, '');
  const desc = String(monument.shortDesc).replace(/[<>"']/g, '').slice(0, 110);
  const label = String(categoryLabel || '').replace(/[<>"']/g, '');
  return (
    `<div class="map-popup">` +
      `<img src="${monument.image}" alt="${name}" />` +
      (label ? `<span class="map-popup-category">${label}</span>` : '') +
      `<h4>${name}</h4>` +
      `<p>${desc}…</p>` +
      `<a class="map-popup-link" href="/monument/${monument.id}">Открыть объект <span aria-hidden="true">↗</span></a>` +
    `</div>`
  );
}

// Общие опции карты: без открытия яндекс.карт в новой вкладке при клике
export const baseMapOptions = { suppressMapOpenBlock: true };
