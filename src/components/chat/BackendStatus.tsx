
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';

  useEffect(() => {
    if (!useLocalBackend) {
      setIsLoading(false);
      return;
    }

    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "test connection" }),
          // Timeout after 5 seconds
          signal: AbortSignal.timeout(5000)
        });
        
        setIsConnected(response.ok);
        if (!response.ok) {
          toast.error("Local ALU backend is not responding correctly");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setIsConnected(false);
        toast.error("Could not connect to local ALU backend");
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [useLocalBackend]);

  if (!useLocalBackend) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2F3C] text-xs">
      <div 
        className={`w-2 h-2 rounded-full ${
          isLoading ? "bg-yellow-500 animate-pulse" : 
          isConnected ? "bg-green-500" : "bg-red-500"
        }`} 
      />
      <span>
        {isLoading ? "Connecting to ALU backend..." : 
         isConnected ? "ALU Backend: Connected" : "ALU Backend: Disconnected"}
      </span>
    </div>
  );
};
