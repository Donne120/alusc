import { BackendSelector } from "@/components/settings/BackendSelector";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Settings = () => {
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("ACCESSIBILITY_MODE") === "true"
  );
  
  const [activeModel, setActiveModel] = useState(
    localStorage.getItem("ACTIVE_MODEL") || "gemini"
  );

  const handleAccessibilityChange = (checked: boolean) => {
    setAccessibilityMode(checked);
    localStorage.setItem("ACCESSIBILITY_MODE", checked.toString());
    toast.success(`Accessibility mode ${checked ? "enabled" : "disabled"}`);
  };

  const handleModelChange = (value: string) => {
    setActiveModel(value);
    localStorage.setItem("ACTIVE_MODEL", value);
    toast.success(`Model changed to ${value}`);
  };

  const clearLocalStorage = () => {
    // Keep only essential settings
    const accessibilitySetting = localStorage.getItem("ACCESSIBILITY_MODE");
    const modelSetting = localStorage.getItem("ACTIVE_MODEL");
    const backendSettings = {
      BACKEND_URL: localStorage.getItem("BACKEND_URL"),
      USE_LOCAL_BACKEND: localStorage.getItem("USE_LOCAL_BACKEND"),
      USE_HUGGINGFACE_BACKEND: localStorage.getItem("USE_HUGGINGFACE_BACKEND")
    };
    
    // Clear everything
    localStorage.clear();
    
    // Restore essential settings
    if (accessibilitySetting) localStorage.setItem("ACCESSIBILITY_MODE", accessibilitySetting);
    if (modelSetting) localStorage.setItem("ACTIVE_MODEL", modelSetting);
    if (backendSettings.BACKEND_URL) localStorage.setItem("BACKEND_URL", backendSettings.BACKEND_URL);
    if (backendSettings.USE_LOCAL_BACKEND) localStorage.setItem("USE_LOCAL_BACKEND", backendSettings.USE_LOCAL_BACKEND);
    if (backendSettings.USE_HUGGINGFACE_BACKEND) localStorage.setItem("USE_HUGGINGFACE_BACKEND", backendSettings.USE_HUGGINGFACE_BACKEND);
    
    toast.success("Chat history and cache cleared");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>
                  Configure accessibility settings for the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="accessibility-mode" 
                    checked={accessibilityMode}
                    onCheckedChange={handleAccessibilityChange}
                  />
                  <Label htmlFor="accessibility-mode">Enable accessibility mode</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Model</CardTitle>
                <CardDescription>
                  Select which AI model to use for responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={activeModel} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI GPT</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="connection">
          <div className="grid gap-6 md:grid-cols-2">
            <BackendSelector />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage application data and storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={clearLocalStorage}
                  className="w-full"
                >
                  Clear Chat History & Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
