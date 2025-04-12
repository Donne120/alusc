
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const BackendSelector = () => {
  const [selectedBackend, setSelectedBackend] = useState<string>("default");
  
  useEffect(() => {
    // Load saved backend preference
    if (localStorage.getItem('USE_HUGGINGFACE_BACKEND') === 'true') {
      setSelectedBackend("huggingface");
    } else if (localStorage.getItem('USE_LOCAL_BACKEND') === 'true') {
      setSelectedBackend("local");
    } else {
      setSelectedBackend("default");
    }
  }, []);
  
  const handleBackendChange = (value: string) => {
    setSelectedBackend(value);
    
    // Update localStorage based on selection
    localStorage.removeItem('USE_LOCAL_BACKEND');
    localStorage.removeItem('USE_HUGGINGFACE_BACKEND');
    
    if (value === "local") {
      localStorage.setItem('USE_LOCAL_BACKEND', 'true');
      toast.success("Using local backend at http://localhost:8000");
    } else if (value === "huggingface") {
      localStorage.setItem('USE_HUGGINGFACE_BACKEND', 'true');
      toast.success("Using HuggingFace backend");
    } else {
      toast.success("Using default backend");
    }
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend Connection</CardTitle>
        <CardDescription>
          Select which backend service the chatbot should connect to
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedBackend} onValueChange={handleBackendChange} className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="default" />
            <Label htmlFor="default">ALU Cloud Backend (Default)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="huggingface" id="huggingface" />
            <Label htmlFor="huggingface">HuggingFace (ngum-alu-chatbot)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local">Local Development</Label>
          </div>
        </RadioGroup>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="mt-4 w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Connection
        </Button>
      </CardContent>
    </Card>
  );
};
