import React from 'react';

const base = 'w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm text-[#0F172A] placeholder-gray-400 transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25 focus:border-[#10B981]/60 disabled:opacity-60';
const border = (error) => (error ? 'border-red-300' : 'border-gray-200');

/** Label + control + hint/error wrapper so every form looks and behaves the same. */
export const Field = ({ label, hint, error, required, htmlFor, children, className = '' }) => (
  <div className={className}>
    {label && (
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
    )}
    {children}
    {error ? <p className="text-red-500 text-[11px] mt-1" role="alert">{error}</p> : hint ? <p className="text-gray-400 text-[11px] mt-1">{hint}</p> : null}
  </div>
);

export const Input = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <input ref={ref} className={`${base} ${border(error)} ${className}`} aria-invalid={!!error} {...props} />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ error, className = '', rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={`${base} resize-y ${border(error)} ${className}`} aria-invalid={!!error} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ error, className = '', children, ...props }, ref) => (
  <select ref={ref} className={`${base} cursor-pointer ${border(error)} ${className}`} aria-invalid={!!error} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';

export const Toggle = ({ checked, onChange, label, hint, disabled }) => (
  <label className={`flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-60' : ''}`}>
    <span className="relative inline-flex mt-0.5">
      <input type="checkbox" className="peer sr-only" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} disabled={disabled} />
      <span className="w-10 h-6 rounded-full bg-gray-200 peer-checked:bg-[#10B981] transition-colors" />
      <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
    </span>
    <span>
      <span className="block text-sm font-semibold text-[#0F172A]">{label}</span>
      {hint && <span className="block text-xs text-gray-500 mt-0.5">{hint}</span>}
    </span>
  </label>
);

export default Field;
