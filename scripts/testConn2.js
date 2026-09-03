import pg from 'pg';
const { Client } = pg;

async function testSsl() {
  const client = new Client({
    connectionString: 'postgresql://postgres.xpfbftpvpplhfndzbyce:DINE@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ CONNECTED TO SUPABASE POSTGRESQL SUCCESS!');
    const res = await client.query('SELECT current_database(), current_user, version()');
    console.log('Database:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    console.log('Version:', res.rows[0].version);
    await client.end();
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testSsl();
