import { query } from './db';
import type { Option } from './types';
import { parseISO, isAfter, subDays, format } from 'date-fns';

// ==================== FACTORY QUERIES ====================

export async function getFactories(): Promise<Option[]> {
  try {
    const rows = await query<{ id: number; plant_name: string }>(
      `SELECT id, plant_name FROM master_plantmaster WHERE is_active = true ORDER BY plant_name`
    );
    return rows.map(row => ({
      label: row.plant_name || `Plant ${row.id}`,
      value: row.id.toString()
    }));
  } catch (error) {
    console.error('Error fetching factories:', error);
    return [];
  }
}

export async function getFactorySections(factoryId: number): Promise<Option[]> {
  try {
    const rows = await query<{ id: number; building_name: string; building_id: string }>(
      `SELECT id, building_name, building_id 
       FROM master_buildingsectionlab 
       WHERE plant_id = $1 AND is_active = true 
       ORDER BY building_name`,
      [factoryId]
    );
    return rows.map(row => ({
      label: row.building_name || row.building_id,
      value: row.building_id
    }));
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

// ==================== ITEM QUERIES ====================

export async function getItems(factoryId: number, sectionId: string): Promise<Option[]> {
  try {
    // Get building ID first
    const buildingRows = await query<{ id: number }>(
      `SELECT id FROM master_buildingsectionlab WHERE building_id = $1 AND plant_id = $2 AND is_active = true`,
      [sectionId, factoryId]
    );
    
    if (buildingRows.length === 0) {
      return [];
    }
    
    const buildingDbId = buildingRows[0].id;
    
    const rows = await query<{ item_code: string; item_description: string }>(
      `SELECT DISTINCT item_code, item_description 
       FROM master_itemmaster 
       WHERE plant_id = $1 AND building_id = $2 AND is_active = true 
       ORDER BY item_code`,
      [factoryId, buildingDbId]
    );
    
    return rows.map(row => ({
      label: row.item_code,
      value: row.item_code
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

// ==================== OPERATION QUERIES ====================

export async function getOperations(factoryId: number, itemCode: string, sectionId: string): Promise<Option[]> {
  try {
    // Get building ID
    const buildingRows = await query<{ id: number }>(
      `SELECT id FROM master_buildingsectionlab WHERE building_id = $1 AND plant_id = $2 AND is_active = true`,
      [sectionId, factoryId]
    );
    
    if (buildingRows.length === 0) {
      return [];
    }
    
    const buildingDbId = buildingRows[0].id;
    
    // Get item ID
    const itemRows = await query<{ id: number }>(
      `SELECT id FROM master_itemmaster WHERE item_code = $1 AND plant_id = $2 AND is_active = true`,
      [itemCode, factoryId]
    );
    
    if (itemRows.length === 0) {
      return [];
    }
    
    const itemDbId = itemRows[0].id;
    
    const rows = await query<{ operation_id: string; operation_name: string }>(
      `SELECT DISTINCT operation_id, operation_name 
       FROM master_operationmaster 
       WHERE plant_id = $1 AND building_id = $2 AND item_code_id = $3 AND is_active = true 
       ORDER BY operation_id`,
      [factoryId, buildingDbId, itemDbId]
    );
    
    return rows.map(row => ({
      label: row.operation_name || row.operation_id,
      value: row.operation_id
    }));
  } catch (error) {
    console.error('Error fetching operations:', error);
    return [];
  }
}

// ==================== PARAMETER QUERIES ====================

export async function getParameters(factoryId: number, itemCode: string, operationId: string): Promise<Option[]> {
  try {
    // Get parameters from inspection schedules based on item and operation
    const rows = await query<{ inspection_parameter_name: string }>(
      `SELECT DISTINCT isc.inspection_parameter_name
       FROM master_inspectionschedule isc
       INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
       INNER JOIN master_operationmaster om ON isc.operation_id = om.id
       WHERE im.item_code = $1 
       AND om.operation_id = $2 
       AND im.plant_id = $3
       AND isc.is_active = true
       ORDER BY isc.inspection_parameter_name`,
      [itemCode, operationId, factoryId]
    );
    
    return rows.map(row => ({
      label: row.inspection_parameter_name,
      value: row.inspection_parameter_name
    }));
  } catch (error) {
    console.error('Error fetching parameters:', error);
    return [];
  }
}

// ==================== PURCHASE ORDER QUERIES ====================

export async function getPurchaseOrders(factoryId: number, itemCode?: string): Promise<Option[]> {
  try {
    let queryText = '';
    let params: any[] = [];
    
    if (itemCode) {
      // Get production orders for specific item
      queryText = `
        SELECT DISTINCT pp.order_number 
        FROM master_productionplanner pp
        INNER JOIN master_itemmaster im ON pp.item_code_id = im.id
        WHERE im.item_code = $1 AND pp.is_active = true
        ORDER BY pp.order_number
      `;
      params = [itemCode];
    } else {
      // Get all production orders (fallback)
      queryText = `
        SELECT DISTINCT order_number 
        FROM master_productionplanner 
        WHERE is_active = true
        ORDER BY order_number
      `;
    }
    
    const rows = await query<{ order_number: string }>(queryText, params);
    
    return rows.map(row => ({
      label: row.order_number,
      value: row.order_number
    }));
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
}

export async function getPurchaseOrderStatus(poId: string) {
  try {
    // Get PO details from master_productionplanner
    const poRows = await query<{
      order_number: string;
      lot_number: string;
      lot_qty: number;
      item_desc: string;
      status: string;
      start_date: Date;
      target_date: Date;
    }>(
      `SELECT order_number, lot_number, lot_qty, item_desc, status, start_date, target_date
       FROM master_productionplanner 
       WHERE order_number = $1 AND is_active = true`,
      [poId]
    );

    if (poRows.length === 0) {
      return null;
    }

    const po = poRows[0];

    // Get inspection summary - count readings from in-process inspections
    const inspectionRows = await query<{ total_inspections: number }>(
      `SELECT COUNT(DISTINCT ir.id) as total_inspections
       FROM master_inprocessinspectionreading ir
       WHERE ir.po_no = $1 AND ir.is_active = true`,
      [poId]
    );

    const totalInspections = inspectionRows[0]?.total_inspections || 0;

    return {
      'PO Number': po.order_number,
      'Lot Number': po.lot_number || 'N/A',
      'Item': po.item_desc,
      'Lot Quantity': po.lot_qty?.toString() || 'N/A',
      'Status': po.status,
      'Start Date': po.start_date ? new Date(po.start_date).toLocaleDateString() : 'N/A',
      'Target Date': po.target_date ? new Date(po.target_date).toLocaleDateString() : 'N/A',
      'Total Inspections': totalInspections.toString(),
    };
  } catch (error) {
    console.error('Error fetching PO status:', error);
    return null;
  }
}

// ==================== INSPECTION QUERIES ====================

export async function getFilteredInspections(filters: {
  factoryId: number;
  section: string;
  itemCode: string;
  type: 'Inward' | 'In-process' | 'Final';
  poId: string;
}) {
  try {
    const { factoryId, section, itemCode, type, poId } = filters;

    let inspectionData: any[] = [];

    if (type === 'In-process') {
      // Query in-process inspections
      const rows = await query<{
        id: number;
        po_no: string;
        created_at: Date;
        remarks: string;
        machine_id: string;
        insp_schedule_id_id: number;
      }>(
        `SELECT ir.id, ir.po_no, ir.created_at, ir.remarks, ir.machine_id, ir.insp_schedule_id_id
         FROM master_inprocessinspectionreading ir
         INNER JOIN master_inspectionschedule isc ON ir.insp_schedule_id_id = isc.id
         INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
         INNER JOIN master_buildingsectionlab bsl ON isc.building_id = bsl.id
         WHERE im.item_code = $1 
         AND bsl.building_id = $2
         AND im.plant_id = $3
         AND ir.po_no = $4
         AND ir.is_active = true
         ORDER BY ir.created_at DESC`,
        [itemCode, section, factoryId, poId]
      );

      // For each inspection reading, get actual readings and schedule details
      for (const row of rows) {
        const actualReadings = await query<{
          r_value: number;
          r_key: string;
        }>(
          `SELECT r_value, r_key FROM master_inprocessactualreading 
           WHERE reading_id_id = $1 AND is_active = true`,
          [row.id]
        );

        const scheduleInfo = await query<{
          inspection_parameter_name: string;
          operation_id: number;
        }>(
          `SELECT inspection_parameter_name, operation_id FROM master_inspectionschedule WHERE id = $1`,
          [row.insp_schedule_id_id]
        );

        const operationName = scheduleInfo[0] ? await query<{ operation_name: string }>(
          `SELECT operation_name FROM master_operationmaster WHERE id = $1`,
          [scheduleInfo[0].operation_id]
        ) : [];

        inspectionData.push({
          id: row.id.toString(),
          poId: row.po_no,
          factoryId,
          section,
          itemCode,
          type: 'In-process',
          operationName: operationName[0]?.operation_name || 'N/A',
          parameters: actualReadings.map((ar, idx) => ({
            name: scheduleInfo[0]?.inspection_parameter_name || 'Parameter',
            value: ar.r_value,
            unit: '',
            operator: 'System',
            timestamp: row.created_at.toISOString(),
          })),
        });
      }
    } else if (type === 'Inward') {
      // Query inward (RM) inspections
      const rows = await query<{
        id: number;
        io_no: string;
        created_at: Date;
        remarks: string;
        machine_id: string;
        insp_schedule_id_id: number;
      }>(
        `SELECT ir.id, ir.io_no, ir.created_at, ir.remarks, ir.machine_id, ir.insp_schedule_id_id
         FROM master_rminspectionreading ir
         INNER JOIN master_inspectionschedule isc ON ir.insp_schedule_id_id = isc.id
         INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
         INNER JOIN master_buildingsectionlab bsl ON isc.building_id = bsl.id
         WHERE im.item_code = $1 
         AND bsl.building_id = $2
         AND im.plant_id = $3
         AND ir.is_active = true
         ORDER BY ir.created_at DESC
         LIMIT 50`,
        [itemCode, section, factoryId]
      );

      for (const row of rows) {
        const actualReadings = await query<{
          r_value: number;
          r_key: string;
        }>(
          `SELECT r_value, r_key FROM master_rmactualreading 
           WHERE reading_id_id = $1 AND is_active = true`,
          [row.id]
        );

        const scheduleInfo = await query<{
          inspection_parameter_name: string;
          operation_id: number;
        }>(
          `SELECT inspection_parameter_name, operation_id FROM master_inspectionschedule WHERE id = $1`,
          [row.insp_schedule_id_id]
        );

        inspectionData.push({
          id: row.id.toString(),
          poId: row.io_no || poId,
          factoryId,
          section,
          itemCode,
          type: 'Inward',
          operationName: 'Raw Material Inspection',
          parameters: actualReadings.map(ar => ({
            name: scheduleInfo[0]?.inspection_parameter_name || 'Parameter',
            value: ar.r_value,
            unit: '',
            operator: 'System',
            timestamp: row.created_at.toISOString(),
          })),
        });
      }
    } else if (type === 'Final') {
      // Query FAI (Final) inspections
      const rows = await query<{
        id: number;
        po_no: string;
        created_at: Date;
        remarks: string;
        machine_id: string;
        insp_schedule_id_id: number;
      }>(
        `SELECT fr.id, fr.po_no, fr.created_at, fr.remarks, fr.machine_id, fr.insp_schedule_id_id
         FROM master_faiinspectionreading fr
         INNER JOIN master_faiinspectionschedule fis ON fr.insp_schedule_id_id = fis.id
         INNER JOIN master_faiitemmaster fim ON fis.item_code_id = fim.id
         INNER JOIN master_buildingsectionlab bsl ON fis.building_id = bsl.id
         WHERE fim.item_code = $1 
         AND bsl.building_id = $2
         AND fim.plant_id = $3
         AND fr.po_no = $4
         AND fr.is_active = true
         ORDER BY fr.created_at DESC`,
        [itemCode, section, factoryId, poId]
      );

      for (const row of rows) {
        const actualReadings = await query<{
          r_value: number;
          r_key: string;
        }>(
          `SELECT r_value, r_key FROM master_faiactualreading 
           WHERE reading_id_id = $1 AND is_active = true`,
          [row.id]
        );

        const scheduleInfo = await query<{
          inspection_parameter_name: string;
          operation_id: number;
        }>(
          `SELECT inspection_parameter_name, operation_id FROM master_faiinspectionschedule WHERE id = $1`,
          [row.insp_schedule_id_id]
        );

        const operationName = scheduleInfo[0] && scheduleInfo[0].operation_id ? await query<{ operation_name: string }>(
          `SELECT operation_name FROM master_faioperationmaster WHERE id = $1`,
          [scheduleInfo[0].operation_id]
        ) : [];

        inspectionData.push({
          id: row.id.toString(),
          poId: row.po_no,
          factoryId,
          section,
          itemCode,
          type: 'Final',
          operationName: operationName[0]?.operation_name || 'Final Assembly Inspection',
          parameters: actualReadings.map(ar => ({
            name: scheduleInfo[0]?.inspection_parameter_name || 'Parameter',
            value: ar.r_value,
            unit: '',
            operator: 'System',
            timestamp: row.created_at.toISOString(),
          })),
        });
      }
    }

    return inspectionData;
  } catch (error) {
    console.error('Error fetching filtered inspections:', error);
    return [];
  }
}

// ==================== PARAMETER ANALYSIS QUERIES ====================

export async function getParameterSeriesAndStats(
  factoryId: number,
  itemCode: string,
  operation: string,
  parameter: string,
  days?: number
) {
  try {
    const cutoff = days ? subDays(new Date(), days) : null;

    // Get readings from in-process inspections
    const readings = await query<{
      r_value: number;
      created_at: Date;
      created_by_id: number;
    }>(
      `SELECT iar.r_value, ir.created_at, ir.created_by_id
       FROM master_inprocessactualreading iar
       INNER JOIN master_inprocessinspectionreading ir ON iar.reading_id_id = ir.id
       INNER JOIN master_inspectionschedule isc ON ir.insp_schedule_id_id = isc.id
       INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
       INNER JOIN master_operationmaster om ON isc.operation_id = om.id
       WHERE im.item_code = $1
       AND om.operation_id = $2
       AND isc.inspection_parameter_name = $3
       AND im.plant_id = $4
       ${cutoff ? `AND ir.created_at >= $5` : ''}
       AND iar.is_active = true
       ORDER BY ir.created_at ASC`,
      cutoff ? [itemCode, operation, parameter, factoryId, cutoff] : [itemCode, operation, parameter, factoryId]
    );

    // Get spec limits from schedule
    const specRows = await query<{
      lsl: number;
      usl: number;
      target_value: number;
    }>(
      `SELECT isc."LSL" as lsl, isc."USL" as usl, isc.target_value
       FROM master_inspectionschedule isc
       INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
       INNER JOIN master_operationmaster om ON isc.operation_id = om.id
       WHERE im.item_code = $1
       AND om.operation_id = $2
       AND isc.inspection_parameter_name = $3
       AND im.plant_id = $4
       AND isc.is_active = true
       LIMIT 1`,
      [itemCode, operation, parameter, factoryId]
    );

    const spec = specRows[0] || {};

    if (readings.length === 0) {
      // Return empty data with spec if available
      return {
        series: [],
        stats: {
          min: '0',
          max: '0',
          avg: '0',
          count: 0,
          unit: '',
        },
        spec: {
          lsl: spec.lsl,
          usl: spec.usl,
          target: spec.target_value,
          unit: '',
        },
        readings: [],
        oos: [],
      };
    }

    const values = readings.map(r => r.r_value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;

    const enriched = readings.map(r => {
      const isOOS = (spec.lsl !== undefined && r.r_value < spec.lsl) || (spec.usl !== undefined && r.r_value > spec.usl);
      return {
        timestamp: r.created_at.toISOString(),
        value: r.r_value,
        unit: '',
        operator: 'Operator',
        status: isOOS ? 'OOS' : 'OK' as const,
      };
    });

    const series = readings.map(r => ({
      label: format(new Date(r.created_at), 'dd MMM'),
      value: r.r_value,
    }));

    return {
      series,
      stats: {
        min: `${min.toFixed(3)}`,
        max: `${max.toFixed(3)}`,
        avg: `${avg.toFixed(3)}`,
        count: readings.length,
        unit: '',
      },
      spec: {
        lsl: spec.lsl,
        usl: spec.usl,
        target: spec.target_value,
        unit: '',
      },
      readings: enriched,
      oos: enriched.filter(e => e.status === 'OOS'),
    };
  } catch (error) {
    console.error('Error fetching parameter series:', error);
    return {
      series: [],
      stats: { min: '0', max: '0', avg: '0', count: 0, unit: '' },
      spec: {},
      readings: [],
      oos: [],
    };
  }
}

export async function getLSLUSLDistribution(
  factoryId: number,
  itemCode: string,
  operation: string,
  parameter: string,
  days?: number
) {
  const analysis = await getParameterSeriesAndStats(factoryId, itemCode, operation, parameter, days);
  
  let lsl = analysis.spec.lsl;
  let usl = analysis.spec.usl;
  
  if (lsl === undefined || usl === undefined || usl === lsl) {
    const vals = analysis.readings.map(r => r.value);
    if (vals.length > 0) {
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      if (min !== max) {
        lsl = min;
        usl = max;
      } else {
        lsl = min;
        usl = min + 1;
      }
    } else {
      lsl = 0;
      usl = 1;
    }
  }

  const labels = ['<LSL', '0-20%', '20-40%', '40-60%', '60-80%', '80-100%', '>USL'] as const;
  const counts: Record<(typeof labels)[number], number> = {
    '<LSL': 0,
    '0-20%': 0,
    '20-40%': 0,
    '40-60%': 0,
    '60-80%': 0,
    '80-100%': 0,
    '>USL': 0,
  };

  const span = usl! - lsl!;
  analysis.readings.forEach(r => {
    if (lsl !== undefined && r.value < lsl) {
      counts['<LSL'] += 1;
      return;
    }
    if (usl !== undefined && r.value > usl) {
      counts['>USL'] += 1;
      return;
    }
    if (lsl === undefined || usl === undefined || span <= 0) {
      return;
    }
    const ratio = (r.value - lsl) / span;
    const idx = Math.min(4, Math.max(0, Math.floor(ratio * 5)));
    const bucket = labels[idx + 1];
    counts[bucket] += 1;
  });

  const data = labels.map(lab => ({ value: lab, count: counts[lab] }));

  return {
    data,
    xAxisLabel: 'LSL / USL',
    yAxisLabel: 'No. of counts',
  };
}

export async function getParameterDistribution(
  context: 'Inward' | 'In-process' | 'Final',
  factoryId: number,
  section: string,
  itemCode: string
) {
  try {
    let operations: string[] = [];
    let parameters: string[] = [];

    if (context === 'In-process') {
      const rows = await query<{
        operation_name: string;
        inspection_parameter_name: string;
      }>(
        `SELECT DISTINCT om.operation_name, isc.inspection_parameter_name
         FROM master_inprocessinspectionreading ir
         INNER JOIN master_inspectionschedule isc ON ir.insp_schedule_id_id = isc.id
         INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
         INNER JOIN master_buildingsectionlab bsl ON isc.building_id = bsl.id
         INNER JOIN master_operationmaster om ON isc.operation_id = om.id
         WHERE im.item_code = $1
         AND bsl.building_id = $2
         AND im.plant_id = $3
         AND ir.is_active = true`,
        [itemCode, section, factoryId]
      );

      operations = [...new Set(rows.map(r => r.operation_name).filter(Boolean))];
      parameters = [...new Set(rows.map(r => r.inspection_parameter_name).filter(Boolean))];
    } else if (context === 'Inward') {
      const rows = await query<{
        inspection_parameter_name: string;
      }>(
        `SELECT DISTINCT isc.inspection_parameter_name
         FROM master_rminspectionreading ir
         INNER JOIN master_inspectionschedule isc ON ir.insp_schedule_id_id = isc.id
         INNER JOIN master_itemmaster im ON isc.item_code_id = im.id
         INNER JOIN master_buildingsectionlab bsl ON isc.building_id = bsl.id
         WHERE im.item_code = $1
         AND bsl.building_id = $2
         AND im.plant_id = $3
         AND ir.is_active = true`,
        [itemCode, section, factoryId]
      );

      operations = ['Raw Material Inspection'];
      parameters = [...new Set(rows.map(r => r.inspection_parameter_name).filter(Boolean))];
    } else if (context === 'Final') {
      const rows = await query<{
        operation_name: string;
        inspection_parameter_name: string;
      }>(
        `SELECT DISTINCT fom.operation_name, fis.inspection_parameter_name
         FROM master_faiinspectionreading fr
         INNER JOIN master_faiinspectionschedule fis ON fr.insp_schedule_id_id = fis.id
         INNER JOIN master_faiitemmaster fim ON fis.item_code_id = fim.id
         INNER JOIN master_buildingsectionlab bsl ON fis.building_id = bsl.id
         LEFT JOIN master_faioperationmaster fom ON fis.operation_id = fom.id
         WHERE fim.item_code = $1
         AND bsl.building_id = $2
         AND fim.plant_id = $3
         AND fr.is_active = true`,
        [itemCode, section, factoryId]
      );

      operations = [...new Set(rows.map(r => r.operation_name).filter(Boolean))];
      parameters = [...new Set(rows.map(r => r.inspection_parameter_name).filter(Boolean))];
    }

    if (operations.length === 0 && parameters.length === 0) {
      return null;
    }

    return {
      'Operations': operations.join(', ') || 'N/A',
      'Parameters': parameters.join(', ') || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching parameter distribution:', error);
    return null;
  }
}
