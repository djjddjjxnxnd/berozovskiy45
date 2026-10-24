import { useEffect, useRef, useState } from 'react';
import { loadYmaps, isValidPosition, createPinLayout, balloonHtml, baseMapOptions } from '../utils/ymapsApi';
import { categories } from '../data/monuments';

const colors = {
  monument: '#b54b35', museum: '#485c5a', architecture: '#6e765d',
  memorial: '#984437', leisure: '#73815c', hidden: '#9a7132',
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, '');
}

export default function YandexMap({
  monuments = [], selectedMonument = null, onSelectMonument = () => {},
  center = [56.9150, 60.8120], zoom = 13, height = '560px', userLocation = null,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const placemarksRef = useRef(new Map());
  const userPlacemarkRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const selectHandlerRef = useRef(onSelectMonument);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [markerError, setMarkerError] = useState(null);
  selectHandlerRef.current = onSelectMonument;

  // Создание карты
  useEffect(() => {
    let disposed = false;
    const placemarks = placemarksRef.current;
    loadYmaps().then((ymaps) => {
      if (disposed || !containerRef.current) return;
      const map = new ymaps.Map(containerRef.current, {
        center,
        zoom,
        controls: ['zoomControl', 'geolocationControl'],
      }, {
        ...baseMapOptions,
        balloonMaxWidth: 300,
        minZoom: 4,
      });
      map.behaviors.enable('scrollZoom');
      mapRef.current = map;
      // Вкладка может загрузиться скрытой (карта создастся с нулевой шириной).
      // Доводим размер до фактического: сразу, по таймаутам и при изменении окна.
      const fit = () => { if (mapRef.current === map) map.container.fitToViewport(); };
      fit();
      const fitTimers = [200, 800, 2000].map((delay) => window.setTimeout(fit, delay));
      window.addEventListener('resize', fit);
      const observer = new ResizeObserver(fit);
      observer.observe(containerRef.current);
      resizeObserverRef.current = { observer, fit, fitTimers };
      setStatus('ready');
    }).catch(() => setStatus('error'));
    return () => {
      disposed = true;
      const cleanup = resizeObserverRef.current;
      if (cleanup) {
        cleanup.observer.disconnect();
        window.removeEventListener('resize', cleanup.fit);
        cleanup.fitTimers.forEach((timer) => window.clearTimeout(timer));
        resizeObserverRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      placemarks.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновление меток при смене подборки мест
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !mapRef.current) return;
      try {
        placemarksRef.current.forEach((placemark) => map.geoObjects.remove(placemark));
        placemarksRef.current.clear();
        monuments.forEach((monument) => {
          if (!isValidPosition([monument.lat, monument.lng])) return;
          const category = categories.find((item) => item.id === monument.category);
          const placemark = new ymaps.Placemark(
            [monument.lat, monument.lng],
            {
              hint: escapeHtml(monument.name),
              balloonContent: balloonHtml(monument, category?.label),
            },
            {
              iconLayout: createPinLayout(ymaps, colors[monument.category]),
              iconShape: { type: 'rectangle', coordinates: [[-17, -44], [17, 0]] },
              hideIconOnBalloonOpen: false,
            }
          );
          placemark.events.add('click', () => selectHandlerRef.current(monument));
          map.geoObjects.add(placemark);
          placemarksRef.current.set(monument.id, placemark);
        });
      } catch (err) {
        setMarkerError(err instanceof Error ? err.message : String(err));
      }
    });
    return () => { cancelled = true; };
  }, [monuments, status]);

  // Фокусировка: выбранное место → приближаем и открываем балун, иначе — вся подборка
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
    if (selectedMonument && isValidPosition([selectedMonument.lat, selectedMonument.lng])) {
      map.setCenter([selectedMonument.lat, selectedMonument.lng], 16, { checkZoomRange: true });
      const placemark = placemarksRef.current.get(selectedMonument.id);
      if (placemark) placemark.balloon.open();
    } else {
      const points = monuments
        .filter((item) => isValidPosition([item.lat, item.lng]))
        .map((item) => [item.lat, item.lng]);
      if (points.length > 1) {
        map.setBounds(points, { checkZoomRange: true, zoomMargin: 45 });
      } else if (points.length === 1) {
        map.setCenter(points[0], 15, { checkZoomRange: true });
      } else {
        map.setCenter(center, zoom);
      }
      map.balloon.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonument, status]);

  // Метка местоположения пользователя
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready' || !userLocation || !isValidPosition([userLocation.lat, userLocation.lng])) return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !mapRef.current) return;
      if (userPlacemarkRef.current) {
        map.geoObjects.remove(userPlacemarkRef.current);
        userPlacemarkRef.current = null;
      }
      const placemark = new ymaps.Placemark(
        [userLocation.lat, userLocation.lng],
        { hint: 'Вы находитесь здесь', balloonContent: '<div class="map-popup"><h4>Вы находитесь здесь</h4></div>' },
        {
          iconLayout: createPinLayout(ymaps, '#485c5a', '●'),
          iconShape: { type: 'rectangle', coordinates: [[-17, -44], [17, 0]] },
          zIndex: 2000,
        }
      );
      map.geoObjects.add(placemark);
      userPlacemarkRef.current = placemark;
    });
    return () => { cancelled = true; };
  }, [userLocation, status]);

  return (
    <div className="open-map" style={{ height }} aria-label="Карта достопримечательностей Берёзовского на Яндекс.Картах">
      <div ref={containerRef} className="ymap-canvas" />
      {status === 'loading' && <div className="ymap-status">Загружаем Яндекс.Карту…</div>}
      {markerError && <div className="ymap-status ymap-status-error">Ошибка отрисовки меток: {markerError}</div>}
      {status === 'error' && (
        <div className="ymap-status ymap-status-error">
          Не удалось загрузить Яндекс.Карты. Проверьте подключение к интернету
          и откройте <a href="https://yandex.ru/maps/?text=Берёзовский%20Свердловская%20область" target="_blank" rel="noreferrer">карту города онлайн</a>.
        </div>
      )}
    </div>
  );
}
