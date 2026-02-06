---
trigger: always_on
---

# ECOMMERCE-SPECS.md - Food Shop Domain Logic

> **Mục tiêu**: Định nghĩa logic nghiệp vụ đặc thù cho sàn thương mại điện tử thực phẩm (TTDN_Ecommerce_Market_Shop).

---

## 🥦 1. PRODUCT & CATALOG (Đặc thù Thực phẩm)

1.  **Unit of Measure (Đơn vị tính)**:
    * Hệ thống phải hỗ trợ đa đơn vị tính: `kg`, `gram`, `gói` (pack), `bó` (bundle), `thùng` (carton).
    * **Logic giá**: Hỗ trợ giá theo trọng lượng (Ví dụ: Dưa hấu bán theo kg, nhưng user chọn mua theo trái ~2kg).
2.  **Expiry Management (Quản lý hạn dùng)**:
    * Hiển thị rõ ràng "Hạn sử dụng" (Expiry Date) hoặc "Ngày sản xuất" (Manufacturing Date) trên trang chi tiết.
    * **Cảnh báo**: Tự động gắn tag "Sắp hết hạn" (Near Expiry) nếu còn < 3 ngày -> Giảm giá tự động.
3.  **Freshness Data**:
    * Lưu trữ thông tin nguồn gốc (Origin): Đà Lạt, Miền Tây, Nhập khẩu.
    * Mô tả bảo quản: "Ngăn mát", "Ngăn đông", "Nhiệt độ thường".

---

## 🛒 2. CART & INVENTORY (Giỏ hàng & Kho)

1.  **Inventory Reservation (Giữ hàng)**:
    * Do thực phẩm là hàng nhanh hết, chỉ giữ hàng trong giỏ (reservation) trong **15 phút**.
    * Sau 15 phút không checkout, nhả tồn kho cho người khác.
2.  **Perishable limit (Giới hạn hàng tươi sống)**:
    * Cảnh báo nếu user mua quá số lượng có thể giao ngay (Ví dụ: 50kg thịt) -> Cần liên hệ bán buôn.

---

## 🚚 3. CHECKOUT & DELIVERY (Giao nhận)

1.  **Delivery Slots (Khung giờ giao)**:
    * Thực phẩm cần giao nhanh. User được chọn khung giờ nhận hàng (Sáng: 8h-12h, Chiều: 14h-18h).
    * Logic phí ship: Tính theo khoảng cách thực tế (Google Maps API) vì hàng thực phẩm cồng kềnh.
2.  **COD Policy**:
    * Cho phép COD (Thanh toán khi nhận) với đơn hàng < 2.000.000 VNĐ.
    * Đơn hàng lớn bắt buộc cọc hoặc chuyển khoản trước.

---

## 🔄 4. ORDER LIFECYCLE (Vòng đời đơn)

Trạng thái đơn hàng (Status Flow):
`PENDING` (Chờ xác nhận) -> `CONFIRMED` (Đã gọi xác nhận) -> `PREPARING` (Đang nhặt hàng) -> `SHIPPING` (Đang giao) -> `COMPLETED` (Giao thành công) | `CANCELLED` (Hủy).

*Lưu ý: Không cho phép hủy đơn khi đã sang trạng thái `PREPARING` (vì thịt/cá đã được cắt/sơ chế).*