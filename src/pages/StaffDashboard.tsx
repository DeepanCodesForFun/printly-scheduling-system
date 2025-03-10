
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Printer, ClipboardList, CheckCircle, Search, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderQueueItem from "@/components/OrderQueueItem";
import PrintJobModal from "@/components/PrintJobModal";

// Mock data for staff dashboard
const mockPrintOrders = [
  {
    id: "ord-001",
    studentName: "John Smith",
    studentId: "IEM/2023/001",
    timestamp: new Date().toISOString(),
    fileCount: 3,
    isActive: true,
    files: [
      { name: "Assignment_1.pdf", type: "pdf", size: 1024000 },
      { name: "Notes_Chapter_2.docx", type: "docx", size: 856000 },
      { name: "Presentation.pdf", type: "pdf", size: 3500000 }
    ],
    config: {
      color: "Black & White",
      sides: "Double-sided",
      pages: "1 Page"
    },
    amount: 45.50
  },
  {
    id: "ord-002",
    studentName: "Emma Johnson",
    studentId: "IEM/2023/042",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    fileCount: 1,
    isActive: false,
    files: [
      { name: "Final_Project.pdf", type: "pdf", size: 5240000 }
    ],
    config: {
      color: "Color",
      sides: "Single-sided",
      pages: "1 Page"
    },
    amount: 35.00
  },
  {
    id: "ord-003",
    studentName: "Robert Chen",
    studentId: "IEM/2023/089",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    fileCount: 2,
    isActive: false,
    files: [
      { name: "Lab_Report.docx", type: "docx", size: 980000 },
      { name: "Data_Charts.pdf", type: "pdf", size: 1200000 }
    ],
    config: {
      color: "Black & White",
      sides: "Single-sided",
      pages: "2 Pages"
    },
    amount: 25.75
  },
  {
    id: "ord-004",
    studentName: "Sophia Patel",
    studentId: "IEM/2023/117",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    fileCount: 4,
    isActive: false,
    files: [
      { name: "Research_Paper.pdf", type: "pdf", size: 2560000 },
      { name: "Bibliography.docx", type: "docx", size: 450000 },
      { name: "Appendix_A.pdf", type: "pdf", size: 980000 },
      { name: "Appendix_B.pdf", type: "pdf", size: 870000 }
    ],
    config: {
      color: "Color",
      sides: "Double-sided",
      pages: "1 Page"
    },
    amount: 78.25
  },
  {
    id: "ord-005",
    studentName: "Michael Davis",
    studentId: "IEM/2023/063",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    fileCount: 2,
    isActive: false,
    files: [
      { name: "Thesis_Draft.pdf", type: "pdf", size: 7800000 },
      { name: "References.docx", type: "docx", size: 560000 }
    ],
    config: {
      color: "Black & White",
      sides: "Double-sided",
      pages: "2 Pages"
    },
    amount: 42.00
  }
];

const StaffDashboard = () => {
  const [printOrders, setPrintOrders] = useState(mockPrintOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockPrintOrders)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Update stats on component mount
  useEffect(() => {
    updateStats();
  }, [printOrders]);
  
  const updateStats = () => {
    setPendingCount(printOrders.length);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Queue refreshed");
    }, 1000);
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

  const handleCompleteOrder = () => {
    if (selectedOrder) {
      // Remove the order from the list
      setPrintOrders(printOrders.filter(order => order.id !== selectedOrder.id));
      
      // Update the next order to be active
      const updatedOrders = printOrders.map((order, index) => {
        if (index === 1) { // The second order becomes the first active one
          return { ...order, isActive: true };
        }
        return order;
      });
      
      setPrintOrders(updatedOrders.filter(order => order.id !== selectedOrder.id));
      
      // Increment the completed count when "Mark as Complete" is clicked
      setCompletedCount(prevCount => prevCount + 1);
      
      toast.success(`Print job for ${selectedOrder.studentName} marked as complete`);
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = () => {
    if (selectedOrder) {
      // Remove the order from the list
      setPrintOrders(printOrders.filter(order => order.id !== selectedOrder.id));
      
      // Update the next order to be active
      const updatedOrders = printOrders.map((order, index) => {
        if (index === 1) { // The second order becomes the first active one
          return { ...order, isActive: true };
        }
        return order;
      });
      
      setPrintOrders(updatedOrders.filter(order => order.id !== selectedOrder.id));
      
      toast.info(`Print job for ${selectedOrder.studentName} has been deleted`);
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  // Filter orders based on search term
  const filteredOrders = printOrders.filter(order => 
    order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
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
          
          {/* Stats Section */}
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
          
          {/* Queue Management */}
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderQueueItem
                    key={order.id}
                    order={order}
                    onProcessClick={handleProcessOrder}
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
      
      {/* Print Job Modal */}
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
