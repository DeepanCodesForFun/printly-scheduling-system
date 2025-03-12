
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PrintOrder } from "@/services/printOrder";
import { getPrintOrders, subscribeToOrders } from "@/services/printOrder";
import { resetQueueStatus } from "@/services/printOrder/queueManagement";

export const usePrintOrders = () => {
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const getCurrentDateIST = () => {
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    return istTime.toISOString().split('T')[0];
  };

  const updateStats = (orders: PrintOrder[]) => {
    const pending = orders.filter(order => order.status === 'pending').length;
    setPendingCount(pending);
    
    const todayIST = getCurrentDateIST();
    
    const completed = orders.filter(order => {
      if (order.status !== 'completed') return false;
      const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
      return orderDate === todayIST;
    }).length;
    
    setCompletedCount(completed);
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

  return {
    printOrders,
    isLoading,
    pendingCount,
    completedCount,
    fetchPrintOrders
  };
};
