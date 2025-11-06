import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const itemCode = searchParams.get('itemCode');
    const operation = searchParams.get('operation');
    const parameter = searchParams.get('parameter');
    const days = searchParams.get('days');
    
    if (!factoryId || !itemCode || !operation || !parameter) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const distribution = await actions.getLSLUSLDistribution(
      parseInt(factoryId),
      itemCode,
      operation,
      parameter,
      days ? parseInt(days) : undefined
    );
    
    return NextResponse.json({ success: true, data: distribution });
  } catch (error: any) {
    console.error('Error fetching LSL/USL distribution:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
