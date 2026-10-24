import { Link } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, description, children }) {
  return <header className="page-header"><div className="container">
    <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span aria-hidden="true">/</span><span>{eyebrow}</span></nav>
    <div className="page-header-row"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>
  </div></header>;
}
