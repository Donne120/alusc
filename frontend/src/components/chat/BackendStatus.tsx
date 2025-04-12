
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Brain, Server, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiConfig } from "@/config/apiConfig";

export const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';
  const useHuggingFaceBackend = localStorage.getItem('USE_HUGGINGFACE_BACKEND') === 'true';
  const connectionChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple connection checks on component remount
    if (connectionChecked.current) return;
    
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const backendUrl = apiConfig.backendUrl;
        
        // Use a simple GET request instead of POST for faster checking
        const response = await fetch(`${backendUrl}/`, {
          method: "GET",
          // Reduced timeout for faster response
          signal: AbortSignal.timeout(5000)
        });
        
        setIsConnected(response.ok);
        if (!response.ok) {
          console.warn("Backend is not responding correctly");
        } else {
          // Use a less intrusive toast
          const backendType = useHuggingFaceBackend ? "HuggingFace" : useLocalBackend ? "local" : "ALU";
          toast.success(`Connected to ${backendType} backend`, { duration: 2000 });
        }
        connectionChecked.current = true;
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setIsConnected(false);
        
        // Only show error toast on first attempt
        if (!isRetrying) {
          const backendType = useHuggingFaceBackend ? "HuggingFace" : useLocalBackend ? "local" : "ALU";
          toast.error(`Could not connect to ${backendType} backend`, { duration: 3000 });
        }
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    };

    // Only check connection if backend is being used
    if (window.location.hostname !== 'localhost' || useLocalBackend || useHuggingFaceBackend) {
      checkConnection();
    } else {
      setIsLoading(false);
    }
    
    // Set up periodic refresh in the background (every 60 seconds)
    const intervalId = setInterval(() => {
      if (window.location.hostname !== 'localhost' || useLocalBackend || useHuggingFaceBackend) {
        setIsRetrying(true);
        checkConnection();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [useLocalBackend, useHuggingFaceBackend, isRetrying]);

  // Don't show anything if not using backend - improves performance
  if (!useLocalBackend && !useHuggingFaceBackend && window.location.hostname === 'localhost') return null;

  return (
    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2F3C] text-xs">
      {isLoading ? (
        <Server className="h-3 w-3 animate-pulse text-yellow-500" />
      ) : isConnected ? (
        useHuggingFaceBackend ? <Cloud className="h-3 w-3 text-blue-500" /> : <Brain className="h-3 w-3 text-green-500" />
      ) : (
        <Server className="h-3 w-3 text-red-500" />
      )}
      <span>
        {isLoading ? "Connecting..." : 
         isConnected ? 
           useHuggingFaceBackend ? "HuggingFace: Connected" : (useLocalBackend ? "Local Backend: Connected" : "ALU Brain: Connected") 
         : useHuggingFaceBackend ? "HuggingFace: Disconnected" : (useLocalBackend ? "Local Backend: Disconnected" : "ALU Backend: Disconnected")}
      </span>
    </Badge>
  );
};
