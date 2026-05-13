'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';
import BlurOrbs from '@/components/layout/BlurOrbs';

/* ── DATA ──────────────────────────────────────────────────────────── */
const STEPS_LABELS = ['Компания','Тип','Цели','Аудитория','Функции','Дизайн','Бюджет'] as const;

const TYPE_OPTS = [
  { v:'website', name:'Веб-сайт / портал', sub:'Корпоративный сайт, лендинг, каталог', ico:'i-web' },
  { v:'webapp',  name:'Веб-приложение',    sub:'SaaS, платформа, личный кабинет',      ico:'i-saas' },
  { v:'mobile',  name:'Мобильное приложение', sub:'iOS, Android или оба',              ico:'i-mobile' },
  { v:'both',    name:'Веб + Мобайл',      sub:'Единая экосистема на всех платформах', ico:'i-both' },
] as const;

const BRAND_OPTS = [
  { v:'yes',     name:'Есть брендбук',        sub:'Цвета, шрифты, логотип готовы' },
  { v:'partial', name:'Частично',              sub:'Только логотип / цвета' },
  { v:'no',      name:'Нет, нужен дизайн с нуля', sub:'Разработаем фирменный стиль' },
] as const;

const BUDGET_OPTS = [
  { v:'5-15k',   name:'5 000 — 15 000 €',  sub:'MVP / стартовый проект' },
  { v:'15-40k',  name:'15 000 — 40 000 €', sub:'Полноценный продукт' },
  { v:'40-100k', name:'40 000 — 100 000 €',sub:'Сложная платформа' },
  { v:'100k+',   name:'100 000+ €',         sub:'Enterprise-уровень' },
] as const;

const FEAT_OPTS = [
  { v:'auth',          name:'Авторизация',        sub:'Регистрация, вход, роли' },
  { v:'dashboard',     name:'Дашборд',             sub:'Аналитика и статистика' },
  { v:'payment',       name:'Оплата онлайн',       sub:'Stripe, PayPal, банковские карты' },
  { v:'notifications', name:'Уведомления',         sub:'Email, push, SMS' },
  { v:'search',        name:'Поиск',               sub:'Полнотекстовый поиск по контенту' },
  { v:'chat',          name:'Чат / мессенджер',    sub:'Переписка внутри платформы' },
  { v:'admin',         name:'Админ-панель',        sub:'Управление данными и пользователями' },
  { v:'api',           name:'REST API',             sub:'Для интеграции с партнёрами' },
  { v:'ai',            name:'AI-функции',           sub:'Рекомендации, чатбот, автоматизация' },
  { v:'geo',           name:'Геолокация / карты',  sub:'Поиск по местоположению' },
  { v:'report',        name:'Отчёты / экспорт',    sub:'PDF, Excel, CSV отчёты' },
  { v:'cms',           name:'CMS',                 sub:'Управление контентом сайта' },
] as const;

const STYLE_CHIPS = ['Минимализм','Тёмная тема','Корпоративный','Креативный','Анимации','3D-элементы','Bold / яркий','Чистый / светлый'] as const;
const AUD_CHIPS   = ['Мобильные устройства','Доступность (a11y)','Мультиязычность','Простой интерфейс','B2B пользователи','Пожилая аудитория'] as const;

const typeLabels:   Record<string,string> = { website:'Веб-сайт / портал', webapp:'Веб-приложение', mobile:'Мобильное приложение', both:'Веб + Мобайл' };
const brandLabels:  Record<string,string> = { yes:'Есть брендбук', partial:'Частично (только логотип)', no:'Дизайн с нуля' };
const budgetLabels: Record<string,string> = { '5-15k':'5 000 – 15 000 €', '15-40k':'15 000 – 40 000 €', '40-100k':'40 000 – 100 000 €', '100k+':'100 000+ €' };

/* ── TYPES ──────────────────────────────────────────────────────────── */
interface BriefData {
  company: string; industry: string; site: string; country: string; desc: string;
  typeV: string; goal: string; pain: string; kpi: string;
  audience: string; users: number;
  audChips: string[]; feats: string[]; styleChips: string[];
  refs: string; brandV: string; budget: string; timeline: number; notes: string;
}

/* ── HELPERS ──────────────────────────────────────────────────────────── */
function pct(v: number, min: number, max: number) {
  return (((v - min) / (max - min)) * 100).toFixed(1) + '%';
}
function usersLabel(v: number) {
  return v >= 1000 ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'K' : String(v);
}

function launchConfetti() {
  const colors = ['#00d9ff','#8b5cf6','#22c55e','#f59e0b','#ffffff'];
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'conf';
      c.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.5+Math.random()*2.5}s`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 25);
  }
}

/* ── COMPONENT ──────────────────────────────────────────────────────── */
export default function BriefPage() {
  const [step, setStep]         = useState(0);
  const [showResult, setShow]   = useState(false);

  // Field values
  const [company,  setCompany]  = useState('');
  const [industry, setIndustry] = useState('');
  const [site,     setSite]     = useState('');
  const [country,  setCountry]  = useState('');
  const [desc,     setDesc]     = useState('');
  const [typeV,    setTypeV]    = useState('');
  const [goal,     setGoal]     = useState('');
  const [pain,     setPain]     = useState('');
  const [kpi,      setKpi]      = useState('');
  const [audience, setAudience] = useState('');
  const [users,    setUsers]    = useState(1000);
  const [audChips, setAudChips] = useState<string[]>([]);
  const [feats,    setFeats]    = useState<string[]>([]);
  const [styleChips, setStyleChips] = useState<string[]>([]);
  const [refs,     setRefs]     = useState('');
  const [brandV,   setBrandV]   = useState('');
  const [budget,   setBudget]   = useState('');
  const [timeline, setTimeline] = useState(4);
  const [notes,    setNotes]    = useState('');

  // Result data
  const [finalData, setFinalData] = useState<BriefData | null>(null);
  const [briefNum,  setBriefNum]  = useState('');

  const goStep = useCallback((n: number) => { setStep(n); window.scrollTo({top:0,behavior:'smooth'}); }, []);

  const toggleFeat = (v: string) => {
    setFeats(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };
  const toggleAudChip = (v: string) => {
    setAudChips(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };
  const toggleStyleChip = (v: string) => {
    setStyleChips(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const finish = () => {
    const data: BriefData = {
      company, industry, site, country, desc,
      typeV, goal, pain, kpi,
      audience, users, audChips, feats, styleChips,
      refs, brandV, budget, timeline, notes,
    };
    setFinalData(data);
    setBriefNum('ТЗ-БРИФ #' + (2026000 + Math.floor(Math.random() * 999)));
    setShow(true);
    launchConfetti();
    window.scrollTo({top:0, behavior:'smooth'});
  };

  /* ── LIVE PANEL DATA ──────────────────────────────────────────────── */
  const panelDate = company ? new Date().toLocaleDateString('ru-RU') : '—';

  /* ── RESULT ──────────────────────────────────────────────────────── */
  if (showResult && finalData) {
    const d = finalData;
    const dateStr = new Date().toLocaleDateString('ru-RU');
    return (
      <div style={{minHeight:'100vh', background:'var(--navy)'}}>
        <BlurOrbs count={2} />
        <TopNav backHref="/" backLabel="← Home" />
        <div className="result-screen brief show">
          <div className="rs-hero">
            <div className="rs-badge">
              <svg width="14" height="14"><use href="#i-check"/></svg> ТЗ-бриф сформирован
            </div>
            <h1 className="rs-title">Ваш бриф <em>готов</em></h1>
            <p className="rs-sub">Мы получили все данные для точной оценки проекта.<br/>Наша команда свяжется с вами в течение 24 часов.</p>
          </div>

          <div className="final-brief">
            <div className="fb-header">
              <div className="fb-logo-row">
                <div className="fb-logo">
                  <div className="fb-logo-mark">N</div>
                  <div className="fb-logo-name">Invest Nova LG</div>
                </div>
                <div className="fb-doc-num">{briefNum}</div>
              </div>
              <div className="fb-title">{d.company ? `ТЗ-Бриф: ${d.company}` : 'Технический бриф'}</div>
              <div className="fb-meta-row">
                <div className="fb-meta">Компания: <b>{d.company || 'Не указано'}</b></div>
                <div className="fb-meta">Дата: <b>{dateStr}</b></div>
                <div className="fb-meta">Сроки: <b>{d.timeline} мес.</b></div>
              </div>
            </div>
            <div className="fb-body">
              <div className="fb-section">
                <div className="fb-sec-head">О компании и проекте</div>
                <div className="fb-grid">
                  <div className="fb-key">Компания</div><div className="fb-val v">{[d.company, d.industry].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">Сфера</div><div className="fb-val">{[d.country, d.site ? 'Сайт: ' + d.site : ''].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">Тип проекта</div><div className="fb-val v">{typeLabels[d.typeV] || '—'}</div>
                  <div className="fb-key">Бюджет</div><div className="fb-val v">{budgetLabels[d.budget] || '—'}</div>
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">Цели и аудитория</div>
                <div className="fb-grid">
                  <div className="fb-key">Цель</div><div className="fb-val">{d.goal || '—'}</div>
                  <div className="fb-key">Пользователи</div><div className="fb-val">{[d.audience, d.audChips.join(', ')].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">Масштаб</div><div className="fb-val">{usersLabel(d.users)} пользователей/мес</div>
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">Функциональность</div>
                <div className="fb-tags">
                  {d.feats.length > 0
                    ? d.feats.map(f => <span key={f} className="fb-tag fb-tag-c">{FEAT_OPTS.find(o=>o.v===f)?.name||f}</span>)
                    : <span style={{fontSize:'11px',color:'var(--muted)'}}>не указаны</span>
                  }
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">Дизайн и требования</div>
                <div className="fb-grid">
                  <div className="fb-key">Стиль</div><div className="fb-val">{d.styleChips.join(', ') || '—'}</div>
                  <div className="fb-key">Брендбук</div><div className="fb-val">{brandLabels[d.brandV] || '—'}</div>
                  <div className="fb-key">Референсы</div><div className="fb-val">{d.refs || '—'}</div>
                  <div className="fb-key">Заметки</div><div className="fb-val">{d.notes || '—'}</div>
                </div>
              </div>
            </div>
            <div className="fb-footer">
              <div className="fb-footer-note">Invest Nova LG LTD · info@novainvest.eu · novainvest.eu</div>
              <div className="fb-footer-note">{briefNum}</div>
            </div>
          </div>

          <div className="rs-cta">
            <Link href="/" className="btn btn-primary">
              <svg width="16" height="16"><use href="#i-send"/></svg>
              На главную
            </Link>
            <button className="btn btn-ghost" onClick={() => { setShow(false); setStep(0); }}>
              <svg width="16" height="16"><use href="#i-refresh"/></svg>
              Заполнить заново
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── STEPPER ──────────────────────────────────────────────────────── */
  const Stepper = () => (
    <div className="stepper" style={{marginBottom:'40px'}}>
      {STEPS_LABELS.map((label, i) => (
        <div
          key={i}
          className={`stepper-item${i < step ? ' done' : i === step ? ' active' : ''}`}
        >
          <div className="stepper-dot">
            {i < step
              ? <svg width="10" height="10"><use href="#i-check"/></svg>
              : i + 1
            }
          </div>
          <div className="stepper-label">{label}</div>
        </div>
      ))}
    </div>
  );

  /* ── LIVE PANEL ──────────────────────────────────────────────────── */
  const LivePanel = () => (
    <div className="brief-panel">
      <div className="bp-header">
        <div className="bp-badge"><span className="bp-live-dot" /> Обновляется в реальном времени</div>
        <div className="bp-title">ТЗ-Бриф</div>
        <div className="bp-sub">Предварительный просмотр</div>
      </div>

      <div className="brief-doc">
        <div className="bd-doc-header">
          <div className="bd-doc-logo">
            <div className="bd-doc-logo-mark">N</div>
            <div className="bd-doc-logo-name">Invest Nova LG</div>
          </div>
          <div className="bd-doc-title">{company ? `ТЗ-Бриф: ${company}` : 'Технический бриф'}</div>
          <div className="bd-doc-date">Составлен: {panelDate}</div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">О компании</div>
          <div className="bd-row"><div className="bd-key">Компания</div><div className="bd-val">{company ? <span className="bd-val filled">{company}</span> : <span className="bd-empty">не заполнено</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Сфера</div><div className="bd-val">{industry ? <span className="bd-val filled">{industry}</span> : <span className="bd-empty">не указана</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Рынок</div><div className="bd-val">{country ? <span className="bd-val filled">{country}</span> : <span className="bd-empty">не указан</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">Проект</div>
          <div className="bd-row"><div className="bd-key">Тип</div><div className="bd-val">{typeV ? <span className="bd-tag">{typeLabels[typeV]||typeV}</span> : <span className="bd-empty">не выбран</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Цель</div><div className="bd-val">{goal ? <span className="bd-val filled">{goal.substring(0,80)}{goal.length>80?'…':''}</span> : <span className="bd-empty">не описана</span>}</div></div>
          <div className="bd-row"><div className="bd-key">KPI</div><div className="bd-val">{kpi ? <span className="bd-val filled">{kpi}</span> : <span className="bd-empty">не указан</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">Аудитория</div>
          <div className="bd-row"><div className="bd-key">Пользователи</div><div className="bd-val">{audience ? <span className="bd-val filled">{audience}</span> : <span className="bd-empty">не описана</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Масштаб</div><div className="bd-val">{usersLabel(users)}/мес</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">Функциональность</div>
          <div className="bd-row">
            <div className="bd-key">Модули</div>
            <div className="bd-val">
              {feats.length > 0
                ? feats.map(f => <span key={f} className="bd-tag purple">{FEAT_OPTS.find(o=>o.v===f)?.name||f}</span>)
                : <span className="bd-empty">не выбраны</span>
              }
            </div>
          </div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">Дизайн</div>
          <div className="bd-row">
            <div className="bd-key">Стиль</div>
            <div className="bd-val">
              {styleChips.length > 0
                ? styleChips.map(s => <span key={s} className="bd-tag">{s}</span>)
                : <span className="bd-empty">не выбран</span>
              }
            </div>
          </div>
          <div className="bd-row"><div className="bd-key">Бренд</div><div className="bd-val">{brandV ? <span className="bd-val filled">{brandLabels[brandV]||brandV}</span> : <span className="bd-empty">не указан</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Референсы</div><div className="bd-val">{refs ? <span className="bd-val filled">{refs}</span> : <span className="bd-empty">не указаны</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">Бюджет и сроки</div>
          <div className="bd-row"><div className="bd-key">Бюджет</div><div className="bd-val">{budget ? <span className="bd-tag">{budgetLabels[budget]||budget}</span> : <span className="bd-empty">не указан</span>}</div></div>
          <div className="bd-row"><div className="bd-key">Сроки</div><div className="bd-val">{timeline} мес.</div></div>
        </div>
      </div>

      <div className="bp-actions">
        <div style={{fontSize:'9px',color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'6px'}}>Доступно после заполнения</div>
        <button className="btn btn-sm btn-outline" disabled>
          <svg width="14" height="14"><use href="#i-download"/></svg> Скачать PDF
        </button>
        <button className="btn btn-sm btn-outline" disabled>
          <svg width="14" height="14"><use href="#i-send"/></svg> Отправить в компанию
        </button>
      </div>
    </div>
  );

  /* ── RENDER ──────────────────────────────────────────────────────── */
  return (
    <div style={{minHeight:'100vh', background:'var(--navy)'}}>
      <BlurOrbs count={2} />
      <TopNav backHref="/" backLabel="← Home" stepIndicator={`Шаг ${step + 1} из 7`} />

      <div className="brief-layout" id="mainLayout">
        {/* WIZARD LEFT */}
        <div className="wizard">
          <Stepper />

          {/* STEP 0 — COMPANY */}
          {step === 0 && (
            <div className="step active">
              <div className="step-num">Шаг 1 — О компании</div>
              <h2 className="step-title">Расскажите<br/>о <em>вашем бизнесе</em></h2>
              <p className="step-hint">Базовая информация для брифа — займёт 30 секунд</p>
              <div className="field-row">
                <div className="field"><label>Название компании *</label><input type="text" value={company} onChange={e=>setCompany(e.target.value)} placeholder="ACME Corp"/></div>
                <div className="field"><label>Сфера деятельности</label><input type="text" value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="Логистика, финтех, retail..."/></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Сайт (если есть)</label><input type="text" value={site} onChange={e=>setSite(e.target.value)} placeholder="https://company.com"/></div>
                <div className="field"><label>Страна / рынок</label><input type="text" value={country} onChange={e=>setCountry(e.target.value)} placeholder="Латвия, ЕС, США..."/></div>
              </div>
              <div className="field"><label>Краткое описание бизнеса</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Чем занимается компания, какие продукты или услуги продаёт..."/></div>
              <div className="actions"><button className="btn btn-primary" onClick={()=>goStep(1)}>Далее →</button></div>
            </div>
          )}

          {/* STEP 1 — TYPE */}
          {step === 1 && (
            <div className="step active">
              <div className="step-num">Шаг 2 — Тип проекта</div>
              <h2 className="step-title">Что нужно<br/><em>создать?</em></h2>
              <p className="step-hint">Выберите формат цифрового продукта</p>
              <div className="opts opts-2">
                {TYPE_OPTS.map(o => (
                  <div key={o.v} className={`opt${typeV===o.v?' sel':''}`} onClick={()=>setTypeV(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-ico"><svg width="20" height="20"><use href={`#${o.ico}`}/></svg></div>
                    <div className="opt-name">{o.name}</div>
                    <div className="opt-sub">{o.sub}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(0)}>← Назад</button>
                <button className="btn btn-primary" onClick={()=>goStep(2)} disabled={!typeV}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — GOAL */}
          {step === 2 && (
            <div className="step active">
              <div className="step-num">Шаг 3 — Цели проекта</div>
              <h2 className="step-title">Какую проблему<br/>нужно <em>решить?</em></h2>
              <p className="step-hint">Чем конкретнее — тем точнее будет оценка</p>
              <div className="field"><label>Главная цель проекта *</label><textarea value={goal} onChange={e=>setGoal(e.target.value)} placeholder="Например: автоматизировать обработку заказов, сократить время на ручную работу с 8 до 1 часа в день..."/></div>
              <div className="field"><label>Текущая «боль» — что не работает сейчас?</label><textarea value={pain} onChange={e=>setPain(e.target.value)} placeholder="Менеджеры тратят 3 часа на Excel, клиенты не получают статус заказа..."/></div>
              <div className="field"><label>Как выглядит успех? (KPI)</label><input type="text" value={kpi} onChange={e=>setKpi(e.target.value)} placeholder="Конверсия +15%, время обработки -60%, 1000 активных пользователей..."/></div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(1)}>← Назад</button>
                <button className="btn btn-primary" onClick={()=>goStep(3)}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — AUDIENCE */}
          {step === 3 && (
            <div className="step active">
              <div className="step-num">Шаг 4 — Аудитория</div>
              <h2 className="step-title">Кто будет<br/><em>пользоваться?</em></h2>
              <p className="step-hint">Понимание аудитории определяет UX и архитектуру</p>
              <div className="field"><label>Основные пользователи</label><input type="text" value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Менеджеры компании, B2B-клиенты, конечные потребители..."/></div>
              <div className="field"><label>Примерное количество пользователей</label></div>
              <div className="range-row">
                <label>Активных пользователей в месяц <span>{usersLabel(users)}</span></label>
                <input
                  type="range" className="brief-range" min="100" max="100000" step="100" value={users}
                  onChange={e=>setUsers(+e.target.value)}
                  style={{'--pct': pct(users, 100, 100000)} as React.CSSProperties}
                />
              </div>
              <div className="field"><label>Особые требования к аудитории</label></div>
              <div className="priorities">
                {AUD_CHIPS.map(c => (
                  <button key={c} className={`chip${audChips.includes(c)?' sel sel-p':''}`} onClick={()=>toggleAudChip(c)}>{c}</button>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(2)}>← Назад</button>
                <button className="btn btn-primary" onClick={()=>goStep(4)}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — FEATURES */}
          {step === 4 && (
            <div className="step active">
              <div className="step-num">Шаг 5 — Функциональность</div>
              <h2 className="step-title">Какие модули<br/><em>нужны?</em></h2>
              <p className="step-hint">Выберите все нужные функции — можно несколько</p>
              <div className="multi-note">* Мультиселект</div>
              <div className="opts opts-3">
                {FEAT_OPTS.map(o => (
                  <div key={o.v} className={`opt${feats.includes(o.v)?' sel':''}`} onClick={()=>toggleFeat(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{o.name}</div>
                    <div className="opt-sub">{o.sub}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(3)}>← Назад</button>
                <button className="btn btn-primary" onClick={()=>goStep(5)}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 5 — DESIGN */}
          {step === 5 && (
            <div className="step active">
              <div className="step-num">Шаг 6 — Дизайн и стиль</div>
              <h2 className="step-title">Как должен<br/><em>выглядеть?</em></h2>
              <p className="step-hint">Визуальный стиль и приоритеты дизайна</p>
              <div className="field"><label>Референсы (сайты, которые нравятся)</label><input type="text" value={refs} onChange={e=>setRefs(e.target.value)} placeholder="apple.com, stripe.com, linear.app..."/></div>
              <div className="field"><label>Стилевые предпочтения</label></div>
              <div className="priorities">
                {STYLE_CHIPS.map(c => (
                  <button key={c} className={`chip${styleChips.includes(c)?' sel sel-p':''}`} onClick={()=>toggleStyleChip(c)}>{c}</button>
                ))}
              </div>
              <div className="field" style={{marginTop:'16px'}}><label>Брендбук / гайдлайны</label></div>
              <div className="opts opts-3">
                {BRAND_OPTS.map(o => (
                  <div key={o.v} className={`opt${brandV===o.v?' sel':''}`} onClick={()=>setBrandV(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{o.name}</div>
                    <div className="opt-sub">{o.sub}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(4)}>← Назад</button>
                <button className="btn btn-primary" onClick={()=>goStep(6)} disabled={!brandV}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 6 — BUDGET */}
          {step === 6 && (
            <div className="step active">
              <div className="step-num">Шаг 7 — Бюджет и сроки</div>
              <h2 className="step-title">Параметры<br/><em>проекта</em></h2>
              <p className="step-hint">Финальный шаг — и ваш ТЗ-бриф готов</p>
              <div className="field"><label>Ориентировочный бюджет</label></div>
              <div className="opts opts-2" style={{marginBottom:'20px'}}>
                {BUDGET_OPTS.map(o => (
                  <div key={o.v} className={`opt${budget===o.v?' sel':''}`} onClick={()=>setBudget(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{o.name}</div>
                    <div className="opt-sub">{o.sub}</div>
                  </div>
                ))}
              </div>
              <div className="range-row">
                <label>Желаемый срок запуска (месяцев) <span>{timeline} месяца</span></label>
                <input
                  type="range" className="brief-range" min="1" max="18" value={timeline}
                  onChange={e=>setTimeline(+e.target.value)}
                  style={{'--pct': pct(timeline, 1, 18)} as React.CSSProperties}
                />
              </div>
              <div className="field"><label>Дополнительные пожелания</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Особые требования, ограничения, предпочтения по стеку технологий..."/></div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(5)}>← Назад</button>
                <button className="btn btn-primary" onClick={finish} disabled={!budget}>
                  <svg width="16" height="16"><use href="#i-sparkle"/></svg>
                  Сформировать ТЗ-бриф
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIVE PANEL RIGHT */}
        <LivePanel />
      </div>
    </div>
  );
}
