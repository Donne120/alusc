import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const [geminiApiKey, setGeminiApiKey] = useState(
    localStorage.getItem("GEMINI_API_KEY") || ""
  );

  const handleGeminiApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setGeminiApiKey(newKey);
    localStorage.setItem("GEMINI_API_KEY", newKey);
    if (newKey) {
      toast.success("Gemini API key saved");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleGoBack}>
          Back
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure AI model settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Google Gemini API Key</Label>
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={handleGeminiApiKeyChange}
                  placeholder="Enter your Gemini API key"
                  className="max-w-md"
                />
                <p className="text-sm text-muted-foreground">
                  Required for AI responses. Get your API key from{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
