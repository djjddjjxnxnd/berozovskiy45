import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { CameraIcon, MapPinIcon, BookIcon, CheckIcon, ArrowUpRightIcon } from '../components/Icons';

const storageKey = 'berezovsky-place-draft-v2';
function readDraft() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || { title:'', address:'', story:'', source:'' }; }
  catch { return { title:'', address:'', story:'', source:'' }; }
}
export default function PreservePage() {
  const [draft,setDraft] = useState(readDraft);
  const [saved,setSaved] = useState(false);
  const [error,setError] = useState('');
  const update = event => { setDraft(current => ({...current,[event.target.name]:event.target.value})); setSaved(false); setError(''); };
  const save = event => {
    event.preventDefault();
    try { localStorage.setItem(storageKey, JSON.stringify(draft)); setSaved(true); setError(''); }
    catch { setError('Не удалось сохранить в браузере. Скачайте рассказ файлом.'); }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(draft,null,2)],{type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href=url; link.download='istoriya-mesta.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url),1000);
  };
  return <>
    <PageHeader eyebrow="Сохраним вместе" title={<>У города есть истории.<br /><em>Расскажите свою.</em></>} description="Этот путеводитель — школьный проект о родном городе. Помогите заметить то, что обычно остаётся за кадром." />
    <section className="page-section"><div className="container preserve-intro"><div><span className="eyebrow">Важное рядом</span><h2>Не обязательно<br />искать памятник</h2><p>Старинная улица, тихий двор, семейный архив или знакомая с детства тропа — у каждого места есть своя история.</p></div><div className="preserve-guide">{[{icon:MapPinIcon,title:'Назовите место',text:'Добавьте адрес, ориентир или координаты, чтобы его могли найти другие.'},{icon:BookIcon,title:'Расскажите, что вы знаете',text:'Откуда история, какие детали сохранились, кто может рассказать больше.'},{icon:CameraIcon,title:'Укажите источник',text:'Если у вас есть фотография или публикация, добавьте ссылку и имя автора.'}].map(item => { const Icon=item.icon; return <div className="preserve-guide-step" key={item.title}><Icon width={25} height={25} /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>; })}</div></div></section>
    <section className="page-section section-lined" id="form"><div className="container preserve-form-layout"><div className="preserve-form-note"><span className="eyebrow">Начните с нескольких строк</span><h2>Ваше место<br />на карте города</h2><p>Составьте рассказ и сохраните его. Черновик останется в этом браузере; файл можно передать руководителю школьного проекта.</p><p className="muted">Автоматической отправки на сервер нет.</p></div><form className="preserve-form panel" onSubmit={save}><label className="form-field">Как называется место<input className="form-control" name="title" value={draft.title} onChange={update} required maxLength={160} placeholder="Например, старый дом на улице…" /></label><label className="form-field">Где оно находится<input className="form-control" name="address" value={draft.address} onChange={update} required maxLength={300} placeholder="Адрес или ориентир" /></label><label className="form-field">История места<textarea className="form-control" name="story" value={draft.story} onChange={update} required rows={7} maxLength={10000} placeholder="Чем это место интересно? Что с ним связано?" /></label><label className="form-field">Источник или ссылка на фотографию<input className="form-control" name="source" value={draft.source} onChange={update} maxLength={2000} placeholder="Необязательно" /></label><div className="form-actions"><button className="button button-primary" type="submit">Сохранить черновик</button><button className="button button-secondary" type="button" onClick={download} disabled={!draft.title.trim() || !draft.story.trim()}>Скачать рассказ</button></div>{saved && <p className="form-message" role="status"><CheckIcon width={18} height={18} />Черновик сохранён в этом браузере.</p>}{error && <p className="form-error" role="alert">{error}</p>}</form></div></section>
    <section className="page-section" id="sources"><div className="container"><div className="section-heading"><div><span className="eyebrow">Откуда мы узнаём о городе</span><h2>Источники проекта</h2></div></div><div className="source-list">{[{title:'Наш Урал',text:'Краеведческие материалы и фотографии Берёзовского.',url:'https://nashural.ru/dostoprimechatelnosti-urala/sverdlovskaya-oblast/berezovskiy/'},{title:'Sobory.ru',text:'Фотографии и описание Успенской церкви.',url:'https://sobory.ru/photo/452454'},{title:'Администрация Берёзовского',text:'Городские публикации и официальная информация.',url:'https://berezovsky.ru'},{title:'OpenStreetMap',text:'Картографическая основа путеводителя.',url:'https://www.openstreetmap.org/copyright'}].map(item => <a className="source-item" key={item.title} href={item.url} target="_blank" rel="noreferrer"><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRightIcon width={21} height={21} /></a>)}</div></div></section>
  </>;
}

