import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BirchLeaves from './components/BirchLeaves';
import HomePage from './pages/HomePage';
import MonumentsPage from './pages/MonumentsPage';
import MonumentDetailPage from './pages/MonumentDetailPage';
import MapPage from './pages/MapPage';
import HistoryPage from './pages/HistoryPage';
import RoutesPage from './pages/RoutesPage';
import PreservePage from './pages/PreservePage';
import ProjectNotice from './components/ProjectNotice';
import ChatWidget from './components/ChatWidget';
import SourceGuard from './components/SourceGuard';
import './index.css';

function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const timer=window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(),60); return () => window.clearTimeout(timer); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
function Background() {
  return <div className="site-background" aria-hidden="true"><svg className="contour-lines" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" strokeWidth="1">{[0,1,2,3,4,5,6,7,8,9].map(index => <path key={index} transform={'translate(' + (-index*18) + ',' + (index*18) + ')'} d="M-100 350C150 130 350 600 610 380S940-90 1250 120s230 570 430 700" />)}</g></svg></div>;
}
export default function App() {
  return <HashRouter><RouteScroll /><Background /><BirchLeaves count={10} /><button type="button" className="skip-link" onClick={() => document.getElementById('main-content')?.scrollIntoView()}>Перейти к содержимому</button><Navbar /><main id="main-content"><Routes><Route path="/" element={<HomePage />} /><Route path="/monuments" element={<MonumentsPage />} /><Route path="/monument/:id" element={<MonumentDetailPage />} /><Route path="/map" element={<MapPage />} /><Route path="/history" element={<HistoryPage />} /><Route path="/routes" element={<RoutesPage />} /><Route path="/preserve" element={<PreservePage />} /><Route path="*" element={<div className="container empty-state"><span className="eyebrow">404</span><h1>Кажется, мы свернули не туда</h1><Link className="button button-primary" to="/">Вернуться на главную</Link></div>} /></Routes></main><Footer /><ScrollToTop /><ProjectNotice /><ChatWidget /><SourceGuard /></HashRouter>;
}

