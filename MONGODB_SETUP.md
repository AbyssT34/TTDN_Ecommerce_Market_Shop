# 🗄️ MONGODB ATLAS SETUP GUIDE

> **Mục tiêu**: Setup MongoDB Atlas (Cloud Database) - Miễn phí, không cần cài đặt

---

## 📋 BƯỚC 1: Tạo MongoDB Atlas Account

1. **Truy cập**: https://www.mongodb.com/cloud/atlas/register
2. **Sign Up** với Google hoặc Email
3. **Chọn plan**: FREE (M0 Sandbox - 512MB)

---

## 📋 BƯỚC 2: Tạo Cluster

1. **Sau khi login**, chọn **"Build a Database"**
2. **Chọn FREE tier**: M0 (512MB storage)
3. **Chọn Region**: 
   - Singapore (asia-southeast1) - GẦN NHẤT VỚI VIỆT NAM
   - Hoặc Hong Kong (asia-east2)
4. **Cluster Name**: Để mặc định hoặc đặt tên `TTDN-Cluster`
5. Click **"Create Cluster"** (mất ~1-2 phút)

---

## 📋 BƯỚC 3: Tạo Database User

1. **Security → Database Access** (menu bên trái)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `ttdn_admin` (hoặc tùy chỉnh)
5. **Password**: Click **"Autogenerate Secure Password"** → **COPY MẬT KHẨU**
   - Ví dụ: `Abc123xyz!@#`
6. **Database User Privileges**: `Atlas Admin` hoặc `Read and write to any database`
7. Click **"Add User"**

⚠️ **LƯU Ý**: Lưu lại username và password, bạn sẽ cần nó!

---

## 📋 BƯỚC 4: Whitelist IP (Cho phép truy cập)

1. **Security → Network Access** (menu bên trái)
2. Click **"Add IP Address"**
3. **Chọn 1 trong 2 option**:
   - **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0) - ĐƠN GIẢN NHẤT
   - Hoặc **Add Current IP Address** - AN TOÀN HƠN
4. Click **"Confirm"**

---

## 📋 BƯỚC 5: Lấy Connection String

1. **Database → Clusters** (menu bên trái)
2. Click **"Connect"** button trên cluster của bạn
3. Chọn **"Drivers"**
4. **Driver**: Node.js, **Version**: Latest
5. **Copy Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 📋 BƯỚC 6: Update .env File

Replace `<username>` và `<password>` trong connection string:

### ❌ **SAI** (Raw connection string):
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### ✅ **ĐÚNG** (Ví dụ với username: ttdn_admin, password: Abc123xyz):
```bash
MONGODB_URI=mongodb+srv://ttdn_admin:Abc123xyz@cluster0.xxxxx.mongodb.net/ecommerce_shop?retryWrites=true&w=majority
```

⚠️ **LƯU Ý**: Thêm `/ecommerce_shop` trước `?retryWrites` để chỉ định database name!

---

## 🧪 BƯỚC 7: Test Connection

```bash
cd server
npx tsx src/test-mongo.ts
```

Nếu thành công sẽ thấy:
```
✅ MongoDB connected successfully!
📁 Database: ecommerce_shop
🌐 Host: cluster0.xxxxx.mongodb.net
```

---

## 🌱 BƯỚC 8: Seed Database (Tạo test accounts)

```bash
cd server
npx tsx src/seed.ts
```

Sẽ tạo 3 test accounts:
- `admin@ttdn.com` / `admin123` (ADMIN)
- `user@ttdn.com` / `user123` (USER)
- `test@ttdn.com` / `test123` (USER)

---

## 🚨 COMMON ISSUES

### Issue 1: "MongoServerError: bad auth"
- ✅ **Fix**: Check username/password trong connection string
- Password có ký tự đặc biệt? Encode với: https://www.urlencoder.org/

### Issue 2: "Connection timeout"
- ✅ **Fix**: Check Network Access whitelist (BƯỚC 4)
- Thêm `0.0.0.0/0` để allow all IPs

### Issue 3: "not authorized on ecommerce_shop"
- ✅ **Fix**: User privileges phải là `Atlas Admin` hoặc `Read and write to any database`

---

## 📌 QUICK REFERENCE

**Connection String Format**:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Example**:
```
mongodb+srv://ttdn_admin:Abc123xyz@cluster0.abc123.mongodb.net/ecommerce_shop?retryWrites=true&w=majority
```

---

**🎯 Sau khi setup xong, quay lại terminal chạy seed script!**
