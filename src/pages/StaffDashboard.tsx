
import { useState } from "react";
import { motion } from "framer-motion";
import { Printer, ClipboardList, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderQueueItem from "@/components/OrderQueueItem";
import PrintJobModal from "@/components/PrintJobModal";
import StatsCard from "@/components/dashboard/StatsCard";
import SearchBar from "@/components/dashboard/SearchBar";
import { usePrintOrders } from "@/hooks/usePrintOrders";
import { updateOrderStatus, deletePrintOrder, PrintOrder } from "@/services/printOrder";

const StaffDashboard = () => {
  const { printOrders, isLoading, pendingCount, completedCount, fetchPrintOrders } = usePrintOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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
            <StatsCard
              icon={ClipboardList}
              title="Pending Requests"
              value={pendingCount}
              unit="requests"
              delay={0.1}
            />
            <StatsCard
              icon={Printer}
              title="Active Printer"
              value={1}
              unit="online"
              delay={0.2}
            />
            <StatsCard
              icon={CheckCircle}
              title="Completed Today"
              value={completedCount}
              unit="jobs"
              delay={0.3}
            />
          </div>
          
          <motion.div
            className="glass-card dark:glass-card-dark rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              resultCount={filteredOrders.length}
            />
            
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
