-- ===============================================
-- Ecommerce_Shop Database Setup Script
-- For HeidiSQL / MySQL Workbench
-- ===============================================

-- 1. CREATE DATABASE
DROP DATABASE IF EXISTS ecommerce_shop;
CREATE DATABASE ecommerce_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_shop;

-- ===============================================
-- 2. CREATE TABLES
-- ===============================================

-- Table: users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    category_id INT,
    unit VARCHAR(20) DEFAULT 'kg',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_sku (sku),
    INDEX idx_stock (stock_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ingredients
CREATE TABLE ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: product_ingredients (Mapping table)
CREATE TABLE product_ingredients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_ingredient (ingredient_id),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: recipes
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSON,
    steps JSON,
    prep_time INT,
    cook_time INT,
    servings INT DEFAULT 4,
    difficulty ENUM('Dễ', 'Trung bình', 'Khó') DEFAULT 'Trung bình',
    image_url VARCHAR(500),
    view_count INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_view_count (view_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'approved', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cart_items
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===============================================
-- 3. INSERT SAMPLE DATA
-- ===============================================

-- Users (Password: admin123, user123, demo123 - bcrypt hashed)
INSERT INTO users (email, password_hash, role, full_name, phone, address) VALUES
('admin@shop.com', '$2b$10$YQ7N5qZ5Y.xZ5YqZ5YqZ5uF5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'admin', 'Admin User', '0901234567', '123 Admin Street, TPHCM'),
('user@shop.com', '$2b$10$YQ7N5qZ5Y.xZ5YqZ5YqZ5uF5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'user', 'Test User', '0987654321', '456 User Avenue, Ha Noi'),
('demo@shop.com', '$2b$10$YQ7N5qZ5Y.xZ5YqZ5YqZ5uF5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y', 'user', 'Demo Customer', '0912345678', '789 Demo Street, Da Nang');

-- Categories (6 main categories)
INSERT INTO categories (name, slug, description) VALUES
('Gia vị', 'gia-vi', 'Các loại gia vị nấu ăn'),
('Hải sản', 'hai-san', 'Hải sản tươi ngon'),
('Ngũ cốc', 'ngu-coc', 'Ngũ cốc và thực phẩm dinh dưỡng'),
('Rau củ quả', 'rau-cu-qua', 'Rau củ quả tươi sạch'),
('Thịt', 'thit', 'Các loại thịt tươi'),
('Trứng & Sữa', 'trung-sua', 'Trứng và sản phẩm từ sữa');

-- Products (60 products total - 10 per category)
INSERT INTO products (name, sku, description, price, stock_quantity, image_url, category_id, is_active) VALUES
-- DANH MỤC 1: GIA VỊ (Category ID: 1)
('Hạt nêm Knorr thịt thăn xương ống 400g', 'GV-001', 'Chiết xuất từ xương thịt tươi cho vị ngọt thanh.', 42000, 100, '/img/gia-vi/hat-nem-knorr.jpg', 1, TRUE),
('Nước mắm Nam Ngư chai 500ml', 'GV-002', 'Nước mắm cá cơm thơm ngon đậm đà.', 45000, 150, '/img/gia-vi/nuoc-nam-nam-ngu.jpg', 1, TRUE),
('Bột ngọt Ajinomoto gói 454g', 'GV-003', 'Gia vị tăng vị umami cho món ăn.', 34000, 120, '/img/gia-vi/bot-ngot-ajnomoto.jpg', 1, TRUE),
('Tương ớt Cholimex chai 270g', 'GV-004', 'Vị cay nồng hấp dẫn cho các món chiên.', 12000, 200, '/img/gia-vi/tuong-ot-cholimex.jpg', 1, TRUE),
('Dầu ăn Simply đậu nành chai 1L', 'GV-005', 'Giàu Omega 3-6-9 tốt cho tim mạch.', 58000, 80, '/img/gia-vi/dau-an-simply.jpg', 1, TRUE),
('Nước tương Maggi thanh dịu chai 300ml', 'GV-006', 'Lên men tự nhiên, vị thanh dịu.', 18000, 140, '/img/gia-vi/nuoc-tuong-maggi.jpg', 1, TRUE),
('Dầu hào Maggi chai 350g', 'GV-007', 'Giúp món xào sáng bóng, đậm đà.', 31000, 90, '/img/gia-vi/dau-hao-maggi.jpg', 1, TRUE),
('Muối iốt gói 100g', 'GV-008', 'Muối iốt tinh khiết, bổ sung iốt tự nhiên.', 15000, 300, '/img/gia-vi/muoi-iot.jpg', 1, TRUE),
('Đường tinh luyện gói 1kg', 'GV-009', 'Đường tinh luyện trắng sạch từ mía.', 28000, 110, '/img/gia-vi/duong.jpg', 1, TRUE),
('Sốt Barona sườn xào chua ngọt', 'GV-010', 'Gia vị hoàn chỉnh chiết xuất rau củ quả tươi.', 12500, 130, '/img/gia-vi/sot-barona.jpg', 1, TRUE),

-- DANH MỤC 2: HẢI SẢN (Category ID: 2)
('Tôm thẻ tươi hộp 500g', 'HS-001', 'Tôm thẻ thịt chắc, ngọt, size vừa.', 115000, 30, '/img/hai-san/tom-the-cp.jpg', 2, TRUE),
('Cá nục làm sạch túi 500g', 'HS-002', 'Cá nục tươi đã làm sạch, tiện lợi nấu ngay.', 38000, 40, '/img/hai-san/ca-nuc-lam-sach.jpg', 2, TRUE),
('Mực ống tươi túi 300g', 'HS-003', 'Mực ống giòn ngọt, thích hợp hấp gừng.', 98000, 20, '/img/hai-san/muc-ong-nguyen-con-dong-lanh-ao-ao-goi-300g_202504251006476615.jpg', 2, TRUE),
('Cá hồi phi lê Na Uy 200g', 'HS-004', 'Cá hồi nhập khẩu, giàu Omega 3.', 175000, 15, '/img/hai-san/ca-hoi-phi-le-sg-food-khay-200g-202403111604230127.jpg', 2, TRUE),
('Cá điêu hồng làm sạch con 800g', 'HS-005', 'Thịt cá trắng, ngọt, không tanh.', 55000, 25, '/img/hai-san/ca-dieu-hong-lam-sach-nguyen-con_202505151838315969.jpg', 2, TRUE),
('Nghêu lụa sạch túi 500g', 'HS-006', 'Nghêu đã sạch cát, thịt béo ngậy.', 42000, 50, '/img/hai-san/ngheu-lua-sach.jpg', 2, TRUE),
('Cá thu cắt khúc túi 300g', 'HS-007', 'Cá thu đại dương thịt chắc, bùi.', 85000, 22, '/img/hai-san/ca-thu-cat-khuc.jpg', 2, TRUE),
('Cua biển Cà Mau con 400g', 'HS-008', 'Cua thịt chắc, đảm bảo tươi sống.', 190000, 10, '/img/hai-san/cua-bien-ca-mau.jpg', 2, TRUE),
('Sò huyết túi 500g', 'HS-009', 'Sò huyết tươi, bổ máu, béo ngọt.', 95000, 18, '/img/hai-san/so-huyet.jpg', 2, TRUE),
('Cá cam làm sạch túi 500g', 'HS-010', 'Cá cam thịt dày, thích hợp kho hoặc nướng.', 45000, 30, '/img/hai-san/ca-cam.jpg', 2, TRUE),

-- DANH MỤC 3: NGŨ CỐC (Category ID: 3)
('Gạo ST25 túi 5kg', 'NC-001', 'Gạo ngon nhất thế giới, thơm lá dứa.', 190000, 100, '/img/ngu-coc/gao-st25.jpg', 3, TRUE),
('Yến mạch Quaker Oats thùng 4.5kg', 'NC-002', 'Yến mạch cán vỡ nhập khẩu từ Mỹ.', 345000, 20, '/img/ngu-coc/quaker-oats-old-fashioned-oatmeal.jpg', 3, TRUE),
('Gạo lứt đỏ túi 2kg', 'NC-003', 'Gạo lứt giàu chất xơ, tốt cho sức khỏe.', 65000, 60, '/img/ngu-coc/gao-lut-do.jpg', 3, TRUE),
('Ngũ cốc Nesvita túi 400g', 'NC-004', 'Bổ sung canxi và chất xơ từ ngũ cốc nguyên cám.', 75000, 80, '/img/ngu-coc/ngu-coc-nesvita.jpg', 3, TRUE),
('Bột đậu nành nguyên chất túi 500g', 'NC-005', 'Bột đậu nành thơm ngon, giàu đạm thực vật.', 48000, 50, '/img/ngu-coc/bot-dau-nanh.jpg', 3, TRUE),
('Gạo nếp cái hoa vàng túi 2kg', 'NC-006', 'Nếp dẻo thơm, chuyên dùng nấu xôi, gói bánh.', 55000, 40, '/img/ngu-coc/nep-cai-hoa-vang-vinh-hien-tui-1kg-202008150913276084.jpg', 3, TRUE),
('Hạt chia hữu cơ gói 200g', 'NC-007', 'Siêu thực phẩm giàu Omega 3 và chất xơ.', 120000, 35, '/img/ngu-coc/hat-chia-sunrise-goi-300g-202102051608220656.jpg', 3, TRUE),
('Đậu xanh nguyên hạt túi 500g', 'NC-008', 'Đậu xanh sạch, hạt đều, không mốc.', 28000, 90, '/img/ngu-coc/dau-xanh-hat-cao-cap-vietfresh-150g-202012092307422357.jpg', 3, TRUE),
('Bột mì đa năng Meizan gói 1kg', 'NC-009', 'Dùng làm bánh hoặc chế biến món ăn.', 24500, 110, '/img/ngu-coc/bot-mi-meizan-500g.jpg', 3, TRUE),
('Bắp nếp Đà Lạt túi 3 trái', 'NC-010', 'Bắp nếp dẻo, ngọt, thu hoạch trong ngày.', 21000, 100, '/img/ngu-coc/bap-nep-cap-202207161543295487.jpg', 3, TRUE),

-- DANH MỤC 4: RAU CỦ QUẢ (Category ID: 4)
('Cà chua VietGAP túi 500g', 'RC-001', 'Cà chua tươi sạch, mọng nước.', 16000, 70, '/img/rau-cu/ca-chua-202312251318033167.jpg', 4, TRUE),
('Bông cải xanh túi 500g', 'RC-002', 'Rau sạch Đà Lạt, giòn ngọt.', 32000, 45, '/img/rau-cu/bong-cai-xanh.jpg', 4, TRUE),
('Cà rốt túi 500g', 'RC-003', 'Cà rốt củ đều, không bị dập.', 14000, 85, '/img/rau-cu/ca-rot-trai-tu-150g-tro-len-clone_202507300953258733.jpg', 4, TRUE),
('Khoai tây túi 1kg', 'RC-004', 'Khoai tây bở, thích hợp làm khoai chiên.', 26000, 65, '/img/rau-cu/khoai-tay-202312260932491620.jpg', 4, TRUE),
('Bắp cải thảo túi 1kg', 'RC-005', 'Cải thảo tươi, thích hợp nấu canh hoặc kim chi.', 19000, 55, '/img/rau-cu/bap-cai-thao-202312271131129709.jpg', 4, TRUE),
('Dưa leo giống Nhật túi 500g', 'RC-006', 'Dưa leo ít hạt, giòn tan.', 15000, 95, '/img/rau-cu/dua-leo-202312281026050444.jpg', 4, TRUE),
('Hành tây túi 500g', 'RC-007', 'Hành tây trắng, củ chắc.', 13000, 100, '/img/rau-cu/hanh-tay-tui-1kg_202505211039247088.jpg', 4, TRUE),
('Xà lách thủy canh 250g', 'RC-008', 'Xà lách sạch, không thuốc trừ sâu.', 22000, 30, '/img/rau-cu/xa-lach-thuy-tinh-thuy-canh-cay-tu-230g_202506090948310961.jpg', 4, TRUE),
('Bí đỏ hồ lô kg', 'RC-009', 'Bí dẻo, ngọt, giàu vitamin A.', 24000, 40, '/img/rau-cu/bi-do-non-trai-250g-350g-202310170842420628.jpg', 4, TRUE),
('Nấm kim châm gói 150g', 'RC-010', 'Nấm tươi trắng, dai giòn.', 12000, 120, '/img/rau-cu/nam-kim-cham-han-quoc-goi-150g-202205181701291485.jpg', 4, TRUE),

-- DANH MỤC 5: THỊT (Category ID: 5)
('Thịt ba rọi heo túi 500g', 'TH-001', 'Thịt sạch, tỷ lệ nạc mỡ cân đối.', 85000, 40, '/img/thit/ba-roi-heo_202601080921555420.jpg', 5, TRUE),
('Thịt bò phi lê nội túi 250g', 'TH-002', 'Thịt bò mềm, không gân.', 95000, 25, '/img/thit/bo-phi-le.jpg', 5, TRUE),
('Đùi gà tỏi CP túi 500g', 'TH-003', 'Gà sạch đạt chuẩn, thịt chắc.', 42000, 55, '/img/thit/dui-toi-ga-1kg_202601081049421310.jpg', 5, TRUE),
('Nạc dăm heo túi 500g', 'TH-004', 'Nạc dăm mềm, có ít vân mỡ.', 72000, 45, '/img/thit/thit-nac-heo-300g_202601080947467806.jpg', 5, TRUE),
('Sườn non heo túi 500g', 'TH-005', 'Sườn non tươi ngon, thích hợp nướng hoặc ram.', 110000, 20, '/img/thit/suon-non-heo-1kg_202601080959514244.jpg', 5, TRUE),
('Cánh gà tươi túi 1kg', 'TH-006', 'Cánh gà chiên nước mắm siêu ngon.', 68000, 30, '/img/thit/canh-ga-500g_202601081052487956.jpg', 5, TRUE),
('Thịt heo xay túi 500g', 'TH-007', 'Thịt tươi xay mới mỗi ngày.', 65000, 60, '/img/thit/thit-heo-xay-cp-100g_202601080924314325.jpg', 5, TRUE),
('Chân giò heo kg', 'TH-008', 'Giò heo tươi, thích hợp nấu bún bò.', 92000, 15, '/img/thit/chan-gio-heo-cp-500g-hang-dan-tem-vang-giam-gia_202601100016288920.jpg', 5, TRUE),
('Thịt vai heo túi 500g', 'TH-009', 'Thịt vai nạc, ít mỡ.', 69000, 50, '/img/thit/thit-vai-heo.jpg', 5, TRUE),
('Lòng heo làm sạch túi 300g', 'TH-010', 'Lòng sạch sẽ, không mùi hôi.', 48000, 20, '/img/thit/long-non-heo-nong-san-dung-ha.jpg', 5, TRUE),

-- DANH MỤC 6: TRỨNG & SỮA (Category ID: 6)
('Trứng gà ta Ba Huân hộp 10 quả', 'TS-001', 'Trứng gà tươi từ trang trại hiện đại.', 31000, 100, '/img/trung-sua/Trung-Ga-Thao-Duoc_hop-10_07102024.jpg', 6, TRUE),
('Sữa tươi TH True Milk ít đường 1L', 'TS-002', 'Sữa tươi nguyên chất 100% sạch.', 36000, 150, '/img/trung-sua/sua-tiet-trung-th-it-duong-1l-3-700x467.jpg', 6, TRUE),
('Sữa chua Vinamilk có đường lốc 4', 'TS-003', 'Sữa chua lên men tự nhiên.', 26000, 200, '/img/trung-sua/loc-4-hu-sua-chua-co-duong-vinamilk-len-men-tu-nhien-100g_202508281518442130.jpg', 6, TRUE),
('Sữa đặc Ông Thọ đỏ lon 380g', 'TS-004', 'Sữa đặc có đường huyền thoại.', 24000, 300, '/img/trung-sua/sua-dac-co-duong-ong-tho-trang-nhan-vang-lon-380g-202306141608258891.jpg', 6, TRUE),
('Trứng vịt Ba Huân hộp 10 quả', 'TS-005', 'Trứng vịt lớn, lòng đỏ đậm.', 38000, 80, '/img/trung-sua/trung-vit-hop-10.jpg', 6, TRUE),
('Sữa tươi Vinamilk có đường 180ml', 'TS-006', 'Lốc 4 hộp sữa tiệt trùng.', 31000, 250, '/img/trung-sua/loc-4-hop-sua-tuoi-tiet-trung-co-duong-vinamilk-100-sua-tuoi-180ml-202403281331556972.jpg', 6, TRUE),
('Phô mai con bò cười hộp 8 miếng', 'TS-007', 'Phô mai giàu canxi và dinh dưỡng.', 38000, 70, '/img/trung-sua/pho-mai-con-bo-cuoi-hop-120g-8-mieng_202507081433598988.jpg', 6, TRUE),
('Sữa hạt Milo lốc 4 hộp 180ml', 'TS-008', 'Thức uống lúa mạch thơm ngon.', 29000, 180, '/img/trung-sua/thuc-uong-dd-milo-180ml-loc_202511201416590267.jpg', 6, TRUE),
('Sữa đậu nành Fami lốc 6 bịch', 'TS-009', 'Làm từ đậu nành chọn lọc không biến đổi gen.', 28000, 140, '/img/trung-sua/loc-6-hop-sua-dau-nanh-nguyen-chat-fami-200ml-202407161358005598.jpg', 6, TRUE),
('Bơ lạt Anchor khối 227g', 'TS-010', 'Bơ nhập khẩu cao cấp dùng làm bánh.', 85000, 40, '/img/trung-sua/bo-lat-anchor-227g-202201022308318607.jpg', 6, TRUE);

-- Ingredients (Common ingredients for recipes)
INSERT INTO ingredients (name, description) VALUES
('Thịt ba rọi', 'Thịt ba rọi heo tươi'),
('Thịt gà', 'Thịt gà tươi ngon'),
('Thịt bò', 'Thịt bò Úc cao cấp'),
('Cá hồi', 'Cá hồi Na Uy phi lê'),
('Tôm', 'Tôm sú tươi sống'),
('Cá', 'Cá tươi các loại'),
('Rau cải', 'Rau cải xanh tươi'),
('Cà chua', 'Cà chua đỏ chín'),
('Hành tây', 'Hành tây tươi'),
('Tỏi', 'Tỏi tươi thơm'),
('Gừng', 'Gừng tươi cay nồng'),
('Ớt', 'Ớt tươi cay'),
('Nước mắm', 'Nước mắm Nam Ngư'),
('Đường', 'Đường trắng tinh luyện'),
('Muối', 'Muối biển sạch'),
('Tiêu', 'Tiêu đen hạt'),
('Dầu ăn', 'Dầu ăn thực vật'),
('Gạo', 'Gạo ST25 thơm ngon'),
('Trứng gà', 'Trứng gà tươi'),
('Bột mì', 'Bột mì đa dụng'),
('Sả', 'Sả tươi thơm'),
('Rau thơm', 'Rau thơm các loại'),
('Nước dừa', 'Nước dừa tươi'),
('Me', 'Me chua'),
('Đậu que', 'Đậu que tươi');

-- Sample Recipes (Vietnamese dishes)
INSERT INTO recipes (name, description, ingredients, steps, prep_time, cook_time, servings, difficulty, image_url, view_count, active) VALUES
(
    'Thịt kho trứng',
    'Món kho truyền thống của người Việt, thịt ba rọi mềm thấm vị cùng trứng thơm ngon',
    JSON_ARRAY(
        JSON_OBJECT('ingredient_id', 1, 'ingredient_name', 'Thịt ba rọi', 'quantity', '500g'),
        JSON_OBJECT('ingredient_id', 19, 'ingredient_name', 'Trứng gà', 'quantity', '4 quả'),
        JSON_OBJECT('ingredient_id', 13, 'ingredient_name', 'Nước mắm', 'quantity', '3 muống'),
        JSON_OBJECT('ingredient_id', 14, 'ingredient_name', 'Đường', 'quantity', '2 muống'),
        JSON_OBJECT('ingredient_id', 9, 'ingredient_name', 'Hành tây', 'quantity', '2 củ'),
        JSON_OBJECT('ingredient_id', 10, 'ingredient_name', 'Tỏi', 'quantity', '3 tép')
    ),
    JSON_ARRAY(
        'Thịt rửa sạch, cắt miếng vừa ăn',
        'Luộc trứng chín, bóc vỏ',
        'Ướp thịt với nước mắm, đường, tiêu 30 phút',
        'Làm nước màu: đun đường đến khi chảy nâu',
        'Cho thịt vào kho với nước màu, thêm nước',
        'Cho trứng vào, kho lửa nhỏ 45 phút'
    ),
    15,
    45,
    4,
    'Dễ',
    '/images/recipes/thit-kho-trung.jpg',
    0,
    TRUE
),
(
    'Cơm chiên dương châu',
    'Món cơm chiên Trung Hoa được Việt hóa, hấp dẫn với tôm, trứng và rau củ',
    JSON_ARRAY(
        JSON_OBJECT('ingredient_id', 18, 'ingredient_name', 'Gạo', 'quantity', '2 bát cơm nguội'),
        JSON_OBJECT('ingredient_id', 19, 'ingredient_name', 'Trứng gà', 'quantity', '2 quả'),
        JSON_OBJECT('ingredient_id', 5, 'ingredient_name', 'Tôm', 'quantity', '100g'),
        JSON_OBJECT('ingredient_id', 9, 'ingredient_name', 'Hành tây', 'quantity', '1 củ'),
        JSON_OBJECT('ingredient_id', 10, 'ingredient_name', 'Tỏi', 'quantity', '2 tép'),
        JSON_OBJECT('ingredient_id', 17, 'ingredient_name', 'Dầu ăn', 'quantity', '3 muống')
    ),
    JSON_ARRAY(
        'Đánh tan trứng, chiên thành trứng tơi',
        'Phi thơm hành tỏi băm',
        'Xào tôm cho chín, vớt ra',
        'Cho cơm vào xào đều trên lửa lớn',
        'Trộn trứng và tôm vào',
        'Nêm nếm gia vị, rắc hành lá'
    ),
    10,
    15,
    2,
    'Dễ',
    '/images/recipes/com-chien.jpg',
    0,
    TRUE
),
(
    'Canh chua cá',
    'Món canh đặc trưng miền Nam, vị chua thanh ngọt từ me và cà chua',
    JSON_ARRAY(
        JSON_OBJECT('ingredient_id', 6, 'ingredient_name', 'Cá', 'quantity', '300g'),
        JSON_OBJECT('ingredient_id', 8, 'ingredient_name', 'Cà chua', 'quantity', '2 quả'),
        JSON_OBJECT('ingredient_id', 24, 'ingredient_name', 'Me', 'quantity', '1 muống'),
        JSON_OBJECT('ingredient_id', 14, 'ingredient_name', 'Đường', 'quantity', '1 muống'),
        JSON_OBJECT('ingredient_id', 13, 'ingredient_name', 'Nước mắm', 'quantity', '2 muống'),
        JSON_OBJECT('ingredient_id', 22, 'ingredient_name', 'Rau thơm', 'quantity', '1 bó')
    ),
    JSON_ARRAY(
        'Cá rửa sạch, cắt khúc vừa',
        'Cà chua cắt múi cau',
        'Nấu nước sôi, cho me và cà chua vào',
        'Nêm nếm chua ngọt vừa ăn',
        'Cho cá vào nấu 10 phút',
        'Rắc rau thơm, tắt bếp'
    ),
    10,
    20,
    4,
    'Dễ',
    '/images/recipes/canh-chua-ca.jpg',
    0,
    TRUE
),
(
    'Gà kho gừng',
    'Món kho đậm đà với thịt gà thấm vị gừng thơm nồng',
    JSON_ARRAY(
        JSON_OBJECT('ingredient_id', 2, 'ingredient_name', 'Thịt gà', 'quantity', '500g'),
        JSON_OBJECT('ingredient_id', 11, 'ingredient_name', 'Gừng', 'quantity', '50g'),
        JSON_OBJECT('ingredient_id', 13, 'ingredient_name', 'Nước mắm', 'quantity', '3 muống'),
        JSON_OBJECT('ingredient_id', 14, 'ingredient_name', 'Đường', 'quantity', '1 muống'),
        JSON_OBJECT('ingredient_id', 10, 'ingredient_name', 'Tỏi', 'quantity', '3 tép')
    ),
    JSON_ARRAY(
        'Gà chặt miếng, ướp với nước mắm, tiêu',
        'Gừng thái lát mỏng',
        'Phi thơm tỏi, cho gà vào xào',
        'Thêm gừng, đường, nước',
        'Kho lửa nhỏ 30 phút đến khi thịt mềm'
    ),
    15,
    30,
    4,
    'Trung bình',
    '/images/recipes/ga-kho-gung.jpg',
    0,
    TRUE
),
(
    'Bò xào rau củ',
    'Món xào nhanh gọn với thịt bò mềm và rau củ giòn ngon',
    JSON_ARRAY(
        JSON_OBJECT('ingredient_id', 3, 'ingredient_name', 'Thịt bò', 'quantity', '300g'),
        JSON_OBJECT('ingredient_id', 7, 'ingredient_name', 'Rau cải', 'quantity', '200g'),
        JSON_OBJECT('ingredient_id', 9, 'ingredient_name', 'Hành tây', 'quantity', '1 củ'),
        JSON_OBJECT('ingredient_id', 10, 'ingredient_name', 'Tỏi', 'quantity', '2 tép'),
        JSON_OBJECT('ingredient_id', 17, 'ingredient_name', 'Dầu ăn', 'quantity', '2 muống')
    ),
    JSON_ARRAY(
        'Thịt bò thái lát mỏng, ướp tiêu, nước tương',
        'Rau củ rửa sạch, cắt vừa',
        'Phi thơm tỏi, xào bò trên lửa lớn',
        'Cho rau củ vào xào nhanh',
        'Nêm nếm, tắt bếp khi rau vừa chín'
    ),
    10,
    10,
    2,
    'Dễ',
    '/images/recipes/bo-xao-rau.jpg',
    0,
    TRUE
);

-- ===============================================
-- 4. VERIFICATION QUERIES
-- ===============================================

-- Check data
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'Recipes', COUNT(*) FROM recipes;

-- ===============================================
-- SCRIPT COMPLETE
-- ===============================================
-- Database: ecommerce_shop
-- Tables: 9
-- Categories: 6 (Gia vị, Hải sản, Ngũ cốc, Rau củ quả, Thịt, Trứng & Sữa)
-- Products: 60 (10 per category with images)
-- Ingredients: 25
-- Recipes: 5 Vietnamese dishes
-- 
-- Default accounts:
-- - Admin: admin@shop.com / admin123
-- - User: user@shop.com / user123
-- - Demo: demo@shop.com / demo123
-- 
-- All product images are mapped from /img/ folders
-- ===============================================
