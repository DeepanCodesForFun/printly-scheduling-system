
import { FileConfig } from "@/services/printOrder/types";
import { FileWithConfig } from "./types";

export const getFileConfig = (
  fileIndex: number, 
  fileConfigs: Record<number, FileConfig>,
  defaultConfig: FileConfig
): FileConfig => {
  return fileConfigs[fileIndex] || defaultConfig;
};

export const getConfigGroups = (
  files: FileWithConfig[],
  fileConfigs: Record<number, FileConfig>,
  defaultConfig: FileConfig
) => {
  const groups: Record<string, { files: number[], config: FileConfig }> = {};
  
  files.forEach((_, index) => {
    const fileConfig = getFileConfig(index, fileConfigs, defaultConfig);
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

export const calculateFilePrice = (
  fileIndex: number,
  files: FileWithConfig[],
  fileConfigs: Record<number, FileConfig>,
  defaultConfig: FileConfig
): string => {
  if (fileIndex >= files.length) {
    return "0.00";
  }
  
  const fileConfig = getFileConfig(fileIndex, fileConfigs, defaultConfig);
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

export const calculateTotalPrice = (
  files: FileWithConfig[],
  fileConfigs: Record<number, FileConfig>,
  defaultConfig: FileConfig
): string => {
  let totalPrice = 0;
  
  // Calculate price for each file based on its configuration
  files.forEach((_, index) => {
    totalPrice += parseFloat(calculateFilePrice(index, files, fileConfigs, defaultConfig));
  });
  
  return totalPrice.toFixed(2);
};
