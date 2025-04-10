import React, { useState } from 'react';
import { InitialStage } from '../../components/mini-chatbot/InitialStage';
import { HumanChatStage } from '../../components/mini-chatbot/HumanChatStage';
import { SelectionListStage } from '../../components/mini-chatbot/SelectionListStage';
import { EmailInquiryStage } from '../../components/mini-chatbot/EmailInquiryStage';
import { BookingStage } from './BookingStage';
import { ConfirmationStage } from './ConfirmationStage';
import { HumanChatActiveStage } from '../../components/mini-chatbot/HumanChatActiveStage';
import { departments, resources, staff } from '../../components/mini-chatbot/mockData';
import { Person } from '../../components/mini-chatbot/types';
import { EmailSentStage } from './EmailSentStage';

interface MiniChatbotContentProps {
  onClose: () => void;
}

export const MiniChatbotContent: React.FC<MiniChatbotContentProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'initial' | 'humanChat' | 'selectionList' | 'emailInquiry' | 'booking' | 'confirmation' | 'humanChatActive' | 'emailSent'>('initial');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');

  const resetChatbot = () => {
    setStage('initial');
    setSelectedDepartment(null);
    setSelectedResource(null);
    setEmail('');
    setSelectedPerson(null);
    setSelectedDate('');
    setSelectedTime('');
    setEmailContent('');
  };

  const handleDepartmentSelection = (department: string) => {
    setSelectedDepartment(department);
    setStage('selectionList');
  };

  const handleResourceSelection = (resource: string) => {
    setSelectedResource(resource);
    setStage('emailInquiry');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStage('emailSent');
    }
  };

  const handlePersonSelection = (person: Person) => {
    setSelectedPerson(person);
    setStage('booking');
  };

  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setStage('confirmation');
  };

  const handleEmailContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
  };

  const handleEmailContentSubmit = () => {
    if (emailContent) {
      setStage('emailSent');
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 'initial':
        return <InitialStage onDepartmentSelect={handleDepartmentSelection} onHumanChat={() => setStage('humanChat')} />;
      case 'humanChat':
        return <HumanChatStage onClose={onClose} />;
      case 'selectionList':
        return (
          <SelectionListStage
            title="Available Resources"
            items={resources[selectedDepartment || 'general']}
            onItemSelect={handleResourceSelection}
            onBack={() => setStage('initial')}
          />
        );
      case 'emailInquiry':
        return (
          <EmailInquiryStage
            email={email}
            onEmailChange={handleEmailChange}
            onEmailSubmit={handleEmailSubmit}
            onEmailContentChange={handleEmailContentChange}
            onEmailContentSubmit={handleEmailContentSubmit}
            onBack={() => setStage('selectionList')}
          />
        );
      case 'booking':
        return (
          <BookingStage
            selectedPerson={selectedPerson!}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={handleDateSelection}
            onTimeSelect={handleTimeSelection}
            onBack={() => setStage('selectionList')}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStage
            selectedPerson={selectedPerson!}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onReset={resetChatbot}
          />
        );
      case 'humanChatActive':
        return <HumanChatActiveStage onClose={onClose} />;
      case 'emailSent':
        return <EmailSentStage onReset={resetChatbot} />;
      default:
        return <InitialStage onDepartmentSelect={handleDepartmentSelection} onHumanChat={() => setStage('humanChat')} />;
    }
  };

  return (
    <div className="min-h-[400px] min-w-[300px] p-4">
      {renderStage()}
    </div>
  );
};
