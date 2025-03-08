
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfigOption {
  id: string;
  title: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
}

interface PrintConfigCardProps {
  config: ConfigOption;
  selectedOption: string;
  onOptionSelect: (configId: string, optionId: string) => void;
}

const PrintConfigCard = ({ config, selectedOption, onOptionSelect }: PrintConfigCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleOptionClick = (optionId: string) => {
    onOptionSelect(config.id, optionId);
    setIsOpen(false);
  };
  
  // Find the selected option object
  const currentOption = config.options.find(option => option.id === selectedOption);
  
  return (
    <div className="relative">
      <motion.div
        className="glass-card dark:glass-card-dark rounded-xl p-4 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium mb-1">{config.title}</h3>
            <p className="text-sm text-primary font-medium">
              {currentOption?.label || "Select an option"}
            </p>
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-black/60 backdrop-blur-lg border border-border shadow-lg rounded-xl overflow-hidden"
            style={{ transformOrigin: "top center" }}
          >
            <div className="max-h-48 overflow-y-auto">
              {config.options.map(option => (
                <motion.div
                  key={option.id}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-secondary/50 dark:hover:bg-white/10 ${
                    option.id === selectedOption ? "bg-primary/5 dark:bg-primary/20" : ""
                  }`}
                  onClick={() => handleOptionClick(option.id)}
                  whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm">
                    {option.label}
                  </span>
                  
                  {option.id === selectedOption && (
                    <Check size={16} className="text-primary" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrintConfigCard;
