
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { FileText, Users, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  content: string;
}

export default function UploadPage() {
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<File[]>([]);
  const [profileFiles, setProfileFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const jdUploads: UploadedFile[] = await Promise.all(
        jobDescriptionFiles.map(async (file) => ({
          name: file.name,
          content: await readFileAsText(file),
        }))
      );

      const profileUploads: UploadedFile[] = await Promise.all(
        profileFiles.map(async (file) => ({
          name: file.name,
          content: await readFileAsText(file),
        }))
      );

      localStorage.setItem("jds", JSON.stringify(jdUploads));
      localStorage.setItem("profiles", JSON.stringify(profileUploads));

      toast({
        title: "Upload Successful",
        description: `${jdUploads.length} JDs and ${profileUploads.length} profiles have been saved.`,
        action: <CheckCircle className="text-green-500" />,
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error reading or saving the files.",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload Job Descriptions and consultant profiles. These documents will be available for comparison on the next page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jd-upload" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Job Descriptions
                </Label>
                <Input id="jd-upload" type="file" multiple accept=".txt,.md" onChange={(e) => setJobDescriptionFiles(Array.from(e.target.files || []))} />
                {jobDescriptionFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground pt-2">
                    <p>Selected {jobDescriptionFiles.length} JDs:</p>
                    <ul className="list-disc pl-5">
                      {jobDescriptionFiles.map((f) => <li key={f.name}>{f.name}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profiles-upload" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Consultant Profiles
                </Label>
                <Input id="profiles-upload" type="file" multiple accept=".txt,.md" onChange={(e) => setProfileFiles(Array.from(e.target.files || []))} />
                {profileFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground pt-2">
                    <p>Selected {profileFiles.length} profiles:</p>
                    <ul className="list-disc pl-5">
                      {profileFiles.map((f) => <li key={f.name}>{f.name}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
             <div className="flex gap-4">
              <Button onClick={handleUpload} disabled={isUploading || (jobDescriptionFiles.length === 0 && profileFiles.length === 0)}>
                {isUploading ? "Saving..." : "Save Documents"}
              </Button>
               <Button variant="outline" asChild>
                <Link href="/ar-dashboard/compare">Go to Compare</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
