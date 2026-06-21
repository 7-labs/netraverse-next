import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from './Breadcrumbs';
import Icon from './Icon';
import {
  FOOTER_LINKS,
  INDEPENDENCE_DISCLAIMER,
  PRIMARY_NAV,
  SITE_NAME,
  SITE_TAGLINE,
} from '../lib/site';

const NAV_ICONS = {
  '/': 'home',
  '/apps': 'apps',
  '/games': 'games',
  '/tools': 'tools',
  '/content': 'guides',
  '/win4lin': 'history',
};

function NavLink({ href, label, isActive }) {
  return (
    <Link href={href} className={isActive ? 'active' : undefined}>
      <Icon name={NAV_ICONS[href] || 'chevronRight'} />
      <span className="nav-label">{label}</span>
    </Link>
  );
}

export default function Layout({ children, breadcrumbs = [] }) {
  const router = useRouter();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-brand">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="swap" />
            </span>
            <div className="site-brand__text">
              <Link href="/">{SITE_NAME}</Link>
              <p>{SITE_TAGLINE}</p>
            </div>
          </div>
          <nav className="primary-nav" aria-label="Primary">
            {PRIMARY_NAV.map(item => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={
                  item.href === '/'
                    ? router.pathname === '/'
                    : router.asPath.startsWith(item.href)
                }
              />
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <div className="site-main__inner">
          <Breadcrumbs items={breadcrumbs} />
          {children}
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <p className="site-footer__title">
              <span className="brand-mark" aria-hidden="true">
                <Icon name="swap" />
              </span>
              {SITE_NAME}
            </p>
            <p>{INDEPENDENCE_DISCLAIMER}</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {FOOTER_LINKS.map(item => (
              <Link key={item.href} href={item.href}>
                <Icon name="arrowRight" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
