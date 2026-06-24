import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const NEWS_CATEGORIES = [
  { label: 'Club Genk On Stage', to: '/club-genk-on-stage' },
  { label: 'Nieuws uit de buurt', to: '/nieuws' },
  { label: 'Social Club', to: '/social-club' },
  { label: 'Events & Tickets', to: '/events-tickets' },
];

const NEWS_PATHS = NEWS_CATEGORIES.map((c) => c.to);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const newsRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const isHomePath = location.pathname === '/';
    const onScroll = () => {
      const threshold = isHomePath ? Math.max(window.innerHeight * 0.55, 480) : 320;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setNewsOpen(false);
    setMobileNewsOpen(false);
  }, [location.pathname]);

  // Click outside closes the desktop dropdown.
  useEffect(() => {
    if (!newsOpen) return undefined;
    const onClick = (e) => {
      if (newsRef.current && !newsRef.current.contains(e.target)) setNewsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [newsOpen]);

  const openNews = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setNewsOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setNewsOpen(false), 160);
  };

  const navItems = [
    { label: "Programma's", to: '/programmering' },
    { label: 'Gedraaid', to: '/gedraaid' },
  ];

  const newsActive = NEWS_PATHS.some((p) => location.pathname.startsWith(p));
  const solid = scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'shadow-lg' : ''}`}>
      <div
        className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${solid ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        style={{ background: 'linear-gradient(180deg,#062a4a 0%,#0a3a6b 100%)' }}
      >
        {[300, 500, 700, 900, 1100, 1300].map((size, i) => (
          <div
            key={`h-${i}`}
            className="header-ring"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/assets/grk-logo.png" alt="GRK" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-10 lg:gap-14">
          {/* News dropdown */}
          <div
            ref={newsRef}
            className="relative"
            onMouseEnter={openNews}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              onClick={() => setNewsOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={newsOpen}
              data-testid="nav-news-toggle"
              className={`hover-pulse text-white text-lg lg:text-xl font-medium inline-flex items-center gap-1.5 ${newsActive ? 'is-active' : ''}`}
            >
              Nieuws
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${newsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {newsOpen && (
              <div
                role="menu"
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[240px] rounded-xl bg-[#062a4a] shadow-2xl border border-white/10 overflow-hidden z-50"
                onMouseEnter={openNews}
                onMouseLeave={scheduleClose}
                data-testid="nav-news-menu"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.to}
                    to={cat.to}
                    role="menuitem"
                    className={`block px-5 py-3 text-white text-base font-medium hover:bg-white/10 transition-colors ${location.pathname.startsWith(cat.to) ? 'bg-white/5' : ''}`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`hover-pulse text-white text-lg lg:text-xl font-medium ${location.pathname.startsWith(item.to) ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="md:hidden text-white" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
          <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-white mb-1.5"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {mobileOpen && (
        <div className="relative md:hidden bg-[#062a4a]/98 backdrop-blur-md border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {/* Mobile: Nieuws collapsible group */}
            <div>
              <button
                type="button"
                onClick={() => setMobileNewsOpen((v) => !v)}
                aria-expanded={mobileNewsOpen}
                className="w-full text-left text-white text-lg font-medium py-2 border-b border-white/10 flex items-center justify-between"
                data-testid="mobile-news-toggle"
              >
                Nieuws
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${mobileNewsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {mobileNewsOpen && (
                <div className="pl-3 mt-2 flex flex-col gap-1">
                  {NEWS_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.to}
                      to={cat.to}
                      className="text-white/90 text-base py-2 pl-2 border-l-2 border-white/15 hover:border-white/40"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="text-white text-lg font-medium py-2 border-b border-white/10">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
