'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';

/* ── COLOR DATA ──────────────────────────────────────────────────── */
const COLORS = [
  { hex:'#070e1a', name:'Navy',   token:'--navy',   rgb:'7 · 14 · 26',   hsl:'219 · 58 · 6',   note:'AA · 18.3:1', pass:true,   bg:'#070e1a', border:'1px solid var(--card-border)' },
  { hex:'#0a1628', name:'Navy 2', token:'--navy2',  rgb:'10 · 22 · 40',  hsl:'216 · 60 · 10',  note:'Surface · Layer 2', pass:false, bg:'#0a1628', border:'' },
  { hex:'#00d9ff', name:'Cyan',   token:'--cyan',   rgb:'0 · 217 · 255', hsl:'189 · 100 · 50', note:'Primary Accent', pass:false, bg:'#00d9ff', border:'' },
  { hex:'#8b5cf6', name:'Purple', token:'--purple', rgb:'139 · 92 · 246',hsl:'258 · 90 · 66',  note:'Secondary Accent', pass:false, bg:'#8b5cf6', border:'' },
  { hex:'#ffffff', name:'White',  token:'--white',  rgb:'255 · 255 · 255',hsl:'0 · 0 · 100',   note:'Primary Text', pass:false, bg:'#ffffff', border:'' },
  { hex:'#94a3b8', name:'Muted 2',token:'--muted2', rgb:'148 · 163 · 184',hsl:'215 · 20 · 65', note:'Secondary Text', pass:false, bg:'#94a3b8', border:'' },
  { hex:'#22c55e', name:'Green',  token:'--green',  rgb:'34 · 197 · 94', hsl:'142 · 71 · 45',  note:'Success · Positive', pass:false, bg:'#22c55e', border:'' },
  { hex:'#f59e0b', name:'Amber',  token:'--amber',  rgb:'245 · 158 · 11',hsl:'38 · 92 · 50',   note:'Warning · Attention', pass:false, bg:'#f59e0b', border:'' },
] as const;

const TYPE_SCALE = [
  { cls:'type-h1', sample:<>Hero / <em>Display</em></>, spec:{size:'clamp(50px,7vw,90px)', weight:'200', spacing:'-0.03em', use:'Hero title, landing H1'} },
  { cls:'type-h2', sample:<>Section <em>Heading</em></>, spec:{size:'clamp(38px,5vw,64px)', weight:'200', spacing:'-0.025em', use:'Section title, slide H2'} },
  { cls:'type-h3', sample:<>Card Title</>, spec:{size:'28px', weight:'300', spacing:'-0.015em', use:'Card heading, feature title'} },
  { cls:'type-lead', sample:'Lead paragraph text with clarity', spec:{size:'17px', weight:'300', spacing:'normal', use:'Hero sub, intro paragraph'} },
  { cls:'type-body',  sample:'Body text for readable paragraphs', spec:{size:'14px', weight:'400', spacing:'normal', use:'General body copy'} },
  { cls:'type-overline', sample:'OVERLINE LABEL', spec:{size:'10px', weight:'500', spacing:'0.25em', use:'Section labels, tags'} },
  { cls:'type-mono', sample:'font-family: "Inter"', spec:{size:'12px', weight:'400', spacing:'0.04em', use:'Code, tokens, monospace data'} },
] as const;

const ICONS_LIST = [
  'ico-home','ico-about','ico-services','ico-tech','ico-process','ico-roi',
  'ico-contact','ico-globe','ico-gear','ico-mobile','ico-ai','ico-cloud',
  'ico-phone','ico-pin','i-web','i-saas','i-mobile','i-auth',
  'i-check','i-send','i-refresh','i-rocket','i-grid','i-task',
  'i-time','i-file','i-bell','i-link','i-eye','i-shield',
  'i-building','i-target','i-users','i-layers','i-palette','i-plug',
] as const;

const VOICE = [
  { n:'01', title:'Прямо и <em>по делу</em>', desc:'Без маркетинговых лозунгов. Мы говорим что делаем, и делаем что говорим. Никаких «революционных экосистем».' },
  { n:'02', title:'Технически <em>грамотно</em>', desc:'Аудитория — предприниматели и технари. Можно и нужно говорить о стеке, архитектуре и метриках.' },
  { n:'03', title:'Уверенно, но без <em>хвастовства</em>', desc:'Портфолио говорит за нас. Числа и факты — вместо прилагательных «лучший» и «инновационный».' },
  { n:'04', title:'По-человечески <em>понятно</em>', desc:'Клиент не должен чувствовать себя глупым. Сложное — просто. Но не упрощённо.' },
] as const;

const PAIR_ROWS = [
  { good:'Мы автоматизируем обработку заказов — вместо Excel ваш отдел продаж работает в реальном времени.', bad:'Мы предоставляем инновационные решения для цифровой трансформации вашего бизнеса.' },
  { good:'Запуск MVP за 6 недель: дизайн + API + деплой.', bad:'Мы помогаем компаниям достичь новых высот в digital-пространстве.' },
] as const;

/* ── COMPONENT ──────────────────────────────────────────────────── */
export default function BrandbookPage() {
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const copyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setToast(`Скопировано: ${hex.toUpperCase()}`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  return (
    <div style={{minHeight:'100vh', background:'var(--navy)', position:'relative'}}>
      {/* BG ORBS */}
      <div className="orb" style={{width:'700px',height:'700px',background:'rgba(0,217,255,0.06)',top:'-250px',right:'-100px'}} />
      <div className="orb" style={{width:'600px',height:'600px',background:'rgba(139,92,246,0.08)',bottom:'-150px',left:'10%'}} />
      <div className="orb" style={{width:'500px',height:'500px',background:'rgba(0,217,255,0.04)',top:'40%',left:'-150px'}} />
      <div className="orb" style={{width:'480px',height:'480px',background:'rgba(139,92,246,0.05)',top:'70%',right:'-120px'}} />

      {/* TOP NAV */}
      <nav className="topnav" style={{justifyContent:'space-between'}}>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">N</div>
          <div>
            <div className="nav-logo-text">Invest Nova LG</div>
            <div className="nav-logo-sub">Brand Guidelines · v1.0</div>
          </div>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'10px',color:'var(--muted2)',letterSpacing:'.18em',textTransform:'uppercase'}}>
          <span className="bp-live-dot" style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--cyan)',boxShadow:'0 0 10px var(--cyan)',animation:'blink 1.6s ease-in-out infinite'}} />
          <span>Brandbook · 2026 Edition</span>
        </div>
        <Link href="/" className="nav-back">← На главную</Link>
      </nav>

      {/* PAGE */}
      <main className="bb-page">

        {/* HERO */}
        <section className="bb-hero">
          <div>
            <div className="bb-hero-meta">
              <span className="bb-hero-meta-dot" />
              <span>Brandbook · Edition 2026</span>
            </div>
            <h1 className="bb-h1">Бренд&#8209;<br/>система<br/><em>Invest Nova</em></h1>
            <p className="bb-lead">Внутренний документ, фиксирующий визуальный язык, тональность и правила применения бренда Invest Nova LG — от логотипа и палитры до микро‑анимаций и текста.</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {['Identity','Visual System','Components','Voice & Tone','Motion'].map((t,i) => (
                <span key={t} className={`bb-htag${i===0?' c':i===1?' p':''}`}>{t}</span>
              ))}
            </div>
          </div>
          <div className="bb-hero-visual">
            <div className="hero-logo-stage">
              <div className="hl-ring hl-ring-1" />
              <div className="hl-ring hl-ring-2" />
              <div className="hl-ring hl-ring-3" />
              <div className="hl-glow" />
              <div className="hl-mark">N</div>
              <div className="hl-orbit" />
              <div className="hl-orbit p" />
            </div>
          </div>
        </section>

        {/* 01 — PHILOSOPHY */}
        <section className="bb-sec" id="philosophy">
          <div className="bb-overline">01 / Identity</div>
          <h2 className="bb-h2">Имя как <em>декларация</em></h2>
          <p className="bb-body-lead">«Invest Nova» — это инвестиции в новое: в технологии, людей и идеи. Суффикс «LG» обозначает юридическую форму компании и одновременно остаётся графической константой.</p>

          <div className="philo-grid">
            {[
              { n:'01 / NAME',    title:'Invest Nova', sub:'От лат. nova — новое. Мы инвестируем в новую эру цифровых решений: AI, облака, продукты, которые меняют отрасли.', grad:false },
              { n:'02 / SUFFIX',  title:'LG',          sub:'Корпоративный суффикс компании в Латвии. Не сокращается, всегда стоит в конце — как печать ответственности.', grad:false },
              { n:'03 / ESSENCE', title:'Новая эра',   sub:'Бренд — про технологическую зрелость без громких лозунгов. Спокойный язык. Точный результат.', grad:true },
            ].map(c => (
              <div key={c.n} className="philo-card">
                <div className="philo-num">{c.n}</div>
                <div className={`philo-title${c.grad?' grad':''}`}>{c.title}</div>
                <div className="philo-text">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="philo-row">
            <div className="philo-block">
              <div className="philo-block-label">Миссия</div>
              <div className="philo-block-text">Превращать сложные бизнес‑процессы в <em>надёжные цифровые системы</em>, которые работают тихо, быстро и без сюрпризов.</div>
            </div>
            <div className="philo-block">
              <div className="philo-block-label">Видение</div>
              <div className="philo-block-text">Стать <em>европейским технологическим партнёром</em>, чьи решения становятся стандартом отрасли — от Балтики до Атлантики.</div>
            </div>
          </div>

          <div className="philo-grid" style={{marginTop:'24px'}}>
            {[
              { n:'VALUE / 01', t:'Точность',         d:'Каждая строка кода, каждая линия дизайна — намеренная. Никакого декоративного шума.' },
              { n:'VALUE / 02', t:'Доверие',          d:'Прозрачные процессы, прогнозируемые сроки, открытые отчёты. Клиент видит всё.' },
              { n:'VALUE / 03', t:'Скорость',         d:'Короткие итерации, быстрая обратная связь. Мы запускаем, а не пишем презентации.' },
              { n:'VALUE / 04', t:'Технологичность',  d:'Современный стек, AI‑first подход, чистая инженерия. Без устаревших шорткатов.' },
            ].map(c => (
              <div key={c.n} className="philo-card">
                <div className="philo-num">{c.n}</div>
                <div className="philo-title">{c.t}</div>
                <div className="philo-text">{c.d}</div>
              </div>
            ))}
          </div>

          <div className="geo-strip">
            <div className="geo-ico"><svg width="22" height="22"><use href="#i-pin"/></svg></div>
            <div className="geo-text">
              <div className="geo-label">Headquarters</div>
              <div className="geo-value">Рига, Латвия · Европейский Союз</div>
            </div>
            <div className="geo-text" style={{textAlign:'right'}}>
              <div className="geo-label">Coordinates</div>
              <div className="geo-coords">56.9496° N · 24.1052° E</div>
            </div>
          </div>
        </section>

        {/* 02 — LOGO */}
        <section className="bb-sec" id="logo">
          <div className="bb-overline">02 / Logo</div>
          <h2 className="bb-h2">Знак &amp; <em>словесная марка</em></h2>
          <p className="bb-body-lead">Логотип состоит из квадратной марки с буквой N и словесной части. Марка — это якорь бренда, словесная часть — его голос.</p>

          <div className="logo-showcase">
            <div className="big-lockup">
              <div className="bl-mark">N</div>
              <div className="bl-words">
                <div className="bl-name">Invest Nova</div>
                <div className="bl-sub">LG · IT Solutions · LTD</div>
              </div>
            </div>
          </div>

          <div className="logo-variants">
            {[
              { label:'Full Lockup', content:<div className="lv-mini-lockup"><div className="lv-mini-mark">N</div><div className="lv-mini-name">Invest Nova LG</div></div>, extra:'' },
              { label:'Mark Only',  content:<div className="lv-mark-sm">N</div>, extra:'' },
              { label:'Mono · Light', content:<div className="lv-mark-sm mono-w">N</div>, extra:' dark' },
              { label:'Mono · Dark',  content:<div className="lv-mini-lockup"><div className="lv-mini-mark" style={{background:'var(--navy)'}}>N</div><div className="lv-mini-name dk">Invest Nova LG</div></div>, extra:' light' },
              { label:'Inverted',     content:<div className="lv-mark-sm inv">N</div>, extra:'' },
            ].map(v => (
              <div key={v.label} className={`lv${v.extra}`}>
                <div className="lv-canvas">{v.content}</div>
                <div className="lv-label">{v.label}</div>
              </div>
            ))}
          </div>

          <div className="logo-rules">
            <div className="lr-card">
              <div className="lr-title">Safe Zone · Clear Space</div>
              <div className="lr-desc">Минимальный отступ вокруг знака равен 1× ширины буквы N. Внутри этой зоны не должно быть текста, изображений или других элементов.</div>
              <div className="safe-canvas">
                <div className="safe-frame">
                  <div className="safe-inner">N</div>
                  <div className="safe-label-x safe-label-top">1X</div>
                  <div className="safe-label-x safe-label-side">1X</div>
                </div>
              </div>
            </div>
            <div className="lr-card">
              <div className="lr-title">Minimum Size</div>
              <div className="lr-desc">Минимальный допустимый размер знака — 16×16 px на экране и 6 мм в печати. Меньше — теряется читабельность буквы.</div>
              <div className="min-canvas">
                {[
                  { cls:'a', size:'8px',  ok:false },
                  { cls:'b', size:'16px', ok:true, min:true },
                  { cls:'c', size:'32px', ok:false },
                  { cls:'d ok', size:'56px', ok:false },
                ].map(m => (
                  <div key={m.size} className="min-item">
                    <div className={`min-mark ${m.cls}`}>N</div>
                    <div className={`min-label${m.ok?' ok':!m.min&&m.cls==='a'?' no':''}`}>
                      {m.size} {m.min ? <b>min</b> : m.cls==='a' ? <b>×</b> : <b>{m.size}</b>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lr-title" style={{marginBottom:'14px'}}>Запрещённые использования</div>
          <div className="donts">
            {[
              { mark:'stretched', label:'Не растягивайте' },
              { mark:'rotated',   label:'Не вращайте' },
              { mark:'recolored', label:'Не меняйте цвет' },
              { mark:'',          label:'Не на пёстром фоне', busy:true },
              { mark:'outlined',  label:'Без контура' },
              { mark:'shadow-bad',label:'Без тяжёлых теней' },
            ].map(d => (
              <div key={d.label} className="dont">
                <div className="dont-cross">×</div>
                <div className={`dont-stage${d.busy?' busy':''}`}>
                  <div className={`dont-mark${d.mark?' '+d.mark:''}`}>N</div>
                </div>
                <div className="dont-label">{d.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 — COLOR */}
        <section className="bb-sec" id="color">
          <div className="bb-overline">03 / Color</div>
          <h2 className="bb-h2">Палитра <em>глубины</em></h2>
          <p className="bb-body-lead">Бренд живёт в тёмном пространстве. Глубокие синие оттенки задают фон, циан и пурпур работают как акценты. Кликните по образцу — HEX скопируется.</p>

          <div className="color-grid">
            {COLORS.map(c => (
              <div key={c.hex} className="swatch" onClick={()=>copyHex(c.hex)}>
                <div className="swatch-color" style={{background:c.bg, ...(c.border?{borderBottom:c.border}:{})}} />
                <div className="swatch-meta">
                  <div className="swatch-name">{c.name} <span className="swatch-token">{c.token}</span></div>
                  <div className="swatch-row"><span>HEX</span><span>{c.hex.toUpperCase()}</span></div>
                  <div className="swatch-row"><span>RGB</span><span>{c.rgb}</span></div>
                  <div className="swatch-row"><span>HSL</span><span>{c.hsl}</span></div>
                  <div className="swatch-contrast" style={{marginTop:'10px',padding:'8px 12px',borderRadius:'8px',fontSize:'11px',background:'rgba(255,255,255,0.03)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    {c.note}
                    {c.pass && <span style={{color:'var(--green)'}}>PASS</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grad-block">
            <div className="grad-bar" />
            <div>
              <div className="grad-info-title">Основной градиент</div>
              <div className="grad-info-name">Nova <em>Gradient</em></div>
              <div className="grad-code">linear-gradient(<br/>  135deg,<br/>  #00d9ff 0%,<br/>  #8b5cf6 100%<br/>)</div>
              <div className="grad-stops">
                <div className="grad-stop">
                  <div className="grad-stop-label">Start</div>
                  <div className="grad-stop-val" style={{color:'var(--cyan)'}}>Cyan</div>
                </div>
                <div className="grad-stop">
                  <div className="grad-stop-label">End</div>
                  <div className="grad-stop-val" style={{color:'#a78bfa'}}>Purple</div>
                </div>
                <div className="grad-stop">
                  <div className="grad-stop-label">Angle</div>
                  <div className="grad-stop-val">135°</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — TYPOGRAPHY */}
        <section className="bb-sec" id="typography">
          <div className="bb-overline">04 / Typography</div>
          <h2 className="bb-h2">Шрифтовая <em>система</em></h2>
          <p className="bb-body-lead">Единственный шрифт — Inter. Он точен, нейтрален, читаем на любом размере. Иерархия строится через размер и вес, а не через разные гарнитуры.</p>

          <div className="type-list">
            {TYPE_SCALE.map(t => (
              <div key={t.cls} className="type-row">
                <div className={`type-sample ${t.cls}`}>{typeof t.sample === 'string' ? t.sample : t.sample}</div>
                <div className="type-spec">
                  <div className="type-spec-row"><span>Size</span><b>{t.spec.size}</b></div>
                  <div className="type-spec-row"><span>Weight</span><b>{t.spec.weight}</b></div>
                  <div className="type-spec-row"><span>Tracking</span><b>{t.spec.spacing}</b></div>
                  <div className="type-spec-row"><span>Usage</span><b>{t.spec.use}</b></div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-meta">
            {[
              { w:'Aa', label:'Weight', val:'200–700' },
              { w:<span style={{fontWeight:200}}>Aa</span>, label:'Light', val:'200 · Display' },
              { w:<span style={{fontWeight:400}}>Aa</span>, label:'Regular', val:'400 · Body' },
              { w:<span style={{fontWeight:700}}>Aa</span>, label:'Bold', val:'700 · UI Labels' },
            ].map((f,i) => (
              <div key={i} className="font-card">
                <div className="font-card-w">{f.w}</div>
                <div className="font-card-label">{f.label}</div>
                <div className="font-card-val">{f.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 05 — ICONOGRAPHY */}
        <section className="bb-sec" id="icons">
          <div className="bb-overline">05 / Iconography</div>
          <h2 className="bb-h2">Иконки &amp; <em>символы</em></h2>
          <p className="bb-body-lead">SVG-спрайт со stroke-иконками. Размер 24×24 px, stroke-width 1.5–2. Цвет наследуется через currentColor. Не заменяйте на другие библиотеки.</p>

          <div className="icon-grid">
            {ICONS_LIST.map(id => (
              <div key={id} className="ic-cell">
                <svg width="28" height="28"><use href={`#${id}`}/></svg>
                <div className="ic-name">{id.replace(/^i[co]-?/,'')}</div>
              </div>
            ))}
          </div>

          <div className="ic-rules">
            {[
              { n:'18', label:'Inline / UI', desc:'Для кнопок, навигации, тегов — 14–18 px, aligned baseline.' },
              { n:'24', label:'Card / Feature', desc:'Основной размер для иконок в карточках и функциях.' },
              { n:'28+', label:'Hero / Section', desc:'Увеличенные акценты в героях и секциях — 28–44 px.' },
            ].map(r => (
              <div key={r.n} className="icr-card">
                <div className="icr-num">{r.n}px</div>
                <div className="icr-label">{r.label}</div>
                <div className="icr-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 06 — MOTION */}
        <section className="bb-sec" id="motion">
          <div className="bb-overline">06 / Motion</div>
          <h2 className="bb-h2">Язык <em>движения</em></h2>
          <p className="bb-body-lead">Анимации — не украшение, а способ передать состояние. Каждая анимация имеет смысл: sphere-pulse сигнализирует о жизни, ring-spin — о технологичности.</p>

          <div className="motion-grid">
            <div className="mo-card">
              <div className="mo-stage orb-stage">
                <div className="mo-glass">Glass morphism</div>
              </div>
              <div className="mo-title">Blur + Orb</div>
              <div className="mo-desc">Размытые орбы на фоне создают глубину. backdrop-filter: blur() для карточек и навигации.</div>
              <div className="mo-code">backdrop-filter: blur(28px)</div>
            </div>
            <div className="mo-card">
              <div className="mo-stage" style={{gap:'12px',flexDirection:'column'}}>
                <div className="mo-sphere" />
              </div>
              <div className="mo-title">Sphere Pulse</div>
              <div className="mo-desc">Живая пульсация. Используется в герое, технологической секции. 4s ease-in-out infinite.</div>
              <div className="mo-code">animation: sphere-pulse 4s ease-in-out infinite</div>
            </div>
            <div className="mo-card">
              <div className="mo-stage">
                <div className="mo-ring-wrap">
                  <div className="mo-ring" />
                  <div className="mo-ring in" />
                </div>
              </div>
              <div className="mo-title">Ring Spin</div>
              <div className="mo-desc">Вращающиеся орбиты демонстрируют технологичность. Два кольца в разных направлениях.</div>
              <div className="mo-code">animation: ring-spin linear infinite</div>
            </div>
            <div className="mo-card">
              <div className="mo-stage">
                <div className="mo-float-card">+127% ROI</div>
              </div>
              <div className="mo-title">Float</div>
              <div className="mo-desc">Лёгкое покачивание для floating-карточек. translateY 0–10px, 2.8s alternate.</div>
              <div className="mo-code">animation: float 2.8s ease-in-out infinite alternate</div>
            </div>
            <div className="mo-card">
              <div className="mo-stage" style={{flexDirection:'column',gap:'8px'}}>
                <div className="mo-shimmer" />
                <div className="mo-shimmer" style={{width:'60%'}} />
                <div className="mo-shimmer" style={{width:'40%'}} />
              </div>
              <div className="mo-title">Shimmer</div>
              <div className="mo-desc">Skeleton loading. Горизонтальное движение светового бликa. 1.8s linear infinite.</div>
              <div className="mo-code">animation: shimmer 1.8s linear infinite</div>
            </div>
            <div className="mo-card">
              <div className="mo-stage">
                <div className="mo-blink-dot" />
              </div>
              <div className="mo-title">Blink / Live</div>
              <div className="mo-desc">Пульсирующая точка — индикатор «в эфире». opacity 1→0.3→1, 1.4s ease-in-out.</div>
              <div className="mo-code">animation: blink 1.4s ease-in-out infinite</div>
            </div>
          </div>
        </section>

        {/* 07 — VOICE */}
        <section className="bb-sec" id="voice">
          <div className="bb-overline">07 / Voice &amp; Tone</div>
          <h2 className="bb-h2">Голос <em>бренда</em></h2>
          <p className="bb-body-lead">Как мы говорим — такими нас воспринимают. Тон бренда: уверенный, прямой, технически грамотный и человечный одновременно.</p>

          <div className="voice-list">
            {VOICE.map(v => (
              <div key={v.n} className="voice-card">
                <div className="voice-num">{v.n}</div>
                <div className="voice-body">
                  <div className="voice-title" dangerouslySetInnerHTML={{__html:v.title}} />
                  <div className="voice-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pairs">
            {PAIR_ROWS.map((p, i) => (
              <div key={i} className="pair-row">
                <div className="pair-cell good">
                  <div className="pair-tag">✓ Правильно</div>
                  <div className="pair-text">{p.good}</div>
                </div>
                <div className="pair-cell bad">
                  <div className="pair-tag">✗ Избегать</div>
                  <div className="pair-text">{p.bad}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 08 — DOWNLOAD */}
        <section className="bb-sec" id="download">
          <div className="dl-block">
            <div className="dl-inner">
              <div>
                <div className="dl-h">Скачать<br/><em>ресурсы</em></div>
                <div className="dl-text">Логотипы в SVG и PNG, Figma-файл с компонентами, шрифтовые файлы и гайд в PDF. Для внутреннего и партнёрского использования.</div>
              </div>
              <div className="dl-buttons">
                {[
                  { name:'Логотипы · SVG/PNG', sub:'Все варианты и форматы', size:'2.4 MB', ico:'i-download' },
                  { name:'Figma Kit',           sub:'Компоненты и переменные',  size:'8.1 MB', ico:'i-figma' },
                  { name:'Brandbook · PDF',     sub:'Этот документ в PDF',      size:'4.6 MB', ico:'i-pdf' },
                  { name:'Archive · ZIP',       sub:'Все файлы в одном',        size:'14.8 MB', ico:'i-archive' },
                ].map(b => (
                  <a key={b.name} href="#" className="dl-btn" onClick={e=>e.preventDefault()}>
                    <div className="dl-btn-ico"><svg width="18" height="18"><use href={`#${b.ico}`}/></svg></div>
                    <div className="dl-btn-info">
                      <div className="dl-btn-name">{b.name}</div>
                      <div className="dl-btn-sub">{b.sub}</div>
                    </div>
                    <div className="dl-btn-size">{b.size}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="foot">
          <div className="foot-left">
            <div className="foot-mark">N</div>
            <div>
              <div className="foot-name">Invest Nova LG</div>
              <div className="foot-meta">IT Solutions · LTD · Riga, Latvia</div>
            </div>
          </div>
          <div className="foot-version">Brandbook v1.0 · 2026 Edition</div>
        </div>

      </main>

      {/* TOAST */}
      <div id="toast" className={toastVisible ? 'show' : ''} style={{
        position:'fixed', bottom:'30px', left:'50%',
        transform:`translateX(-50%) translateY(${toastVisible?'0':'20px'})`,
        padding:'12px 22px', borderRadius:'100px',
        background:'rgba(7,14,26,0.92)', border:'1px solid rgba(0,217,255,0.3)',
        backdropFilter:'blur(20px)', fontSize:'11px', letterSpacing:'.1em',
        textTransform:'uppercase', color:'var(--cyan)', fontWeight:500,
        boxShadow:'0 8px 40px rgba(0,217,255,0.15)',
        opacity: toastVisible ? 1 : 0,
        pointerEvents:'none',
        transition:'all 0.4s cubic-bezier(0.77,0,0.175,1)',
        zIndex: 9000,
      }}>
        {toast}
      </div>
    </div>
  );
}
