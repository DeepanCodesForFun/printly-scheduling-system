import { useState, useRef } from "react";
import { UploadCloud, File, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const FileUploader = ({ onFilesChange }: FileUploaderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (validFiles.length !== newFiles.length) {
        toast.error("Only PDF files are allowed");
      }
      
      if (validFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...validFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    }
  };

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
      const newFiles = Array.from(event.dataTransfer.files);
      const validFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (validFiles.length !== newFiles.length) {
        toast.error("Only PDF files are allowed");
      }
      
      if (validFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...validFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
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
      
      {uploadedFiles.length > 0 && (
        <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Check size={16} className="text-green-500 mr-2" />
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
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
                      removeFile(index);
                    }}
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {uploadedFiles.length > 5 && (
            <div className="mt-3 flex items-center text-xs text-amber-500">
              <AlertCircle size={12} className="mr-1.5" />
              Large number of files may affect bundling performance
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
