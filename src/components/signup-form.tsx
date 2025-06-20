"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

interface SignupFormProps extends React.ComponentProps<"form"> {
  defaultEmail?: string;
  planDetails?: {
    name: string;
    amount: number;
    expiryDate: Date;
  };
}

export function SignupForm({
  className,
  defaultEmail = "",
  planDetails = {
    name: "Free",
    amount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  ...props
}: SignupFormProps) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const signupToken = pathname.split("/").pop();

      // Create user in Clerk
      const result = await signUp.create({
        emailAddress: email,
        password,
        // Pass the signupToken to the unsafe metadata
        unsafeMetadata: signupToken ? { signupToken } : undefined,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign up failed");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || defaultEmail !== ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div id="clerk-captcha"></div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-2"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
