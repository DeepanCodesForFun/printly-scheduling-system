
import { supabase } from "@/integrations/supabase/client";
import { uploadPdfFiles } from "@/utils/pdfUtils";
import { CreateOrderParams, FileConfig } from "./types";
import { activateNextOrder } from "./queueManagement";
import { createCoverPage, mergePDFs } from "@/utils/pdfMergeUtils";

/**
 * Create a new print order in the database
 */
export const createPrintOrder = async (params: CreateOrderParams): Promise<string> => {
  const { studentName, studentId, files, config, amount, additionalDetails, fileConfigs } = params;
  
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
  
  // Insert global configuration (for backward compatibility)
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
  
  // Upload files to storage and group files by configuration
  try {
    const uploadedFiles = await uploadPdfFiles(files, orderId);
    
    // Group files by configuration for merging
    const configGroups: Record<string, { files: Array<{filePath: string, fileInfo: any}>, config: FileConfig }> = {};
    
    // Insert file records with their configurations
    const fileInserts = uploadedFiles.map(({ filePath, fileInfo }, index) => {
      // Get this file's configuration
      const fileConfig = fileConfigs && fileConfigs[index] ? fileConfigs[index] : {
        color: config.color,
        sides: config.sides,
        copies: config.copies
      };
      
      // Create a config key for grouping
      const configKey = `${fileConfig.color}-${fileConfig.sides}-${fileConfig.copies}`;
      
      // Add to config groups for merging
      if (!configGroups[configKey]) {
        configGroups[configKey] = {
          files: [],
          config: fileConfig
        };
      }
      configGroups[configKey].files.push({ filePath, fileInfo });
      
      return {
        order_id: orderId,
        file_name: fileInfo.name,
        file_size: fileInfo.size,
        file_type: fileInfo.type,
        page_count: fileInfo.pageCount,
        storage_path: filePath,
        config_color: fileConfig.color,
        config_sides: fileConfig.sides,
        config_copies: fileConfig.copies,
        config_group: configKey
      };
    });
    
    const { error: filesError } = await supabase
      .from('print_files')
      .insert(fileInserts);
    
    if (filesError) {
      console.error('Error creating file records:', filesError);
      throw new Error('Failed to save file information');
    }
    
    // Create merged PDFs for each configuration group
    for (const [groupKey, group] of Object.entries(configGroups)) {
      try {
        if (group.files.length > 1) {
          // Generate cover page for this group
          const coverPageData = {
            studentName,
            studentId,
            config: group.config,
            files: group.files.map(f => ({
              name: f.fileInfo.name,
              pageCount: f.fileInfo.pageCount
            }))
          };
          
          const coverPage = await createCoverPage(coverPageData);
          
          // Merge PDFs in this group
          const filePaths = group.files.map(f => f.filePath);
          const mergedPdfPath = await mergePDFs(filePaths, orderId, groupKey, coverPage);
          
          // Update the group with the merged PDF path
          const { error: mergeError } = await supabase
            .from('print_file_groups')
            .insert({
              order_id: orderId,
              config_group: groupKey,
              merged_file_path: mergedPdfPath,
              config_color: group.config.color,
              config_sides: group.config.sides,
              config_copies: group.config.copies
            });
          
          if (mergeError) {
            console.error('Error saving merged file path:', mergeError);
          }
        }
      } catch (mergeError) {
        console.error(`Error merging PDFs for group ${groupKey}:`, mergeError);
        // Continue with other groups even if one fails
      }
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
