'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const handleLogout = () => {
    // TODO: Clear session/auth state
    router.push("/login");
  };
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow mb-8">
      <div className="flex items-center gap-6">
        <Link href="/ar-dashboard" className="font-semibold text-lg hover:text-blue-600 transition">AR Dashboard</Link>
        <Link href="/recruiter-admin" className="font-semibold text-lg hover:text-blue-600 transition">Recruiter Dashboard</Link>
      </div>
      <Button variant="outline" onClick={handleLogout}>Logout</Button>
    </header>
  );
}
