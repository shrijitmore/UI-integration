import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poId = searchParams.get('poId');
    
    if (!poId) {
      return NextResponse.json(
        { success: false, error: 'poId required' },
        { status: 400 }
      );
    }
    
    const actions = await import('@/lib/actions-dynamic');
    const status = await actions.getPurchaseOrderStatus(poId);
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    console.error('Error fetching PO status:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
