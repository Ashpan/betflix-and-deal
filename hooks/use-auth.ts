import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Auth hook mounted");
    const supabase = createClient();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change", event);
        setUser(session?.user ?? null);
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "USER_UPDATED"
        ) {
          setLoading(false);
        }
      },
    );

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(
          "Intial session:",
          session?.user ? "Logged in" : "Not logged in",
        );
        setUser(session?.user ?? null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Auth hook unmounted");
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("Auth state updated:", { user, loading });
  }, [user, loading]);

  return { user, loading };
};
