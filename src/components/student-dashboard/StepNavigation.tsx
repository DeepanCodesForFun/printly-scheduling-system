
import { motion } from "framer-motion";
import { ChevronRight, Send } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";

const StepNavigation = () => {
  const { currentStep, handlePrevStep, handleNextStep, handleSubmitOrder, isProcessing } = usePrintOrder();

  return (
    <div className="flex justify-between">
      {currentStep > 1 ? (
        <motion.button
          className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrevStep}
        >
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          <span>Back</span>
        </motion.button>
      ) : (
        <div></div>
      )}
      
      {currentStep < 3 ? (
        <motion.button
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNextStep}
        >
          <span>Continue</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </motion.button>
      ) : (
        <motion.button
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          onClick={handleSubmitOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              <span>Submit Order</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default StepNavigation;
