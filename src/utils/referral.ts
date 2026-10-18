/**
 * Referral link helpers.
 *
 * The referral link must always point at the *live* origin (the origin the app is
 * currently served from) instead of a hard-coded domain, and it must carry a
 * single, resolvable sponsor reference so a brand-new visitor can register and
 * be attached to the correct sponsor's network.
 */

/**
 * Builds a shareable referral link for the given sponsor.
 *
 * `username` is the sponsor's username (the canonical reference). `code` is
 * kept as a human-friendly hint and as a fallback for older links.
 */
export function buildReferralLink(username: string, code?: string): string {
  let base = '/';
  try {
    // Older links used a /user/register path that does not exist as a route;
    // normalise it back to the origin root so shared links keep working.
    const path = (window.location.pathname || '/').replace(/\/user\/register\/?$/i, '/');
    base = `${window.location.origin}${path || '/'}`;
  } catch {
    base = '/';
  }

  try {
    const url = new URL(base, window.location?.origin || 'https://questraworld.com');
    url.search = '';
    if (username) url.searchParams.set('ref', username);
    if (code) url.searchParams.set('code', code);
    return url.toString();
  } catch {
    const query = [username ? `ref=${encodeURIComponent(username)}` : '', code ? `code=${encodeURIComponent(code)}` : '']
      .filter(Boolean)
      .join('&');
    return `https://questraworld.com/${query ? `?${query}` : ''}`;
  }
}

/**
 * Reads the sponsor reference from a query string. Accepts `ref`, `refcode`
 * and `code` so links created by any earlier build still resolve.
 */
export function readReferralParam(search?: string): string {
  try {
    const params = new URLSearchParams(search ?? window.location.search);
    return (params.get('ref') || params.get('refcode') || params.get('code') || '').trim();
  } catch {
    return '';
  }
}
