import pg from 'pg';
const { Client } = pg;

const urls = [
  'postgresql://postgres.xpfbftpvpplhfndzbyce:DINE@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres:DINE@db.xpfbftpvpplhfndzbyce.supabase.co:5432/postgres',
  'postgresql://postgres.xpfbftpvpplhfndzbyce:DINE@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres.xpfbftpvpplhfndzbyce:DINE@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require',
];

async function testAll() {
  for (const url of urls) {
    console.log('\nTesting URL:', url.replace(/DINE/, '****'));
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      const res = await client.query('SELECT NOW()');
      console.log('✅ SUCCESS! Connection established. Server time:', res.rows[0].now);
      await client.end();
      return url;
    } catch (err) {
      console.error('❌ Failed:', err.message);
      try { await client.end(); } catch {}
    }
  }
}

testAll();
