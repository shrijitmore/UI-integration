// Client-side API wrappers for database queries
import type { Option } from './types';

async function fetchAPI(endpoint: string, params?: Record<string, string>) {
  // Build URL with query parameters
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${endpoint}?${searchParams.toString()}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const json = await response.json();
  
  if (!json.success) {
    throw new Error(json.error || 'API request failed');
  }
  
  return json.data;
}

export async function getFactories(): Promise<Option[]> {
  return fetchAPI('/api/factories');
}

export async function getFactorySections(factoryId: number): Promise<Option[]> {
  return fetchAPI('/api/sections', { factoryId: factoryId.toString() });
}

export async function getItems(factoryId: number, sectionId: string): Promise<Option[]> {
  return fetchAPI('/api/items', { 
    factoryId: factoryId.toString(), 
    sectionId 
  });
}

export async function getOperations(factoryId: number, itemCode: string, sectionId: string): Promise<Option[]> {
  return fetchAPI('/api/operations', { 
    factoryId: factoryId.toString(), 
    itemCode, 
    sectionId 
  });
}

export async function getParameters(factoryId: number, itemCode: string, operationId: string): Promise<Option[]> {
  return fetchAPI('/api/parameters', { 
    factoryId: factoryId.toString(), 
    itemCode, 
    operationId 
  });
}

export async function getPurchaseOrders(factoryId: number, itemCode?: string): Promise<Option[]> {
  const params: Record<string, string> = { factoryId: factoryId.toString() };
  if (itemCode) params.itemCode = itemCode;
  return fetchAPI('/api/purchase-orders', params);
}

export async function getPurchaseOrderStatus(poId: string) {
  return fetchAPI('/api/po-status', { poId });
}

export async function getFilteredInspections(filters: {
  factoryId: number;
  section: string;
  itemCode: string;
  type: 'Inward' | 'In-process' | 'Final';
  poId: string;
}) {
  return fetchAPI('/api/inspections', {
    factoryId: filters.factoryId.toString(),
    section: filters.section,
    itemCode: filters.itemCode,
    type: filters.type,
    poId: filters.poId
  });
}

export async function getParameterSeriesAndStats(
  factoryId: number,
  itemCode: string,
  operation: string,
  parameter: string,
  days?: number
) {
  const params: Record<string, string> = {
    factoryId: factoryId.toString(),
    itemCode,
    operation,
    parameter
  };
  if (days) params.days = days.toString();
  return fetchAPI('/api/parameter-analysis', params);
}

export async function getLSLUSLDistribution(
  factoryId: number,
  itemCode: string,
  operation: string,
  parameter: string,
  days?: number
) {
  const params: Record<string, string> = {
    factoryId: factoryId.toString(),
    itemCode,
    operation,
    parameter
  };
  if (days) params.days = days.toString();
  return fetchAPI('/api/lsl-usl-distribution', params);
}

export async function getParameterDistribution(
  context: 'Inward' | 'In-process' | 'Final',
  factoryId: number,
  section: string,
  itemCode: string
) {
  return fetchAPI('/api/parameter-distribution', {
    context,
    factoryId: factoryId.toString(),
    section,
    itemCode
  });
}
