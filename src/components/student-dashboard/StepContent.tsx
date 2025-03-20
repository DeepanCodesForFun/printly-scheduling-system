
import { motion, AnimatePresence } from "framer-motion";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import FileUploadStep from "./FileUploadStep";
import FileConfigMockupStep from "./FileConfigMockupStep";
import ConfigureStep from "./ConfigureStep";
import StudentInfoStep from "./StudentInfoStep";

const StepContent = () => {
  const { currentStep } = usePrintOrder();

  // Here we add the mockup as step "1.5" just for demonstration
  // In a real implementation, we'd modify the entire step flow
  const showMockup = true; // Now showing the mockup for demonstration

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="glass-card dark:glass-card-dark rounded-2xl p-6 md:p-8 mb-8"
    >
      {currentStep === 1 && <FileUploadStep />}
      {currentStep === 1 && showMockup && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <FileConfigMockupStep />
        </div>
      )}
      {currentStep === 2 && <ConfigureStep />}
      {currentStep === 3 && <StudentInfoStep />}
    </motion.div>
  );
};

export default StepContent;
