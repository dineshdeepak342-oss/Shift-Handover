import pg from 'pg';
const { Client } = pg;

const passwords = ['DINE', 'dine', 'Dine', 'DINE123', 'Dine123', 'DINE2026', 'DINE@123', 'DINE!@#'];

async function testPasses() {
  for (const pass of passwords) {
    console.log(`Testing password: ${pass}`);
    const client = new Client({
      connectionString: `postgresql://postgres.xpfbftpvpplhfndzbyce:${encodeURIComponent(pass)}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Password is: ${pass}`);
      const res = await client.query('SELECT NOW()');
      console.log('Server time:', res.rows[0].now);
      await client.end();
      return pass;
    } catch (err) {
      console.log(`Failed for ${pass}: ${err.message}`);
      try { await client.end(); } catch {}
    }
  }
}

testPasses();
