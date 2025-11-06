import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Dynamic import to avoid bundling issues
    const actions = await import('@/lib/actions-dynamic');
    const factories = await actions.getFactories();
    return NextResponse.json({ success: true, data: factories });
  } catch (error: any) {
    console.error('Error fetching factories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
