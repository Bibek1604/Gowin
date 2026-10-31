import { useRef } from 'react';

const MIN_FILL_MS = 3000;   // people take longer than this to fill a form
const COOLDOWN_MS = 60000;  // one submission per form per minute from a browser

const readLast = (key) => { try { return Number(localStorage.getItem(`gowin:sent:${key}`)) || 0; } catch { return 0; } };
const writeLast = (key) => { try { localStorage.setItem(`gowin:sent:${key}`, String(Date.now())); } catch { /* storage blocked */ } };

/**
 * Lightweight, invisible spam protection for public forms (no CAPTCHA):
 *   * a honeypot field that people never see but form-filling bots complete;
 *   * a minimum time between opening the form and submitting it;
 *   * a short per-browser cooldown against double / repeated submissions.
 * Database constraints (supabase/migrations/20261031000000_form_guards.sql)
 * are the server-side backstop.
 *
 * check() → null (OK) | { bot: true } (pretend success, send nothing) | { error }
 */
export function useSpamGuard(key) {
  const openedAt = useRef(Date.now());
  const trap = useRef(null);

  const honeypot = (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor={`${key}-website`}>Leave this field empty</label>
      <input id={`${key}-website`} ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );

  const check = () => {
    if (trap.current?.value) return { bot: true };
    if (Date.now() - openedAt.current < MIN_FILL_MS) return { bot: true };
    const since = Date.now() - readLast(key);
    if (since < COOLDOWN_MS) return { error: `You have just sent a request. Please wait ${Math.ceil((COOLDOWN_MS - since) / 1000)} seconds, or message us on WhatsApp.` };
    return null;
  };

  return { honeypot, check, markSent: () => writeLast(key) };
}
