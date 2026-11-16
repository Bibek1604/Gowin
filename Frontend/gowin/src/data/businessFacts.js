/**
 * Facts only the owner can supply. Every value is `null` until it is real.
 *
 * The site never shows a placeholder: any tile, badge, sentence or row that
 * depends on a null value is simply left out. Fill a value here (or move it to
 * site_settings later) and it appears everywhere it is used.
 *
 * [NEEDED] list — see docs/HOMEPAGE_V2.md for where each one shows up.
 */
export const BUSINESS_FACTS = {
  /** Hours within which a written quote is sent, e.g. 24. Used in the hero, How it works and FAQ. */
  quoteReplyHours: null,
  /** Department of Tourism, Nepal licence / registration number, e.g. '1234/075'. */
  tourismLicenceNo: null,
  /** Office of the Company Registrar registration number. */
  companyRegNo: null,
  /** PAN / VAT number. */
  panNo: null,
  /** Memberships that are actually held, e.g. ['NATTA', 'TAAN']. Leave empty if none. */
  memberships: [],
  /** Whole years in operation, e.g. 8. */
  yearsOperating: null,
  /** Travellers served, as the owner counts them, e.g. '2,500+'. */
  travellersServed: null,
  /** Google Business rating, e.g. { rating: 4.9, count: 120, url: 'https://g.page/...' }. */
  googleRating: null,
  /** Real photos for the "Who we are" block, paths under public/ (e.g. '/media/office.avif'). */
  officePhoto: null,
  teamPhoto: null,
  /** NPR per 1 USD to show "From NPR X" on international holidays. Owner-approved rate only. */
  nprPerUsd: null,
};

export const hasFact = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
