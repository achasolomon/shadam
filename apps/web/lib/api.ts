const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const api = {
  getProjects: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/projects${q}`);
  },
  getProject: (slug: string) => request<{ success: boolean; data: any }>(`/projects/${slug}`),
  getEvents: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/events${q}`);
  },
  getEvent: (slug: string) => request<{ success: boolean; data: any }>(`/events/${slug}`),
  getArticles: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/articles${q}`);
  },
  getArticle: (slug: string) => request<{ success: boolean; data: any }>(`/articles/${slug}`),
  getAlbums: () => request<{ success: boolean; data: any[] }>('/gallery/albums'),
  getTeam: () => request<{ success: boolean; data: any[] }>('/team'),
  getPage: (slug: string) => request<{ success: boolean; data: any }>(`/pages/${slug}`),
  getHomepage: () => request<{ success: boolean; data: any }>('/homepage'),
  submitEnquiry: (data: any) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  subscribe: (email: string) => request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const authApi = {
  login: (email: string, password: string) =>
    request<{ success: boolean; data: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  me: () => request<{ success: boolean; data: any }>('/auth/me'),
};

export const adminApi = {
  getProjects: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/projects${q}`);
  },
  createProject: (data: any) => request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/admin/projects/${id}`, { method: 'DELETE' }),
  getEvents: () => request<{ success: boolean; data: any[] }>('/admin/events'),
  createEvent: (data: any) => request('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id: string, data: any) => request(`/admin/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEvent: (id: string) => request(`/admin/events/${id}`, { method: 'DELETE' }),
  getMedia: () => request<{ success: boolean; data: any[] }>('/admin/media'),
  uploadMedia: async (file: File, metadata?: Record<string, string>) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) Object.entries(metadata).forEach(([k, v]) => { if (v) formData.append(k, v); });
    const res = await fetch(`${API_URL}/admin/media/upload`, { method: 'POST', body: formData, credentials: 'include' });
    return res.json();
  },
  getDashboardStats: () => request<{ success: boolean; data: any }>('/admin/dashboard/stats'),
  getEnquiries: () => request<{ success: boolean; data: any[] }>('/admin/enquiries'),
  updateEnquiry: (id: string, data: any) => request(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};
