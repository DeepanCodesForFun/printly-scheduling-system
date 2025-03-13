
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface RoleButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  delay?: number;
}

const RoleButton = ({ title, description, icon: Icon, to, delay = 0 }: RoleButtonProps) => {
  // Adjust the path for staff portal to go to login
  const adjustedPath = to === "/staff" ? "/staff-login" : to;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="glass-card dark:glass-card-dark w-72 p-6 rounded-xl space-y-4 cursor-pointer"
    >
      <Link to={adjustedPath} className="block">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-4 button-glow overflow-hidden">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default RoleButton;
