
import { supabase } from "@/integrations/supabase/client";
import { PrintOrder } from "./types";

const SIGNED_URL_TTL_SECONDS = 60 * 10; // 10 minutes

/**
 * Get a temporary signed download URL from Supabase storage.
 * The bucket is private, so this is the only way to access files.
 */
export const getOrderFileUrl = async (filePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('print_files')
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error("Error creating signed URL:", error);
    throw new Error("Could not retrieve file download URL");
  }

  return data.signedUrl;
};

/**
 * Download a file from a print order
 */
export const downloadOrderFile = async (
  filePath: string,
  fileName: string = 'download.pdf'
): Promise<void> => {
  try {
    const url = await getOrderFileUrl(filePath);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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
