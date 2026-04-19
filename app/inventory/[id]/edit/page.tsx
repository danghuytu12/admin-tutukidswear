import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongoose';
import { Inventory } from '@/models/Inventory';
import { InventoryForm } from '../../inventory-form';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export default async function EditInventoryPage({ params }: Readonly<Params>) {
  const { id } = await params;
  await connectDB();
  const doc = await Inventory.findById(id).lean<any>();
  if (!doc) notFound();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Sửa mục tồn kho</h1>
      <InventoryForm
        mode="edit"
        initial={{
          _id: String(doc._id),
          name: doc.name,
          size: doc.size,
          color: doc.color,
          quantity: doc.quantity ?? 0,
        }}
      />
    </section>
  );
}
