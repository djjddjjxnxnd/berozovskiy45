import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from './Icons';

export default function PhotoCarousel({ images, alt, variant = 'card', autoPlay = true, fullScreen = false }) {
  const photos = images.map(image => typeof image === 'string' ? { url: image } : image).filter((image, index, all) => image.url && all.findIndex(item => item.url === image.url) === index).slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const host = useRef(null);
  const closeButton = useRef(null);
  const touchStart = useRef(null);
  const current = photos[active] || photos[0];
  const total = photos.length;
  const move = step => setActive(index => (index + step + total) % total);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!autoPlay || paused || expanded || !visible || total < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % total);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, expanded, visible, total]);
  useEffect(() => {
    if (!expanded) return undefined;
    const oldOverflow = document.body.style.overflow;
    const oldFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') setExpanded(false);
      if (event.key === 'ArrowRight') setActive(index => (index + 1) % total);
      if (event.key === 'ArrowLeft') setActive(index => (index - 1 + total) % total);
      if (event.key === 'Tab') {
        const buttons = [...document.querySelectorAll('.photo-lightbox button')];
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', handleKey); oldFocus?.focus(); };
  }, [expanded, total]);

  if (!current) return <div className="photo-unavailable">Фотография пока не добавлена</div>;
  return <div ref={host} className={'photo-gallery photo-gallery-' + variant} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="photo-stage" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touchStart.current !== null && total > 1) { const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); } touchStart.current = null; }}>
      {photos.map((photo, index) => <img key={photo.url} className={'gallery-photo' + (index === active ? ' is-active' : '') + (variant === 'detail' || photo.fit === 'contain' ? ' fit-contain' : '')} src={photo.url} alt={photo.title || alt + ' — фото ' + (index + 1)} loading={index ? 'lazy' : 'eager'} style={{ objectPosition: photo.position || 'center' }} aria-hidden={index !== active} />)}
      {total > 1 && <><button type="button" className="gallery-arrow previous" aria-label="Предыдущее фото" onClick={() => move(-1)}><ChevronLeftIcon width={19} height={19} /></button><button type="button" className="gallery-arrow next" aria-label="Следующее фото" onClick={() => move(1)}><ChevronRightIcon width={19} height={19} /></button><span className="gallery-counter">{active + 1}<span> / {total}</span></span></>}
      {fullScreen && <button type="button" className="gallery-expand" aria-label="Открыть фото на весь экран" onClick={() => setExpanded(true)}><ExpandIcon width={18} height={18} /></button>}
    </div>
    {variant === 'detail' && <div className="gallery-caption"><span>{current.title || alt}</span><div className="gallery-dots">{photos.map((photo, index) => <button type="button" key={photo.url} className={index === active ? 'is-active' : ''} aria-label={'Показать фото ' + (index + 1)} aria-pressed={index === active} onClick={() => setActive(index)} />)}</div></div>}
    {expanded && createPortal(<div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={'Фотографии: ' + alt} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}>
      <button ref={closeButton} className="lightbox-close icon-button" type="button" aria-label="Закрыть фотографии" onClick={() => setExpanded(false)}><CloseIcon /></button>
      <img src={current.url} alt={current.title || alt} />
      {total > 1 && <><button type="button" className="gallery-arrow previous" aria-label="Предыдущее фото" onClick={() => move(-1)}><ChevronLeftIcon /></button><button type="button" className="gallery-arrow next" aria-label="Следующее фото" onClick={() => move(1)}><ChevronRightIcon /></button></>}
      <div className="lightbox-caption">{current.title || alt}<span>{active + 1} / {total}</span></div>
    </div>, document.body)}
  </div>;
}

