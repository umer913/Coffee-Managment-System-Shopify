import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const resourceConfigs = {
  products: {
    label: 'Products',
    fields: ['name', 'price', 'stock', 'category'],
  },
  orders: {
    label: 'Orders',
    fields: ['customerId', 'productId', 'quantity', 'status'],
  },
  customers: {
    label: 'Customers',
    fields: ['name', 'email', 'loyaltyTier'],
  },
  inventory: {
    label: 'Inventory',
    fields: ['sku', 'productId', 'quantity', 'location'],
  },
};

function App() {
  const [token, setToken] = useState('');
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'admin123' });
  const [activeResource, setActiveResource] = useState('products');
  const [data, setData] = useState({ products: [], orders: [], customers: [], inventory: [] });
  const [formValues, setFormValues] = useState({});
  const [editingId, setEditingId] = useState('');
  const [status, setStatus] = useState('');

  const currentConfig = useMemo(() => resourceConfigs[activeResource], [activeResource]);

  const fetchResource = async (resource, authToken = token) => {
    const res = await fetch(`${API_BASE_URL}/api/${resource}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }
    const result = await res.json();
    setData((prev) => ({ ...prev, [resource]: result }));
  };

  const fetchAll = async (authToken = token) => {
    await Promise.all(Object.keys(resourceConfigs).map((resource) => fetchResource(resource, authToken)));
  };


  const login = async (e) => {
    e.preventDefault();
    setStatus('');
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      setStatus('Invalid credentials. Try admin/admin123.');
      return;
    }

    const result = await res.json();
    setToken(result.token);
    await fetchAll(result.token);
    setStatus('Login successful.');
  };

  const saveRecord = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${API_BASE_URL}/api/${activeResource}/${editingId}`
      : `${API_BASE_URL}/api/${activeResource}`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formValues),
    });

    if (!res.ok) {
      setStatus(`Unable to save ${currentConfig.label.toLowerCase()}.`);
      return;
    }

    setFormValues({});
    setEditingId('');
    await fetchResource(activeResource);
    setStatus(`${currentConfig.label.slice(0, -1)} saved.`);
  };

  const removeRecord = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/${activeResource}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setStatus(`Unable to delete ${currentConfig.label.toLowerCase()}.`);
      return;
    }

    await fetchResource(activeResource);
    setStatus(`${currentConfig.label.slice(0, -1)} deleted.`);
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    const nextValues = {};
    currentConfig.fields.forEach((field) => {
      nextValues[field] = record[field] ?? '';
    });
    setFormValues(nextValues);
  };

  if (!token) {
    return (
      <main className="container">
        <h1>Coffee Management Admin</h1>
        <p>Shopify-ready dashboard login</p>
        <form className="card" onSubmit={login}>
          <label>
            Username
            <input
              value={credentials.username}
              onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>
          <button type="submit">Login</button>
        </form>
        <small>{status}</small>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Coffee Management Dashboard</h1>
        <button
          onClick={async () => {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            });
            setToken('');
          }}
          type="button"
        >
          Logout
        </button>
      </header>

      <nav className="tabs">
        {Object.entries(resourceConfigs).map(([resource, config]) => (
          <button
            type="button"
            key={resource}
            className={activeResource === resource ? 'active' : ''}
            onClick={() => {
              setActiveResource(resource);
              setFormValues({});
              setEditingId('');
            }}
          >
            {config.label}
          </button>
        ))}
      </nav>

      <section className="grid">
        <form className="card" onSubmit={saveRecord}>
          <h2>{editingId ? `Edit ${currentConfig.label.slice(0, -1)}` : `Add ${currentConfig.label.slice(0, -1)}`}</h2>
          {currentConfig.fields.map((field) => (
            <label key={field}>
              {field}
              <input
                value={formValues[field] ?? ''}
                onChange={(e) => setFormValues((prev) => ({ ...prev, [field]: e.target.value }))}
                required
              />
            </label>
          ))}
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        </form>

        <div className="card">
          <h2>{currentConfig.label}</h2>
          <ul className="list">
            {data[activeResource].map((record) => (
              <li key={record.id}>
                <code>{record.id}</code>
                <pre>{JSON.stringify(record, null, 2)}</pre>
                <div className="actions">
                  <button type="button" onClick={() => startEdit(record)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => removeRecord(record.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <small>{status}</small>
    </main>
  );
}

export default App;
