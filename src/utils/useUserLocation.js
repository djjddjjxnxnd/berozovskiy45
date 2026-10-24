import { useState, useCallback } from 'react';

function readSavedLocation() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('user_geo_coords'));
    if (Number.isFinite(saved?.lat) && Number.isFinite(saved?.lng)) return saved;
  } catch { /* Session storage can be unavailable in private browser contexts. */ }
  return null;
}

export function useUserLocation() {
  const [location, setLocation] = useState(readSavedLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(coords);
        setLoading(false);
        try {
          sessionStorage.setItem('user_geo_coords', JSON.stringify(coords));
        } catch { /* The current location remains usable without session storage. */ }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Доступ к геопозиции отклонён. Разрешите доступ в настройках браузера.');
        } else {
          setError('Не удалось определить местоположение');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
    permissionDenied,
    requestLocation,
  };
}

// Расчёт расстояния между двумя координатами по формуле Haversine (в метрах)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // в метрах
}

// Красивое форматирование расстояния и времени пешком
export function formatDistance(meters) {
  if (!meters && meters !== 0) return null;
  const minutes = Math.round(meters / 80); // ~5 км/ч пешком = ~80 м/мин
  if (meters < 1000) {
    return {
      text: `${meters} м`,
      walkTime: minutes <= 1 ? '1 мин пешком' : `~${minutes} мин пешком`,
    };
  }
  const km = (meters / 1000).toFixed(1);
  return {
    text: `${km} км`,
    walkTime: `~${minutes} мин пешком`,
  };
}
