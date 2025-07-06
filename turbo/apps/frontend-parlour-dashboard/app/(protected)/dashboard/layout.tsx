"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Toaster } from "sonner";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuth(); 
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isInitialized, isLoggedIn, router]);

  if (!isInitialized) return null; 

  if (!isLoggedIn) return <div>Redirecting...</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main  className="relative min-h-screen  transition-all">
        <SidebarTrigger />
        {children}
        <Toaster/>
      </main>
    </SidebarProvider>
  );
}
