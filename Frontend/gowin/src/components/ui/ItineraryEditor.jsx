import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

/** Day-by-day itinerary editor: [{ day, title, description }]. */
const ItineraryEditor = ({ value = [], onChange }) => {
  const days = Array.isArray(value) ? value : [];

  const update = (i, patch) => onChange(days.map((d, k) => (k === i ? { ...d, ...patch } : d)));
  const remove = (i) => onChange(days.filter((_, k) => k !== i).map((d, k) => ({ ...d, day: k + 1 })));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= days.length) return;
    const next = [...days];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((d, k) => ({ ...d, day: k + 1 })));
  };
  const add = () => onChange([...days, { day: days.length + 1, title: '', description: '' }]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-[#1E3A8A]">Day-by-day itinerary <span className="text-gray-400 font-normal">(optional)</span></label>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] hover:text-[#059669]">
          <Plus className="w-3.5 h-3.5" /> Add day
        </button>
      </div>
      {days.length === 0 ? (
        <p className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
          No itinerary yet. Visitors will see "Detailed itinerary shared on request".
        </p>
      ) : (
        <div className="space-y-3">
          {days.map((d, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">D{i + 1}</span>
                <input
                  value={d.title || ''}
                  onChange={(e) => update(i, { title: e.target.value })}
                  placeholder={`Day ${i + 1} title, e.g. Arrival in Kathmandu`}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25"
                />
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === days.length - 1} aria-label="Move down" className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => remove(i)} aria-label="Remove day" className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <textarea
                value={d.description || d.desc || ''}
                onChange={(e) => update(i, { description: e.target.value })}
                rows={2}
                placeholder="What happens on this day"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#10B981]/25"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryEditor;
