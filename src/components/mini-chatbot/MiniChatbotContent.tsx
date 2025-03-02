
import React, { useState } from "react";
import { Calendar, Users, School, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Department = "learning-coach" | "department" | "administration";
type Stage = "initial" | "department-selection" | "booking" | "confirmation";

export const MiniChatbotContent = () => {
  const [stage, setStage] = useState<Stage>("initial");
  const [department, setDepartment] = useState<Department | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleDepartmentSelect = (dept: Department) => {
    setDepartment(dept);
    setStage("department-selection");
  };

  const handleBooking = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStage("confirmation");
    }, 1500);
  };

  const resetChat = () => {
    setStage("initial");
    setDepartment(null);
    setMessage("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Example available times
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4">
        {stage === "initial" && (
          <div className="space-y-4">
            <p className="text-center text-sm">Who would you like to connect with?</p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="flex justify-between"
                onClick={() => handleDepartmentSelect("learning-coach")}
              >
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Learning Coach
                </span>
                <ArrowRight size={16} />
              </Button>
              <Button 
                variant="outline" 
                className="flex justify-between"
                onClick={() => handleDepartmentSelect("department")}
              >
                <span className="flex items-center gap-2">
                  <School size={16} />
                  Academic Department
                </span>
                <ArrowRight size={16} />
              </Button>
              <Button 
                variant="outline" 
                className="flex justify-between"
                onClick={() => handleDepartmentSelect("administration")}
              >
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Administration
                </span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {stage === "department-selection" && (
          <div className="space-y-4">
            <p className="text-sm">
              {department === "learning-coach" && "Book a session with your Learning Coach"}
              {department === "department" && "Book a session with your Department"}
              {department === "administration" && "Book a session with Administration"}
            </p>
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Select a date:</p>
              <Input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            {selectedDate && (
              <div className="space-y-2">
                <p className="text-xs font-medium">Available times:</p>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <div className="space-y-2">
                <p className="text-xs font-medium">Add a message (optional):</p>
                <Input
                  placeholder="What would you like to discuss?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetChat}>
                Back
              </Button>
              <Button 
                disabled={!selectedDate || !selectedTime || isLoading}
                size="sm"
                onClick={handleBooking}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Session"
                )}
              </Button>
            </div>
          </div>
        )}

        {stage === "confirmation" && (
          <div className="space-y-4 text-center">
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-medium">Booking Confirmed!</h3>
            <p className="text-sm">
              Your session has been booked with
              {department === "learning-coach" && " your Learning Coach"}
              {department === "department" && " the Academic Department"}
              {department === "administration" && " Administration"}
              {" on "}
              {new Date(selectedDate).toLocaleDateString()} at {selectedTime}.
            </p>
            <p className="text-xs text-muted-foreground">
              You will receive a confirmation email shortly.
            </p>
            <Button className="w-full" onClick={resetChat}>
              Book Another Session
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
