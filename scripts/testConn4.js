import pg from 'pg';
const { Client } = pg;

async function testSupabase() {
  const attempts = [
    {
      name: 'Direct Supabase DB Host',
      host: 'db.xpfbftpvpplhfndzbyce.supabase.co',
      port: 5432,
      user: 'postgres',
      password: 'Dinesh@27022008',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Pooler 6543',
      host: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.xpfbftpvpplhfndzbyce',
      password: 'Dinesh@27022008',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Pooler 5432',
      host: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 5432,
      user: 'postgres.xpfbftpvpplhfndzbyce',
      password: 'Dinesh@27022008',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  ];

  for (const a of attempts) {
    console.log(`Testing ${a.name} (${a.host}:${a.port})...`);
    const client = new Client(a);
    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Connected to Supabase via ${a.name}!`);
      const res = await client.query('SELECT NOW(), current_database(), version()');
      console.log('Database:', res.rows[0].current_database);
      console.log('Server time:', res.rows[0].now);
      await client.end();
      return a;
    } catch (e) {
      console.error(`Failed ${a.name}:`, e.message);
      try { await client.end(); } catch {}
    }
  }
}

testSupabase();
