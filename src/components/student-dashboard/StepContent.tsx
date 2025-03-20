
import { motion, AnimatePresence } from "framer-motion";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import FileUploadStep from "./FileUploadStep";
import ConfigureStep from "./ConfigureStep";
import StudentInfoStep from "./StudentInfoStep";

const StepContent = () => {
  const { currentStep } = usePrintOrder();

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
      {currentStep === 2 && <ConfigureStep />}
      {currentStep === 3 && <StudentInfoStep />}
    </motion.div>
  );
};

export default StepContent;
