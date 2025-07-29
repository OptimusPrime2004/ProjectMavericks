"use client";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Header from "../../components/Header";

export default function ARDashboard() {
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [topResumes, setTopResumes] = useState<any[]>([]); // Placeholder for resume data

  const handleJDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJdFile(e.target.files[0]);
    }
  };

  const handleJDSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    if (!jdFile) return;
    try {
      // Read file as text
      const text = await jdFile.text();
      // Upload JD
      const jdRes = await fetch("/api/upload-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: jdFile.name, content: text }),
      });
      if (!jdRes.ok) throw new Error("Failed to upload JD");
      // Fetch all resumes
      const resumesRes = await fetch("/api/upload-resume");
      const resumesData = await resumesRes.json();
      const resumes = resumesData.resumes || [];
      // Match resumes
      const matchRes = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: { name: jdFile.name, content: text }, resumes }),
      });
      if (!matchRes.ok) throw new Error("Failed to match resumes");
      const matchData = await matchRes.json();
      setTopResumes(matchData.matches || []);
    } catch (err) {
      setTopResumes([]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AR Requestor Dashboard</h1>
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Job Description</h2>
          <form onSubmit={handleJDSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="jd-upload">Job Description File</Label>
              <Input id="jd-upload" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleJDChange} />
            </div>
            <Button type="submit" disabled={uploading || !jdFile}>
              {uploading ? "Uploading..." : "Upload & Match Resumes"}
            </Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top 3 Matching Resumes</h2>
          {topResumes.length === 0 ? (
            <div className="text-gray-500">No results yet. Upload a JD to see matches.</div>
          ) : (
            <ol className="list-decimal pl-6">
              {topResumes.map((resume, idx) => (
                <li key={idx} className="mb-2">
                  <span className="font-medium">{resume.name}</span> — <span className="text-green-600 font-semibold">Score: {resume.score}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </>
  );
}
