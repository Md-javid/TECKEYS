import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData: any) => api.post('/auth/register/', userData),
    login: (credentials: { username: string; password: string }) =>
        api.post('/auth/login/', credentials),
    getCurrentUser: () => api.get('/auth/user/'),
    updateProfile: (data: any) => api.patch('/auth/user/update/', data),
};

// Bills API
export const billsAPI = {
    getAll: (params?: any) => api.get('/bills/', { params }),
    getOne: (id: number) => api.get(`/bills/${id}/`),
    create: (data: FormData) => api.post('/bills/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id: number, data: any) => api.patch(`/bills/${id}/`, data),
    delete: (id: number) => api.delete(`/bills/${id}/`),
    correct: (id: number, correction: any) => api.post(`/bills/${id}/correct/`, correction),
    getStats: () => api.get('/bills/stats/'),
};

// Analytics API
export const analyticsAPI = {
    getWeekly: (weekOffset?: number) => api.get('/analytics/weekly/', {
        params: { week_offset: weekOffset || 0 },
    }),
    getMonthly: (monthOffset?: number) => api.get('/analytics/monthly/', {
        params: { month_offset: monthOffset || 0 },
    }),
    getDashboard: () => api.get('/analytics/dashboard/'),
    getSuggestions: () => api.get('/analytics/suggestions/'),
    markSuggestionRead: (id: number) => api.post(`/analytics/suggestions/${id}/mark_read/`),
    dismissSuggestion: (id: number) => api.post(`/analytics/suggestions/${id}/dismiss/`),
};

export default api;
