
import { supabase } from "@/integrations/supabase/client";
import { PrintOrder } from "./types";

/**
 * Get a file download URL from Supabase storage
 */
export const getOrderFileUrl = async (filePath: string): Promise<string> => {
  try {
    console.log("Getting file URL for path:", filePath);
    
    const { data } = supabase.storage
      .from('print_files')
      .getPublicUrl(filePath);
    
    if (!data.publicUrl) {
      throw new Error("Could not get public URL");
    }
    
    console.log("Generated public URL:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw new Error("Could not retrieve file download URL");
  }
};

/**
 * Download a file from a print order
 */
export const downloadOrderFile = async (
  filePath: string, 
  fileName: string = 'download.pdf'
): Promise<void> => {
  try {
    console.log("Starting download for file:", { filePath, fileName });
    
    // Get the public URL for the file
    const { data } = supabase.storage
      .from('print_files')
      .getPublicUrl(filePath);
    
    if (!data.publicUrl) {
      throw new Error("Could not get file URL");
    }
    
    console.log("Using download URL:", data.publicUrl);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = data.publicUrl;
    link.download = fileName;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error(`Could not download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Helper function to get the appropriate download file name for an order or file
 */
export const getDownloadFileName = (order: PrintOrder, fileIndex?: number): string => {
  if (fileIndex !== undefined && order.files[fileIndex]) {
    return order.files[fileIndex].name;
  }
  
  return `${order.studentName.replace(/\s+/g, '_')}_${order.studentId}_order.pdf`;
};
