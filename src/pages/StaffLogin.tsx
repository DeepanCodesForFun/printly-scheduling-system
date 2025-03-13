
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const STAFF_CREDENTIALS = {
  loginId: "management",
  password: "iem@xerox"
};

const StaffLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      if (loginId === STAFF_CREDENTIALS.loginId && password === STAFF_CREDENTIALS.password) {
        // Set authenticated state in localStorage
        localStorage.setItem("staffAuthenticated", "true");
        toast.success("Login successful", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        });
        navigate("/staff");
      } else {
        setError("Invalid login ID or password");
        toast.error("Login failed", {
          icon: <AlertCircle className="h-4 w-4 text-destructive" />
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 lg:px-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Printer className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Staff Login</h1>
            <p className="text-muted-foreground">Access the Xerox Management Portal</p>
          </div>
          
          <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
            <form onSubmit={handleLogin} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="loginId" className="text-sm font-medium">
                  Login ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="loginId"
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full bg-background border border-input rounded-md pl-10 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Enter your login ID"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-input rounded-md pl-10 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">{error}</span>
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 button-glow relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div 
                    className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  "Sign In"
                )}
              </motion.button>
              
              <div className="text-center pt-2">
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Return to Home
                </a>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Looking for the student portal?{" "}
              <a href="/student" className="text-primary hover:underline">
                Student Dashboard
              </a>
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StaffLogin;
