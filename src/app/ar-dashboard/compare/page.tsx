
"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Loader2, Wand2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// import { handleCompareProfiles, handleSendNotification, type MatchResult } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UploadedFile {
  name: string;
  content: string;
}

interface GeneratedEmail {
  emailSubject: string;
  emailBody: string;
}

export default function ComparePage() {
  const [isComparing, startComparing] = useTransition();
  const [isNotifying, startNotifying] = useTransition();
  const { toast } = useToast();

  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<UploadedFile[]>([]);
  const [profileFiles, setProfileFiles] = useState<UploadedFile[]>([]);

  const [selectedJdForComparison, setSelectedJdForComparison] = useState<string>('');
  const [selectedProfilesForComparison, setSelectedProfilesForComparison] = useState<Record<string, boolean>>({});

  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);


  useEffect(() => {
    try {
      const storedJds = localStorage.getItem("jds");
      if (storedJds) {
        setJobDescriptionFiles(JSON.parse(storedJds));
      }
      const storedProfiles = localStorage.getItem("profiles");
      if (storedProfiles) {
        setProfileFiles(JSON.parse(storedProfiles));
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Could not load files",
            description: "There was an error reading files from local storage."
        })
    }
  }, [toast]);

  const handleProfileSelectionChange = (fileName: string) => {
    setSelectedProfilesForComparison(prev => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };
  
  const handleCompare = () => {
    const selectedProfileNames = Object.keys(selectedProfilesForComparison).filter(name => selectedProfilesForComparison[name]);
    const selectedJd = jobDescriptionFiles.find(jd => jd.name === selectedJdForComparison);

    if (!selectedJd || selectedProfileNames.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Selections",
        description: "Please select a Job Description and at least one Profile to compare.",
      });
      return;
    }

    setMatchResults(null);
    setGeneratedEmail(null);

    startComparing(async () => {
      try {
        const profilesToCompare = profileFiles.filter(p => selectedProfileNames.includes(p.name));

        // const result = await handleCompareProfiles({
        //   jobDescription: selectedJd.content,
        //   profiles: profilesToCompare,
        // });

        // if (result.success && result.matches) {
        //   setMatchResults(result.matches);
        // } else {
        //    toast({
        //     variant: "destructive",
        //     title: "Comparison Failed",
        //     description: result.error || "An unknown error occurred.",
        //   });
          setMatchResults(null);
        // }
      } catch (e) {
         toast({
          variant: "destructive",
          title: "Error during comparison",
          description: `An unexpected error occurred. ${e instanceof Error ? e.message : ''}`,
        });
        setMatchResults(null);
      }
    });
  };

  const handleNotify = () => {
    if (!matchResults || !selectedJdForComparison) return;

    startNotifying(async () => {
        // const result = await handleSendNotification({
        //     jobDescriptionName: selectedJdForComparison,
        //     matches: matchResults,
        // });

        // if (result.success && result.email) {
        //     setGeneratedEmail(result.email);
        //     setIsNotifyDialogOpen(true);
        // } else {
        //     toast({
        //         variant: "destructive",
        //         title: "Notification Failed",
        //         description: result.error || "Could not generate notification.",
        //     });
        // }
    });
  };

  const selectedProfilesCount = Object.values(selectedProfilesForComparison).filter(Boolean).length;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Run Comparison</CardTitle>
            <CardDescription>Choose one JD and one or more profiles, then run the AI comparison workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Select Job Description</Label>
                <Select value={selectedJdForComparison} onValueChange={setSelectedJdForComparison} disabled={jobDescriptionFiles.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a JD..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobDescriptionFiles.map(file => (
                      <SelectItem key={file.name} value={file.name}>
                        {file.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Consultant Profiles</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                  {profileFiles.length > 0 ? profileFiles.map(file => (
                    <div key={file.name} className="flex items-center space-x-2">
                      <Checkbox 
                        id={file.name} 
                        checked={!!selectedProfilesForComparison[file.name]}
                        onCheckedChange={() => handleProfileSelectionChange(file.name)}
                      />
                      <Label htmlFor={file.name} className="font-normal cursor-pointer">{file.name}</Label>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">Upload profiles to see them here.</p>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={handleCompare} disabled={isComparing || !selectedJdForComparison || selectedProfilesCount === 0}>
               {isComparing ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" />
                  Compare Profiles
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {matchResults && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Comparison Results</CardTitle>
                        <CardDescription>Ranked profiles based on their match with the Job Description.</CardDescription>
                    </div>
                    <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleNotify} disabled={isNotifying}>
                                {isNotifying ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2" />
                                        Notify Hiring Manager
                                    </>
                                )}
                            </Button>
                        </DialogTrigger>
                        {generatedEmail && (
                            <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>{generatedEmail.emailSubject}</DialogTitle>
                                    <DialogDescription>
                                       This is a preview of the email that will be sent to the hiring manager.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4" dangerouslySetInnerHTML={{ __html: generatedEmail.emailBody }} />
                            </DialogContent>
                        )}
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    {matchResults.map((result, index) => (
                        <Card key={index} className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{result.profileName}</span>
                                    <Badge variant={result.matchScore > 85 ? 'default' : result.matchScore > 70 ? 'secondary' : 'destructive'}>{result.matchScore}% Match</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-semibold">Justification:</p>
                                <p className="text-sm text-muted-foreground">{result.justification}</p>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
