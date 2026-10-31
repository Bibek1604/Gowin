-- ============================================================
-- GoWin Travels — server-side guards for the public forms
-- (booking requests, contact messages, newsletter sign-ups).
-- The browser already validates, uses a honeypot and a cooldown
-- (src/lib/useSpamGuard.jsx); this is the backstop for anyone who
-- posts to the API directly with the public key.
--
-- * Length / shape limits as CHECK constraints. Added NOT VALID so
--   existing rows are not re-checked (nothing old can break the push);
--   every new insert or update is checked.
-- * A duplicate guard: the same email cannot submit the same form more
--   than 5 times in 10 minutes. The lookup is served by an index.
-- Idempotent; nothing is dropped except the objects re-created here.
-- ============================================================

-- ---------- bookings ----------
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_input_limits;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_input_limits CHECK (
  char_length(user_name) BETWEEN 2 AND 120
  AND char_length(user_email) BETWEEN 5 AND 254
  AND user_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND (address IS NULL OR char_length(address) <= 160)
  AND (message IS NULL OR char_length(message) <= 3000)
  AND (tour_title IS NULL OR char_length(tour_title) <= 200)
  AND (num_people IS NULL OR num_people BETWEEN 1 AND 100)
) NOT VALID;

-- ---------- contact_messages ----------
ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_input_limits;
ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_input_limits CHECK (
  char_length(name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND (destination IS NULL OR char_length(destination) <= 200)
  AND char_length(message) BETWEEN 2 AND 3000
) NOT VALID;

-- ---------- newsletter_subscribers ----------
ALTER TABLE public.newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_email_shape;
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_email_shape CHECK (
  char_length(email) BETWEEN 5 AND 254
  AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
) NOT VALID;

-- ---------- burst guard (same email, same form, 10 minutes) ----------
CREATE INDEX IF NOT EXISTS bookings_email_created_idx ON public.bookings (lower(user_email), created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_email_created_idx ON public.contact_messages (lower(email), created_at DESC);

CREATE OR REPLACE FUNCTION public.limit_form_bursts() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  recent integer;
BEGIN
  -- Only anonymous visitors are limited; signed-in staff and the service role are not.
  -- (No dependency on public.is_admin(), so this file applies in any order.)
  IF (SELECT auth.role()) IN ('authenticated', 'service_role') THEN
    RETURN NEW;
  END IF;
  IF TG_TABLE_NAME = 'bookings' THEN
    SELECT count(*) INTO recent FROM public.bookings
     WHERE lower(user_email) = lower(NEW.user_email) AND created_at > now() - interval '10 minutes';
  ELSE
    SELECT count(*) INTO recent FROM public.contact_messages
     WHERE lower(email) = lower(NEW.email) AND created_at > now() - interval '10 minutes';
  END IF;
  IF recent >= 5 THEN
    RAISE EXCEPTION 'Too many requests from this email address. Please wait a few minutes or contact us by phone or WhatsApp.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limit_form_bursts() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS bookings_limit_bursts ON public.bookings;
CREATE TRIGGER bookings_limit_bursts BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.limit_form_bursts();
DROP TRIGGER IF EXISTS contact_messages_limit_bursts ON public.contact_messages;
CREATE TRIGGER contact_messages_limit_bursts BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.limit_form_bursts();
