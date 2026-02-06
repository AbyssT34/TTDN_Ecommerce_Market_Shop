import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser } from '../../../shared/types';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface AuthState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthActions {
    setAuth: (user: IUser, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    checkAuth: () => boolean;
}

export type AuthStore = AuthState & AuthActions;

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setAuth: (user, token) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            checkAuth: () => {
                const { token, user } = get();
                return !!token && !!user;
            },
        }),
        {
            name: 'auth-storage', // LocalStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
