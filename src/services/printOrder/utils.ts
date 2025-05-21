
import { supabase } from "@/integrations/supabase/client";
import { downloadFile, getFileDownloadUrl } from "@/utils/pdfMergeUtils";
import { PrintOrder } from "./types";

/**
 * Get a file download URL from Supabase storage
 */
export const getOrderFileUrl = async (filePath: string): Promise<string> => {
  try {
    return await getFileDownloadUrl(filePath);
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
    const url = await getFileDownloadUrl(filePath);
    
    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Could not download file");
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
