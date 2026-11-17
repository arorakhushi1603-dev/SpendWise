
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Auth({ mode }) {
  const { login, register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }

      nav('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authpage">
      <form className="authcard" onSubmit={submit}>
        <div className="brand">✦ SpendWise</div>

        <h1>
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h1>

        <p className="muted">Make every rupee count.</p>

        {mode === 'register' && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={change}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={change}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min. 8 characters)"
          value={form.password}
          onChange={change}
          minLength="8"
          required
        />

        {error && <p className="error">{error}</p>}

        <button disabled={busy}>
          {busy
            ? 'Please wait...'
            : mode === 'login'
              ? 'Log in'
              : 'Create account'}
        </button>

        <p className="muted">
          {mode === 'login'
            ? 'New to SpendWise? '
            : 'Already registered? '}

          <Link to={mode === 'login' ? '/register' : '/login'}>
            {mode === 'login'
              ? 'Create an account'
              : 'Log in'}
          </Link>
        </p>
      </form>
    </div>
  );
}
