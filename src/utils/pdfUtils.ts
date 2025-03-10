
/**
 * Utility functions for working with PDF files
 */

/**
 * Get the page count from a PDF file
 * @param file PDF file to analyze
 * @returns Promise resolving to the number of pages
 */
export const getPdfPageCount = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = function() {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);
      
      // Look for page count markers in the PDF
      let text = "";
      for (let i = 0; i < typedArray.length; i++) {
        text += String.fromCharCode(typedArray[i]);
      }
      
      // PDF format uses objects with /Type /Page to define pages
      const pageMatches = text.match(/\/Type\s*\/Page\s/g);
      
      if (pageMatches) {
        resolve(pageMatches.length);
      } else {
        // If matching fails, assume at least 1 page
        resolve(1);
      }
    };
    
    fileReader.onerror = function() {
      reject(new Error('Error reading PDF file'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
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
