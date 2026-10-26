import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarCheck, Mail, Users, Star, Tags, ArrowRight, AlertTriangle, CheckCircle2, Plus, Image as ImageIcon } from 'lucide-react';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import useCategoryStore from '../Store/CategoryStore';
import useBookingStore from '../Store/BookingStore';
import useMessageStore from '../Store/MessageStore';
import useTestimonialStore from '../Store/TestimonialStore';
import useSubscriberStore from '../Store/SubscriberStore';
import AdminPage from './AdminPage';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../lib/format';

const Dashboard = () => {
  const { places, loaded: placesLoaded } = usePlaceStore();
  const { categories } = useCategoryStore();
  const { bookings } = useBookingStore();
  const { messages } = useMessageStore();
  const { testimonials, fetchTestimonials, loaded: tLoaded } = useTestimonialStore();
  const { subscribers, fetchSubscribers, loaded: sLoaded } = useSubscriberStore();

  useEffect(() => { if (!tLoaded) fetchTestimonials(); if (!sLoaded) fetchSubscribers(); }, [tLoaded, sLoaded, fetchTestimonials, fetchSubscribers]);

  const published = selectPublished(places);
  const pendingBookings = bookings.filter((b) => (b.status || 'Pending') === 'Pending');
  const newMessages = messages.filter((m) => (m.status || 'New') === 'New');

  const health = useMemo(() => {
    const issues = [];
    const noImage = published.filter((p) => p.images.length === 0);
    const base64 = places.filter((p) => p.images.some((u) => u.startsWith('data:')));
    const noDesc = published.filter((p) => !p.description);
    const noSlug = published.filter((p) => !p.slug);
    const noCat = published.filter((p) => !p.category_id);
    if (noImage.length) issues.push({ text: `${noImage.length} published destination${noImage.length > 1 ? 's have' : ' has'} no photo`, to: '/admin/destinations' });
    if (base64.length) issues.push({ text: `${base64.length} destination${base64.length > 1 ? 's use' : ' uses'} an embedded (slow) image — re-upload it`, to: '/admin/destinations' });
    if (noDesc.length) issues.push({ text: `${noDesc.length} published destination${noDesc.length > 1 ? 's have' : ' has'} no description`, to: '/admin/destinations' });
    if (noCat.length) issues.push({ text: `${noCat.length} published destination${noCat.length > 1 ? 's have' : ' has'} no category`, to: '/admin/destinations' });
    if (noSlug.length) issues.push({ text: `${noSlug.length} destination${noSlug.length > 1 ? 's are' : ' is'} missing a URL slug (save it once to generate)`, to: '/admin/destinations' });
    return issues;
  }, [places, published]);

  const stats = [
    { label: 'Published destinations', value: published.length, sub: `${places.length - published.length} unpublished`, icon: MapPin, to: '/admin/destinations', color: 'text-[#1E3A8A] bg-[#1E3A8A]/8' },
    { label: 'Pending bookings', value: pendingBookings.length, sub: `${bookings.length} total`, icon: CalendarCheck, to: '/admin/bookings', color: 'text-amber-600 bg-amber-50' },
    { label: 'New messages', value: newMessages.length, sub: `${messages.length} total`, icon: Mail, to: '/admin/messages', color: 'text-violet-600 bg-violet-50' },
    { label: 'Subscribers', value: subscribers.length, sub: 'newsletter', icon: Users, to: '/admin/subscribers', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Approved reviews', value: testimonials.filter((t) => t.is_approved).length, sub: `${testimonials.filter((t) => !t.is_approved).length} awaiting approval`, icon: Star, to: '/admin/testimonials', color: 'text-[#B45309] bg-[#FBBF24]/15' },
    { label: 'Active categories', value: categories.filter((c) => c.is_active).length, sub: `${categories.length} total`, icon: Tags, to: '/admin/categories', color: 'text-sky-600 bg-sky-50' },
  ];

  return (
    <AdminPage title="Dashboard" subtitle="What needs attention today and how the website content is doing."
      actions={<Link to="/admin/destinations?new=1" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add destination</Link>}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{s.value}</p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-gray-400">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#0F172A]">Needs attention</h2>
            <Link to="/admin/bookings" className="text-xs font-semibold text-[#10B981] inline-flex items-center gap-1">All bookings <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {pendingBookings.slice(0, 5).map((b) => (
              <li key={b.id} className="px-5 py-3.5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0"><CalendarCheck className="w-4 h-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#0F172A] truncate">{b.user_name} · {b.tour_title || places.find((p) => p.id === b.tour_id)?.title || 'Custom trip'}</p><p className="text-xs text-gray-400">{b.num_people} traveller{b.num_people === 1 ? '' : 's'} · {b.travel_date || 'date TBC'} · received {formatDate(b.created_at || b.booking_date)}</p></div>
                <StatusBadge status="Pending" />
              </li>
            ))}
            {newMessages.slice(0, 5).map((m) => (
              <li key={m.id} className="px-5 py-3.5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#0F172A] truncate">{m.name} · {m.destination || 'General enquiry'}</p><p className="text-xs text-gray-400 truncate">{m.message}</p></div>
                <Link to="/admin/messages" className="text-xs font-semibold text-[#1E3A8A]">Open</Link>
              </li>
            ))}
            {pendingBookings.length === 0 && newMessages.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-gray-400 flex flex-col items-center gap-2"><CheckCircle2 className="w-8 h-8 text-emerald-400" /> Inbox is clear — no pending bookings or unread messages.</li>
            )}
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-[#0F172A]">Content health</h2></div>
          <div className="p-5">
            {!placesLoaded ? <p className="text-sm text-gray-400">Checking…</p> : health.length === 0 ? (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> All published destinations have a photo, description, category and URL.</p>
            ) : (
              <ul className="space-y-2">
                {health.map((h) => (
                  <li key={h.text}><Link to={h.to} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 hover:bg-amber-100/60"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{h.text}</Link></li>
                ))}
              </ul>
            )}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quick actions</p>
              <div className="grid grid-cols-1 gap-2">
                {[['/admin/destinations?new=1', 'Add a destination', MapPin], ['/admin/categories', 'Manage categories', Tags], ['/admin/testimonials', 'Add a review', Star], ['/admin/settings', 'Update contact details', ImageIcon]].map(([to, label, Icon]) => (
                  <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#1E3A8A] hover:text-white text-sm font-medium text-gray-700 transition-colors group"><Icon className="w-4 h-4 text-[#10B981] group-hover:text-white" />{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminPage>
  );
};

export default Dashboard;
