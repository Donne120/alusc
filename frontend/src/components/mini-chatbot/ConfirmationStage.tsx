
import React from "react";
import { Button } from "../ui/button";
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { Person } from "./types";

interface ConfirmationStageProps {
  selectedPerson: Person;
  selectedDate: string;
  selectedTime: string;
  onReset: () => void;
}

export const ConfirmationStage: React.FC<ConfirmationStageProps> = ({
  selectedPerson,
  selectedDate,
  selectedTime,
  onReset
}) => {
  // Parse the date string to a Date object
  const bookingDate = selectedDate ? new Date(selectedDate) : new Date();
  
  return (
    <div className="space-y-4 text-center">
      <div className="py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CalendarCheck className="h-6 w-6 text-green-600" />
        </div>
      </div>
      <h3 className="font-medium">Booking Confirmed!</h3>
      <div className="space-y-1">
        <p className="text-sm">
          Your appointment with {selectedPerson.name} has been booked for:
        </p>
        <p className="font-medium">
          {format(bookingDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        You will receive a calendar invitation shortly.
      </p>
      {selectedPerson.calendarLink && (
        <div className="pt-2">
          <a 
            href={selectedPerson.calendarLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm underline text-primary hover:text-primary/90"
          >
            View on Google Calendar
          </a>
        </div>
      )}
      <Button className="w-full" onClick={onReset}>
        Return to Menu
      </Button>
    </div>
  );
};
