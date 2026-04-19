import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Inventory } from '@/models/Inventory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const item = await Inventory.findById(id).lean();
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const updated = await Inventory.findByIdAndUpdate(
    id,
    {
      name: String(body.name ?? '').trim(),
      size: String(body.size ?? '').trim(),
      color: String(body.color ?? '').trim(),
      quantity: Math.max(0, Number(body.quantity) || 0),
    },
    { new: true },
  ).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const patch: Record<string, unknown> = {};
  if (body.quantity !== undefined) {
    patch.quantity = Math.max(0, Number(body.quantity) || 0);
  }
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.size === 'string') patch.size = body.size.trim();
  if (typeof body.color === 'string') patch.color = body.color.trim();

  const updated = await Inventory.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const deleted = await Inventory.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
