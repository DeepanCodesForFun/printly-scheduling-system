
import { motion } from "framer-motion";
import { File, Settings, FileText, Check, ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { printConfigs } from "@/constants/printConfig";
import { usePrintOrder } from "@/contexts/PrintOrderContext";

interface PerFileConfigProps {
  files: File[];
}

const PerFileConfig = ({ files }: PerFileConfigProps) => {
  const { 
    handleFileConfigChange, 
    calculateFilePrice, 
    getConfigGroups, 
    applyConfigToAllFiles,
    resetFileConfig,
    fileConfigs,
    config
  } = usePrintOrder();
  
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  
  // Toggle expanded state for a file
  const toggleExpanded = (fileId: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  if (files.length === 0) return null;

  // Get configuration groups
  const configGroups = getConfigGroups();
  
  // Calculate total price
  let totalPrice = 0;
  files.forEach((_, index) => {
    totalPrice += parseFloat(calculateFilePrice(index));
  });

  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium flex items-center">
          <Check size={16} className="text-green-500 mr-2" />
          Configure Files ({files.length})
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
                    {printConfigs.map((configOption) => (
                      <div key={configOption.id} className="space-y-1">
                        <label className="text-xs font-medium">{configOption.title}</label>
                        <div className="flex flex-wrap gap-1">
                          {configOption.options.map((option) => {
                            // Get current value for this option
                            const currentValue = fileConfigs[index] 
                              ? fileConfigs[index][configOption.id as keyof typeof fileConfigs[typeof index]]
                              : config[configOption.id as keyof typeof config];
                            
                            return (
                              <Button 
                                key={option.id} 
                                variant={option.id === currentValue ? "default" : "outline"} 
                                size="sm"
                                className="text-xs h-7 px-2"
                                onClick={() => handleFileConfigChange(index, configOption.id, option.id)}
                              >
                                {option.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-primary">₹{calculateFilePrice(index)}</span> for this file
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => resetFileConfig(index)}
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
          <span className="text-sm font-medium flex items-center">
            <ListChecks size={14} className="mr-2 text-primary" />
            Files with identical settings are grouped together
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
            onClick={() => applyConfigToAllFiles(config)}
          >
            Apply to all files
          </Button>
        </div>
        
        {configGroups.length > 0 && (
          <div className="mt-3 space-y-2">
            {configGroups.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="text-xs p-2 bg-white/50 dark:bg-black/20 rounded-md">
                <div className="flex justify-between">
                  <span>
                    <span className="font-medium">{group.files.length} {group.files.length === 1 ? 'file' : 'files'}</span> with:
                  </span>
                  <span>
                    {group.config.color === 'bw' ? 'B&W' : 'Color'}, 
                    {group.config.sides === 'single' ? ' Single' : ' Double'}, 
                    {group.config.copies} {parseInt(group.config.copies) > 1 ? 'copies' : 'copy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 border-t border-primary/20 pt-3">
          <div className="flex justify-between">
            <span className="text-sm">Total cost:</span>
            <span className="font-semibold text-primary">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerFileConfig;
