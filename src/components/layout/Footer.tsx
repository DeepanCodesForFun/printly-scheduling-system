
import { Printer, Github } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24 mt-auto border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Printer className="h-5 w-5 text-xerox-blue" />
          <span className="font-medium text-sm">AXMS &copy; {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
          <span className="text-xs text-muted-foreground">
            Automated Xerox Management System
          </span>
          
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
