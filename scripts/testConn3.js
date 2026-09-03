import pg from 'pg';
const { Client } = pg;

const configs = [
  { host: 'aws-0-ap-northeast-1.pooler.supabase.com', port: 6543, user: 'postgres.xpfbftpvpplhfndzbyce', pass: 'DINE', db: 'postgres' },
  { host: 'aws-0-ap-northeast-1.pooler.supabase.com', port: 5432, user: 'postgres.xpfbftpvpplhfndzbyce', pass: 'DINE', db: 'postgres' },
  { host: 'aws-0-ap-northeast-1.pooler.supabase.com', port: 6543, user: 'postgres', pass: 'DINE', db: 'postgres' },
  { host: 'db.xpfbftpvpplhfndzbyce.supabase.co', port: 5432, user: 'postgres', pass: 'DINE', db: 'postgres' },
  { host: 'db.xpfbftpvpplhfndzbyce.supabase.co', port: 6543, user: 'postgres', pass: 'DINE', db: 'postgres' },
  { host: 'db.xpfbftpvpplhfndzbyce.supabase.co', port: 5432, user: 'postgres.xpfbftpvpplhfndzbyce', pass: 'DINE', db: 'postgres' },
];

async function run() {
  for (const c of configs) {
    console.log(`Trying host=${c.host}:${c.port} user=${c.user}...`);
    const client = new Client({
      host: c.host,
      port: c.port,
      user: c.user,
      password: c.pass,
      database: c.db,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Connected to ${c.host}:${c.port} as ${c.user}`);
      const res = await client.query('SELECT NOW()');
      console.log('Server time:', res.rows[0].now);
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed: ${e.message}`);
      try { await client.end(); } catch {}
    }
  }
}

run();
