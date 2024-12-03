"use client";

import { useCallback, useEffect, useState } from "react";
import { Tables } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/client";

export const useProfile = () => {
  createClient();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadProfile = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();

    const channel = supabase
      .channel("profiles_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        loadProfile,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProfile, supabase]);

  const updateProfile = async (updates: Partial<Tables<"profiles">>) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user.id) return { error: "No user session" };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;
      await loadProfile();
      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  return { profile, loading, updateProfile };
};
