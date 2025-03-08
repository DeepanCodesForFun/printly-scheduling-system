
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface RoleButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  delay?: number;
}

const RoleButton = ({ title, description, icon: Icon, to, delay = 0 }: RoleButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={to} className="block">
        <motion.div 
          className="glass-card dark:glass-card-dark w-full md:w-64 lg:w-72 h-72 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group"
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative mb-6">
            <motion.div
              className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <div className="relative">
              <motion.div
                className="p-4 bg-white dark:bg-black/40 rounded-full border border-slate-200 dark:border-slate-700"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Icon className="h-10 w-10 text-primary" />
              </motion.div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          
          <motion.div 
            className="w-12 h-12 flex items-center justify-center mt-6 bg-primary/10 dark:bg-primary/20 rounded-full"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 115, 230, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              className="w-5 h-5 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default RoleButton;
