import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Music2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#5a0a2c] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-baseline gap-2">
            <span className="inline-block px-1.5 py-0.5 rounded-md text-white text-[10px] font-bold tracking-tight" style={{background:'linear-gradient(135deg,#ff7a3d 0%,#d63384 100%)'}}>npo</span>
            <span className="text-white text-2xl font-black tracking-tight">
              BL<span style={{background:'linear-gradient(135deg,#ff7a3d,#d63384)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>E</span>ND
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={18}/></a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={18}/></a>
            <a href="#" aria-label="Spotify" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"><Music2 size={18}/></a>
          </div>
        </div>
        <div className="md:text-right space-y-4">
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3">
            <Link to="/" className="text-white hover:underline underline-offset-4">NPO Luister</Link>
            <Link to="/nieuws" className="text-white hover:underline underline-offset-4">Nieuws</Link>
            <Link to="/programmering" className="text-white hover:underline underline-offset-4">Programmering</Link>
            <Link to="/over" className="text-white hover:underline underline-offset-4">Over NPO Blend</Link>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-3 text-white/80 text-sm pt-2">
            <a href="#" className="hover:underline underline-offset-4">Algemene voorwaarden &amp; Privacybeleid</a>
            <a href="#" className="hover:underline underline-offset-4">Cookies op npo.nl</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 text-xs text-white/60">
          &copy; {new Date().getFullYear()} NPO Blend &mdash; Design replica voor educatieve doeleinden.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
