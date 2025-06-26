
import { supabase } from "@/integrations/supabase/client";
import { PrintOrder } from "./types";

/**
 * Get all print orders
 */
export const getPrintOrders = async (): Promise<PrintOrder[]> => {
  const { data: orders, error: ordersError } = await supabase
    .from('print_orders')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw new Error('Failed to fetch print orders');
  }
  
  if (!orders) {
    return [];
  }
  
  // Transform the data to match the expected interface
  const transformedOrders: PrintOrder[] = orders.map(order => {
    const filesData = Array.isArray(order.files) ? order.files : [];
    
    return {
      id: order.id,
      studentName: order.student_name,
      studentId: order.student_id,
      timestamp: order.timestamp,
      status: order.status,
      isActive: order.is_active,
      fileCount: filesData.length,
      amount: order.amount,
      additionalDetails: order.additional_details || '',
      files: filesData.map((file: any) => ({
        name: file.name || '',
        type: file.type?.split('/').pop() || 'pdf',
        size: file.size || 0,
        path: file.storagePath,
        config: {
          color: file.config?.color || order.config_color || 'bw',
          sides: file.config?.sides || order.config_sides || 'single',
          copies: file.config?.copies || String(order.config_copies || 1)
        }
      })),
      config: {
        color: order.config_color === 'bw' ? 'Black & White' : 'Color',
        sides: order.config_sides === 'single' ? 'Single-sided' : 'Double-sided',
        copies: String(order.config_copies || 1)
      },
      fileGroups: [] // Not using file groups in simplified schema
    };
  });
  
  return transformedOrders;
};

/**
 * Get a single print order by ID
 */
export const getPrintOrderById = async (orderId: string): Promise<PrintOrder> => {
  const { data: order, error: orderError } = await supabase
    .from('print_orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error('Error fetching order:', orderError);
    throw new Error('Failed to fetch print order');
  }
  
  if (!order) {
    throw new Error('Print order not found');
  }
  
  const filesData = Array.isArray(order.files) ? order.files : [];
  
  return {
    id: order.id,
    studentName: order.student_name,
    studentId: order.student_id,
    timestamp: order.timestamp,
    status: order.status,
    isActive: order.is_active,
    fileCount: filesData.length,
    amount: order.amount,
    additionalDetails: order.additional_details || '',
    files: filesData.map((file: any) => ({
      name: file.name || '',
      type: file.type?.split('/').pop() || 'pdf',
      size: file.size || 0,
      path: file.storagePath,
      config: {
        color: file.config?.color || order.config_color || 'bw',
        sides: file.config?.sides || order.config_sides || 'single',
        copies: file.config?.copies || String(order.config_copies || 1)
      }
    })),
    config: {
      color: order.config_color === 'bw' ? 'Black & White' : 'Color',
      sides: order.config_sides === 'single' ? 'Single-sided' : 'Double-sided',
      copies: String(order.config_copies || 1)
    },
    fileGroups: []
  };
};
