"use client";

import {
  Calendar,
  DollarSign,
  Home,
  LogIn,
  LogOut,
  LucideIcon,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface IItem {
  title: string;
  url: string;
  icon: LucideIcon;
  authState: "authenticated" | "unauthenticated" | "both";
}

export const AppSidebar = () => {
  const [menuItems, setMenuItems] = useState<IItem[]>([]);
  const { user, loading } = useAuth();
  const { setOpenMobile } = useSidebar();

  // Menu items.
  const items: IItem[] = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      authState: "unauthenticated",
    },
    {
      title: "Home",
      url: "/home",
      icon: Home,
      authState: "authenticated",
    },
    {
      title: "Sessions",
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
  ];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  useEffect(() => {
    const authItems = items.filter((item) => {
      const authenticatedPerms = item.authState === "authenticated" && !!user;
      const unauthenticatedPerms =
        item.authState === "unauthenticated" && !user;
      return (
        item.authState === "both" || authenticatedPerms || unauthenticatedPerms
      );
    });
    setMenuItems(authItems);
  }, [user]);

  return (
    menuItems && (
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-4 py-2">
          <h2 className="text-lg font-semibold">Betflix and Deal</h2>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild onClick={handleLinkClick}>
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          {user ? (
            <Link href="/sign-out">
              <SidebarMenuButton className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </SidebarMenuButton>
            </Link>
          ) : (
            <Link href="/sign-in">
              <SidebarMenuButton className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </SidebarMenuButton>
            </Link>
          )}
          <ThemeSwitcher />
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Betflix and Deal
          </p>
        </SidebarFooter>
      </Sidebar>
    )
  );
};
