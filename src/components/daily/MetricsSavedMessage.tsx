
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";

interface MetricsSavedMessageProps {
  selectedDate: Date;
  onEdit: () => void;
}

export function MetricsSavedMessage({ selectedDate, onEdit }: MetricsSavedMessageProps) {
  const today = new Date();
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] animate-fade-in">
      <div className="text-lg font-semibold mb-4 text-green-600">
        {isSameDay(selectedDate, today)
          ? "Great job! Your metrics for today have been saved."
          : `Great job! Your metrics for ${format(selectedDate, "PPP")} have been saved.`}
      </div>
      <Button onClick={onEdit} size="lg" variant="outline">
        Change Daily Metrics
      </Button>
    </div>
  );
}
