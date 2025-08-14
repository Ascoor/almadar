import api from '@/lib/api';

export async function login(email: string, password: string) {
  const { data } = await api.post('/api/login', { email, password });
  localStorage.setItem('access_token', data.access_token);
  return { ...data.user, roles: data.roles, permissions: data.permissions };
}

export async function logout() {
  try {
    await api.post('/api/logout');
  } catch {}
  localStorage.removeItem('access_token');
}

export async function getMe() {
  const { data } = await api.get('/api/user');
  return { ...data.user, roles: data.roles, permissions: data.permissions };
}
