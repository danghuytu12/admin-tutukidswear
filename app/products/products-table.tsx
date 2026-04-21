'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  vnd,
  PLATFORM_NET_RATE,
  targetSinglePrice,
  targetCombo2Price,
  targetCombo3Price,
  facebookCombo2Price,
  facebookCombo3Price,
} from '@/lib/pricing';
import { DeleteButton } from './delete-button';

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

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function ProductsTable({ products }: Readonly<{ products: ProductItem[] }>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return products;
    return products.filter((p) => normalize(p.name).includes(q));
  }, [products, query]);

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm sản phẩm theo tên…"
            className="w-full rounded-lg border border-white/10 bg-[#0f1530] px-4 py-2 pr-9 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-white/50 hover:text-white"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-sm text-white/60">
          {filtered.length}/{products.length} sản phẩm
        </span>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2 + CHANNELS.length * 3 + 1} className="px-4 py-10 text-center text-white/50">
                  {products.length === 0
                    ? 'Chưa có sản phẩm. Bấm "Thêm sản phẩm" để bắt đầu.'
                    : 'Không tìm thấy sản phẩm phù hợp.'}
                </td>
              </tr>
            ) : (
              filtered.map((p) => <ProductRowView key={p._id} product={p} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function HeaderGroup() {
  return (
    <>
      <th className="px-3 py-2 text-right font-medium border-l border-white/10">Giá bán</th>
      <th className="px-3 py-2 text-right font-medium">Combo 2</th>
      <th className="px-3 py-2 text-right font-medium">Combo 3</th>
    </>
  );
}

function ProductRowView({ product }: Readonly<{ product: ProductItem }>) {
  return (
    <tr className="border-t border-white/5">
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 text-right text-white/70">{vnd(product.importPrice)}</td>
      {CHANNELS.map((c) => {
        if (c.key === 'facebook') {
          return (
            <PriceGroup
              key={c.key}
              tone={c.tone}
              base={null}
              combo2={facebookCombo2Price(product.importPrice)}
              combo3={facebookCombo3Price(product.importPrice)}
            />
          );
        }
        const rate = PLATFORM_NET_RATE[c.key];
        return (
          <PriceGroup
            key={c.key}
            tone={c.tone}
            base={targetSinglePrice(product.importPrice, rate)}
            combo2={targetCombo2Price(product.importPrice, rate)}
            combo3={targetCombo3Price(product.importPrice, rate)}
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
}: Readonly<{ tone: string; base: number | null; combo2: number; combo3: number }>) {
  return (
    <>
      <td className={`px-3 py-3 text-right border-l border-white/10 ${tone}`}>
        {base === null ? <span className="text-white/30">—</span> : vnd(base)}
      </td>
      <td className="px-3 py-3 text-right text-white/80">{vnd(combo2)}</td>
      <td className="px-3 py-3 text-right text-white/80">{vnd(combo3)}</td>
    </>
  );
}
