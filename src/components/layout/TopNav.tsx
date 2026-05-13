import Link from 'next/link';

interface TopNavProps {
  backHref?: string;
  backLabel?: string;
  stepIndicator?: string;
}

export default function TopNav({
  backHref = '/',
  backLabel = '← Home',
  stepIndicator,
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
        <Link href={backHref} className="nav-back">
          {backLabel}
        </Link>
      </div>
    </nav>
  );
}
