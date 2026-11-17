
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const blank = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  note: ''
};

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await api('/transactions');
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');

    try {
      const path = editing
        ? `/transactions/${editing}`
        : '/transactions';

      await api(path, {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount)
        })
      });

      setForm({
        ...blank,
        date: new Date().toISOString().slice(0, 10)
      });

      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function edit(t) {
    setEditing(t._id);

    setForm({
      ...t,
      date: new Date(t.date).toISOString().slice(0, 10),
      amount: String(t.amount),
      note: t.note || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async function del(id) {
    if (!window.confirm('Delete this transaction?')) {
      return;
    }

    try {
      setError('');

      await api(`/transactions/${id}`, {
        method: 'DELETE'
      });

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const money = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(n || 0);

  return (
    <>
      <div className="pageheading">
        <div>
          <p className="eyebrow">MONEY IN, MONEY OUT</p>
          <h1>Transactions</h1>
          <p className="muted">
            Keep track of every transaction.
          </p>
        </div>
      </div>

      <form className="panel formgrid" onSubmit={submit}>
        <h2>
          {editing ? 'Edit transaction' : 'Add a transaction'}
        </h2>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          required
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          {[
            'Food',
            'Shopping',
            'Travel',
            'Bills',
            'Health',
            'Education',
            'Salary',
            'Freelance',
            'Entertainment',
            'Other'
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) =>
            setForm({ ...form, note: e.target.value })
          }
        />

        <div className="formactions">
          <button type="submit">
            {editing ? 'Save changes' : 'Add transaction'}
          </button>

          {editing && (
            <button
              type="button"
              className="outline"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </form>

      <section className="panel">
        <h2>All transactions</h2>

        {items.length ? (
          items.map((t) => (
            <div className="transactionrow" key={t._id}>
              <div>
                <b>{t.title}</b>
                <small>
                  {t.category} ·{' '}
                  {new Date(t.date).toLocaleDateString('en-IN')}
                </small>
              </div>

              <strong className={t.type === 'income' ? 'green' : 'red'}>
                {t.type === 'income' ? '+' : '−'}
                {money(t.amount)}
              </strong>

              <div className="actions">
                <button
                  type="button"
                  className="outline small"
                  onClick={() => edit(t)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger small"
                  onClick={() => del(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">
            No transactions yet. Add your first one above.
          </p>
        )}
      </section>
    </>
  );
}
