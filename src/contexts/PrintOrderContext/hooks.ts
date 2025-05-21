
import { useState } from "react";
import { toast } from "sonner";
import { createPrintOrder } from "@/services/printOrderService";
import { FileConfig } from "@/services/printOrder/types";
import { FileWithConfig } from "./types";
import { calculateTotalPrice, getFileConfig } from "./utils";

export const usePrintOrderState = () => {
  const [files, setFiles] = useState<FileWithConfig[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<FileConfig>({
    color: "bw",
    sides: "single",
    copies: "1"
  });
  const [fileConfigs, setFileConfigs] = useState<Record<number, FileConfig>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleFilesChange = (newFiles: File[], newTotalPages?: number) => {
    // Convert to FileWithConfig if they aren't already
    const filesWithConfig = newFiles.map(file => {
      if ('config' in file) {
        return file as FileWithConfig;
      }
      return file as FileWithConfig;
    });
    
    setFiles(filesWithConfig);
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
  
  const handleFileConfigChange = (fileIndex: number, configId: string, optionId: string) => {
    setFileConfigs(prev => {
      const newConfig = { 
        ...prev[fileIndex] || { ...config }, 
        [configId]: optionId 
      };
      
      return {
        ...prev,
        [fileIndex]: newConfig
      };
    });
  };
  
  const resetFileConfig = (fileIndex: number) => {
    setFileConfigs(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[fileIndex];
      return newConfigs;
    });
  };
  
  const applyConfigToAllFiles = (configToApply: FileConfig) => {
    // Create a new fileConfigs object with the same config for all files
    const newFileConfigs: Record<number, FileConfig> = {};
    files.forEach((_, index) => {
      newFileConfigs[index] = { ...configToApply };
    });
    setFileConfigs(newFileConfigs);
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
  
  const getConfigGroups = () => {
    const groups: Record<string, { files: number[], config: FileConfig }> = {};
    
    files.forEach((_, index) => {
      const fileConfig = getFileConfig(index, fileConfigs, config);
      const key = `${fileConfig.color}-${fileConfig.sides}-${fileConfig.copies}`;
      
      if (!groups[key]) {
        groups[key] = {
          files: [],
          config: fileConfig
        };
      }
      
      groups[key].files.push(index);
    });
    
    return Object.entries(groups).map(([key, group]) => ({
      key,
      files: group.files,
      config: group.config
    }));
  };
  
  const calculateFilePrice = (fileIndex: number): string => {
    if (fileIndex >= files.length) {
      return "0.00";
    }
    
    const fileConfig = getFileConfig(fileIndex, fileConfigs, config);
    let pricePerPage = 0;
    
    if (fileConfig.color === "bw") {
      pricePerPage = fileConfig.sides === "single" ? 3 : 5;
    } else { // color
      pricePerPage = fileConfig.sides === "single" ? 10 : 17;
    }
    
    const numCopies = parseInt(fileConfig.copies);
    
    // Assuming each file has 1 page for simplicity
    // In a real implementation, we'd get the actual page count for each file
    const pageCount = 1; // Placeholder
    
    const filePrice = pricePerPage * pageCount * numCopies;
    
    return filePrice.toFixed(2);
  };

  const handleSubmitOrder = async () => {
    if (!studentName || !studentId) {
      toast.error("Please enter your name and student ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert fileConfigs to array format for API
      const fileConfigsArray = files.map((_, index) => getFileConfig(index, fileConfigs, config));
      
      await createPrintOrder({
        studentName,
        studentId,
        files,
        config,
        amount: parseFloat(calculateTotalPrice(files, fileConfigs, config)),
        additionalDetails: additionalDetails.trim() || undefined,
        fileConfigs: fileConfigsArray
      });
      
      toast.success("Your print request has been submitted!");
      
      setFiles([]);
      setFileConfigs({});
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
    return calculateTotalPrice(files, fileConfigs, config);
  };

  return {
    files,
    totalPages,
    currentStep,
    config,
    isProcessing,
    studentName,
    studentId,
    additionalDetails,
    fileConfigs,
    handleFilesChange,
    handleConfigChange,
    handleFileConfigChange,
    handleNextStep,
    handlePrevStep,
    handleSubmitOrder,
    calculatePrice,
    calculateFilePrice,
    getConfigGroups,
    applyConfigToAllFiles,
    resetFileConfig,
    setStudentName,
    setStudentId,
    setAdditionalDetails,
  };
};
