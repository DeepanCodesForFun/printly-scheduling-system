
import { useFileUpload } from "./hooks/useFileUpload";
import DropZone from "./DropZone";
import FileList from "./FileList";

interface FileUploaderProps {
  onFilesChange: (files: File[], totalPages?: number) => void;
}

const FileUploader = ({ onFilesChange }: FileUploaderProps) => {
  const {
    uploadedFiles,
    totalPages,
    isCountingPages,
    handleFileSelect,
    removeFile
  } = useFileUpload({ onFilesChange });

  return (
    <div className="w-full space-y-4">
      <DropZone onFileSelect={handleFileSelect} />
      
      <FileList
        files={uploadedFiles}
        totalPages={totalPages}
        isCountingPages={isCountingPages}
        onRemoveFile={removeFile}
      />
    </div>
  );
};

export default FileUploader;
