import React from 'react';
import { CheckCircle, Clock, XCircle, Flag, Mail, MailOpen, Archive, Eye, EyeOff, Star } from 'lucide-react';

const STYLES = {
  Pending:   { cls: 'text-amber-700 bg-amber-50 border-amber-200', Icon: Clock },
  Confirmed: { cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: CheckCircle },
  Completed: { cls: 'text-[#1E3A8A] bg-[#1E3A8A]/8 border-[#1E3A8A]/15', Icon: Flag },
  Cancelled: { cls: 'text-red-600 bg-red-50 border-red-200', Icon: XCircle },
  New:       { cls: 'text-amber-700 bg-amber-50 border-amber-200', Icon: Mail },
  Replied:   { cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: MailOpen },
  Closed:    { cls: 'text-gray-600 bg-gray-50 border-gray-200', Icon: Archive },
  Published: { cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: Eye },
  Draft:     { cls: 'text-gray-600 bg-gray-50 border-gray-200', Icon: EyeOff },
  Archived:  { cls: 'text-gray-600 bg-gray-50 border-gray-200', Icon: Archive },
  Featured:  { cls: 'text-[#B45309] bg-[#FBBF24]/15 border-[#FBBF24]/40', Icon: Star },
  Approved:  { cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: CheckCircle },
  Hidden:    { cls: 'text-gray-600 bg-gray-50 border-gray-200', Icon: EyeOff },
};

const StatusBadge = ({ status, className = '' }) => {
  const { cls, Icon } = STYLES[status] || STYLES.Draft;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${cls} ${className}`}>
      <Icon className="w-3 h-3" /> {status}
    </span>
  );
};

export default StatusBadge;
