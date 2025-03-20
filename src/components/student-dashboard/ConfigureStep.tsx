
import { Settings } from "lucide-react";
import { usePrintOrder } from "@/contexts/PrintOrderContext";
import PrintConfigCard from "@/components/PrintConfigCard";
import { printConfigs } from "@/constants/printConfig";

const ConfigureStep = () => {
  const { config, handleConfigChange, totalPages, files, calculatePrice } = usePrintOrder();

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold ml-3">Configure Print Settings</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Customize how your documents will be printed.
      </p>
      
      <div className="grid sm:grid-cols-3 gap-4">
        {printConfigs.map(configOption => (
          <PrintConfigCard
            key={configOption.id}
            config={configOption}
            selectedOption={config[configOption.id as keyof typeof config]}
            onOptionSelect={handleConfigChange}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
        <h3 className="font-medium mb-2">Print Summary</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Files:</span>
          <span>{files.length} document(s)</span>
          
          <span className="text-muted-foreground">Total Pages:</span>
          <span>{totalPages} page(s)</span>
          
          <span className="text-muted-foreground">Color:</span>
          <span>{config.color === "bw" ? "Black & White" : "Color"}</span>
          
          <span className="text-muted-foreground">Sides:</span>
          <span>{config.sides === "single" ? "Single-sided" : "Double-sided"}</span>
          
          <span className="text-muted-foreground">Copies:</span>
          <span>{config.copies}</span>
          
          <span className="text-muted-foreground">Estimated cost:</span>
          <span className="font-semibold text-primary">₹{calculatePrice()}</span>
        </div>
      </div>
    </div>
  );
};

export default ConfigureStep;
