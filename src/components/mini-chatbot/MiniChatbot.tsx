
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Calendar, Users, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MiniChatbotContent } from "./MiniChatbotContent";

export const MiniChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const chatbotRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatbotRef.current && e.target === chatbotRef.current.firstChild) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Handle dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const maxX = window.innerWidth - (chatbotRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (chatbotRef.current?.offsetHeight || 0);
      
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, maxX));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, maxY));
      
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={chatbotRef}
      className="fixed z-50 transition-all duration-300"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {isOpen ? (
        <Card className="w-80 shadow-lg animate-fade-in bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
            <h3 className="font-medium">ALU Support Chat</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <MiniChatbotContent />
        </Card>
      ) : (
        <Button 
          className="rounded-full h-14 w-14 shadow-lg animate-pulse bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};
