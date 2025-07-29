
"use client";

import { useState, useMemo, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { arDashboardData, recruiterJds, consultantProfiles, type JobDescription, type ConsultantProfile } from "@/lib/data";
import { FileCheck, Users, Mail, ArrowRight, User, FileText, Briefcase, Star, Clock, Upload, Loader2, Wand2, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WorkflowProgress from "@/components/WorkflowProgress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleCompareProfiles, type MatchResult } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";

function DetailsCard({ item, type }: { item: JobDescription | ConsultantProfile | null; type: 'jds' | 'profiles' }) {
  if (!item) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Select an item from the dropdown to see its details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No item selected.</p>
        </CardContent>
      </Card>
    );
  }

  const isJd = type === 'jds';
  const jd = isJd ? item as JobDescription : null;
  const profile = !isJd ? item as ConsultantProfile : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isJd ? jd?.title : profile?.name}</CardTitle>
        <CardDescription>{isJd ? `Details for Job Description ID: ${jd?.id}` : `Details for Profile ID: ${profile?.id}`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{profile.title}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{item.experience}</span>
        </div>
         {jd && (
          <div className="flex items-center gap-2">
             <Badge variant={jd.status === 'Open' ? 'default' : jd.status === 'Interviewing' ? 'secondary' : 'outline'} className="capitalize">
              {jd.status}
            </Badge>
          </div>
        )}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 pl-7">
            {item.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function ARDashboardPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [view, setView] = useState<'profiles' | 'jds'>('profiles');
  const [selectedItem, setSelectedItem] = useState('');
  
  const [jobDescriptionFiles, setJobDescriptionFiles] = useState<File[]>([]);
  const [profileFiles, setProfileFiles] = useState<File[]>([]);
  
  const [selectedJdForComparison, setSelectedJdForComparison] = useState<string>('');
  const [selectedProfilesForComparison, setSelectedProfilesForComparison] = useState<Record<string, boolean>>({});

  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);

  const { jdComparisonStatus, topMatchesStatus, emailNotificationStatus, topMatches } = arDashboardData;

  const statusIcons = {
    "JD Comparison": <FileCheck className="h-4 w-4 text-muted-foreground" />,
    "Top Matches": <Users className="h-4 w-4 text-muted-foreground" />,
    "Email Notification": <Mail className="h-4 w-4 text-muted-foreground" />,
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Listed':
      case 'Sent':
        return 'default';
      case 'In Progress':
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  const handleViewChange = (value: 'profiles' | 'jds') => {
    setView(value);
    setSelectedItem('');
  };
  
  const dropdownOptions = view === 'profiles' ? consultantProfiles : recruiterJds;

  const selectedObject = useMemo(() => {
    if (!selectedItem) return null;
    return dropdownOptions.find(option => option.id === selectedItem) || null;
  }, [selectedItem, dropdownOptions]);

  const handleFileRead = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  const handleProfileSelectionChange = (fileName: string) => {
    setSelectedProfilesForComparison(prev => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };
  
  const handleCompare = () => {
    const jdFile = jobDescriptionFiles.find(f => f.name === selectedJdForComparison);
    const selectedProfileFiles = profileFiles.filter(f => selectedProfilesForComparison[f.name]);

    if (!jdFile || selectedProfileFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Selections",
        description: "Please select a Job Description and at least one Profile to compare.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const jdContent = await handleFileRead(jdFile);
        const profilesContent = await Promise.all(
            selectedProfileFiles.map(async (file) => ({
                name: file.name,
                content: await handleFileRead(file),
            }))
        );

        const result = await handleCompareProfiles({
          jobDescription: jdContent,
          profiles: profilesContent,
        });

        if (result.success && result.matches) {
          setMatchResults(result.matches);
        } else {
           toast({
            variant: "destructive",
            title: "Comparison Failed",
            description: result.error || "An unknown error occurred.",
          });
          setMatchResults(null);
        }
      } catch (e) {
         toast({
          variant: "destructive",
          title: "Error Reading Files",
          description: "Could not read the selected files.",
        });
        setMatchResults(null);
      }
    });
  };

  const selectedProfilesCount = Object.values(selectedProfilesForComparison).filter(Boolean).length;


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
         <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Upload Job Descriptions and consultant profiles to prepare them for comparison.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jd-upload" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Job Descriptions</Label>
                <Input id="jd-upload" type="file" multiple accept=".txt,.md" onChange={(e) => setJobDescriptionFiles(Array.from(e.target.files || []))} />
                 {jobDescriptionFiles.length > 0 && 
                  <div className="text-sm text-muted-foreground pt-2">
                      <p>Uploaded {jobDescriptionFiles.length} JDs:</p>
                      <ul className="list-disc pl-5">
                          {jobDescriptionFiles.map(f => <li key={f.name}>{f.name}</li>)}
                      </ul>
                  </div>
                 }
              </div>
              <div className="space-y-2">
                 <Label htmlFor="profiles-upload" className="flex items-center gap-2"><Users className="h-4 w-4" /> Consultant Profiles</Label>
                <Input id="profiles-upload" type="file" multiple accept=".txt,.md" onChange={(e) => setProfileFiles(Array.from(e.target.files || []))} />
                 {profileFiles.length > 0 && <div className="text-sm text-muted-foreground pt-2">
                    <p>Uploaded {profileFiles.length} profiles:</p>
                    <ul className="list-disc pl-5">
                        {profileFiles.map(f => <li key={f.name}>{f.name}</li>)}
                    </ul>
                 </div>}
              </div>
            </div>
          </CardContent>
        </Card>

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

            <Button onClick={handleCompare} disabled={isPending || !selectedJdForComparison || selectedProfilesCount === 0}>
               {isPending ? (
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
                <CardHeader>
                    <CardTitle>Comparison Results</CardTitle>
                    <CardDescription>Ranked profiles based on their match with the Job Description.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {matchResults.map((result, index) => (
                        <Card key={index} className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{result.profileName}</span>
                                    <Badge variant={result.matchScore > 85 ? 'default' : 'secondary'}>{result.matchScore}% Match</Badge>
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

        <Card>
          <CardHeader>
            <CardTitle>Dashboard View</CardTitle>
            <CardDescription>Select a profile or job description to see the matching details.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center">
             <RadioGroup value={view} onValueChange={handleViewChange} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="profiles" id="r1" />
                  <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4"/>
                    Profiles
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jds" id="r2" />
                  <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Job Descriptions
                  </Label>
                </div>
              </RadioGroup>

            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder={`Select a ${view === 'profiles' ? 'profile' : 'JD'}...`} />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                     {view === 'profiles' ? option.name : (option as JobDescription).title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedObject && (
          <DetailsCard item={selectedObject} type={view} />
        )}

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">JD Comparison</CardTitle>
              {statusIcons["JD Comparison"]}
            </CardHeader>
            <CardContent>
              <Badge variant={getBadgeVariant(jdComparisonStatus)} className="capitalize">{jdComparisonStatus}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Matches</CardTitle>
              {statusIcons["Top Matches"]}
            </CardHeader>
            <CardContent>
              <Badge variant={getBadgeVariant(topMatchesStatus)} className="capitalize">{topMatchesStatus}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Notification</CardTitle>
              {statusIcons["Email Notification"]}
            </CardHeader>
            <CardContent>
              <Badge variant={getBadgeVariant(emailNotificationStatus)} className="capitalize">{emailNotificationStatus}</Badge>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Top 3 Matches</CardTitle>
                <CardDescription>
                  These profiles are the best fit for the Job Description.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {topMatches.map((match, index) => (
                <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Image
                    alt="Avatar"
                    className="rounded-full"
                    height="64"
                    src={match.avatarUrl}
                    data-ai-hint="profile avatar"
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                  <div className="grid gap-1 flex-1">
                    <p className="font-semibold">{match.name}</p>
                    <p className="text-sm text-muted-foreground">Similarity Score</p>
                  </div>
                  <div className="font-bold text-primary text-lg">{match.similarity}</div>
                  <Link href={match.profileUrl}>
                    <ArrowRight className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Workflow Progress</CardTitle>
              <CardDescription>Follow the automated matching process step-by-step.</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowProgress />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
