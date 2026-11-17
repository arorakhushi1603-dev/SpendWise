
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Admin() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('/admin/stats'),
      api('/admin/users')
    ])
      .then(([s, u]) => {
        setData(s);
        setUsers(u);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="pageheading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Admin overview</h1>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <section className="stats">
        <article>
          <span>Registered users</span>
          <strong>{data?.userCount ?? '—'}</strong>
        </article>

        <article>
          <span>Transactions</span>
          <strong>{data?.transactionCount ?? '—'}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Registered users</h2>

        {users.length > 0 ? (
          users.map((u) => (
            <div className="transactionrow" key={u._id}>
              <div>
                <b>{u.name}</b>
                <small>{u.email}</small>
              </div>

              <span className="tag">{u.role}</span>
            </div>
          ))
        ) : (
          <p className="empty">No users found.</p>
        )}
      </section>
    </>
  );
}
