
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Budgets() {
  const monthNow = new Date().toISOString().slice(0, 7);

  const [month, setMonth] = useState(monthNow);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      setError('');
      const data = await api(`/budgets?month=${month}`);
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, [month]);

  async function submit(e) {
    e.preventDefault();

    try {
      setError('');

      await api('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          category,
          month,
          limit: Number(limit)
        })
      });

      setLimit('');
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function del(id) {
    try {
      setError('');
      await api(`/budgets/${id}`, {
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
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(n || 0);

  return (
    <>
      <div className="pageheading">
        <div>
          <p className="eyebrow">PLAN YOUR SPENDING</p>
          <h1>Monthly budgets</h1>
          <p className="muted">
            Set limits and keep your expenses in check.
          </p>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <form className="panel formgrid" onSubmit={submit}>
        <h2>Create or update a budget</h2>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {[
            'Food',
            'Shopping',
            'Travel',
            'Bills',
            'Health',
            'Education',
            'Entertainment',
            'Other'
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Monthly limit (₹)"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />

        <button type="submit">Save budget</button>

        {error && <p className="error">{error}</p>}
      </form>

      <section className="budgetgrid">
        {items.map((b) => {
          const percentage = b.limit > 0
            ? Math.min(100, Math.max(0, (b.spent / b.limit) * 100))
            : 0;

          return (
            <article className="panel" key={b._id}>
              <div className="paneltitle">
                <h2>{b.category}</h2>

                <button
                  type="button"
                  className="danger small"
                  onClick={() => del(b._id)}
                >
                  Delete
                </button>
              </div>

              <strong>
                {money(b.spent)}{' '}
                <span className="muted">
                  of {money(b.limit)}
                </span>
              </strong>

              <div className="progress">
                <span style={{ width: `${percentage}%` }} />
              </div>

              <small className={b.remaining < 0 ? 'red' : 'muted'}>
                {b.remaining < 0
                  ? `${money(Math.abs(b.remaining))} over budget`
                  : `${money(b.remaining)} remaining`}
              </small>
            </article>
          );
        })}
      </section>

      {!items.length && (
        <p className="empty">No budgets for this month yet.</p>
      )}
    </>
  );
}
