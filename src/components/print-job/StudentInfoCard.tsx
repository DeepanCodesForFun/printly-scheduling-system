
import { User, Calendar, Clock } from "lucide-react";
import { formatTime } from "@/utils/formatUtils";

interface StudentInfoCardProps {
  studentName: string;
  studentId: string;
  timestamp: string;
  amount: number;
}

const StudentInfoCard = ({ 
  studentName, 
  studentId, 
  timestamp, 
  amount 
}: StudentInfoCardProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Student Information</h3>
      <div className="glass-card dark:glass-card-dark rounded-xl p-4 mb-6">
        <div className="flex items-center mb-4">
          <div className="p-2.5 bg-primary/10 rounded-full mr-3">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{studentName}</p>
            <p className="text-sm text-muted-foreground">ID: {studentId}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>{formatTime(timestamp)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span>₹{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentInfoCard;
