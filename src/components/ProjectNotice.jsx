import { useState } from 'react';

const STORAGE_KEY = 'project_notice_dismissed_v1';

// Плашка «про входе на сайт»: поясняет, что сайт сделан для школьного проекта,
// и направляет в чат за паролем автора.
export default function ProjectNotice() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem(STORAGE_KEY); } catch { return true; }
  });

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* пропуск */ }
  };

  const openChat = () => {
    close();
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <div className="project-notice-overlay" role="dialog" aria-modal="false" aria-label="Сведения о сайте">
      <div className="project-notice">
        <span className="project-notice-eyebrow">Школьный исследовательский проект</span>
        <h2>Сайт сделан для задания по проекту</h2>
        <p>
          Этот путеводитель по Берёзовскому создан в рамках школьного проектного задания.
          Узнать автора можно в чате: нажмите иконку чата в левом нижнем углу и введите пароль,
          который знает только создатель проекта.
        </p>
        <div className="project-notice-actions">
          <button type="button" className="button button-primary" onClick={openChat}>Открыть чат</button>
          <button type="button" className="button button-secondary" onClick={close}>Понятно</button>
        </div>
      </div>
    </div>
  );
}
