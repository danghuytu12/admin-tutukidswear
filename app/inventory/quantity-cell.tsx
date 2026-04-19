'use client';

import { useState } from 'react';

type Props = Readonly<{
  id: string;
  initial: number;
}>;

export function QuantityCell({ id, initial }: Props) {
  const [value, setValue] = useState<number>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const save = async (next: number) => {
    if (next === initial || !Number.isFinite(next) || next < 0) return;
    setSaving(true);
    setStatus('idle');
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: next }),
      });
      if (!res.ok) throw new Error('save failed');
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1200);
    } catch {
      setStatus('error');
      setValue(initial);
    } finally {
      setSaving(false);
    }
  };

  const step = (delta: number) => {
    const next = Math.max(0, value + delta);
    setValue(next);
    save(next);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={saving || value <= 0}
        className="h-7 w-7 rounded-md border border-white/15 text-sm hover:bg-white/10 disabled:opacity-40"
        aria-label="Giảm"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={() => save(Math.max(0, Number(value) || 0))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="h-7 w-16 rounded-md bg-white/5 border border-white/10 px-2 text-center text-sm outline-none focus:border-indigo-400"
      />
      <button
        type="button"
        onClick={() => step(1)}
        disabled={saving}
        className="h-7 w-7 rounded-md border border-white/15 text-sm hover:bg-white/10 disabled:opacity-40"
        aria-label="Tăng"
      >
        +
      </button>
      <span className="ml-1 w-4 text-xs">
        {saving && <span className="text-white/50">…</span>}
        {status === 'saved' && <span className="text-emerald-400">✓</span>}
        {status === 'error' && <span className="text-red-400">!</span>}
      </span>
    </div>
  );
}
