
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('/transactions/summary'),
      api('/transactions?limit=5')
    ])
      .then(([s, t]) => {
        setData(s);
        setRecent(t.items || []);
      })
      .catch((e) => setError(e.message));
  }, []);

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
          <p className="eyebrow">YOUR FINANCIAL SNAPSHOT</p>
          <h1>Overview</h1>
          <p className="muted">
            Here is how your money is doing this month.
          </p>
        </div>

        <a className="buttonlink" href="/transactions">
          + Add transaction
        </a>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="stats">
        <article>
          <span>Total income</span>
          <strong className="green">{money(data?.income)}</strong>
          <small>This month</small>
        </article>

        <article>
          <span>Total expenses</span>
          <strong className="red">{money(data?.expense)}</strong>
          <small>This month</small>
        </article>

        <article>
          <span>Available balance</span>
          <strong>{money(data?.balance)}</strong>
          <small>Income minus expenses</small>
        </article>
      </section>

      <section className="panel">
        <div className="paneltitle">
          <h2>Spending by category</h2>
          <span className="muted">Current month</span>
        </div>

        {data?.category?.length ? (
          data.category.map((c) => (
            <div className="categoryrow" key={c._id}>
              <span>{c._id}</span>
              <b>{money(c.total)}</b>
            </div>
          ))
        ) : (
          <p className="empty">
            No expenses recorded this month yet.
          </p>
        )}
      </section>

      <section className="panel">
        <div className="paneltitle">
          <h2>Recent transactions</h2>
          <a href="/transactions">View all</a>
        </div>

        {recent.length ? (
          recent.map((t) => (
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
            </div>
          ))
        ) : (
          <p className="empty">
            Your transactions will appear here.
          </p>
        )}
      </section>
    </>
  );
}
