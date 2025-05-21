
import { FileConfig } from "@/services/printOrder/types";

export interface FileWithConfig extends File {
  config?: FileConfig;
  configGroup?: string;
}

export interface PrintOrderContextType {
  files: FileWithConfig[];
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
  fileConfigs: Record<number, FileConfig>;
  handleFilesChange: (newFiles: File[], newTotalPages?: number) => void;
  handleConfigChange: (configId: string, optionId: string) => void;
  handleFileConfigChange: (fileIndex: number, configId: string, optionId: string) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleSubmitOrder: () => Promise<void>;
  calculatePrice: () => string;
  calculateFilePrice: (fileIndex: number) => string;
  getConfigGroups: () => { key: string; files: number[]; config: FileConfig }[];
  applyConfigToAllFiles: (config: FileConfig) => void;
  resetFileConfig: (fileIndex: number) => void;
  setStudentName: (name: string) => void;
  setStudentId: (id: string) => void;
  setAdditionalDetails: (details: string) => void;
}
