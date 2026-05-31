import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Home has a tall hero (~68vh); other pages have shorter PageHeader banners (~320px)
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

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isHome = location.pathname === '/';
  const navItems = [
    { label: 'Nieuws', to: '/nieuws' },
    { label: 'Programmering', to: '/programmering' },
    { label: 'Gedraaid', to: '/gedraaid' },
    { label: 'Gemist', to: '/gemist' },
  ];

  // Animated background only when user scrolled past the banner.
  // All pages have banners (home hero or PageHeader), so we always start transparent.
  const solid = scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'shadow-lg' : ''}`}>
      {/* Animated gradient + circles background — appears when scrolled or off-home */}
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-white text-lg lg:text-xl font-medium relative group"
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${location.pathname.startsWith(item.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
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
