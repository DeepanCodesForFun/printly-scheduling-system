
import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

interface DropZoneProps {
  onFileSelect: (files: FileList) => void;
}

const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files) {
      onFileSelect(event.dataTransfer.files);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging 
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-secondary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf"
      />
      
      <motion.div
        className="mb-4 text-primary/70"
        animate={{ 
          y: isDragging ? [-8, 0, -8] : 0
        }}
        transition={{ 
          duration: 1.5, 
          repeat: isDragging ? Infinity : 0,
          repeatType: "loop" 
        }}
      >
        <UploadCloud size={48} />
      </motion.div>
      
      <h3 className="text-lg font-medium mb-2">
        {isDragging ? "Drop files here" : "Drag and drop files here"}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 text-center">
        or <span className="text-primary">browse</span> to upload<br />
        (PDF files only)
      </p>
    </motion.div>
  );
};

export default DropZone;
