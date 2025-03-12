
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  unit: string;
  delay?: number;
}

const StatsCard = ({ icon: Icon, title, value, unit, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      className="glass-card dark:glass-card-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="flex items-center mb-4">
        <div className="p-2.5 bg-primary/10 rounded-full mr-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground ml-2">{unit}</span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
