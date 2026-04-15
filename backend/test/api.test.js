const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let baseUrl;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = undefined;
  }
  return { response, json };
}

test.before(async () => {
  const app = createApp();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

test('rejects unauthenticated products access', async () => {
  const { response } = await request('/api/products');
  assert.equal(response.status, 401);
});

test('supports login and products CRUD', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });

  assert.equal(login.response.status, 200);
  assert.ok(login.json.token);

  const authHeaders = {
    Authorization: `Bearer ${login.json.token}`,
    'Content-Type': 'application/json',
  };

  const create = await request('/api/products', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ name: 'Test Blend', price: 10, stock: 15, category: 'Beans' }),
  });

  assert.equal(create.response.status, 201);
  assert.equal(create.json.name, 'Test Blend');

  const update = await request(`/api/products/${create.json.id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ stock: 99 }),
  });

  assert.equal(update.response.status, 200);
  assert.equal(update.json.stock, 99);

  const remove = await request(`/api/products/${create.json.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${login.json.token}` },
  });

  assert.equal(remove.response.status, 204);
});
