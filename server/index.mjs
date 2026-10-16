/**
 * Questra World — signup API.
 *
 * A zero-dependency Node HTTP server backed by SQLite (built-in `node:sqlite`).
 * It mirrors the classic PHP + MySQL flow: the public signup form POSTs every
 * field here, the row is saved in a real database file, and the admin console
 * reads it back through `GET /api/signups`.
 *
 * Run it with:  npm run server        (defaults to http://localhost:3001)
 *
 * Endpoints
 *   GET    /api/health        → { ok, signups }                 (health check)
 *   POST   /api/signup        → save a signup record            (public form)
 *   GET    /api/signups       → list every signup record        (admin)
 *   DELETE /api/signups/:id   → remove one signup record        (admin)
 */

// Suppress the node:sqlite experimental warning without hiding real warnings.
process.on('warning', w => {
  if (w.name !== 'ExperimentalWarning') console.warn(w);
});

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Imported dynamically so the warning handler above is registered first.
const { DatabaseSync } = await import('node:sqlite');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'questra.sqlite');
const PORT = Number(process.env.PORT || 3001);

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec(`
  CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    password TEXT,
    transaction_pin TEXT,
    reference_username TEXT,
    member_id TEXT,
    joined_date TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
  );
`);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Cache-Control': 'no-store'
};

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS_HEADERS
  });
  res.end(JSON.stringify(body));
};

const readBody = req =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });

const str = value => (value === undefined || value === null ? '' : String(value).trim());

const rowToRecord = row => ({
  id: row.id,
  username: row.username,
  fullName: row.full_name || '',
  phone: row.phone || '',
  email: row.email || '',
  password: row.password || '',
  transactionPin: row.transaction_pin || '',
  referenceUsername: row.reference_username || '',
  memberId: row.member_id || '',
  joinedDate: row.joined_date || '',
  ip: row.ip || '',
  userAgent: row.user_agent || '',
  createdAt: row.created_at,
  source: 'server'
});

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      const { n } = db.prepare('SELECT COUNT(*) AS n FROM signups').get();
      return sendJson(res, 200, {
        ok: true,
        service: 'questra-signup-api',
        database: 'sqlite',
        file: DB_FILE,
        signups: Number(n),
        time: new Date().toISOString()
      });
    }

    if (req.method === 'POST' && pathname === '/api/signup') {
      const body = await readBody(req);

      const username = str(body.username);
      const fullName = str(body.fullName);
      const phone = str(body.phone);
      const email = str(body.email);
      const password = str(body.password);
      const transactionPin = str(body.transactionPin);
      const referenceUsername = str(body.referenceUsername);
      const memberId = str(body.memberId);
      const joinedDate = str(body.joinedDate);

      // Server-side validation — never trust the browser alone.
      const errors = {};
      if (!username) errors.username = 'User Name is required.';
      if (!fullName) errors.fullName = 'Full Name is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'A valid email is required.';
      if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) errors.phone = 'A valid phone number is required.';
      if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
      if (!/^\d{4}$/.test(transactionPin)) errors.transactionPin = 'Transaction Pin must be exactly 4 digits.';
      if (Object.keys(errors).length > 0) {
        return sendJson(res, 422, { ok: false, errors });
      }

      const createdAt = new Date().toISOString();
      const info = db
        .prepare(
          `INSERT INTO signups
             (username, full_name, phone, email, password, transaction_pin,
              reference_username, member_id, joined_date, ip, user_agent, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          username,
          fullName,
          phone,
          email,
          password,
          transactionPin,
          referenceUsername,
          memberId,
          joinedDate,
          req.socket.remoteAddress || '',
          str(req.headers['user-agent']),
          createdAt
        );

      return sendJson(res, 201, { ok: true, id: Number(info.lastInsertRowid), createdAt });
    }

    if (req.method === 'GET' && pathname === '/api/signups') {
      const rows = db.prepare('SELECT * FROM signups ORDER BY id DESC').all();
      const records = rows.map(rowToRecord);
      return sendJson(res, 200, { ok: true, count: records.length, records });
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/signups/')) {
      const id = Number(pathname.split('/').pop());
      if (!Number.isFinite(id)) return sendJson(res, 400, { ok: false, error: 'Invalid id.' });
      const info = db.prepare('DELETE FROM signups WHERE id = ?').run(id);
      return sendJson(res, 200, { ok: true, deleted: Number(info.changes) });
    }

    return sendJson(res, 404, { ok: false, error: 'Not found', path: pathname });
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: String((err && err.message) || err) });
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  Questra World — signup API');
  console.log(`  Health : http://localhost:${PORT}/api/health`);
  console.log(`  Signups: http://localhost:${PORT}/api/signups`);
  console.log(`  SQLite : ${DB_FILE}`);
  console.log('');
});
