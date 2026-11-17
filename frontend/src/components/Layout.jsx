
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function exit() {
    await logout();
    nav('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">✦ SpendWise</div>

        <p className="muted">PERSONAL FINANCE</p>

        <NavLink to="/">Overview</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/budgets">Budgets</NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/admin">Admin</NavLink>
        )}

        <div className="sidebottom">
          <b>{user?.name}</b>
          <small>{user?.email}</small>

          <button className="outline full" onClick={exit}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <header>
          <span>
            Good day, {user?.name?.split(' ')[0]} ✨
          </span>

          <span className="avatar">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
