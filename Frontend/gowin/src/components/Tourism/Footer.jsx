import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send, CheckCircle, ChevronRight, MessageCircle, Clock } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import useSubscriberStore from '../Store/SubscriberStore';
import { placePath, whatsappLink } from '../../lib/format';

const Footer = () => {
  const { places } = usePlaceStore();
  const { settings } = useSettingsStore();
  const { subscribe } = useSubscriberStore();
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const busyRef = useRef(false);

  const published = selectPublished(places);
  const nepal = published.filter((p) => p.destination_type === 'National').slice(0, 5);
  const world = published.filter((p) => p.destination_type !== 'National').slice(0, 5);
  const wa = whatsappLink(settings.whatsapp || settings.phone);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setState({ busy: true, done: false, error: '' });
    const res = await subscribe(email);
    busyRef.current = false;
    if (res.success) { setState({ busy: false, done: true, error: '' }); setEmail(''); }
    else setState({ busy: false, done: false, error: res.duplicate ? 'You are already subscribed.' : (typeof res.error === 'string' ? res.error : 'Could not subscribe right now. Please try again.') });
  };

  const col = 'text-xs font-bold text-white uppercase tracking-[0.18em] mb-4 flex items-center gap-2 before:content-[""] before:w-5 before:h-0.5 before:bg-[#10B981] before:rounded-full';
  const item = 'text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors group';

  return (
    <footer className="bg-[#0B1220] text-white relative overflow-hidden" role="contentinfo">
      <div className="h-1 w-full flex" aria-hidden="true">
        <span className="flex-1 bg-[#3B82F6]" /><span className="flex-1 bg-white" /><span className="flex-1 bg-[#EF4444]" /><span className="flex-1 bg-[#10B981]" /><span className="flex-1 bg-[#F59E0B]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={gowinLogo} alt="" width="40" height="40" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
              <p className="font-bold text-lg leading-tight">{settings.business_name}</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
              Kathmandu-based travel company arranging Nepal tours, international holidays, flights, hotels and visa assistance.
            </p>
            <ul className="space-y-2.5 text-sm">
              {settings.address && <li className="flex items-start gap-2.5 text-white/60"><MapPin className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />{settings.address}</li>}
              {settings.phone && <li><a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 text-white/60 hover:text-white"><Phone className="w-4 h-4 text-[#10B981] flex-shrink-0" />{settings.phone}</a></li>}
              {settings.email && <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-white/60 hover:text-white break-all"><Mail className="w-4 h-4 text-[#10B981] flex-shrink-0" />{settings.email}</a></li>}
              {settings.office_hours && <li className="flex items-center gap-2.5 text-white/60"><Clock className="w-4 h-4 text-[#10B981] flex-shrink-0" />{settings.office_hours}</li>}
            </ul>
            <div className="flex gap-2 mt-5">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#1877F2] hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>}
              {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#E1306C] hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>}
              {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#FF0000] hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>}
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#25D366] hover:text-white transition-colors"><MessageCircle className="w-4 h-4" /></a>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className={col}>Nepal</h2>
            <ul className="space-y-2.5">
              {nepal.map((p) => <li key={p.id}><Link to={placePath(p)} className={item}><ChevronRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#10B981]" /><span className="truncate">{p.title}</span></Link></li>)}
              <li><Link to="/destinations/national" className="text-[#10B981] text-xs font-bold hover:underline">All Nepal tours</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className={col}>World</h2>
            <ul className="space-y-2.5">
              {world.map((p) => <li key={p.id}><Link to={placePath(p)} className={item}><ChevronRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#10B981]" /><span className="truncate">{p.title}</span></Link></li>)}
              <li><Link to="/destinations/international" className="text-[#10B981] text-xs font-bold hover:underline">All international holidays</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className={col}>Company</h2>
            <ul className="space-y-2.5">
              {[['/about', 'About us'], ['/services', 'Our services'], ['/guides', 'Travel tips'], ['/support', 'Help & FAQ'], ['/contact', 'Contact'], ['/booking', 'Plan a trip']].map(([to, label]) => (
                <li key={to}><Link to={to} className={item}><ChevronRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#10B981]" />{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className={col}>Newsletter</h2>
            <p className="text-white/60 text-sm mb-3">Occasional offers and new destinations. No spam.</p>
            {state.done ? (
              <p className="flex items-center gap-2 text-sm text-[#34D399] bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl px-3 py-2.5"><CheckCircle className="w-4 h-4" /> You're subscribed.</p>
            ) : (
              <form onSubmit={onSubscribe} className="space-y-2">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <div className="flex gap-2">
                  <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/40" />
                  <button type="submit" disabled={state.busy} aria-label="Subscribe" className="w-11 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center disabled:opacity-60"><Send className="w-4 h-4" /></button>
                </div>
                {state.error && <p className="text-red-400 text-xs" role="alert">{state.error}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>© {new Date().getFullYear()} {settings.business_name}. Kathmandu, Nepal.</p>
          <nav className="flex flex-wrap justify-center gap-4" aria-label="Legal">
            <Link to="/terms" className="hover:text-white/80">Terms &amp; Conditions</Link>
            <Link to="/privacy" className="hover:text-white/80">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-white/80">Refund Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
