
import { CreditCard } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import PaymentSection from "./PaymentSection";

const StudentInfoStep = () => {
  const { 
    studentName, 
    setStudentName, 
    studentId, 
    setStudentId, 
    additionalDetails,
    setAdditionalDetails,
    calculatePrice,
    totalPages,
    files,
    config
  } = usePrintOrder();

  return (
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
        
        <PaymentSection amount={calculatePrice()} />
      </div>
    </div>
  );
};

export default StudentInfoStep;
