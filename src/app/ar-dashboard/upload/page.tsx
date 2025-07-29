
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { FileText, Users, CheckCircle, XIcon } from "lucide-react";
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
  
  const [storedJds, setStoredJds] = useState<UploadedFile[]>([]);
  const [storedProfiles, setStoredProfiles] = useState<UploadedFile[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const jdsFromStorage = localStorage.getItem("jds");
      if (jdsFromStorage) {
        setStoredJds(JSON.parse(jdsFromStorage));
      }
      const profilesFromStorage = localStorage.getItem("profiles");
      if (profilesFromStorage) {
        setStoredProfiles(JSON.parse(profilesFromStorage));
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error loading stored files",
        description: "Could not read files from local storage.",
      });
    }
  }, [toast]);


  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (jobDescriptionFiles.length === 0 && profileFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select files to upload.",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const newJdUploads: UploadedFile[] = await Promise.all(
        jobDescriptionFiles.map(async (file) => ({
          name: file.name,
          content: await readFileAsText(file),
        }))
      );

      const newProfileUploads: UploadedFile[] = await Promise.all(
        profileFiles.map(async (file) => ({
          name: file.name,
          content: await readFileAsText(file),
        }))
      );

      const updatedJds = [...storedJds, ...newJdUploads];
      const updatedProfiles = [...storedProfiles, ...newProfileUploads];

      localStorage.setItem("jds", JSON.stringify(updatedJds));
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
      
      setStoredJds(updatedJds);
      setStoredProfiles(updatedProfiles);
      
      setJobDescriptionFiles([]);
      setProfileFiles([]);

      toast({
        title: "Upload Successful",
        description: `${newJdUploads.length} JDs and ${newProfileUploads.length} profiles have been saved.`,
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

  const handleRemoveFile = (fileName: string, type: 'jds' | 'profiles') => {
    try {
      if (type === 'jds') {
        const updatedJds = storedJds.filter(f => f.name !== fileName);
        setStoredJds(updatedJds);
        localStorage.setItem('jds', JSON.stringify(updatedJds));
      } else {
        const updatedProfiles = storedProfiles.filter(f => f.name !== fileName);
        setStoredProfiles(updatedProfiles);
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      }
      toast({
        title: "File Removed",
        description: `${fileName} has been removed.`,
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error removing file",
        description: "Could not remove the file from local storage.",
      });
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Documents</CardTitle>
            <CardDescription>
              Select new Job Descriptions and consultant profiles to add them to the system.
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
                    <p>Selected to upload: {jobDescriptionFiles.length} JDs</p>
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
                    <p>Selected to upload: {profileFiles.length} profiles</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Manage Uploaded Documents</CardTitle>
            <CardDescription>
                Review and remove existing documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className='space-y-2'>
                <h3 className='font-medium'>Job Descriptions ({storedJds.length})</h3>
                <div className='border rounded-md p-2 space-y-1 max-h-60 overflow-y-auto'>
                    {storedJds.length > 0 ? storedJds.map(file => (
                        <div key={file.name} className='flex items-center justify-between p-2 rounded-md hover:bg-muted'>
                            <span className='text-sm'>{file.name}</span>
                            <Button variant="ghost" size="icon" className='h-6 w-6' onClick={() => handleRemoveFile(file.name, 'jds')}>
                                <XIcon className='h-4 w-4 text-destructive' />
                            </Button>
                        </div>
                    )) : <p className='text-sm text-muted-foreground p-2'>No JDs uploaded yet.</p>}
                </div>
            </div>
             <div className='space-y-2'>
                <h3 className='font-medium'>Consultant Profiles ({storedProfiles.length})</h3>
                <div className='border rounded-md p-2 space-y-1 max-h-60 overflow-y-auto'>
                    {storedProfiles.length > 0 ? storedProfiles.map(file => (
                        <div key={file.name} className='flex items-center justify-between p-2 rounded-md hover:bg-muted'>
                            <span className='text-sm'>{file.name}</span>
                             <Button variant="ghost" size="icon" className='h-6 w-6' onClick={() => handleRemoveFile(file.name, 'profiles')}>
                                <XIcon className='h-4 w-4 text-destructive' />
                            </Button>
                        </div>
                    )) : <p className='text-sm text-muted-foreground p-2'>No profiles uploaded yet.</p>}
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
