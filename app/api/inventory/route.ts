import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Inventory } from '@/models/Inventory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const items = await Inventory.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const created = await Inventory.create({
    name: String(body.name ?? '').trim(),
    size: String(body.size ?? '').trim(),
    color: String(body.color ?? '').trim(),
    quantity: Math.max(0, Number(body.quantity) || 0),
  });
  return NextResponse.json(created, { status: 201 });
}
