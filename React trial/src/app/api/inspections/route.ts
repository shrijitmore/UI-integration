import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const section = searchParams.get('section');
    const itemCode = searchParams.get('itemCode');
    const type = searchParams.get('type') as 'Inward' | 'In-process' | 'Final';
    const poId = searchParams.get('poId');
    
    if (!factoryId || !section || !itemCode || !type || !poId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const inspections = await actions.getFilteredInspections({
      factoryId: parseInt(factoryId),
      section,
      itemCode,
      type,
      poId
    });
    
    return NextResponse.json({ success: true, data: inspections });
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
