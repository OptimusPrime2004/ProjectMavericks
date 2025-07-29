
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
    name: string;
    content: string;
}

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<'jds' | 'profiles'>('jds');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jds, setJds] = useState<UploadedFile[]>([]);
  const [profiles, setProfiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedJds = localStorage.getItem("jds");
        if (storedJds) setJds(JSON.parse(storedJds));

        const storedProfiles = localStorage.getItem("profiles");
        if (storedProfiles) setProfiles(JSON.parse(storedProfiles));
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Could not load files",
            description: "There was an error reading files from local storage."
        });
    }
  }, [toast]);

  const handleGenerateReport = () => {
    if (!selectedItem) return;
    setIsLoading(true);
    setGeneratedReport(null);

    // Simulate API call
    setTimeout(() => {
      const options = reportType === 'jds' ? jds : profiles;
      const itemName = options.find(item => item.name === selectedItem)?.name;
      
      const reportText = `
Matching Results Report
-------------------------

Report Type: ${reportType === 'jds' ? 'By Job Description' : 'By Consultant Profile'}
Selected Item: ${itemName}
Date: ${new Date().toLocaleDateString()}

Summary:
This report details the matching performance for the selected item. 
For Job Descriptions, it shows top consultant matches and overall success rate.
For Consultants, it shows their match percentage across various open JDs.

- Top Match: Elena Rodriguez (92% for Senior Frontend Developer)
- Average Match Score: 81%
- Total Profiles Considered: 25
- Notes: Strong candidates identified for key roles. Follow-up interviews recommended.
      `;
      setGeneratedReport(reportText);
      setIsLoading(false);
    }, 1500);
  };

  const options = reportType === 'jds' ? jds : profiles;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generation</CardTitle>
        <CardDescription>Generate reports about matching results by Job Description or consultant profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <RadioGroup defaultValue="jds" onValueChange={(value: 'jds' | 'profiles') => {
              setReportType(value);
              setSelectedItem('');
              setGeneratedReport(null);
            }}
            value={reportType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jds" id="r1" />
                <Label htmlFor="r1">By Job Description</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profiles" id="r2" />
                <Label htmlFor="r2">By Consultant Profile</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="select-item">Select {reportType === 'jds' ? 'Job Description' : 'Consultant'}</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem} disabled={options.length === 0}>
              <SelectTrigger id="select-item">
                <SelectValue placeholder={`Select a ${reportType === 'jds' ? 'JD' : 'consultant'}...`} />
              </SelectTrigger>
              <SelectContent>
                {options.length > 0 ? options.map(option => (
                  <SelectItem key={option.name} value={option.name}>
                    {option.name}
                  </SelectItem>
                )) : (
                  <SelectItem value="no-files" disabled>No files uploaded yet.</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={handleGenerateReport} disabled={!selectedItem || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        {(isLoading || generatedReport) && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Generated Report</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <pre className="font-code text-sm whitespace-pre-wrap p-4 bg-background rounded-md overflow-x-auto">
                  {generatedReport}
                </pre>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
