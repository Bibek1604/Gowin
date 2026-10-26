import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

// Optional extra client-side gate: VITE_ADMIN_EMAILS="a@x.com,b@y.com".
// Real enforcement happens in the database (admin_users allowlist + RLS).
const ENV_ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

/**
 * Checks whether the signed-in email is on the admin allowlist.
 * Returns true when the allowlist table does not exist yet (pre-migration)
 * so the panel keeps working during the upgrade.
 */
async function isAllowlisted(email) {
  const value = (email || '').toLowerCase();
  if (!value) return false;
  if (ENV_ADMIN_EMAILS.length && !ENV_ADMIN_EMAILS.includes(value)) return false;
  const { data, error } = await supabase.from('admin_users').select('email').eq('email', value).maybeSingle();
  if (error) {
    if (error.code === '42P01' || /does not exist/i.test(error.message)) return true;
    console.error('admin check:', error.message);
    return false;
  }
  return !!data;
}

export const useAdminStore = create((set, get) => ({
  isAdmin: false,
  isLoading: true,
  user: null,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      set({ isAdmin: false, user: null });
      return { success: false, error: /invalid login/i.test(error.message) ? 'Incorrect email or password.' : error.message };
    }
    const allowed = await isAllowlisted(data.user?.email);
    if (!allowed) {
      await supabase.auth.signOut();
      set({ isAdmin: false, user: null });
      return { success: false, error: 'This account is not authorised to manage the website.' };
    }
    set({ isAdmin: true, user: data.user });
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAdmin: false, user: null });
  },

  /** Restore the session on page load and follow auth changes (other tabs, token expiry). */
  initialize: async () => {
    if (get()._initialized) return;
    set({ _initialized: true, isLoading: true });
    const apply = async (session) => {
      if (!session?.user) { set({ isAdmin: false, user: null, isLoading: false }); return; }
      const allowed = await isAllowlisted(session.user.email);
      set({ isAdmin: allowed, user: allowed ? session.user : null, isLoading: false });
    };
    const { data: { session } } = await supabase.auth.getSession();
    await apply(session);
    supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') set({ isAdmin: false, user: null, isLoading: false });
      else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') apply(newSession);
    });
  },
}));
