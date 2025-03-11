
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, File, Printer, Check, User, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { PrintOrder } from "@/services/printOrder";
import { getFileUrl } from "@/utils/pdfUtils";
import { deletePrintOrder } from "@/services/printOrder/queueManagement";

interface PrintJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onDelete: () => void;
  orderData: PrintOrder | null;
}

const PrintJobModal = ({ isOpen, onClose, onComplete, onDelete, orderData }: PrintJobModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };
  
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleDownloadAll = () => {
    if (!orderData) return;
    
    orderData.files.forEach((file: any) => {
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
  
  const handleCompleteOrder = async () => {
    if (orderData) {
      try {
        await deletePrintOrder(orderData.id);
        toast.success(`Print job for ${orderData.studentName} marked as complete and deleted`);
        onComplete();
      } catch (error) {
        console.error("Error completing order:", error);
        toast.error("Failed to complete and delete print job");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && orderData && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-black/80 rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={handleContentClick}
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <h2 className="text-xl font-semibold flex items-center">
                <Printer className="mr-2 h-5 w-5 text-primary" />
                Print Job Details
              </h2>
              
              <motion.button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Student Information</h3>
                  <div className="glass-card dark:glass-card-dark rounded-xl p-4 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2.5 bg-primary/10 rounded-full mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{orderData.studentName}</p>
                        <p className="text-sm text-muted-foreground">ID: {orderData.studentId}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{formatTime(orderData.timestamp)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>₹{orderData.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Print Configuration</h3>
                  <div className="glass-card dark:glass-card-dark rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Color</p>
                        <p className="font-medium">{orderData.config.color}</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Sides</p>
                        <p className="font-medium">{orderData.config.sides}</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Copies</p>
                        <p className="font-medium">{orderData.config.copies}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Files ({orderData.files.length})</h3>
                  <div className="glass-card dark:glass-card-dark rounded-xl p-4 max-h-[250px] overflow-y-auto">
                    <div className="space-y-2">
                      {orderData.files.map((file: any, index: number) => (
                        <div 
                          key={`${file.name}-${index}`}
                          className="flex items-center p-2.5 bg-secondary/50 dark:bg-secondary/20 rounded-lg"
                        >
                          <div className="p-1.5 bg-primary/10 rounded-md mr-3">
                            {file.type === "pdf" ? (
                              <FileText size={16} className="text-primary" />
                            ) : (
                              <File size={16} className="text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
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
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between">
              <motion.button
                className="px-5 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDelete}
              >
                <X className="h-4 w-4 mr-2" />
                Delete Print Job
              </motion.button>
              
              <motion.button
                className="px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompleteOrder}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Complete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrintJobModal;
