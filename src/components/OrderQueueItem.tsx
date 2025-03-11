import { motion } from "framer-motion";
import { User, Calendar, FileText, Clock, Printer } from "lucide-react";
import { useState } from "react";
import { PrintOrder } from "@/services/printOrder";

interface OrderQueueItemProps {
  order: PrintOrder;
  onProcessClick: (orderId: string) => void;
}

const OrderQueueItem = ({ order, onProcessClick }: OrderQueueItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      className={`glass-card dark:glass-card-dark rounded-xl overflow-hidden ${
        order.isActive 
          ? "border-2 border-primary/30 dark:border-primary/50" 
          : "opacity-80"
      }`}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.12)",
        y: -2
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                {order.studentName}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>{formatTime(order.timestamp)}</span>
                </div>
                
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  <span>{order.fileCount} files</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>ID: {order.studentId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 md:p-6 md:ml-4 md:border-l border-border flex flex-col items-center justify-center ${
          !order.isActive ? "opacity-50 cursor-not-allowed" : ""
        }`}>
          <motion.button
            disabled={!order.isActive}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
              order.isActive
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            }`}
            whileHover={order.isActive ? { scale: 1.03 } : {}}
            whileTap={order.isActive ? { scale: 0.98 } : {}}
            onClick={() => order.isActive && onProcessClick(order.id)}
          >
            <Printer className="h-4 w-4" />
            <span>{order.isActive ? "Process" : "Waiting"}</span>
          </motion.button>
        </div>
      </div>
      
      {order.isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="h-1 bg-primary origin-left"
        />
      )}
    </motion.div>
  );
};

export default OrderQueueItem;
