'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { T, afData, tl, LANGS, type Lang } from '@/lib/i18n';

const NAV_ICONS = ['ico-home','ico-about','ico-services','ico-tech','ico-process','ico-roi','ico-contact'] as const;
const NAV_KEYS = ['nav.home','nav.about','nav.services','nav.tech','nav.process','nav.roi','nav.contact'] as const;
const NAV_SUB  = ['nav.home.s','nav.about.s','nav.services.s','nav.tech.s','nav.process.s','nav.roi.s','nav.contact.s'] as const;

interface SidebarProps {
  current: number;
  total: number;
  onGoTo: (n: number) => void;
}

export default function Sidebar({ current, total, onGoTo }: SidebarProps) {
  const [lang, setLangState] = useState<Lang>('en');

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = (key: string) => tl(key, lang);
  const progress = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <nav className="sidebar">
      <div className="progress-line">
        <div className="progress-fill" style={{ height: `${progress}%` }} />
      </div>

      <div className="logo">
        <div className="logo-mark">N</div>
        <div className="logo-title">Invest Nova LG</div>
        <div className="logo-sub">IT Solutions · LTD</div>
      </div>

      <ul className="nav-list">
        {NAV_KEYS.map((key, i) => (
          <li
            key={i}
            className={`nav-item${current === i ? ' active' : ''}`}
            onClick={() => onGoTo(i)}
          >
            <span className="nav-icon">
              <svg width="18" height="18">
                <use href={`#${NAV_ICONS[i]}`} />
              </svg>
            </span>
            <span className="nav-texts">
              <span className="nav-label">{t(key)}</span>
              <span className="nav-sublabel">{t(NAV_SUB[i])}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* TOOLS DIVIDER */}
      <div className="nav-divider">
        <div className="nav-divider-line" />
        <div className="nav-divider-label">{t('tools.div')}</div>
        <div className="nav-divider-line" />
      </div>

      <div className="tool-links">
        <Link href="/calc" className="tool-link tl-cyan">
          <div className="tl-ico"><svg width="14" height="14"><use href="#ico-roi"/></svg></div>
          <div className="tl-texts">
            <div className="tl-name">{t('tools.calc')}</div>
            <div className="tl-sub">{t('tools.calc.s')}</div>
          </div>
          <span className="tl-badge badge-new">NEW</span>
        </Link>
        <Link href="/brief" className="tool-link tl-purple">
          <div className="tl-ico"><svg width="14" height="14"><use href="#ico-process"/></svg></div>
          <div className="tl-texts">
            <div className="tl-name">{t('tools.brief')}</div>
            <div className="tl-sub">{t('tools.brief.s')}</div>
          </div>
          <span className="tl-badge badge-new">NEW</span>
        </Link>
        <Link href="/tracker" className="tool-link tl-amber">
          <div className="tl-ico"><svg width="14" height="14"><use href="#ico-tech"/></svg></div>
          <div className="tl-texts">
            <div className="tl-name">{t('tools.track')}</div>
            <div className="tl-sub">{t('tools.track.s')}</div>
          </div>
          <span className="tl-badge badge-soon">SOON</span>
        </Link>
        <Link href="/brandbook" className="tool-link tl-cyan">
          <div className="tl-ico"><svg width="14" height="14"><use href="#ico-services"/></svg></div>
          <div className="tl-texts">
            <div className="tl-name">{t('tools.brand')}</div>
            <div className="tl-sub">{t('tools.brand.s')}</div>
          </div>
          <span className="tl-badge badge-new">NEW</span>
        </Link>
      </div>

      <div className="lang-switch">
        {LANGS.map((l) => (
          <button
            key={l}
            className={`lang-btn${lang === l ? ' active' : ''}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ── ACTIVITY FEED ── */
export function ActivityFeed() {
  const [lang] = useState<Lang>('en');
  const [idx, setIdx] = useState(0);
  const [entering, setEntering] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const t = (key: string) => tl(key, lang);
  const item = afData[idx % afData.length];

  useEffect(() => {
    setEntering(true);
    const t1 = setTimeout(() => setEntering(false), 20);
    const t2 = setTimeout(() => setLeaving(true), 4200);
    const t3 = setTimeout(() => {
      setLeaving(false);
      setIdx((i) => i + 1);
      setEntering(true);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [idx]);

  return (
    <div id="activityBar">
      <div className="af-pulse" />
      <div id="activityFeed">
        <div className={`af-item${entering ? ' af-enter' : ''}${leaving ? ' af-leave' : ''}`}>
          <span className="af-flag">{item.flag}</span>
          <span className="af-city">{item.city}</span>
          <span className="af-action">{t(item.ak)}</span>
          <span className="af-dot">·</span>
          <span className="af-time">{t(item.tk)}</span>
        </div>
      </div>
    </div>
  );
}
