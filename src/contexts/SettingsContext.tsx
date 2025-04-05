
import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

type AiPersona = "academic" | "creative" | "technical" | "supportive" | "nyptho" | "custom";

interface AiTraits {
  helpfulness: number;
  creativity: number;
  precision: number;
  friendliness: number;
}

interface SettingsContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  aiPersona: AiPersona;
  setAiPersona: (persona: AiPersona) => void;
  aiTraits: AiTraits;
  updateAiTrait: (trait: keyof AiTraits, value: number) => void;
  useNyptho: boolean;
  setUseNyptho: (value: boolean) => void;
  notificationSound: boolean;
  setNotificationSound: (value: boolean) => void;
  resetToDefaults: () => void;
}

const defaultAiTraits: AiTraits = {
  helpfulness: 75,
  creativity: 50,
  precision: 85,
  friendliness: 70
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [aiPersona, setAiPersona] = useState<AiPersona>(() => {
    return (localStorage.getItem("AI_PERSONA") as AiPersona) || "academic";
  });
  
  const [aiTraits, setAiTraits] = useState<AiTraits>(() => {
    const savedTraits = localStorage.getItem("AI_TRAITS");
    return savedTraits ? JSON.parse(savedTraits) : { ...defaultAiTraits };
  });
  
  const [useNyptho, setUseNyptho] = useState<boolean>(() => {
    return localStorage.getItem("USE_NYPTHO") === "true";
  });
  
  const [notificationSound, setNotificationSound] = useState<boolean>(() => {
    return localStorage.getItem("NOTIFICATION_SOUND") !== "false"; // Default to true
  });

  // Save settings to localStorage whenever they change
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

  const updateAiTrait = (trait: keyof AiTraits, value: number) => {
    setAiTraits(prev => ({ ...prev, [trait]: value }));
  };

  const resetToDefaults = () => {
    setAiPersona("academic");
    setAiTraits({ ...defaultAiTraits });
    setUseNyptho(false);
    setNotificationSound(true);
    toast.success("Settings reset to defaults");
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        aiPersona, 
        setAiPersona, 
        aiTraits, 
        updateAiTrait,
        useNyptho,
        setUseNyptho,
        notificationSound,
        setNotificationSound,
        resetToDefaults
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
