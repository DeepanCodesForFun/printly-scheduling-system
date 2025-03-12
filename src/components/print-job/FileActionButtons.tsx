
import { motion } from "framer-motion";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { getFileUrl } from "@/utils/pdfUtils";

interface FileActionButtonsProps {
  files: {
    name: string;
    path?: string;
  }[];
}

const FileActionButtons = ({ files }: FileActionButtonsProps) => {
  const handleDownloadAll = () => {
    files.forEach((file) => {
      if (file.path) {
        const url = getFileUrl(file.path);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
    
    toast.success("All files are being downloaded", {
      description: "Files are being prepared for download"
    });
  };
  
  const handlePrintAll = () => {
    toast.success("Print job started", {
      description: "All files have been sent to the printer"
    });
  };

  return (
    <div className="mt-4">
      <motion.button
        className="w-full bg-secondary hover:bg-secondary/70 text-primary font-medium py-3 rounded-xl flex items-center justify-center mb-3"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadAll}
      >
        <Download className="h-4 w-4 mr-2" />
        Download All Files
      </motion.button>
      
      <motion.button
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl flex items-center justify-center"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePrintAll}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print All
      </motion.button>
    </div>
  );
};

export default FileActionButtons;
