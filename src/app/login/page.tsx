"use client";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<string>("ar-requestor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with real authentication logic
    if (email && password) {
      if (role === "ar-requestor") {
        router.push("/ar-dashboard");
      } else {
        router.push("/recruiter-admin");
      }
    } else {
      setError("Please enter email and password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1"
            >
              <option value="ar-requestor">AR Requestor</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </div>
  );
} 