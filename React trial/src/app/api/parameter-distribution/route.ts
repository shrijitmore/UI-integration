import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get('context') as 'Inward' | 'In-process' | 'Final';
    const factoryId = searchParams.get('factoryId');
    const section = searchParams.get('section');
    const itemCode = searchParams.get('itemCode');
    
    if (!context || !factoryId || !section || !itemCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const distribution = await actions.getParameterDistribution(
      context,
      parseInt(factoryId),
      section,
      itemCode
    );
    
    return NextResponse.json({ success: true, data: distribution });
  } catch (error: any) {
    console.error('Error fetching parameter distribution:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
