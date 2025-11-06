import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    
    if (!factoryId) {
      return NextResponse.json(
        { success: false, error: 'factoryId required' },
        { status: 400 }
      );
    }
    
    const actions = await import('@/lib/actions-dynamic');
    const sections = await actions.getFactorySections(parseInt(factoryId));
    return NextResponse.json({ success: true, data: sections });
  } catch (error: any) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
