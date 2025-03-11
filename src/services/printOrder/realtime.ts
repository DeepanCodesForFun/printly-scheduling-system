
import { supabase } from "@/integrations/supabase/client";
import { PrintOrder } from "./types";
import { getPrintOrders } from "./getOrders";

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
