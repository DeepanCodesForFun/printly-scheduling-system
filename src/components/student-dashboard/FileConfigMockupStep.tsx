
import { Settings } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import PerFileConfig from "@/components/file-uploader/PerFileConfig";

const FileConfigMockupStep = () => {
  const { files } = usePrintOrder();

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold ml-3">Configure Each File</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        You can configure each document individually or apply the same settings to all files.
      </p>
      
      <PerFileConfig files={files} />
    </div>
  );
};

export default FileConfigMockupStep;
