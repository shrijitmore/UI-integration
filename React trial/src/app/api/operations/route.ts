import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const itemCode = searchParams.get('itemCode');
    const sectionId = searchParams.get('sectionId');
    
    if (!factoryId || !itemCode || !sectionId) {
      return NextResponse.json(
        { success: false, error: 'factoryId, itemCode, and sectionId required' },
        { status: 400 }
      );
    }
    
    const operations = await actions.getOperations(parseInt(factoryId), itemCode, sectionId);
    return NextResponse.json({ success: true, data: operations });
  } catch (error: any) {
    console.error('Error fetching operations:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
