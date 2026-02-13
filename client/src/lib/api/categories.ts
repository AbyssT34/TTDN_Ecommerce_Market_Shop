import { apiClient } from './client';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: {
        _id: string;
        name: string;
        slug: string;
    };
    subcategories?: Category[];
    order?: number;
    productsCount?: number;
}

// ═══════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all categories (nested tree)
 */
export const getCategories = async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get<{ categories: Category[] }>('/categories');
    return response.data;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string): Promise<{ category: Category }> => {
    const response = await apiClient.get<{ category: Category }>(`/categories/${id}`);
    return response.data;
};
