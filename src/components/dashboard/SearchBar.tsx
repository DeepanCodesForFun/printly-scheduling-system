
import { Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  resultCount: number;
}

const SearchBar = ({ searchTerm, onSearchChange, onRefresh, isLoading, resultCount }: SearchBarProps) => {
  return (
    <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Print Queue</h2>
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} request{resultCount !== 1 ? "s" : ""}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="pl-9 pr-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <motion.button
          className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>
    </div>
  );
};

export default SearchBar;
