import Link from 'next/link';
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { vnd, COMBO_DISCOUNT, PLATFORM_FEE } from '@/lib/pricing';
import { ProductsTable } from './products-table';

export const dynamic = 'force-dynamic';

type ProductItem = {
  _id: string;
  name: string;
  importPrice: number;
  facebookPrice: number;
  tiktokPrice: number;
  shopeePrice: number;
};

export default async function ProductsPage() {
  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  const products: ProductItem[] = docs.map((d: any) => ({
    _id: String(d._id),
    name: d.name,
    importPrice: d.importPrice,
    facebookPrice: d.facebookPrice,
    tiktokPrice: d.tiktokPrice,
    shopeePrice: d.shopeePrice,
  }));

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Danh sách sản phẩm</h1>
          <p className="text-white/60 text-sm">
            Tổng cộng: {products.length} sản phẩm · Combo 2 giảm {vnd(COMBO_DISCOUNT.combo2)} · Combo 3 giảm {vnd(COMBO_DISCOUNT.combo3)} · Phí sàn {Math.round(PLATFORM_FEE.facebook * 100)}% (cả 3 kênh)
          </p>
        </div>
        <Link
          href="/products/new"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <ProductsTable products={products} />
    </section>
  );
}
