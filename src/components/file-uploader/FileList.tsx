
import { AnimatePresence } from "framer-motion";
import { Check, AlertCircle, FileText } from "lucide-react";
import FileItem from "./FileItem";

interface FileListProps {
  files: File[];
  totalPages: number;
  isCountingPages: boolean;
  onRemoveFile: (index: number) => void;
}

const FileList = ({ files, totalPages, isCountingPages, onRemoveFile }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium flex items-center">
          <Check size={16} className="text-green-500 mr-2" />
          Uploaded Files ({files.length})
        </h4>
        
        <div className="flex items-center">
          <FileText size={16} className="text-primary mr-2" />
          <span className="text-sm font-medium">
            {isCountingPages ? (
              <span className="text-muted-foreground">Counting pages...</span>
            ) : (
              <span>Total Pages: <span className="text-primary">{totalPages}</span></span>
            )}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {files.map((file, index) => (
            <FileItem
              key={`${file.name}-${index}`}
              file={file}
              index={index}
              onRemove={onRemoveFile}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {files.length > 5 && (
        <div className="mt-3 flex items-center text-xs text-amber-500">
          <AlertCircle size={12} className="mr-1.5" />
          Large number of files may affect bundling performance
        </div>
      )}
    </div>
  );
};

export default FileList;
