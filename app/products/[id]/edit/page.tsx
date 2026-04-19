import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductForm } from '../../product-form';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Readonly<Params>) {
  const { id } = await params;
  await connectDB();
  const doc = await Product.findById(id).lean<any>();
  if (!doc) notFound();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Sửa sản phẩm</h1>
      <ProductForm
        mode="edit"
        initial={{
          _id: String(doc._id),
          name: doc.name,
          importPrice: doc.importPrice,
          facebookPrice: doc.facebookPrice,
          tiktokPrice: doc.tiktokPrice,
          shopeePrice: doc.shopeePrice,
        }}
      />
    </section>
  );
}
