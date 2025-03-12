
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { PrintOrder } from "@/services/printOrder";
import { deletePrintOrder } from "@/services/printOrder/queueManagement";
import StudentInfoCard from "./print-job/StudentInfoCard";
import PrintConfigCard from "./print-job/PrintConfigCard";
import FilesList from "./print-job/FilesList";
import FileActionButtons from "./print-job/FileActionButtons";

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
  
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
                  <StudentInfoCard 
                    studentName={orderData.studentName}
                    studentId={orderData.studentId}
                    timestamp={orderData.timestamp}
                    amount={orderData.amount}
                  />
                  
                  <PrintConfigCard config={orderData.config} />
                </div>
                
                <div>
                  <FilesList files={orderData.files} />
                  
                  <FileActionButtons files={orderData.files} />
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
