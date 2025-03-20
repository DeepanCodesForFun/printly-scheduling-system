
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PrintOrderProvider } from "@/contexts/PrintOrderContext";
import StepProgress from "@/components/student-dashboard/StepProgress";
import StepContent from "@/components/student-dashboard/StepContent";
import StepNavigation from "@/components/student-dashboard/StepNavigation";

const StudentDashboard = () => {
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
          
          <PrintOrderProvider>
            <StepProgress />
            <StepContent />
            <StepNavigation />
          </PrintOrderProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
