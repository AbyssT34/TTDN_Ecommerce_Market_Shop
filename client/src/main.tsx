import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import '@/styles/index.css';
import '@/styles/storefront-template.css';
import '@/styles/admin-template.css';
import { useThemeStore } from '@/stores/themeStore';

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

function AppShell() {
    const isDark = useThemeStore((state) => state.isDark);
    const language = useThemeStore((state) => state.language);

    useEffect(() => {
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
        document.documentElement.lang = language;
        document.body.classList.toggle('ttdn-dark-mode', isDark);
    }, [isDark, language]);

    return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppShell />
        </QueryClientProvider>
    </React.StrictMode>
);
