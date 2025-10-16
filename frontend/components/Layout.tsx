"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, LoadingOverlay } from "@mantine/core";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";
import { Navbar } from "./Navbar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, router]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (!user) {
    return <>{children}</>;
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
