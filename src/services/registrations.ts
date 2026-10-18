/**
 * Signup records service (Supabase).
 *
 * Every investor registration is written straight to the Supabase Postgres
 * `signups` table through Supabase's PostgREST API, so the data lives in a real
 * server database and the admin console reads it back with `GET`.
 *
 * The browser talks directly to Supabase using the publishable (anon) key from
 * `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` — no backend of our own
 * is required. If Supabase is unreachable or unconfigured the signup still
 * succeeds locally, and the admin console falls back to the browser copy so no
 * registration is ever lost from view.
 */

export interface SignupRecord {
  /** Supabase row id, or the localStorage key for local-only records. */
  id?: number | string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  transactionPin?: string;
  referenceUsername?: string;
  memberId?: string;
  userId?: string;
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
  userId?: string;
  joinedDate?: string;
}

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';
const TABLE = 'signups';
const LOCAL_PREFIX = 'qw_registered_account_';

/**
 * Why the admin console could (or could not) talk to Supabase:
 *  - online          → reachable, data read/written successfully
 *  - missing-table   → reachable but `public.signups` does not exist yet
 *  - offline         → network/DNS failure, no reply at all
 *  - unconfigured    → `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` absent
 *  - error           → reachable but rejected the request (bad key, RLS, HTTP 5xx)
 */
export type ServerStatus = 'online' | 'missing-table' | 'offline' | 'unconfigured' | 'error';

/** Classifies a PostgREST response. */
function statusFor(res: Response, body: any): ServerStatus {
  if (res.ok) return 'online';
  const code = body && (body.code || body.error_code);
  // PostgREST reports an unknown relation as 404/PGRST205, SQL as 42P01.
  if (res.status === 404 || code === 'PGRST205' || code === '42P01') return 'missing-table';
  if (res.status === 401 || res.status === 403) return 'error';
  return 'error';
}

/** Supabase is configured only when both env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Endpoint of the signups table (PostgREST). */
const tableUrl = (query = '') => `${SUPABASE_URL}/rest/v1/${TABLE}${query}`;

const baseHeaders = (): Record<string, string> => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Accept: 'application/json'
});

/** Maps a Supabase row to the admin-facing record shape. */
const rowToRecord = (row: any): SignupRecord => ({
  id: row.id,
  username: row.username || '',
  fullName: row.full_name || '',
  phone: row.phone || '',
  email: row.email || '',
  password: row.password || '',
  transactionPin: row.transaction_pin || '',
  referenceUsername: row.reference_username || '',
  memberId: row.member_id || '',
  userId: row.user_id || '',
  joinedDate: row.joined_date || '',
  createdAt: row.created_at || '',
  ip: row.ip || '',
  userAgent: row.user_agent || '',
  source: 'server'
});

/**
 * `user_id` — the sequential USER ID handed out at registration — is an
 * optional column that a project gains by running `supabase/schema.sql`.
 * It is probed once so registrations and sign-in lookups keep working on
 * databases that have not added it yet.
 */
let hasUserIdColumn: boolean | null = null;
const supportsUserIdColumn = async (): Promise<boolean> => {
  if (hasUserIdColumn !== null) return hasUserIdColumn;
  if (!isSupabaseConfigured) {
    hasUserIdColumn = false;
    return false;
  }
  try {
    const res = await fetch(tableUrl('?select=user_id&limit=0'), {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    hasUserIdColumn = res.ok;
  } catch {
    hasUserIdColumn = false;
  }
  return hasUserIdColumn;
};

/** Payload → database columns. */
const payloadToRow = (payload: SignupPayload, withUserId: boolean) => ({
  username: payload.username,
  full_name: payload.fullName,
  phone: payload.phone,
  email: payload.email,
  password: payload.password,
  transaction_pin: payload.transactionPin,
  reference_username: payload.referenceUsername || null,
  member_id: payload.memberId || null,
  ...(withUserId ? { user_id: payload.userId || null } : {}),
  joined_date: payload.joinedDate || null,
  created_at: new Date().toISOString()
});

/**
 * Writes a signup to Supabase. Never throws — the registration flow must
 * succeed even when the database is unreachable.
 */
export async function submitSignupToServer(
  payload: SignupPayload
): Promise<{ ok: boolean; id?: number; error?: string }> {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured.' };
  try {
    const res = await fetch(tableUrl(), {
      method: 'POST',
      headers: { ...baseHeaders(), Prefer: 'return=representation' },
      body: JSON.stringify(payloadToRow(payload, await supportsUserIdColumn()))
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const status = statusFor(res, data);
      if (status === 'missing-table') {
        return { ok: false, error: "Supabase table 'signups' does not exist yet. Run supabase/schema.sql in the SQL Editor." };
      }
      const message = (data && (data.message || data.hint)) || `HTTP ${res.status}`;
      return { ok: false, error: String(message) };
    }
    const id = Array.isArray(data) && data[0] ? Number(data[0].id) : undefined;
    return { ok: true, id: Number.isFinite(id) ? id : undefined };
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

/** Fetches every signup stored in Supabase. */
export async function fetchServerSignups(): Promise<{
  ok: boolean;
  status: ServerStatus;
  records: SignupRecord[];
  count: number;
}> {
  if (!isSupabaseConfigured) return { ok: false, status: 'unconfigured', records: [], count: 0 };
  try {
    const res = await fetch(tableUrl('?select=*&order=created_at.desc'), {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Accept: 'application/json' }
    });
    const data = await res.json().catch(() => null);
    const status = statusFor(res, data);
    if (status !== 'online') return { ok: false, status, records: [], count: 0 };
    const records: SignupRecord[] = Array.isArray(data) ? data.map(rowToRecord) : [];
    return { ok: true, status: 'online', records, count: records.length };
  } catch {
    return { ok: false, status: 'offline', records: [], count: 0 };
  }
}

/**
 * Looks a signup up in Supabase by username, USER ID, member ID, email or
 * mobile number.
 *
 * The sign-in flow calls this when the browser has no matching local record
 * (a different device, an incognito window, or storage that was cleared), so
 * an account that was created on the server can still be opened here.
 */
export async function findServerSignup(identifier: string): Promise<SignupRecord | null> {
  if (!isSupabaseConfigured) return null;
  const cleaned = (identifier || '').trim();
  if (!cleaned) return null;
  const values = Array.from(new Set([cleaned, cleaned.toLowerCase()]));
  const filter = values.map(v => encodeURIComponent(v)).join(',');
  const clauses = [
    `username.in.(${filter})`,
    `email.in.(${filter})`,
    `phone.in.(${filter})`,
    `member_id.in.(${filter})`
  ];
  // Only search by USER ID when the database actually has the column.
  if (await supportsUserIdColumn()) clauses.push(`user_id.in.(${filter})`);
  try {
    const res = await fetch(
      tableUrl(`?select=*&or=(${clauses.join(',')})&limit=1`),
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: 'application/json'
        }
      }
    );
    const data = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data) || !data.length) return null;
    return rowToRecord(data[0]);
  } catch {
    return null;
  }
}

/**
 * Returns every known signup, merging the Supabase table with the local
 * browser fallback. Supabase records win when a username exists in both.
 */
export async function getAllSignups(): Promise<{
  records: SignupRecord[];
  serverOnline: boolean;
  status: ServerStatus;
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

  return { records, serverOnline: server.ok, status: isSupabaseConfigured ? server.status : 'unconfigured' };
}

/** Deletes a signup from Supabase and from the local browser copy. */
export async function deleteSignup(record: SignupRecord): Promise<boolean> {
  let ok = true;
  if (record.source === 'server' && record.id !== undefined) {
    try {
      const res = await fetch(tableUrl(`?id=eq.${encodeURIComponent(String(record.id))}`), {
        method: 'DELETE',
        headers: { ...baseHeaders(), Prefer: 'return=minimal' }
      });
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
