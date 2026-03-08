import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return {};
    try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
    const res = await axios.get(`${API_BASE}/admin/dashboard`, {
        headers: getAuthHeader(),
    });
    return res.data;
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export const adminGetAllProducts = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}) => {
    const res = await axios.get(`${API_BASE}/products`, {
        params: { ...params, limit: params?.limit || 20 },
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminGetProductById = async (id: string) => {
    const res = await axios.get(`${API_BASE}/products/${id}`, {
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminCreateProduct = async (data: Record<string, any>) => {
    const res = await axios.post(`${API_BASE}/products`, data, {
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminUpdateProduct = async (id: string, data: Record<string, any>) => {
    const res = await axios.put(`${API_BASE}/products/${id}`, data, {
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminDeleteProduct = async (id: string) => {
    const res = await axios.delete(`${API_BASE}/products/${id}`, {
        headers: getAuthHeader(),
    });
    return res.data;
};

export const uploadImage = async (base64: string) => {
    const res = await axios.post(
        `${API_BASE}/admin/upload`,
        { image: base64 },
        { headers: getAuthHeader() }
    );
    return res.data;
};

// ═══════════════════════════════════════════════════════════════
// ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export const adminGetAllOrders = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}) => {
    const res = await axios.get(`${API_BASE}/admin/orders`, {
        params,
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminGetOrderDetail = async (id: string) => {
    const res = await axios.get(`${API_BASE}/admin/orders/${id}`, {
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminUpdateOrderStatus = async (id: string, status: string, note?: string) => {
    const res = await axios.put(
        `${API_BASE}/admin/orders/${id}/status`,
        { status, note },
        { headers: getAuthHeader() }
    );
    return res.data;
};

// ═══════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export const adminGetAllUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}) => {
    const res = await axios.get(`${API_BASE}/admin/users`, {
        params,
        headers: getAuthHeader(),
    });
    return res.data;
};

export const adminToggleUserActive = async (id: string) => {
    const res = await axios.put(`${API_BASE}/admin/users/${id}/toggle`, {}, {
        headers: getAuthHeader(),
    });
    return res.data;
};

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const getCategories = async () => {
    const res = await axios.get(`${API_BASE}/categories`, {
        headers: getAuthHeader(),
    });
    return res.data;
};
