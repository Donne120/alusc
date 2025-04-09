
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BackendStatus } from "@/components/chat/BackendStatus";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, School, Building2, FileText, Globe, 
  BookOpen, Bell, MessageSquare, Lock, Database, 
  BrainCircuit, Clock, ArrowLeft, Settings as SettingsIcon,
  Sparkles, Bot, Sliders, Zap, Cloud, Shield, 
  GraduationCap, Lightbulb, Layout, Laptop
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { aiService } from "@/services/aiService";

// AI Persona types
type AiPersona = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  traits: {
    helpfulness: number;
    creativity: number;
    precision: number;
    friendliness: number;
  }
};

export default function Settings() {
  // Original settings state
  const [geminiKey, setGeminiKey] = useState("");
  const [useLocalBackend, setUseLocalBackend] = useState(false);
  const [userRole, setUserRole] = useState("student"); // student, faculty, admin
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("english");
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [historyRetention, setHistoryRetention] = useState("30days");
  const [adminFeatures, setAdminFeatures] = useState(false);

  // AI persona settings
  const [selectedPersona, setSelectedPersona] = useState<string>("academic");
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [aiTraits, setAiTraits] = useState({
    helpfulness: 75,
    creativity: 50,
    precision: 85,
    friendliness: 70
  });
  const [aiVoice, setAiVoice] = useState("natural");
  const [aiTheme, setAiTheme] = useState("default");
  const [analyticsDashboard, setAnalyticsDashboard] = useState(true);
  const [continuousLearning, setContinuousLearning] = useState(true);
  
  // Integration state
  const [integrationProgress, setIntegrationProgress] = useState<Record<string, boolean>>({
    calendar: true,
    assignments: true,
    library: false,
    courses: true
  });

  // Backend status
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', message: 'Checking connection...' });
  const [nypthoStatus, setNypthoStatus] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI personas
  const aiPersonas: AiPersona[] = [
    {
      id: "academic",
      name: "Academic Advisor",
      description: "Focuses on academic information, course guidance, and educational resources",
      icon: <GraduationCap className="w-8 h-8 text-alu-navy" />,
      traits: { helpfulness: 85, creativity: 40, precision: 90, friendliness: 75 }
    },
    {
      id: "creative",
      name: "Creative Coach",
      description: "Encourages creative thinking, exploration, and unique perspectives",
      icon: <Sparkles className="w-8 h-8 text-alu-purple" />,
      traits: { helpfulness: 70, creativity: 95, precision: 60, friendliness: 80 }
    },
    {
      id: "technical",
      name: "Technical Assistant",
      description: "Provides precise, technical information with detailed explanations",
      icon: <BrainCircuit className="w-8 h-8 text-alu-navy" />,
      traits: { helpfulness: 85, creativity: 35, precision: 95, friendliness: 65 }
    },
    {
      id: "supportive",
      name: "Supportive Guide",
      description: "Emphasizes emotional support, motivation, and encouragement",
      icon: <Lightbulb className="w-8 h-8 text-alu-red" />,
      traits: { helpfulness: 90, creativity: 65, precision: 75, friendliness: 95 }
    },
    {
      id: "custom",
      name: "Custom AI",
      description: "Fully customized AI assistant with your preferred traits",
      icon: <Sliders className="w-8 h-8 text-alu-purple" />,
      traits: { helpfulness: 75, creativity: 50, precision: 85, friendliness: 70 }
    }
  ];

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const status = await aiService.getBackendStatus();
        setBackendStatus(status);
      } catch (error) {
        setBackendStatus({ status: 'offline', message: 'Unable to connect to ALU knowledge base' });
      }
    };
    
    checkBackend();
    
    // Also check Nyptho status if available
    const checkNyptho = async () => {
      try {
        const status = await aiService.getNypthoStatus();
        setNypthoStatus(status);
      } catch (error) {
        console.error("Error checking Nyptho status:", error);
      }
    };
    
    checkNyptho();
  }, []);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem("GEMINI_API_KEY") || "";
    const savedUseLocalBackend = localStorage.getItem("USE_LOCAL_BACKEND") === "true";
    const savedUserRole = localStorage.getItem("USER_ROLE") || "student";
    const savedAutoSave = localStorage.getItem("AUTO_SAVE") !== "false";
    const savedNotifications = localStorage.getItem("NOTIFICATIONS") !== "false";
    const savedTheme = localStorage.getItem("THEME") || "system";
    const savedLanguage = localStorage.getItem("LANGUAGE") || "english";
    const savedAccessibilityMode = localStorage.getItem("ACCESSIBILITY_MODE") === "true";
    const savedHistoryRetention = localStorage.getItem("HISTORY_RETENTION") || "30days";
    const savedAdminFeatures = localStorage.getItem("ADMIN_FEATURES") === "true";
    
    // Load AI-specific settings
    const savedPersona = localStorage.getItem("AI_PERSONA") || "academic";
    const savedCustomPrompt = localStorage.getItem("CUSTOM_PROMPT") || "";
    const savedAiTraits = JSON.parse(localStorage.getItem("AI_TRAITS") || JSON.stringify(aiTraits));
    const savedAiPersonalization = localStorage.getItem("AI_PERSONALIZATION") !== "false";
    const savedAiVoice = localStorage.getItem("AI_VOICE") || "natural";
    const savedAiTheme = localStorage.getItem("AI_THEME") || "default";
    const savedAnalyticsDashboard = localStorage.getItem("ANALYTICS_DASHBOARD") !== "false";
    const savedContinuousLearning = localStorage.getItem("CONTINUOUS_LEARNING") !== "false";
    const savedIntegrations = JSON.parse(localStorage.getItem("INTEGRATION_PROGRESS") || JSON.stringify(integrationProgress));
    
    // Set original settings
    setGeminiKey(savedGeminiKey);
    setUseLocalBackend(savedUseLocalBackend);
    setUserRole(savedUserRole);
    setAutoSave(savedAutoSave);
    setNotifications(savedNotifications);
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setAccessibilityMode(savedAccessibilityMode);
    setHistoryRetention(savedHistoryRetention);
    setAdminFeatures(savedAdminFeatures);
    
    // Set AI-specific settings
    setSelectedPersona(savedPersona);
    setCustomPrompt(savedCustomPrompt);
    setAiTraits(savedAiTraits);
    setAiPersonalization(savedAiPersonalization);
    setAiVoice(savedAiVoice);
    setAiTheme(savedAiTheme);
    setAnalyticsDashboard(savedAnalyticsDashboard);
    setContinuousLearning(savedContinuousLearning);
    setIntegrationProgress(savedIntegrations);
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    
    // Save all original settings
    if (geminiKey) {
      localStorage.setItem("GEMINI_API_KEY", geminiKey);
    }
    
    localStorage.setItem("USE_LOCAL_BACKEND", useLocalBackend.toString());
    localStorage.setItem("USER_ROLE", userRole);
    localStorage.setItem("AUTO_SAVE", autoSave.toString());
    localStorage.setItem("NOTIFICATIONS", notifications.toString());
    localStorage.setItem("THEME", theme);
    localStorage.setItem("LANGUAGE", language);
    localStorage.setItem("ACCESSIBILITY_MODE", accessibilityMode.toString());
    localStorage.setItem("HISTORY_RETENTION", historyRetention);
    localStorage.setItem("ADMIN_FEATURES", adminFeatures.toString());
    
    // Save AI-specific settings
    localStorage.setItem("AI_PERSONA", selectedPersona);
    localStorage.setItem("CUSTOM_PROMPT", customPrompt);
    localStorage.setItem("AI_TRAITS", JSON.stringify(aiTraits));
    localStorage.setItem("AI_PERSONALIZATION", aiPersonalization.toString());
    localStorage.setItem("AI_VOICE", aiVoice);
    localStorage.setItem("AI_THEME", aiTheme);
    localStorage.setItem("ANALYTICS_DASHBOARD", analyticsDashboard.toString());
    localStorage.setItem("CONTINUOUS_LEARNING", continuousLearning.toString());
    localStorage.setItem("INTEGRATION_PROGRESS", JSON.stringify(integrationProgress));
    
    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated"
      });
    }, 600);
  };

  const toggleUseLocalBackend = (checked: boolean) => {
    setUseLocalBackend(checked);
  };

  const handleTraitChange = (trait: keyof typeof aiTraits, value: number[]) => {
    setAiTraits(prev => ({
      ...prev,
      [trait]: value[0]
    }));
  };

  const toggleIntegration = (key: string) => {
    setIntegrationProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get current persona
  const currentPersona = aiPersonas.find(p => p.id === selectedPersona) || aiPersonas[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-alu-navy to-alu-navy/95">
      <div className="container max-w-5xl py-10 px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-3">
            <ArrowLeft size={18} />
            <span>Back to Chat</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
              <p className="text-white/70">Configure your ALU Assistant experience</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${
                backendStatus.status === 'online' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  backendStatus.status === 'online' ? 'bg-green-400 animate-alu-pulse' : 'bg-red-400'
                }`}></span>
                <span className="text-sm font-medium">{backendStatus.message}</span>
              </div>
              
              <Button
                onClick={saveSettings}
                className="bg-alu-red hover:bg-alu-red/90 text-white gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 border-2 border-t-transparent border-white/80 rounded-full animate-spin"></span>
                    <span>Saving</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Save All Settings</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-4 sticky top-6">
              <Tabs defaultValue="ai-persona" orientation="vertical" className="w-full">
                <TabsList className="flex flex-col w-full bg-transparent space-y-1">
                  <TabsTrigger 
                    value="ai-persona" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <Bot className="h-5 w-5" />
                    <span>AI Persona</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="general" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <Layout className="h-5 w-5" />
                    <span>General</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="academic" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <School className="h-5 w-5" />
                    <span>Academic</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <BrainCircuit className="h-5 w-5" />
                    <span>AI Models</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin" 
                    className="flex items-center justify-start gap-3 w-full px-3 py-2 text-left text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Cloud className="h-4 w-4" />
                  <span>Version 1.3.5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-5">
            <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 overflow-hidden">
              <Tabs defaultValue="ai-persona" className="w-full">
                {/* AI Persona Settings */}
                <TabsContent value="ai-persona" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">AI Persona Configuration</h2>
                    <p className="text-white/70">Customize how the AI assistant interacts with you</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Persona Selection */}
                    <div className="space-y-4 md:col-span-2">
                      <h3 className="text-lg font-medium text-white">Choose Your AI Persona</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {aiPersonas.map(persona => (
                          <div 
                            key={persona.id}
                            className={`relative flex items-center space-x-3 rounded-lg border border-white/20 p-3 cursor-pointer transition-all ${
                              selectedPersona === persona.id 
                                ? "bg-alu-purple/30 border-alu-purple/50" 
                                : "hover:border-white/30 bg-white/5"
                            }`}
                            onClick={() => {
                              setSelectedPersona(persona.id);
                              if (persona.id !== "custom") {
                                setAiTraits(persona.traits);
                              }
                            }}
                          >
                            {persona.icon}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white">{persona.name}</p>
                              <p className="text-xs text-white/70 truncate">{persona.description}</p>
                            </div>
                            {selectedPersona === persona.id && (
                              <div className="h-2 w-2 rounded-full bg-alu-red"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Persona Preview & Customization */}
                    <div className="md:col-span-3 space-y-4">
                      <h3 className="text-lg font-medium text-white">Persona Preview</h3>
                      <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12 border-2 border-alu-red/60">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-alu-navy text-white">
                              {currentPersona.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-white">{currentPersona.name}</h4>
                            <p className="text-xs text-white/70">{currentPersona.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {Object.entries(currentPersona.traits).map(([trait, value]) => (
                            <div key={trait} className="text-sm">
                              <span className="capitalize text-white/80">{trait}:</span>
                              <div className="w-full bg-white/10 h-2 rounded-full mt-1">
                                <div 
                                  className="bg-alu-red h-2 rounded-full" 
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm p-3 rounded bg-white/10 mt-3">
                          <p className="italic text-white/80">
                            "Hello! I'm your {currentPersona.name.toLowerCase()}. I'm here to assist you with 
                            {currentPersona.id === 'academic' && " academic guidance and educational resources"}
                            {currentPersona.id === 'creative' && " creative exploration and unique perspectives"}
                            {currentPersona.id === 'technical' && " technical problems and detailed explanations"}
                            {currentPersona.id === 'supportive' && " motivation, support, and encouragement"}
                            {currentPersona.id === 'custom' && " your custom needs as configured"}."
                          </p>
                        </div>
                      </div>

                      {/* Custom Traits - only shown for Custom persona */}
                      {selectedPersona === "custom" && (
                        <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/5">
                          <h3 className="text-md font-medium text-white">Customize Traits</h3>
                          <div className="space-y-4">
                            {Object.entries(aiTraits).map(([trait, value]) => (
                              <div key={trait} className="space-y-2">
                                <div className="flex justify-between text-white">
                                  <Label className="capitalize">{trait}</Label>
                                  <span className="text-sm">{value}%</span>
                                </div>
                                <Slider 
                                  value={[value]} 
                                  min={0} 
                                  max={100}
                                  step={5}
                                  onValueChange={(val) => handleTraitChange(trait as keyof typeof aiTraits, val)}
                                  className="[&>span]:bg-alu-red"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Custom System Prompt */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Advanced Customization</h3>
                      <Switch 
                        checked={aiPersonalization} 
                        onCheckedChange={setAiPersonalization}
                      />
                    </div>
                    
                    {aiPersonalization && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="custom-prompt" className="text-white">Custom System Prompt</Label>
                          <Textarea 
                            id="custom-prompt"
                            placeholder="You are an AI assistant for ALU students and faculty. You help with..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                          <p className="text-xs text-white/70">
                            Define custom instructions for the AI assistant. This will override the default persona behavior.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">AI Voice Style</Label>
                            <ToggleGroup 
                              type="single" 
                              value={aiVoice} 
                              onValueChange={(value) => value && setAiVoice(value)}
                              className="justify-start bg-white/10 p-1 rounded-md"
                            >
                              <ToggleGroupItem value="natural" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Natural</ToggleGroupItem>
                              <ToggleGroupItem value="formal" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Formal</ToggleGroupItem>
                              <ToggleGroupItem value="casual" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Casual</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Chat Theme</Label>
                            <ToggleGroup 
                              type="single" 
                              value={aiTheme} 
                              onValueChange={(value) => value && setAiTheme(value)}
                              className="justify-start bg-white/10 p-1 rounded-md"
                            >
                              <ToggleGroupItem value="default" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Default</ToggleGroupItem>
                              <ToggleGroupItem value="academic" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Academic</ToggleGroupItem>
                              <ToggleGroupItem value="professional" className="data-[state=on]:bg-alu-red data-[state=on]:text-white">Professional</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Integration Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Educational Integrations</h3>
                    <p className="text-white/70 text-sm">
                      Enable the AI to access and help with various educational systems
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between border border-white/20 rounded-lg p-3 bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.calendar ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/40"}`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <span className="text-white">Calendar & Deadlines</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.calendar} 
                          onCheckedChange={() => toggleIntegration('calendar')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border border-white/20 rounded-lg p-3 bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.assignments ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/40"}`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-white">Assignments</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.assignments} 
                          onCheckedChange={() => toggleIntegration('assignments')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border border-white/20 rounded-lg p-3 bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.library ? "bg-blue-500/20 text-blue-300" : "bg-white/10 text-white/40"}`}>
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <span className="text-white">Library Resources</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.library} 
                          onCheckedChange={() => toggleIntegration('library')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border border-white/20 rounded-lg p-3 bg-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.courses ? "bg-purple-500/20 text-purple-300" : "bg-white/10 text-white/40"}`}>
                            <School className="h-4 w-4" />
                          </div>
                          <span className="text-white">Course Materials</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.courses} 
                          onCheckedChange={() => toggleIntegration('courses')}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Advanced AI Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Advanced AI Features</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Learning Analytics Dashboard</Label>
                        <p className="text-sm text-white/70">
                          Get insights on your learning patterns and AI interactions
                        </p>
                      </div>
                      <Switch 
                        checked={analyticsDashboard} 
                        onCheckedChange={setAnalyticsDashboard}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Continuous Learning</Label>
                        <p className="text-sm text-white/70">
                          Allow the AI to remember your preferences and adapt to your needs
                        </p>
                      </div>
                      <Switch 
                        checked={continuousLearning} 
                        onCheckedChange={setContinuousLearning}
                      />
                    </div>
                    
                    {nypthoStatus?.ready && (
                      <div className="mt-4 p-3 rounded-lg bg-alu-purple/30 border border-alu-purple/50">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="h-5 w-5 text-alu-purple" />
                          <h4 className="font-medium text-white">Nyptho Learning System Active</h4>
                        </div>
                        <p className="text-sm text-white/80 mb-2">
                          The advanced ALU learning system is active with {nypthoStatus?.learning?.observation_count || 0} observations.
                        </p>
                        <div className="w-full bg-white/20 h-2 rounded-full">
                          <div 
                            className="bg-alu-purple h-2 rounded-full" 
                            style={{ width: `${(nypthoStatus?.learning?.learning_rate || 0) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-white/60 mt-1">Learning rate: {((nypthoStatus?.learning?.learning_rate || 0) * 100).toFixed(1)}%</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* General Settings */}
                <TabsContent value="general" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">General Settings</h2>
                    <p className="text-white/70">Customize your experience with ALU Assistant</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/5">
                        <h3 className="text-lg font-medium text-white">Appearance</h3>
                        <div className="space-y-2">
                          <Label className="text-white">Theme</Label>
                          <ToggleGroup 
                            type="single" 
                            value={theme} 
                            onValueChange={(value) => value && setTheme(value)}
                            className="justify-start bg-white/10 p-1 rounded-md w-full"
                          >
                            <ToggleGroupItem value="light" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">
                              Light
                            </ToggleGroupItem>
                            <ToggleGroupItem value="dark" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">
                              Dark
                            </ToggleGroupItem>
                            <ToggleGroupItem value="system" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">
                              System
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>

                      <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/5">
                        <h3 className="text-lg font-medium text-white">Language</h3>
                        <div className="space-y-2">
                          <Label className="text-white">Interface Language</Label>
                          <ToggleGroup 
                            type="single" 
                            value={language} 
                            onValueChange={(value) => value && setLanguage(value)}
                            className="justify-start bg-white/10 p-1 rounded-md w-full"
                          >
                            <ToggleGroupItem value="english" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">English</ToggleGroupItem>
                            <ToggleGroupItem value="french" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">French</ToggleGroupItem>
                            <ToggleGroupItem value="swahili" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Swahili</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/5">
                      <h3 className="text-lg font-medium text-white">Behavior</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Auto-save Conversations</Label>
                          <p className="text-sm text-white/70">
                            Automatically save your conversations
                          </p>
                        </div>
                        <Switch 
                          checked={autoSave} 
                          onCheckedChange={setAutoSave} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Notifications</Label>
                          <p className="text-sm text-white/70">
                            Receive notifications for new messages
                          </p>
                        </div>
                        <Switch 
                          checked={notifications} 
                          onCheckedChange={setNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">Accessibility Mode</Label>
                          <p className="text-sm text-white/70">
                            Enhanced readability and screen reader support
                          </p>
                        </div>
                        <Switch 
                          checked={accessibilityMode} 
                          onCheckedChange={setAccessibilityMode} 
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-4 p-4 border border-white/20 rounded-lg bg-white/5">
                      <h3 className="text-lg font-medium text-white">Data</h3>
                      <div className="space-y-2">
                        <Label className="text-white">Chat History Retention</Label>
                        <ToggleGroup 
                          type="single" 
                          value={historyRetention} 
                          onValueChange={(value) => value && setHistoryRetention(value)}
                          className="justify-start bg-white/10 p-1 rounded-md w-full"
                        >
                          <ToggleGroupItem value="7days" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">7 Days</ToggleGroupItem>
                          <ToggleGroupItem value="30days" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">30 Days</ToggleGroupItem>
                          <ToggleGroupItem value="90days" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">90 Days</ToggleGroupItem>
                          <ToggleGroupItem value="forever" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Forever</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <Button variant="outline" className="mt-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                        Clear Chat History
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Account Settings */}
                <TabsContent value="account" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Account Settings</h2>
                    <p className="text-white/70">Manage your account preferences and profile information</p>
                  </div>
                  
                  <div className="p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Role Selection</h3>
                      <div className="space-y-2">
                        <Label className="text-white">User Role</Label>
                        <ToggleGroup 
                          type="single" 
                          value={userRole} 
                          onValueChange={(value) => value && setUserRole(value)}
                          className="justify-start bg-white/10 p-1 rounded-md w-full"
                        >
                          <ToggleGroupItem value="student" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Student</ToggleGroupItem>
                          <ToggleGroupItem value="faculty" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Faculty</ToggleGroupItem>
                          <ToggleGroupItem value="admin" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Admin</ToggleGroupItem>
                        </ToggleGroup>
                        <p className="text-sm text-white/70">
                          Your role determines what features you have access to
                        </p>
                      </div>

                      <Separator className="bg-white/10 my-4" />

                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="student@alueducation.com" 
                            disabled 
                            className="bg-white/10 border-white/20 text-white"
                          />
                          <p className="text-xs text-white/70">
                            Your ALU email address (cannot be changed)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white">Password</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="password" 
                              type="password" 
                              value="••••••••" 
                              disabled 
                              className="bg-white/10 border-white/20 text-white" 
                            />
                            <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">Change</Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white">Display Name</Label>
                          <Input id="name" placeholder="Your Name" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Academic Settings */}
                <TabsContent value="academic" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Academic Settings</h2>
                    <p className="text-white/70">Configure academic preferences and course-related settings</p>
                  </div>
                  
                  <div className="p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Program Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="program" className="text-white">Current Program</Label>
                          <Input 
                            id="program" 
                            placeholder="Global Challenges" 
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="year" className="text-white">Academic Year</Label>
                          <Input 
                            id="year" 
                            placeholder="2024-2025"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="campus" className="text-white">Campus</Label>
                          <Input 
                            id="campus" 
                            placeholder="Rwanda" 
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="major" className="text-white">Major</Label>
                          <Input 
                            id="major" 
                            placeholder="Computer Science" 
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10 my-6" />

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Course Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Course Updates</Label>
                            <p className="text-sm text-white/70">
                              Receive updates about your enrolled courses
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Assignment Reminders</Label>
                            <p className="text-sm text-white/70">
                              Get notified about upcoming assignments
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Resource Recommendations</Label>
                            <p className="text-sm text-white/70">
                              Receive personalized resource recommendations
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">AI Model Settings</h2>
                    <p className="text-white/70">Configure AI models and backend connections</p>
                  </div>
                  
                  <div className="p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Connection Settings</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium text-white">Use ALU Backend</h3>
                          <p className="text-sm text-white/70">
                            Connect to ALU knowledge base on http://localhost:8000
                          </p>
                        </div>
                        <Switch 
                          checked={useLocalBackend} 
                          onCheckedChange={toggleUseLocalBackend} 
                        />
                      </div>
                      
                      {!useLocalBackend && (
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="gemini-key" className="text-white">Alternative API Key</Label>
                          <Input
                            id="gemini-key"
                            type="password"
                            placeholder="Enter your Gemini API key"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                          <p className="text-xs text-white/70">
                            You can get your API key from the Google AI Studio
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-white/10 my-6" />

                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Model Configuration</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-white">Response Style</Label>
                          <ToggleGroup 
                            type="single" 
                            defaultValue="balanced" 
                            className="justify-start bg-white/10 p-1 rounded-md w-full"
                          >
                            <ToggleGroupItem value="creative" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Creative</ToggleGroupItem>
                            <ToggleGroupItem value="balanced" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Balanced</ToggleGroupItem>
                            <ToggleGroupItem value="precise" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Precise</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-white">Knowledge Cutoff</Label>
                          <ToggleGroup 
                            type="single" 
                            defaultValue="latest" 
                            className="justify-start bg-white/10 p-1 rounded-md w-full"
                          >
                            <ToggleGroupItem value="2022" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">2022</ToggleGroupItem>
                            <ToggleGroupItem value="2023" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">2023</ToggleGroupItem>
                            <ToggleGroupItem value="latest" className="flex-1 data-[state=on]:bg-alu-red data-[state=on]:text-white">Latest</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                      
                      <div className="rounded-lg p-4 bg-alu-navy border border-white/10 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-alu-red" />
                          <h4 className="font-medium text-white">Backend Security Status</h4>
                        </div>
                        <div className="mb-3">
                          <div className="h-2 bg-white/10 rounded-full w-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>Security Level: High</span>
                            <span>92%</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/80">
                          Your connection to the ALU knowledge base is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Admin Settings */}
                <TabsContent value="admin" className="p-6 space-y-8 outline-none">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Admin Settings</h2>
                    <p className="text-white/70">Advanced settings for administrators</p>
                  </div>
                  
                  <div className="p-4 border border-white/20 rounded-lg bg-white/5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">Admin Features</h3>
                          <p className="text-sm text-white/70">
                            Enable administrative features and controls
                          </p>
                        </div>
                        <Switch 
                          checked={adminFeatures} 
                          onCheckedChange={setAdminFeatures} 
                        />
                      </div>

                      {adminFeatures && (
                        <>
                          <Separator className="bg-white/10 my-4" />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">User Management</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Batch User Import</Label>
                                  <p className="text-sm text-white/70">
                                    Import users from CSV or Excel files
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Import
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">User Permissions</Label>
                                  <p className="text-sm text-white/70">
                                    Configure access levels and permissions
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <Lock className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-white/10 my-4" />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">System Configuration</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Database Settings</Label>
                                  <p className="text-sm text-white/70">
                                    Configure database connection and backup settings
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <Database className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">API Endpoints</Label>
                                  <p className="text-sm text-white/70">
                                    Configure external API connections
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <Globe className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Scheduled Tasks</Label>
                                  <p className="text-sm text-white/70">
                                    Configure periodic background tasks
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <Clock className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-white/10 my-4" />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Integration Management</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Learning Management System</Label>
                                  <p className="text-sm text-white/70">
                                    Connect to Canvas, Moodle, or other LMS
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Connect
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Notification Services</Label>
                                  <p className="text-sm text-white/70">
                                    Configure email and push notification services
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <Bell className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-white">Chat Interface</Label>
                                  <p className="text-sm text-white/70">
                                    Configure chatbot behavior and responses
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
