import React from 'react';
import { Info, UserCheck, FileText, Activity, Database, ShieldCheck } from 'lucide-react';
import PageHero from '../ui/PageHero';
import useSettingsStore from '../Store/SettingsStore';
import { useSEO } from '../../lib/seo';

const PrivacyPolicy = () => {
  const { settings } = useSettingsStore();
  useSEO({ title: 'Privacy Policy', description: 'How Go Win International Travel and Tourism Pvt. Ltd. collects, uses and protects personal information for bookings, visa assistance and website visits.', path: '/privacy' });
  const block = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-6';
  const h = 'text-base font-bold text-[#0F172A] mb-2 flex items-center gap-2';
  return (
    <div className="bg-white">
      <PageHero title="Privacy Policy" label="Legal" subtitle="What we collect, why, and how it is protected. Effective 14 March 2026." crumbs={[{ label: 'Privacy Policy' }]} size="sm" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-5 text-sm text-gray-600 leading-relaxed">
        <article className={block}><h2 className={h}><Info className="w-4 h-4 text-[#10B981]" /> 1. Introduction</h2><p>Go Win International Travel and Tourism Pvt. Ltd. ("we", "our", "us") respects your privacy and is committed to protecting the personal information of customers, partners and website visitors. This policy explains how we collect, use, share and safeguard information when you use our services, visit our website or contact us.</p></article>
        <article className={block}>
          <h2 className={h}><UserCheck className="w-4 h-4 text-[#10B981]" /> 2. Information we collect</h2>
          <p className="mb-3">When you request a booking, ask for visa assistance, contact us or subscribe to our newsletter we may collect:</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Full name', 'Email address', 'Phone number', 'City / country', 'Travel dates and preferences', 'Passport details (for bookings)', 'Date of birth and nationality', 'Payment details (off-site)', 'Messages you send us'].map((i) => <li key={i} className="bg-[#F8FAFC] border border-gray-100 rounded-lg px-3 py-2 text-xs font-semibold text-[#0F172A]">{i}</li>)}
          </ul>
          <p className="mt-3">We may also collect technical information such as IP address, browser type and pages visited.</p>
        </article>
        <article className={`${block} !bg-[#1E3A8A] !border-[#1E3A8A] text-white`}>
          <h2 className="text-base font-bold mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-[#34D399]" /> 3. Visa applications</h2>
          <p className="text-white/80">For visa processing we may request additional documents required by the embassy, such as employment details, company registration documents, tax records, bank statements, business ownership proof or invitation letters. Clients are responsible for providing accurate and genuine documents.</p>
        </article>
        <article className={block}>
          <h2 className={h}><Activity className="w-4 h-4 text-[#10B981]" /> 4. How we use information</h2>
          <ul className="list-disc pl-5 space-y-1">
            {['Process travel bookings and enquiries', 'Arrange airline tickets, hotels and tours', 'Assist with visa applications and appointments', 'Send booking confirmations and updates', 'Provide customer support', 'Improve our services', 'Comply with legal requirements'].map((i) => <li key={i}>{i}</li>)}
          </ul>
        </article>
        <article className={block}><h2 className={h}><Database className="w-4 h-4 text-[#10B981]" /> 5. Sharing of information</h2><p>We share information only as needed to deliver your service: with airlines, hotels, tour operators, visa processing centres (such as VFS Global), insurance companies and government authorities or embassies. We do not sell personal data.</p></article>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className={block}><h2 className={h}><ShieldCheck className="w-4 h-4 text-[#10B981]" /> 6. Data protection</h2><p>Your data is stored in access-controlled systems. We take reasonable technical and organisational measures against unauthorised access, loss or disclosure.</p></article>
          <article className={block}><h2 className={h}><Info className="w-4 h-4 text-[#10B981]" /> 7. Cookies</h2><p>This website uses only the cookies and local storage needed for it to function (for example to keep staff signed in). You can disable cookies in your browser.</p></article>
        </div>
        <article className={block}>
          <div className="space-y-4">
            {[['8. Third-party websites', 'Links to external websites are provided for convenience. We are not responsible for their privacy practices.'], ['9. Data retention', 'We keep personal data only as long as needed to provide services, meet legal obligations and resolve disputes.'], ['10. Children', 'Our services are not intended for individuals under 18 without parental consent.'], ['11. Changes', 'We may update this policy at any time; the effective date above will change accordingly.']].map(([t, d]) => <div key={t}><p className="font-bold text-[#0F172A]">{t}</p><p>{d}</p></div>)}
          </div>
        </article>
        <article className={`${block} text-center`}><h2 className="text-base font-bold text-[#0F172A] mb-2">12. Contact</h2><p>Questions about this policy: {settings.email ? <a href={`mailto:${settings.email}`} className="text-[#1E3A8A] font-semibold">{settings.email}</a> : 'our office'}{settings.address ? <> · {settings.address}</> : ''}</p></article>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
