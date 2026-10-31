import React from 'react';
import { Inbox } from 'lucide-react';

/** Pass as="h1" when the empty state is the whole page (e.g. a missing package). */
const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', text, action = null, className = '', as: Heading = 'h3' }) => (
  <div className={`text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200 ${className}`}>
    <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-gray-300" aria-hidden="true" />
    </div>
    <Heading className="text-base font-bold text-[#0F172A] mb-1">{title}</Heading>
    {text && <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{text}</p>}
    {action && <div className="mt-5 flex flex-wrap gap-3 justify-center">{action}</div>}
  </div>
);

export default EmptyState;
