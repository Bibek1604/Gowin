import React from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, FileText, HelpCircle, Scale } from 'lucide-react';
import PageHero from '../ui/PageHero';
import { useSEO } from '../../lib/seo';

const TermsConditions = () => {
  useSEO({ title: 'Terms & Conditions', description: 'Terms and conditions for using the GoWin Travels website and travel services provided by Go Win International Travel and Tourism Pvt. Ltd.', path: '/terms' });
  const block = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-6';
  const h = 'text-base font-bold text-[#0F172A] mb-2 flex items-center gap-2';
  return (
    <div className="bg-white">
      <PageHero title="Terms & Conditions" label="Legal" subtitle="The agreement between you and Go Win International Travel and Tourism Pvt. Ltd. Last updated 14 March 2026." crumbs={[{ label: 'Terms & Conditions' }]} size="sm" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-5 text-sm text-gray-600 leading-relaxed">
        <article className={block}><h2 className={h}><ShieldCheck className="w-4 h-4 text-[#10B981]" /> 1. Agreement to terms</h2><p>By using our website or services you agree to these terms and conditions. Go Win International Travel and Tourism Pvt. Ltd. provides travel arrangement services subject to your compliance with the terms, conditions and notices contained here.</p></article>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className={block}><h2 className={h}><CheckCircle className="w-4 h-4 text-[#10B981]" /> 2. Bookings and confirmation</h2><p>Requests made through this website are enquiries, not confirmed bookings. All bookings are subject to availability. A booking is confirmed only once you approve our written quotation and the agreed payment or deposit has been received.</p></article>
          <article className={block}><h2 className={h}><AlertTriangle className="w-4 h-4 text-[#10B981]" /> 3. Liability</h2><p>While we take care to arrange quality services, we are not liable for disruptions caused by third-party providers (airlines, hotels, transport operators), weather, natural events or decisions of government authorities and embassies.</p></article>
        </div>
        <article className={`${block} !bg-[#1E3A8A] !border-[#1E3A8A] text-white`}>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-[#34D399]" /> 4. Your responsibilities</h2>
          <ul className="space-y-2">
            {['Provide accurate personal, contact and payment details.', 'Hold valid travel documents (passport, visas, permits) for your itinerary.', 'Follow the local laws and customs of the places you visit.', 'Tell us promptly about any change or cancellation.'].map((t) => <li key={t} className="flex gap-2 text-white/85"><CheckCircle className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />{t}</li>)}
          </ul>
        </article>
        <article className={block}><h2 className={h}><HelpCircle className="w-4 h-4 text-[#10B981]" /> 5. Prices and content</h2><p>Prices shown on this website are indicative starting prices per person and may change with season, availability, group size and exchange rates. The price in your written quotation is the price that applies. We correct errors and update content regularly but cannot guarantee that every detail is complete at all times.</p></article>
        <article className={block}><h2 className={h}><ShieldCheck className="w-4 h-4 text-[#10B981]" /> 6. Intellectual property</h2><p>Content, branding and logos on this website belong to Go Win International Travel and Tourism Pvt. Ltd. or are used under licence; photographs from third parties are credited where required. Unauthorised reproduction is prohibited.</p></article>
        <article className={`${block} text-center`}><h2 className="text-base font-bold text-[#0F172A] mb-2 flex items-center justify-center gap-2"><Scale className="w-4 h-4 text-[#10B981]" /> Governing law</h2><p>These terms are governed by the laws of Nepal. Any dispute is subject to the jurisdiction of the courts of Kathmandu.</p></article>
      </section>
    </div>
  );
};

export default TermsConditions;
