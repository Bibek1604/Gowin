import React from 'react';
import { Ban, ShieldAlert, Calendar, AlertCircle, CreditCard, Users, Clock } from 'lucide-react';
import PageHero from '../ui/PageHero';
import useSettingsStore from '../Store/SettingsStore';
import { useSEO } from '../../lib/seo';

const SECTIONS = [
  { Icon: Ban, title: '1. Service charges', body: 'All consultation fees, service charges and administrative fees paid to Go Win International Travel and Tourism Pvt. Ltd. are non-refundable. These charges cover professional services such as consultation, document preparation, application assistance and administrative work.' },
  { Icon: ShieldAlert, title: '2. Visa application fees', body: 'Visa fees paid to embassies, consulates or visa centres are non-refundable regardless of whether the visa is approved or rejected.' },
  { Icon: Calendar, title: '3. Visa centre appointment fees', body: 'Fees paid for VFS Global or other visa centre appointments are generally non-refundable. Refund eligibility follows the official policy of the respective visa centre.' },
  { Icon: AlertCircle, title: '4. Travel insurance', body: 'Travel insurance purchased through our agency is subject to the terms and refund policy of the insurance provider. If the customer breaches the policy conditions, a refund may not be granted.' },
  { Icon: CreditCard, title: '5. Travel packages, tickets and hotels', body: 'Refunds for airline tickets, hotels, tour packages or other travel services depend entirely on the terms and conditions of the respective airline, hotel or service provider. Cancellations must be made within the provider\'s specified window.' },
  { Icon: ShieldAlert, title: '6. Third-party services', body: 'Many services are provided by third-party partners such as airlines, hotels, visa centres, insurance companies and tour operators. Refunds for these services are subject to their individual policies and are passed on to you without deduction once received.' },
  { Icon: Users, title: '7. Client responsibility', body: 'Clients must provide accurate information, complete documentation and attend appointments as scheduled. Failure to do so may result in loss of payments without refund.' },
  { Icon: Clock, title: '8. Processing time', body: 'If a refund is approved by a third-party provider, processing time depends on that provider and the banks involved. We forward refunds we receive within 3 business days.' },
];

const RefundPolicy = () => {
  const { settings } = useSettingsStore();
  useSEO({ title: 'Refund Policy', description: 'Refund terms for tours, tickets, hotels, visa assistance and insurance arranged by Go Win International Travel and Tourism Pvt. Ltd.', path: '/refund' });
  return (
    <div className="bg-white">
      <PageHero title="Refund Policy" label="Legal" subtitle="How refunds work for the services we arrange. Effective 14 March 2026." crumbs={[{ label: 'Refund Policy' }]} size="sm" />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SECTIONS.map(({ Icon, title, body }) => (
            <article key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <span className="w-10 h-10 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></span>
              <h2 className="text-base font-bold text-[#0F172A] mb-2">{title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 text-sm text-gray-600 leading-relaxed">
          <p className="font-bold text-[#0F172A] mb-1">Changes and questions</p>
          <p>Go Win International Travel and Tourism Pvt. Ltd. may update this policy at any time. Questions about a specific booking can be sent to {settings.email ? <a href={`mailto:${settings.email}`} className="text-[#1E3A8A] font-semibold">{settings.email}</a> : 'our office'}{settings.phone ? <> or {settings.phone}</> : ''}.</p>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
