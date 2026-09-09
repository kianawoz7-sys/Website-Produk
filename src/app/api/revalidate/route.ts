import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/produk');
    revalidatePath('/admin/portofolio');
    revalidatePath('/admin/produk');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    return NextResponse.json(
      { revalidated: false, error: (err as Error)?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
