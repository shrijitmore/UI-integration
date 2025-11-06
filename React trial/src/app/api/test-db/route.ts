import { NextResponse } from 'next/server';
import * as actions from '@/lib/actions-dynamic';

export async function GET() {
  try {
    const factories = await actions.getFactories();
    
    if (factories.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No factories found in database' 
      });
    }
    
    const factoryId = parseInt(factories[0].value);
    const sections = await actions.getFactorySections(factoryId);
    const pos = await actions.getPurchaseOrders(factoryId);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        factories: factories.map(f => f.label),
        totalSections: sections.length,
        sampleSections: sections.slice(0, 3).map(s => s.label),
        totalPOs: pos.length,
        samplePOs: pos.slice(0, 3).map(p => p.label),
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}
