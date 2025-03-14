
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
import { 
  Settings, User, School, Building2, FileText, Globe, 
  BookOpen, Bell, MessageSquare, Lock, Database, 
  BrainCircuit, Clock, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
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
  }, []);

  const saveSettings = () => {
    // Save all settings
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
    
    toast.success("Settings saved successfully");
  };

  const toggleUseLocalBackend = (checked: boolean) => {
    setUseLocalBackend(checked);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 px-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={20} />
          Back to Chat
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <BackendStatus />
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span className="hidden sm:inline">Academic</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden sm:inline">AI Models</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Customize your experience with ALU Assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Appearance</h3>
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)} className="justify-start">
                            <ToggleGroupItem value="light">Light</ToggleGroupItem>
                            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                            <ToggleGroupItem value="system">System</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Language</h3>
                        <div className="space-y-2">
                          <Label>Interface Language</Label>
                          <ToggleGroup type="single" value={language} onValueChange={(value) => value && setLanguage(value)} className="justify-start">
                            <ToggleGroupItem value="english">English</ToggleGroupItem>
                            <ToggleGroupItem value="french">French</ToggleGroupItem>
                            <ToggleGroupItem value="swahili">Swahili</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Behavior</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-save Conversations</Label>
                          <p className="text-sm text-muted-foreground">
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
                          <Label>Notifications</Label>
                          <p className="text-sm text-muted-foreground">
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
                          <Label>Accessibility Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enhanced readability and screen reader support
                          </p>
                        </div>
                        <Switch 
                          checked={accessibilityMode} 
                          onCheckedChange={setAccessibilityMode} 
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data</h3>
                      <div className="space-y-2">
                        <Label>Chat History Retention</Label>
                        <ToggleGroup type="single" value={historyRetention} onValueChange={(value) => value && setHistoryRetention(value)} className="justify-start">
                          <ToggleGroupItem value="7days">7 Days</ToggleGroupItem>
                          <ToggleGroupItem value="30days">30 Days</ToggleGroupItem>
                          <ToggleGroupItem value="90days">90 Days</ToggleGroupItem>
                          <ToggleGroupItem value="forever">Forever</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <Button variant="outline" className="mt-2">
                        Clear Chat History
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Role Selection</h3>
                    <div className="space-y-2">
                      <Label>User Role</Label>
                      <ToggleGroup type="single" value={userRole} onValueChange={(value) => value && setUserRole(value)} className="justify-start">
                        <ToggleGroupItem value="student">Student</ToggleGroupItem>
                        <ToggleGroupItem value="faculty">Faculty</ToggleGroupItem>
                        <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
                      </ToggleGroup>
                      <p className="text-sm text-muted-foreground">
                        Your role determines what features you have access to
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="student@alueducation.com" disabled />
                        <p className="text-xs text-muted-foreground">
                          Your ALU email address (cannot be changed)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="flex gap-2">
                          <Input id="password" type="password" value="••••••••" disabled />
                          <Button variant="outline">Change</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" placeholder="Your Name" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Academic Settings */}
            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Settings</CardTitle>
                  <CardDescription>
                    Configure academic preferences and course-related settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Program Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Current Program</Label>
                        <Input id="program" placeholder="Global Challenges" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Academic Year</Label>
                        <Input id="year" placeholder="2024-2025" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus</Label>
                        <Input id="campus" placeholder="Rwanda" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input id="major" placeholder="Computer Science" />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Course Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Course Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your enrolled courses
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Assignment Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about upcoming assignments
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Resource Recommendations</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive personalized resource recommendations
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Settings</CardTitle>
                  <CardDescription>
                    Configure AI models and backend connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Connection Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Use ALU Backend</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to local ALU knowledge base on http://localhost:8000
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
                        <p className="text-xs text-muted-foreground">
                          You can get your API key from the Google AI Studio
                        </p>
                      </div>
                    )}

                    <Separator />

                    <h3 className="text-lg font-medium">Model Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Response Style</Label>
                        <ToggleGroup type="single" defaultValue="balanced" className="justify-start">
                          <ToggleGroupItem value="creative">Creative</ToggleGroupItem>
                          <ToggleGroupItem value="balanced">Balanced</ToggleGroupItem>
                          <ToggleGroupItem value="precise">Precise</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Knowledge Cutoff</Label>
                        <ToggleGroup type="single" defaultValue="latest" className="justify-start">
                          <ToggleGroupItem value="2022">2022</ToggleGroupItem>
                          <ToggleGroupItem value="2023">2023</ToggleGroupItem>
                          <ToggleGroupItem value="latest">Latest</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Admin Settings */}
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>
                    Advanced settings for administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Admin Features</h3>
                        <p className="text-sm text-muted-foreground">
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
                        <Separator />
                        
                        <h3 className="text-lg font-medium">User Management</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Batch User Import</Label>
                              <p className="text-sm text-muted-foreground">
                                Import users from CSV or Excel files
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Import
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>User Permissions</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure access levels and permissions
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Lock className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        <Separator />
                        
                        <h3 className="text-lg font-medium">System Configuration</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Database Settings</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure database connection and backup settings
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Database className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>API Endpoints</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure external API connections
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Globe className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Scheduled Tasks</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure periodic background tasks
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Clock className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        <Separator />
                        
                        <h3 className="text-lg font-medium">Integration Management</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Learning Management System</Label>
                              <p className="text-sm text-muted-foreground">
                                Connect to Canvas, Moodle, or other LMS
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Notification Services</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure email and push notification services
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Bell className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Chat Interface</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure chatbot behavior and responses
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
