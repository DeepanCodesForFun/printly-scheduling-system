
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
      
      // Get file groups (merged files)
      const { data: fileGroupsData } = await supabase
        .from('print_file_groups')
        .select('*')
        .eq('order_id', order.id);
      
      const fileGroups = fileGroupsData?.map(group => ({
        groupKey: group.config_group,
        config: {
          color: group.config_color,
          sides: group.config_sides,
          copies: String(group.config_copies)
        },
        fileCount: filesData?.filter(f => f.config_group === group.config_group).length || 0,
        mergedFilePath: group.merged_file_path
      })) || [];
      
      return {
        id: order.id,
        studentName: order.student_name,
        studentId: order.student_id,
        timestamp: order.timestamp,
        status: order.status,
        isActive: order.is_active,
        fileCount: filesData?.length || 0,
        amount: order.amount,
        additionalDetails: order.additional_details || '',
        files: filesData?.map(file => ({
          name: file.file_name,
          type: file.file_type.split('/').pop(),
          size: file.file_size,
          config: {
            color: file.config_color || configData?.color || 'bw',
            sides: file.config_sides || configData?.sides || 'single',
            copies: file.config_copies ? String(file.config_copies) : String(configData?.copies || 1)
          },
          configGroup: file.config_group
        })) || [],
        config: {
          color: configData?.color || 'Black & White',
          sides: configData?.sides || 'Single-sided',
          copies: configData?.copies ? String(configData.copies) : '1' // Convert number to string
        },
        fileGroups
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
  
  // Get file groups (merged files)
  const { data: fileGroupsData } = await supabase
    .from('print_file_groups')
    .select('*')
    .eq('order_id', order.id);
  
  const fileGroups = fileGroupsData?.map(group => ({
    groupKey: group.config_group,
    config: {
      color: group.config_color,
      sides: group.config_sides,
      copies: String(group.config_copies)
    },
    fileCount: filesData?.filter(f => f.config_group === group.config_group).length || 0,
    mergedFilePath: group.merged_file_path
  })) || [];
  
  const fileDetails = filesData?.map(file => ({
    name: file.file_name,
    type: file.file_type.split('/').pop(),
    size: file.file_size,
    path: file.storage_path,
    config: {
      color: file.config_color || configData?.color || 'bw',
      sides: file.config_sides || configData?.sides || 'single',
      copies: file.config_copies ? String(file.config_copies) : String(configData?.copies || 1)
    },
    configGroup: file.config_group
  })) || [];
  
  return {
    id: order.id,
    studentName: order.student_name,
    studentId: order.student_id,
    timestamp: order.timestamp,
    status: order.status,
    isActive: order.is_active,
    fileCount: fileDetails.length,
    amount: order.amount,
    additionalDetails: order.additional_details || '',
    files: fileDetails,
    config: {
      color: configData?.color || 'Black & White',
      sides: configData?.sides || 'Single-sided',
      copies: configData?.copies ? String(configData.copies) : '1' // Convert number to string
    },
    fileGroups
  };
};
