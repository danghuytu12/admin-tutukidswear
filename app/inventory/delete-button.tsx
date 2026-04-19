'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function DeleteButton({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const handleDelete = () => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục tồn kho này?')) return;
    start(async () => {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Xóa thất bại');
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20 disabled:opacity-50"
    >
      {pending ? 'Đang xóa…' : 'Xóa'}
    </button>
  );
}
