import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { monuments, categories } from '../data/monuments';
import MonumentCard from '../components/MonumentCard';
import PageHeader from '../components/PageHeader';
import CategoryFilters from '../components/CategoryFilters';
import { SearchIcon, ArrowUpRightIcon } from '../components/Icons';

export default function MonumentsPage() {
  const [params, setParams] = useSearchParams();
  const selectedCategory = params.get('category');
  const category = categories.some(item => item.id === selectedCategory) ? selectedCategory : 'all';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  let filtered = monuments.filter(place => (category === 'all' || place.category === category) && (place.name + ' ' + place.shortDesc + ' ' + place.address).toLowerCase().includes(search.toLowerCase().trim()));
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  if (sort === 'year') filtered = [...filtered].sort((a, b) => (parseInt(a.yearBuilt) || 9999) - (parseInt(b.yearBuilt) || 9999));
  return <>
    <PageHeader eyebrow="Каталог мест" title={<>Город в деталях<span className="accent">.</span></>} description="От исторического сквера до лесного берега. Найдите место для следующей прогулки." />
    <section className="page-section catalog-section"><div className="container">
      <div className="catalog-toolbar"><label className="search-field"><SearchIcon width={20} height={20} /><input type="search" placeholder="Название места или адрес" aria-label="Поиск мест" value={search} onChange={event => setSearch(event.target.value)} /></label><label className="sort-field"><span>Порядок</span><select aria-label="Сортировка мест" value={sort} onChange={event => setSort(event.target.value)}><option value="default">Выбор редакции</option><option value="name">По названию, А–Я</option><option value="year">По времени создания</option></select></label></div>
      <CategoryFilters active={category} onChange={value => setParams(value === 'all' ? {} : { category: value })} />
      <div className="results-line" role="status"><span>Найдено мест: <strong>{filtered.length}</strong></span><Link to="/map" className="text-link">Показать на карте <ArrowUpRightIcon width={16} height={16} /></Link></div>
      {filtered.length ? <div className="places-grid">{filtered.map(place => <MonumentCard key={place.id} monument={place} />)}</div> : <div className="empty-state"><SearchIcon width={36} height={36} /><h2>Пока ничего не нашлось</h2><p>Попробуйте другое название или выберите все категории.</p><button className="button button-secondary" onClick={() => { setSearch(''); setParams({}); }}>Сбросить поиск</button></div>}
    </div></section>
    <section className="page-section section-lined"><div className="container contribution-banner"><div><span className="eyebrow">Дополните нашу карту</span><h2>Знаете ещё одно интересное место?</h2></div><Link className="text-link" to="/preserve">Рассказать о нём <ArrowUpRightIcon width={18} height={18} /></Link></div></section>
  </>;
}

