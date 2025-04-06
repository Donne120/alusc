
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun, RotateCw, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/contexts/SettingsContext";

export default function Settings() {
  const { 
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
  } = useSettings();

  const [nypthoStatus, setNypthoStatus] = useState<{ ready?: boolean, version?: string }>({ ready: false });

  // Check Nyptho status when component mounts or when useNyptho changes
  useEffect(() => {
    async function checkNypthoStatus() {
      try {
        const response = await fetch('http://localhost:8000/nyptho/status');
        const data = await response.json();
        setNypthoStatus(data);
      } catch (error) {
        console.error("Error checking Nyptho status:", error);
        setNypthoStatus({ ready: false });
      }
    }
    
    checkNypthoStatus();
  }, []);

  const handlePersonaChange = (value: string) => {
    const persona = value as typeof aiPersona;
    setAiPersona(persona);
    
    // Automatically enable Nyptho when selecting the Nyptho persona
    if (persona === "nyptho") {
      setUseNyptho(true);
      toast.info("Nyptho Learning AI enabled");
    }
    
    toast.success(`AI persona updated to ${persona}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={20} />
        Back to Chat
      </Link>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the appearance of the application</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <Switch 
                  id="theme" 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                />
                <Moon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound">Notification Sound</Label>
                <div className="text-sm text-muted-foreground">
                  Enable or disable sound notifications
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="h-5 w-5 text-muted-foreground" />
                <Switch 
                  id="sound" 
                  checked={notificationSound} 
                  onCheckedChange={setNotificationSound} 
                />
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Configure your AI assistant's behavior and personality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Choose AI Persona</Label>
              <RadioGroup 
                value={aiPersona} 
                onValueChange={handlePersonaChange}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="academic" 
                    id="academic" 
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="academic"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Academic Advisor</span>
                    <span className="text-sm text-muted-foreground">Precise academic guidance</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="creative" 
                    id="creative" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="creative"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Creative Coach</span>
                    <span className="text-sm text-muted-foreground">More imaginative responses</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="technical" 
                    id="technical" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="technical"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Technical Assistant</span>
                    <span className="text-sm text-muted-foreground">Detailed technical help</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="supportive" 
                    id="supportive" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="supportive"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Supportive Guide</span>
                    <span className="text-sm text-muted-foreground">Encouraging and helpful</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="nyptho" 
                    id="nyptho" 
                    className="peer sr-only" 
                    disabled={!nypthoStatus.ready}
                  />
                  <Label
                    htmlFor="nyptho"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${!nypthoStatus.ready ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-base">Nyptho Learning AI</span>
                    <span className="text-sm text-muted-foreground">Advanced knowledge system</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="custom" 
                    id="custom" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="custom"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Custom AI</span>
                    <span className="text-sm text-muted-foreground">Customized traits below</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <Label>Adjust AI Traits</Label>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="helpfulness">Helpfulness: {aiTraits.helpfulness}%</Label>
                  </div>
                  <Slider
                    id="helpfulness"
                    min={0}
                    max={100}
                    step={5}
                    value={[aiTraits.helpfulness]}
                    onValueChange={(value) => updateAiTrait("helpfulness", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="creativity">Creativity: {aiTraits.creativity}%</Label>
                  </div>
                  <Slider
                    id="creativity"
                    min={0}
                    max={100}
                    step={5}
                    value={[aiTraits.creativity]}
                    onValueChange={(value) => updateAiTrait("creativity", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="precision">Precision: {aiTraits.precision}%</Label>
                  </div>
                  <Slider
                    id="precision"
                    min={0}
                    max={100}
                    step={5}
                    value={[aiTraits.precision]}
                    onValueChange={(value) => updateAiTrait("precision", value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="friendliness">Friendliness: {aiTraits.friendliness}%</Label>
                  </div>
                  <Slider
                    id="friendliness"
                    min={0}
                    max={100}
                    step={5}
                    value={[aiTraits.friendliness]}
                    onValueChange={(value) => updateAiTrait("friendliness", value[0])}
                  />
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nyptho">Nyptho AI Engine</Label>
                <div className="text-sm text-muted-foreground">
                  Use advanced Nyptho learning system {nypthoStatus.ready ? `(v${nypthoStatus.version})` : "(Unavailable)"}
                </div>
              </div>
              <Switch 
                id="nyptho" 
                checked={useNyptho} 
                onCheckedChange={setUseNyptho}
                disabled={!nypthoStatus.ready} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={resetToDefaults}>
              <RotateCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
