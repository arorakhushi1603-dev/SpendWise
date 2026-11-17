
import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Admin from './pages/Admin';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="center">Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Auth mode="login" />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Auth mode="register" />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />

          <Route element={<ProtectedRoute admin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
