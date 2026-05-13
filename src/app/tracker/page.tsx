'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';
import BlurOrbs from '@/components/layout/BlurOrbs';

const FEATURES = [
  {
    ico: 'i-link',
    title: 'Персональная ссылка',
    desc: 'Каждый клиент получает уникальный URL с защитой — только он видит свой проект. Никакой регистрации.',
  },
  {
    ico: 'i-eye',
    title: 'Real-time обновления',
    desc: 'Прогресс, задачи, статусы обновляются в реальном времени. Клиент видит изменения без перезагрузки страницы.',
  },
  {
    ico: 'i-bell',
    title: 'Умные уведомления',
    desc: 'Email и push-уведомления при завершении этапа, добавлении комментария или смене статуса milestone.',
  },
  {
    ico: 'i-file',
    title: 'Документы и артефакты',
    desc: 'Все файлы проекта в одном месте — дизайн-макеты, ТЗ, отчёты. Клиент скачивает когда нужно.',
  },
  {
    ico: 'i-chat',
    title: 'Лента обновлений',
    desc: 'Хронология всех событий по проекту — что сделано, когда, кем. Полная прозрачность без звонков.',
  },
  {
    ico: 'i-shield',
    title: 'Безопасность и NDA',
    desc: 'Данные зашифрованы, ссылка защищена токеном, время жизни настраивается. Соответствие GDPR.',
  },
] as const;

export default function TrackerPage() {
  const [email, setEmail]       = useState('');
  const [email2, setEmail2]     = useState('');
  const [submitted, setSubmit]  = useState(false);
  const [submitted2, setSubmit2] = useState(false);

  const handleSubmit = (e: React.FormEvent, which: 1 | 2) => {
    e.preventDefault();
    if (which === 1) setSubmit(true);
    else setSubmit2(true);
  };

  return (
    <div style={{minHeight:'100vh', background:'var(--navy)'}}>
      <BlurOrbs count={2} />
      <TopNav backHref="/" backLabel="← На главную" />

      {/* HERO */}
      <div className="tracker-hero">
        <div className="coming-badge">
          <span className="hero-dot" /> В разработке · Coming Soon
        </div>
        <h1>Live Project<br/><em>Tracker</em></h1>
        <p className="hero-sub">Ваш клиент видит прогресс в реальном времени — этапы, проценты готовности, обновления и следующий milestone. Без звонков «как дела?»</p>

        <form className="notify-form" onSubmit={e=>handleSubmit(e,1)}>
          <input
            type="email" className="notify-input"
            placeholder="Ваш email — сообщим о запуске"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            disabled={submitted}
          />
          <button className="btn btn-primary" type="submit" disabled={submitted}>
            {submitted ? '✓ Готово' : 'Уведомить меня'}
          </button>
        </form>
        <div className="notify-note">Планируемый запуск: Q3 2026</div>

        <div className="launch-progress">
          <div className="lp-label"><span>Прогресс разработки</span><span>67%</span></div>
          <div className="lp-track"><div className="lp-fill" /></div>
        </div>
      </div>

      {/* MOCKUP */}
      <div className="mockup-section">
        <div className="section-label">Предварительный вид</div>
        <div className="browser-wrap">
          <div className="browser-outer">
            <div className="browser-titlebar">
              <div className="b-dots">
                <div className="b-dot b-dot-r" />
                <div className="b-dot b-dot-y" />
                <div className="b-dot b-dot-g" />
              </div>
              <div className="b-url">
                <span className="b-lock">🔒</span>
                tracker.novainvest.eu/project/acme-corp-2026
                <span className="b-share">Персональная ссылка</span>
              </div>
            </div>

            <div className="tracker-ui">
              {/* Sidebar */}
              <div className="tracker-sidebar">
                <div className="ts-logo">
                  <div className="ts-logo-ico">A</div>
                  <div>
                    <div className="ts-logo-name">ACME Corp</div>
                    <div className="ts-logo-proj">CRM Platform</div>
                  </div>
                </div>
                {[
                  { ico:'i-grid',  label:'Обзор проекта',    active:true  },
                  { ico:'i-task',  label:'Задачи и спринты', active:false },
                  { ico:'i-time',  label:'Таймлайн',         active:false },
                  { ico:'i-file',  label:'Документы',        active:false },
                  { ico:'i-chat',  label:'Обновления',       active:false },
                ].map(item => (
                  <div key={item.label} className={`ts-item${item.active?' active':''}`}>
                    <svg width="14" height="14"><use href={`#${item.ico}`}/></svg>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="tracker-main">
                <div className="tm-header">
                  <div>
                    <div className="tm-title">CRM Platform — ACME Corp</div>
                    <div className="tm-sub">Спринт 4 из 6 · Обновлено 2 часа назад</div>
                  </div>
                  <div className="tm-status"><span className="tm-live-dot" /> Live</div>
                </div>

                <div className="overall-card">
                  <div className="oc-row">
                    <div className="oc-label">Общий прогресс</div>
                    <div className="oc-pct">68%</div>
                  </div>
                  <div className="oc-track"><div className="oc-fill" style={{width:'68%'}} /></div>
                  <div className="oc-metas">
                    <div className="oc-meta">Начало: <b>01 Мар 2026</b></div>
                    <div className="oc-meta">Дедлайн: <b>30 Июн 2026</b></div>
                    <div className="oc-meta">Осталось: <b>47 дней</b></div>
                  </div>
                </div>

                <div className="milestones">
                  {[
                    { ico:'i-check', state:'done',    name:'Дизайн и прототип',    date:'Завершён 15 Мар',      badge:'badge-done',    label:'Готово',      active:false },
                    { ico:'i-check', state:'done',    name:'Backend API v1',       date:'Завершён 10 Апр',      badge:'badge-done',    label:'Готово',      active:false },
                    { ico:'i-time',  state:'active',  name:'Frontend + Интеграции',date:'В работе · ~3 недели', badge:'badge-wip',     label:'В работе',    active:true  },
                    { ico:'i-task',  state:'pending', name:'Тестирование QA',      date:'Следующий этап',       badge:'badge-next',    label:'Далее',       active:false },
                    { ico:'i-shield',state:'pending', name:'Деплой в Production',  date:'30 Июня 2026',         badge:'badge-pending', label:'Планируется', active:false },
                  ].map(m => (
                    <div key={m.name} className="ms-item" style={m.active?{borderColor:'rgba(0,217,255,.25)',background:'rgba(0,217,255,.03)'}:{}}>
                      <div className={`ms-ico ${m.state}`}>
                        <svg width="14" height="14"><use href={`#${m.ico}`}/></svg>
                      </div>
                      <div className="ms-body">
                        <div className="ms-name">{m.name}</div>
                        <div className="ms-date">{m.date}</div>
                      </div>
                      <div className={`ms-badge ${m.badge}`}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{fontSize:'10px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'10px'}}>Последние обновления</div>
                <div className="updates">
                  {[
                    { color:'var(--cyan)',   text:'Завершена интеграция платёжного шлюза Stripe',           time:'Сегодня, 14:32' },
                    { color:'var(--green)',  text:'Прошли unit-тесты авторизационного модуля (147/147)',    time:'Вчера, 18:05'   },
                    { color:'var(--purple)', text:'Дизайн дашборда утверждён командой',                    time:'2 дня назад'    },
                  ].map(u => (
                    <div key={u.text} className="upd-item">
                      <div className="upd-dot" style={{background:u.color}} />
                      <div>
                        <div className="upd-text">{u.text}</div>
                        <div className="upd-time">{u.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <div className="section-label">Что получат ваши клиенты</div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-ico">
                <svg width="22" height="22"><use href={`#${f.ico}`}/></svg>
              </div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-card">
          <div className="cta-title">Хотите первым<br/>попробовать <em>beta</em>?</div>
          <div className="cta-sub">Оставьте email — когда запустим ранний доступ,<br/>вы будете в списке первых.</div>
          <form style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap',marginBottom:'28px'}} onSubmit={e=>handleSubmit(e,2)}>
            <input
              type="email" className="notify-input" style={{maxWidth:'260px'}}
              placeholder="your@email.com"
              value={email2}
              onChange={e=>setEmail2(e.target.value)}
              disabled={submitted2}
            />
            <button className="btn btn-primary" type="submit" disabled={submitted2}>
              {submitted2 ? '✓ Готово' : 'Получить доступ'}
            </button>
          </form>
          <div style={{borderTop:'1px solid var(--border)',paddingTop:'24px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--muted)'}}>Пока можно посмотреть</div>
            <Link href="/" className="btn btn-primary" style={{gap:'12px',fontSize:'13px',padding:'15px 36px'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
              На главный сайт
            </Link>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center',marginTop:'4px'}}>
              <Link href="/calc" className="btn" style={{background:'rgba(0,217,255,0.1)',border:'1px solid rgba(0,217,255,0.25)',color:'var(--cyan)',padding:'10px 20px',fontSize:'11px'}}>Калькулятор проекта</Link>
              <Link href="/brief" className="btn" style={{background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.25)',color:'#a78bfa',padding:'10px 20px',fontSize:'11px'}}>ТЗ Конструктор</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
