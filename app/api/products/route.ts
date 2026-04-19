import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const created = await Product.create({
    name: String(body.name ?? '').trim(),
    importPrice: Number(body.importPrice) || 0,
    facebookPrice: Number(body.facebookPrice) || 0,
    tiktokPrice: Number(body.tiktokPrice) || 0,
    shopeePrice: Number(body.shopeePrice) || 0,
  });
  return NextResponse.json(created, { status: 201 });
}
