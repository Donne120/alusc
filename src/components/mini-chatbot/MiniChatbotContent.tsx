import React, { useState } from "react";
import { toast } from "sonner";
import { Stage, Department, Person, ChatMessage, EmailTemplate } from "./types";
import { InitialStage } from "./InitialStage";
import { SelectionListStage } from "./SelectionListStage";
import { BookingStage } from "./BookingStage";
import { ConfirmationStage } from "./ConfirmationStage";
import { HumanChatStage } from "./HumanChatStage";
import { HumanChatActiveStage } from "./HumanChatActiveStage";
import { EmailInquiryStage } from "./EmailInquiryStage";
import { EmailSentStage } from "./EmailSentStage";
import { emailTemplates } from "./mockData";

export const MiniChatbotContent = () => {
  const [stage, setStage] = useState<Stage>("initial");
  const [department, setDepartment] = useState<Department | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Hi there! I'm a support representative. How can I help you today?", isUser: false }
  ]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Person | null>(null);
  const [humanChatInput, setHumanChatInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const handleDepartmentSelect = (dept: Department) => {
    setDepartment(dept);
    setStage("selection-list");
  };

  const handlePersonSelect = (person: Person) => {
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

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4">
        {stage === "initial" && (
          <InitialStage 
            onDepartmentSelect={handleDepartmentSelect}
            onStageChange={setStage}
          />
        )}

        {stage === "selection-list" && department && (
          <SelectionListStage 
            department={department}
            onPersonSelect={handlePersonSelect}
            onGoBack={goBack}
          />
        )}

        {stage === "department-selection" && selectedPerson && (
          <BookingStage 
            selectedPerson={selectedPerson}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            message={message}
            isLoading={isLoading}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onMessageChange={setMessage}
            onBooking={handleBooking}
            onGoBack={goBack}
          />
        )}

        {stage === "confirmation" && selectedPerson && (
          <ConfirmationStage 
            selectedPerson={selectedPerson}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onReset={resetChat}
          />
        )}

        {stage === "human-chat" && (
          <HumanChatStage 
            onPersonSelect={(person) => {
              setSelectedPerson(person);
              setStage("human-chat-active");
            }}
            onGoBack={goBack}
          />
        )}

        {stage === "human-chat-active" && selectedPerson && (
          <HumanChatActiveStage 
            selectedPerson={selectedPerson}
            chatMessages={chatMessages}
            humanChatInput={humanChatInput}
            isLoading={isLoading}
            onInputChange={setHumanChatInput}
            onSendMessage={sendHumanChatMessage}
            onGoBack={goBack}
          />
        )}

        {stage === "email-inquiry" && (
          <EmailInquiryStage 
            selectedDepartment={selectedDepartment}
            emailSubject={emailSubject}
            emailBody={emailBody}
            selectedTemplate={selectedTemplate}
            isLoading={isLoading}
            onDepartmentSelect={setSelectedDepartment}
            onTemplateSelect={handleTemplateSelect}
            onSubjectChange={setEmailSubject}
            onBodyChange={setEmailBody}
            onSendEmail={sendEmailInquiry}
            onGoBack={goBack}
          />
        )}

        {stage === "email-sent" && selectedDepartment && (
          <EmailSentStage 
            selectedDepartment={selectedDepartment}
            onReset={resetChat}
          />
        )}
      </div>
    </div>
  );
};
