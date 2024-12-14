"use client";

import { useProfile } from "@/hooks/use-profile";

export const ProfilePage = () => {
  const profile = useProfile();
  console.log(profile);

  return (
    <>
      <pre className="text-xs font-mono p-3 rounded border max-h-64 overflow-auto">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </>
  );
};
