"use client";

import { useRouter } from "next/navigation";
import { AppShell, NavLink, Group, Text, Button, Stack } from "@mantine/core";
import { Dashboard, World, Bell, Settings, Logout } from "tabler-icons-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/auth-store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Dashboard },
  { label: "Sites", href: "/dashboard", icon: World },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push("/");
  };

  if (!user) {
    return (
      <Group justify="center" mb="xl">
        <Text size="xl" fw={700}>
          Web Checker
        </Text>
      </Group>
    );
  }

  return (
    <>
      <Group justify="center" mb="xl">
        <Text size="xl" fw={700}>
          Web Checker
        </Text>
      </Group>

      <Stack gap="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            leftSection={<item.icon size={16} />}
            onClick={() => router.push(item.href)}
          />
        ))}
      </Stack>

      <Group mt="auto">
        <Button
          leftSection={<Logout size={16} />}
          onClick={handleLogout}
          variant="outline"
          fullWidth
        >
          Logout
        </Button>
      </Group>
    </>
  );
}
