import React, { useEffect, useState } from 'react';
import { Save, ShieldCheck, Plus, Trash2, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import useSettingsStore from '../Store/SettingsStore';
import { useAdminStore } from '../Store/AdminStore';
import { supabase } from '../../supabaseClient';
import AdminPage from './AdminPage';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Field, Input, Textarea } from '../ui/FormField';
import { friendlyError } from '../../lib/errors';

const GROUPS = [
  { title: 'Business & contact', fields: [['business_name', 'Business name'], ['tagline', 'Tagline'], ['phone', 'Phone'], ['whatsapp', 'WhatsApp number'], ['email', 'Email'], ['address', 'Office address'], ['office_hours', 'Office hours'], ['map_query', 'Map search text', 'Used for the embedded map on the contact page']] },
  { title: 'Social links', fields: [['facebook_url', 'Facebook URL'], ['instagram_url', 'Instagram URL'], ['tiktok_url', 'TikTok URL'], ['youtube_url', 'YouTube URL']] },
  { title: 'Search engine defaults', fields: [['meta_title', 'Default page title'], ['meta_description', 'Default meta description', 'Shown in search results for the home page', 'textarea']] },
];

const Settings = () => {
  const { settings, updateSettings, available, loaded, fetchSettings } = useSettingsStore();
  const { user } = useAdminStore();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [adminsError, setAdminsError] = useState('');
  const [newAdmin, setNewAdmin] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { if (!loaded) fetchSettings(); }, [loaded, fetchSettings]);
  useEffect(() => { setForm(settings); }, [settings]);

  const loadAdmins = async () => {
    const { data, error } = await supabase.from('admin_users').select('email,created_at').order('created_at');
    if (error) { setAdminsError(friendlyError(error)); return; }
    setAdmins(data || []);
  };
  useEffect(() => { loadAdmins(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const res = await updateSettings(form);
    setSaving(false);
    if (res.success) toast.success('Settings saved — the website updates immediately');
    else toast.error(friendlyError(res.error));
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    const email = newAdmin.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Enter a valid email address.'); return; }
    const { error } = await supabase.from('admin_users').insert({ email });
    if (error) { toast.error(friendlyError(error)); return; }
    toast.success(`${email} can now sign in (once their account exists in Supabase Auth).`);
    setNewAdmin('');
    loadAdmins();
  };

  const removeAdmin = async () => {
    if (!confirm) return;
    const { error } = await supabase.from('admin_users').delete().eq('email', confirm.email);
    setConfirm(null);
    if (error) { toast.error(friendlyError(error)); return; }
    toast.success('Access removed');
    loadAdmins();
  };

  return (
    <AdminPage title="Website settings" subtitle="Contact details, social links and search defaults shown across the website.">
      {!available && loaded && (
        <p className="mb-5 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> The settings table does not exist yet. Apply the database migrations (<code className="font-mono text-xs">npx supabase db push</code>) to edit these values; until then the built-in defaults are shown.</p>
      )}
      <form onSubmit={save} className="space-y-5">
        {GROUPS.map((g) => (
          <section key={g.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">{g.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {g.fields.map(([key, label, hint, kind]) => (
                <Field key={key} label={label} hint={hint} htmlFor={`s-${key}`} className={kind === 'textarea' || key === 'address' ? 'sm:col-span-2' : ''}>
                  {kind === 'textarea' ? <Textarea id={`s-${key}`} rows={3} value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} disabled={!available} /> : <Input id={`s-${key}`} value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} disabled={!available} />}
                </Field>
              ))}
            </div>
          </section>
        ))}
        <div className="flex justify-end"><button type="submit" disabled={saving || !available} className="btn-primary text-sm disabled:opacity-60"><Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save settings'}</button></div>
      </form>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mt-8">
        <h2 className="font-bold text-[#0F172A] flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4 text-[#10B981]" /> Admin access</h2>
        <p className="text-xs text-gray-500 mb-4">Only these email addresses can manage the website. An address must also have a login created under <em>Authentication → Users</em> in the Supabase dashboard.</p>
        {adminsError ? <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{adminsError}</p> : (
          <ul className="divide-y divide-gray-50 border border-gray-100 rounded-xl mb-4">
            {admins.map((a) => (
              <li key={a.email} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="font-semibold text-[#0F172A]">{a.email}{user?.email?.toLowerCase() === a.email && <span className="ml-2 text-[10px] font-bold uppercase text-[#10B981]">you</span>}</span>
                <button type="button" disabled={admins.length <= 1 || user?.email?.toLowerCase() === a.email} onClick={() => setConfirm(a)} className="text-red-500 hover:text-red-700 disabled:opacity-30" aria-label={`Remove ${a.email}`}><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
            {admins.length === 0 && <li className="px-4 py-3 text-sm text-gray-400">No admins listed.</li>}
          </ul>
        )}
        <form onSubmit={addAdmin} className="flex gap-2">
          <Input type="email" value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} placeholder="colleague@gowintravels.com" aria-label="New admin email" />
          <button type="submit" className="btn-secondary text-sm flex-shrink-0"><Plus className="w-4 h-4" /> Add</button>
        </form>
        <p className="mt-3 text-[11px] text-gray-400 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> You cannot remove your own access or the last remaining admin.</p>
      </section>
      <ConfirmDialog open={!!confirm} danger title="Remove admin access?" confirmLabel="Remove" message={<><strong>{confirm?.email}</strong> will no longer be able to sign in to this panel.</>} onConfirm={removeAdmin} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Settings;
