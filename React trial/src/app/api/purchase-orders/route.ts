import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const itemCode = searchParams.get('itemCode');
    
    if (!factoryId) {
      return NextResponse.json(
        { success: false, error: 'factoryId required' },
        { status: 400 }
      );
    }
    
    const actions = await import('@/lib/actions-dynamic');
    const pos = await actions.getPurchaseOrders(parseInt(factoryId), itemCode || undefined);
    return NextResponse.json({ success: true, data: pos });
  } catch (error: any) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
