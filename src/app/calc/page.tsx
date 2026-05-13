'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BlurOrbs from '@/components/layout/BlurOrbs';

/* ── TYPES ── */
interface StepDef { id: string; label: string; multi: boolean; }
const STEPS: StepDef[] = [
  {id:'type',     label:'Type',     multi:false},
  {id:'features', label:'Features', multi:true},
  {id:'scale',    label:'Scale',    multi:false},
  {id:'design',   label:'Design',   multi:false},
  {id:'platform', label:'Platform', multi:false},
  {id:'timeline', label:'Timeline', multi:false},
  {id:'support',  label:'Support',  multi:false},
];

/* ── DATA ── */
const TYPES = [
  {val:'web',  icon:'i-web',  name:'Website',          desc:'Corporate site, landing, portal',        price:4000,  time:6,  priceStr:'from 4 000 €'},
  {val:'app',  icon:'i-app',  name:'Mobile App',        desc:'iOS, Android or cross-platform',         price:12000, time:12, priceStr:'from 12 000 €'},
  {val:'saas', icon:'i-saas', name:'SaaS Platform',     desc:'Web app with subscriptions & dashboard', price:18000, time:16, priceStr:'from 18 000 €'},
  {val:'crm',  icon:'i-crm',  name:'CRM / ERP',         desc:'Corporate management system',           price:15000, time:14, priceStr:'from 15 000 €'},
  {val:'ecom', icon:'i-ecom', name:'E-commerce',        desc:'Online store with catalog & payments',  price:8000,  time:8,  priceStr:'from 8 000 €'},
  {val:'ai',   icon:'i-ai',   name:'AI Product',        desc:'Platform with AI/ML integration',       price:22000, time:18, priceStr:'from 22 000 €'},
];
const FEATURES = [
  {val:'auth',      icon:'i-auth',     name:'Auth',         price:1200},
  {val:'pay',       icon:'i-pay',      name:'Payments',     price:2000},
  {val:'admin',     icon:'i-admin',    name:'Admin Panel',  price:1800},
  {val:'api',       icon:'i-api',      name:'API',          price:2500},
  {val:'analytics', icon:'i-analytics',name:'Analytics',    price:1500},
  {val:'ai_feat',   icon:'i-ai',       name:'AI Features',  price:4000},
  {val:'notif',     icon:'i-notif',    name:'Notifications',price:800},
  {val:'chat',      icon:'i-chat',     name:'Chat',         price:2200},
  {val:'geo',       icon:'i-map',      name:'Maps / Geo',   price:1600},
];
const SCALES   = [{val:'small',     name:'Startup / MVP',   desc:'Up to 1 000 users',     mult:1.0, priceStr:'base cost'},
                  {val:'medium',    name:'Mid-market',      desc:'1 000 – 50 000 users',  mult:1.4, priceStr:'×1.4'},
                  {val:'enterprise',name:'Enterprise',      desc:'50 000+ users',          mult:2.0, priceStr:'×2.0'}];
const DESIGNS  = [{val:'template',name:'Template',  desc:'Ready UI kit, fast',               price:0,    priceStr:'included'},
                  {val:'custom',  name:'Custom',    desc:'Unique brand design',              price:3500, priceStr:'+3 500 €'},
                  {val:'premium', name:'Premium',   desc:'Animations, micro-UX, 3D',         price:8000, priceStr:'+8 000 €'}];
const PLATFORMS= [{val:'web_only',name:'Web only',      desc:'Responsive for all screens',       price:0,    priceStr:'included'},
                  {val:'pwa',     name:'PWA',            desc:'Progressive Web App',              price:2500, priceStr:'+2 500 €'},
                  {val:'native',  name:'Native App',     desc:'Separate iOS & Android apps',      price:12000,priceStr:'+12 000 €'}];
const TIMELINES= [{val:'asap',   icon:'i-rocket', name:'Rush',     desc:'Max team, compressed timeline', pricePct:0.3,  timeK:0.7,  priceStr:'+30%'},
                  {val:'normal', icon:'i-clock',  name:'Standard', desc:'Optimal pace',                  pricePct:0,    timeK:1.0,  priceStr:'base'},
                  {val:'relaxed',icon:'i-clock',  name:'Relaxed',  desc:'Flexible schedule, −10%',       pricePct:-0.1, timeK:1.2,  priceStr:'−10%'}];
const SUPPORTS = [{val:'none', name:'No support', desc:'Dev only, self-managed',      price:0,   priceStr:'included'},
                  {val:'basic',name:'Basic',       desc:'Security updates & bugfixes', price:300, priceStr:'+300 €/mo'},
                  {val:'full', name:'Full 24/7',   desc:'Full support + features',     price:800, priceStr:'+800 €/mo'}];

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
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState<Record<number, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    const tl = TIMELINES.find(x => x.val === (ans[5]?.[0]));
    if (tl) { price = Math.round(price * (1 + tl.pricePct)); weeks = Math.round(weeks * tl.timeK); }
    return { price, weeks };
  }

  const { price: livePrice, weeks: liveWeeks } = calcPrice(answers);

  /* animate live ticker */
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
  if (t0) breakdown.push({name: t0.name, price: t0.price});
  (answers[1] || []).forEach(v => { const f = FEATURES.find(x => x.val === v); if (f) breakdown.push({name: f.name, price: f.price}); });
  const d0 = DESIGNS.find(x => x.val === answers[3]?.[0]);
  if (d0 && d0.price > 0) breakdown.push({name: `Design (${d0.name})`, price: d0.price});
  const p0 = PLATFORMS.find(x => x.val === answers[4]?.[0]);
  if (p0 && p0.price > 0) breakdown.push({name: p0.name, price: p0.price});
  const maxBd = Math.max(...breakdown.map(b => b.price), 1);

  const resultMonths = Math.ceil(liveWeeks / 4.3);
  const supp = SUPPORTS.find(x => x.val === answers[6]?.[0]);
  const scaleLabel = SCALES.find(x => x.val === answers[2]?.[0])?.name ?? '—';

  /* ── RENDER ── */
  return (
    <>
      <BlurOrbs />
      <div className="page">
        <nav className="topnav">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-mark">N</div>
            <span className="nav-logo-text">Invest Nova LG</span>
          </Link>
          <Link href="/" className="nav-back">← Home</Link>
        </nav>

        <div className="main">
          {/* HERO */}
          <div className="calc-hero">
            <div className="calc-overline">Project Builder</div>
            <h1 className="calc-title">Calculate the cost of<br /><em>your project</em></h1>
            <p className="calc-sub">7 questions — get a budget and timeline estimate</p>
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
                      <div className="ps-label">{s.label}</div>
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
                  <div className="pt-label">Estimated cost</div>
                  <div className="pt-price">{displayPrice > 0 ? `from ${displayPrice.toLocaleString('de-DE')} €` : 'from 0 €'}</div>
                </div>
                <div className="pt-right">
                  <div className="pt-meta">
                    <div className="pt-meta-label">Timeline</div>
                    <div className="pt-meta-val">{liveWeeks > 0 ? `${liveWeeks} wks` : '—'}</div>
                  </div>
                  <div className="pt-meta">
                    <div className="pt-meta-label">Team</div>
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
                    <div className="step-title">What to build?</div>
                    <div className="step-hint">Choose project type — it determines the base cost</div>
                    <div className="opts opts-3">
                      {TYPES.map(tp => (
                        <div key={tp.val} className={`opt${isSelected(0, tp.val) ? ' selected' : ''}`} onClick={() => toggle(0, tp.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="22" height="22"><use href={`#${tp.icon}`}/></svg></div>
                          <div className="opt-name">{tp.name}</div>
                          <div className="opt-desc">{tp.desc}</div>
                          <div className="opt-price">{tp.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-primary" disabled={!hasAnswer(0)} onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 1: FEATURES */}
                {step === 1 && (
                  <div className="step active">
                    <div className="step-q">Step 2 of 7</div>
                    <div className="step-title">Which features?</div>
                    <div className="step-hint">Select all needed modules — multiple allowed</div>
                    <div className="opts opts-4">
                      {FEATURES.map(f => (
                        <div key={f.val} className={`opt${isSelected(1, f.val) ? ' selected' : ''}`} onClick={() => toggle(1, f.val, true)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="20" height="20"><use href={`#${f.icon}`}/></svg></div>
                          <div className="opt-name">{f.name}</div>
                          <div className="opt-price">+{f.price.toLocaleString('de-DE')} €</div>
                        </div>
                      ))}
                    </div>
                    <div className="multi-hint">* You can select multiple</div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SCALE */}
                {step === 2 && (
                  <div className="step active">
                    <div className="step-q">Step 3 of 7</div>
                    <div className="step-title">Scale & audience?</div>
                    <div className="step-hint">Affects architecture and load requirements</div>
                    <div className="opts opts-3">
                      {SCALES.map(s => (
                        <div key={s.val} className={`opt${isSelected(2, s.val) ? ' selected' : ''}`} onClick={() => toggle(2, s.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{s.name}</div>
                          <div className="opt-desc">{s.desc}</div>
                          <div className="opt-price">{s.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(2)} onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DESIGN */}
                {step === 3 && (
                  <div className="step active">
                    <div className="step-q">Step 4 of 7</div>
                    <div className="step-title">Design level?</div>
                    <div className="step-hint">How unique should the visual style be</div>
                    <div className="opts opts-3">
                      {DESIGNS.map(d => (
                        <div key={d.val} className={`opt${isSelected(3, d.val) ? ' selected' : ''}`} onClick={() => toggle(3, d.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{d.name}</div>
                          <div className="opt-desc">{d.desc}</div>
                          <div className="opt-price">{d.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(3)} onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 4: PLATFORM */}
                {step === 4 && (
                  <div className="step active">
                    <div className="step-q">Step 5 of 7</div>
                    <div className="step-title">Mobile version?</div>
                    <div className="step-hint">In addition to the main project</div>
                    <div className="opts opts-3">
                      {PLATFORMS.map(p => (
                        <div key={p.val} className={`opt${isSelected(4, p.val) ? ' selected' : ''}`} onClick={() => toggle(4, p.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{p.name}</div>
                          <div className="opt-desc">{p.desc}</div>
                          <div className="opt-price">{p.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(4)} onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 5: TIMELINE */}
                {step === 5 && (
                  <div className="step active">
                    <div className="step-q">Step 6 of 7</div>
                    <div className="step-title">When do you need it?</div>
                    <div className="step-hint">Urgency affects team size and cost</div>
                    <div className="opts opts-3">
                      {TIMELINES.map(tl => (
                        <div key={tl.val} className={`opt${isSelected(5, tl.val) ? ' selected' : ''}`} onClick={() => toggle(5, tl.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-icon"><svg width="20" height="20"><use href={`#${tl.icon}`}/></svg></div>
                          <div className="opt-name">{tl.name}</div>
                          <div className="opt-desc">{tl.desc}</div>
                          <div className="opt-price">{tl.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(5)} onClick={next}>Next →</button>
                    </div>
                  </div>
                )}

                {/* STEP 6: SUPPORT */}
                {step === 6 && (
                  <div className="step active">
                    <div className="step-q">Step 7 of 7</div>
                    <div className="step-title">Post-launch support?</div>
                    <div className="step-hint">Maintenance contract</div>
                    <div className="opts opts-3">
                      {SUPPORTS.map(s => (
                        <div key={s.val} className={`opt${isSelected(6, s.val) ? ' selected' : ''}`} onClick={() => toggle(6, s.val, false)}>
                          <div className="opt-check" />
                          <div className="opt-name">{s.name}</div>
                          <div className="opt-desc">{s.desc}</div>
                          <div className="opt-price">{s.priceStr}</div>
                        </div>
                      ))}
                    </div>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={prev}>← Back</button>
                      <button className="btn btn-primary" disabled={!hasAnswer(6)} onClick={handleShowResult}>Get Estimate →</button>
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
                <div className="result-badge"><svg width="14" height="14"><use href="#i-check"/></svg> Estimate ready</div>
                <div className="result-price">{livePrice.toLocaleString('de-DE')} €</div>
                <div className="result-price-note">Approximate cost · excl. VAT</div>
              </div>
              <div className="result-grid">
                <div className="result-card">
                  <div className="rc-label">Development time</div>
                  <div className="rc-value">{liveWeeks} weeks</div>
                  <div className="rc-sub">~{resultMonths} months</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">Team</div>
                  <div className="rc-value">{teamSize}</div>
                  <div className="rc-sub">specialists on the project</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">Support</div>
                  <div className="rc-value">{supp?.priceStr ?? '—'}</div>
                  <div className="rc-sub">monthly after launch</div>
                </div>
                <div className="result-card">
                  <div className="rc-label">Scale</div>
                  <div className="rc-value">{scaleLabel}</div>
                  <div className="rc-sub">by load & audience</div>
                </div>
              </div>
              <div className="breakdown">
                <div className="bd-title">Cost breakdown</div>
                {breakdown.filter(b => b.price > 0).map((b, i) => (
                  <div className="bd-row" key={i}>
                    <div className="bd-name">{b.name}</div>
                    <div className="bd-bar-wrap"><div className="bd-bar" style={{width:`${Math.round(b.price/maxBd*100)}%`}} /></div>
                    <div className="bd-price">{b.price.toLocaleString('de-DE')} €</div>
                  </div>
                ))}
              </div>
              <div className="result-cta">
                <Link href="/" className="btn btn-primary">
                  <svg width="16" height="16"><use href="#i-send"/></svg>
                  Discuss Project
                </Link>
                <button className="btn btn-secondary" onClick={reset}>
                  <svg width="16" height="16"><use href="#i-refresh"/></svg>
                  Recalculate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
