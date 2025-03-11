import { supabase } from "@/integrations/supabase/client";

/**
 * Reset the queue to ensure only the first item is active
 */
export const resetQueueStatus = async (): Promise<void> => {
  try {
    // First, deactivate all orders
    const { error: deactivateError } = await supabase
      .from('print_orders')
      .update({ is_active: false })
      .eq('status', 'pending');
    
    if (deactivateError) {
      console.error('Error deactivating orders:', deactivateError);
      throw new Error('Failed to deactivate orders');
    }
    
    // Then, activate only the first pending order
    await activateNextOrder();
    
  } catch (error) {
    console.error('Error resetting queue status:', error);
    throw new Error('Failed to reset queue status');
  }
};

// Update the existing activateNextOrder function to first deactivate all orders
export const activateNextOrder = async (): Promise<void> => {
  // First deactivate all orders
  const { error: deactivateError } = await supabase
    .from('print_orders')
    .update({ is_active: false })
    .eq('status', 'pending');
  
  if (deactivateError) {
    console.error('Error deactivating orders:', deactivateError);
    throw new Error('Failed to deactivate orders');
  }
  
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
      .update({ 
        is_active: true,
        status: 'pending' // Ensure status is still pending
      })
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
  // For completed orders, deactivate them
  const isActive = status !== 'completed';
  
  const { error } = await supabase
    .from('print_orders')
    .update({
      status: status,
      is_active: isActive
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
 * Delete an order and its associated configurations and files
 */
export const deletePrintOrder = async (orderId: string): Promise<void> => {
  // First check if the order is active
  const { data: order } = await supabase
    .from('print_orders')
    .select('is_active')
    .eq('id', orderId)
    .single();
  
  // Delete the associated configurations
  const { error: configError } = await supabase
    .from('print_configs')
    .delete()
    .eq('order_id', orderId);
  
  if (configError) {
    console.error('Error deleting order configurations:', configError);
    throw new Error('Failed to delete order configurations');
  }

  // Delete the associated files
  const { error: filesError } = await supabase
    .from('print_files')
    .delete()
    .eq('order_id', orderId);
  
  if (filesError) {
    console.error('Error deleting order files:', filesError);
    throw new Error('Failed to delete order files');
  }

  // Delete the order
  const { error: orderError } = await supabase
    .from('print_orders')
    .delete()
    .eq('id', orderId);
  
  if (orderError) {
    console.error('Error deleting order:', orderError);
    throw new Error('Failed to delete order');
  }
  
  // If the deleted order was active, activate the next one
  if (order && order.is_active) {
    await activateNextOrder();
  }
};