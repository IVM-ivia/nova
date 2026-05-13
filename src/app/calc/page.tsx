'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BlurOrbs from '@/components/layout/BlurOrbs';
import TopNav from '@/components/layout/TopNav';
import { tl, type Lang } from '@/lib/i18n';

/* ── TYPES ── */
interface StepDef { id: string; labelKey: string; multi: boolean; }

/* ── DATA ── */
const TYPES = [
  {val:'web',  icon:'i-web',  nameKey:'calc.t.web.n',  descKey:'calc.t.web.d',  price:4000,  time:6,  priceStr:'from 4 000 £'},
  {val:'app',  icon:'i-app',  nameKey:'calc.t.app.n',  descKey:'calc.t.app.d',  price:12000, time:12, priceStr:'from 12 000 £'},
  {val:'saas', icon:'i-saas', nameKey:'calc.t.saas.n', descKey:'calc.t.saas.d', price:18000, time:16, priceStr:'from 18 000 £'},
  {val:'crm',  icon:'i-crm',  nameKey:'calc.t.crm.n',  descKey:'calc.t.crm.d',  price:15000, time:14, priceStr:'from 15 000 £'},
  {val:'ecom', icon:'i-ecom', nameKey:'calc.t.ecom.n', descKey:'calc.t.ecom.d', price:8000,  time:8,  priceStr:'from 8 000 £'},
  {val:'ai',   icon:'i-ai',   nameKey:'calc.t.ai.n',   descKey:'calc.t.ai.d',   price:22000, time:18, priceStr:'from 22 000 £'},
];
const FEATURES = [
  {val:'auth',      icon:'i-auth',     nameKey:'calc.f.auth',     price:1200},
  {val:'pay',       icon:'i-pay',      nameKey:'calc.f.pay',      price:2000},
  {val:'admin',     icon:'i-admin',    nameKey:'calc.f.admin',    price:1800},
  {val:'api',       icon:'i-api',      nameKey:'calc.f.api',      price:2500},
  {val:'analytics', icon:'i-analytics',nameKey:'calc.f.analytics',price:1500},
  {val:'ai_feat',   icon:'i-ai',       nameKey:'calc.f.ai',       price:4000},
  {val:'notif',     icon:'i-notif',    nameKey:'calc.f.notif',    price:800},
  {val:'chat',      icon:'i-chat',     nameKey:'calc.f.chat',     price:2200},
  {val:'geo',       icon:'i-map',      nameKey:'calc.f.geo',      price:1600},
];
const SCALES = [
  {val:'small',     nameKey:'calc.sc.s.n', descKey:'calc.sc.s.d', mult:1.0, priceStr:'base cost'},
  {val:'medium',    nameKey:'calc.sc.m.n', descKey:'calc.sc.m.d', mult:1.4, priceStr:'×1.4'},
  {val:'enterprise',nameKey:'calc.sc.e.n', descKey:'calc.sc.e.d', mult:2.0, priceStr:'×2.0'},
];
const DESIGNS = [
  {val:'template',nameKey:'calc.d.tmpl.n', descKey:'calc.d.tmpl.d', price:0,    priceStr:'included'},
  {val:'custom',  nameKey:'calc.d.cust.n', descKey:'calc.d.cust.d', price:3500, priceStr:'+3 500 £'},
  {val:'premium', nameKey:'calc.d.prem.n', descKey:'calc.d.prem.d', price:8000, priceStr:'+8 000 £'},
];
const PLATFORMS = [
  {val:'web_only',nameKey:'calc.p.web.n', descKey:'calc.p.web.d', price:0,     priceStr:'included'},
  {val:'pwa',     nameKey:'calc.p.pwa.n', descKey:'calc.p.pwa.d', price:2500,  priceStr:'+2 500 £'},
  {val:'native',  nameKey:'calc.p.nat.n', descKey:'calc.p.nat.d', price:12000, priceStr:'+12 000 £'},
];
const TIMELINES = [
  {val:'asap',   icon:'i-rocket', nameKey:'calc.tl.asap.n', descKey:'calc.tl.asap.d', pricePct:0.3,  timeK:0.7,  priceStr:'+30%'},
  {val:'normal', icon:'i-clock',  nameKey:'calc.tl.norm.n', descKey:'calc.tl.norm.d', pricePct:0,    timeK:1.0,  priceStr:'base'},
  {val:'relaxed',icon:'i-clock',  nameKey:'calc.tl.rlx.n',  descKey:'calc.tl.rlx.d',  pricePct:-0.1, timeK:1.2,  priceStr:'−10%'},
];
const SUPPORTS = [
  {val:'none', nameKey:'calc.su.none.n', descKey:'calc.su.none.d', price:0,   priceStr:'included'},
  {val:'basic',nameKey:'calc.su.bas.n',  descKey:'calc.su.bas.d',  price:300, priceStr:'+300 £/mo'},
  {val:'full', nameKey:'calc.su.full.n', descKey:'calc.su.full.d', price:800, priceStr:'+800 £/mo'},
];

function launchConfetti() {
  const colors = ['#00d9ff','#8b5cf6','#22c55e','#f59e0b','#ffffff'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.5+Math.random()*2}s;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 30);
  }
}

export default function CalcPage() {
  const [lang, setLang]           = useState<Lang>('en');
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState<Record<number, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const STEPS: StepDef[] = [
    {id:'type',     labelKey:'calc.lbl.0', multi:false},
    {id:'features', labelKey:'calc.lbl.1', multi:true},
    {id:'scale',    labelKey:'calc.lbl.2', multi:false},
    {id:'design',   labelKey:'calc.lbl.3', multi:false},
    {id:'platform', labelKey:'calc.lbl.4', multi:false},
    {id:'timeline', labelKey:'calc.lbl.5', multi:false},
    {id:'support',  labelKey:'calc.lbl.6', multi:false},
  ];

  /* ── PRICE CALCULATION ── */
  function calcPrice(ans: Record<number, string[]>): { price: number; weeks: number } {
    let price = 0; let weeks = 0; let scaleMult = 1;
    const t = TYPES.find(x => x.val === (ans[0]?.[0]));
    if (t) { price = t.price; weeks = t.time; }
    (ans[1] || []).forEach(v => { const f = FEATURES.find(x => x.val === v); if (f) price += f.price; });
    const sc = SCALES.find(x => x.val === (ans[2]?.[0]));
    if (sc) { scaleMult = sc.mult; }
    price = Math.round(price * scaleMult);
    const d = DESIGNS.find(x => x.val === (ans[3]?.[0]));
    if (d) price += d.price;
    const pl = PLATFORMS.find(x => x.val === (ans[4]?.[0]));
    if (pl) price += pl.price;
    const timeline = TIMELINES.find(x => x.val === (ans[5]?.[0]));
    if (timeline) { price = Math.round(price * (1 + timeline.pricePct)); weeks = Math.round(weeks * timeline.timeK); }
    return { price, weeks };
  }

  const { price: livePrice, weeks: liveWeeks } = calcPrice(answers);

  useEffect(() => {
    if (animRef.current) clearInterval(animRef.current);
    const start = displayPrice; const diff = livePrice - start; let i = 0; const steps = 30;
    animRef.current = setInterval(() => {
      i++;
      const t = i / steps;
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setDisplayPrice(Math.round(start + diff * ease));
      if (i >= steps) { clearInterval(animRef.current!); setDisplayPrice(livePrice); }
    }, 16);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePrice]);

  const teamSize = liveWeeks > 14 ? '5–8' : liveWeeks > 8 ? '3–5' : '2–3';

  function toggle(stepIdx: number, val: string, isMulti: boolean) {
    setAnswers(prev => {
      const cur = prev[stepIdx] || [];
      if (isMulti) {
        return {...prev, [stepIdx]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]};
      }
      return {...prev, [stepIdx]: [val]};
    });
  }

  function next() { if (step < STEPS.length - 1) setStep(s => s + 1); }
  function prev() { if (step > 0) setStep(s => s - 1); }
  function handleShowResult() { setShowResult(true); launchConfetti(); window.scrollTo({top:0,behavior:'smooth'}); }
  function reset() { setAnswers({}); setStep(0); setShowResult(false); setDisplayPrice(0); }

  const isSelected = (stepIdx: number, val: string) => (answers[stepIdx] || []).includes(val);
  const hasAnswer  = (stepIdx: number) => (answers[stepIdx] || []).length > 0;

  /* ── BUILD BREAKDOWN ── */
  const breakdown: {name: string; price: number}[] = [];
  const t0 = TYPES.find(x => x.val === answers[0]?.[0]);
  if (t0) breakdown.push({name: tl(t0.nameKey, lang), price: t0.price});
  (answers[1] || []).forEach(v => { const f = FEATURES.find(x => x.val === v); if (f) breakdown.push({name: tl(f.nameKey, lang), price: f.price}); });
  const d0 = DESIGNS.find(x => x.val === answers[3]?.[0]);
  if (d0 && d0.price > 0) breakdown.push({name: tl(d0.nameKey, lang), price: d0.price});
  const p0 = PLATFORMS.find(x => x.val === answers[4]?.[0]);
  if (p0 && p0.price > 0) breakdown.push({name: tl(p0.nameKey, lang), price: p0.price});
  const maxBd = Math.max(...breakdown.map(b => b.price), 1);

  const resultMonths = Math.ceil(liveWeeks / 4.3);
  const supp = SUPPORTS.find(x => x.val === answers[6]?.[0]);
  const scaleLabel = SCALES.find(x => x.val === answers[2]?.[0]);

  const fmt = (n: number) => '£' + n.toLocaleString('en-GB');

  /* ── RENDER ── */
  return (
    <>
      <BlurOrbs />
      <div className="page">
        <TopNav
          lang={lang}
          onLangChange={setLang}
          backHref="/"
          backLabel={tl('nav.back', lang)}
        />

        <div className="main">
          {/* HERO */}
          <div className="calc-hero">
            <div className="calc-overline">{tl('calc.over', lang)}</div>
            <h1 className="calc-title">{tl('calc.h1a', lang)}<br /><em>{tl('calc.h1b', lang)}</em></h1>
            <p className="calc-sub">{tl('calc.sub', lang)}</p>
          </div>

          {!showResult && (
            <>
              {/* PROGRESS */}
              <div className="progress-wrap">
                <div className="progress-steps">
                  {STEPS.map((s, i) => (
                    <div key={i} className={`ps-item${i < step ? ' done' : i === step ? ' active' : ''}`}>
                      <div className="ps-dot">
                        {i < step
                          ? <svg width="12" height="12"><use href="#i-check"/></svg>
                          : i + 1}
                      </div>
                      <div className="ps-label">{tl(s.labelKey, lang)}</div>
                    </div>
                  ))}
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{width: `${step / (STEPS.length - 1) * 100}%`}} />
                </div>
              </div>

              {/* TICKER */}
              <div className="price-ticker">
                <div className="pt-left">
                  <div className="pt-label">{tl('calc.ticker.est', lang)}</div>
                  <div className="pt-price">{displayPrice > 0 ? `from ${fmt(displayPrice)}` : 'from £0'}</div>
                </div>
                <div className="pt-right">
                  <div className="pt-meta">
                    <div className="pt-meta-label">{tl('calc.ticker.tl', lang)}</div>
                    <div className="pt-meta-val">{liveWeeks > 0 ? `${liveWeeks} ${tl('calc.wks', lang)}` : '—'}</div>
                  </div>
                  <div className="pt-meta">
                    <div className="pt-meta-label">{tl('calc.ticker.team', lang)}</div>
                    <div className="pt-meta-val">{liveWeeks > 0 ? teamSize : '—'}</div>
                  </div>
                </div>
              </div>

              {/* STEP CARD */}
              <div className="calc-card">
                {/* STEP 0: TYPE */}
                {step === 0 && (
                  <div className="step active">
                    <div className="step-q">Step 1 of 7</div>
                    <div className="step-title">{tl('calc.s0.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s0.h', lang)}</div>
                    <div className="opts opts-3">
                      {TYPES.map(tp => (
                        <div key={tp.val} className={`opt${isSelected(0, tp.val) ? ' selected' : ''}`} onClick={() => toggle(0, tp.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="22" height="22"><use href={`#${tp.icon}`}/></svg></div>
                          <div className="opt-name">{tl(tp.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(tp.descKey, lang)}</div>
                          <div className="opt-price">{tp.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-primary" disabled={!hasAnswer(0)} onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 1: FEATURES */}
                {step === 1 && (
                  <div className="step active">
                    <div className="step-q">Step 2 of 7</div>
                    <div className="step-title">{tl('calc.s1.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s1.h', lang)}</div>
                    <div className="opts opts-4">
                      {FEATURES.map(f => (
                        <div key={f.val} className={`opt${isSelected(1, f.val) ? ' selected' : ''}`} onClick={() => toggle(1, f.val, true)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="20" height="20"><use href={`#${f.icon}`}/></svg></div>
                          <div className="opt-name">{tl(f.nameKey, lang)}</div>
                          <div className="opt-price">+{f.price.toLocaleString('en-GB')} £</div>
                        </div>
                      ))}
                    </div>
                    <div className="multi-hint">{tl('calc.multi', lang)}</div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SCALE */}
                {step === 2 && (
                  <div className="step active">
                    <div className="step-q">Step 3 of 7</div>
                    <div className="step-title">{tl('calc.s2.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s2.h', lang)}</div>
                    <div className="opts opts-3">
                      {SCALES.map(s => (
                        <div key={s.val} className={`opt${isSelected(2, s.val) ? ' selected' : ''}`} onClick={() => toggle(2, s.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{tl(s.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(s.descKey, lang)}</div>
                          <div className="opt-price">{s.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(2)} onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DESIGN */}
                {step === 3 && (
                  <div className="step active">
                    <div className="step-q">Step 4 of 7</div>
                    <div className="step-title">{tl('calc.s3.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s3.h', lang)}</div>
                    <div className="opts opts-3">
                      {DESIGNS.map(d => (
                        <div key={d.val} className={`opt${isSelected(3, d.val) ? ' selected' : ''}`} onClick={() => toggle(3, d.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{tl(d.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(d.descKey, lang)}</div>
                          <div className="opt-price">{d.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(3)} onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 4: PLATFORM */}
                {step === 4 && (
                  <div className="step active">
                    <div className="step-q">Step 5 of 7</div>
                    <div className="step-title">{tl('calc.s4.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s4.h', lang)}</div>
                    <div className="opts opts-3">
                      {PLATFORMS.map(p => (
                        <div key={p.val} className={`opt${isSelected(4, p.val) ? ' selected' : ''}`} onClick={() => toggle(4, p.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{tl(p.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(p.descKey, lang)}</div>
                          <div className="opt-price">{p.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(4)} onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 5: TIMELINE */}
                {step === 5 && (
                  <div className="step active">
                    <div className="step-q">Step 6 of 7</div>
                    <div className="step-title">{tl('calc.s5.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s5.h', lang)}</div>
                    <div className="opts opts-3">
                      {TIMELINES.map(tl_ => (
                        <div key={tl_.val} className={`opt${isSelected(5, tl_.val) ? ' selected' : ''}`} onClick={() => toggle(5, tl_.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="20" height="20"><use href={`#${tl_.icon}`}/></svg></div>
                          <div className="opt-name">{tl(tl_.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(tl_.descKey, lang)}</div>
                          <div className="opt-price">{tl_.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(5)} onClick={next}>{tl('calc.btn.next', lang)}</button>
                    </div>
                  </div>
                )}

                {/* STEP 6: SUPPORT */}
                {step === 6 && (
                  <div className="step active">
                    <div className="step-q">Step 7 of 7</div>
                    <div className="step-title">{tl('calc.s6.t', lang)}</div>
                    <div className="step-hint">{tl('calc.s6.h', lang)}</div>
                    <div className="opts opts-3">
                      {SUPPORTS.map(s => (
                        <div key={s.val} className={`opt${isSelected(6, s.val) ? ' selected' : ''}`} onClick={() => toggle(6, s.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{tl(s.nameKey, lang)}</div>
                          <div className="opt-desc">{tl(s.descKey, lang)}</div>
                          <div className="opt-price">{s.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>{tl('calc.btn.back', lang)}</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(6)} onClick={handleShowResult}>{tl('calc.btn.getEst', lang)}</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* RESULT SCREEN */}
          {showResult && (
            <div className="result-screen show">
              <div className="result-hero">
                <div className="result-badge"><svg width="14" height="14"><use href="#i-check"/></svg> {tl('calc.res.badge', lang)}</div>
                <div className="result-price">{fmt(livePrice)}</div>
                <div className="result-price-note">{tl('calc.res.note', lang)}</div>
              </div>
              <div className="result-grid">
                <div className="result-card">
                  <div className="rc-label">{tl('calc.res.devtime', lang)}</div>
                  <div className="rc-value">{liveWeeks} {tl('calc.res.weeks', lang)}</div>
                  <div className="rc-sub">~{resultMonths} {tl('calc.res.months', lang)}</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">{tl('calc.res.team', lang)}</div>
                  <div className="rc-value">{teamSize}</div>
                  <div className="rc-sub">{tl('calc.res.spec', lang)}</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">{tl('calc.res.support', lang)}</div>
                  <div className="rc-value">{supp?.priceStr ?? '—'}</div>
                  <div className="rc-sub">{tl('calc.res.monthly', lang)}</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">{tl('calc.res.scale', lang)}</div>
                  <div className="rc-value">{scaleLabel ? tl(scaleLabel.nameKey, lang) : '—'}</div>
                  <div className="rc-sub">{tl('calc.res.load', lang)}</div>
                </div>
              </div>
              <div className="breakdown">
                <div className="bd-title">{tl('calc.res.break', lang)}</div>
                {breakdown.filter(b => b.price > 0).map((b, i) => (
                  <div className="bd-row" key={i}>
                    <div className="bd-name">{b.name}</div>
                    <div className="bd-bar-wrap"><div className="bd-bar" style={{width:`${Math.round(b.price/maxBd*100)}%`}} /></div>
                    <div className="bd-price">{fmt(b.price)}</div>
                  </div>
                ))}
              </div>
              <div className="result-cta">
                <Link href="/" className="btn btn-primary">
                  <svg width="16" height="16"><use href="#i-send"/></svg>
                  {tl('calc.res.discuss', lang)}
                </Link>
                <button className="btn btn-secondary" onClick={reset}>
                  <svg width="16" height="16"><use href="#i-refresh"/></svg>
                  {tl('calc.res.recalc', lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
