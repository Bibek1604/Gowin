import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', text, action = null, className = '' }) => (
  <div className={`text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200 ${className}`}>
    <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-gray-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-gray-300" />
    </div>
    <h3 className="text-base font-bold text-[#0F172A] mb-1">{title}</h3>
    {text && <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{text}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
