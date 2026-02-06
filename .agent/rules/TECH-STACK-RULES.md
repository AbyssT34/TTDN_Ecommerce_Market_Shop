---
trigger: glob
globs: **/*.{tsx,ts,jsx,js,sql,css}
---

# TECH-STACK-RULES.md - React, Vite & SQL Standards

> **Mục tiêu**: Chuẩn hóa phong cách code (Coding Style) cho Tech Stack: React + Vite + TypeScript + SQL.

---

## ⚛️ 1. FRONTEND ARCHITECTURE (React + Vite)

1.  **Feature-based Structure** (Ưu tiên chia theo tính năng, không chia theo loại file):
    ```
    src/
      ├── features/
      │     ├── auth/           # Login, Register forms
      │     ├── cart/           # Cart logic, Cart items
      │     ├── product/        # Product list, detail
      │     └── checkout/
      ├── components/           # Shared UI (Button, Input) - Atomic Design
      ├── hooks/                # Global Hooks (useTheme, useAuth)
      └── lib/                  # Cấu hình axios, query-client
    ```
2.  **Naming Convention**:
    * **Component**: PascalCase (`ProductCard.tsx`, `CartItem.tsx`).
    * **Hook**: camelCase, prefix 'use' (`useCart.ts`, `useFetchProducts.ts`).
    * **Interface/Type**: Prefix 'I' là tùy chọn, nhưng phải PascalCase (`Product`, `IUser`).
3.  **State Management**:
    * **Server State**: Dùng `TanStack Query` (React Query) để fetch API (Products, Categories). Không dùng `useEffect` thủ công.
    * **Client State**: Dùng `Zustand` hoặc `Context API` cho Cart, User Session.

---

## 🗄️ 2. DATABASE STANDARDS (SQL)

1.  **Naming**:
    * **Table**: `snake_case`, số nhiều (`users`, `products`, `order_items`, `categories`).
    * **Column**: `snake_case` (`product_name`, `is_active`, `created_at`).
    * **Primary Key**: `id` (INT/BIGINT AUTO_INCREMENT hoặc UUID).
    * **Foreign Key**: `singular_table_name_id` (ví dụ: `user_id`, `category_id`).
2.  **Mandatory Fields** (Các trường bắt buộc mọi bảng):
    * `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
    * `updated_at` (TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
3.  **Money Data Type**:
    * Tuyệt đối dùng `DECIMAL(15, 2)` hoặc `BIGINT` (lưu giá trị VND).
    * KHÔNG dùng `FLOAT` hay `DOUBLE` để lưu giá tiền.

---

## ⚡ 3. PERFORMANCE & OPTIMIZATION

1.  **Vite Config**:
    * Sử dụng Alias (`@/components`, `@/features`) trong `vite.config.ts` để tránh import `../../../`.
2.  **Lazy Loading**:
    * Dùng `React.lazy` và `Suspense` cho các Route lớn (Admin Dashboard, Checkout).
3.  **Images**:
    * Ảnh sản phẩm từ Bách Hóa Xanh nên convert hoặc lưu dưới dạng WebP nếu có thể.
    * Luôn có thuộc tính `alt="tên sản phẩm"` cho thẻ `<img>`.

---

## 🛡️ 4. TYPE SAFETY (TypeScript)

1.  **No Any**: Hạn chế tối đa dùng `any`. Nếu chưa rõ kiểu, dùng `unknown`.
2.  **Props Interface**: Mọi Component phải định nghĩa Interface cho Props.
    ```typescript
    interface ProductCardProps {
      product: Product;
      onAddToCart: (id: number) => void;
    }
    ```