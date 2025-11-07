/**
 * Chatbot API Service
 * This file contains all API calls for the chatbot functionality
 * Using axios to communicate with the backend APIs
 * 
 * Backend Base URL: https://demo-qshakti.c4i4.org/api/
 * 
 * Available APIs from backend:
 * 1. /auth/login/ - Login authentication
 * 2. /auth/profile/ - User profile
 * 3. /master/items/ - Get items list
 * 4. /master/production_planner/list/ - Production planner list
 * 5. /master/po_no_dropdown/ - Get PO numbers dropdown
 * 6. /master/order-details/ - Get order details
 * 7. /master/order-details/:id/operation_details/ - Get operation details
 * 8. /master/io_no_dropdown/ - IO numbers dropdown (RM inspection)
 * 9. /master/fai_po_no_dropdown/ - FAI PO numbers dropdown
 */

import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'https://demo-qshakti.c4i4.org/api';

/**
 * Get authentication token from session storage
 * @returns {string} Authentication token
 */
const getAuthToken = () => {
  return sessionStorage.getItem('token') || '';
};

/**
 * Create axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get list of factories/plants
 * Uses plant_info from login response stored in sessionStorage
 * Backend API: /auth/login/ (plant_info in response)
 * @returns {Promise<Array>} Array of factory options
 */
export const getFactories = async () => {
  try {
    // Get plant_info from sessionStorage (stored during login)
    const plantInfoStr = sessionStorage.getItem('plant_info');
    
    if (plantInfoStr) {
      const plantInfo = JSON.parse(plantInfoStr);
      
      if (plantInfo && plantInfo.plant_id && plantInfo.plant_name) {
    return [
          {
            label: plantInfo.plant_name,
            value: plantInfo.plant_id.toString()
          }
    ];
      }
    }
    
    // Fallback: Return empty array if plant_info not found
    console.warn('Plant info not found in sessionStorage. User may need to login again.');
    return [];
  } catch (error) {
    console.error('Error fetching factories:', error);
    return [];
  }
};

/**
 * Get sections for a specific factory
 * Backend API: Derived from items endpoint which has building_id
 * @param {number} factoryId - Factory ID
 * @returns {Promise<Array>} Array of section options
 */
export const getFactorySections = async (factoryId) => {
  try {
    // Get unique sections from items
    const response = await axiosInstance.get('/master/items/', {
      params: { page: 1, pageSize: 1000 }
    });
    
    if (response.data && response.data.data) {
      // Extract unique building_ids from items
      const uniqueSections = [...new Set(
        response.data.data
          .map(item => item.building_id)
          .filter(Boolean)
      )];
      
      return uniqueSections.map(section => ({
        label: section,
        value: section
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching sections:', error);
    // Return dummy sections if API fails
    return [
      { label: 'B', value: 'B' },
      { label: 'C4', value: 'C4' },
      { label: 'CASE 4', value: 'CASE 4' },
    ];
  }
};

/**
 * Get items for a specific factory and section
 * Backend API: /master/items/
 * @param {number} factoryId - Factory ID
 * @param {string} sectionId - Section/Building ID
 * @returns {Promise<Array>} Array of item options
 */
export const getItems = async (factoryId, sectionId) => {
  try {
    const response = await axiosInstance.get('/master/items/', {
      params: { page: 1, pageSize: 1000 }
    });
    
    if (response.data && response.data.data) {
      // Filter items by section/building_id
      const filteredItems = response.data.data.filter(
        item => item.building_id === sectionId
      );
      
      return filteredItems.map(item => ({
        label: `${item.item_code} - ${item.item_description}`,
        value: item.item_code
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

/**
 * Get purchase orders for a specific factory and optional item code
 * Backend API: /master/po_no_dropdown/
 * @param {number} factoryId - Factory ID
 * @param {string} itemCode - Optional item code filter
 * @returns {Promise<Array>} Array of PO options
 */
export const getPurchaseOrders = async (factoryId, itemCode = null) => {
  try {
    const response = await axiosInstance.get('/master/po_no_dropdown/');
    
    if (response.data && response.data.data) {
      let orders = [];
      
      // Extract orders from all sections
      response.data.data.forEach(sectionData => {
        if (sectionData.orders) {
          orders = orders.concat(sectionData.orders);
        }
      });
      
      // Filter by item code if provided
      if (itemCode) {
        orders = orders.filter(order => order.item_code === itemCode);
      }
      
      return orders.map(order => ({
        label: `${order.order_number} - ${order.lot_number || 'N/A'}`,
        value: order.order_number
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
};

/**
 * Get purchase order status details
 * Backend API: /master/production_planner/list/
 * @param {string} poNumber - Purchase order number
 * @returns {Promise<Object|null>} PO status object
 */
export const getPurchaseOrderStatus = async (poNumber) => {
  try {
    const response = await axiosInstance.get('/master/production_planner/list/', {
      params: { page: 1, page_size: 1000, all: false }
    });
    
    if (response.data && response.data.data) {
      const order = response.data.data.find(
        item => item.order_number === poNumber
      );
      
      if (order) {
        return {
          'Order Number': order.order_number,
          'Lot Number': order.lot_number || 'N/A',
          'Lot Quantity': order.lot_qty,
          'Item Code': order.item_code,
          'Item Description': order.item_desc,
          'Section': order.section,
          'Status': order.status,
          'Start Date': order.start_date || 'Not Started',
          'Target Date': order.target_date,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching PO status:', error);
    return null;
  }
};

/**
 * Get operations for specific item in a section
 * Backend API: /master/order-details/:id/operation_details/
 * @param {number} factoryId - Factory ID
 * @param {string} itemCode - Item code
 * @param {string} sectionId - Section ID
 * @returns {Promise<Array>} Array of operation options
 */
export const getOperations = async (factoryId, itemCode, sectionId) => {
  try {
    // First get the order ID from production planner
    const response = await axiosInstance.get('/master/production_planner/list/', {
      params: { page: 1, page_size: 1000, all: false }
    });
    
    if (response.data && response.data.data) {
      const order = response.data.data.find(
        item => item.item_code === itemCode && item.section === sectionId
      );
      
      if (order && order.id) {
        // Get operation details for this order
        const operationResponse = await axiosInstance.get(
          `/master/order-details/${order.id}/operation_details/`
        );
        
        if (operationResponse.data && operationResponse.data.data) {
          return operationResponse.data.data.map(op => ({
            label: `${op.operation_id} - ${op.operation_name}`,
            value: op.operation_id
          }));
        }
      }
    }
    
    // DUMMY fallback if no operations found
    return [
      { label: '0025 - QUALITY INSPECTION', value: '0025' }
    ];
  } catch (error) {
    console.error('Error fetching operations:', error);
    return [];
  }
};

/**
 * Get inspection parameters for specific operation
 * Backend API: /master/order-details/:id/operation_details/
 * @param {number} factoryId - Factory ID
 * @param {string} itemCode - Item code
 * @param {string} operationId - Operation ID
 * @returns {Promise<Array>} Array of parameter options
 */
export const getParameters = async (factoryId, itemCode, operationId) => {
  try {
    // Get order first
    const response = await axiosInstance.get('/master/production_planner/list/', {
      params: { page: 1, page_size: 1000, all: false }
    });
    
    if (response.data && response.data.data) {
      const order = response.data.data.find(
        item => item.item_code === itemCode
      );
      
      if (order && order.id) {
        const operationResponse = await axiosInstance.get(
          `/master/order-details/${order.id}/operation_details/`
        );
        
        if (operationResponse.data && operationResponse.data.data) {
          const operation = operationResponse.data.data.find(
            op => op.operation_id === operationId
          );
          
          if (operation && operation.inspection_parameter) {
            return Object.values(operation.inspection_parameter).map(param => ({
              label: `${param.inspection_parameter} - ${param.parameter_description}`,
              value: param.inspection_parameter
            }));
          }
        }
      }
    }
    
    // DUMMY fallback
    return [
      { label: 'LENGTH - TOTAL LENGTH', value: 'LENGTH' },
      { label: 'MASS - MASS', value: 'MASS' },
      { label: 'BASEDIA - BASE DIA OF STEEL INSERT', value: 'BASEDIA' }
    ];
  } catch (error) {
    console.error('Error fetching parameters:', error);
    return [];
  }
};

/**
 * Get filtered inspection records
 * DUMMY API - Backend endpoint not available in provided APIs
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of inspection records
 */
export const getFilteredInspections = async (filters) => {
  try {
    // DUMMY DATA - Replace with actual backend endpoint when available
    console.log('Fetching inspections with filters:', filters);
    
    // Return dummy inspection data
    return [
      {
        id: 'INS-001',
        operationName: 'QUALITY INSPECTION',
        parameters: [
          {
            name: 'LENGTH',
            value: 25.5,
            unit: 'mm',
            timestamp: new Date().toISOString(),
            operator: 'Operator A',
            status: 'Accepted'
          },
          {
            name: 'MASS',
            value: 100.2,
            unit: 'g',
            timestamp: new Date().toISOString(),
            operator: 'Operator A',
            status: 'Accepted'
          }
        ]
      }
    ];
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return [];
  }
};

/**
 * Get parameter series data and statistics for analysis
 * DUMMY API - Backend endpoint not available
 * @param {number} factoryId - Factory ID
 * @param {string} itemCode - Item code
 * @param {string} operation - Operation ID
 * @param {string} parameter - Parameter name
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} Parameter analysis data
 */
export const getParameterSeriesAndStats = async (factoryId, itemCode, operation, parameter, days) => {
  try {
    // DUMMY DATA - Replace with actual backend endpoint when available
    console.log('Fetching parameter analysis:', { factoryId, itemCode, operation, parameter, days });
    
    // Generate dummy time series data
    const now = new Date();
    const series = [];
    const readings = [];
    
    for (let i = 10; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const value = 25 + Math.random() * 5; // Random value between 25-30
      
      series.push({
        label: date.toLocaleDateString(),
        value: parseFloat(value.toFixed(2))
      });
      
      readings.push({
        timestamp: date.toISOString(),
        value: parseFloat(value.toFixed(2)),
        operator: 'Operator ' + String.fromCharCode(65 + (i % 3)),
        status: value > 27 ? 'Accepted' : 'Rejected'
      });
    }
    
    const values = series.map(s => s.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      series,
      readings,
      stats: {
        avg: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2),
        count: readings.length,
        unit: 'mm'
      },
      spec: {
        lsl: 24,
        usl: 30,
        target: 27
      },
      oos: readings.filter(r => r.status === 'Rejected')
    };
  } catch (error) {
    console.error('Error fetching parameter analysis:', error);
    return null;
  }
};

/**
 * Get LSL/USL distribution data
 * DUMMY API - Backend endpoint not available
 * @param {number} factoryId - Factory ID
 * @param {string} itemCode - Item code
 * @param {string} operation - Operation ID
 * @param {string} parameter - Parameter name
 * @param {number} days - Number of days
 * @returns {Promise<Object>} Distribution data
 */
export const getLSLUSLDistribution = async (factoryId, itemCode, operation, parameter, days) => {
  try {
    // DUMMY DATA - Replace with actual backend endpoint when available
    console.log('Fetching distribution:', { factoryId, itemCode, operation, parameter, days });
    
    return {
      data: [
        { value: 'Below LSL', count: 5 },
        { value: 'Within Spec', count: 85 },
        { value: 'Above USL', count: 10 }
      ],
      xAxisLabel: 'Category',
      yAxisLabel: 'Count'
    };
  } catch (error) {
    console.error('Error fetching distribution:', error);
    return null;
  }
};

/**
 * Get parameter distribution for a context
 * DUMMY API - Backend endpoint not available
 * @param {string} context - Inspection context (Inward/In-process/Final)
 * @param {number} factoryId - Factory ID
 * @param {string} section - Section ID
 * @param {string} itemCode - Item code
 * @returns {Promise<Object|null>} Distribution data
 */
export const getParameterDistribution = async (context, factoryId, section, itemCode) => {
  try {
    // DUMMY DATA - Replace with actual backend endpoint when available
    console.log('Fetching parameter distribution:', { context, factoryId, section, itemCode });
    
    return {
      'Context': context,
      'Total Parameters': '15',
      'Accepted': '12',
      'Rejected': '3',
      'Acceptance Rate': '80%'
    };
  } catch (error) {
    console.error('Error fetching parameter distribution:', error);
    return null;
  }
};

/**
 * Get IO numbers for RM inspection
 * Backend API: /master/io_no_dropdown/
 * @param {number} factoryId - Factory ID
 * @returns {Promise<Array>} Array of IO number options
 */
export const getIONumbers = async (factoryId) => {
  try {
    const response = await axiosInstance.get('/master/io_no_dropdown/');
    
    if (response.data && response.data.data) {
      let ioNumbers = [];
      
      response.data.data.forEach(sectionData => {
        if (sectionData.io_numbers) {
          ioNumbers = ioNumbers.concat(sectionData.io_numbers);
        }
      });
      
      return ioNumbers.map(io => ({
        label: `${io.io_number} - ${io.item_desc}`,
        value: io.io_number
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching IO numbers:', error);
    return [];
  }
};

/**
 * Get FAI PO numbers
 * Backend API: /master/fai_po_no_dropdown/
 * @param {number} factoryId - Factory ID
 * @returns {Promise<Array>} Array of FAI PO options
 */
export const getFAIPONumbers = async (factoryId) => {
  try {
    const response = await axiosInstance.get('/master/fai_po_no_dropdown/');
    
    if (response.data && response.data.data) {
      let orders = [];
      
      response.data.data.forEach(sectionData => {
        if (sectionData.orders) {
          orders = orders.concat(sectionData.orders);
        }
      });
      
      return orders.map(order => ({
        label: `${order.order_number} - ${order.lot_number || 'N/A'}`,
        value: order.order_number
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching FAI PO numbers:', error);
    return [];
  }
};
