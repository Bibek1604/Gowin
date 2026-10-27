import React from 'react';

/** Consistent page header for every admin screen. */
const AdminPage = ({ title, subtitle, actions = null, children }) => (
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
    {children}
  </div>
);

export const Toolbar = ({ children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col md:flex-row gap-3 mb-5">{children}</div>
);

export const SearchBox = ({ value, onChange, placeholder = 'Search…', id = 'admin-search' }) => (
  <div className="relative flex-1 min-w-0">
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25" />
  </div>
);

export const Chips = ({ options, value, onChange }) => (
  <div className="flex gap-1.5 overflow-x-auto no-scrollbar min-w-0 max-w-full">
    {options.map((o) => (
      <button key={o.value} type="button" onClick={() => onChange(o.value)}
        className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${value === o.value ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-gray-50 text-gray-600 border-gray-100 hover:text-[#1E3A8A]'}`}>
        {o.label}{o.count !== undefined && <span className={`ml-1.5 ${value === o.value ? 'text-white/70' : 'text-gray-400'}`}>{o.count}</span>}
      </button>
    ))}
  </div>
);

export const ErrorBanner = ({ error }) => error ? (
  <p className="mb-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">{error}</p>
) : null;

export default AdminPage;
