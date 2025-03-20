
import { Settings } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import PerFileConfigMockup from "@/components/file-uploader/PerFileConfigMockup";

const FileConfigMockupStep = () => {
  const { files } = usePrintOrder();

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold ml-3">Per-File Configuration Mockup</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        This is a mockup showing how individual file configuration might look. Each file can be configured separately.
      </p>
      
      <PerFileConfigMockup files={files} />
      
      <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
        <h3 className="font-medium mb-3">Benefits of Per-File Configuration</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Configure each document according to its specific needs</li>
          <li>Automatically group files with identical settings</li>
          <li>Save money by only using color printing where needed</li>
          <li>More precise control over your print job</li>
          <li>Clear cost breakdown per file</li>
        </ul>
      </div>
    </div>
  );
};

export default FileConfigMockupStep;
