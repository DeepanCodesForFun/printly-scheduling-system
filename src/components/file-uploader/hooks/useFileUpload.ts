
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getTotalPdfPageCount } from "@/utils/pdfUtils";

export interface UseFileUploadOptions {
  onFilesChange: (files: File[], totalPages?: number) => void;
}

export const useFileUpload = ({ onFilesChange }: UseFileUploadOptions) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isCountingPages, setIsCountingPages] = useState(false);

  const updatePageCount = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      setTotalPages(0);
      return;
    }
    
    setIsCountingPages(true);
    try {
      const pageCount = await getTotalPdfPageCount(files);
      setTotalPages(pageCount);
      onFilesChange(files, pageCount);
    } catch (error) {
      console.error("Error counting pages:", error);
      toast.error("Could not count PDF pages");
    } finally {
      setIsCountingPages(false);
    }
  }, [onFilesChange]);

  const handleFileSelect = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const validFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length !== newFiles.length) {
      toast.error("Only PDF files are allowed");
    }
    
    if (validFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(updatedFiles);
      updatePageCount(updatedFiles);
    }
  }, [uploadedFiles, updatePageCount]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    updatePageCount(updatedFiles);
  }, [uploadedFiles, updatePageCount]);

  return {
    uploadedFiles,
    totalPages,
    isCountingPages,
    handleFileSelect,
    removeFile
  };
};
