import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Clock, MapPin, HelpCircle, ArrowRight } from 'lucide-react';
import useSettingsStore from '../Store/SettingsStore';
import PageHero from '../ui/PageHero';
import { FAQS } from '../../data/siteContent';
import { useSEO } from '../../lib/seo';
import { useHeroImage } from '../../lib/useHeroImage';
import { whatsappLink } from '../../lib/format';

const ContactSupport = () => {
  const { settings } = useSettingsStore();
  const heroImage = useHeroImage(/lumbini|kathmandu/i, { nepalOnly: true });
  useSEO({
    title: 'Help & FAQ',
    description: 'Answers to common questions about booking, custom trips, flights, hotels, visas, refunds and payments with GoWin Travels.',
    path: '/support',
    image: heroImage || undefined,
    jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  });
  const wa = whatsappLink(settings.whatsapp || settings.phone, 'Hello GoWin Travels, I need some help.');

  const channels = [
    wa && { Icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp || settings.phone, href: wa, note: 'Fastest reply', external: true },
    settings.phone && { Icon: Phone, label: 'Call us', value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, '')}`, note: settings.office_hours },
    settings.email && { Icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}`, note: 'Reply within one working day' },
  ].filter(Boolean);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <PageHero title="Help & frequently asked questions" label="Support" subtitle="How bookings, quotes, visas and refunds work — and how to reach a real person quickly." image={heroImage} crumbs={[{ label: 'Help' }]} size="sm" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          {channels.map(({ Icon, label, value, href, note, external }) => (
            <a key={label} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <span className="w-12 h-12 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5" /></span>
              <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span><span className="block font-bold text-[#0F172A] break-words">{value}</span>{note && <span className="block text-xs text-[#10B981] font-semibold mt-0.5">{note}</span>}</span>
            </a>
          ))}
          {settings.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Visit our office</p>
              <p className="flex items-start gap-2 text-sm font-semibold text-[#0F172A]"><MapPin className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />{settings.address}</p>
              {settings.office_hours && <p className="flex items-start gap-2 text-sm text-gray-500 mt-2"><Clock className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />{settings.office_hours}</p>}
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="heading-font text-2xl sm:text-3xl text-[#0F172A] mb-5">Frequently asked</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                <summary className="flex items-start gap-3 cursor-pointer list-none text-sm font-bold text-[#0F172A]"><HelpCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />{f.q}</summary>
                <p className="mt-3 pl-7 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 bg-[#1E3A8A] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><p className="font-bold">Still have a question?</p><p className="text-white/70 text-sm">Send us a message and we'll get back to you.</p></div>
            <Link to="/contact" className="btn-primary flex-shrink-0">Contact us <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSupport;
