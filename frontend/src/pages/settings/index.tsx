import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { BackendStatus } from "../../components/chat/BackendStatus";
import { aiService } from "../../services/aiService";

export default function Settings() {
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [activeModel, setActiveModel] = useState("gemini");
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedModel = localStorage.getItem("ACTIVE_MODEL") || "gemini";
    const savedAccessibilityMode = localStorage.getItem("ACCESSIBILITY_MODE") === "true";

    setActiveModel(savedModel);
    setAccessibilityMode(savedAccessibilityMode);
  }, []);

  const handleAccessibilityChange = (value: boolean) => {
    setAccessibilityMode(value);
    localStorage.setItem("ACCESSIBILITY_MODE", value.toString());
    toast({
      title: "Accessibility Mode",
      description: `Accessibility mode ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleModelChange = (model: string) => {
    setActiveModel(model);
    localStorage.setItem("ACTIVE_MODEL", model);
    toast({
      title: "Active Model",
      description: `Active model set to ${model}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={20} />
          Back to Chat
        </Link>

        <Tabs defaultValue="general" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Enable accessibility mode for improved readability.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">Accessibility Mode</p>
                    <p className="text-sm text-muted-foreground">Enable larger fonts and improved contrast.</p>
                  </div>
                  <Switch id="accessibility" checked={accessibilityMode} onCheckedChange={handleAccessibilityChange} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Model</CardTitle>
                <CardDescription>Choose the AI model to use for chat responses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">Active Model</p>
                    <p className="text-sm text-muted-foreground">Select the AI model for generating responses.</p>
                  </div>
                  <select
                    className="bg-background border rounded px-2 py-1 text-foreground"
                    value={activeModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                  >
                    <option value="gemini">Gemini</option>
                    <option value="gpt">GPT</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <BackendStatus />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About ALU Student Companion</CardTitle>
                <CardDescription>Information about this project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p>
                    ALU Student Companion is an AI-powered assistant designed to help ALU students with their academic and
                    administrative needs.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provides quick answers to common questions</li>
                    <li>Assists with task and schedule management</li>
                    <li>Offers guidance on assignments and resources</li>
                    <li>Connects students with relevant departments</li>
                  </ul>
                  <p>
                    This project is developed by students at the African Leadership University to improve the student
                    experience.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">
                  <InfoIcon className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
