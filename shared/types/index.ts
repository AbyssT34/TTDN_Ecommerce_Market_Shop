// ============================================
// SHARED TYPES - Ecommerce Shop
// ============================================

// User Types
export interface IUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin';
  addresses: IAddress[];
  wishlist: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

// Product Types
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string | ICategory;
  tags: string[];
  stockQuantity: number;
  unit: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  nutritionInfo?: INutritionInfo;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | ICategory;
  isActive: boolean;
  order: number;
}

export interface INutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

// Recipe Types
export interface IRecipe {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  video?: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: IRecipeIngredient[];
  steps: IRecipeStep[];
  tags: string[];
  totalCost?: number;
  isAvailable?: boolean;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipeIngredient {
  product: string | IProduct;
  quantity: number;
  unit: string;
  isOptional: boolean;
}

export interface IRecipeStep {
  order: number;
  instruction: string;
  image?: string;
  duration?: number;
}

// Order Types
export interface IOrder {
  _id: string;
  orderNumber: string;
  user: string | IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: 'cod' | 'sepay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  note?: string;
  sepayTransactionId?: string;
  statusHistory: IOrderStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrderStatusHistory {
  status: string;
  note?: string;
  createdAt: Date;
}

// Cart Types (Frontend only - Zustand)
export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity: number;
}

// Chat Types
export interface IChatMessage {
  _id: string;
  sessionId: string;
  user?: string;
  role: 'user' | 'assistant';
  content: string;
  context?: IChatContext;
  createdAt: Date;
}

export interface IChatContext {
  cartItems?: ICartItem[];
  sentiment?: 'positive' | 'neutral' | 'negative' | 'tired' | 'hurry';
  intent?: string;
}

// API Response Types
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// SePay Types
export interface ISepayWebhook {
  id: string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string;
  content: string;
  transferType: 'in' | 'out';
  transferAmount: number;
  accumulated: number;
  subAccount: string;
  referenceCode: string;
  description: string;
}
