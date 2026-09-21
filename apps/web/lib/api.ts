const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Public API
export const api = {
  // Projects
  getProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/projects${query}`);
  },

  getProject: (slug: string) => {
    return request<{ success: boolean; data: any }>(`/projects/${slug}`);
  },

  // Events
  getEvents: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/events${query}`);
  },

  getEvent: (slug: string) => {
    return request<{ success: boolean; data: any }>(`/events/${slug}`);
  },

  // Articles
  getArticles: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/articles${query}`);
  },

  getArticle: (slug: string) => {
    return request<{ success: boolean; data: any }>(`/articles/${slug}`);
  },

  // Gallery
  getAlbums: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/gallery/albums${query}`);
  },

  getAlbum: (slug: string) => {
    return request<{ success: boolean; data: any }>(`/gallery/albums/${slug}`);
  },

  // Team
  getTeam: () => {
    return request<{ success: boolean; data: any[] }>('/team');
  },

  // Resources
  getResources: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/resources${query}`);
  },

  // Pages
  getPage: (slug: string) => {
    return request<{ success: boolean; data: any }>(`/pages/${slug}`);
  },

  // Homepage
  getHomepage: () => {
    return request<{ success: boolean; data: any }>('/homepage');
  },

  // Enquiries
  submitEnquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    type?: string;
    subject?: string;
    message: string;
  }) => {
    return request<{ success: boolean; data: any }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Newsletter
  subscribe: (email: string) => {
    return request<{ success: boolean; data: any }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Auth API
export const authApi = {
  login: (email: string, password: string) => {
    return request<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: () => {
    return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  me: () => {
    return request<{ success: boolean; data: any }>('/auth/me');
  },
};

// Admin API
export const adminApi = {
  // Projects
  getProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/projects${query}`);
  },

  createProject: (data: any) => {
    return request<{ success: boolean; data: any }>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: (id: string, data: any) => {
    return request<{ success: boolean; data: any }>(`/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProject: (id: string) => {
    return request<{ success: boolean }>(`/admin/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Events
  getEvents: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/events${query}`);
  },

  createEvent: (data: any) => {
    return request<{ success: boolean; data: any }>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEvent: (id: string, data: any) => {
    return request<{ success: boolean; data: any }>(`/admin/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteEvent: (id: string) => {
    return request<{ success: boolean }>(`/admin/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Media
  getMedia: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/media${query}`);
  },

  uploadMedia: async (file: File, metadata?: { alt_text?: string; caption?: string; folder?: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
    }

    const response = await fetch(`${API_URL}/admin/media/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    return response.json();
  },

  // Dashboard
  getDashboardStats: () => {
    return request<{ success: boolean; data: any }>('/admin/dashboard/stats');
  },

  getRecentEnquiries: () => {
    return request<{ success: boolean; data: any[] }>('/admin/dashboard/recent-enquiries');
  },

  // Enquiries
  getEnquiries: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ success: boolean; data: any[]; meta: any }>(`/admin/enquiries${query}`);
  },

  updateEnquiry: (id: string, data: any) => {
    return request<{ success: boolean; data: any }>(`/admin/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
