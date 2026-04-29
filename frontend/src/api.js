export async function apiRequest(path, options = {}) {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const baseHeaders = isFormData
    ? {}
    : {
        'Content-Type': 'application/json',
      };

  // Use full backend URL instead of relying on proxy
  const fullUrl = path.startsWith('http') ? path : `http://localhost:1008${path}`;

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
