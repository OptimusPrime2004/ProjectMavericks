"use client";

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { recruiterJds, type JobDescription } from "@/lib/data";
import AgenticMetricsTool from "@/components/AgenticMetricsTool";
import ReportGenerator from "@/components/ReportGenerator";
import { ListFilter, Search } from 'lucide-react';

export default function RecruiterAdminConsole() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const uniqueSkills = useMemo(() => {
    const allSkills = recruiterJds.flatMap(jd => jd.skills);
    return [...new Set(allSkills)];
  }, []);

  const uniqueExperiences = useMemo(() => {
    return [...new Set(recruiterJds.map(jd => jd.experience))];
  }, []);

  const filteredJds = useMemo(() => {
    return recruiterJds.filter(jd => {
      const matchesSearch = jd.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkill = skillFilter === 'all' || jd.skills.includes(skillFilter);
      const matchesExperience = experienceFilter === 'all' || jd.experience === experienceFilter;
      const matchesStatus = statusFilter === 'all' || jd.status === statusFilter;
      return matchesSearch && matchesSkill && matchesExperience && matchesStatus;
    });
  }, [searchTerm, skillFilter, experienceFilter, statusFilter]);

  const getStatusVariant = (status: JobDescription['status']) => {
    switch (status) {
      case 'Open': return 'default';
      case 'Interviewing': return 'secondary';
      case 'Closed': return 'outline';
    }
  };

  return (
    <Tabs defaultValue="jd-search" className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="jd-search">JD Search & Filters</TabsTrigger>
        <TabsTrigger value="agentic-metrics">Agentic Metrics</TabsTrigger>
        <TabsTrigger value="reporting">Report Generation</TabsTrigger>
      </TabsList>

      <TabsContent value="jd-search">
        <Card>
          <CardHeader>
            <CardTitle>Job Descriptions</CardTitle>
            <CardDescription>Search, filter, and manage all job descriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto md:flex-1">
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger><ListFilter className="mr-2 h-4 w-4" />Skill</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {uniqueSkills.map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger><ListFilter className="mr-2 h-4 w-4" />Experience</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experiences</SelectItem>
                    {uniqueExperiences.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><ListFilter className="mr-2 h-4 w-4" />Status</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJds.length > 0 ? filteredJds.map((jd) => (
                    <TableRow key={jd.id}>
                      <TableCell className="font-medium">{jd.id}</TableCell>
                      <TableCell>{jd.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {jd.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>{jd.experience}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(jd.status)}>{jd.status}</Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="agentic-metrics">
        <AgenticMetricsTool />
      </TabsContent>

      <TabsContent value="reporting">
        <ReportGenerator />
      </TabsContent>
    </Tabs>
  );
}
