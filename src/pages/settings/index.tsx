import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Bell,
  ChevronLeft,
  Eye,
  Moon,
  Sun,
  MonitorSmartphone,
  Volume2,
  MessageSquare,
  LucideIcon,
  Settings as SettingsIcon,
  Lightbulb,
  Accessibility,
  GraduationCap,
  Bot,
} from "lucide-react";

interface SettingSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection = ({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: SettingSectionProps) => (
  <Card className="mb-6 border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-colors">
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [geminiApiKey, setGeminiApiKey] = useState(
    localStorage.getItem("GEMINI_API_KEY") || ""
  );
  const [customPrompt, setCustomPrompt] = useState(
    localStorage.getItem("CUSTOM_PROMPT") || ""
  );
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("NOTIFICATIONS") === "true";
  });
  const [textToSpeech, setTextToSpeech] = useState(() => {
    return localStorage.getItem("TEXT_TO_SPEECH") === "true";
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("HIGH_CONTRAST") === "true";
  });
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("LARGE_TEXT") === "true";
  });

  // Apply high contrast and large text settings
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [highContrast, largeText]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGeminiApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setGeminiApiKey(newKey);
    localStorage.setItem("GEMINI_API_KEY", newKey);
    if (newKey) {
      toast.success("Gemini API key saved");
    }
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setCustomPrompt(newPrompt);
    localStorage.setItem("CUSTOM_PROMPT", newPrompt);
    toast.success("Custom prompt saved");
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem("NOTIFICATIONS", String(checked));
    toast.success(`Notifications ${checked ? "enabled" : "disabled"}`);
  };

  const handleTextToSpeechChange = (checked: boolean) => {
    setTextToSpeech(checked);
    localStorage.setItem("TEXT_TO_SPEECH", String(checked));
    toast.success(`Text-to-speech ${checked ? "enabled" : "disabled"}`);
  };

  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem("HIGH_CONTRAST", String(checked));
  };

  const handleLargeTextChange = (checked: boolean) => {
    setLargeText(checked);
    localStorage.setItem("LARGE_TEXT", String(checked));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={handleGoBack} 
          className="mb-6 hover:bg-primary/10"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-[#D946EF] text-transparent bg-clip-text">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your ALU AI assistant experience to meet your needs
          </p>
        </div>

        <div className="space-y-6">
          <SettingSection 
            icon={Bot} 
            title="AI Model Settings" 
            description="Configure your AI model"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  value={geminiApiKey}
                  onChange={handleGeminiApiKeyChange}
                  placeholder="Enter your Gemini API key"
                  className="max-w-md mt-1.5"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  Required for Gemini responses. Get your API key from{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <Separator className="my-4" />

              <div>
                <Label htmlFor="custom-prompt">Custom System Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Enter a custom system prompt to personalize the AI's behavior..."
                  value={customPrompt}
                  onChange={handleCustomPromptChange}
                  className="min-h-[100px] mt-1.5"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  Personalize how the AI responds to your questions
                </p>
              </div>
            </div>
          </SettingSection>

          <SettingSection 
            icon={MonitorSmartphone} 
            title="Appearance" 
            description="Customize the visual appearance of the application"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  <span>Light</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="h-8"
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="h-8"
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="h-8"
                  >
                    System
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Dark</span>
                  <Moon className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection 
            icon={Accessibility} 
            title="Accessibility" 
            description="Options to make the app more accessible"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enhances visual contrast for better readability
                  </p>
                </div>
                <Switch 
                  checked={highContrast}
                  onCheckedChange={handleHighContrastChange}
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Larger Text</Label>
                  <p className="text-sm text-muted-foreground">
                    Increases font size throughout the application
                  </p>
                </div>
                <Switch 
                  checked={largeText}
                  onCheckedChange={handleLargeTextChange}
                />
              </div>
            </div>
          </SettingSection>

          <SettingSection 
            icon={Bell} 
            title="Notifications" 
            description="Configure your notification preferences"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for updates and messages
                </p>
              </div>
              <Switch 
                checked={notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
          </SettingSection>

          <SettingSection 
            icon={Volume2} 
            title="Text-to-Speech" 
            description="Configure text-to-speech options"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Text-to-Speech</Label>
                <p className="text-sm text-muted-foreground">
                  Have AI responses read aloud to you
                </p>
              </div>
              <Switch 
                checked={textToSpeech}
                onCheckedChange={handleTextToSpeechChange}
              />
            </div>
          </SettingSection>

          <SettingSection 
            icon={GraduationCap} 
            title="Academic Resources" 
            description="Links to helpful ALU resources"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <a 
                href="https://learning.alu.io/dashboard" 
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-medium mb-1">ALU Learning Platform</h3>
                <p className="text-sm text-muted-foreground">Access your courses and learning materials</p>
              </a>
              <a 
                href="https://moodle.alu.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-medium mb-1">ALU Moodle</h3>
                <p className="text-sm text-muted-foreground">View assignments, grades, and course communications</p>
              </a>
              <a 
                href="https://alu.io/student-hub/" 
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-medium mb-1">Student Hub</h3>
                <p className="text-sm text-muted-foreground">Centralized resource for student services</p>
              </a>
              <a 
                href="https://library.alu.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <h3 className="font-medium mb-1">Digital Library</h3>
                <p className="text-sm text-muted-foreground">Access journals, books, and research materials</p>
              </a>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
}
