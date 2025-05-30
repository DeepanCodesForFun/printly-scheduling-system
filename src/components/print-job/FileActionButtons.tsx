
import { motion } from "framer-motion";
import { Download, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PrintOrder } from "@/services/printOrder/types";
import { downloadOrderFile, getDownloadFileName } from "@/services/printOrder";

interface FileActionButtonsProps {
  order: PrintOrder;
}

const FileActionButtons = ({ order }: FileActionButtonsProps) => {
  const { files, fileGroups } = order;
  
  const handleFileDownload = async (index: number) => {
    const file = files[index];
    // Check for both path and storage_path properties
    const filePath = file?.path || file?.storage_path;
    
    if (!filePath) {
      console.error("File download error - no path found:", file);
      toast.error("File path not available for download");
      return;
    }
    
    try {
      console.log("Attempting to download file:", filePath);
      await downloadOrderFile(filePath, file.name);
      toast.success(`Download started for ${file.name}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${file.name}`);
    }
  };
  
  const handleMergedDownload = async () => {
    if (!fileGroups || fileGroups.length === 0) {
      toast.error("No merged files available");
      return;
    }
    
    const mergedGroup = fileGroups.find(g => g.mergedFilePath);
    if (!mergedGroup?.mergedFilePath) {
      toast.error("Merged file not available");
      return;
    }
    
    try {
      await downloadOrderFile(mergedGroup.mergedFilePath, getDownloadFileName(order));
      toast.success("Merged file download started");
    } catch (error) {
      console.error("Merged download error:", error);
      toast.error("Failed to download merged file");
    }
  };
  
  const hasFiles = files && files.length > 0;
  const hasMergedFiles = fileGroups && fileGroups.length > 0 && fileGroups.some(g => g.mergedFilePath);
  
  if (!hasFiles && !hasMergedFiles) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Actions</h3>
        <p className="text-sm text-muted-foreground">No files available for download</p>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Actions</h3>
      
      <div className="flex flex-wrap gap-2">
        {hasFiles && (
          <div className="space-y-2 w-full">
            {files.map((file, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center w-full justify-start"
                  onClick={() => handleFileDownload(index)}
                >
                  <Download size={14} className="mr-2" />
                  Download {file.name}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
        
        {hasMergedFiles && (
          <motion.div
            className="mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center"
              onClick={handleMergedDownload}
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
