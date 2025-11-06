import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryId = searchParams.get('factoryId');
    const sectionId = searchParams.get('sectionId');
    
    if (!factoryId || !sectionId) {
      return NextResponse.json(
        { success: false, error: 'factoryId and sectionId required' },
        { status: 400 }
      );
    }
    
    const items = await actions.getItems(parseInt(factoryId), sectionId);
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
