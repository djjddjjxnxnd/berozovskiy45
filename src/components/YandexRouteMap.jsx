import { useEffect, useRef, useState } from 'react';
import { loadYmaps, isValidPosition, createPinLayout, baseMapOptions } from '../utils/ymapsApi';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, '');
}

export default function YandexRouteMap({ stops = [], routeColor = '#b54b35', height = '380px', userLocation = null }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const objectsRef = useRef([]);
  const resizeObserverRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let disposed = false;
    loadYmaps().then((ymaps) => {
      if (disposed || !containerRef.current) return;
      const map = new ymaps.Map(containerRef.current, {
        center: [56.91185, 60.80410],
        zoom: 14,
        controls: ['zoomControl'],
      }, { ...baseMapOptions, minZoom: 4 });
      mapRef.current = map;
      // Вкладка может загрузиться скрытой — доводим размер карты до фактического
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
        objectsRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
    let cancelled = false;
    loadYmaps().then((ymaps) => {
      if (cancelled || !mapRef.current) return;
      objectsRef.current.forEach((object) => map.geoObjects.remove(object));
      objectsRef.current = [];
      const places = stops.filter((stop) => isValidPosition(stop.coords));
      const points = places.map((stop) => stop.coords);

      if (points.length > 1) {
        const polyline = new ymaps.Polyline(points, {}, {
          strokeColor: routeColor,
          strokeWidth: 4,
          strokeOpacity: 0.8,
          strokeStyle: 'dash',
        });
        map.geoObjects.add(polyline);
        objectsRef.current.push(polyline);
      }

      places.forEach((stop) => {
        const placemark = new ymaps.Placemark(
          stop.coords,
          {
            hint: escapeHtml(`${stop.num}. ${stop.name}`),
            balloonContent: `<div class="map-popup"><h4>${escapeHtml(`${stop.num}. ${stop.name}`)}</h4><p>${escapeHtml(stop.desc)}</p></div>`,
          },
          {
            iconLayout: createPinLayout(ymaps, routeColor, stop.num),
            iconShape: { type: 'rectangle', coordinates: [[-17, -44], [17, 0]] },
          }
        );
        map.geoObjects.add(placemark);
        objectsRef.current.push(placemark);
      });

      if (userLocation && isValidPosition([userLocation.lat, userLocation.lng])) {
        const placemark = new ymaps.Placemark(
          [userLocation.lat, userLocation.lng],
          { hint: 'Вы здесь', balloonContent: '<div class="map-popup"><h4>Вы находитесь здесь</h4></div>' },
          {
            iconLayout: createPinLayout(ymaps, '#485c5a', '●'),
            iconShape: { type: 'rectangle', coordinates: [[-17, -44], [17, 0]] },
            zIndex: 2000,
          }
        );
        map.geoObjects.add(placemark);
        objectsRef.current.push(placemark);
      }

      if (points.length > 1) map.setBounds(points, { checkZoomRange: true, zoomMargin: 40 });
      else if (points.length === 1) map.setCenter(points[0], 15, { checkZoomRange: true });
    });
    return () => { cancelled = true; };
  }, [stops, routeColor, userLocation, status]);

  return (
    <div className="open-map" style={{ height }} aria-label="Схема остановок маршрута на Яндекс.Карте">
      <div ref={containerRef} className="ymap-canvas" />
      {status === 'loading' && <div className="ymap-status">Загружаем Яндекс.Карту…</div>}
      {status === 'error' && <div className="ymap-status ymap-status-error">Карта Яндекс недоступна без подключения к интернету.</div>}
    </div>
  );
}
