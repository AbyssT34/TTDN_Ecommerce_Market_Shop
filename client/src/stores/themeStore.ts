import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
}

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: true, // Default dark mode
            toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
        }),
        {
            name: 'theme-storage',
        }
    )
);
