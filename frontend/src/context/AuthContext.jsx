
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { api, setToken } from '../services/api';

const C = createContext(null);

export const useAuth = () => useContext(C);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await api('/auth/refresh', {
          method: 'POST'
        });

        setToken(d.accessToken);
        setUser(d.user);
      } catch (error) {
        console.log('No active session found');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const d = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setToken(d.accessToken);
    setUser(d.user);
  };

  const register = async (name, email, password) => {
    const d = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    setToken(d.accessToken);
    setUser(d.user);
  };

  const logout = async () => {
    try {
      await api('/auth/logout', {
        method: 'POST'
      });
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <C.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </C.Provider>
  );
}
