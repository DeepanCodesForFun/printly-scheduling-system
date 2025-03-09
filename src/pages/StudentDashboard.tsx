
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Upload, Sliders, CreditCard, Send, ChevronRight, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUploader from "@/components/FileUploader";
import PrintConfigCard from "@/components/PrintConfigCard";

const printConfigs = [
  {
    id: "color",
    title: "Color Mode",
    options: [
      { id: "bw", label: "Black & White", value: "bw" },
      { id: "color", label: "Color", value: "color" }
    ]
  },
  {
    id: "sides",
    title: "Print Sides",
    options: [
      { id: "single", label: "Single-sided", value: "single" },
      { id: "double", label: "Double-sided", value: "double" }
    ]
  },
  {
    id: "pages",
    title: "Pages Per Sheet",
    options: [
      { id: "1", label: "1 Page", value: "1" },
      { id: "2", label: "2 Pages", value: "2" },
      { id: "4", label: "4 Pages", value: "4" }
    ]
  }
];

const StudentDashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    color: "bw",
    sides: "single",
    pages: "1"
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleConfigChange = (configId: string, optionId: string) => {
    setConfig(prev => ({
      ...prev,
      [configId]: optionId
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    
    // Scroll to top when changing steps
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    
    // Scroll to top when changing steps
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmitOrder = () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Your print request has been submitted!");
      
      // Reset form and go to step 1
      setFiles([]);
      setConfig({
        color: "bw",
        sides: "single",
        pages: "1"
      });
      setCurrentStep(1);
    }, 2000);
  };

  const calculatePrice = () => {
    let basePrice = 2; // Base price per page
    
    if (config.color === "color") {
      basePrice += 3; // Color adds 3 to the base price
    }
    
    if (config.sides === "double") {
      basePrice = basePrice * 0.8; // 20% discount for double-sided
    }
    
    if (config.pages !== "1") {
      basePrice = basePrice * 0.9; // 10% discount for multiple pages per sheet
    }
    
    const estimatedPages = files.length * 2; // Rough estimate
    
    return (basePrice * estimatedPages).toFixed(2);
  };

  // Steps data
  const steps = [
    { 
      number: 1, 
      title: "Upload Files", 
      icon: Upload,
      description: "Upload the documents you want to print"
    },
    { 
      number: 2, 
      title: "Configure", 
      icon: Sliders,
      description: "Set print options for your documents"
    },
    { 
      number: 3, 
      title: "Payment", 
      icon: CreditCard,
      description: "Complete your payment to submit the order"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Student Print Portal</h1>
              <p className="text-muted-foreground">Upload and configure your documents for printing</p>
            </motion.div>
          </div>
          
          {/* Steps Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {/* Line connector overlay */}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-muted z-0"></div>
              
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  {/* Step circle */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep === step.number
                        ? "bg-primary text-white"
                        : currentStep > step.number
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </motion.div>
                  
                  {/* Progress overlay */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute top-5 left-[50px] h-0.5 bg-primary z-0"
                      style={{ 
                        width: "calc(100% - 20px)", 
                        left: "calc(50% + 5px)",
                        transformOrigin: "left"
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: currentStep > step.number ? 1 : 0
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                  
                  {/* Step title */}
                  <motion.p
                    className={`mt-2 text-sm font-medium ${
                      currentStep === step.number ? "text-primary" : ""
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    {step.title}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-card dark:glass-card-dark rounded-2xl p-6 md:p-8 mb-8"
          >
            {/* Step 1: Upload Files */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Upload Your Documents</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Select files to upload. Supported formats: PDF, DOCX, JPG, PNG.
                </p>
                
                <FileUploader onFilesChange={handleFilesChange} />
              </div>
            )}
            
            {/* Step 2: Configure Options */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Configure Print Settings</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Customize how your documents will be printed.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  {printConfigs.map(configOption => (
                    <PrintConfigCard
                      key={configOption.id}
                      config={configOption}
                      selectedOption={config[configOption.id as keyof typeof config]}
                      onOptionSelect={handleConfigChange}
                    />
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                  <h3 className="font-medium mb-2">Print Summary</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Files:</span>
                    <span>{files.length} document(s)</span>
                    
                    <span className="text-muted-foreground">Color:</span>
                    <span>{config.color === "bw" ? "Black & White" : "Color"}</span>
                    
                    <span className="text-muted-foreground">Sides:</span>
                    <span>{config.sides === "single" ? "Single-sided" : "Double-sided"}</span>
                    
                    <span className="text-muted-foreground">Pages per sheet:</span>
                    <span>{config.pages}</span>
                    
                    <span className="text-muted-foreground">Estimated cost:</span>
                    <span className="font-semibold text-primary">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Payment</h2>
                </div>
                
                <div className="mb-6">
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6">
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {files.length} document(s), {config.color === "bw" ? "B&W" : "Color"}, {config.sides === "single" ? "Single-sided" : "Double-sided"}
                        </span>
                        <span>₹{calculatePrice()}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">₹{calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card dark:glass-card-dark rounded-xl p-6">
                    <h3 className="font-medium mb-4">Payment Method</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 border border-primary/30 rounded-lg">
                        <input type="radio" checked className="h-4 w-4 text-primary" readOnly />
                        <div className="ml-3">
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                        </div>
                      </div>
                      
                      <div className="p-6 border border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center">
                        <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg mb-4">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            alt="QR Code"
                            className="w-40 h-40 object-contain"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Scan this QR code to pay ₹{calculatePrice()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Navigation Buttons */}
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
