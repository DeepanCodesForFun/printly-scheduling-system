
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Upload, Sliders, CreditCard, Send, ChevronRight, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FileUploader from "@/components/FileUploader";
import PrintConfigCard from "@/components/PrintConfigCard";
import { createPrintOrder } from "@/services/printOrderService";

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
    id: "copies",
    title: "No of Copies",
    options: [
      { id: "1", label: "1 Copy", value: "1" },
      { id: "2", label: "2 Copies", value: "2" },
      { id: "3", label: "3 Copies", value: "3" },
      { id: "4", label: "4 Copies", value: "4" },
      { id: "5", label: "5 Copies", value: "5" },
      { id: "6", label: "6 Copies", value: "6" },
      { id: "7", label: "7 Copies", value: "7" },
      { id: "8", label: "8 Copies", value: "8" },
      { id: "9", label: "9 Copies", value: "9" },
      { id: "10", label: "10 Copies", value: "10" },
      
    ]
  }
];

const StudentDashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    color: "bw",
    sides: "single",
    copies: "1"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleFilesChange = (newFiles: File[], newTotalPages?: number) => {
    setFiles(newFiles);
    if (newTotalPages !== undefined) {
      setTotalPages(newTotalPages);
    }
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
    
    if (currentStep === 3 && (!studentName || !studentId)) {
      toast.error("Please enter your name and student ID");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmitOrder = async () => {
    if (!studentName || !studentId) {
      toast.error("Please enter your name and student ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      await createPrintOrder({
        studentName,
        studentId,
        files,
        config,
        amount: parseFloat(calculatePrice()),
        additionalDetails: additionalDetails.trim() || undefined
      });
      
      toast.success("Your print request has been submitted!");
      
      setFiles([]);
      setConfig({
        color: "bw",
        sides: "single",
        copies: "1"
      });
      setCurrentStep(1);
      setStudentName("");
      setStudentId("");
      setAdditionalDetails("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit print request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePrice = () => {
    let pricePerPage = 0;
    
    if (config.color === "bw") {
      pricePerPage = config.sides === "single" ? 3 : 5;
    } else { // color
      pricePerPage = config.sides === "single" ? 10 : 17;
    }
    
    const numCopies = parseInt(config.copies);
    
    const totalPrice = pricePerPage * totalPages * numCopies;
    
    return totalPrice.toFixed(2);
  };

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
      title: "Student Information", 
      icon: Settings,
      description: "Enter your name and student ID"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
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
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {steps[currentStep - 1].description}
            </p>
          </div>
          
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-card dark:glass-card-dark rounded-2xl p-6 md:p-8 mb-8"
          >
            {currentStep === 1 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Upload Your Documents</h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Select PDF files to upload.
                </p>
                
                <FileUploader onFilesChange={handleFilesChange} />
              </div>
            )}
            
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
                    
                    <span className="text-muted-foreground">Total Pages:</span>
                    <span>{totalPages} page(s)</span>
                    
                    <span className="text-muted-foreground">Color:</span>
                    <span>{config.color === "bw" ? "Black & White" : "Color"}</span>
                    
                    <span className="text-muted-foreground">Sides:</span>
                    <span>{config.sides === "single" ? "Single-sided" : "Double-sided"}</span>
                    
                    <span className="text-muted-foreground">Copies:</span>
                    <span>{config.copies}</span>
                    
                    <span className="text-muted-foreground">Estimated cost:</span>
                    <span className="font-semibold text-primary">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Student Information</h2>
                </div>
                
                <div className="mb-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Your Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full p-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Student ID</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full p-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Enter your IEM ID (e.g., 12023052016044)"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Additional Instructions <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <textarea
                        value={additionalDetails}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            setAdditionalDetails(e.target.value);
                          }
                        }}
                        className="w-full p-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[80px]"
                        placeholder="Enter binding instructions or other details (200 characters max)"
                        maxLength={200}
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-sm text-muted-foreground">
                          {additionalDetails.length}/200
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6">
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {files.length} document(s), {totalPages} page(s), {config.color === "bw" ? "B&W" : "Color"}, {config.sides === "single" ? "Single-sided" : "Double-sided"}, {config.copies} {parseInt(config.copies) > 1 ? "copies" : "copy"}
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
