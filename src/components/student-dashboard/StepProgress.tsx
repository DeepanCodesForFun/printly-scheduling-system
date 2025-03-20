
import { motion } from "framer-motion";
import { Upload, Sliders, Settings } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import { STEPS } from "@/constants/printConfig";

const StepProgress = () => {
  const { currentStep } = usePrintOrder();
  
  // Map icon string to the corresponding Lucide icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Upload':
        return <Upload className="h-5 w-5 text-primary" />;
      case 'Sliders':
        return <Sliders className="h-5 w-5 text-primary" />;
      case 'Settings':
        return <Settings className="h-5 w-5 text-primary" />;
      default:
        return <Upload className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-bold text-primary">
        Step {currentStep}: {STEPS[currentStep - 1].title}
      </h2>
      <p className="text-muted-foreground mt-2">
        {STEPS[currentStep - 1].description}
      </p>
    </div>
  );
};

export default StepProgress;
