import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LocationPrompt from '../components/LocationPrompt';
import YandexRouteMap from '../components/YandexRouteMap';
import { routes } from '../data/routes';
import { useUserLocation } from '../utils/useUserLocation';
import { ClockIcon, FootstepsIcon, ArrowUpRightIcon, MapPinIcon } from '../components/Icons';

export default function RoutesPage() {
  const { location, loading, error, requestLocation } = useUserLocation();
  return <>
    <PageHeader eyebrow="Прогулочные маршруты" title={<>Хороший день<br /><em>начинается с прогулки.</em></>} description="Три способа познакомиться с городом. Выберите тему, посмотрите остановки и отправляйтесь в путь." />
    <section className="page-section"><div className="container">
      <LocationPrompt location={location} loading={loading} error={error} onRequest={requestLocation} />
      <div className="route-list">{routes.map((route,index) => {
        const points = route.stops.map(stop => stop.coords[0]+'%2C'+stop.coords[1]).join('~');
        const url = 'https://yandex.ru/maps/?rtext=' + (location ? location.lat+'%2C'+location.lng+'~' : '') + points + '&rtt=pd';
        return <article key={route.id} className="route-story"><header className="route-story-header"><span className="route-story-number">0{index+1}</span><div><span className="eyebrow">Маршрут для прогулки</span><h2>{route.name}</h2><div className="route-meta"><span><ClockIcon width={17} height={17} />{route.duration}</span><span><FootstepsIcon width={17} height={17} />{route.distance}</span><span><MapPinIcon width={17} height={17} />{route.stops.length} остановки</span></div></div></header><div className="route-layout"><div><p className="section-copy">{route.desc}</p><ol className="route-stops">{route.stops.map(stop => <li key={stop.num}><span className="route-stop-number">{stop.num}</span><div><h3>{stop.name}</h3><p>{stop.desc}</p></div></li>)}</ol><a className="button button-primary" href={url} target="_blank" rel="noreferrer">Открыть маршрут <ArrowUpRightIcon width={18} height={18} /></a></div><div className="route-map-panel"><YandexRouteMap stops={route.stops} routeColor="#b54b35" height="360px" userLocation={location} /><p className="map-caption">Схема показывает порядок остановок. Точный пешеходный путь откроется по кнопке «Открыть маршрут».</p></div></div></article>;
      })}</div>
      <div className="route-bottom-note"><h3>Перед прогулкой</h3><p>Для экскурсий в музей и шахту уточняйте время работы и запись. Выбирайте удобную обувь и учитывайте погоду.</p><Link to="/monuments" className="text-link">Узнать больше о местах <ArrowUpRightIcon width={17} height={17} /></Link></div>
    </div></section>
  </>;
}

