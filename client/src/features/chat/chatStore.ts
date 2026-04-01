import { create } from 'zustand';
import { sendChatMessage } from './services/chatApi';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

interface ChatState {
    isOpen: boolean;
    messages: ChatMessage[];
    isTyping: boolean;
    sessionId: string;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    sendMessage: (text: string, cartItems?: any[]) => Promise<void>;
    clearHistory: () => void;
}

const SESSION_KEY = 'chat_session_id';

function getOrCreateSessionId(): string {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

export const useChatStore = create<ChatState>((set, get) => ({
    isOpen: false,
    messages: [],
    isTyping: false,
    sessionId: getOrCreateSessionId(),

    setOpen: (open) => set({ isOpen: open }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),

    sendMessage: async (text, cartItems = []) => {
        const { sessionId } = get();

        // Add user message immediately
        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            createdAt: new Date(),
        };
        set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));

        try {
            const data = await sendChatMessage(text, sessionId, cartItems, window.location.pathname);
            const aiMsg: ChatMessage = {
                id: data.message._id || crypto.randomUUID(),
                role: 'assistant',
                content: data.message.content,
                createdAt: new Date(data.message.createdAt),
            };
            set((s) => ({ messages: [...s.messages, aiMsg], isTyping: false }));
        } catch (err: any) {
            const status: number | undefined = err?.response?.status;
            let content = '❌ Xin lỗi, AI đang tạm thời không khả dụng. Vui lòng thử lại sau!';

            if (status === 429) {
                content = '⏳ AI đang bận, vui lòng thử lại sau vài giây!';
            } else if (status === 503) {
                content = '⚙️ AI chưa được cấu hình. Admin cần thêm GEMINI_API_KEY vào server.';
            } else if (status === 401 || status === 403) {
                content = '🔒 Lỗi xác thực. Vui lòng đăng nhập lại và thử lại.';
            } else if (!navigator.onLine) {
                content = '📵 Không có kết nối internet. Vui lòng kiểm tra mạng và thử lại.';
            }

            const errorMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content,
                createdAt: new Date(),
            };
            set((s) => ({ messages: [...s.messages, errorMsg], isTyping: false }));
        }
    },

    clearHistory: () => {
        const newId = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, newId);
        set({ messages: [], sessionId: newId });
    },
}));
