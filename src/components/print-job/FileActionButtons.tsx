
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
    if (!files[index]?.path) {
      toast.error("File path not available");
      return;
    }
    
    try {
      await downloadOrderFile(files[index].path!, getDownloadFileName(order, index));
      toast.success("File download started");
    } catch (error) {
      toast.error("Failed to download file");
    }
  };
  
  const handleMergedDownload = async () => {
    if (!fileGroups || fileGroups.length === 0 || !fileGroups[0].mergedFilePath) {
      toast.error("Merged file not available");
      return;
    }
    
    try {
      await downloadOrderFile(fileGroups[0].mergedFilePath, getDownloadFileName(order));
      toast.success("Merged file download started");
    } catch (error) {
      toast.error("Failed to download merged file");
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
              onClick={() => handleFileDownload(0)}
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
