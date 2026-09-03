import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase PostgreSQL Pool
const pool = new Pool({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.xpfbftpvpplhfndzbyce',
  password: 'Dinesh@27022008',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', database: 'Supabase PostgreSQL connected', time: dbRes.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── AUTH ENDPOINTS ─────────────────────────────────────────────────────────────

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, company, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const id = `usr_${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, company, role, timezone, onboarded)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, company, role, timezone, onboarded, created_at`,
      [id, name, email, password, company || 'Ops Team', 'NOC Operator', 'UTC', false]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, name, email, company, role, timezone, onboarded FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/user', async (req, res) => {
  const { id, name, company, role, timezone, onboarded, dataSources } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($2, name),
           company = COALESCE($3, company),
           role = COALESCE($4, role),
           timezone = COALESCE($5, timezone),
           onboarded = COALESCE($6, onboarded),
           data_sources = COALESCE($7, data_sources)
       WHERE id = $1
       RETURNING id, name, email, company, role, timezone, onboarded`,
      [id, name, company, role, timezone, onboarded, dataSources ? JSON.stringify(dataSources) : null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SHIFT ACTIVITY ENDPOINTS ───────────────────────────────────────────────────

app.get('/api/activity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_events ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HANDOVERS ENDPOINTS ────────────────────────────────────────────────────────

app.get('/api/handovers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM handovers ORDER BY created_at DESC');
    const formatted = result.rows.map(h => ({
      id: h.id,
      shiftStart: h.shift_start,
      shiftEnd: h.shift_end,
      createdBy: h.created_by_name,
      createdAt: h.created_at,
      summary: h.summary,
      itemCounts: h.item_counts,
      sources: h.sources,
      pdfExported: h.pdf_exported,
      classifiedData: h.classified_data,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/handovers', async (req, res) => {
  const { id, shiftStart, shiftEnd, createdBy, summary, itemCounts, sources, pdfExported, classifiedData } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO handovers (id, shift_start, shift_end, created_by_name, summary, item_counts, sources, pdf_exported, classified_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET summary = EXCLUDED.summary, pdf_exported = EXCLUDED.pdf_exported
       RETURNING *`,
      [
        id || `hov_${Date.now()}`,
        shiftStart,
        shiftEnd,
        createdBy || 'Ravi Kumar',
        summary,
        JSON.stringify(itemCounts || {}),
        JSON.stringify(sources || []),
        pdfExported || false,
        JSON.stringify(classifiedData || {}),
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TEAM MEMBERS ENDPOINTS ─────────────────────────────────────────────────────

app.get('/api/team', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_members ORDER BY name ASC');
    const formatted = result.rows.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      status: m.status,
      lastActive: m.last_active,
      avatar: m.avatar,
      avatarColor: m.avatar_color,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const id = `usr_t_${Date.now()}`;
    const avatar = (name || email).slice(0, 2).toUpperCase();
    const result = await pool.query(
      `INSERT INTO team_members (id, name, email, role, status, avatar, avatar_color)
       VALUES ($1, $2, $3, $4, 'Invited', $5, 'bg-teal-600')
       RETURNING *`,
      [id, name || email.split('@')[0], email, role, avatar]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DATA SOURCES ENDPOINTS ─────────────────────────────────────────────────────

app.get('/api/sources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM data_sources ORDER BY id ASC');
    const formatted = result.rows.map(s => ({
      id: s.id,
      name: s.name,
      connected: s.connected,
      lastSync: s.last_sync,
      events: s.events_count,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ ShiftFlow AI Express Backend running on port ${PORT}`);
  console.log(`Connected to Supabase PostgreSQL database!`);
});
