import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">ALU</h1>
          <h2 className="text-3xl font-bold text-white mb-6">
            Welcome to ALU Student Companion
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
              <label htmlFor="name" className="block text-white mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Create a password"
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
            Sign Up
          </Button>
          <p className="text-center text-white mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ea384c] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}