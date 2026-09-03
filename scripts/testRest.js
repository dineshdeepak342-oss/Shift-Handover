async function testRest() {
  try {
    const res = await fetch('https://xpfbftpvpplhfndzbyce.supabase.co/rest/v1/');
    console.log('Supabase REST status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('REST fetch error:', err.message);
  }
}
testRest();
