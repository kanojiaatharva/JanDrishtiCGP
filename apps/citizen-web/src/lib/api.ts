const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // In a real app, this would attach the auth token from cookies/localStorage.
  // For the citizen experience MVP, we assume a hardcoded citizen JWT token 
  // or that the backend is temporarily open/mocking the user.
  // The backend uses @UseGuards(JwtAuthGuard). So we need a token.
  // We'll mock a login and store token if needed, but for now we'll simulate.

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Check localStorage for token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('citizen_access_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}
