
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Person } from "./types";

interface BookingStageProps {
  selectedPerson: Person;
  onConfirm: (date: Date, time: string) => void;
  onBack: () => void;
}

const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const BookingStage: React.FC<BookingStageProps> = ({
  selectedPerson,
  onConfirm,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
    }
  };

  // Disable past dates and weekends
  const isDateDisabled = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const day = date.getDay();
    return date < now || day === 0 || day === 6; // Sunday or Saturday
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-medium text-center">Book with {selectedPerson.name}</h3>
        <p className="text-sm text-center text-muted-foreground">
          Select a date and time for your appointment
        </p>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={isDateDisabled}
        className="mx-auto"
      />

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Available Times:</p>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(time)}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-2 justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};
