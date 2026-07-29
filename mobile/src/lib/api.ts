const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API fetch error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
