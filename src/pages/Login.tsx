import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">ALU</h1>
          <h2 className="text-3xl font-bold text-white mb-6">
            Welcome Back to ALU Student Companion
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@alustudent.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1A1F2C] border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1A1F2C] border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
          >
            Sign In
          </Button>
          <p className="text-center text-white mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#ea384c] hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}