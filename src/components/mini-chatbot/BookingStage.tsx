
import React from "react";
import { Button } from "../ui/button";

interface BookingStageProps {
  onNext: () => void;
  onBack: () => void;
}

export const BookingStage: React.FC<BookingStageProps> = ({
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Book Appointment</h3>
      <p className="text-sm">
        This is a placeholder for the booking functionality. You can customize this component.
      </p>
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};
