import pg from 'pg';
const { Client } = pg;

async function testSni() {
  const attempts = [
    {
      host: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.xpfbftpvpplhfndzbyce',
      password: 'DINE',
      database: 'postgres',
      ssl: { rejectUnauthorized: false, servername: 'aws-0-ap-northeast-1.pooler.supabase.com' }
    },
    {
      host: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 5432,
      user: 'postgres.xpfbftpvpplhfndzbyce',
      password: 'DINE',
      database: 'postgres',
      ssl: { rejectUnauthorized: false, servername: 'aws-0-ap-northeast-1.pooler.supabase.com' }
    },
    {
      host: 'aws-0-ap-northeast-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres',
      password: 'DINE',
      database: 'postgres',
      options: '-c search_path=public',
      ssl: { rejectUnauthorized: false, servername: 'xpfbftpvpplhfndzbyce.supabase.co' }
    }
  ];

  for (const a of attempts) {
    console.log(`Testing SNI attempt: host=${a.host}:${a.port} user=${a.user} servername=${a.ssl.servername}`);
    const client = new Client(a);
    try {
      await client.connect();
      console.log('🎉 SUCCESS! Connected to Supabase!');
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

testSni();
