import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, UserCog } from 'lucide-react';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                  Streamline Your Recruitment
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Profile Ranker uses AI-powered agents to match the best candidates to your job descriptions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container grid items-start justify-center gap-4 px-4 text-center md:gap-8 md:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/ar-dashboard" className="flex">
                <Card className="w-full hover:bg-card/80 transition-colors flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline">AR Requestor Dashboard</CardTitle>
                    </div>
                    <CardDescription className="pt-2 text-left">
                      View real-time status of your job requisition, track top matches, and see workflow progress.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold text-primary flex items-center">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/recruiter-admin" className="flex">
                <Card className="w-full hover:bg-card/80 transition-colors flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <UserCog className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline">Recruiter Admin</CardTitle>
                    </div>
                    <CardDescription className="pt-2 text-left">
                      Manage JDs, monitor agent performance, and generate insightful reports on matching results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold text-primary flex items-center">
                      Go to Admin Console <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Profile Ranker. All rights reserved.</p>
      </footer>
    </div>
  );
}
