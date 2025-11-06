import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const itemCode = searchParams.get('itemCode');
    const operationId = searchParams.get('operationId');
    
    if (!factoryId || !itemCode || !operationId) {
      return NextResponse.json(
        { success: false, error: 'factoryId, itemCode, and operationId required' },
        { status: 400 }
      );
    }
    
    const parameters = await actions.getParameters(parseInt(factoryId), itemCode, operationId);
    return NextResponse.json({ success: true, data: parameters });
  } catch (error: any) {
    console.error('Error fetching parameters:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
