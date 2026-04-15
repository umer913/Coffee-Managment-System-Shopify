const crypto = require('node:crypto');
const express = require('express');
const cors = require('cors');

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function createApp() {
  const app = express();
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  const sessions = new Map();

  const db = {
    products: [
      { id: 'p1', name: 'Espresso Roast', price: 12.5, stock: 40, category: 'Beans' },
      { id: 'p2', name: 'Cold Brew', price: 6.25, stock: 30, category: 'Ready-to-Drink' },
    ],
    customers: [
      { id: 'c1', name: 'Ava Patel', email: 'ava@example.com', loyaltyTier: 'Gold' },
    ],
    orders: [
      { id: 'o1', customerId: 'c1', productId: 'p1', quantity: 2, status: 'Pending' },
    ],
    inventory: [
      { id: 'i1', sku: 'ESP-ROAST-001', productId: 'p1', quantity: 40, location: 'Warehouse A' },
    ],
  };

  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  function createId(prefix) {
    return `${prefix}_${crypto.randomBytes(4).toString('hex')}`;
  }

  function safeStringCompare(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  }

  function auth(req, res, next) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const expiresAt = sessions.get(token);
    if (expiresAt < Date.now()) {
      sessions.delete(token);
      return res.status(401).json({ message: 'Session expired' });
    }

    return next();
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username = '', password = '' } = req.body || {};
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (!safeStringCompare(username, adminUsername) || !safeStringCompare(passwordHash, adminHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    sessions.set(token, Date.now() + TOKEN_TTL_MS);

    return res.json({ token, user: { username: adminUsername, role: 'admin' } });
  });

  app.post('/api/auth/logout', auth, (req, res) => {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    sessions.delete(token);
    res.status(204).send();
  });

  function mountCrud(resource, idPrefix) {
    app.get(`/api/${resource}`, auth, (_req, res) => {
      res.json(db[resource]);
    });

    app.post(`/api/${resource}`, auth, (req, res) => {
      const record = { ...req.body, id: createId(idPrefix) };
      db[resource].push(record);
      res.status(201).json(record);
    });

    app.put(`/api/${resource}/:id`, auth, (req, res) => {
      const idx = db[resource].findIndex((item) => item.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ message: `${resource.slice(0, -1)} not found` });
      }

      db[resource][idx] = { ...db[resource][idx], ...req.body, id: req.params.id };
      return res.json(db[resource][idx]);
    });

    app.delete(`/api/${resource}/:id`, auth, (req, res) => {
      const idx = db[resource].findIndex((item) => item.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ message: `${resource.slice(0, -1)} not found` });
      }

      db[resource].splice(idx, 1);
      return res.status(204).send();
    });
  }

  mountCrud('products', 'prod');
  mountCrud('orders', 'ord');
  mountCrud('customers', 'cus');
  mountCrud('inventory', 'inv');

  return app;
}

module.exports = { createApp };
