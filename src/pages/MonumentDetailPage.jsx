import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMonumentById, monuments } from '../data/monuments';
import { categoryLabel } from '../components/CategoryFilters';
import PhotoCarousel from '../components/PhotoCarousel';
import PageHeader from '../components/PageHeader';
import MonumentCard from '../components/MonumentCard';
import YandexMiniMap from '../components/YandexMiniMap';
import { CalendarIcon, MapPinIcon, ClockIcon, ArrowUpRightIcon, BookIcon } from '../components/Icons';

export default function MonumentDetailPage() {
  const { id } = useParams();
  const monument = getMonumentById(id);
  useEffect(() => {
    document.title = monument ? monument.name + ' — Неизвестный Берёзовский' : 'Место не найдено';
    return () => { document.title = 'Неизвестный Берёзовский — история рядом с нами'; };
  }, [monument]);
  if (!monument) return <div className="container empty-state"><span className="eyebrow">404</span><h1>Такого места пока нет</h1><Link className="button button-primary" to="/monuments">Вернуться в каталог</Link></div>;
  const photos = monument.images || [{ url: monument.image, title: monument.name }];
  const related = monuments.filter(place => place.id !== monument.id && place.category === monument.category).slice(0,3);
  const photoSources = [...new Map(photos.filter(photo => photo.source).map(photo => [photo.source, photo.credit || 'Источник фотографии'])).entries()];
  return <>
    <PageHeader eyebrow={categoryLabel(monument.category)} title={monument.name} description={monument.significance} />
    <section className="page-section detail-section"><div className="container detail-layout"><div className="detail-main">
      <PhotoCarousel key={monument.id} images={photos} alt={monument.name} variant="detail" fullScreen />
      <section className="detail-story"><span className="eyebrow">Об этом месте</span><h2>История и детали</h2>{monument.fullDesc.split('\n\n').map((paragraph,index) => paragraph.includes('•') ? <div key={index}>{paragraph.split('\n').map((line,lineIndex) => <p key={lineIndex}>{line}</p>)}</div> : <p key={index}>{paragraph}</p>)}</section>
      <section className="detail-facts"><span className="eyebrow">Присмотритесь</span><h2>Что стоит знать</h2><ol>{monument.facts.map((fact,index) => <li key={fact}><span>{String(index+1).padStart(2,'0')}</span><p>{fact}</p></li>)}</ol></section>
      <details className="detail-sources"><summary><BookIcon width={18} height={18} /> Источники и фотографии</summary><div><ul>{monument.sources.map(source => <li key={source}>{source}</li>)}</ul>{photoSources.length > 0 ? photoSources.map(([url,credit]) => <a key={url} href={url} target="_blank" rel="noreferrer">{credit} <ArrowUpRightIcon width={14} height={14} /></a>) : <p className="muted">{monument.imageCredit}</p>}</div></details>
    </div><aside className="detail-sidebar"><div className="visit-panel"><span className="eyebrow">Планируем посещение</span><h2>Как найти</h2><div className="visit-row"><MapPinIcon width={20} height={20} /><div><span>Адрес</span><p>{monument.address}</p></div></div><div className="visit-row"><CalendarIcon width={20} height={20} /><div><span>История места</span><p>{monument.yearBuilt}</p></div></div><div className="visit-row"><ClockIcon width={20} height={20} /><div><span>Посещение</span><p>{monument.status}</p></div></div><Link className="button button-primary" to={'/map?id=' + monument.id}>Показать на карте <ArrowUpRightIcon width={17} height={17} /></Link><a className="button button-secondary" target="_blank" rel="noreferrer" href={'https://yandex.ru/maps/?rtext=~' + monument.lat + '%2C' + monument.lng + '&rtt=pd'}>Проложить маршрут <ArrowUpRightIcon width={17} height={17} /></a></div><YandexMiniMap key={monument.id} lat={monument.lat} lng={monument.lng} title={monument.name} height="260px" /></aside></div></section>
    {related.length > 0 && <section className="page-section section-lined"><div className="container"><div className="section-heading"><div><span className="eyebrow">Продолжить знакомство</span><h2>Вам может понравиться</h2></div><Link to="/monuments" className="text-link">Все места <ArrowUpRightIcon width={18} height={18} /></Link></div><div className="places-grid">{related.map(place => <MonumentCard key={place.id} monument={place} />)}</div></div></section>}
  </>;
}

