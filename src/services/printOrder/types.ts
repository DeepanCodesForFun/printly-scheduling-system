
/**
 * Print order related type definitions
 */
export interface PrintOrder {
  id: string;
  studentName: string;
  studentId: string;
  timestamp: string;
  status: string;
  isActive: boolean;
  fileCount: number;
  amount: number;
  additionalDetails?: string;
  files: {
    name: string;
    type: string;
    size: number;
    path?: string;
    config?: FileConfig;
    configGroup?: string;
  }[];
  config: {
    color: string;
    sides: string;
    copies: string;
  };
  fileGroups?: {
    groupKey: string;
    config: FileConfig;
    fileCount: number;
    mergedFilePath?: string;
  }[];
}

export interface FileConfig {
  color: string;
  sides: string;
  copies: string;
}

export interface CreateOrderParams {
  studentName: string;
  studentId: string;
  files: File[];
  config: {
    color: string;
    sides: string;
    copies: string;
  };
  amount: number;
  additionalDetails?: string;
  fileConfigs?: FileConfig[];
}
