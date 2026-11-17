
const BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let token = localStorage.getItem('spendwise_access');

export const setToken = (t) => {
  token = t;

  if (t) {
    localStorage.setItem('spendwise_access', t);
  } else {
    localStorage.removeItem('spendwise_access');
  }
};

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  let res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const rr = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (rr.ok) {
      const data = await rr.json();

      setToken(data.accessToken);

      headers.Authorization = `Bearer ${data.accessToken}`;

      res = await fetch(`${BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include'
      });
    }
  }

  const data = await res.json().catch(() => ({
    message: 'Unexpected server response'
  }));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
