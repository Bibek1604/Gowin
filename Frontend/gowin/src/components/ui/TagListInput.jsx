import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

/** Simple list editor for highlights / inclusions / exclusions. Enter adds an item. */
const TagListInput = ({ label, value = [], onChange, placeholder = 'Type and press Enter', hint, color = 'emerald' }) => {
  const [draft, setDraft] = useState('');
  const items = Array.isArray(value) ? value : [];
  const chip = color === 'red' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#10B981]/10 text-[#047857] border-[#10B981]/20';

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...items, text]);
    setDraft('');
  };

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">{label}</label>}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25"
        />
        <button type="button" onClick={add} aria-label="Add item" className="px-3 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#172554] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-3">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full border text-xs font-semibold ${chip}`}>
              {item}
              <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label={`Remove ${item}`} className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagListInput;
