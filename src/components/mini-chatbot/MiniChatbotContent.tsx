
import React, { useState } from "react";
import { Calendar, Users, School, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Department = "learning-coach" | "department" | "administration";
type Stage = "initial" | "department-selection" | "selection-list" | "booking" | "confirmation";

// Sample data for learning coaches
const learningCoaches = [
  { id: 1, name: "Dr. Amina Diallo", course: "Leadership Development" },
  { id: 2, name: "Prof. Kwame Osei", course: "Entrepreneurship" },
  { id: 3, name: "Dr. Fatima Nkosi", course: "Data Science" },
  { id: 4, name: "Prof. Thabo Mbeki", course: "African Political History" },
  { id: 5, name: "Dr. Zainab Ahmed", course: "Global Health" },
  { id: 6, name: "Prof. Nelson Mandela", course: "Social Justice" },
  { id: 7, name: "Dr. Chinua Achebe", course: "African Literature" },
  { id: 8, name: "Prof. Wangari Maathai", course: "Environmental Studies" },
  { id: 9, name: "Dr. Ngozi Okonjo-Iweala", course: "Economics" },
  { id: 10, name: "Prof. Chimamanda Adichie", course: "Creative Writing" },
  { id: 11, name: "Dr. Kofi Annan", course: "International Relations" },
  { id: 12, name: "Prof. Fred Swaniker", course: "Leadership" },
  { id: 13, name: "Dr. Stella Nkomo", course: "Business Management" },
  { id: 14, name: "Prof. Thandika Mkandawire", course: "Development Economics" },
  { id: 15, name: "Dr. Mercy Tembon", course: "Education Policy" },
  { id: 16, name: "Prof. Ali Mazrui", course: "African Politics" },
  { id: 17, name: "Dr. Nkosazana Dlamini-Zuma", course: "Public Health" },
  { id: 18, name: "Prof. Mahmood Mamdani", course: "Political Science" },
  { id: 19, name: "Dr. Akinwumi Adesina", course: "Agricultural Economics" },
  { id: 20, name: "Prof. Calestous Juma", course: "Innovation Studies" }
];

// Sample data for departments
const departments = [
  { id: 1, name: "Computer Science Department", head: "Prof. Ada Obi" },
  { id: 2, name: "Business School", head: "Dr. James Mwangi" },
  { id: 3, name: "Global Challenges", head: "Prof. Graça Machel" },
  { id: 4, name: "Entrepreneurship", head: "Dr. Ashish Thakkar" },
  { id: 5, name: "Engineering", head: "Prof. Venansius Baryamureeba" }
];

// Sample data for administration
const administrationOffices = [
  { id: 1, name: "Registrar's Office", contact: "registrar@alu.edu" },
  { id: 2, name: "Financial Aid", contact: "finaid@alu.edu" },
  { id: 3, name: "Student Affairs", contact: "studentaffairs@alu.edu" },
  { id: 4, name: "Career Development", contact: "careers@alu.edu" },
  { id: 5, name: "International Student Services", contact: "international@alu.edu" }
];

export const MiniChatbotContent = () => {
  const [stage, setStage] = useState<Stage>("initial");
  const [department, setDepartment] = useState<Department | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const handleDepartmentSelect = (dept: Department) => {
    setDepartment(dept);
    setStage("selection-list");
  };

  const handlePersonSelect = (person: any) => {
    setSelectedPerson(person);
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
    setSelectedPerson(null);
  };

  const goBack = () => {
    if (stage === "selection-list") {
      setStage("initial");
      setDepartment(null);
    } else if (stage === "department-selection") {
      setStage("selection-list");
      setSelectedPerson(null);
    }
  };

  // Example available times
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  // Function to open calendar in new tab (simulated)
  const openCalendar = (person: any) => {
    handlePersonSelect(person);
    // In a real implementation, this would redirect to an actual calendar page
    console.log(`Opening calendar for ${person.name}`);
  };

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

        {stage === "selection-list" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={goBack}>
                <ChevronLeft size={16} />
              </Button>
              <h3 className="text-sm font-medium">
                {department === "learning-coach" && "Select a Learning Coach"}
                {department === "department" && "Select a Department"}
                {department === "administration" && "Select an Administrative Office"}
              </h3>
            </div>
            
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {department === "learning-coach" && learningCoaches.map((coach) => (
                  <Button
                    key={coach.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => openCalendar(coach)}
                  >
                    <div className="font-medium text-left">{coach.name}</div>
                    <div className="text-xs text-muted-foreground text-left">{coach.course}</div>
                  </Button>
                ))}
                
                {department === "department" && departments.map((dept) => (
                  <Button
                    key={dept.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => openCalendar(dept)}
                  >
                    <div className="font-medium text-left">{dept.name}</div>
                    <div className="text-xs text-muted-foreground text-left">Head: {dept.head}</div>
                  </Button>
                ))}
                
                {department === "administration" && administrationOffices.map((office) => (
                  <Button
                    key={office.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => openCalendar(office)}
                  >
                    <div className="font-medium text-left">{office.name}</div>
                    <div className="text-xs text-muted-foreground text-left">{office.contact}</div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {stage === "department-selection" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={goBack}>
                <ChevronLeft size={16} />
              </Button>
              <h3 className="text-sm font-medium">
                {selectedPerson && selectedPerson.name}
              </h3>
            </div>
            
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
              <Button variant="outline" size="sm" onClick={goBack}>
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
              {selectedPerson && ` ${selectedPerson.name}`}
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
