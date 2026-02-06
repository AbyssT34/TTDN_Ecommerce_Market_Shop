import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// ═══════════════════════════════════════════════════════════════
// API CLIENT SETUP
// ═══════════════════════════════════════════════════════════════

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR - Attach JWT token
// ═══════════════════════════════════════════════════════════════

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ═══════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR - Handle 401 (auto logout on token expiry)
// ═══════════════════════════════════════════════════════════════

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
