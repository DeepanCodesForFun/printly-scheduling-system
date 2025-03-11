
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
  
  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      // Get config
      const { data: configData } = await supabase
        .from('print_configs')
        .select('*')
        .eq('order_id', order.id)
        .single();
      
      // Get files
      const { data: filesData } = await supabase
        .from('print_files')
        .select('*')
        .eq('order_id', order.id);
      
      return {
        id: order.id,
        studentName: order.student_name,
        studentId: order.student_id,
        timestamp: order.timestamp,
        status: order.status,
        isActive: order.is_active,
        fileCount: filesData?.length || 0,
        amount: parseFloat(order.amount),
        files: filesData?.map(file => ({
          name: file.file_name,
          type: file.file_type.split('/').pop(),
          size: file.file_size
        })) || [],
        config: {
          color: configData?.color || 'Black & White',
          sides: configData?.sides || 'Single-sided',
          copies: configData?.copies ? configData.copies.toString() : '1' // Convert number to string
        }
      };
    })
  );
  
  return ordersWithDetails;
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
  
  // Get config
  const { data: configData } = await supabase
    .from('print_configs')
    .select('*')
    .eq('order_id', order.id)
    .single();
  
  // Get files
  const { data: filesData } = await supabase
    .from('print_files')
    .select('*')
    .eq('order_id', order.id);
  
  const fileDetails = filesData?.map(file => ({
    name: file.file_name,
    type: file.file_type.split('/').pop(),
    size: file.file_size,
    path: file.storage_path
  })) || [];
  
  return {
    id: order.id,
    studentName: order.student_name,
    studentId: order.student_id,
    timestamp: order.timestamp,
    status: order.status,
    isActive: order.is_active,
    fileCount: fileDetails.length,
    amount: parseFloat(order.amount),
    files: fileDetails,
    config: {
      color: configData?.color || 'Black & White',
      sides: configData?.sides || 'Single-sided',
      copies: configData?.copies ? configData.copies.toString() : '1' // Convert number to string
    }
  };
};
