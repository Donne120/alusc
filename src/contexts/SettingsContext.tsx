
import React, { createContext, useState, useContext, useEffect } from "react";
import { useTheme } from "next-themes";

// Define types for our settings
type AIPersonaType = "academic" | "creative" | "technical" | "supportive" | "nyptho" | "custom";

interface AITraitsType {
  helpfulness: number;
  creativity: number;
  precision: number;
  friendliness: number;
}

interface SettingsContextType {
  // Theme settings
  theme: string;
  setTheme: (theme: string) => void;
  
  // AI persona settings
  aiPersona: AIPersonaType;
  setAiPersona: (persona: AIPersonaType) => void;
  
  // AI traits
  aiTraits: AITraitsType;
  updateAiTrait: (trait: keyof AITraitsType, value: number) => void;
  
  // Nyptho settings
  useNyptho: boolean;
  setUseNyptho: (use: boolean) => void;
  
  // Sound settings
  notificationSound: boolean;
  setNotificationSound: (enabled: boolean) => void;
  
  // Reset function
  resetToDefaults: () => void;
}

// Default values for settings
const defaultAITraits: AITraitsType = {
  helpfulness: 75,
  creativity: 50,
  precision: 85,
  friendliness: 70,
};

// Create context with default values
const SettingsContext = createContext<SettingsContextType>({
  theme: "dark",
  setTheme: () => {},
  aiPersona: "academic",
  setAiPersona: () => {},
  aiTraits: defaultAITraits,
  updateAiTrait: () => {},
  useNyptho: false,
  setUseNyptho: () => {},
  notificationSound: true,
  setNotificationSound: () => {},
  resetToDefaults: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use next-themes for theme handling
  const { theme, setTheme: setNextTheme } = useTheme();
  
  // Load settings from localStorage or use defaults
  const [aiPersona, setAiPersona] = useState<AIPersonaType>(() => {
    const saved = localStorage.getItem("AI_PERSONA");
    return (saved as AIPersonaType) || "academic";
  });
  
  const [aiTraits, setAiTraits] = useState<AITraitsType>(() => {
    const saved = localStorage.getItem("AI_TRAITS");
    return saved ? JSON.parse(saved) : defaultAITraits;
  });
  
  const [useNyptho, setUseNyptho] = useState<boolean>(() => {
    return localStorage.getItem("USE_NYPTHO") === "true";
  });
  
  const [notificationSound, setNotificationSound] = useState<boolean>(() => {
    return localStorage.getItem("NOTIFICATION_SOUND") !== "false";
  });

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem("AI_PERSONA", aiPersona);
  }, [aiPersona]);

  useEffect(() => {
    localStorage.setItem("AI_TRAITS", JSON.stringify(aiTraits));
  }, [aiTraits]);

  useEffect(() => {
    localStorage.setItem("USE_NYPTHO", useNyptho.toString());
  }, [useNyptho]);

  useEffect(() => {
    localStorage.setItem("NOTIFICATION_SOUND", notificationSound.toString());
  }, [notificationSound]);

  // Function to update a specific AI trait
  const updateAiTrait = (trait: keyof AITraitsType, value: number) => {
    setAiTraits((prev) => ({
      ...prev,
      [trait]: value,
    }));
    
    // Switch to custom persona automatically when traits are changed
    setAiPersona("custom");
  };

  // Reset all settings to defaults
  const resetToDefaults = () => {
    setNextTheme("dark");
    setAiPersona("academic");
    setAiTraits(defaultAITraits);
    setUseNyptho(false);
    setNotificationSound(true);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme: theme || "dark",
        setTheme: setNextTheme,
        aiPersona,
        setAiPersona,
        aiTraits,
        updateAiTrait,
        useNyptho,
        setUseNyptho,
        notificationSound,
        setNotificationSound,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);
