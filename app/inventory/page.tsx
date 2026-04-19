import Link from 'next/link';
import { connectDB } from '@/lib/mongoose';
import { Inventory } from '@/models/Inventory';
import { DeleteButton } from './delete-button';
import { QuantityCell } from './quantity-cell';

export const dynamic = 'force-dynamic';

type InventoryRow = {
  _id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
};

export default async function InventoryPage() {
  await connectDB();
  const docs = await Inventory.find().sort({ createdAt: -1 }).lean();
  const items: InventoryRow[] = docs.map((d: any) => ({
    _id: String(d._id),
    name: d.name,
    size: d.size,
    color: d.color,
    quantity: d.quantity ?? 0,
  }));

  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý tồn kho</h1>
          <p className="text-white/60 text-sm">
            {items.length} mục · Tổng số lượng: <span className="text-white">{totalQty}</span>
          </p>
        </div>
        <Link
          href="/inventory/new"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
        >
          + Thêm tồn kho
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f1530]">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/70">
            <tr>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Màu sắc</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/50">
                  Chưa có mục nào. Bấm "Thêm tồn kho" để bắt đầu.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-medium">{it.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs">{it.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs">{it.color}</span>
                  </td>
                  <td className="px-4 py-3">
                    <QuantityCell id={it._id} initial={it.quantity} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/inventory/${it._id}/edit`}
                        className="rounded-md border border-white/15 px-3 py-1 text-xs hover:bg-white/10"
                      >
                        Sửa
                      </Link>
                      <DeleteButton id={it._id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
