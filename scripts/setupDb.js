import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.xpfbftpvpplhfndzbyce',
  password: 'Dinesh@27022008',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = await pool.connect();
  console.log('Connected!');

  try {
    await client.query('BEGIN');

    // 1. Users Table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        role VARCHAR(100),
        timezone VARCHAR(50) DEFAULT 'UTC',
        data_sources JSONB DEFAULT '["Ticketing", "Incidents", "Team Chat", "Git Commits"]'::jsonb,
        onboarded BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Activity Events Table
    console.log('Creating activity_events table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_events (
        id SERIAL PRIMARY KEY,
        source VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        summary TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        priority VARCHAR(50),
        assignee VARCHAR(100),
        url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Handovers Table
    console.log('Creating handovers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS handovers (
        id VARCHAR(255) PRIMARY KEY,
        shift_start TIMESTAMPTZ NOT NULL,
        shift_end TIMESTAMPTZ NOT NULL,
        created_by_id VARCHAR(255),
        created_by_name VARCHAR(255) NOT NULL,
        summary TEXT,
        item_counts JSONB NOT NULL,
        sources JSONB NOT NULL,
        pdf_exported BOOLEAN DEFAULT false,
        classified_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Data Sources Table
    console.log('Creating data_sources table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS data_sources (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        connected BOOLEAN DEFAULT true,
        last_sync VARCHAR(100),
        events_count VARCHAR(100)
      );
    `);

    // 5. Team Members Table
    console.log('Creating team_members table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        last_active TIMESTAMPTZ,
        avatar VARCHAR(10),
        avatar_color VARCHAR(50)
      );
    `);

    // Seed Demo User
    console.log('Seeding demo user...');
    await client.query(`
      INSERT INTO users (id, name, email, password, company, role, timezone, onboarded)
      VALUES ('usr_demo_ravi', 'Ravi Kumar', 'ravi.kumar@example.com', 'demo123', 'Acme NOC Operations', 'NOC Operator', 'UTC', true)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, company = EXCLUDED.company;
    `);

    // Seed Data Sources
    console.log('Seeding data sources...');
    await client.query(`
      INSERT INTO data_sources (id, name, connected, last_sync, events_count)
      VALUES
        ('jira', 'Jira / Ticketing', true, '3 mins ago', '142 records'),
        ('pagerduty', 'PagerDuty / Incidents', true, '1 min ago', '38 records'),
        ('slack', 'Slack / Team Chat', true, 'Just now', '89 records'),
        ('github', 'GitHub / Git Commits', true, '12 mins ago', '54 records')
      ON CONFLICT (id) DO UPDATE SET connected = EXCLUDED.connected, last_sync = EXCLUDED.last_sync;
    `);

    // Seed Team Members
    console.log('Seeding team members...');
    await client.query(`
      INSERT INTO team_members (id, name, email, role, status, last_active, avatar, avatar_color)
      VALUES
        ('usr_t001', 'Ravi Kumar', 'ravi.kumar@example.com', 'Admin', 'Active', NOW(), 'RK', 'bg-teal-600'),
        ('usr_t002', 'Priya Nair', 'priya.nair@example.com', 'Engineer', 'Active', NOW() - INTERVAL '2 hours', 'PN', 'bg-violet-600'),
        ('usr_t003', 'Arjun Mehta', 'arjun.mehta@example.com', 'Manager', 'Active', NOW() - INTERVAL '4 hours', 'AM', 'bg-blue-600'),
        ('usr_t004', 'Sneha Patel', 'sneha.patel@example.com', 'Engineer', 'Active', NOW() - INTERVAL '6 hours', 'SP', 'bg-rose-600'),
        ('usr_t005', 'Kiran Das', 'kiran.das@example.com', 'Engineer', 'Away', NOW() - INTERVAL '1 day', 'KD', 'bg-amber-600')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;
    `);

    // Seed Activity Events
    console.log('Seeding activity events...');
    await client.query(`DELETE FROM activity_events;`);
    await client.query(`
      INSERT INTO activity_events (source, record_id, timestamp, summary, status, priority, assignee, url)
      VALUES
        ('Ticketing', 'OPS-4821', '2026-09-03T08:12:00Z', 'Production DB connection pool exhausted — restart applied', 'Completed', 'P1', 'Ravi Kumar', 'https://tickets.example.com/OPS-4821'),
        ('Ticketing', 'OPS-4821', '2026-09-03T09:45:00Z', 'OPS-4821 update: pool limit increased to 500, monitoring period started', 'In Progress', 'P1', 'Ravi Kumar', 'https://tickets.example.com/OPS-4821'),
        ('Ticketing', 'OPS-4821', '2026-09-03T11:20:00Z', 'OPS-4821 resolved: connection pool stable for 90 min, ticket closed', 'Completed', 'P1', 'Ravi Kumar', 'https://tickets.example.com/OPS-4821'),
        ('Ticketing', 'OPS-4835', '2026-09-03T10:05:00Z', 'Payment gateway timeout — latency spike > 3s on /api/checkout', 'In Progress', 'P2', 'Priya Nair', 'https://tickets.example.com/OPS-4835'),
        ('Ticketing', 'OPS-4836', '2026-09-03T10:30:00Z', 'SSL certificate expiry warning: api.internal.example.com — 7 days remaining', 'Watch-list', 'P3', 'Arjun Mehta', 'https://tickets.example.com/OPS-4836'),
        ('Ticketing', 'OPS-4837', '2026-09-03T07:55:00Z', 'Batch job NIGHTLY_REPORT failed — missing input partition for 2026-09-02', 'Blockers', 'P2', 'Sneha Patel', 'https://tickets.example.com/OPS-4837'),
        ('Ticketing', 'OPS-4837', '2026-09-03T09:10:00Z', 'OPS-4837 update: data eng team investigating missing partition, ETA 12:00 UTC', 'Blockers', 'P2', 'Sneha Patel', 'https://tickets.example.com/OPS-4837'),
        ('Ticketing', 'OPS-4839', '2026-09-03T11:45:00Z', 'Admin portal: bulk export CSV times out for >50k rows', 'In Progress', 'P3', 'Kiran Das', 'https://tickets.example.com/OPS-4839'),
        ('Incidents', 'INC-2201', '2026-09-03T08:00:00Z', 'SEV-1: Auth service down — 100% 5xx on /auth/token for 8 min', 'Completed', 'SEV1', 'Arjun Mehta', 'https://incidents.example.com/INC-2201'),
        ('Incidents', 'INC-2201', '2026-09-03T08:08:00Z', 'INC-2201 mitigated: pod restarted, auth service healthy, RCA in progress', 'Completed', 'SEV1', 'Arjun Mehta', 'https://incidents.example.com/INC-2201'),
        ('Incidents', 'INC-2204', '2026-09-03T09:30:00Z', 'SEV-2: CDN cache purge triggered — static assets 404 for 12 min', 'Completed', 'SEV2', 'Sneha Patel', 'https://incidents.example.com/INC-2204'),
        ('Incidents', 'INC-2207', '2026-09-03T11:00:00Z', 'SEV-2: Search service degraded — p99 latency 6.2s, partial results returned', 'In Progress', 'SEV2', 'Kiran Das', 'https://incidents.example.com/INC-2207'),
        ('Incidents', 'INC-2207', '2026-09-03T11:30:00Z', 'INC-2207 update: Elasticsearch shard rebalancing in progress — ETA 30 min', 'In Progress', 'SEV2', 'Kiran Das', 'https://incidents.example.com/INC-2207'),
        ('Incidents', 'INC-2209', '2026-09-03T12:05:00Z', 'SEV-3: Scheduled maintenance window open — DB index rebuild on replica', 'Watch-list', 'SEV3', 'Ravi Kumar', 'https://incidents.example.com/INC-2209'),
        ('Team Chat', 'MSG-6641', '2026-09-03T08:03:00Z', '#ops-alerts: Auth service down alert acknowledged by Arjun', 'Completed', 'High', 'Arjun Mehta', 'https://chat.example.com/c/ops-alerts/p1725336180'),
        ('Team Chat', 'MSG-6645', '2026-09-03T09:00:00Z', '#handover: Morning handover checklist posted by Ravi — 3 items flagged', 'Completed', 'Medium', 'Ravi Kumar', 'https://chat.example.com/c/handover/p1725339600'),
        ('Team Chat', 'MSG-6651', '2026-09-03T10:15:00Z', '#dev-ops: Deployment freeze in effect until INC-2207 resolved', 'Blockers', 'High', 'Kiran Das', 'https://chat.example.com/c/dev-ops/p1725343800'),
        ('Git Commits', 'a3f1c9d', '2026-09-03T07:30:00Z', 'fix(auth): increase token refresh retry limit from 2 to 5 [main]', 'Completed', 'Medium', 'Arjun Mehta', 'https://github.com/example/platform/commit/a3f1c9d'),
        ('Git Commits', 'b7e2d4a', '2026-09-03T08:45:00Z', 'hotfix(db): bump connection pool max to 500 — resolves OPS-4821 [main]', 'Completed', 'High', 'Ravi Kumar', 'https://github.com/example/platform/commit/b7e2d4a'),
        ('Git Commits', 'c9d3e5f', '2026-09-03T10:00:00Z', 'chore(ci): disable auto-deploy to prod — deployment freeze active [main]', 'In Progress', 'Medium', 'Kiran Das', 'https://github.com/example/platform/commit/c9d3e5f');
    `);

    // Seed Initial Handovers
    console.log('Seeding initial handovers...');
    await client.query(`
      INSERT INTO handovers (id, shift_start, shift_end, created_by_id, created_by_name, summary, item_counts, sources, pdf_exported)
      VALUES
        ('hov_001', '2026-09-03T06:00:00Z', '2026-09-03T14:00:00Z', 'usr_demo_ravi', 'Ravi Kumar', 'Eventful morning shift — SEV-1 auth outage mitigated at 08:08 UTC. DB connection pool issue resolved. Deployment freeze in effect for afternoon team due to ongoing search service degradation (INC-2207).', '{"completed": 6, "inProgress": 3, "blockers": 2, "watchlist": 2}'::jsonb, '["Ticketing", "Incidents", "Team Chat", "Git Commits"]'::jsonb, true),
        ('hov_002', '2026-09-02T22:00:00Z', '2026-09-03T06:00:00Z', 'usr_t002', 'Priya Nair', 'Quiet overnight shift. Resolved INC-2198 (notification service memory leak). Batch job OPS-4837 failed — flagged for morning team.', '{"completed": 4, "inProgress": 1, "blockers": 1, "watchlist": 1}'::jsonb, '["Ticketing", "Incidents", "Team Chat", "Git Commits"]'::jsonb, false),
        ('hov_003', '2026-09-02T14:00:00Z', '2026-09-02T22:00:00Z', 'usr_t003', 'Arjun Mehta', 'Standard afternoon shift. Deployed v2.4.1 hotfix for OPS-4802 alert noise. No SEV-1 incidents.', '{"completed": 5, "inProgress": 2, "blockers": 0, "watchlist": 1}'::jsonb, '["Ticketing", "Incidents", "Git Commits"]'::jsonb, true)
      ON CONFLICT (id) DO UPDATE SET summary = EXCLUDED.summary;
    `);

    await client.query('COMMIT');
    console.log('✅ ALL TABLES CREATED AND SEEDED SUCCESSFULLY ON SUPABASE DATABASE!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error setting up database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
