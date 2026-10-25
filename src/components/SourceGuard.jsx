import { useEffect, useRef, useState } from 'react';

// Защита контента сайта: блокировка инструментов разработчика,
// контекстного меню, копирования и перетаскивания картинок,
// а также запрет встраивания сайта в чужие домены (сайт-крадеры).
const BLOCKED_KEYS = new Set(['F12', 'f12']);
const BLOCKED_COMBOS = new Set([
  'ctrl+shift+i', 'ctrl+shift+j', 'ctrl+shift+c', // DevTools
  'ctrl+u', 'ctrl+U', // просмотр исходника
  'ctrl+s', 'ctrl+S', // сохранение страницы
  'ctrl+p', 'ctrl+P', // печать (сохранение в PDF)
]);
const GUARD_MESSAGE = 'Сайт защищён: исходный код и содержимое копировать нельзя';

export default function SourceGuard() {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const warn = () => {
      setMessage(GUARD_MESSAGE);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setMessage(null), 2200);
    };

    const onKeyDown = (event) => {
      const combo = `${event.ctrlKey ? 'ctrl+' : ''}${event.shiftKey ? 'shift+' : ''}${event.key}`;
      if (BLOCKED_KEYS.has(event.key) || BLOCKED_COMBOS.has(combo) || BLOCKED_COMBOS.has(combo.toLowerCase())) {
        event.preventDefault();
        event.stopPropagation();
        warn();
      }
    };
    const onContextMenu = (event) => {
      event.preventDefault();
      warn();
    };
    const onCopy = (event) => {
      if (event.target.closest && event.target.closest('input, textarea')) return;
      event.preventDefault();
      warn();
    };
    const onDragStart = (event) => {
      if (event.target.tagName === 'IMG') event.preventDefault();
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopy);
    document.addEventListener('dragstart', onDragStart);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('dragstart', onDragStart);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  // Сайт не должен открываться внутри чужого iframe (защита от сайт-крадеров)
  useEffect(() => {
    if (window.top !== window.self) {
      document.body.innerHTML = '<div style="display:grid;place-items:center;height:100vh;font-family:Segoe UI,Arial,sans-serif;color:#292c29;background:#f7f4ed;padding:24px;text-align:center">'
        + '<div><h2>Сайт «Неизвестный Берёзовский» нельзя встраивать</h2>'
        + '<p style="color:#6d7068">Откройте его напрямую: <a href="https://djjddjjxnxnd.github.io/berozovskiy45/" style="color:#b54b35">djjddjjxnxnd.github.io/berozovskiy45</a></p></div></div>';
    }
  }, []);

  if (!message) return null;
  return <div className="source-guard-toast" role="alert">{message}</div>;
}
