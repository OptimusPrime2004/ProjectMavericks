import "./globals.css";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  // TODO: Replace with real authentication check
  const isAuthenticated = true; // Set to false to force login for now
  if (!isAuthenticated && typeof window !== "undefined") {
    redirect("/login");
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
