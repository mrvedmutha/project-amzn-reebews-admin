import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/login" />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-muted-foreground">
            Hello, {user.emailAddresses[0]?.emailAddress}! You have successfully
            logged in.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
              <h3 className="font-medium text-primary">
                Authentication Status
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ✅ Clerk authentication is working correctly with your custom
                login form!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
