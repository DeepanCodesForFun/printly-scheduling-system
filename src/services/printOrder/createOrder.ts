
import { supabase } from "@/integrations/supabase/client";
import { uploadPdfFiles } from "@/utils/pdfUtils";
import { CreateOrderParams, FileConfig } from "./types";
import { activateNextOrder } from "./queueManagement";
import { createOrderSchema, validateFiles } from "./validation";

/**
 * Create a new print order in the database
 */
export const createPrintOrder = async (params: CreateOrderParams): Promise<string> => {
  const { studentName, studentId, files, config, amount, additionalDetails, fileConfigs } = params;
  
  try {
    // Validate inputs before doing any I/O
    const parsed = createOrderSchema.safeParse({
      studentName,
      studentId,
      additionalDetails,
      amount,
      config,
    });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }
    const fileError = validateFiles(files);
    if (fileError) {
      throw new Error(fileError);
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be signed in to submit a print order.");
    }

    // Upload files to storage scoped to the user (required by RLS policy)
    const uploadedFiles = await uploadPdfFiles(files, user.id);
    
    // Prepare file data for JSON storage
    const fileData = uploadedFiles.map(({ filePath, fileInfo }, index) => {
      const fileConfig = fileConfigs && fileConfigs[index] ? fileConfigs[index] : {
        color: config.color,
        sides: config.sides,
        copies: config.copies
      };
      
      return {
        name: fileInfo.name,
        size: fileInfo.size,
        type: fileInfo.type,
        pageCount: fileInfo.pageCount,
        storagePath: filePath,
        config: {
          color: fileConfig.color,
          sides: fileConfig.sides,
          copies: fileConfig.copies
        }
      };
    });
    
    // Insert order into database with files as JSON
    const { data: orderData, error: orderError } = await supabase
      .from('print_orders')
      .insert({
        user_id: user.id,
        student_name: studentName,
        student_id: studentId,
        amount: amount,
        is_active: false,
        additional_details: additionalDetails || null,
        config_color: config.color,
        config_sides: config.sides,
        config_copies: parseInt(config.copies),
        files: fileData
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create print order');
    }
    
    if (!orderData) {
      throw new Error('Failed to create print order - no data returned');
    }
    
    // Check if there are any active orders, if not activate this one
    const { data: activeOrders } = await supabase
      .from('print_orders')
      .select('*')
      .eq('is_active', true);
      
    if (!activeOrders || activeOrders.length === 0) {
      await activateNextOrder();
    }
    
    return orderData.id;
  } catch (error) {
    console.error('Error processing files:', error);
    throw error instanceof Error ? error : new Error("Failed to process files");
  }
};
