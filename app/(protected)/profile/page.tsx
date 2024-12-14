"use client";

import { ProfileSettingsForm } from "@/app/components/ProfileSettingsForm";
import { useProfile } from "@/hooks/use-profile";

const ProtectedPage = () => {
  const profile = useProfile();

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Profile Settings</h1>
        <ProfileSettingsForm />
      </div>
    </>
  );
};

export default ProtectedPage;
