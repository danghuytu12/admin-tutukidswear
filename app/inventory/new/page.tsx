import { InventoryForm } from '../inventory-form';

export default function NewInventoryPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Thêm tồn kho</h1>
      <InventoryForm mode="create" />
    </section>
  );
}
