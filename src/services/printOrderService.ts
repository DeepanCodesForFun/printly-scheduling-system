
import { supabase } from "@/integrations/supabase/client";
import { uploadPdfFiles } from "@/utils/pdfUtils";

export interface PrintOrder {
  id: string;
  studentName: string;
  studentId: string;
  timestamp: string;
  status: string;
  isActive: boolean;
  fileCount: number;
  amount: number;
  files: {
    name: string;
    type: string;
    size: number;
  }[];
  config: {
    color: string;
    sides: string;
    copies: string;
  };
}

interface CreateOrderParams {
  studentName: string;
  studentId: string;
  files: File[];
  config: {
    color: string;
    sides: string;
    copies: string;
  };
  amount: number;
}

/**
 * Create a new print order in the database
 */
export const createPrintOrder = async (params: CreateOrderParams): Promise<string> => {
  const { studentName, studentId, files, config, amount } = params;
  
  // Insert order into database
  const { data: orderData, error: orderError } = await supabase
    .from('print_orders')
    .insert({
      student_name: studentName,
      student_id: studentId,
      amount: amount,
      is_active: false
    })
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create print order');
  }
  
  const orderId = orderData.id;
  
  // Insert configuration
  const { error: configError } = await supabase
    .from('print_configs')
    .insert({
      order_id: orderId,
      color: config.color === 'bw' ? 'Black & White' : 'Color',
      sides: config.sides === 'single' ? 'Single-sided' : 'Double-sided',
      copies: parseInt(config.copies)
    });
  
  if (configError) {
    console.error('Error creating config:', configError);
    throw new Error('Failed to save print configuration');
  }
  
  // Upload files to storage
  try {
    const uploadedFiles = await uploadPdfFiles(files, orderId);
    
    // Insert file records
    const fileInserts = uploadedFiles.map(({ filePath, fileInfo }) => ({
      order_id: orderId,
      file_name: fileInfo.name,
      file_size: fileInfo.size,
      file_type: fileInfo.type,
      page_count: fileInfo.pageCount,
      storage_path: filePath
    }));
    
    const { error: filesError } = await supabase
      .from('print_files')
      .insert(fileInserts);
    
    if (filesError) {
      console.error('Error creating file records:', filesError);
      throw new Error('Failed to save file information');
    }
    
    return orderId;
  } catch (error) {
    console.error('Error processing files:', error);
    throw new Error('Failed to process files');
  }
};

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
          copies: configData?.copies.toString() || '1'
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
      copies: configData?.copies.toString() || '1'
    }
  };
};

/**
 * Set the first order in the queue as active
 */
export const activateNextOrder = async (): Promise<void> => {
  // Get the first pending order
  const { data: pendingOrders } = await supabase
    .from('print_orders')
    .select('id')
    .eq('status', 'pending')
    .order('timestamp', { ascending: true })
    .limit(1);
  
  if (pendingOrders && pendingOrders.length > 0) {
    const orderId = pendingOrders[0].id;
    
    // Update the order to active
    const { error } = await supabase
      .from('print_orders')
      .update({ is_active: true })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error activating order:', error);
      throw new Error('Failed to activate next order');
    }
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('print_orders')
    .update({
      status: status,
      is_active: status === 'pending'
    })
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
  
  // If completing an order, activate the next one
  if (status === 'completed') {
    await activateNextOrder();
  }
};

/**
 * Delete an order
 */
export const deletePrintOrder = async (orderId: string): Promise<void> => {
  // First check if the order is active
  const { data: order } = await supabase
    .from('print_orders')
    .select('is_active')
    .eq('id', orderId)
    .single();
  
  // Delete the order
  const { error } = await supabase
    .from('print_orders')
    .delete()
    .eq('id', orderId);
  
  if (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
  
  // If the deleted order was active, activate the next one
  if (order && order.is_active) {
    await activateNextOrder();
  }
};

/**
 * Subscribe to order changes
 */
export const subscribeToOrders = (callback: (orders: PrintOrder[]) => void): () => void => {
  const subscription = supabase
    .channel('print_orders_channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'print_orders'
    }, () => {
      // Fetch updated data when changes occur
      getPrintOrders().then(callback);
    })
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};
