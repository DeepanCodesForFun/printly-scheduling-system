
import { FileText, File } from "lucide-react";
import { formatFileSize } from "@/utils/formatUtils";

interface FilesListProps {
  files: {
    name: string;
    type: string;
    size: number;
    path?: string;
  }[];
}

const FilesList = ({ files }: FilesListProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Files ({files.length})</h3>
      <div className="glass-card dark:glass-card-dark rounded-xl p-4 max-h-[250px] overflow-y-auto">
        <div className="space-y-2">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="flex items-center p-2.5 bg-secondary/50 dark:bg-secondary/20 rounded-lg"
            >
              <div className="p-1.5 bg-primary/10 rounded-md mr-3">
                {file.type === "pdf" ? (
                  <FileText size={16} className="text-primary" />
                ) : (
                  <File size={16} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilesList;
