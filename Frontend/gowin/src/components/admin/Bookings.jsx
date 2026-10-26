import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Mail, Phone, MessageCircle, Trash2, ChevronDown, ChevronUp, MapPin, Users, Calendar, StickyNote, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import useBookingStore, { BOOKING_STATUSES } from '../Store/BookingStore';
import usePlaceStore from '../Store/PlaceStore';
import AdminPage, { Toolbar, SearchBox, Chips, ErrorBanner } from './AdminPage';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import StatusBadge from '../ui/StatusBadge';
import { Select, Textarea } from '../ui/FormField';
import { Skeleton } from '../ui/Skeleton';
import { formatDate, whatsappLink } from '../../lib/format';
import { friendlyError } from '../../lib/errors';

const Bookings = () => {
  const { bookings, fetchBookings, updateBooking, deleteBooking, isLoading, loaded, error } = useBookingStore();
  const { places } = usePlaceStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Pending');
  const [openId, setOpenId] = useState(null);
  const [notes, setNotes] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { if (!loaded) fetchBookings(); }, [loaded, fetchBookings]);

  const packageName = (b) => b.tour_title || places.find((p) => p.id === b.tour_id)?.title || (b.tour_id ? 'Package (removed)' : 'Custom trip request');
  const counts = useMemo(() => Object.fromEntries(['All', ...BOOKING_STATUSES].map((s) => [s, s === 'All' ? bookings.length : bookings.filter((b) => (b.status || 'Pending') === s).length])), [bookings]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => (status === 'All' || (b.status || 'Pending') === status) && (!q || [b.user_name, b.user_email, b.phone, packageName(b)].some((v) => (v || '').toLowerCase().includes(q))));
  }, [bookings, status, search, places]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatusFor = async (b, next) => {
    if (next === (b.status || 'Pending')) return;
    setBusyId(b.id);
    const res = await updateBooking(b.id, { status: next });
    setBusyId(null);
    if (res.success) toast.success(`Marked as ${next}`);
    else toast.error(friendlyError(res.error));
  };

  const saveNotes = async (b) => {
    setBusyId(b.id);
    const res = await updateBooking(b.id, { admin_notes: notes[b.id] ?? b.admin_notes ?? '' });
    setBusyId(null);
    if (res.success) toast.success('Notes saved');
    else toast.error(friendlyError(res.error));
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deleteBooking(confirm.id);
    setBusyId(null); setConfirm(null);
    if (res.success) toast.success('Booking deleted');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Bookings" subtitle="Requests sent from the website. Confirm after you have sent a quote; mark Completed after the trip."
      actions={<button type="button" onClick={fetchBookings} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:text-[#1E3A8A]"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by name, email, phone or package…" />
        <Chips value={status} onChange={setStatus} options={['Pending', 'Confirmed', 'Completed', 'Cancelled', 'All'].map((s) => ({ value: s, label: s, count: counts[s] }))} />
      </Toolbar>

      {isLoading && !loaded ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={CalendarCheck} title={bookings.length === 0 ? 'No booking requests yet' : `No ${status === 'All' ? '' : status.toLowerCase()} bookings`} text="New requests from the website's booking form appear here." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {list.map((b) => {
            const open = openId === b.id;
            const st = b.status || 'Pending';
            const wa = whatsappLink(b.phone, `Hello ${b.user_name}, this is GoWin Travels regarding your request for ${packageName(b)}.`);
            return (
              <div key={b.id} className="px-4 sm:px-5 py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex items-center gap-3 md:w-[28%] min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] font-bold flex items-center justify-center flex-shrink-0">{(b.user_name?.[0] || 'T').toUpperCase()}</span>
                    <div className="min-w-0"><p className="text-sm font-semibold text-[#0F172A] truncate">{b.user_name}</p><p className="text-xs text-gray-500 truncate">{b.user_email}</p></div>
                  </div>
                  <div className="md:flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <p className="flex items-center gap-1 col-span-2 sm:col-span-1 truncate"><MapPin className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" /><span className="truncate">{packageName(b)}</span></p>
                    <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" />{b.travel_date || 'TBC'}</p>
                    <p className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" />{b.num_people} traveller{b.num_people === 1 ? '' : 's'}</p>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <StatusBadge status={st} />
                    <Select value={st} onChange={(e) => setStatusFor(b, e.target.value)} disabled={busyId === b.id} className="!py-1.5 !w-auto text-xs font-semibold" aria-label="Change status">{BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select>
                    <button type="button" onClick={() => setOpenId(open ? null : b.id)} aria-expanded={open} aria-label="Details" className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100">{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                  </div>
                </div>
                {open && (
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Request details</p>
                      <p><span className="text-gray-500">Received:</span> {formatDate(b.created_at || b.booking_date, { hour: '2-digit', minute: '2-digit' })}</p>
                      {b.phone && <p><span className="text-gray-500">Phone:</span> {b.phone}</p>}
                      {b.address && <p><span className="text-gray-500">From:</span> {b.address}</p>}
                      {b.message ? <p className="whitespace-pre-line"><span className="text-gray-500">Message:</span> {b.message}</p> : <p className="text-gray-400">No message left.</p>}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <a href={`mailto:${b.user_email}?subject=${encodeURIComponent(`Your GoWin Travels request: ${packageName(b)}`)}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold"><Mail className="w-3.5 h-3.5" /> Reply by email</a>
                        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a>}
                        {b.phone && <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700"><Phone className="w-3.5 h-3.5" /> Call</a>}
                        <button type="button" onClick={() => setConfirm(b)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold ml-auto"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-2 flex items-center gap-1"><StickyNote className="w-3.5 h-3.5" /> Internal notes</p>
                      <Textarea rows={4} value={notes[b.id] ?? b.admin_notes ?? ''} onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))} placeholder="Quote sent, hotel options, follow-up date…" className="!bg-white" />
                      <button type="button" onClick={() => saveNotes(b)} disabled={busyId === b.id} className="mt-2 px-3 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold disabled:opacity-60">Save notes</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Delete this booking request?" confirmLabel="Delete" message={<>The request from <strong>{confirm?.user_name}</strong> will be removed permanently. Prefer marking it Cancelled to keep a record.</>} onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Bookings;
