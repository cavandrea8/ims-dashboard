const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper with auth
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Errore nella richiesta');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// File upload fetch wrapper
const uploadAPI = async (endpoint, formData) => {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Errore nell\'upload');
    }

    return data;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (email, password) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => fetchAPI('/auth/profile'),
  getUsers: () => fetchAPI('/auth/users'),
};

// Documents APIs
export const documentsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/documents${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/documents/${id}`),
  create: (formData) => uploadAPI('/documents', formData),
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => fetchAPI(`/documents/${id}`, { method: 'DELETE' }),
  getStats: () => fetchAPI('/documents/stats/summary'),
};

// Non-Conformities APIs
export const nonConformitiesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/nonconformities${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/nonconformities/${id}`),
  create: (formData) => uploadAPI('/nonconformities', formData),
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_URL}/nonconformities/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => fetchAPI(`/nonconformities/${id}`, { method: 'DELETE' }),
  getStats: () => fetchAPI('/nonconformities/stats/summary'),
};

// Actions APIs
export const actionsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/actions${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/actions/${id}`),
  create: (formData) => uploadAPI('/actions', formData),
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_URL}/actions/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => fetchAPI(`/actions/${id}`, { method: 'DELETE' }),
  addComment: (id, text) => fetchAPI(`/actions/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),
  getStats: () => fetchAPI('/actions/stats/summary'),
};

// Audits APIs
export const auditsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/audits${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/audits/${id}`),
  create: (formData) => uploadAPI('/audits', formData),
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_URL}/audits/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => fetchAPI(`/audits/${id}`, { method: 'DELETE' }),
  getStats: () => fetchAPI('/audits/stats/summary'),
};

// Training APIs
export const trainingAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/training${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/training/${id}`),
  create: (formData) => uploadAPI('/training', formData),
  update: (id, formData) => {
    const token = getToken();
    return fetch(`${API_URL}/training/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  delete: (id) => fetchAPI(`/training/${id}`, { method: 'DELETE' }),
  getStats: () => fetchAPI('/training/stats/summary'),
};

// Health check
export const healthCheck = () => fetchAPI('/health');
