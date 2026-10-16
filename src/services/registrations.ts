/**
 * Signup records service.
 *
 * Every investor registration is pushed to the local signup API
 * (`/server` → SQLite) so the data lives in a real database, exactly like a
 * classic PHP + MySQL form. If the API is not running the registration still
 * succeeds locally, and the admin console falls back to the browser copy so no
 * signup is ever lost from view.
 */

export interface SignupRecord {
  /** Server row id, or the localStorage key for local-only records. */
  id?: number | string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  transactionPin?: string;
  referenceUsername?: string;
  memberId?: string;
  joinedDate?: string;
  createdAt?: string;
  ip?: string;
  userAgent?: string;
  source: 'server' | 'local';
}

export interface SignupPayload {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  transactionPin: string;
  referenceUsername?: string;
  memberId?: string;
  joinedDate?: string;
}

const API_BASE = '/api';
const LOCAL_PREFIX = 'qw_registered_account_';

/**
 * Sends a signup to the server database. Never throws — the caller (the
 * signup flow) must succeed even when the API is offline.
 */
export async function submitSignupToServer(
  payload: SignupPayload
): Promise<{ ok: boolean; id?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Reads the signups saved locally in this browser (offline fallback). */
export function getLocalSignups(): SignupRecord[] {
  const out: SignupRecord[] = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(LOCAL_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const user = parsed.user || {};
        out.push({
          id: key,
          username: user.username || key.slice(LOCAL_PREFIX.length),
          fullName: user.fullName || '',
          phone: user.phone || '',
          email: user.email || '',
          password: parsed.password || '',
          transactionPin: user.transactionPin || '',
          referenceUsername: user.referenceUsername || '',
          memberId: user.memberId || '',
          joinedDate: user.joinedDate || '',
          createdAt: user.joinedDate || '',
          source: 'local'
        });
      } catch {
        /* skip malformed records */
      }
    }
  } catch {
    /* localStorage unavailable */
  }
  return out;
}

/** Fetches every signup stored in the server database. */
export async function fetchServerSignups(): Promise<{
  ok: boolean;
  records: SignupRecord[];
  count: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/signups`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, records: [], count: 0 };
    const data = await res.json();
    const records: SignupRecord[] = Array.isArray(data.records)
      ? data.records.map((r: SignupRecord) => ({ ...r, source: 'server' as const }))
      : [];
    return { ok: true, records, count: records.length };
  } catch {
    return { ok: false, records: [], count: 0 };
  }
}

/**
 * Returns every known signup, merging the server database with the local
 * browser fallback. Server records win when a username exists in both.
 */
export async function getAllSignups(): Promise<{
  records: SignupRecord[];
  serverOnline: boolean;
}> {
  const local = getLocalSignups();
  const server = await fetchServerSignups();

  const byUsername = new Map<string, SignupRecord>();
  local.forEach(record => byUsername.set(record.username.toLowerCase(), record));
  if (server.ok) {
    server.records.forEach(record =>
      byUsername.set(record.username.toLowerCase(), { ...record, source: 'server' })
    );
  }

  const records = Array.from(byUsername.values()).sort((a, b) =>
    String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  );

  return { records, serverOnline: server.ok };
}

/** Deletes a signup from the server database and the local browser copy. */
export async function deleteSignup(record: SignupRecord): Promise<boolean> {
  let ok = true;
  if (record.source === 'server' && record.id !== undefined) {
    try {
      const res = await fetch(`${API_BASE}/signups/${record.id}`, { method: 'DELETE' });
      ok = res.ok;
    } catch {
      ok = false;
    }
  }
  try {
    localStorage.removeItem(LOCAL_PREFIX + record.username.toLowerCase());
  } catch {
    /* ignore */
  }
  return ok;
}
