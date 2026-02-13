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
    timeout: 15000, // 15 second timeout
});

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR - Attach JWT token & check expiry
// ═══════════════════════════════════════════════════════════════

apiClient.interceptors.request.use(
    (config) => {
        const { token, checkAuth } = useAuthStore.getState();

        if (token) {
            // Check if token is expired before making request
            const isValid = checkAuth();
            if (!isValid) {
                // Token expired, reject request
                return Promise.reject(new axios.Cancel('Token expired'));
            }
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

let isRedirecting = false;

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isRedirecting) {
            isRedirecting = true;
            // Token expired or invalid
            useAuthStore.getState().logout();

            // Debounce redirect to avoid multiple redirects
            setTimeout(() => {
                window.location.href = '/login';
                isRedirecting = false;
            }, 100);
        }
        return Promise.reject(error);
    }
);
