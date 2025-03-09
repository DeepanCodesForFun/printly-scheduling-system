
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AnimatedPageTransition from "./components/AnimatedPageTransition";
import CursorParticles from "./components/CursorParticles";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <AnimatedPageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatedPageTransition>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CursorParticles />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
