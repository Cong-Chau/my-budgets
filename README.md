# 💰 MyBudget — Ứng dụng Quản lý Tài chính Cá nhân

Ứng dụng web quản lý tài chính cá nhân toàn diện, hỗ trợ theo dõi thu chi, đặt ngân sách theo danh mục, và trợ lý AI chat tư vấn tài chính.

---

## 🚀 Tính năng

- **Xác thực** — Đăng ký / Đăng nhập với JWT (Access Token 15 phút + Refresh Token 7 ngày, lưu cookie HttpOnly)
- **Dashboard** — Tổng quan thu chi, biểu đồ theo thời gian với Recharts
- **Giao dịch** — Tạo, sửa, xóa giao dịch thu/chi, lọc theo danh mục và ngày
- **Danh mục** — Quản lý danh mục INCOME / EXPENSE, chọn nhanh từ gợi ý
- **Ngân sách** — Đặt giới hạn chi tiêu theo tuần / tháng, hiển thị % đã dùng và trạng thái (an toàn / gần giới hạn / vượt)
- **Trợ lý AI** — Chat với Gemini AI để được tư vấn tài chính cá nhân
- **Onboarding** — Wizard thiết lập ban đầu cho người dùng mới
- **Dark Mode** — Chuyển đổi sáng/tối, lưu vào localStorage
- **Responsive** — Sidebar ẩn/hiện trên mobile

---

## 🏗️ Kiến trúc

```
FINANCE-MANAGEMENT/
├── backend/          # NestJS API + Prisma ORM
│   ├── src/
│   │   ├── auth/         # JWT, Refresh Token, Passport strategies
│   │   ├── users/        # Quản lý người dùng
│   │   ├── categories/   # CRUD danh mục
│   │   ├── transactions/ # CRUD giao dịch
│   │   ├── budgets/      # CRUD ngân sách + tính % chi tiêu
│   │   ├── dashboard/    # Thống kê tổng hợp
│   │   └── chat/         # Tích hợp Gemini AI
│   └── prisma/       # Schema PostgreSQL
│
├── frontend/         # React 19 + Vite + Tailwind CSS v4
│   └── src/
│       ├── pages/        # Dashboard, Transactions, Categories, Profile
│       ├── components/   # UI components, Sidebar, Onboarding
│       ├── context/      # Auth, Category, Budget contexts
│       └── store/        # Redux Toolkit slices
│
└── docker-compose.yml  # PostgreSQL + Backend + Frontend (Nginx)
```

### Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Redux Toolkit, Recharts |
| Backend | NestJS 11, TypeScript, Prisma 6, Passport JWT |
| Database | PostgreSQL 16 |
| AI | Google Gemini API (xoay vòng 5 API key) |
| Container | Docker, Nginx (reverse proxy) |
| Package manager | pnpm |

---

## ⚙️ Yêu cầu hệ thống

- **Node.js** >= 22
- **pnpm** >= 9 (`npm install -g pnpm`)
- **PostgreSQL** >= 15 (chạy local) **hoặc** Docker Desktop (chạy Docker)

---

## 🖥️ Chạy Local (Development)

### 1. Clone & cài đặt

```bash
git clone <repo-url>
cd FINANCE-MANAGEMENT
```

### 2. Cài đặt dependencies

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 3. Tạo database PostgreSQL

Trước tiên cần tạo database `finance_db` trong PostgreSQL. Có thể dùng một trong các cách sau:

**Dùng psql (command line):**

```bash
psql -U postgres -c "CREATE DATABASE finance_db;"
```

**Dùng pgAdmin:**
1. Mở pgAdmin → kết nối server PostgreSQL
2. Chuột phải vào **Databases** → **Create** → **Database...**
3. Nhập `finance_db` → **Save**

**Dùng DBeaver / TablePlus / DataGrip:**
- Kết nối server → New Database → đặt tên `finance_db` → OK

### 4. Cấu hình biến môi trường

**Backend** — tạo file `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:<mật-khẩu-postgres>@localhost:5432/finance_db?schema=public"

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

PORT=3001
CORS_ORIGINS=http://localhost:5173,http://localhost:4173

# Gemini AI (cần ít nhất 1 key)
GEMINI_API_KEY_1=your_gemini_api_key
```

**Frontend** — tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 5. Chạy migration (tạo bảng)

```bash
cd backend
npx prisma migrate deploy
```

> Lần đầu phát triển có thể dùng `npx prisma migrate dev` để tạo migration mới.

### 6. Chạy ứng dụng

Mở **2 terminal** chạy song song:

```bash
# Terminal 1 — Backend (port 3001)
cd backend
pnpm start:dev

# Terminal 2 — Frontend (port 5173)
cd frontend
pnpm dev
```

Truy cập: **http://localhost:5173**

> API Swagger docs: **http://localhost:3001/api/docs**

---

## 🐳 Chạy Docker Compose (Production)

> Docker tự động tạo database `finance_db` và chạy migration — không cần cài PostgreSQL thủ công.

### 1. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc (copy từ example):

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
# Mật khẩu PostgreSQL
POSTGRES_PASSWORD=your_secure_password

# Port mở ra ngoài (mặc định 2604)
APP_PORT=2604

# CORS — origin của frontend
CORS_ORIGINS=http://localhost:2604
```

Tạo/cập nhật `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:<POSTGRES_PASSWORD>@postgres:5432/finance_db?schema=public
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY_1=your_gemini_api_key
```

> ⚠️ Khi chạy Docker, `DATABASE_URL` phải dùng hostname **`postgres`** (tên service), không phải `localhost`.

### 2. Build & khởi động

```bash
docker compose up --build -d
```

Lần đầu build mất khoảng **1–2 phút**. Các lần sau dùng cache, chỉ mất vài giây.

Truy cập: **http://localhost:2604** (hoặc port bạn đặt trong `APP_PORT`)

### 3. Các lệnh hữu ích

```bash
# Xem logs tất cả services
docker compose logs -f

# Xem logs từng service
docker compose logs -f backend
docker compose logs -f frontend

# Dừng tất cả containers
docker compose down

# Dừng và xóa cả volume (reset toàn bộ database)
docker compose down -v

# Restart một service
docker compose restart backend
```

### 4. Cấu trúc Docker

| Service | Image | Mô tả |
|---|---|---|
| `postgres` | `postgres:16-alpine` | Database, data lưu trong volume `postgres_data` |
| `backend` | Multi-stage build từ `node:22-alpine` | NestJS API, tự động chạy migration khi khởi động |
| `frontend` | Multi-stage build + `nginx:alpine` | React app được serve qua Nginx, proxy `/api` → backend |

---

## 🔑 Biến môi trường — Tham chiếu đầy đủ

Xem file [`.env.example`](./.env.example) để biết toàn bộ biến.

| Biến | Mô tả | Mặc định |
|---|---|---|
| `POSTGRES_PASSWORD` | Mật khẩu PostgreSQL | `200604` |
| `JWT_ACCESS_SECRET` | Secret ký Access Token | *(bắt buộc)* |
| `JWT_REFRESH_SECRET` | Secret ký Refresh Token | *(bắt buộc)* |
| `JWT_ACCESS_EXPIRES_IN` | Thời hạn Access Token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn Refresh Token | `7d` |
| `GEMINI_API_KEY_1..5` | API keys Gemini AI | *(ít nhất 1 key)* |
| `APP_PORT` | Port expose ra host (Docker) | `2604` |
| `CORS_ORIGINS` | Origins được phép (backend) | `http://localhost:2604` |
| `VITE_API_URL` | Base URL của API (frontend build) | `/api` |

---

## 📁 Database Schema

```
User ──< Category ──< Transaction
     ──< Budget
     ──  Account
```

- **User** — tài khoản người dùng, JWT refresh token
- **Account** — hồ sơ cá nhân (tên hiển thị)
- **Category** — danh mục INCOME / EXPENSE (unique per user)
- **Transaction** — giao dịch thu/chi, liên kết Category
- **Budget** — ngân sách giới hạn chi tiêu per Category per Period (WEEKLY / MONTHLY)

---

## 📜 License

UNLICENSED — Dự án cá nhân.
