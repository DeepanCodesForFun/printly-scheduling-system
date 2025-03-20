
import { Upload } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { usePrintOrder } from "@/contexts/PrintOrderContext";

const FileUploadStep = () => {
  const { handleFilesChange } = usePrintOrder();

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold ml-3">Upload Your Documents</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Select PDF files to upload.
      </p>
      
      <FileUploader onFilesChange={handleFilesChange} />
    </div>
  );
};

export default FileUploadStep;
