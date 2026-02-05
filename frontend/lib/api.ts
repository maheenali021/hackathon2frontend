import { Task, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Auth API functions
export const authAPI = {
  register: async (userData: { email: string; name: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    return response.json();
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  },
};

// Task API functions
export const tasksAPI = {
  getAll: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch tasks');
    }

    return response.json();
  },

  create: async (userId: string, taskData: TaskCreate) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create task');
    }

    return response.json();
  },

  update: async (userId: string, taskId: string, taskData: TaskUpdate) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update task');
    }

    return response.json();
  },

  delete: async (userId: string, taskId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete task');
    }

    return response.json();
  },

  toggleComplete: async (userId: string, taskId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to toggle task completion');
    }

    return response.json();
  },
};