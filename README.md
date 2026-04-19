# Admin Sản phẩm — Next.js + Mongoose

Trang admin CRUD sản phẩm với các trường: **tên**, **giá nhập**, **giá bán Facebook / TikTok / Shopee**. Backend dùng **Mongoose** (MongoDB). Triển khai **một phát ăn ngay** trên Vercel — cả FE lẫn BE chạy chung trong Next.js App Router.

## 1. Cài đặt local

```bash
npm install
cp .env.local.example .env.local
# Sửa MONGODB_URI trong .env.local (MongoDB Atlas khuyên dùng)
npm run dev
```

Mở http://localhost:3000 → tự redirect sang `/products`.

## 2. Chuẩn bị MongoDB

- Tạo cluster free ở [MongoDB Atlas](https://www.mongodb.com/atlas).
- Trong **Network Access** cho phép IP `0.0.0.0/0` (để Vercel connect được từ mọi region).
- Tạo database user → lấy connection string dạng:

  ```
  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/admin?retryWrites=true&w=majority
  ```

## 3. Deploy lên Vercel

1. Push code lên GitHub/GitLab.
2. Vào https://vercel.com/new → import repo.
3. Ở bước **Environment Variables**, thêm:
   - `MONGODB_URI` = connection string từ bước 2.
4. Bấm **Deploy**. Done — cả frontend lẫn API (`/api/products/*`) đều chạy trong Vercel Functions (Fluid Compute, Node.js runtime).

Hoặc dùng CLI:

```bash
npm i -g vercel
vercel link
vercel env add MONGODB_URI
vercel deploy --prod
```

## 3. Cấu trúc

```
app/
  api/products/route.ts           # GET list, POST create
  api/products/[id]/route.ts      # GET one, PUT update, DELETE
  products/page.tsx               # trang list (SSR từ Mongoose)
  products/new/page.tsx           # form tạo mới
  products/[id]/edit/page.tsx     # form sửa
lib/mongoose.ts                   # connection cache (tránh tạo nhiều kết nối)
models/Product.ts                 # schema Mongoose
```

## 4. Ghi chú kỹ thuật

- `lib/mongoose.ts` cache connection trên `global` — mỗi instance serverless chỉ mở 1 connection, re-dùng qua nhiều request (Fluid Compute).
- API routes set `runtime = 'nodejs'` vì Mongoose yêu cầu Node.js (không chạy edge).
- `next.config.mjs` khai báo `serverExternalPackages: ['mongoose']` để bundler không cố gắng xử lý Mongoose.
