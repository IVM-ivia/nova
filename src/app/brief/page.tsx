'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';
import BlurOrbs from '@/components/layout/BlurOrbs';
import { tl, type Lang } from '@/lib/i18n';

/* ── DATA ──────────────────────────────────────────────────────────── */
const TYPE_OPTS = [
  { v:'website', nameKey:'br.type.web.n', subKey:'br.type.web.s', ico:'i-web' },
  { v:'webapp',  nameKey:'br.type.app.n', subKey:'br.type.app.s', ico:'i-saas' },
  { v:'mobile',  nameKey:'br.type.mob.n', subKey:'br.type.mob.s', ico:'i-mobile' },
  { v:'both',    nameKey:'br.type.both.n',subKey:'br.type.both.s',ico:'i-both' },
] as const;

const BRAND_OPTS = [
  { v:'yes',     nameKey:'br.brand.yes.n', subKey:'br.brand.yes.s' },
  { v:'partial', nameKey:'br.brand.part.n',subKey:'br.brand.part.s' },
  { v:'no',      nameKey:'br.brand.no.n',  subKey:'br.brand.no.s' },
] as const;

const BUDGET_OPTS = [
  { v:'5-15k',   nameKey:'br.bud.s.n', subKey:'br.bud.s.s' },
  { v:'15-40k',  nameKey:'br.bud.m.n', subKey:'br.bud.m.s' },
  { v:'40-100k', nameKey:'br.bud.l.n', subKey:'br.bud.l.s' },
  { v:'100k+',   nameKey:'br.bud.xl.n',subKey:'br.bud.xl.s' },
] as const;

const FEAT_OPTS = [
  { v:'auth',          nameKey:'br.feat.auth.n', subKey:'br.feat.auth.s' },
  { v:'dashboard',     nameKey:'br.feat.dash.n', subKey:'br.feat.dash.s' },
  { v:'payment',       nameKey:'br.feat.pay.n',  subKey:'br.feat.pay.s' },
  { v:'notifications', nameKey:'br.feat.notif.n',subKey:'br.feat.notif.s' },
  { v:'search',        nameKey:'br.feat.srch.n', subKey:'br.feat.srch.s' },
  { v:'chat',          nameKey:'br.feat.chat.n', subKey:'br.feat.chat.s' },
  { v:'admin',         nameKey:'br.feat.adm.n',  subKey:'br.feat.adm.s' },
  { v:'api',           nameKey:'br.feat.api.n',  subKey:'br.feat.api.s' },
  { v:'ai',            nameKey:'br.feat.ai.n',   subKey:'br.feat.ai.s' },
  { v:'geo',           nameKey:'br.feat.geo.n',  subKey:'br.feat.geo.s' },
  { v:'report',        nameKey:'br.feat.rep.n',  subKey:'br.feat.rep.s' },
  { v:'cms',           nameKey:'br.feat.cms.n',  subKey:'br.feat.cms.s' },
] as const;

const STYLE_KEYS = ['br.style.0','br.style.1','br.style.2','br.style.3','br.style.4','br.style.5','br.style.6','br.style.7'] as const;
const AUD_KEYS   = ['br.aud.0','br.aud.1','br.aud.2','br.aud.3','br.aud.4','br.aud.5'] as const;

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
  const [lang, setLang]         = useState<Lang>('en');
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
  const toggleAudChip = (key: string) => {
    setAudChips(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };
  const toggleStyleChip = (key: string) => {
    setStyleChips(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };

  const finish = () => {
    const data: BriefData = {
      company, industry, site, country, desc,
      typeV, goal, pain, kpi,
      audience, users, audChips, feats, styleChips,
      refs, brandV, budget, timeline, notes,
    };
    setFinalData(data);
    setBriefNum('BRIEF #' + (2026000 + Math.floor(Math.random() * 999)));
    setShow(true);
    launchConfetti();
    window.scrollTo({top:0, behavior:'smooth'});
  };

  /* ── LIVE PANEL DATA ──────────────────────────────────────────────── */
  const panelDate = company ? new Date().toLocaleDateString('en-GB') : '—';

  /* ── LABELS (from i18n) ── */
  const STEPS_LABELS = [0,1,2,3,4,5,6].map(i => tl(`br.step.lbl.${i}`, lang));

  const typeLabel = (v: string) => {
    const found = TYPE_OPTS.find(o => o.v === v);
    return found ? tl(found.nameKey, lang) : v;
  };
  const brandLabel = (v: string) => {
    const found = BRAND_OPTS.find(o => o.v === v);
    return found ? tl(found.nameKey, lang) : v;
  };
  const budgetLabel = (v: string) => {
    const found = BUDGET_OPTS.find(o => o.v === v);
    return found ? tl(found.nameKey, lang) : v;
  };
  const featName = (v: string) => {
    const found = FEAT_OPTS.find(o => o.v === v);
    return found ? tl(found.nameKey, lang) : v;
  };

  /* ── RESULT ──────────────────────────────────────────────────────── */
  if (showResult && finalData) {
    const d = finalData;
    const dateStr = new Date().toLocaleDateString('en-GB');
    return (
      <div style={{minHeight:'100vh', background:'var(--navy)'}}>
        <BlurOrbs count={2} />
        <TopNav backHref="/" backLabel={tl('nav.back', lang)} lang={lang} onLangChange={setLang} />
        <div className="result-screen brief show">
          <div className="rs-hero">
            <div className="rs-badge">
              <svg width="14" height="14"><use href="#i-check"/></svg> {tl('br.res.badge', lang)}
            </div>
            <h1 className="rs-title">{tl('br.res.title', lang).split(' ')[0]} <em>{tl('br.res.title', lang).split(' ').slice(1).join(' ')}</em></h1>
            <p className="rs-sub">{tl('br.res.sub', lang)}</p>
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
              <div className="fb-title">{d.company ? `${tl('br.panel.title', lang)}: ${d.company}` : tl('br.panel.title', lang)}</div>
              <div className="fb-meta-row">
                <div className="fb-meta">{tl('br.doc.company', lang)}: <b>{d.company || tl('br.doc.none', lang)}</b></div>
                <div className="fb-meta">{tl('br.doc.date', lang)}: <b>{dateStr}</b></div>
                <div className="fb-meta">{tl('br.doc.deadl', lang)}: <b>{d.timeline} {tl('br.doc.mos', lang)}</b></div>
              </div>
            </div>
            <div className="fb-body">
              <div className="fb-section">
                <div className="fb-sec-head">{tl('br.doc.about', lang)}</div>
                <div className="fb-grid">
                  <div className="fb-key">{tl('br.doc.company', lang)}</div><div className="fb-val v">{[d.company, d.industry].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">{tl('br.doc.sphere', lang)}</div><div className="fb-val">{[d.country, d.site ? 'Site: ' + d.site : ''].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">{tl('br.doc.type', lang)}</div><div className="fb-val v">{typeLabel(d.typeV) || '—'}</div>
                  <div className="fb-key">{tl('br.doc.budget', lang)}</div><div className="fb-val v">{budgetLabel(d.budget) || '—'}</div>
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">{tl('br.doc.goals', lang)}</div>
                <div className="fb-grid">
                  <div className="fb-key">{tl('br.doc.goal', lang)}</div><div className="fb-val">{d.goal || '—'}</div>
                  <div className="fb-key">{tl('br.doc.users', lang)}</div><div className="fb-val">{[d.audience, d.audChips.map(k => tl(k, lang)).join(', ')].filter(Boolean).join(' · ') || '—'}</div>
                  <div className="fb-key">{tl('br.doc.scale', lang)}</div><div className="fb-val">{usersLabel(d.users)} {tl('br.doc.permo', lang)}</div>
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">{tl('br.doc.feats', lang)}</div>
                <div className="fb-tags">
                  {d.feats.length > 0
                    ? d.feats.map(f => <span key={f} className="fb-tag fb-tag-c">{featName(f)}</span>)
                    : <span style={{fontSize:'11px',color:'var(--muted)'}}>{tl('br.doc.notsel', lang)}</span>
                  }
                </div>
              </div>
              <div className="fb-section">
                <div className="fb-sec-head">{tl('br.doc.design', lang)}</div>
                <div className="fb-grid">
                  <div className="fb-key">{tl('br.doc.style', lang)}</div><div className="fb-val">{d.styleChips.map(k => tl(k, lang)).join(', ') || '—'}</div>
                  <div className="fb-key">{tl('br.doc.brand', lang)}</div><div className="fb-val">{brandLabel(d.brandV) || '—'}</div>
                  <div className="fb-key">{tl('br.doc.refs', lang)}</div><div className="fb-val">{d.refs || '—'}</div>
                  <div className="fb-key">{tl('br.doc.notes', lang)}</div><div className="fb-val">{d.notes || '—'}</div>
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
              {tl('br.btn.home', lang)}
            </Link>
            <button className="btn btn-ghost" onClick={() => { setShow(false); setStep(0); }}>
              <svg width="16" height="16"><use href="#i-refresh"/></svg>
              {tl('br.btn.redo', lang)}
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
        <div className="bp-badge"><span className="bp-live-dot" /> {tl('br.panel.live', lang)}</div>
        <div className="bp-title">{tl('br.panel.title', lang)}</div>
        <div className="bp-sub">{tl('br.panel.prev', lang)}</div>
      </div>

      <div className="brief-doc">
        <div className="bd-doc-header">
          <div className="bd-doc-logo">
            <div className="bd-doc-logo-mark">N</div>
            <div className="bd-doc-logo-name">Invest Nova LG</div>
          </div>
          <div className="bd-doc-title">{company ? `${tl('br.panel.title', lang)}: ${company}` : tl('br.panel.title', lang)}</div>
          <div className="bd-doc-date">{panelDate}</div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.about', lang)}</div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.company', lang)}</div><div className="bd-val">{company ? <span className="bd-val filled">{company}</span> : <span className="bd-empty">{tl('br.doc.empty', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.sphere', lang)}</div><div className="bd-val">{industry ? <span className="bd-val filled">{industry}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.market', lang)}</div><div className="bd-val">{country ? <span className="bd-val filled">{country}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.type', lang)}</div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.type', lang)}</div><div className="bd-val">{typeV ? <span className="bd-tag">{typeLabel(typeV)}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.goal', lang)}</div><div className="bd-val">{goal ? <span className="bd-val filled">{goal.substring(0,80)}{goal.length>80?'…':''}</span> : <span className="bd-empty">{tl('br.doc.empty', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.kpi', lang)}</div><div className="bd-val">{kpi ? <span className="bd-val filled">{kpi}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.users', lang)}</div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.users', lang)}</div><div className="bd-val">{audience ? <span className="bd-val filled">{audience}</span> : <span className="bd-empty">{tl('br.doc.empty', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.scale', lang)}</div><div className="bd-val">{usersLabel(users)}/{tl('br.doc.mos', lang)}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.feats', lang)}</div>
          <div className="bd-row">
            <div className="bd-key">{tl('br.doc.modules', lang)}</div>
            <div className="bd-val">
              {feats.length > 0
                ? feats.map(f => <span key={f} className="bd-tag purple">{featName(f)}</span>)
                : <span className="bd-empty">{tl('br.doc.notsel', lang)}</span>
              }
            </div>
          </div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.design', lang)}</div>
          <div className="bd-row">
            <div className="bd-key">{tl('br.doc.style', lang)}</div>
            <div className="bd-val">
              {styleChips.length > 0
                ? styleChips.map(k => <span key={k} className="bd-tag">{tl(k, lang)}</span>)
                : <span className="bd-empty">{tl('br.doc.none', lang)}</span>
              }
            </div>
          </div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.brand', lang)}</div><div className="bd-val">{brandV ? <span className="bd-val filled">{brandLabel(brandV)}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.refs', lang)}</div><div className="bd-val">{refs ? <span className="bd-val filled">{refs}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
        </div>

        <div className="bd-section">
          <div className="bd-sec-title">{tl('br.doc.budgt', lang)}</div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.budget', lang)}</div><div className="bd-val">{budget ? <span className="bd-tag">{budgetLabel(budget)}</span> : <span className="bd-empty">{tl('br.doc.none', lang)}</span>}</div></div>
          <div className="bd-row"><div className="bd-key">{tl('br.doc.deadl', lang)}</div><div className="bd-val">{timeline} {tl('br.s6.months', lang)}</div></div>
        </div>
      </div>

      <div className="bp-actions">
        <div style={{fontSize:'9px',color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'6px'}}>{tl('br.panel.avail', lang)}</div>
        <button className="btn btn-sm btn-outline" disabled>
          <svg width="14" height="14"><use href="#i-download"/></svg> {tl('br.panel.pdf', lang)}
        </button>
        <button className="btn btn-sm btn-outline" disabled>
          <svg width="14" height="14"><use href="#i-send"/></svg> {tl('br.panel.send', lang)}
        </button>
      </div>
    </div>
  );

  /* ── RENDER ──────────────────────────────────────────────────────── */
  return (
    <div style={{minHeight:'100vh', background:'var(--navy)'}}>
      <BlurOrbs count={2} />
      <TopNav
        backHref="/"
        backLabel={tl('nav.back', lang)}
        stepIndicator={`${tl('br.step.ind', lang)} ${step + 1} ${tl('br.step.of', lang)} 7`}
        lang={lang}
        onLangChange={setLang}
      />

      <div className="brief-layout" id="mainLayout">
        {/* WIZARD LEFT */}
        <div className="wizard">
          <Stepper />

          {/* STEP 0 — COMPANY */}
          {step === 0 && (
            <div className="step active">
              <div className="step-num">{tl('br.s0.num', lang)}</div>
              <h2 className="step-title">{tl('br.s0.title', lang)}</h2>
              <p className="step-hint">{tl('br.s0.hint', lang)}</p>
              <div className="field-row">
                <div className="field"><label>{tl('br.s0.f1', lang)}</label><input type="text" value={company} onChange={e=>setCompany(e.target.value)} placeholder="ACME Corp"/></div>
                <div className="field"><label>{tl('br.s0.f2', lang)}</label><input type="text" value={industry} onChange={e=>setIndustry(e.target.value)} placeholder={tl('br.s0.f2ph', lang)}/></div>
              </div>
              <div className="field-row">
                <div className="field"><label>{tl('br.s0.f3', lang)}</label><input type="text" value={site} onChange={e=>setSite(e.target.value)} placeholder="https://company.com"/></div>
                <div className="field"><label>{tl('br.s0.f4', lang)}</label><input type="text" value={country} onChange={e=>setCountry(e.target.value)} placeholder={tl('br.s0.f4ph', lang)}/></div>
              </div>
              <div className="field"><label>{tl('br.s0.f5', lang)}</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder={tl('br.s0.f5ph', lang)}/></div>
              <div className="actions"><button className="btn btn-primary" onClick={()=>goStep(1)}>{tl('br.btn.next', lang)}</button></div>
            </div>
          )}

          {/* STEP 1 — TYPE */}
          {step === 1 && (
            <div className="step active">
              <div className="step-num">{tl('br.s1.num', lang)}</div>
              <h2 className="step-title">{tl('br.s1.title', lang)}</h2>
              <p className="step-hint">{tl('br.s1.hint', lang)}</p>
              <div className="opts opts-2">
                {TYPE_OPTS.map(o => (
                  <div key={o.v} className={`opt${typeV===o.v?' sel':''}`} onClick={()=>setTypeV(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-ico"><svg width="20" height="20"><use href={`#${o.ico}`}/></svg></div>
                    <div className="opt-name">{tl(o.nameKey, lang)}</div>
                    <div className="opt-sub">{tl(o.subKey, lang)}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(0)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={()=>goStep(2)} disabled={!typeV}>{tl('br.btn.next', lang)}</button>
              </div>
            </div>
          )}

          {/* STEP 2 — GOAL */}
          {step === 2 && (
            <div className="step active">
              <div className="step-num">{tl('br.s2.num', lang)}</div>
              <h2 className="step-title">{tl('br.s2.title', lang)}</h2>
              <p className="step-hint">{tl('br.s2.hint', lang)}</p>
              <div className="field"><label>{tl('br.s2.f1', lang)}</label><textarea value={goal} onChange={e=>setGoal(e.target.value)} placeholder={tl('br.s2.f1ph', lang)}/></div>
              <div className="field"><label>{tl('br.s2.f2', lang)}</label><textarea value={pain} onChange={e=>setPain(e.target.value)} placeholder={tl('br.s2.f2ph', lang)}/></div>
              <div className="field"><label>{tl('br.s2.f3', lang)}</label><input type="text" value={kpi} onChange={e=>setKpi(e.target.value)} placeholder={tl('br.s2.f3ph', lang)}/></div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(1)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={()=>goStep(3)}>{tl('br.btn.next', lang)}</button>
              </div>
            </div>
          )}

          {/* STEP 3 — AUDIENCE */}
          {step === 3 && (
            <div className="step active">
              <div className="step-num">{tl('br.s3.num', lang)}</div>
              <h2 className="step-title">{tl('br.s3.title', lang)}</h2>
              <p className="step-hint">{tl('br.s3.hint', lang)}</p>
              <div className="field"><label>{tl('br.s3.f1', lang)}</label><input type="text" value={audience} onChange={e=>setAudience(e.target.value)} placeholder={tl('br.s3.f1ph', lang)}/></div>
              <div className="field"><label>{tl('br.s3.f2', lang) || 'Number of users'}</label></div>
              <div className="range-row">
                <label>{tl('br.s3.range', lang)} <span>{usersLabel(users)}</span></label>
                <input
                  type="range" className="brief-range" min="100" max="100000" step="100" value={users}
                  onChange={e=>setUsers(+e.target.value)}
                  style={{'--pct': pct(users, 100, 100000)} as React.CSSProperties}
                />
              </div>
              <div className="field"><label>{tl('br.s3.f3', lang)}</label></div>
              <div className="priorities">
                {AUD_KEYS.map(k => (
                  <button key={k} className={`chip${audChips.includes(k)?' sel sel-p':''}`} onClick={()=>toggleAudChip(k)}>{tl(k, lang)}</button>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(2)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={()=>goStep(4)}>{tl('br.btn.next', lang)}</button>
              </div>
            </div>
          )}

          {/* STEP 4 — FEATURES */}
          {step === 4 && (
            <div className="step active">
              <div className="step-num">{tl('br.s4.num', lang)}</div>
              <h2 className="step-title">{tl('br.s4.title', lang)}</h2>
              <p className="step-hint">{tl('br.s4.hint', lang)}</p>
              <div className="multi-note">{tl('br.multi.note', lang)}</div>
              <div className="opts opts-3">
                {FEAT_OPTS.map(o => (
                  <div key={o.v} className={`opt${feats.includes(o.v)?' sel':''}`} onClick={()=>toggleFeat(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{tl(o.nameKey, lang)}</div>
                    <div className="opt-sub">{tl(o.subKey, lang)}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(3)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={()=>goStep(5)}>{tl('br.btn.next', lang)}</button>
              </div>
            </div>
          )}

          {/* STEP 5 — DESIGN */}
          {step === 5 && (
            <div className="step active">
              <div className="step-num">{tl('br.s5.num', lang)}</div>
              <h2 className="step-title">{tl('br.s5.title', lang)}</h2>
              <p className="step-hint">{tl('br.s5.hint', lang)}</p>
              <div className="field"><label>{tl('br.s5.f1', lang)}</label><input type="text" value={refs} onChange={e=>setRefs(e.target.value)} placeholder="apple.com, stripe.com, linear.app..."/></div>
              <div className="field"><label>{tl('br.s5.f2', lang)}</label></div>
              <div className="priorities">
                {STYLE_KEYS.map(k => (
                  <button key={k} className={`chip${styleChips.includes(k)?' sel sel-p':''}`} onClick={()=>toggleStyleChip(k)}>{tl(k, lang)}</button>
                ))}
              </div>
              <div className="field" style={{marginTop:'16px'}}><label>{tl('br.s5.f3', lang)}</label></div>
              <div className="opts opts-3">
                {BRAND_OPTS.map(o => (
                  <div key={o.v} className={`opt${brandV===o.v?' sel':''}`} onClick={()=>setBrandV(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{tl(o.nameKey, lang)}</div>
                    <div className="opt-sub">{tl(o.subKey, lang)}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(4)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={()=>goStep(6)} disabled={!brandV}>{tl('br.btn.next', lang)}</button>
              </div>
            </div>
          )}

          {/* STEP 6 — BUDGET */}
          {step === 6 && (
            <div className="step active">
              <div className="step-num">{tl('br.s6.num', lang)}</div>
              <h2 className="step-title">{tl('br.s6.title', lang)}</h2>
              <p className="step-hint">{tl('br.s6.hint', lang)}</p>
              <div className="field"><label>{tl('br.s6.f1', lang)}</label></div>
              <div className="opts opts-2" style={{marginBottom:'20px'}}>
                {BUDGET_OPTS.map(o => (
                  <div key={o.v} className={`opt${budget===o.v?' sel':''}`} onClick={()=>setBudget(o.v)}>
                    <div className="opt-ck"/>
                    <div className="opt-name">{tl(o.nameKey, lang)}</div>
                    <div className="opt-sub">{tl(o.subKey, lang)}</div>
                  </div>
                ))}
              </div>
              <div className="range-row">
                <label>{tl('br.s6.range', lang)} <span>{timeline} {tl('br.s6.months', lang)}</span></label>
                <input
                  type="range" className="brief-range" min="1" max="18" value={timeline}
                  onChange={e=>setTimeline(+e.target.value)}
                  style={{'--pct': pct(timeline, 1, 18)} as React.CSSProperties}
                />
              </div>
              <div className="field"><label>{tl('br.s6.f2', lang)}</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={tl('br.s6.f2ph', lang)}/></div>
              <div className="actions">
                <button className="btn btn-ghost" onClick={()=>goStep(5)}>{tl('br.btn.back', lang)}</button>
                <button className="btn btn-primary" onClick={finish} disabled={!budget}>
                  <svg width="16" height="16"><use href="#i-sparkle"/></svg>
                  {tl('br.btn.finish', lang)}
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
