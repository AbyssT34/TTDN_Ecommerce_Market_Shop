# TTDN Ecommerce Market Shop - Báo cáo Tiến độ Dự án

> Trạng thái cập nhật lần cuối: Đồng bộ nguồn mã thực tế
> Chế độ: **Đang phát triển**

---

## 📊 Tổng quan Lộ trình (Roadmap 6 Phases)

| Giai đoạn | Tên Giai đoạn | Trạng thái | Đánh giá hoàn thành | Các tính năng đã xong |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & Setup | ✅ **Hoàn thành** | 100% | Cấu trúc thư mục (Monorepo), Database Schemas (User, Product, Category, Order, Recipe, ChatMessage), Các API routes cơ bản, Vite Compression. |
| **Phase 2** | Visual & Security | ✅ **Hoàn thành** | 100% | Design System (Glass/Dark), Auth Flow (Login, Register, Profile, Protected Routes, JWT), Zustand, Framer Motion. |
| **Phase 3** | Commerce Engine | ✅ **Gần hoàn thành** | 90% | Catalog sản phẩm, Danh sách sản phẩm, Chi tiết sản phẩm, Giỏ hàng (chờ 15p), Thanh toán checkout cơ bản, Quản lý đơn hàng (List & Detail). Tích hợp SePay (còn tùy chỉnh Webhook và Polling Frontend nếu cần). |
| **Phase 4** | Command Center | ⏳ **Chưa bắt đầu** | 0% | Chưa có `admin` route ở Frontend. Chưa có giao diện Admin Dashboard và quản lý CRUD cho Sản phẩm/Người dùng/Đơn hàng. Cần tích hợp Cloudinary Upload API. |
| **Phase 5** | The AI Brain | ⏳ **Chưa bắt đầu** | 0% | Chưa tích hợp LangChain, Claude 3.5. Chưa có tính năng Chatbot tư vấn, Recipe Hub (Gợi ý nấu ăn dựa trên nguyên liệu giỏ hàng) và chức năng gom nguyên liệu công thức vào giỏ. |
| **Phase 6** | Polish & Ship | ⏳ **Chưa bắt đầu** | 0% | Thiếu Unit Test, E2E Test (Playwright/Cypress), SEO Optimization, Tài liệu API (Swagger), Production Build review. |

---

## 📁 Hiện trạng Cấu trúc Mã nguồn (Thực tế)

### Frontend (`client/src/features`)
Các tính năng hiện đã có source code:
- `auth`: Chứa xác thực, Login, Register, Profile.
- `products`: Chứa ProductListPage, ProductDetailPage.
- `cart`: Chứa CartPage.
- `checkout`: Chứa CheckoutPage, PaymentPage.
- `orders`: Chứa OrderListPage, OrderDetailPage.
- *(Thiết hụt: `admin`, `recipe`, `chatbot`)*

### Backend API (`server/src/routes`)
Các tính năng hiện đã có source code:
- `auth.routes.ts`
- `cart.routes.ts`
- `category.routes.ts`
- `product.routes.ts`
- `order.routes.ts`
- `test.routes.ts`
- *(Thiết hụt: `recipe.routes.ts`, `chat.routes.ts`)*

---

## 🚀 Tính năng Chờ Phát triển (Pending Features)

1. **Khối Admin (Command Center):**
   - Lên khung Layout cho Admin
   - Trang Tổng quan (Dashboard Analytics)
   - Trang Quản lý Sản phẩm (Thêm/Sửa/Xóa, Tích hợp tải ảnh Cloudinary)
   - Trang Quản lý Đơn hàng (Cập nhật trạng thái)

2. **Khối AI (The AI Brain):**
   - Cấu hình LangChain + Claude 3.5 Sonnet Backend
   - Giao diện UI Chatbot Smart Shopping Assistant (Glass bubble)
   - Mapping Product - Recipe
   - Giao diện AI Recipe Hub (Gợi ý món ăn và Cost Calculator)

3. **Chức năng Đặc thù (Thương mại Thực phẩm):**
   - Xử lý Cronjob / Hủy giữ hàng sau 15 phút (Nếu chưa check backend code).
   - Đếm ngược khuyến mãi đồ sắp hết hạn.
   - Hoàn thiện luồng kiểm thử giao dịch SePay Webhook.

---

## Lời khuyên cho Bước tiếp theo:
Bắt đầu triển khai **Phase 4 - Command Center (Admin Dashboard)** để hoàn thiện luồng vận hành của chủ gian hàng (quản trị, lên sản phẩm, xử lý đơn) trước khi áp dụng AI ở Phase 5.
