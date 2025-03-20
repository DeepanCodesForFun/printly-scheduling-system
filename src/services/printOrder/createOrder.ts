import { supabase } from "@/integrations/supabase/client";
import { uploadPdfFiles } from "@/utils/pdfUtils";
import { CreateOrderParams } from "./types";
import { activateNextOrder } from "./queueManagement";

/**
 * Create a new print order in the database
 */
export const createPrintOrder = async (params: CreateOrderParams): Promise<string> => {
  const { studentName, studentId, files, config, amount, additionalDetails } = params;
  
  // Insert order into database
  const { data: orderData, error: orderError } = await supabase
    .from('print_orders')
    .insert({
      student_name: studentName,
      student_id: studentId,
      amount: amount,
      is_active: false,
      additional_details: additionalDetails
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
      copies: parseInt(config.copies) // Convert string to number
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
    
    // After creating a new order, check if there are any active orders
    const { data: activeOrders } = await supabase
      .from('print_orders')
      .select('*')
      .eq('is_active', true);
      
    // If there are no active orders, activate this one
    if (!activeOrders || activeOrders.length === 0) {
      await activateNextOrder();
    }
    
    return orderId;
  } catch (error) {
    console.error('Error processing files:', error);
    throw new Error('Failed to process files');
  }
};
