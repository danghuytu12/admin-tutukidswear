import { ProductForm } from '../product-form';

export default function NewProductPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Thêm sản phẩm</h1>
      <ProductForm mode="create" />
    </section>
  );
}
