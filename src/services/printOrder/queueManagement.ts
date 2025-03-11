
import { supabase } from "@/integrations/supabase/client";

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
