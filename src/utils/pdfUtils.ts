
/**
 * Utility functions for working with PDF files
 */
import { supabase } from "@/integrations/supabase/client";
import { PDFDocument } from "pdf-lib";

/**
 * Get the page count from a PDF file
 * @param file PDF file to analyze
 * @returns Promise resolving to the number of pages
 */
export const getPdfPageCount = async (file: File): Promise<number> => {
  try {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      // Non-PDF files: count as 1 page
      return 1;
    }
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true, throwOnInvalidObject: false });
    return pdf.getPageCount() || 1;
  } catch (error) {
    console.error("Error reading PDF page count:", error);
    return 1;
  }
};

/**
 * Get the total page count from multiple PDF files
 * @param files Array of PDF files
 * @returns Promise resolving to the total number of pages across all files
 */
export const getTotalPdfPageCount = async (files: File[]): Promise<number> => {
  try {
    const pageCounts = await Promise.all(
      files.map(file => getPdfPageCount(file))
    );
    
    return pageCounts.reduce((total, count) => total + count, 0);
  } catch (error) {
    console.error('Error counting PDF pages:', error);
    return files.length; // Fallback to number of files
  }
};

/**
 * Upload PDF files to Supabase storage
 * @param files Array of PDF files to upload
 * @param orderId UUID of the print order
 * @returns Promise resolving to an array of file paths
 */
export const uploadPdfFiles = async (files: File[], orderId: string): Promise<{
  filePath: string;
  fileInfo: {
    name: string;
    size: number;
    type: string;
    pageCount: number;
  };
}[]> => {
  try {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${orderId}/${timestamp}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('print_files')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const pageCount = await getPdfPageCount(file);
      
      return {
        filePath: fileName,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
          pageCount
        }
      };
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Get a temporary signed download URL for a file from Supabase storage.
 * The print_files bucket is private — signed URLs are required.
 */
export const getFileUrl = async (filePath: string, ttlSeconds = 600): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('print_files')
    .createSignedUrl(filePath, ttlSeconds);

  if (error || !data?.signedUrl) {
    console.error("Error creating signed URL:", error);
    throw new Error("Could not retrieve file URL");
  }
  return data.signedUrl;
};
