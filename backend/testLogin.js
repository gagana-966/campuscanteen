// using global fetch (Node 18+)

async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tarun@customer.edu', password: 'password123', role: 'customer' }),
    });
    const text = await res.text();
    console.log('status', res.status, 'body', text);
  } catch (e) {
    console.error('fetch error', e);
  }
}

test();
