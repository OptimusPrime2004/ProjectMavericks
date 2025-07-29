
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { recruiterJds, consultantProfiles, type JobDescription, type ConsultantProfile } from "@/lib/data";
import { Briefcase, Clock, FileText, Star, User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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


export default function ViewPage() {
  const [view, setView] = useState<'profiles' | 'jds'>('profiles');
  const [selectedItem, setSelectedItem] = useState('');
  
  const handleViewChange = (value: 'profiles' | 'jds') => {
    setView(value);
    setSelectedItem('');
  };
  
  const dropdownOptions = view === 'profiles' ? consultantProfiles : recruiterJds;

  const selectedObject = useMemo(() => {
    if (!selectedItem) return null;
    return dropdownOptions.find(option => option.id === selectedItem) || null;
  }, [selectedItem, dropdownOptions]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>View Documents</CardTitle>
            <CardDescription>Select a profile or job description to see its details.</CardDescription>
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
      </main>
    </div>
  );
}
