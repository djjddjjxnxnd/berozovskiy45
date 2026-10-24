import { MapPinIcon } from './Icons';

export default function LocationPrompt({ location, loading, error, onRequest }) {
  return <div className="location-prompt"><div className="location-prompt-copy"><MapPinIcon width={24} height={24} /><div><strong>{location ? 'Ваша точка отмечена на карте' : 'Начните прогулку от своего местоположения'}</strong><p>{location ? 'Ссылки на маршрут будут учитывать вашу геопозицию.' : 'Геопозиция запрашивается только после нажатия кнопки.'}</p>{error && <p className="form-error" role="status">{error}</p>}</div></div><button type="button" className="button button-secondary" disabled={loading} onClick={onRequest}>{loading ? 'Определяем…' : location ? 'Обновить геопозицию' : 'Где я нахожусь'}</button></div>;
}
