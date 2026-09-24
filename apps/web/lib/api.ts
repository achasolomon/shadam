const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';
const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '');

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`;
  return url;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smhi_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers as Record<string, string> };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
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
  getFeaturedEvent: () => request<{ success: boolean; data: any }>('/events/featured'),
  getArticles: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/articles${q}`);
  },
  getArticle: (slug: string) => request<{ success: boolean; data: any }>(`/articles/${slug}`),
  getAlbums: () => request<{ success: boolean; data: any[] }>('/gallery/albums'),
  getAlbum: (slug: string) => request<{ success: boolean; data: any }>(`/gallery/albums/${slug}`),
  getTeam: () => request<{ success: boolean; data: any[] }>('/team'),
  getTeamMember: (slug: string) => request<{ success: boolean; data: any }>(`/team/${slug}`),
  getPage: (slug: string) => request<{ success: boolean; data: any }>(`/pages/${slug}`),
  getHomepage: () => request<{ success: boolean; data: any }>('/homepage'),
  getNavigation: () => request<{ success: boolean; data: any[] }>('/navigation'),
  getResources: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta?: any }>(`/resources${q}`);
  },
  getResource: (id: string) => request<{ success: boolean; data: any }>(`/resources/${id}`),
  getPartners: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta?: any }>(`/partners${q}`);
  },
  getSettings: () => request<{ success: boolean; data: any[] }>('/settings'),
  getStories: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/stories${q}`);
  },
  submitEnquiry: (data: any) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  registerForEvent: (data: any) => request('/event-registrations', { method: 'POST', body: JSON.stringify(data) }),
  submitDonation: (data: any) => request('/donations', { method: 'POST', body: JSON.stringify(data) }),
  subscribe: (email: string) => request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  unsubscribe: (email: string) => request('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  me: () => request<{ success: boolean; data: any }>('/auth/me'),
  updateMe: (data: { name?: string; email?: string; avatarUrl?: string }) =>
    request<any>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  getInvite: (token: string) =>
    request<{ name: string; email: string; role?: string; expiresAt?: string }>(`/auth/invite/${encodeURIComponent(token)}`),
  acceptInvite: (token: string, password: string) =>
    request<{ message: string; user: any; token?: string }>('/auth/invite/accept', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
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
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/admin/media/upload`, { method: 'POST', body: formData, headers, credentials: 'include' });
    return res.json();
  },
  getArticles: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/articles${q}`);
  },
  createArticle: (data: any) => request('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: string, data: any) => request(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteArticle: (id: string) => request(`/admin/articles/${id}`, { method: 'DELETE' }),
  publishArticle: (id: string) => request(`/admin/articles/${id}/publish`, { method: 'POST' }),
  publishProject: (id: string) => request(`/admin/projects/${id}/publish`, { method: 'POST' }),
  publishEvent: (id: string) => request(`/admin/events/${id}/publish`, { method: 'POST' }),
  archiveProject: (id: string) => request(`/admin/projects/${id}/archive`, { method: 'POST' }),
  getTeam: () => request<{ success: boolean; data: any[] }>('/admin/team'),
  getTeamMemberAdmin: (id: string) => request<{ success: boolean; data: any }>(`/admin/team/${id}`),
  createTeamMember: (data: any) => request('/admin/team', { method: 'POST', body: JSON.stringify(data) }),
  updateTeamMember: (id: string, data: any) => request(`/admin/team/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTeamMember: (id: string) => request(`/admin/team/${id}`, { method: 'DELETE' }),
  addTeamItem: (memberId: string, data: any) =>
    request(`/admin/team/${memberId}/items`, { method: 'POST', body: JSON.stringify(data) }),
  updateTeamItem: (itemId: string, data: any) =>
    request(`/admin/team/items/${itemId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTeamItem: (itemId: string) => request(`/admin/team/items/${itemId}`, { method: 'DELETE' }),
  getAlbums: () => request<{ success: boolean; data: any[] }>('/admin/gallery'),
  createAlbum: (data: any) => request('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteAlbum: (id: string) => request(`/admin/gallery/${id}`, { method: 'DELETE' }),
  getSettings: () => request<{ success: boolean; data: any[] }>('/settings'),
  updateSetting: (key: string, value: string) => request(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
  getHomepageAdmin: () => request<{ success: boolean; data: any[] }>('/admin/homepage'),
  updateHomepageSection: (id: string, data: any) =>
    request(`/admin/homepage/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getDashboardStats: () => request<{ success: boolean; data: any }>('/admin/dashboard/stats'),
  getEnquiries: () => request<{ success: boolean; data: any[] }>('/admin/enquiries'),
  updateEnquiry: (id: string, data: any) => request(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  replyToEnquiry: (id: string, channel: 'EMAIL' | 'SMS', message: string, subject?: string) =>
    request<{ success: boolean; data: any }>('/admin/enquiries/' + id + '/replies', {
      method: 'POST',
      body: JSON.stringify({ channel, message, subject }),
    }),
  deleteMedia: (id: string) => request(`/admin/media/${id}`, { method: 'DELETE' }),
  getStories: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/stories${q}`);
  },
  createStory: (data: any) => request('/admin/stories', { method: 'POST', body: JSON.stringify(data) }),
  updateStory: (id: string, data: any) => request(`/admin/stories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStory: (id: string) => request(`/admin/stories/${id}`, { method: 'DELETE' }),
  publishStory: (id: string) => request(`/admin/stories/${id}/publish`, { method: 'POST' }),
  getResources: () => request<{ success: boolean; data: any[] }>('/admin/resources'),
  getResource: (id: string) => request<{ success: boolean; data: any }>(`/admin/resources/${id}`),
  createResource: (data: any) => request('/admin/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id: string, data: any) => request(`/admin/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteResource: (id: string) => request(`/admin/resources/${id}`, { method: 'DELETE' }),
  publishResource: (id: string) => request(`/admin/resources/${id}/publish`, { method: 'POST' }),
  getPartners: () => request<{ success: boolean; data: any[] }>('/admin/partners'),
  getPartner: (id: string) => request<{ success: boolean; data: any }>(`/admin/partners/${id}`),
  createPartner: (data: any) => request('/admin/partners', { method: 'POST', body: JSON.stringify(data) }),
  updatePartner: (id: string, data: any) => request(`/admin/partners/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePartner: (id: string) => request(`/admin/partners/${id}`, { method: 'DELETE' }),
  getRegistrations: () => request<{ success: boolean; data: any[]; meta: any }>('/admin/event-registrations'),
  updateRegistration: (id: string, status: string) =>
    request(`/admin/event-registrations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteRegistration: (id: string) => request(`/admin/event-registrations/${id}`, { method: 'DELETE' }),
  getDonations: () => request<{ success: boolean; data: any[]; meta: any }>('/admin/donations'),
  getDonationStats: () => request<{ success: boolean; data: any }>('/admin/donations/stats'),
  updateDonation: (id: string, status: string) => request(`/admin/donations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getSubscribers: () => request<{ success: boolean; data: any[]; meta?: any }>('/admin/subscribers'),
  updateSubscriber: (id: string, status: string) =>
    request(`/admin/subscribers/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteSubscriber: (id: string) => request(`/admin/subscribers/${id}`, { method: 'DELETE' }),
  sendNewsletter: (subject: string, message: string, isHtml = false) =>
    request<{ success: boolean; data: { sent: number; failed: number; total: number; mode: string } }>(
      '/admin/newsletter/send',
      { method: 'POST', body: JSON.stringify({ subject, message, isHtml: isHtml ? 'true' : 'false' }) },
    ),
  getRoles: () => request<{ success: boolean; data: any[] }>('/admin/users/roles'),
  getUsers: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta?: any }>(`/admin/users${q}`);
  },
  getUser: (id: string) => request<{ success: boolean; data: any }>(`/admin/users/${id}`),
  createUser: (data: any) => request<{ success: boolean; data: any }>('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) => request<{ success: boolean; data: any }>(`/admin/users/${id}`, { method: 'DELETE' }),
  resendInvite: (id: string) =>
    request<{ success: boolean; data: any }>(`/admin/users/${id}/resend-invite`, { method: 'POST' }),
  getAuditLogs: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/audit${q}`);
  },
  getAlbum: (id: string) => request<{ success: boolean; data: any }>(`/admin/gallery/${id}`),
  updateAlbum: (id: string, data: any) => request(`/admin/gallery/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  publishAlbum: (id: string) => request(`/admin/gallery/${id}/publish`, { method: 'POST' }),
  addAlbumItem: (albumId: string, mediaId: string) =>
    request(`/admin/gallery/${albumId}/items`, { method: 'POST', body: JSON.stringify({ mediaId }) }),
  removeAlbumItem: (itemId: string) => request(`/admin/gallery/items/${itemId}`, { method: 'DELETE' }),
  reorderAlbumItems: (albumId: string, orderedIds: string[]) =>
    request(`/admin/gallery/${albumId}/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) }),
};
