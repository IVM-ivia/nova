'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/TopNav';
import BlurOrbs from '@/components/layout/BlurOrbs';
import { tl, type Lang } from '@/lib/i18n';

export default function TrackerPage() {
  const [lang, setLang]           = useState<Lang>('en');
  const [email, setEmail]         = useState('');
  const [email2, setEmail2]       = useState('');
  const [submitted, setSubmit]    = useState(false);
  const [submitted2, setSubmit2]  = useState(false);

  const handleSubmit = (e: React.FormEvent, which: 1 | 2) => {
    e.preventDefault();
    if (which === 1) setSubmit(true);
    else setSubmit2(true);
  };

  const sidebarItems = [
    { ico:'i-grid',  labelKey:'tr.mk.overview', active:true  },
    { ico:'i-task',  labelKey:'tr.mk.tasks',    active:false },
    { ico:'i-time',  labelKey:'tr.mk.timeline', active:false },
    { ico:'i-file',  labelKey:'tr.mk.docs',     active:false },
    { ico:'i-chat',  labelKey:'tr.mk.updates',  active:false },
  ];

  return (
    <div style={{minHeight:'100vh', background:'var(--navy)'}}>
      <BlurOrbs count={2} />
      <TopNav backHref="/" backLabel={tl('nav.back', lang)} lang={lang} onLangChange={setLang} />

      {/* HERO */}
      <div className="tracker-hero">
        <div className="coming-badge">
          <span className="hero-dot" /> {tl('tr.coming', lang)}
        </div>
        <h1>Live Project<br/><em>Tracker</em></h1>
        <p className="hero-sub">{tl('tr.sub', lang)}</p>

        <form className="notify-form" onSubmit={e=>handleSubmit(e,1)}>
          <input
            type="email" className="notify-input"
            placeholder={tl('tr.email.ph', lang)}
            value={email}
            onChange={e=>setEmail(e.target.value)}
            disabled={submitted}
          />
          <button className="btn btn-primary" type="submit" disabled={submitted}>
            {submitted ? tl('tr.notify.ok', lang) : tl('tr.notify.btn', lang)}
          </button>
        </form>
        <div className="notify-note">{tl('tr.launch', lang)}</div>

        <div className="launch-progress">
          <div className="lp-label"><span>{tl('tr.dev.prog', lang)}</span><span>67%</span></div>
          <div className="lp-track"><div className="lp-fill" /></div>
        </div>
      </div>

      {/* MOCKUP */}
      <div className="mockup-section">
        <div className="section-label">{tl('tr.preview.lbl', lang)}</div>
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
                <span className="b-share">Personal link</span>
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
                {sidebarItems.map(item => (
                  <div key={item.labelKey} className={`ts-item${item.active?' active':''}`}>
                    <svg width="14" height="14"><use href={`#${item.ico}`}/></svg>
                    {tl(item.labelKey, lang)}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="tracker-main">
                <div className="tm-header">
                  <div>
                    <div className="tm-title">CRM Platform — ACME Corp</div>
                    <div className="tm-sub">Sprint 4 of 6 · Updated 2h ago</div>
                  </div>
                  <div className="tm-status"><span className="tm-live-dot" /> Live</div>
                </div>

                <div className="overall-card">
                  <div className="oc-row">
                    <div className="oc-label">{tl('tr.mk.progress', lang)}</div>
                    <div className="oc-pct">68%</div>
                  </div>
                  <div className="oc-track"><div className="oc-fill" style={{width:'68%'}} /></div>
                  <div className="oc-metas">
                    <div className="oc-meta">Start: <b>01 Mar 2026</b></div>
                    <div className="oc-meta">Deadline: <b>30 Jun 2026</b></div>
                    <div className="oc-meta">Remaining: <b>47 days</b></div>
                  </div>
                </div>

                <div className="milestones">
                  {[
                    { ico:'i-check', state:'done',    name:'Design & Prototype',    date:'Done 15 Mar',        badge:'badge-done',    label:'Done',       active:false },
                    { ico:'i-check', state:'done',    name:'Backend API v1',         date:'Done 10 Apr',        badge:'badge-done',    label:'Done',       active:false },
                    { ico:'i-time',  state:'active',  name:'Frontend + Integration', date:'In progress · ~3w',  badge:'badge-wip',     label:'In Progress',active:true  },
                    { ico:'i-task',  state:'pending', name:'QA Testing',             date:'Next milestone',     badge:'badge-next',    label:'Next',       active:false },
                    { ico:'i-shield',state:'pending', name:'Production Deploy',      date:'30 Jun 2026',        badge:'badge-pending', label:'Planned',    active:false },
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

                <div style={{fontSize:'10px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'10px'}}>{tl('tr.mk.lastupd', lang)}</div>
                <div className="updates">
                  {[
                    { color:'var(--cyan)',   text:'Stripe payment gateway integration complete', time:'Today, 14:32' },
                    { color:'var(--green)',  text:'Auth module unit tests passed (147/147)',       time:'Yesterday, 18:05' },
                    { color:'var(--purple)', text:'Dashboard design approved by team',             time:'2 days ago' },
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
        <div className="section-label">{tl('tr.feat.sec', lang)}</div>
        <div className="features-grid">
          {(['f1','f2','f3','f4','f5','f6'] as const).map((k, i) => (
            <div key={k} className="feat-card">
              <div className="feat-ico">
                <svg width="22" height="22"><use href={`#${['i-link','i-eye','i-bell','i-file','i-chat','i-shield'][i]}`}/></svg>
              </div>
              <div className="feat-title">{tl(`tr.${k}.t`, lang)}</div>
              <div className="feat-desc">{tl(`tr.${k}.d`, lang)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-card">
          <div className="cta-title">{tl('tr.cta.title', lang).split('beta?')[0]}<br/><em>beta?</em></div>
          <div className="cta-sub">{tl('tr.cta.sub', lang)}</div>
          <form style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap',marginBottom:'28px'}} onSubmit={e=>handleSubmit(e,2)}>
            <input
              type="email" className="notify-input" style={{maxWidth:'260px'}}
              placeholder="your@email.com"
              value={email2}
              onChange={e=>setEmail2(e.target.value)}
              disabled={submitted2}
            />
            <button className="btn btn-primary" type="submit" disabled={submitted2}>
              {submitted2 ? tl('tr.notify.ok', lang) : tl('tr.cta.get', lang)}
            </button>
          </form>
          <div style={{borderTop:'1px solid var(--border)',paddingTop:'24px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--muted)'}}>{tl('tr.cta.see', lang)}</div>
            <Link href="/" className="btn btn-primary" style={{gap:'12px',fontSize:'13px',padding:'15px 36px'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
              {tl('tr.cta.home', lang)}
            </Link>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center',marginTop:'4px'}}>
              <Link href="/calc" className="btn" style={{background:'rgba(0,217,255,0.1)',border:'1px solid rgba(0,217,255,0.25)',color:'var(--cyan)',padding:'10px 20px',fontSize:'11px'}}>{tl('tools.calc', lang)}</Link>
              <Link href="/brief" className="btn" style={{background:'rgba(139,92,246,0.1)',border:'1px solid rgba(139,92,246,0.25)',color:'#a78bfa',padding:'10px 20px',fontSize:'11px'}}>{tl('tools.brief', lang)}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
