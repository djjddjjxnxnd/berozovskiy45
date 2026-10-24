import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import CategoryFilters, { categoryLabel } from '../components/CategoryFilters';
import LocationPrompt from '../components/LocationPrompt';
import YandexMap from '../components/YandexMap';
import { monuments } from '../data/monuments';
import { useUserLocation, calculateDistance, formatDistance } from '../utils/useUserLocation';
import { ArrowUpRightIcon, MapPinIcon, CloseIcon } from '../components/Icons';

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState('all');
  const selected = monuments.find(place => place.id === Number(params.get('id')));
  const filtered = category === 'all' ? monuments : monuments.filter(place => place.category === category);
  const { location, loading, error, requestLocation } = useUserLocation();
  const distance = selected && location ? formatDistance(calculateDistance(location.lat, location.lng, selected.lat, selected.lng)) : null;
  const select = place => setParams({ id: place.id });
  const yandexUrl = selected ? 'https://yandex.ru/maps/?rtext=' + (location ? location.lat + '%2C' + location.lng : '') + '~' + selected.lat + '%2C' + selected.lng + '&rtt=pd' : '#';
  return <>
    <PageHeader eyebrow="Карта города" title={<>Все места — <em>рядом.</em></>} description="Нажмите на метку или выберите место в списке. Здесь легко спланировать свою прогулку." />
    <section className="page-section map-page-section"><div className="container">
      <CategoryFilters active={category} onChange={value => { setCategory(value); if (selected && value !== 'all' && selected.category !== value) setParams({}); }} />
      <div className="map-layout"><aside className="map-sidebar">
        {selected ? <div className="map-selection"><div className="map-selection-image"><img src={selected.image} alt={selected.name} /><button type="button" className="icon-button" aria-label="Закрыть выбранное место" onClick={() => setParams({})}><CloseIcon width={18} height={18} /></button></div><div className="map-selection-copy"><span className="eyebrow">{categoryLabel(selected.category)}</span><h2>{selected.cardName || selected.name}</h2><p className="address-line"><MapPinIcon width={16} height={16} />{selected.address}</p><p>{selected.shortDesc}</p>{distance && <p className="distance-label">{distance.text} от вас по прямой</p>}<Link className="button button-primary" to={'/monument/' + selected.id}>Подробнее о месте <ArrowUpRightIcon width={17} height={17} /></Link><a className="button button-secondary" href={yandexUrl} target="_blank" rel="noreferrer">Построить маршрут <ArrowUpRightIcon width={17} height={17} /></a></div></div>
        : <><div className="map-list-heading"><h2>Места на карте</h2><span>{filtered.length}</span></div><div className="map-place-list">{filtered.map((place,index) => <button key={place.id} type="button" onClick={() => select(place)}><span className="map-list-index">{String(index + 1).padStart(2,'0')}</span><span><strong>{place.cardName || place.name}</strong><small>{categoryLabel(place.category)}</small></span><ArrowUpRightIcon width={17} height={17} /></button>)}</div></>}
      </aside><div className="map-canvas"><YandexMap monuments={filtered} selectedMonument={selected} onSelectMonument={select} height="100%" userLocation={location} /></div></div>
      <LocationPrompt location={location} loading={loading} error={error} onRequest={requestLocation} />
    </div></section>
  </>;
}

