
import { File, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileItemProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

const FileItem = ({ file, index, onRemove }: FileItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-black/20 rounded-lg p-3 flex items-center justify-between group"
    >
      <div className="flex items-center">
        <div className="p-2 bg-primary/10 rounded-md mr-3">
          <File size={16} className="text-primary" />
        </div>
        <div className="truncate">
          <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(0)} KB
          </p>
        </div>
      </div>
      
      <motion.button
        className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  );
};

export default FileItem;
