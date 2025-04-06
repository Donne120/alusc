
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Brain, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';
  
  // Get backend URL - use environment variable or default to local for development
  const getBackendUrl = () => {
    // Check if a BACKEND_URL is set in localStorage (for testing)
    const storedBackendUrl = localStorage.getItem('BACKEND_URL');
    if (storedBackendUrl) return storedBackendUrl;
    
    // Local development mode
    if (useLocalBackend) return "http://localhost:8000";
    
    // Production deployment URL - change this to your Render deployment URL
    return "https://alu-chatbot-backend.onrender.com";
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const backendUrl = getBackendUrl();
        
        const response = await fetch(`${backendUrl}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "test connection" }),
          // Timeout after 8 seconds (increased for potentially slower response from deployed backend)
          signal: AbortSignal.timeout(8000)
        });
        
        setIsConnected(response.ok);
        if (!response.ok) {
          toast.error("ALU backend is not responding correctly");
        } else {
          toast.success("Connected to ALU knowledge base");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setIsConnected(false);
        toast.error("Could not connect to ALU backend");
      } finally {
        setIsLoading(false);
      }
    };

    // Only check connection if backend is being used
    if (window.location.hostname !== 'localhost' || useLocalBackend) {
      checkConnection();
    } else {
      setIsLoading(false);
    }
  }, [useLocalBackend]);

  // Don't show anything if not using backend
  if (!useLocalBackend && window.location.hostname === 'localhost') return null;

  return (
    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2F3C] text-xs">
      {isLoading ? (
        <Server className="h-3 w-3 animate-pulse text-yellow-500" />
      ) : isConnected ? (
        <Brain className="h-3 w-3 text-green-500" />
      ) : (
        <Server className="h-3 w-3 text-red-500" />
      )}
      <span>
        {isLoading ? "Connecting to ALU backend..." : 
         isConnected ? "ALU Brain: Connected" : "ALU Backend: Disconnected"}
      </span>
    </Badge>
  );
};
