import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Phone, MessageCircle, ShieldCheck, MapPin, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import useBookingStore from '../Store/BookingStore';
import useSettingsStore from '../Store/SettingsStore';
import PageHero from '../ui/PageHero';
import SmartImage from '../ui/SmartImage';
import { Field, Input, Select, Textarea } from '../ui/FormField';
import { HOW_IT_WORKS } from '../../data/siteContent';
import { useSEO } from '../../lib/seo';
import { useHeroImage } from '../../lib/useHeroImage';
import { friendlyError } from '../../lib/errors';
import { formatPrice, isNepal, coverImage, whatsappLink } from '../../lib/format';

const CUSTOM = '__custom__';
const INITIAL = { name: '', email: '', phone: '', address: '', package: '', travelDate: '', travelers: 2, message: '' };
const today = () => new Date().toISOString().slice(0, 10);

const Booking = () => {
  const { places, loaded } = usePlaceStore();
  const { addBooking } = useBookingStore();
  const { settings } = useSettingsStore();
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const busyRef = useRef(false);

  const published = useMemo(() => selectPublished(places), [places]);
  const nepal = published.filter(isNepal);
  const world = published.filter((p) => !isNepal(p));

  // Pre-select a package from ?package=slug (or legacy router state)
  useEffect(() => {
    const wanted = params.get('package') || location.state?.preFilledDestination;
    if (!wanted || !loaded) return;
    const match = published.find((p) => p.slug === wanted || p.id === wanted);
    if (match) setForm((f) => ({ ...f, package: match.id }));
  }, [params, location.state, loaded, published]);

  const heroImage = useHeroImage(/pokhara|phewa/i);
  useSEO({ title: 'Plan a Trip / Booking Request', description: 'Request a tour package or a custom itinerary from GoWin Travels. No online payment — we confirm availability and send a written quote.', path: '/booking', image: heroImage || undefined });

  const selected = published.find((p) => p.id === form.package);
  const update = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })); };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'Enter a valid email address.';
    if (form.phone.replace(/[^0-9]/g, '').length < 7) er.phone = 'Enter a phone number we can reach you on (with country code).';
    if (!form.package) er.package = 'Choose a package or the custom trip option.';
    if (!form.travelDate) er.travelDate = 'Pick a preferred travel date.';
    else if (form.travelDate < today()) er.travelDate = 'Travel date must be in the future.';
    const n = parseInt(form.travelers, 10);
    if (!n || n < 1 || n > 100) er.travelers = 'Enter the number of travellers (1–100).';
    if (form.package === CUSTOM && form.message.trim().length < 10) er.message = 'Tell us a little about the trip you have in mind.';
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    const er = validate();
    if (Object.keys(er).length) { setErrors(er); toast.error('Please check the highlighted fields.'); return; }
    busyRef.current = true; setBusy(true);
    const res = await addBooking({
      tour_id: form.package === CUSTOM ? null : form.package,
      tour_title: form.package === CUSTOM ? 'Custom trip request' : selected?.title,
      user_name: form.name, user_email: form.email, phone: form.phone, num_people: form.travelers,
      travel_date: form.travelDate, address: form.address, message: form.message,
    });
    busyRef.current = false; setBusy(false);
    if (res.success) { setDone({ email: form.email.trim(), title: form.package === CUSTOM ? 'your custom trip' : selected?.title }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else toast.error(friendlyError(res.error, 'We could not send your request. Please try again or contact us directly.'));
  };

  const wa = whatsappLink(settings.whatsapp || settings.phone, selected ? `Hello GoWin Travels, I'd like to request "${selected.title}".` : 'Hello GoWin Travels, I would like to plan a trip.');

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
          <span className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8" /></span>
          <h1 className="heading-font text-2xl sm:text-3xl text-[#0F172A] mb-3">Request received</h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Thank you — we have your request for <strong>{done.title}</strong>. Our team will check availability and reply to <strong className="text-[#1E3A8A]">{done.email}</strong> within one working day with an itinerary and quote.</p>
          <p className="text-gray-400 text-xs mt-4">Nothing has been charged. A booking is confirmed only after you approve the quotation.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button type="button" onClick={() => navigate('/')} className="flex-1 btn-primary justify-center">Back to home <ArrowRight className="w-4 h-4" /></button>
            <Link to="/destinations" className="flex-1 btn-secondary justify-center">Browse more</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <PageHero title="Plan your trip" label="Booking request" subtitle="Choose a package or describe a custom trip. We confirm availability and send a written quote — no online payment." image={heroImage} crumbs={[{ label: 'Plan a trip' }]} size="sm" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8">
        <form onSubmit={submit} noValidate className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Your details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fields marked * are required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" required error={errors.name} htmlFor="b-name"><Input id="b-name" value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" placeholder="Your name" /></Field>
            <Field label="Email" required error={errors.email} htmlFor="b-email"><Input id="b-email" type="email" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" placeholder="you@example.com" /></Field>
            <Field label="Phone / WhatsApp" required error={errors.phone} htmlFor="b-phone"><Input id="b-phone" type="tel" value={form.phone} onChange={update('phone')} error={errors.phone} autoComplete="tel" placeholder="+977 98xxxxxxxx" /></Field>
            <Field label="City / country" error={errors.address} htmlFor="b-address"><Input id="b-address" value={form.address} onChange={update('address')} autoComplete="address-level2" placeholder="e.g. Kathmandu, Nepal" /></Field>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0F172A] mt-2">Trip details</h2>
          </div>
          <Field label="Package" required error={errors.package} htmlFor="b-package" hint={!loaded ? 'Loading packages…' : undefined}>
            <Select id="b-package" value={form.package} onChange={update('package')} error={errors.package} disabled={!loaded}>
              <option value="">Choose a package…</option>
              <option value={CUSTOM}>✨ Custom trip — let us plan it for me</option>
              {nepal.length > 0 && <optgroup label="Nepal">{nepal.map((p) => <option key={p.id} value={p.id}>{p.title}{p.location ? ` — ${p.location}` : ''}</option>)}</optgroup>}
              {world.length > 0 && <optgroup label="International">{world.map((p) => <option key={p.id} value={p.id}>{p.title}{p.location ? ` — ${p.location}` : ''}</option>)}</optgroup>}
            </Select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Preferred travel date" required error={errors.travelDate} htmlFor="b-date"><Input id="b-date" type="date" min={today()} value={form.travelDate} onChange={update('travelDate')} error={errors.travelDate} /></Field>
            <Field label="Number of travellers" required error={errors.travelers} htmlFor="b-travelers"><Input id="b-travelers" type="number" min="1" max="100" value={form.travelers} onChange={update('travelers')} error={errors.travelers} /></Field>
          </div>
          <Field label={form.package === CUSTOM ? 'Describe your trip' : 'Anything we should know?'} required={form.package === CUSTOM} error={errors.message} htmlFor="b-message" hint="Hotel preferences, budget, special occasions, dietary needs…">
            <Textarea id="b-message" rows={4} value={form.message} onChange={update('message')} error={errors.message} placeholder={form.package === CUSTOM ? 'Where would you like to go, for how long, and what matters most to you?' : 'Optional'} />
          </Field>

          <button type="submit" disabled={busy} className="btn-primary w-full justify-center !py-4 disabled:opacity-60 disabled:cursor-not-allowed">
            {busy ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Send booking request</>}
          </button>
          <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> No payment is taken on this website. Your details are used only to reply to your request.</p>
        </form>

        <aside className="lg:w-80 space-y-4">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <SmartImage src={coverImage(selected)} alt={selected.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-sm leading-snug">{selected.title}</h3>
                {selected.location && <p className="flex items-center gap-1 text-gray-500 text-xs mt-1"><MapPin className="w-3 h-3" /> {selected.location}</p>}
                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-500 flex items-center gap-1 text-xs"><Clock className="w-3.5 h-3.5" />{selected.duration || 'Flexible'}</span>
                  <span className="font-black text-[#1E3A8A]">{formatPrice(selected.price) ? <>{formatPrice(selected.price)}<span className="text-[10px] font-normal text-gray-400"> /pp</span></> : 'On request'}</span>
                </div>
              </div>
            </div>
          ) : form.package === CUSTOM ? (
            <div className="bg-[#1E3A8A] text-white rounded-2xl p-5">
              <Sparkles className="w-6 h-6 text-[#34D399] mb-2" />
              <h3 className="font-bold">Custom trip</h3>
              <p className="text-white/70 text-sm mt-1 leading-relaxed">Tell us your ideas and we'll design an itinerary with hotels, transport and activities to suit your group.</p>
            </div>
          ) : null}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#0F172A] text-sm mb-4">What happens next</h3>
            <ol className="space-y-3">
              {HOW_IT_WORKS.map((s) => (
                <li key={s.num} className="flex gap-3"><span className="w-7 h-7 rounded-lg bg-[#1E3A8A]/8 text-[#1E3A8A] text-[11px] font-bold flex items-center justify-center flex-shrink-0">{s.num}</span><div><p className="text-sm font-semibold text-[#0F172A]">{s.title}</p><p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p></div></li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-[#0F172A] text-sm mb-1">Prefer to talk?</h3>
            <p className="text-xs text-gray-500 mb-3">{settings.office_hours}</p>
            <div className="space-y-2">
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#128C7E] hover:underline"><MessageCircle className="w-4 h-4" /> WhatsApp</a>}
              {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:underline"><Phone className="w-4 h-4" /> {settings.phone}</a>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
