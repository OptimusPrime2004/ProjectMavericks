import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { arDashboardData } from "@/lib/data";
import { FileCheck, Users, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WorkflowProgress from "@/components/WorkflowProgress";

export default function ARDashboardPage() {
  const { jdComparisonStatus, topMatchesStatus, emailNotificationStatus, topMatches } = arDashboardData;

  const statusIcons = {
    "JD Comparison": <FileCheck className="h-4 w-4 text-muted-foreground" />,
    "Top Matches": <Users className="h-4 w-4 text-muted-foreground" />,
    "Email Notification": <Mail className="h-4 w-4 text-muted-foreground" />,
  };

  const getBadgeVariant = (status: string) => {
    switch(status) {
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
