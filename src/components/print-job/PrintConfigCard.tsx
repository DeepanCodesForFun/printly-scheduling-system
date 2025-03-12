
interface PrintConfigProps {
  config: {
    color: string;
    sides: string;
    copies: string;
  };
}

const PrintConfigCard = ({ config }: PrintConfigProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Print Configuration</h3>
      <div className="glass-card dark:glass-card-dark rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Color</p>
            <p className="font-medium">{config.color}</p>
          </div>
          <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Sides</p>
            <p className="font-medium">{config.sides}</p>
          </div>
          <div className="text-center p-3 bg-secondary/80 dark:bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Copies</p>
            <p className="font-medium">{config.copies}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintConfigCard;
