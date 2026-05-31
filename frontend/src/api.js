export async function apiRequest(path, options = {}) {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const baseHeaders = isFormData
    ? {}
    : {
        'Content-Type': 'application/json',
      };

<<<<<<< HEAD
  // Use full backend URL instead of relying on proxy
  const fullUrl = path.startsWith('http') ? path : `http://localhost:1008${path}`;
=======
  // Use build-time Vite env `VITE_API_BASE` or fallback to localhost
  const API_BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:1008';

  // Use full backend URL instead of relying on proxy
  const fullUrl = path.startsWith('http') ? path : `${API_BASE}${path}`;
>>>>>>> 07905ae (Prepare for Render deployment: CORS, API base, env example, deployment README)

  const token =
    typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
