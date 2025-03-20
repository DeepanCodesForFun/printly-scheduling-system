
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { createPrintOrder } from "@/services/printOrderService";
import { CreateOrderParams } from "@/services/printOrder/types";

interface PrintOrderContextType {
  files: File[];
  totalPages: number;
  currentStep: number;
  config: {
    color: string;
    sides: string;
    copies: string;
  };
  isProcessing: boolean;
  studentName: string;
  studentId: string;
  additionalDetails: string;
  handleFilesChange: (newFiles: File[], newTotalPages?: number) => void;
  handleConfigChange: (configId: string, optionId: string) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleSubmitOrder: () => Promise<void>;
  calculatePrice: () => string;
  setStudentName: (name: string) => void;
  setStudentId: (id: string) => void;
  setAdditionalDetails: (details: string) => void;
}

const PrintOrderContext = createContext<PrintOrderContextType | undefined>(undefined);

export const PrintOrderProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    color: "bw",
    sides: "single",
    copies: "1"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleFilesChange = (newFiles: File[], newTotalPages?: number) => {
    setFiles(newFiles);
    if (newTotalPages !== undefined) {
      setTotalPages(newTotalPages);
    }
  };

  const handleConfigChange = (configId: string, optionId: string) => {
    setConfig(prev => ({
      ...prev,
      [configId]: optionId
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }
    
    if (currentStep === 3 && (!studentName || !studentId)) {
      toast.error("Please enter your name and student ID");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmitOrder = async () => {
    if (!studentName || !studentId) {
      toast.error("Please enter your name and student ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      await createPrintOrder({
        studentName,
        studentId,
        files,
        config,
        amount: parseFloat(calculatePrice()),
        additionalDetails: additionalDetails.trim() || undefined
      });
      
      toast.success("Your print request has been submitted!");
      
      setFiles([]);
      setConfig({
        color: "bw",
        sides: "single",
        copies: "1"
      });
      setCurrentStep(1);
      setStudentName("");
      setStudentId("");
      setAdditionalDetails("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit print request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePrice = () => {
    let pricePerPage = 0;
    
    if (config.color === "bw") {
      pricePerPage = config.sides === "single" ? 3 : 5;
    } else { // color
      pricePerPage = config.sides === "single" ? 10 : 17;
    }
    
    const numCopies = parseInt(config.copies);
    
    const totalPrice = pricePerPage * totalPages * numCopies;
    
    return totalPrice.toFixed(2);
  };

  const value = {
    files,
    totalPages,
    currentStep,
    config,
    isProcessing,
    studentName,
    studentId,
    additionalDetails,
    handleFilesChange,
    handleConfigChange,
    handleNextStep,
    handlePrevStep,
    handleSubmitOrder,
    calculatePrice,
    setStudentName,
    setStudentId,
    setAdditionalDetails
  };

  return (
    <PrintOrderContext.Provider value={value}>
      {children}
    </PrintOrderContext.Provider>
  );
};

export const usePrintOrder = () => {
  const context = useContext(PrintOrderContext);
  if (context === undefined) {
    throw new Error('usePrintOrder must be used within a PrintOrderProvider');
  }
  return context;
};
