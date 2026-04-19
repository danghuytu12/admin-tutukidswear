'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type ProductFormValues = {
  name: string;
  importPrice: number;
  facebookPrice: number;
  tiktokPrice: number;
  shopeePrice: number;
};

type Props = Readonly<{
  initial?: Partial<ProductFormValues> & { _id?: string };
  mode: 'create' | 'edit';
}>;

const inputClass =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30';

export function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? '',
    importPrice: initial?.importPrice ?? 0,
    facebookPrice: initial?.facebookPrice ?? 0,
    tiktokPrice: initial?.tiktokPrice ?? 0,
    shopeePrice: initial?.shopeePrice ?? 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, v: ProductFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.name.trim()) {
      setError('Vui lòng nhập tên sản phẩm');
      return;
    }
    setSubmitting(true);
    try {
      const url = mode === 'create' ? '/api/products' : `/api/products/${initial?._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Lưu thất bại');
      router.push('/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-white/10 bg-[#0f1530] p-6">
      <Field label="Tên sản phẩm">
        <input
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Ví dụ: Áo thun cotton..."
          className={inputClass}
          required
        />
      </Field>
      <Field label="Giá nhập (VND)">
        <NumberInput value={values.importPrice} onChange={(v) => update('importPrice', v)} />
      </Field>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Giá bán Facebook">
          <NumberInput value={values.facebookPrice} onChange={(v) => update('facebookPrice', v)} />
        </Field>
        <Field label="Giá bán TikTok">
          <NumberInput value={values.tiktokPrice} onChange={(v) => update('tiktokPrice', v)} />
        </Field>
        <Field label="Giá bán Shopee">
          <NumberInput value={values.shopeePrice} onChange={(v) => update('shopeePrice', v)} />
        </Field>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
        >
          {submitLabel(submitting, mode)}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

function submitLabel(submitting: boolean, mode: 'create' | 'edit') {
  if (submitting) return 'Đang lưu…';
  return mode === 'create' ? 'Tạo sản phẩm' : 'Lưu thay đổi';
}

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({ value, onChange }: Readonly<{ value: number; onChange: (v: number) => void }>) {
  return (
    <input
      type="number"
      min={0}
      step={1000}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputClass}
    />
  );
}
