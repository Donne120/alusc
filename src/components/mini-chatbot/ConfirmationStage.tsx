
import React from "react";
import { Button } from "../ui/button";

interface ConfirmationStageProps {
  onNext: () => void;
  onBack: () => void;
}

export const ConfirmationStage: React.FC<ConfirmationStageProps> = ({
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Confirm Details</h3>
      <p className="text-sm">
        Please confirm your appointment details. This is a placeholder component.
      </p>
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          Confirm
        </Button>
      </div>
    </div>
  );
};
