import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { chatReply, CHAT_QUICK_QUESTIONS } from '../utils/chatBrain';
import { monuments } from '../data/monuments';

function ChatIcon({ width = 24, height = 24 }) {
  return <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></svg>;
}

function CloseIcon({ width = 18, height = 18 }) {
  return <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

function SendIcon({ width = 18, height = 18 }) {
  return <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg>;
}

let messageId = 0;
const nextId = () => ++messageId;

const WELCOME = {
  id: nextId(),
  from: 'bot',
  lines: ['Привет! Я гид по Берёзовскому. Подскажу, куда сходить, расскажу про памятники и места города.', 'А ещё здесь действует секрет: введите пароль проекта — и я назову имя автора сайта.'],
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [WELCOME]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Событие open-chat — из таблички проекта
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener('open-chat', openChat);
    return () => window.removeEventListener('open-chat', openChat);
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (text) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: nextId(), from: 'user', lines: [value] }]);
    setDraft('');
    setTyping(true);
    const answer = chatReply(value);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), from: 'bot', lines: answer.lines, links: answer.links, chips: answer.chips }]);
    }, 600);
  };

  return (
    <>
      <button
        type="button"
        className={'chat-launcher' + (open ? ' chat-launcher-hidden' : '')}
        aria-label="Открыть чат с гидом"
        onClick={() => setOpen(true)}
      >
        <ChatIcon width={26} height={26} />
        <span className="chat-launcher-badge">1</span>
      </button>

      <section className={'chat-panel' + (open ? '' : ' chat-panel-hidden')} aria-label="Чат с гидом по Берёзовскому">
        <header className="chat-panel-header">
          <span className="chat-panel-avatar" aria-hidden="true">🏛</span>
          <div>
            <strong>Гид по Берёзовскому</strong>
            <small>онлайн · знает {monuments.length} места города</small>
          </div>
          <button type="button" className="icon-button" aria-label="Закрыть чат" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </header>

        <div className="chat-messages" ref={listRef}>
          {messages.map((message) => (
            <div key={message.id} className={'chat-msg chat-msg-' + message.from}>
              {message.lines.map((line, index) => <p key={index}>{line}</p>)}
              {message.links?.length > 0 && (
                <div className="chat-msg-links">
                  {message.links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label} ↗</Link>)}
                </div>
              )}
              {message.chips?.length > 0 && (
                <div className="chat-msg-chips">
                  {message.chips.map((chip) => <button key={chip} type="button" onClick={() => send(chip)}>{chip}</button>)}
                </div>
              )}
            </div>
          ))}
          {typing && <div className="chat-msg chat-msg-bot chat-typing"><span /><span /><span /></div>}
        </div>

        <div className="chat-quick">
          {CHAT_QUICK_QUESTIONS.map((question) => (
            <button key={question} type="button" onClick={() => send(question)}>{question}</button>
          ))}
        </div>

        <form
          className="chat-input"
          onSubmit={(event) => { event.preventDefault(); send(draft); }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Спросите гида или введите пароль…"
            aria-label="Сообщение гиду"
            maxLength={300}
          />
          <button type="submit" aria-label="Отправить" disabled={!draft.trim()}>
            <SendIcon />
          </button>
        </form>
      </section>
    </>
  );
}
