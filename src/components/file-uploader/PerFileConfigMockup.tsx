
import { motion } from "framer-motion";
import { File, Settings, FileText, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { printConfigs } from "@/constants/printConfig";

interface PerFileConfigMockupProps {
  files: File[];
}

const PerFileConfigMockup = ({ files }: PerFileConfigMockupProps) => {
  // This is just a mockup, so we'll use some dummy state
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  
  // Toggle expanded state for a file
  const toggleExpanded = (fileId: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

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
            Configure each file individually
          </span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {files.map((file, index) => (
          <Collapsible
            key={`${file.name}-${index}`}
            open={expandedFiles[`file-${index}`]}
            onOpenChange={() => toggleExpanded(`file-${index}`)}
            className="rounded-lg overflow-hidden"
          >
            <Card className="bg-white dark:bg-black/20 border-0">
              <div className="p-3 flex items-center justify-between group">
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
                
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center px-2 py-1">
                    <Settings size={14} className="mr-1 text-primary" />
                    <span className="text-xs">Configure</span>
                    {expandedFiles[`file-${index}`] ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <CardContent className="p-3 pt-0 bg-secondary/30 border-t dark:border-gray-700">
                  <div className="grid gap-2">
                    {printConfigs.map((config) => (
                      <div key={config.id} className="space-y-1">
                        <label className="text-xs font-medium">{config.title}</label>
                        <div className="flex flex-wrap gap-1">
                          {config.options.map((option) => (
                            <Button 
                              key={option.id} 
                              variant={option.id === "bw" ? "default" : "outline"} 
                              size="sm"
                              className="text-xs h-7 px-2"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-primary">₹30.00</span> for this file
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                    >
                      Reset to default
                    </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Files with identical settings are grouped together</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
          >
            Apply to all files
          </Button>
        </div>
        
        <div className="mt-3 border-t border-primary/20 pt-3">
          <div className="flex justify-between">
            <span className="text-sm">Total cost:</span>
            <span className="font-semibold text-primary">₹120.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerFileConfigMockup;
