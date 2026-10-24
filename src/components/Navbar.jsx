import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { CloseIcon, MenuIcon, ArrowUpRightIcon } from './Icons';

const links = [
  { to: '/monuments', label: 'Места' }, { to: '/map', label: 'Карта' },
  { to: '/routes', label: 'Маршруты' }, { to: '/history', label: 'История' },
];
export default function Navbar() {
  const location = useLocation();
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === location.pathname;
  return <header className="site-nav"><div className="container nav-inner">
    <Link to="/" className="brand" aria-label="Неизвестный Берёзовский — на главную">
      <span className="brand-symbol" aria-hidden="true">б<span>.</span></span>
      <span className="brand-wordmark"><small>неизвестный</small><strong>Берёзовский</strong></span>
    </Link>
    <nav id="site-menu" className={'nav-links' + (open ? ' is-open' : '')} aria-label="Основная навигация">
      {links.map(link => <NavLink key={link.to} to={link.to} onClick={() => setOpenPath(null)}>{link.label}</NavLink>)}
      <NavLink className="nav-contribute" to="/preserve" onClick={() => setOpenPath(null)}>Добавить место <ArrowUpRightIcon width={16} height={16} /></NavLink>
    </nav>
    <button type="button" className="menu-toggle icon-button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpenPath(open ? null : location.pathname)}>{open ? <CloseIcon /> : <MenuIcon />}</button>
  </div></header>;
}

