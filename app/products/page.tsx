import Link from 'next/link';
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { combo2Price, combo3Price, netReceived, vnd, COMBO_DISCOUNT, PLATFORM_FEE } from '@/lib/pricing';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

type ProductItem = {
  _id: string;
  name: string;
  importPrice: number;
  facebookPrice: number;
  tiktokPrice: number;
  shopeePrice: number;
};

type Channel = {
  key: 'facebook' | 'tiktok' | 'shopee';
  label: string;
  tone: string;
};

const CHANNELS: Channel[] = [
  { key: 'facebook', label: 'Facebook', tone: 'text-sky-300' },
  { key: 'tiktok', label: 'TikTok', tone: 'text-pink-300' },
  { key: 'shopee', label: 'Shopee', tone: 'text-orange-300' },
];

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

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0f1530]">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th rowSpan={2} className="px-4 py-3 text-left align-middle">Tên sản phẩm</th>
              <th rowSpan={2} className="px-4 py-3 text-right align-middle">Giá nhập</th>
              {CHANNELS.map((c) => (
                <th
                  key={c.key}
                  colSpan={3}
                  className={`px-4 py-2 text-center border-l border-white/10 ${c.tone}`}
                >
                  {c.label}
                </th>
              ))}
              <th rowSpan={2} className="px-4 py-3 text-right align-middle">Hành động</th>
            </tr>
            <tr className="text-xs text-white/50">
              {CHANNELS.map((c) => (
                <HeaderGroup key={c.key} />
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={2 + CHANNELS.length * 4 + 1} className="px-4 py-10 text-center text-white/50">
                  Chưa có sản phẩm. Bấm "Thêm sản phẩm" để bắt đầu.
                </td>
              </tr>
            ) : (
              products.map((p) => <ProductRowView key={p._id} product={p} />)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeaderGroup() {
  return (
    <>
      <th className="px-3 py-2 text-right font-medium border-l border-white/10">Giá bán</th>
      <th className="px-3 py-2 text-right font-medium">Combo 2</th>
      <th className="px-3 py-2 text-right font-medium">Combo 3</th>
      {/* <th className="px-3 py-2 text-right font-medium">Lãi/1 sp</th> */}
    </>
  );
}

function ProductRowView({ product }: Readonly<{ product: ProductItem }>) {
  const channelPrices: Record<Channel['key'], number> = {
    facebook: product.facebookPrice,
    tiktok: product.tiktokPrice,
    shopee: product.shopeePrice,
  };

  return (
    <tr className="border-t border-white/5">
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 text-right text-white/70">{vnd(product.importPrice)}</td>
      {CHANNELS.map((c) => {
        const base = channelPrices[c.key];
        const net = netReceived(base, product.importPrice, PLATFORM_FEE[c.key]);
        return (
          <PriceGroup
            key={c.key}
            tone={c.tone}
            base={base}
            combo2={combo2Price(base)}
            combo3={combo3Price(base)}
            net={net}
          />
        );
      })}
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Link
            href={`/products/${product._id}/edit`}
            className="rounded-md border border-white/15 px-3 py-1 text-xs hover:bg-white/10"
          >
            Sửa
          </Link>
          <DeleteButton id={product._id} />
        </div>
      </td>
    </tr>
  );
}

function PriceGroup({
  tone,
  base,
  combo2,
  combo3,
  net,
}: Readonly<{ tone: string; base: number; combo2: number; combo3: number; net: number }>) {
  return (
    <>
      <td className={`px-3 py-3 text-right border-l border-white/10 ${tone}`}>{vnd(base)}</td>
      <td className="px-3 py-3 text-right text-white/80">{vnd(combo2)}</td>
      <td className="px-3 py-3 text-right text-white/80">{vnd(combo3)}</td>
      {/* <td className={`px-3 py-3 text-right font-medium ${net >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
        {vnd(net)}
      </td> */}
    </>
  );
}
