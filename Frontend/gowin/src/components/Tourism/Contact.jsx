import React, { useRef, useState } from 'react';
import { useSpamGuard } from '../../lib/useSpamGuard';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useMessageStore from '../Store/MessageStore';
import useSettingsStore from '../Store/SettingsStore';
import useCategoryStore, { selectActive } from '../Store/CategoryStore';
import PageHero from '../ui/PageHero';
import { Field, Input, Select, Textarea } from '../ui/FormField';
import { useSEO, pageJsonLd } from '../../lib/seo';
import { BANNERS } from '../../data/pageBanners';
import { friendlyError } from '../../lib/errors';
import { whatsappLink } from '../../lib/format';

const INITIAL = { name: '', email: '', phone: '', destination: '', message: '' };

const Contact = () => {
  const { addMessage } = useMessageStore();
  const { settings } = useSettingsStore();
  const { categories } = useCategoryStore();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const busyRef = useRef(false);
  const guard = useSpamGuard('contact');

  const heroImage = BANNERS.contact;
  useSEO({ title: 'Contact Us', description: `Contact GoWin International Travel & Tourism in Kathmandu: ${settings.phone}, ${settings.email}. ${settings.office_hours}.`, path: '/contact', image: heroImage || undefined, jsonLd: pageJsonLd(settings) });

  const update = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })); };
  const submit = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) er.message = 'Please write a few words about what you need.';
    if (Object.keys(er).length) { setErrors(er); return; }
    const spam = guard.check();
    if (spam?.error) { toast.error(spam.error); return; }
    if (spam?.bot) { setSent(true); setForm(INITIAL); return; } // looks automated: show success, send nothing
    busyRef.current = true; setBusy(true);
    const res = await addMessage(form);
    busyRef.current = false; setBusy(false);
    if (res.success) { guard.markSent(); setSent(true); setForm(INITIAL); toast.success('Message sent — we will reply within one working day.'); }
    else toast.error(friendlyError(res.error, 'Could not send your message. Please email or call us instead.'));
  };

  const wa = whatsappLink(settings.whatsapp || settings.phone, 'Hello GoWin Travels, I have a question.');
  const info = [
    settings.address && { Icon: MapPin, label: 'Office', value: settings.address },
    settings.phone && { Icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, '')}` },
    wa && { Icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp || settings.phone, href: wa, external: true },
    settings.email && { Icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.office_hours && { Icon: Clock, label: 'Office hours', value: settings.office_hours },
  ].filter(Boolean);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <PageHero title="Get in touch" label="Contact" subtitle="Questions about a package, a visa, flights or a custom trip? Message us and a member of the Kathmandu team will reply." image={heroImage} crumbs={[{ label: 'Contact' }]} size="sm" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {info.map(({ Icon, label, value, href, external }) => {
              const body = (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow h-full">
                  <span className="w-11 h-11 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5" /></span>
                  <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span><span className="block text-sm font-bold text-[#0F172A] break-words">{value}</span></span>
                </div>
              );
              return href ? <a key={label} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a> : <div key={label}>{body}</div>;
            })}
          </div>
          {(settings.facebook_url || settings.instagram_url) && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-auto">Follow us</span>
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-gray-50 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>}
              {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-gray-50 text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>}
            </div>
          )}
          {settings.map_query && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-56 bg-gray-100">
              <iframe title="Office location map" src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.map_query)}&z=15&output=embed`} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          )}
        </div>

        <form onSubmit={submit} noValidate className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-5 self-start">
          {guard.honeypot}
          <div><h2 className="text-lg font-bold text-[#0F172A]">Send us a message</h2><p className="text-xs text-gray-500 mt-0.5">We reply within one working day.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" required error={errors.name} htmlFor="c-name"><Input id="c-name" maxLength={120} value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" /></Field>
            <Field label="Email" required error={errors.email} htmlFor="c-email"><Input id="c-email" maxLength={254} type="email" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" /></Field>
            <Field label="Phone / WhatsApp" htmlFor="c-phone"><Input id="c-phone" maxLength={40} type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="Optional" /></Field>
            <Field label="I'm interested in" htmlFor="c-dest">
              <Select id="c-dest" value={form.destination} onChange={update('destination')}>
                <option value="">Select a topic</option>
                <option value="Nepal tours">Nepal tours</option>
                <option value="International holidays">International holidays</option>
                {selectActive(categories).map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="Flights & hotels">Flights &amp; hotels</option>
                <option value="Visa assistance">Visa assistance</option>
                <option value="Travel insurance">Travel insurance</option>
                <option value="Other">Something else</option>
              </Select>
            </Field>
          </div>
          <Field label="Message" required error={errors.message} htmlFor="c-message"><Textarea id="c-message" maxLength={3000} rows={5} value={form.message} onChange={update('message')} error={errors.message} placeholder="Travel dates, group size, budget, questions…" /></Field>
          {sent && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"><CheckCircle className="w-4 h-4" /> Message received. We'll get back to you shortly.</p>}
          <button type="submit" disabled={busy} className="btn-secondary w-full justify-center !py-3.5 disabled:opacity-60">{busy ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send message</>}</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
