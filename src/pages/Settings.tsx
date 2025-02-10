import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Moon, Sun, Bell, Globe, Lock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const Settings = () => {
  const settings = useSettings();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    settings.updateSettings({ theme: newTheme });
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleLanguageChange = (value: string) => {
    settings.updateSettings({ language: value });
    toast.success("Language updated successfully");
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
                  checked={settings.theme === "dark"}
                  onCheckedChange={handleThemeChange}
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
                checked={settings.display.showTimestamps}
                onCheckedChange={(checked) =>
                  settings.updateSettings({
                    display: { ...settings.display, showTimestamps: checked }
                  })
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
                checked={settings.display.compactMode}
                onCheckedChange={(checked) =>
                  settings.updateSettings({
                    display: { ...settings.display, compactMode: checked }
                  })
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
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                settings.updateSettings({ notifications: checked })
              }
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
            <Select value={settings.language} onValueChange={handleLanguageChange}>
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
                checked={settings.privacy.saveHistory}
                onCheckedChange={(checked) =>
                  settings.updateSettings({
                    privacy: { ...settings.privacy, saveHistory: checked }
                  })
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
                checked={settings.privacy.shareAnalytics}
                onCheckedChange={(checked) =>
                  settings.updateSettings({
                    privacy: { ...settings.privacy, shareAnalytics: checked }
                  })
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
