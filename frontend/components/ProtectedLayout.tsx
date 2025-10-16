"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell, LoadingOverlay } from "@mantine/core";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not configured - skipping auth state management");
      setLoading(false);
      return;
    }

    // Check initial session
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session) {
        console.log("No session found, redirecting to login");
        router.push("/auth/login");
      } else {
        console.log("Session found, user:", session.user);
      }
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_OUT" || !session) {
        console.log("Signing out or no session, redirecting to login");
        router.push("/auth/login");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in, staying on current page");
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, router]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (!user) {
    router.push("/auth/login");
    return <LoadingOverlay visible />;
  }

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: "sm" }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Header px="md">
        <Header />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
