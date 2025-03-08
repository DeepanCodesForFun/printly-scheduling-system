
import { motion } from "framer-motion";

interface AnimatedPageTransitionProps {
  children: React.ReactNode;
}

const AnimatedPageTransition = ({ children }: AnimatedPageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPageTransition;
