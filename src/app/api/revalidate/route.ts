import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { slug, path } = body;

    // Revalida a vitrine principal
    revalidatePath('/');
    revalidatePath('/#origo');

    // Revalida a página do produto específico
    if (slug) {
      revalidatePath(`/produto/${slug}`);
    }

    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Cache Vercel revalidado com sucesso.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err.message },
      { status: 500 }
    );
  }
}