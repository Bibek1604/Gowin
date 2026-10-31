import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZES = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };

/** Accessible dialog: Escape closes, backdrop closes, body scroll locked. */
const Modal = ({ open, onClose, title, subtitle, size = 'md', children, footer = null }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
          <div className="animate-fade absolute inset-0 bg-[#0F172A]/55 backdrop-blur-sm" onClick={onClose} />
          <div
            className={`animate-popIn relative w-full ${SIZES[size] || SIZES.md} bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-100">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#0F172A] leading-tight">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>
            {footer && <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">{footer}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
