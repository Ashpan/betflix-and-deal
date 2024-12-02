"use client";

import { Header } from "@/components/Header";
import { useProfile } from "@/hooks/useProfile";

const ProtectedPage = () => {
  const profile = useProfile();

  return (
    <>
      <Header title="Profile" />
      <div className="flex-1 w-full flex flex-col gap-12">
        <pre className="text-xs font-mono p-3 rounded border max-h-64 overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default ProtectedPage;
