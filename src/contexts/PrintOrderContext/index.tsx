
import { createContext, useContext, ReactNode } from "react";
import { PrintOrderContextType } from "./types";
import { usePrintOrderState } from "./hooks";

const PrintOrderContext = createContext<PrintOrderContextType | undefined>(undefined);

export const PrintOrderProvider = ({ children }: { children: ReactNode }) => {
  const state = usePrintOrderState();
  return (
    <PrintOrderContext.Provider value={state}>
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

// Re-export types
export * from "./types";
