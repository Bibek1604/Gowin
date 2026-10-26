import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Trash2, Download, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useSubscriberStore from '../Store/SubscriberStore';
import AdminPage, { Toolbar, SearchBox, ErrorBanner } from './AdminPage';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '../../lib/format';
import { friendlyError } from '../../lib/errors';

const Subscribers = () => {
  const { subscribers, fetchSubscribers, deleteSubscriber, isLoading, loaded, error } = useSubscriberStore();
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { if (!loaded) fetchSubscribers(); }, [loaded, fetchSubscribers]);
  const list = useMemo(() => subscribers.filter((s) => !search.trim() || s.email.toLowerCase().includes(search.trim().toLowerCase())), [subscribers, search]);

  const exportCsv = () => {
    const rows = [['email', 'subscribed_at'], ...subscribers.map((s) => [s.email, s.created_at])];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gowin-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deleteSubscriber(confirm.id);
    setBusyId(null); setConfirm(null);
    if (res.success) toast.success('Subscriber removed');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Newsletter subscribers" subtitle="Email addresses collected from the footer sign-up form."
      actions={<button type="button" onClick={exportCsv} disabled={subscribers.length === 0} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:text-[#1E3A8A] disabled:opacity-50"><Download className="w-4 h-4" /> Export CSV</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar><SearchBox value={search} onChange={setSearch} placeholder="Search by email…" /><p className="text-sm text-gray-500 self-center px-2"><strong className="text-[#0F172A]">{subscribers.length}</strong> subscriber{subscribers.length === 1 ? '' : 's'}</p></Toolbar>
      {isLoading && !loaded ? (
        <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={Users} title="No subscribers" text="Sign-ups from the website footer will be listed here." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {list.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
              <span className="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#0F172A] truncate">{s.email}</p><p className="text-[11px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Subscribed {formatDate(s.created_at)}</p></div>
              <a href={`mailto:${s.email}`} className="text-xs font-semibold text-[#1E3A8A] hover:underline hidden sm:inline">Email</a>
              <button type="button" onClick={() => setConfirm(s)} aria-label="Remove subscriber" className="w-9 h-9 rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Remove this subscriber?" confirmLabel="Remove" message={<><strong>{confirm?.email}</strong> will be removed from the mailing list.</>} onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Subscribers;
