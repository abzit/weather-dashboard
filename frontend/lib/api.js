import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// Cities endpoints
export const citiesAPI = {
  getCities: () => apiClient.get('/cities'),
  addCity: (data) => apiClient.post('/cities', data),
  deleteCity: (id) => apiClient.delete(`/cities/${id}`),
  toggleFavorite: (id) => apiClient.patch(`/cities/${id}/favorite`),
};

// Weather endpoints
export const weatherAPI = {
  getWeather: (latitude, longitude) =>
    apiClient.get('/weather', {
      params: { latitude, longitude },
    }),
};

export default apiClient;