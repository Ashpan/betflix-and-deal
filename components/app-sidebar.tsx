import {
  Calendar,
  DollarSign,
  Home,
  LogIn,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { createClient } from "@/utils/supabase/server";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    authState: "both",
  },
  {
    title: "Login",
    url: "/sign-in",
    icon: LogIn,
    authState: "unauthenticated",
  },
  {
    title: "New Session",
    url: "/session",
    icon: Calendar,
    authState: "authenticated",
  },
  {
    title: "Earnings",
    url: "/balance",
    icon: DollarSign,
    authState: "authenticated",
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Settings,
    authState: "authenticated",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    authState: "authenticated",
  },
  {
    title: "Logout",
    url: "/sign-out",
    icon: LogOut,
    authState: "authenticated",
  },
];

export async function AppSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = user !== null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Betflix & Deal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.authState === "unauthenticated" && isAuthenticated) {
                  return null;
                } else if (
                  item.authState === "authenticated" &&
                  !isAuthenticated
                ) {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <ThemeSwitcher />
    </Sidebar>
  );
}
