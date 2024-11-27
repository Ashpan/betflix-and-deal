import { signOutAction } from "@/app/actions";

export default async function SignOut() {
  await signOutAction();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-medium">Sign out</h1>
      <p className="text-foreground/60">You have been signed out.</p>
    </div>
  );
}
