import React, { useState } from "react";
import { Calendar, Users, School, ArrowRight, Loader2, ChevronLeft, Mail, HeadsetIcon, Send, FileText, AlertCircle, GraduationCap, Receipt, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Department = "learning-coach" | "department" | "administration";
type Stage = "initial" | "department-selection" | "selection-list" | "booking" | "confirmation" | "human-chat" | "email-inquiry" | "human-chat-active" | "email-sent";
type EmailTemplate = "general" | "assignment" | "finance" | "technical" | "academic" | "custom";

// Sample data for learning coaches
const learningCoaches = [
  { 
    id: 1, 
    name: "Mr. Marvin Muyonga Ogore", 
    course: "Machine Learning",
    calendarLink: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3IinSwaZGWuW1XZJAv7Mkiwokt8Pl_k1STcIWjMF_wXw5pzfY-SEECflnGm-2dhO7QAWFIOtcd"
  },
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
  { 
    id: 1, 
    name: "Computer Science Department", 
    head: "Prof. Ada Obi",
    calendarLink: "https://calendar.google.com/calendar/appointments"
  },
  { 
    id: 2, 
    name: "Business School", 
    head: "Dr. James Mwangi",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 3, 
    name: "Global Challenges", 
    head: "Prof. Graça Machel",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 4, 
    name: "Entrepreneurship", 
    head: "Dr. Ashish Thakkar",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 5, 
    name: "Engineering", 
    head: "Prof. Venansius Baryamureeba",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  }
];

// Sample data for administration
const administrationOffices = [
  { 
    id: 1, 
    name: "Registrar's Office", 
    contact: "registrar@alu.edu",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 2, 
    name: "Financial Aid", 
    contact: "finaid@alu.edu",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 3, 
    name: "Student Affairs", 
    contact: "studentaffairs@alu.edu",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 4, 
    name: "Career Development", 
    contact: "careers@alu.edu",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  },
  { 
    id: 5, 
    name: "International Student Services", 
    contact: "international@alu.edu",
    calendarLink: "https://calendar.google.com/calendar/appointments" 
  }
];

// Sample data for human chat agents
const chatAgents = [
  { id: 1, name: "Sarah Kimani", department: "Student Support", status: "Online" },
  { id: 2, name: "John Okafor", department: "Technical Support", status: "Online" },
  { id: 3, name: "Amina Hassan", department: "Admissions", status: "Away" },
];

// Email inquiry departments
const emailDepartments = [
  { id: 1, name: "General Inquiries", email: "info@alu.edu" },
  { id: 2, name: "Admissions", email: "admissions@alu.edu" },
  { id: 3, name: "Student Affairs", email: "studentaffairs@alu.edu" },
  { id: 4, name: "Financial Aid", email: "financial.aid@alu.edu" },
  { id: 5, name: "Technical Support", email: "itsupport@alu.edu" },
];

// Email templates
const emailTemplates = [
  {
    id: "general",
    name: "General Inquiry",
    icon: <HelpCircle size={16} />,
    subject: "General Inquiry - [Your Name]",
    body: "Dear [Department],\n\nMy name is [Your Name], a [Your Year/Program] student. I am writing to inquire about [Brief Description].\n\n[Your Question or Request]\n\nThank you for your assistance.\n\nBest regards,\n[Your Name]\n[Your Student ID]"
  },
  {
    id: "assignment",
    name: "Assignment Help",
    icon: <FileText size={16} />,
    subject: "Assignment Clarification - [Course Code]",
    body: "Dear Professor/Department,\n\nI am a student in [Course Name] (Course Code: [Course Code]). I am writing regarding the assignment due on [Due Date].\n\n[Specific Questions about Assignment]\n\nThank you for your guidance.\n\nBest regards,\n[Your Name]\n[Your Student ID]"
  },
  {
    id: "academic",
    name: "Academic Advising",
    icon: <GraduationCap size={16} />,
    subject: "Academic Advising Request - [Your Name]",
    body: "Dear Academic Advisor,\n\nI hope this email finds you well. I am [Your Name], a [Your Year/Program] student (ID: [Your Student ID]).\n\nI would like to request guidance on [Course Selection/Program Requirements/Career Planning].\n\n[Specific Details about Your Situation]\n\nWhen would be a good time to schedule a meeting to discuss this?\n\nThank you for your support.\n\nBest regards,\n[Your Name]"
  },
  {
    id: "finance",
    name: "Financial Aid",
    icon: <Receipt size={16} />,
    subject: "Financial Aid Inquiry - [Your Name]",
    body: "Dear Financial Aid Office,\n\nI am [Your Name], a [Your Year/Program] student (ID: [Your Student ID]).\n\nI am writing regarding [Scholarship/Tuition Payment/Financial Aid Application].\n\n[Specific Details about Your Financial Query]\n\nThank you for your assistance with this matter.\n\nBest regards,\n[Your Name]\n[Your Contact Information]"
  },
  {
    id: "technical",
    name: "Technical Support",
    icon: <AlertCircle size={16} />,
    subject: "Technical Support Request - [Brief Issue Description]",
    body: "Dear IT Support Team,\n\nI am experiencing technical difficulties with [System/Platform/Service].\n\nIssue Details:\n- Issue: [Brief Description]\n- When it started: [Date/Time]\n- Steps I've already taken: [Any troubleshooting steps]\n- Error messages: [Any error messages received]\n\nPlease advise on how to resolve this issue.\n\nThank you,\n[Your Name]\n[Your Student ID]\n[Your Contact Information]"
  },
  {
    id: "custom",
    name: "Custom Email",
    icon: <Mail size={16} />,
    subject: "",
    body: ""
  }
];

export const MiniChatbotContent = () => {
  const [stage, setStage] = useState<Stage>("initial");
  const [department, setDepartment] = useState<Department | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hi there! I'm a support representative. How can I help you today?", isUser: false }
  ]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [humanChatInput, setHumanChatInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const handleDepartmentSelect = (dept: Department) => {
    setDepartment(dept);
    setStage("selection-list");
  };

  const handlePersonSelect = (person: any) => {
    setSelectedPerson(person);
    
    // If person has a calendarLink, redirect to it
    if (person.calendarLink) {
      window.open(person.calendarLink, '_blank');
      return;
    }
    
    // Otherwise continue with the standard booking flow
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
    setChatMessages([
      { text: "Hi there! I'm a support representative. How can I help you today?", isUser: false }
    ]);
    setEmailSubject("");
    setEmailBody("");
    setSelectedDepartment(null);
    setHumanChatInput("");
  };

  const goBack = () => {
    if (stage === "selection-list") {
      setStage("initial");
      setDepartment(null);
    } else if (stage === "department-selection") {
      setStage("selection-list");
      setSelectedPerson(null);
    } else if (stage === "human-chat" || stage === "email-inquiry") {
      setStage("initial");
    } else if (stage === "human-chat-active") {
      setStage("human-chat");
    }
  };

  // Function to handle template selection
  const handleTemplateSelect = (templateId: EmailTemplate) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  // Function to handle sending a message in human chat
  const sendHumanChatMessage = () => {
    if (humanChatInput.trim() === "") return;
    
    // Add user message
    setChatMessages(prev => [...prev, { text: humanChatInput, isUser: true }]);
    setHumanChatInput("");
    
    // Simulate agent typing
    setIsLoading(true);
    
    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me check that for you.",
        "Thanks for providing that information. I'll help you resolve this issue.",
        "That's a great question. Here's what you need to know...",
        "I'm looking into this matter for you. Can you provide more details?",
        "Let me connect you with the appropriate department for further assistance."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      setIsLoading(false);
    }, 1500);
  };

  // Function to handle sending an email inquiry
  const sendEmailInquiry = () => {
    if (!selectedDepartment || !emailSubject || !emailBody) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      setStage("email-sent");
    }, 1500);
  };

  // Example available times
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4">
        {stage === "initial" && (
          <div className="space-y-4">
            <p className="text-center text-sm">How can we assist you today?</p>
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
              <Button 
                variant="outline" 
                className="flex justify-between"
                onClick={() => setStage("human-chat")}
              >
                <span className="flex items-center gap-2">
                  <HeadsetIcon size={16} />
                  Chat with a Human
                </span>
                <ArrowRight size={16} />
              </Button>
              <Button 
                variant="outline" 
                className="flex justify-between"
                onClick={() => setStage("email-inquiry")}
              >
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  Send an Email Inquiry
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
                    onClick={() => handlePersonSelect(coach)}
                  >
                    <div className="font-medium text-left">{coach.name}</div>
                    <div className="text-xs text-muted-foreground text-left">{coach.course}</div>
                    {coach.calendarLink && (
                      <div className="text-xs text-blue-500 mt-1">Click to book office hours</div>
                    )}
                  </Button>
                ))}
                
                {department === "department" && departments.map((dept) => (
                  <Button
                    key={dept.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => handlePersonSelect(dept)}
                  >
                    <div className="font-medium text-left">{dept.name}</div>
                    <div className="text-xs text-muted-foreground text-left">Head: {dept.head}</div>
                    {dept.calendarLink && (
                      <div className="text-xs text-blue-500 mt-1">Click to book department consultation</div>
                    )}
                  </Button>
                ))}
                
                {department === "administration" && administrationOffices.map((office) => (
                  <Button
                    key={office.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => handlePersonSelect(office)}
                  >
                    <div className="font-medium text-left">{office.name}</div>
                    <div className="text-xs text-muted-foreground text-left">{office.contact}</div>
                    {office.calendarLink && (
                      <div className="text-xs text-blue-500 mt-1">Click to book an appointment</div>
                    )}
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

        {/* Human Chat Agent Selection */}
        {stage === "human-chat" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={goBack}>
                <ChevronLeft size={16} />
              </Button>
              <h3 className="text-sm font-medium">Select an Agent to Chat With</h3>
            </div>
            
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {chatAgents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant="outline"
                    className="w-full justify-start flex-col items-start p-3 h-auto"
                    onClick={() => {
                      setSelectedPerson(agent);
                      setStage("human-chat-active");
                    }}
                    disabled={agent.status === "Away"}
                  >
                    <div className="font-medium text-left flex items-center gap-2">
                      {agent.name}
                      <span className={`w-2 h-2 rounded-full ${agent.status === "Online" ? "bg-green-500" : "bg-amber-500"}`}></span>
                    </div>
                    <div className="text-xs text-muted-foreground text-left">{agent.department}</div>
                    <div className="text-xs text-muted-foreground text-left">Status: {agent.status}</div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Active Human Chat */}
        {stage === "human-chat-active" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={goBack}>
                <ChevronLeft size={16} />
              </Button>
              <h3 className="text-sm font-medium">
                Chat with {selectedPerson?.name}
              </h3>
            </div>
            
            <ScrollArea className="h-48 pr-4 mb-2">
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                      msg.isUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-3 py-2 bg-secondary text-secondary-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                value={humanChatInput}
                onChange={(e) => setHumanChatInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendHumanChatMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                size="sm"
                onClick={sendHumanChatMessage}
                disabled={!humanChatInput.trim() || isLoading}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Email Inquiry Form with Templates */}
        {stage === "email-inquiry" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={goBack}>
                <ChevronLeft size={16} />
              </Button>
              <h3 className="text-sm font-medium">Send Email Inquiry</h3>
            </div>
            
            <div className="space-y-3">
              {/* Email Templates Section */}
              <div>
                <p className="text-xs font-medium mb-1">Choose a Template:</p>
                <ScrollArea className="h-24 pr-4 mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    {emailTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-auto py-2"
                        onClick={() => handleTemplateSelect(template.id as EmailTemplate)}
                      >
                        <span className="flex items-center gap-1">
                          {template.icon}
                          <span className="text-xs">{template.name}</span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-1">Select Department:</p>
                <ScrollArea className="h-24 pr-4">
                  <div className="space-y-2">
                    {emailDepartments.map((dept) => (
                      <Button
                        key={dept.id}
                        variant={selectedDepartment?.id === dept.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-between text-left h-auto py-2"
                        onClick={() => setSelectedDepartment(dept)}
                      >
                        <span>{dept.name}</span>
                        <span className="text-xs text-muted-foreground">{dept.email}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <p className="text-xs font-medium mb-1">Subject:</p>
                <Input
                  placeholder="Enter subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              
              <div>
                <p className="text-xs font-medium mb-1">Message:</p>
                <Textarea
                  placeholder="Type your message here..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Replace [bracketed text] with your specific information.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={goBack}>
                Back
              </Button>
              <Button 
                size="sm"
                onClick={sendEmailInquiry}
                disabled={!selectedDepartment || !emailSubject || !emailBody || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Email Sent Confirmation */}
        {stage === "email-sent" && (
          <div className="space-y-4 text-center">
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="font-medium">Email Sent Successfully!</h3>
            <p className="text-sm">
              Your inquiry has been sent to {selectedDepartment?.name} ({selectedDepartment?.email}).
            </p>
            <p className="text-xs text-muted-foreground">
              You should receive a response within 24-48 hours.
            </p>
            <Button className="w-full" onClick={resetChat}>
              Return to Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
