
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const [geminiKey, setGeminiKey] = useState("");
  const [useLocalBackend, setUseLocalBackend] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem("GEMINI_API_KEY") || "";
    const savedUseLocalBackend = localStorage.getItem("USE_LOCAL_BACKEND") === "true";
    
    setGeminiKey(savedGeminiKey);
    setUseLocalBackend(savedUseLocalBackend);
  }, []);

  const saveSettings = () => {
    // Save Gemini API key
    if (geminiKey) {
      localStorage.setItem("GEMINI_API_KEY", geminiKey);
    }
    
    // Save local backend setting
    localStorage.setItem("USE_LOCAL_BACKEND", useLocalBackend.toString());
    
    toast.success("Settings saved successfully");
  };

  const toggleUseLocalBackend = (checked: boolean) => {
    setUseLocalBackend(checked);
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
      
      <div className="space-y-6">
        {/* Model Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
            <CardDescription>
              Configure which AI model to use for your assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Use Local Backend</h3>
                  <p className="text-sm text-gray-400">
                    Connect to your local backend running on http://localhost:8000
                  </p>
                </div>
                <Switch 
                  checked={useLocalBackend} 
                  onCheckedChange={toggleUseLocalBackend} 
                />
              </div>
              
              {!useLocalBackend && (
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Gemini API Key</Label>
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    You can get your API key from the Google AI Studio
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
