"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { recruiterJds, consultantProfiles } from "@/lib/data";

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<'jd' | 'consultant'>('jd');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    if (!selectedItem) return;
    setIsLoading(true);
    setGeneratedReport(null);

    // Simulate API call
    setTimeout(() => {
      const itemName = reportType === 'jd'
        ? recruiterJds.find(j => j.id === selectedItem)?.title
        : consultantProfiles.find(c => c.id === selectedItem)?.name;
      
      const reportText = `
Matching Results Report
-------------------------

Report Type: ${reportType === 'jd' ? 'By Job Description' : 'By Consultant Profile'}
Selected Item: ${itemName} (ID: ${selectedItem})
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

  const options = reportType === 'jd' ? recruiterJds : consultantProfiles;

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
            <RadioGroup defaultValue="jd" onValueChange={(value: 'jd' | 'consultant') => {
              setReportType(value);
              setSelectedItem('');
              setGeneratedReport(null);
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jd" id="r1" />
                <Label htmlFor="r1">By Job Description</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consultant" id="r2" />
                <Label htmlFor="r2">By Consultant Profile</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="select-item">Select {reportType === 'jd' ? 'Job Description' : 'Consultant'}</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger id="select-item">
                <SelectValue placeholder={`Select a ${reportType === 'jd' ? 'JD' : 'consultant'}...`} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {reportType === 'jd' ? (option as typeof recruiterJds[0]).title : option.name}
                  </SelectItem>
                ))}
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
