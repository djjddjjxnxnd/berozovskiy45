import { useEffect, useRef, useState } from 'react';
import { loadYmaps, createPinLayout, baseMapOptions } from '../utils/ymapsApi';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, '');
}

export default function YandexMiniMap({ lat, lng, title, pinColor = '#b54b35', height = '270px' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const placemarkRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let disposed = false;
    loadYmaps().then((ymaps) => {
      if (disposed || !containerRef.current) return;
      const map = new ymaps.Map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        controls: ['zoomControl'],
      }, { ...baseMapOptions, minZoom: 4 });
      const placemark = new ymaps.Placemark(
        [lat, lng],
        {
          hint: escapeHtml(title),
          balloonContent: `<div class="map-popup"><h4>${escapeHtml(title)}</h4></div>`,
        },
        {
          iconLayout: createPinLayout(ymaps, pinColor),
          iconShape: { type: 'rectangle', coordinates: [[-17, -44], [17, 0]] },
        }
      );
      map.geoObjects.add(placemark);
      mapRef.current = map;
      placemarkRef.current = placemark;
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
        placemarkRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Смена места (например, переход между объектами) — перецентровка
  useEffect(() => {
    const map = mapRef.current;
    const placemark = placemarkRef.current;
    if (!map || !placemark || status !== 'ready') return;
    placemark.geometry.setCoordinates([lat, lng]);
    placemark.properties.set({ hint: escapeHtml(title), balloonContent: `<div class="map-popup"><h4>${escapeHtml(title)}</h4></div>` });
    map.setCenter([lat, lng], 16, { checkZoomRange: true, duration: 300 });
    map.balloon.close();
  }, [lat, lng, title, status]);

  return (
    <div className="open-map" style={{ height }} aria-label={`Расположение: ${title} — Яндекс.Карты`}>
      <div ref={containerRef} className="ymap-canvas" />
      {status === 'loading' && <div className="ymap-status">Загружаем карту…</div>}
      {status === 'error' && <div className="ymap-status ymap-status-error">Карта Яндекс недоступна без подключения к интернету.</div>}
    </div>
  );
}
