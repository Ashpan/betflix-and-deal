import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Betflix and Deal",
    template: "%s | Betflix and Deal",
  },
  description: "The fastest way to manage your poker runs",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex min-h-screen relative">
              <AppSidebar />
              <div className="md:hidden w-13 flex-shrink-0 border-r bg-background">
                <div className="fixed p-4">
                  <SidebarTrigger />
                </div>
              </div>
              <main className="flex-1 w-full">
                <div className="flex flex-col items-center w-full">
                  <div className="w-full max-w-8xl p-5">
                    <div className="flex flex-col gap-20">{children}</div>
                  </div>
                </div>
              </main>
            </div>
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
