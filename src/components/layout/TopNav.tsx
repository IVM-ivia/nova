'use client';

import Link from 'next/link';
import { LANGS, type Lang } from '@/lib/i18n';

interface TopNavProps {
  backHref?: string;
  backLabel?: string;
  stepIndicator?: string;
  lang?: Lang;
  onLangChange?: (l: Lang) => void;
}

export default function TopNav({
  backHref = '/',
  backLabel = '← Home',
  stepIndicator,
  lang,
  onLangChange,
}: TopNavProps) {
  return (
    <nav className="topnav">
      <Link href="/" className="nav-logo">
        <div className="nav-logo-mark">N</div>
        <div>
          <div className="nav-logo-text">Invest Nova LG</div>
          <div className="nav-logo-sub">IT Solutions · LTD</div>
        </div>
      </Link>
      <div className="nav-right">
        {stepIndicator && (
          <span className="nav-step-indicator">{stepIndicator}</span>
        )}
        {lang && onLangChange && (
          <div className="lang-switch" style={{marginRight:'12px'}}>
            {LANGS.map((l) => (
              <button
                key={l}
                className={`lang-btn${lang === l ? ' active' : ''}`}
                onClick={() => onLangChange(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <Link href={backHref} className="nav-back">
          {backLabel}
        </Link>
      </div>
    </nav>
  );
}
