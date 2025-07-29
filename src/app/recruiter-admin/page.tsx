"use client";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Header from "../../components/Header";

export default function RecruiterDashboard() {
  const [resumeFiles, setResumeFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [jdMatches, setJdMatches] = useState<any[]>([]); // Placeholder for JD and matches

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFiles(e.target.files);
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    if (!resumeFiles) return;
    try {
      // Upload each resume
      for (let i = 0; i < resumeFiles.length; i++) {
        const file = resumeFiles[i];
        const text = await file.text();
        await fetch("/api/upload-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, content: text }),
        });
      }
      // Fetch all JDs
      const jdsRes = await fetch("/api/upload-jd");
      const jdsData = await jdsRes.json();
      const jds = jdsData.jds || [];
      // Fetch matches for each JD
      const matches = await Promise.all(jds.map(async (jd: any) => {
        const resumesRes = await fetch("/api/upload-resume");
        const resumesData = await resumesRes.json();
        const resumes = resumesData.resumes || [];
        const matchRes = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jd, resumes }),
        });
        const matchData = await matchRes.json();
        return {
          jd: jd.name,
          matches: matchData.matches || [],
        };
      }));
      setJdMatches(matches);
    } catch (err) {
      setJdMatches([]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Resumes</h2>
          <form onSubmit={handleResumeSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="resume-upload">Resume Files</Label>
              <Input id="resume-upload" type="file" accept=".pdf,.doc,.docx,.txt" multiple onChange={handleResumeChange} />
            </div>
            <Button type="submit" disabled={uploading || !resumeFiles}>
              {uploading ? "Uploading..." : "Upload Resumes"}
            </Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Job Descriptions & Matches</h2>
          {jdMatches.length === 0 ? (
            <div className="text-gray-500">No job descriptions or matches yet. Upload resumes to see matches.</div>
          ) : (
            <div className="space-y-6">
              {jdMatches.map((jd, idx) => (
                <div key={idx}>
                  <div className="font-semibold mb-2">{jd.jd}</div>
                  <ol className="list-decimal pl-6">
                    {jd.matches.map((resume: any, i: number) => (
                      <li key={i} className="mb-1">
                        <span className="font-medium">{resume.name}</span> — <span className="text-green-600 font-semibold">Score: {resume.score}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
