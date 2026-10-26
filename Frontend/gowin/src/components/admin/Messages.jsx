import React, { useEffect, useMemo, useState } from 'react';
import { Mail, MessageSquare, Trash2, Calendar, MapPin, Phone, RefreshCw, CheckCircle, Archive, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import useMessageStore from '../Store/MessageStore';
import AdminPage, { Toolbar, SearchBox, Chips, ErrorBanner } from './AdminPage';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import StatusBadge from '../ui/StatusBadge';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '../../lib/format';
import { friendlyError } from '../../lib/errors';

const Messages = () => {
  const { messages, fetchMessages, updateMessage, deleteMessage, isLoading, loaded, error } = useMessageStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('New');
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { if (!loaded) fetchMessages(); }, [loaded, fetchMessages]);

  const counts = useMemo(() => ({ New: messages.filter((m) => (m.status || 'New') === 'New').length, Replied: messages.filter((m) => m.status === 'Replied').length, Closed: messages.filter((m) => m.status === 'Closed').length, All: messages.length }), [messages]);
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => (status === 'All' || (m.status || 'New') === status) && (!q || [m.name, m.email, m.message, m.destination, m.phone].some((v) => (v || '').toLowerCase().includes(q))));
  }, [messages, status, search]);

  const setStatusFor = async (m, next) => {
    setBusyId(m.id);
    const res = await updateMessage(m.id, { status: next });
    setBusyId(null);
    if (res.success) toast.success(`Marked as ${next}`);
    else toast.error(friendlyError(res.error));
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deleteMessage(confirm.id);
    setBusyId(null); setConfirm(null);
    if (res.success) toast.success('Message deleted');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Messages" subtitle="Enquiries sent through the contact form. Reply by email, then mark the message as Replied."
      actions={<button type="button" onClick={fetchMessages} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:text-[#1E3A8A]"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name, email or text…" />
        <Chips value={status} onChange={setStatus} options={['New', 'Replied', 'Closed', 'All'].map((s) => ({ value: s, label: s, count: counts[s] }))} />
      </Toolbar>
      {isLoading && !loaded ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={MessageSquare} title={messages.length === 0 ? 'No messages yet' : 'No messages in this view'} text="Contact form submissions appear here as soon as they are sent." />
      ) : (
        <div className="space-y-3">
          {list.map((m) => {
            const st = m.status || 'New';
            return (
              <article key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0 font-bold">{(m.name?.[0] || '?').toUpperCase()}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0F172A]">{m.name}</p>
                      <p className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5"><a href={`mailto:${m.email}`} className="hover:text-[#1E3A8A]">{m.email}</a>{m.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>}</p>
                      <p className="text-[11px] text-gray-400 mt-1 flex flex-wrap gap-x-3"><span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(m.created_at, { hour: '2-digit', minute: '2-digit' })}</span>{m.destination && <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold"><MapPin className="w-3 h-3" />{m.destination}</span>}</p>
                    </div>
                  </div>
                  <StatusBadge status={st} />
                </div>
                <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-line">{m.message}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your enquiry to GoWin Travels')}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold"><Mail className="w-3.5 h-3.5" /> Reply by email</a>
                  {st !== 'Replied' && <button type="button" disabled={busyId === m.id} onClick={() => setStatusFor(m, 'Replied')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold disabled:opacity-60"><CheckCircle className="w-3.5 h-3.5" /> Mark replied</button>}
                  {st !== 'Closed' && <button type="button" disabled={busyId === m.id} onClick={() => setStatusFor(m, 'Closed')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold disabled:opacity-60"><Archive className="w-3.5 h-3.5" /> Close</button>}
                  {st !== 'New' && <button type="button" disabled={busyId === m.id} onClick={() => setStatusFor(m, 'New')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold disabled:opacity-60"><RotateCcw className="w-3.5 h-3.5" /> Reopen</button>}
                  <button type="button" onClick={() => setConfirm(m)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold ml-auto"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Delete this message?" confirmLabel="Delete" message={<>The message from <strong>{confirm?.name}</strong> will be removed permanently.</>} onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Messages;
