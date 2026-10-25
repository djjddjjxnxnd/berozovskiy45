import { Link } from 'react-router-dom';
import { monuments } from '../data/monuments';
import MonumentCard from '../components/MonumentCard';
import { ArrowRightIcon, ArrowUpRightIcon, MapPinIcon, MuseumIcon, ParkIcon, CompassIcon } from '../components/Icons';

const featured = [5, 2, 9].map(id => monuments.find(item => item.id === id));
const placesCount = monuments.length;
const placesWord = n => {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'мест';
  if (mod10 === 1) return 'место';
  if (mod10 >= 2 && mod10 <= 4) return 'места';
  return 'мест';
};
export default function HomePage() {
  return <>
    <section className="home-hero"><div className="container hero-layout">
      <div className="hero-copy"><span className="eyebrow"><span className="small-dot" /> Берёзовский, Свердловская область</span><h1>Знакомый город.<br /><em>Новые истории.</em></h1><p>Пройдитесь по старым улицам, загляните в музей золота и найдите своё место у воды. Всё интересное — ближе, чем кажется.</p><div className="hero-actions"><Link className="button button-primary" to="/monuments">Открыть город <ArrowUpRightIcon width={19} height={19} /></Link><Link className="text-link" to="/map"><MapPinIcon width={18} height={18} /> Смотреть на карте</Link></div><div className="hero-note"><span>01 — {String(placesCount).padStart(2,'0')}</span><p>{placesCount} {placesWord(placesCount)}.<br />Много поводов выйти из дома.</p></div></div>
      <div className="hero-visual"><img className="hero-main-photo" src="images/historic-square-wide.jpg" alt="Мостик через Берёзовку в историческом сквере" fetchPriority="high" /><div className="hero-photo-label"><span>Место встречи с городом</span><Link to="/monument/5">Исторический сквер <ArrowUpRightIcon width={19} height={19} /></Link></div><div className="hero-inset"><img src="images/shilov-beach.jpg" alt="Шиловский пруд и сосновый берег" /><span>И немного природы.</span></div><span className="hero-photo-index" aria-hidden="true">56°54′ N / 60°48′ E</span></div>
    </div></section>
    <section className="city-numbers"><div className="container numbers-grid"><div><strong>1745</strong><span>год открытия рудного золота</span></div><div><strong>{placesCount}</strong><span>{placesWord(placesCount)} в нашем путеводителе</span></div><div><strong>3</strong><span>готовых маршрута для прогулки</span></div><div><strong>1 город</strong><span>который мы узнаём вместе</span></div></div></section>
    <section className="page-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Небольшой список для начала</span><h2>Здесь стоит побывать</h2></div><Link className="text-link" to="/monuments">Все места <ArrowRightIcon width={19} height={19} /></Link></div><div className="places-grid">{featured.map(place => <MonumentCard key={place.id} monument={place} />)}</div></div></section>
    <section className="discovery-section"><div className="container discovery-layout"><div><span className="eyebrow">У каждого свой Берёзовский</span><h2>Что вам<br /><em>интересно?</em></h2><p>Выбирайте по настроению.<br />С адресами, фотографиями и историей каждого места.</p></div><div className="discovery-links">{[{id:'museum', icon:MuseumIcon, title:'Музеи и золотая история', text:'Шахты, минералы и открытия'},{id:'leisure', icon:ParkIcon, title:'На свежем воздухе', text:'Парк, лесные тропы и пруд'},{id:'hidden', icon:CompassIcon, title:'Места, о которых знают не все', text:'Горнозаводское прошлое за привычным маршрутом'}].map(item => { const Icon = item.icon; return <Link key={item.id} to={'/monuments?category=' + item.id}><span className="discovery-icon"><Icon width={25} height={25} /></span><span><strong>{item.title}</strong><small>{item.text}</small></span><ArrowUpRightIcon width={23} height={23} /></Link>; })}</div></div></section>
    <section className="page-section"><div className="container weekend-story"><div className="weekend-photo"><img src="images/victory-park-alley.jpg" alt="Аллея в Парке Победы" loading="lazy" /></div><div className="weekend-copy"><span className="eyebrow">Планы на выходные</span><h2>Меньше планировать.<br /><em>Больше гулять.</em></h2><p>Собрали три маршрута: по историческому центру, памятным местам и природным уголкам. Выбирайте прогулку и открывайте остановки на карте.</p><Link className="button button-primary" to="/routes">Выбрать маршрут <ArrowUpRightIcon width={19} height={19} /></Link><div className="weekend-details"><span>Пешком</span><span>В своём темпе</span><span>Для любопытных</span></div></div></div></section>
    <section className="history-teaser"><div className="container history-teaser-inner"><span className="history-big-year" aria-hidden="true">1745</span><div><span className="eyebrow">С одной находки началась история</span><h2>Как небольшой город<br />стал родиной русского золота</h2><Link className="text-link" to="/history">Читать историю <ArrowRightIcon width={19} height={19} /></Link></div></div></section>
    <section className="page-section"><div className="container contribution-banner"><div><span className="eyebrow">Путеводитель создаём вместе</span><h2>У вас есть своя история?</h2><p>Старый дом, любимая тропа или семейная фотография могут рассказать о городе больше, чем кажется.</p></div><Link className="button button-secondary" to="/preserve">Рассказать о месте <ArrowUpRightIcon width={19} height={19} /></Link></div></section>
  </>;
}

