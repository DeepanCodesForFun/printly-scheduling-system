
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Printer, ClipboardList, CheckCircle, Search, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderQueueItem from "@/components/OrderQueueItem";
import PrintJobModal from "@/components/PrintJobModal";
import { resetQueueStatus } from "@/services/printOrder/queueManagement";
import { 
  getPrintOrders, 
  updateOrderStatus, 
  deletePrintOrder, 
  subscribeToOrders,
  PrintOrder
} from "@/services/printOrder";

const StaffDashboard = () => {
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Get current date in IST (UTC+5:30)
  const getCurrentDateIST = () => {
    const now = new Date();
    // Add 5 hours and 30 minutes to UTC to get IST
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); 
    return istTime.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Inside the StaffDashboard component
  useEffect(() => {
    const initializeQueue = async () => {
      try {
        await resetQueueStatus();
        fetchPrintOrders();
      } catch (error) {
        console.error("Error initializing queue:", error);
        toast.error("Failed to initialize print queue");
      }
    };
    
    initializeQueue();
    
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      setPrintOrders(updatedOrders);
      updateStats(updatedOrders);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  
  
  const updateStats = (orders: PrintOrder[]) => {
    // Count pending orders
    const pending = orders.filter(order => order.status === 'pending').length;
    setPendingCount(pending);
    
    // Get today's date for comparison
    const todayIST = getCurrentDateIST();
    
    // Fix for completed orders counting: 
    // We need to check all orders (including both pending and completed) 
    // and count the ones that have status 'completed' and were completed today
    const completed = orders.filter(order => {
      if (order.status !== 'completed') return false;
      
      // Extract the date part from the timestamp
      const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
      
      // Compare with today's date
      return orderDate === todayIST;
    }).length;
    
    setCompletedCount(completed);
    
    // For debugging
    console.log("Order statuses:", orders.map(o => o.status));
    console.log("Calculated pending count:", pending);
    console.log("Today in IST:", todayIST);
    console.log("Calculated completed count:", completed);
  };

  const fetchPrintOrders = async () => {
    setIsLoading(true);
    
    try {
      const orders = await getPrintOrders();
      setPrintOrders(orders);
      updateStats(orders);
    } catch (error) {
      console.error("Error fetching print orders:", error);
      toast.error("Failed to load print queue");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleRefresh = () => {
    fetchPrintOrders();
    toast.success("Queue refreshed");
  };

  const handleProcessOrder = (orderId: string) => {
    const order = printOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCompleteOrder = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, 'completed');
        toast.success(`Print job for ${selectedOrder.studentName} marked as complete`);
        
        fetchPrintOrders();
      } catch (error) {
        console.error("Error completing order:", error);
        toast.error("Failed to complete print job");
      }
      
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await deletePrintOrder(selectedOrder.id);
        toast.info(`Print job for ${selectedOrder.studentName} has been deleted`);
        
        fetchPrintOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete print job");
      }
      
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = printOrders
  .filter(order => 
    order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    // Sort by timestamp (oldest first for FIFO)
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Xerox Staff Portal</h1>
              <p className="text-muted-foreground">Manage and process student print requests</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="glass-card dark:glass-card-dark rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2.5 bg-primary/10 rounded-full mr-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Pending Requests</h3>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{pendingCount}</span>
                <span className="text-sm text-muted-foreground ml-2">requests</span>
              </div>
            </motion.div>
            
            <motion.div
              className="glass-card dark:glass-card-dark rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2.5 bg-primary/10 rounded-full mr-3">
                  <Printer className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Active Printer</h3>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">1</span>
                <span className="text-sm text-muted-foreground ml-2">online</span>
              </div>
            </motion.div>
            
            <motion.div
              className="glass-card dark:glass-card-dark rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2.5 bg-primary/10 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Completed Today</h3>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{completedCount}</span>
                <span className="text-sm text-muted-foreground ml-2">jobs</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="glass-card dark:glass-card-dark rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Print Queue</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredOrders.length} request{filteredOrders.length !== 1 ? "s" : ""}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    className="pl-9 pr-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <motion.button
                  className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary/60" />
                  <p className="text-muted-foreground mt-4">Loading print requests...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <OrderQueueItem
                    key={order.id}
                    order={order}
                    onProcessClick={handleProcessOrder}
                    isFirstItem={index === 0}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No print requests found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      <PrintJobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onComplete={handleCompleteOrder}
        onDelete={handleDeleteOrder}
        orderData={selectedOrder}
      />
    </div>
  );
};

export default StaffDashboard;
