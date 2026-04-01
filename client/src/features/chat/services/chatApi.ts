import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Lấy token từ localStorage nếu user đã đăng nhập (optional) */
function getAuthHeaders(): Record<string, string> {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        const token: string | undefined = parsed?.state?.token;
        if (token) return { Authorization: `Bearer ${token}` };
    } catch {
        // ignore parse errors
    }
    return {};
}

export const sendChatMessage = async (
    message: string,
    sessionId: string,
    cartItems?: { name: string; quantity: number }[],
    currentPage?: string
) => {
    const { data } = await axios.post(
        `${API_URL}/chat/message`,
        { message, sessionId, cartItems, currentPage },
        { headers: getAuthHeaders() }
    );
    return data;
};

export const getChatHistory = async (sessionId: string) => {
    const { data } = await axios.get(`${API_URL}/chat/history/${sessionId}`, {
        headers: getAuthHeaders(),
    });
    return data;
};
