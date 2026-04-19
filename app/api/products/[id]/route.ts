import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name: String(body.name ?? '').trim(),
      importPrice: Number(body.importPrice) || 0,
      facebookPrice: Number(body.facebookPrice) || 0,
      tiktokPrice: Number(body.tiktokPrice) || 0,
      shopeePrice: Number(body.shopeePrice) || 0,
    },
    { new: true },
  ).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await connectDB();
  const deleted = await Product.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
