"use client";

import { useProfile } from "@/hooks/useProfile";

export const ProfilePage = () => {
  const profile = useProfile();
  console.log(profile);
  return <>{JSON.stringify(profile)}</>;
};
