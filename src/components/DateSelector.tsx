import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-card rounded-lg border shadow-soft">
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPreviousDay}
        className="hover:bg-primary-soft hover:text-primary transition-all duration-smooth"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-xl font-semibold hover:bg-primary-soft hover:text-primary transition-all duration-smooth"
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              {format(selectedDate, "EEEE, MMMM do")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {!isToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-smooth"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={goToNextDay}
        className="hover:bg-primary-soft hover:text-primary transition-all duration-smooth"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};