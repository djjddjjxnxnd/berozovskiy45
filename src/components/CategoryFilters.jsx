/* oxlint-disable react/only-export-components -- The shared label helper accompanies the category controls. */
import { categories } from '../data/monuments';
import { HammersIcon, MonumentIcon, MuseumIcon, ChurchIcon, StarIcon, ParkIcon, HiddenPlaceIcon } from './Icons';

const icons = { all: HammersIcon, monument: MonumentIcon, museum: MuseumIcon, architecture: ChurchIcon, memorial: StarIcon, leisure: ParkIcon, hidden: HiddenPlaceIcon };
const labels = { all: 'Все места', monument: 'Памятники', museum: 'Музеи', architecture: 'Архитектура', memorial: 'Памятные места', leisure: 'Отдых и культура', hidden: 'За пределами маршрутов' };
export const categoryLabel = (id) => labels[id] || categories.find(item => item.id === id)?.label;

export default function CategoryFilters({ active, onChange }) {
  return <div className="category-filters" aria-label="Категории мест">{categories.map(category => {
    const Icon = icons[category.id];
    return <button type="button" key={category.id} className={`category-filter ${active === category.id ? 'is-active' : ''}`} aria-pressed={active === category.id} onClick={() => onChange(category.id)}><Icon width={18} height={18} />{labels[category.id]}</button>;
  })}</div>;
}
