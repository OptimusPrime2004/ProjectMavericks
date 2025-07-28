import Header from "@/components/Header";
import RecruiterAdminConsole from "@/components/RecruiterAdminConsole";

export default function RecruiterAdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl font-headline">Admin Console</h1>
        </div>
        <RecruiterAdminConsole />
      </main>
    </div>
  );
}
