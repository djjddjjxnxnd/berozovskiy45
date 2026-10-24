import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from './Icons';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><div className="footer-about"><Link to="/" className="footer-title">Неизвестный<br />Берёзовский<span>.</span></Link><p>Места, люди и истории родного города.<br />Школьный проект о том, что рядом.</p></div>
      <div><span className="eyebrow">Исследовать</span><Link to="/monuments">Каталог мест</Link><Link to="/map">Карта города</Link><Link to="/routes">Прогулочные маршруты</Link><Link to="/history">История Берёзовского</Link></div>
      <div><span className="eyebrow">Участвовать</span><Link to="/preserve">Рассказать о месте</Link><Link to="/preserve#sources">Источники проекта</Link><a href="https://berezovsky.ru" target="_blank" rel="noreferrer">Сайт города <ArrowUpRightIcon width={14} height={14} /></a></div>
    </div>
    <div className="footer-bottom"><span>© {currentYear} Неизвестный Берёзовский</span><span>Свердловская область · Урал</span></div>
  </div></footer>;
}

