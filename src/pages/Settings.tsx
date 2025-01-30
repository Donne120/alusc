import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Moon, Sun, Bell, Globe, Lock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState({
    saveHistory: true,
    shareAnalytics: false,
  });
  const [display, setDisplay] = useState({
    showTimestamps: true,
    compactMode: false,
  });

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme} mode`,
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language Updated",
      description: "Application language has been changed",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Sun className="h-5 w-5" />
            Theme & Display
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    handleThemeChange(checked ? "dark" : "light")
                  }
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Timestamps</Label>
                <div className="text-sm text-muted-foreground">
                  Display message timestamps
                </div>
              </div>
              <Switch
                checked={display.showTimestamps}
                onCheckedChange={(checked) =>
                  setDisplay((prev) => ({ ...prev, showTimestamps: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Reduce spacing between messages
                </div>
              </div>
              <Switch
                checked={display.compactMode}
                onCheckedChange={(checked) =>
                  setDisplay((prev) => ({ ...prev, compactMode: checked }))
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive notifications for new messages
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5" />
            Language
          </h2>
          <div className="space-y-2">
            <Label>Select Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5" />
            Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Save Chat History</Label>
                <div className="text-sm text-muted-foreground">
                  Store conversation history locally
                </div>
              </div>
              <Switch
                checked={privacy.saveHistory}
                onCheckedChange={(checked) =>
                  setPrivacy((prev) => ({ ...prev, saveHistory: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Analytics</Label>
                <div className="text-sm text-muted-foreground">
                  Help improve the chatbot with usage data
                </div>
              </div>
              <Switch
                checked={privacy.shareAnalytics}
                onCheckedChange={(checked) =>
                  setPrivacy((prev) => ({ ...prev, shareAnalytics: checked }))
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5" />
            Chat Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-scroll to Bottom</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically scroll to new messages
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;