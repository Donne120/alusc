
import React, { useState } from "react";
import { ChatMessage, Stage, Department, Person, EmailTemplate } from "./types";
import { InitialStage } from "./InitialStage";
import { SelectionListStage } from "./SelectionListStage";
import { BookingStage } from "./BookingStage";
import { ConfirmationStage } from "./ConfirmationStage";
import { HumanChatStage } from "./HumanChatStage";
import { HumanChatActiveStage } from "./HumanChatActiveStage";
import { EmailInquiryStage } from "./EmailInquiryStage";
import { EmailSentStage } from "./EmailSentStage";
import { learningCoaches, departments, administrationOffices, chatAgents, emailDepartments, emailTemplates } from "./mockData";

export const MiniChatbotContent: React.FC = () => {
  const [stage, setStage] = useState<Stage>("initial");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hello! I'm your ALU Student Companion. How can I help you today?",
      isUser: false,
    },
  ]);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState<string>("");
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<EmailTemplate | null>(null);
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    
    // Add a message to show the selected department
    const departmentNames = {
      "learning-coach": "Learning Coach",
      "department": "Academic Department",
      "administration": "Administration",
    };
    addMessage(`I'd like to contact a ${departmentNames[department]}`, true);
    
    setStage("selection-list");
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    addMessage(`I want to speak with ${person.name}`, true);
    setStage("booking");
  };

  const handleBookingConfirm = (date: Date, time: string) => {
    setBookingDate(date);
    setBookingTime(time);
    addMessage(`I'd like to book an appointment on ${date.toDateString()} at ${time}`, true);
    setStage("confirmation");
  };

  const handleHumanChatSelect = () => {
    addMessage("I'd like to chat with a human agent", true);
    setStage("human-chat");
  };

  const handleChatAgentSelect = (agent: Person) => {
    setSelectedPerson(agent);
    addMessage(`Connecting to ${agent.name}...`, false);
    // Simulate a short delay before connecting
    setTimeout(() => setStage("human-chat-active"), 1000);
  };

  const handleEmailInquirySelect = () => {
    addMessage("I'd like to send an email inquiry", true);
    setStage("email-inquiry");
  };

  const handleEmailDepartmentSelect = (department: Person) => {
    setSelectedPerson(department);
    addMessage(`I'll send an email to ${department.name}`, true);
  };

  const handleEmailTemplateSelect = (template: EmailTemplate) => {
    setSelectedEmailTemplate(template);
    setEmailSubject(template.subject);
    setEmailBody(template.body);
  };

  const handleSendEmail = () => {
    // In a real app, we would send the email here
    addMessage(`Email sent to ${selectedPerson?.name}`, false);
    setStage("email-sent");
  };

  const handleSendMessage = (text: string) => {
    addMessage(text, true);
    
    // Simulate a response
    setTimeout(() => {
      addMessage("Thank you for your message. An agent will respond shortly.", false);
    }, 1000);
  };

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { text, isUser }]);
  };

  const handleReset = () => {
    // Go back to the initial stage and add a reset message
    setStage("initial");
    addMessage("How else can I help you today?", false);
  };

  // Determine which list of options to display based on the selected department
  const getSelectionList = () => {
    switch (selectedDepartment) {
      case "learning-coach":
        return learningCoaches;
      case "department":
        return departments;
      case "administration":
        return administrationOffices;
      default:
        return [];
    }
  };

  // Render appropriate stage based on current state
  const renderStageContent = () => {
    switch (stage) {
      case "initial":
        return (
          <InitialStage 
            onDepartmentSelect={handleDepartmentSelect}
            onHumanChatSelect={handleHumanChatSelect}
            onEmailInquirySelect={handleEmailInquirySelect}
          />
        );
      case "selection-list":
        return (
          <SelectionListStage 
            items={getSelectionList()}
            onSelect={handlePersonSelect}
            onBack={() => setStage("initial")}
            department={selectedDepartment}
          />
        );
      case "booking":
        return selectedPerson && (
          <BookingStage 
            selectedPerson={selectedPerson}
            onConfirm={handleBookingConfirm}
            onBack={() => setStage("selection-list")}
          />
        );
      case "confirmation":
        return bookingDate && selectedPerson && (
          <ConfirmationStage 
            selectedPerson={selectedPerson}
            bookingDate={bookingDate}
            bookingTime={bookingTime}
            onReset={handleReset}
          />
        );
      case "human-chat":
        return (
          <HumanChatStage 
            agents={chatAgents}
            onSelect={handleChatAgentSelect}
            onBack={() => setStage("initial")}
          />
        );
      case "human-chat-active":
        return selectedPerson && (
          <HumanChatActiveStage 
            agent={selectedPerson}
            messages={messages}
            onSendMessage={handleSendMessage}
            onEndChat={handleReset}
          />
        );
      case "email-inquiry":
        return (
          <EmailInquiryStage 
            departments={emailDepartments}
            templates={emailTemplates}
            selectedDepartment={selectedPerson}
            onDepartmentSelect={handleEmailDepartmentSelect}
            onTemplateSelect={handleEmailTemplateSelect}
            emailSubject={emailSubject}
            emailBody={emailBody}
            onSubjectChange={setEmailSubject}
            onBodyChange={setEmailBody}
            onSendEmail={handleSendEmail}
            onBack={() => setStage("initial")}
          />
        );
      case "email-sent":
        return selectedPerson && (
          <EmailSentStage 
            selectedDepartment={selectedPerson}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return <div className="px-1">{renderStageContent()}</div>;
};
