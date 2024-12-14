"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    };

    signOut();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-medium">Sign out</h1>
      <p className="text-foreground/60">You have been signed out.</p>
    </div>
  );
}
