const API_BASE_URL = 'http://localhost:5001';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface DashboardSummary {
  totalCustomers: number;
  customersByStatus: {
    Lead: number;
    Prospect: number;
    Active: number;
    Inactive: number;
  };
  activitiesLast7Days: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  assignedToUserId?: string;
  assignedToUser?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  customerId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdByUser: {
    id: string;
    name: string;
    email: string;
  };
}

// JWT Storage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('user');
};

// API Client
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth APIs
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name: string, email: string, password: string) => {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

// Dashboard APIs
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  return apiClient('/dashboard/summary');
};

// Customer APIs
export const getCustomers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ customers: Customer[]; pagination: any }> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  return apiClient(`/customers${query ? `?${query}` : ''}`);
};

export const getCustomerById = async (id: string): Promise<{ customer: Customer }> => {
  return apiClient(`/customers/${id}`);
};

export const createCustomer = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}) => {
  return apiClient('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Note APIs
export const getCustomerNotes = async (customerId: string): Promise<{ notes: Note[] }> => {
  return apiClient(`/customers/${customerId}/notes`);
};

export const createNote = async (customerId: string, content: string) => {
  return apiClient(`/customers/${customerId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};
