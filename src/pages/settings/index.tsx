import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Moon, Sun, Monitor, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

// Sound file for testing message sounds
const messageSound = new Audio("/message.mp3");

export default function Settings() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifications") === "true"
  );
  const [messageSound, setMessageSound] = useState(
    localStorage.getItem("messageSound") === "true"
  );
  const [sendWithEnter, setSendWithEnter] = useState(
    localStorage.getItem("sendWithEnter") !== "false"
  );
  const [selfImprovement, setSelfImprovement] = useState(
    localStorage.getItem("selfImprovement") === "true"
  );
  const { theme, setTheme } = useTheme();

  // Test sound when enabling message sounds
  const handleMessageSoundChange = (checked: boolean) => {
    setMessageSound(checked);
    localStorage.setItem("messageSound", String(checked));
    if (checked) {
      // Play test sound
      messageSound.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    }
    toast.success(`Message sound ${checked ? "enabled" : "disabled"}`);
  };

  const handleSendWithEnterChange = (checked: boolean) => {
    setSendWithEnter(checked);
    localStorage.setItem("sendWithEnter", String(checked));
    toast.success(`Send with Enter ${checked ? "enabled" : "disabled"}`);
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem("notifications", String(checked));
    toast.success(`Notifications ${checked ? "enabled" : "disabled"}`);
  };

  const handleSelfImprovementChange = (checked: boolean) => {
    setSelfImprovement(checked);
    localStorage.setItem("selfImprovement", String(checked));
    toast.success(`Self-improvement mode ${checked ? "enabled" : "disabled"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={20} />
          Back to Chat
        </Link>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how ALU Student Companion looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun size={16} />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon size={16} />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor size={16} />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat Preferences</CardTitle>
              <CardDescription>
                Customize your chat experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Message Sound</Label>
                  <p className="text-sm text-muted-foreground">
                    Play a sound when messages are sent and received
                  </p>
                </div>
                <Switch
                  checked={messageSound}
                  onCheckedChange={handleMessageSoundChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send with Enter</Label>
                  <p className="text-sm text-muted-foreground">
                    Press Enter to send messages (Shift + Enter for new line)
                  </p>
                </div>
                <Switch
                  checked={sendWithEnter}
                  onCheckedChange={handleSendWithEnterChange}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    Self-Improvement Mode
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the chat to learn and improve from your conversations
                  </p>
                </div>
                <Switch
                  checked={selfImprovement}
                  onCheckedChange={handleSelfImprovementChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new messages and updates
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
