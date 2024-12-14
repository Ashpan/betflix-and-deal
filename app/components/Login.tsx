"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirect_to") as string) || "/home";

    const supabase = createClient();
    supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(({ error: signInError }) => {
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.push(redirectTo);
      })
      .catch((error) => {
        setError("An unexpected error occurred. Please try again.");
        console.error("Sign in error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Dont have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <Input
          type="hidden"
          name="redirect_to"
          value={searchParams.get("redirect_to") || "/home"}
        />
        <SubmitButton disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </SubmitButton>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    </form>
  );
}
