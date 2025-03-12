
import { Link, useLocation } from "react-router-dom";
import { Printer, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", (!isDarkMode).toString());
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="w-full py-4 px-6 md:px-12 lg:px-24 backdrop-blur-lg bg-white/80 dark:bg-black/30 fixed top-0 z-50 relative">
      {/* Glowing border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent shadow-[0_0_8px_1px_hsl(var(--primary))]"></div>
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Printer className="h-6 w-6 text-xerox-blue" />
            <span className="font-semibold text-xl tracking-tight">AXMS</span>
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-6">
          {location.pathname !== "/" && (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:block"
              >
                <Link 
                  to="/" 
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </motion.div>
              
              {location.pathname === "/student" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden md:block"
                >
                  <Link 
                    to="/staff" 
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Staff Portal
                  </Link>
                </motion.div>
              )}
              
              {location.pathname === "/staff" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden md:block"
                >
                  <Link 
                    to="/student" 
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Student Portal
                  </Link>
                </motion.div>
              )}
            </>
          )}
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
