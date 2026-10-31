import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import { placePath, whatsappLink } from '../../lib/format';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/destinations', label: 'Destinations', menu: true },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/guides', label: 'Travel Tips' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { places } = usePlaceStore();
  const { settings } = useSettingsStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const published = selectPublished(places);
  const nepal = published.filter((p) => p.destination_type === 'National').slice(0, 5);
  const world = published.filter((p) => p.destination_type !== 'National').slice(0, 5);
  const wa = whatsappLink(settings.whatsapp || settings.phone, 'Hello GoWin Travels, I would like to plan a trip.');

  const linkCls = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-[#1E3A8A] text-white' : 'text-gray-600 hover:text-[#1E3A8A] hover:bg-[#1E3A8A]/5'}`;

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(15,23,42,0.08)]' : 'bg-white'}`}>
        <div className="h-0.5 w-full flex" aria-hidden="true">
          <span className="flex-1 bg-[#3B82F6]" /><span className="flex-1 bg-gray-200" /><span className="flex-1 bg-[#EF4444]" /><span className="flex-1 bg-[#10B981]" /><span className="flex-1 bg-[#F59E0B]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={gowinLogo} alt="" width="40" height="40" className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" />
            <span className="leading-none">
              <span className="block text-lg font-black text-[#1E3A8A] tracking-tight">GoWin <span className="font-light text-[#1E3A8A]">Travels</span></span>
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.2em] text-[#047857]">Nepal · Worldwide</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV.map((item) =>
              item.menu ? (
                <div key={item.to} className="relative group">
                  <NavLink to={item.to} className={({ isActive }) => `${linkCls({ isActive: isActive || location.pathname.startsWith('/places') })} inline-flex items-center gap-1`}>
                    {item.label} <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </NavLink>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                    <div className="w-[560px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.16)] border border-gray-100 p-4 grid grid-cols-2 gap-4">
                      {[['Nepal', nepal, '/destinations/national'], ['International', world, '/destinations/international']].map(([title, list, to]) => (
                        <div key={title}>
                          <Link to={to} className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#1E3A8A] mb-2 hover:text-[#10B981]">
                            {title} <ArrowRight className="w-3 h-3" />
                          </Link>
                          <ul className="space-y-0.5">
                            {list.length ? list.map((p) => (
                              <li key={p.id}>
                                <Link to={placePath(p)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 hover:text-[#1E3A8A]">
                                  <MapPin className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" /><span className="truncate">{p.title}</span>
                                </Link>
                              </li>
                            )) : <li className="text-xs text-gray-500 px-2 py-1.5">Coming soon</li>}
                          </ul>
                        </div>
                      ))}
                      <Link to="/destinations" className="col-span-2 text-center text-xs font-bold text-[#047857] hover:text-[#065F46] border-t border-gray-100 pt-3">
                        View all destinations
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkCls}>{item.label}</NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A]/5 transition-colors">
                <MessageCircle className="w-4 h-4 text-[#10B981]" /> WhatsApp
              </a>
            )}
            <Link to="/booking" className="hidden sm:inline-flex btn-primary !py-2.5 !px-4 text-sm">Plan a Trip</Link>
            <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 text-[#1E3A8A] flex items-center justify-center hover:bg-gray-100 transition-colors">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[110] lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
        <div className={`absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-base font-black text-[#1E3A8A]">GoWin Travels</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `block px-4 py-3 rounded-xl text-[15px] font-semibold mb-1 ${isActive ? 'bg-[#1E3A8A]/8 text-[#1E3A8A]' : 'text-[#0F172A] hover:bg-gray-50'}`}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Browse</div>
            <NavLink to="/destinations/national" className="block px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Nepal tours</NavLink>
            <NavLink to="/destinations/international" className="block px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">International holidays</NavLink>
          </nav>
          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link to="/booking" className="btn-primary w-full justify-center">Plan a Trip <ArrowRight className="w-4 h-4" /></Link>
            <div className="flex gap-2">
              {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#1E3A8A]"><Phone className="w-4 h-4" /> Call</a>}
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#1E3A8A]"><MessageCircle className="w-4 h-4 text-[#10B981]" /> WhatsApp</a>}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
