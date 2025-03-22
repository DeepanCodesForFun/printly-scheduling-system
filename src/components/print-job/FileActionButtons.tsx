
import { motion } from "framer-motion";
import { Download, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getFileDownloadUrl } from "@/utils/pdfMergeUtils";
import { PrintOrder } from "@/services/printOrder/types";

interface FileActionButtonsProps {
  files: {
    name: string;
    type: string;
    size: number;
    path?: string;
  }[];
  fileGroups?: PrintOrder['fileGroups'];
}

const FileActionButtons = ({ files, fileGroups }: FileActionButtonsProps) => {
  const downloadFile = async (path?: string, name?: string) => {
    if (!path) {
      toast.error("File path not available");
      return;
    }
    
    try {
      // Get a download URL for the file
      const url = await getFileDownloadUrl(path);
      
      // Create an anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'download.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("File download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };
  
  const hasFiles = files && files.length > 0;
  const hasMergedFiles = fileGroups && fileGroups.length > 0 && fileGroups.some(g => g.mergedFilePath);
  
  if (!hasFiles && !hasMergedFiles) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Actions</h3>
      
      <div className="flex flex-wrap gap-2">
        {hasFiles && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => {
                if (files[0].path) {
                  downloadFile(files[0].path, files[0].name);
                } else {
                  toast.error("File path not available");
                }
              }}
            >
              <Download size={14} className="mr-2" />
              Download Individual Files
            </Button>
          </motion.div>
        )}
        
        {hasMergedFiles && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center"
              onClick={() => {
                if (fileGroups && fileGroups[0].mergedFilePath) {
                  downloadFile(fileGroups[0].mergedFilePath, 'merged.pdf');
                } else {
                  toast.error("Merged file not available");
                }
              }}
            >
              <FileArchive size={14} className="mr-2" />
              Download Merged File
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileActionButtons;
