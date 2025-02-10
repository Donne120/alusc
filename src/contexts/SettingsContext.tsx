import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
  privacy: {
    saveHistory: boolean;
    shareAnalytics: boolean;
  };
  display: {
    showTimestamps: boolean;
    compactMode: boolean;
  };
  updateSettings: (settings: Partial<Settings>) => void;
}

interface Settings {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
  privacy: {
    saveHistory: boolean;
    shareAnalytics: boolean;
  };
  display: {
    showTimestamps: boolean;
    compactMode: boolean;
  };
}

const defaultSettings: Settings = {
  theme: "light",
  language: "en",
  notifications: true,
  privacy: {
    saveHistory: true,
    shareAnalytics: false,
  },
  display: {
    showTimestamps: true,
    compactMode: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    
    // Apply other global settings as needed
    if (settings.display.compactMode) {
      document.documentElement.classList.add("compact-mode");
    } else {
      document.documentElement.classList.remove("compact-mode");
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
        privacy: { ...prev.privacy, ...(newSettings.privacy || {}) },
        display: { ...prev.display, ...(newSettings.display || {}) },
      };
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};