import { Link } from 'react-router-dom';
import PhotoCarousel from './PhotoCarousel';
import { categoryLabel } from './CategoryFilters';
import { ArrowUpRightIcon, MapPinIcon } from './Icons';

export default function MonumentCard({ monument, showMapBtn = true }) {
  const photos = monument.images || [{ url: monument.image, title: monument.name }];
  return <article className="place-card">
    <div className="place-card-photo"><PhotoCarousel key={monument.id} images={photos} alt={monument.name} /></div>
    <div className="place-card-body">
      <div className="place-card-meta"><span>{categoryLabel(monument.category)}</span><span>{monument.yearBuilt.split(' (')[0]}</span></div>
      <h3><Link to={'/monument/' + monument.id}>{monument.cardName || monument.name}</Link></h3>
      <p className="place-card-description">{monument.shortDesc}</p>
      <div className="place-card-location"><MapPinIcon width={15} height={15} /><span>{monument.address.replace('г. Берёзовский, ', '')}</span></div>
      <div className="place-card-actions"><Link className="text-link" to={'/monument/' + monument.id}>Подробнее <ArrowUpRightIcon width={17} height={17} /></Link>{showMapBtn && <Link className="card-map-link" to={'/map?id=' + monument.id} aria-label={'Показать на карте: ' + monument.name}><MapPinIcon width={17} height={17} /> На карте</Link>}</div>
    </div>
  </article>;
}

