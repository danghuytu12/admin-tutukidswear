import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin • Quản lý sản phẩm',
  description: 'Trang quản trị CRUD sản phẩm',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        <header className="border-b border-white/10 bg-[#0f1530]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/products" className="text-lg font-semibold tracking-tight">
              🛒 Admin Sản phẩm
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/products" className="hover:text-white text-white/70">Sản phẩm</Link>
              <Link href="/inventory" className="hover:text-white text-white/70">Tồn kho</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
