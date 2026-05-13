'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Constellation from '@/components/canvas/Constellation';
import BlurOrbs from '@/components/layout/BlurOrbs';
import Sidebar, { ActivityFeed } from '@/components/layout/Sidebar';

const TOTAL = 7;

/* ══════════════════════════════════════════════════════
   ROI CALC helper
══════════════════════════════════════════════════════ */
function calcRoi(emp: number, hrs: number, sal: number) {
  const hourlyRate = sal / (4.3 * 40);
  const annualLoss = Math.round(emp * hrs * hourlyRate * 52);
  const saving = Math.round(annualLoss * 0.75);
  const itCost = Math.max(8000, Math.round(emp * 600));
  const paybackMonths = saving > 0 ? Math.ceil(itCost / (saving / 12)) : null;
  const roi3y = saving > 0 ? Math.round(((saving * 3 - itCost) / itCost) * 100) : 0;
  return { annualLoss, saving, itCost, paybackMonths, roi3y };
}

function fmt(n: number) { return '£' + n.toLocaleString('en-GB'); }

/* ══════════════════════════════════════════════════════
   SLIDE COMPONENTS
══════════════════════════════════════════════════════ */

function HeroSlide({ onServices, onContact, sClass }: { onServices: () => void; onContact: () => void; sClass: string }) {
  return (
    <section className={`slide slide-hero ${sClass}`} data-index="0">
      <div className="hero-left">
        <div className="overline">Information Technologies</div>
        <h1>Invest<br /><em>Nova</em><br />LG</h1>
        <p className="lead">We build enterprise IT systems, web platforms and digital solutions for businesses in Europe and the USA.</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={onServices}>Our Services →</button>
          <button className="btn btn-ghost" onClick={onContact}>Get in Touch</button>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-sphere">
          <div className="sphere-ring sphere-ring-3" />
          <div className="sphere-ring sphere-ring-2" />
          <div className="sphere-ring sphere-ring-1" />
          <div className="sphere-core" />
        </div>
        <div className="float-card float-card-1">
          <div className="fc-label">Active Projects</div>
          <div className="fc-value grad">12</div>
          <div className="fc-sub">↑ +3 this quarter</div>
        </div>
        <div className="float-card float-card-2">
          <div className="fc-label">Technologies</div>
          <div className="fc-value" style={{fontSize:'16px',color:'var(--muted2)'}}>React · Node · AI</div>
          <div className="fc-dots">
            <div className="fc-dot" style={{background:'var(--cyan)'}} />
            <div className="fc-dot" style={{background:'var(--purple)'}} />
            <div className="fc-dot" style={{background:'#22c55e'}} />
          </div>
        </div>
        <div className="float-card float-card-3">
          <div className="fc-label">Clients</div>
          <div className="fc-value grad">30+</div>
          <div className="fc-sub" style={{color:'var(--muted2)'}}>EU · USA · CIS</div>
        </div>
      </div>
    </section>
  );
}

function AboutSlide({ active, sClass }: { active: boolean; sClass: string }) {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [50, 30, 5, 8];
  const animated = useRef(false);

  useEffect(() => {
    if (active && !animated.current) {
      animated.current = true;
      targets.forEach((t, i) => {
        let v = 0;
        const iv = setInterval(() => {
          v = Math.min(v + t / 40, t);
          setCounts(prev => { const n = [...prev]; n[i] = Math.floor(v); return n; });
          if (v >= t) clearInterval(iv);
        }, 28);
      });
    }
  }, [active]);

  return (
    <section className={`slide slide-about ${sClass}`} data-index="1">
      <div className="about-left">
        <div className="overline">About Us</div>
        <h2>Technology<br />that <em>works</em></h2>
        <p className="lead">Invest Nova LG is a European IT company. We create and develop information technologies for modern businesses, focused on quality and results.</p>
        <div className="stats-grid">
          {[['Projects','s1.s1'],['Clients','s1.s2'],['Years exp.','s1.s3'],['Countries','s1.s4']].map(([label], i) => (
            <div className="stat-card" key={i}>
              <div className="stat-num">{counts[i]}{targets[i] > 10 ? '+' : ''}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="about-right">
        <div className="browser-mockup">
          <div className="browser-bar">
            <div className="b-dots">
              <div className="b-dot b-dot-r" /><div className="b-dot b-dot-y" /><div className="b-dot b-dot-g" />
            </div>
            <div className="b-url">novainvest.eu/dashboard</div>
          </div>
          <div className="browser-content">
            <div className="dash-header">
              <div className="dash-title">Project Dashboard</div>
              <div className="dash-badge">Live</div>
            </div>
            <div className="dash-grid">
              <div className="dash-card"><div className="dash-card-num" style={{background:'var(--grad)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>12</div><div className="dash-card-label">Active</div></div>
              <div className="dash-card"><div className="dash-card-num" style={{color:'#22c55e'}}>98%</div><div className="dash-card-label">Uptime</div></div>
              <div className="dash-card"><div className="dash-card-num" style={{color:'#f59e0b'}}>4.9</div><div className="dash-card-label">Rating</div></div>
            </div>
            <div className="dash-bar-row">
              {[['Web Dev',88],['Mobile',72],['AI / ML',61],['DevOps',95]].map(([l,w]) => (
                <div className="dash-bar-item" key={l as string}>
                  <div className="dash-bar-label">{l}</div>
                  <div className="dash-bar-track"><div className="dash-bar-fill" style={{width:`${w}%`}} /></div>
                  <div className="dash-bar-val">{w}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSlide({ onContact, sClass }: { onContact: () => void; sClass: string }) {
  const svcs = [
    ['ico-globe','Web Development','Corporate websites, platforms, web apps of any complexity'],
    ['ico-gear','Enterprise Systems','ERP, CRM, SaaS solutions tailored to your business'],
    ['ico-mobile','Mobile Applications','iOS and Android with modern UX/UI design'],
    ['ico-ai','AI Automation','AI implementation and business process automation'],
    ['ico-cloud','IT Infrastructure','DevOps, cloud, CI/CD, monitoring and support'],
  ];
  return (
    <section className={`slide slide-services ${sClass}`} data-index="2">
      <div className="services-left">
        <div className="overline">What We Do</div>
        <h2>What we<br /><em>build</em></h2>
        <p className="lead">From enterprise systems to mobile apps — full development and support cycle.</p>
        <button className="btn btn-primary" onClick={onContact}>Discuss Project →</button>
      </div>
      <div className="services-right">
        {svcs.map(([ico, title, desc]) => (
          <div className="svc-card" key={title as string}>
            <div className="svc-ico"><svg width="20" height="20"><use href={`#${ico}`}/></svg></div>
            <div className="svc-info">
              <div className="svc-title">{title}</div>
              <div className="svc-desc">{desc}</div>
            </div>
            <div className="svc-arrow">›</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechSlide({ sClass }: { sClass: string }) {
  const pills = [
    ['AI / ML',true,false],['Cloud',true,false],['React',false,true],['Next.js',false,true],
    ['Node.js',false,false],['Python',false,true],['Kubernetes',true,false],['Docker',false,true],
    ['AWS / GCP',false,false],['LLM API',true,true],['PostgreSQL',false,false],['GraphQL',false,true],
  ];
  return (
    <section className={`slide slide-tech ${sClass}`} data-index="3">
      <div className="tech-left">
        <div className="overline">Technology Stack</div>
        <h2>Tools of<br />the <em>future</em></h2>
        <p className="lead">We work with proven technologies and are first to implement innovations.</p>
        <div className="tech-pills">
          {pills.map(([label, hot, purple]) => (
            <div key={label as string} className={`tech-pill${hot ? ' hot' : ''}`}>
              <span className={`tech-dot${purple ? ' purple' : ''}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="tech-right">
        <div className="node-graph">
          <svg className="node-svg" viewBox="0 0 380 380" fill="none">
            <line x1="190" y1="190" x2="190" y2="42" stroke="rgba(0,217,255,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="190" y1="190" x2="190" y2="338" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="190" y1="190" x2="28" y2="190" stroke="rgba(0,217,255,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="190" y1="190" x2="352" y2="190" stroke="rgba(139,92,246,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="190" y1="190" x2="62" y2="86" stroke="rgba(0,217,255,0.1)" strokeWidth="1"/>
            <line x1="190" y1="190" x2="318" y2="86" stroke="rgba(139,92,246,0.1)" strokeWidth="1"/>
            <line x1="190" y1="190" x2="62" y2="294" stroke="rgba(0,217,255,0.1)" strokeWidth="1"/>
            <line x1="190" y1="190" x2="318" y2="294" stroke="rgba(139,92,246,0.1)" strokeWidth="1"/>
          </svg>
          <div className="ng-node ng-node-center">INVEST<br/>NOVA</div>
          <div className="ng-node ng-node-a">AI</div>
          <div className="ng-node ng-node-b">DB</div>
          <div className="ng-node ng-node-c">API</div>
          <div className="ng-node ng-node-d">UI</div>
          <div className="ng-node ng-node-e">K8s</div>
          <div className="ng-node ng-node-f">ML</div>
          <div className="ng-node ng-node-g">CI</div>
          <div className="ng-node ng-node-h">Web</div>
        </div>
      </div>
    </section>
  );
}

function ProcessSlide({ sClass }: { sClass: string }) {
  const steps = [
    ['Analysis & Briefing','We study business tasks and form technical specifications'],
    ['Architecture & Design','We design the system and create interface prototypes'],
    ['Development','Sprints, daily updates, transparent progress'],
    ['Testing & Launch','QA, load testing, production deployment'],
    ['Support & Growth','Monitoring, updates, system scaling'],
  ];
  return (
    <section className={`slide slide-process ${sClass}`} data-index="4">
      <div className="process-left">
        <div className="overline">How We Work</div>
        <h2>From idea<br />to <em>result</em></h2>
        <div className="process-steps">
          {steps.map(([title, desc], i) => (
            <div className="pstep" key={i}>
              <span className="pstep-num">0{i+1}</span>
              <div className="pstep-body">
                <div className="pstep-title">{title}</div>
                <div className="pstep-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="process-right">
        <div className="phone-mockup">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="ph-status"><span>9:41</span><span>●●●</span></div>
            <div className="ph-hello">Good day, Client</div>
            <div className="ph-title">Your Projects</div>
            <div className="ph-cards">
              {[['CRM Platform','status-done','Done',100],['Mobile App','status-wip','In Progress',68],['AI Integration','status-wip','In Progress',40],['DevOps Setup','status-plan','Planned',10]].map(([t,cls,s,w]) => (
                <div className="ph-card" key={t as string}>
                  <div className="ph-card-top">
                    <div className="ph-card-title">{t}</div>
                    <div className={`ph-card-status ${cls}`}>{s}</div>
                  </div>
                  <div className="ph-bar-track"><div className="ph-bar-fill" style={{width:`${w}%`}} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoiSlide({ onContact, sClass }: { onContact: () => void; sClass: string }) {
  const [emp, setEmp] = useState(10);
  const [hrs, setHrs] = useState(10);
  const [sal, setSal] = useState(3000);
  const roi = calcRoi(emp, hrs, sal);

  const pct = (v: number, mn: number, mx: number) => ((v - mn) / (mx - mn) * 100).toFixed(1) + '%';

  return (
    <section className={`slide slide-roi ${sClass}`} data-index="5">
      <div className="roi-left">
        <div className="overline">ROI Calculator</div>
        <h2>What does<br /><em>inaction</em> cost?</h2>
        <p className="lead">Enter your data and find out how much your business loses without automation each year.</p>
        <div className="roi-inputs">
          <div className="roi-input-group">
            <div className="roi-input-label">
              <span className="ril-text">Employees on manual tasks</span>
              <span className="ril-val">{emp}</span>
            </div>
            <input type="range" className="roi-range" min="1" max="200" value={emp}
              style={{'--pct': pct(emp,1,200)} as React.CSSProperties}
              onChange={e => setEmp(+e.target.value)} />
          </div>
          <div className="roi-input-group">
            <div className="roi-input-label">
              <span className="ril-text">Hours/week on routine</span>
              <span className="ril-val">{hrs} h</span>
            </div>
            <input type="range" className="roi-range" min="1" max="40" value={hrs}
              style={{'--pct': pct(hrs,1,40)} as React.CSSProperties}
              onChange={e => setHrs(+e.target.value)} />
          </div>
          <div className="roi-input-group">
            <div className="roi-input-label">
              <span className="ril-text">Average salary, £/mo</span>
              <span className="ril-val">{fmt(sal)}</span>
            </div>
            <input type="range" className="roi-range" min="1500" max="15000" step="100" value={sal}
              style={{'--pct': pct(sal,1500,15000)} as React.CSSProperties}
              onChange={e => setSal(+e.target.value)} />
          </div>
        </div>
      </div>
      <div className="roi-right">
        <div className="roi-result-main">
          <div className="roi-loss-label">Annual losses without automation</div>
          <div className="roi-loss-num">{fmt(roi.annualLoss)}</div>
          <div className="roi-loss-sub">Time = money. This is what is wasted.</div>
        </div>
        <div className="roi-cards">
          <div className="roi-card">
            <div className="roi-card-label">Annual IT savings</div>
            <div className="roi-card-val green">{fmt(roi.saving)}</div>
          </div>
          <div className="roi-card">
            <div className="roi-card-label">Payback period</div>
            <div className="roi-card-val cyan">{roi.paybackMonths ? `${roi.paybackMonths} mo.` : '—'}</div>
          </div>
          <div className="roi-card">
            <div className="roi-card-label">3-year ROI</div>
            <div className="roi-card-val green">{roi.roi3y}%</div>
          </div>
          <div className="roi-card">
            <div className="roi-card-label">Solution cost</div>
            <div className="roi-card-val cyan">from {fmt(roi.itCost)}</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{alignSelf:'flex-start'}} onClick={onContact}>
          Discuss Project →
        </button>
      </div>
    </section>
  );
}

function ContactSlide({ sClass }: { sClass: string }) {
  return (
    <section className={`slide slide-contact ${sClass}`} data-index="6">
      <div className="contact-left">
        <div className="overline">Contact</div>
        <h2>{"Let's start"}<br />a <em>project</em></h2>
        <div className="contact-items">
          <div className="ci">
            <div className="ci-ico"><svg width="18" height="18"><use href="#ico-contact"/></svg></div>
            <div><div className="ci-label">Email</div><div className="ci-val">info@novainvest.eu</div></div>
          </div>
          <div className="ci">
            <div className="ci-ico"><svg width="18" height="18"><use href="#ico-pin"/></svg></div>
            <div>
              <div className="ci-label">Address</div>
              <div className="ci-val">186 St. Albans Road, Suite 9,<br />Watford, WD24 4AS, UK</div>
            </div>
          </div>
          <div className="ci">
            <div className="ci-ico"><svg width="18" height="18"><use href="#ico-gear"/></svg></div>
            <div>
              <div className="ci-label">Company No.</div>
              <div className="ci-val">16739174</div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-right">
        <div className="form">
          <div className="form-row">
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Email" />
          </div>
          <input type="text" placeholder="Company (optional)" />
          <textarea rows={4} placeholder="Briefly describe your project — task, budget, timeline" />
          <button className="btn btn-primary" style={{alignSelf:'flex-start'}}>Send Request →</button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   HOMEPAGE — FULLPAGE
══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [cur, setCur] = useState(0);
  const busyRef = useRef(false);
  const wtRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((n: number) => {
    if (n === cur || busyRef.current || n < 0 || n >= TOTAL) return;
    busyRef.current = true;
    setCur(n);
    setTimeout(() => { busyRef.current = false; }, 780);
  }, [cur]);

  // wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wtRef.current) return;
      wtRef.current = setTimeout(() => { wtRef.current = null; }, 900);
      if (e.deltaY > 20) goTo(cur + 1);
      else if (e.deltaY < -20) goTo(cur - 1);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [cur, goTo]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(cur + 1);
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goTo(cur - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cur, goTo]);

  // touch
  const tyRef = useRef(0);
  useEffect(() => {
    const onStart = (e: TouchEvent) => { tyRef.current = e.touches[0].clientY; };
    const onEnd   = (e: TouchEvent) => {
      const d = tyRef.current - e.changedTouches[0].clientY;
      if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [cur, goTo]);

  // body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height   = '100%';
    return () => { document.body.style.overflow = ''; document.body.style.height = ''; };
  }, []);

  const slideClass = (i: number) => {
    if (i === cur) return 'active';
    if (i < cur)  return 'above';
    return '';
  };

  return (
    <>
      <Constellation />
      <BlurOrbs />
      <Sidebar current={cur} total={TOTAL} onGoTo={goTo} />

      <div className="slides-wrap">
        <HeroSlide    sClass={slideClass(0)} onServices={() => goTo(2)} onContact={() => goTo(6)} />
        <AboutSlide   sClass={slideClass(1)} active={cur === 1} />
        <ServicesSlide sClass={slideClass(2)} onContact={() => goTo(6)} />
        <TechSlide    sClass={slideClass(3)} />
        <ProcessSlide sClass={slideClass(4)} />
        <RoiSlide     sClass={slideClass(5)} onContact={() => goTo(6)} />
        <ContactSlide sClass={slideClass(6)} />
      </div>

      {/* Chrome UI */}
      <div className="slide-counter">
        <b>{String(cur + 1).padStart(2, '0')}</b> / {String(TOTAL).padStart(2, '0')}
      </div>
      <div className={`scroll-hint${cur < TOTAL - 1 ? ' visible' : ''}`}>
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>

      <ActivityFeed />
    </>
  );
}
