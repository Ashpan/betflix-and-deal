import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Login } from "@/app/components/Login";

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Login />
    </Suspense>
  );
}
