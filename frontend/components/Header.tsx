"use client";

import {
  AppShell,
  Group,
  Text,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { Sun, Moon, Bell } from "tabler-icons-react";
import { useAuthStore } from "@/lib/auth-store";

export function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user } = useAuthStore();

  return (
    <Group justify="space-between" h="100%">
      <Text size="lg" fw={600}>
        Welcome back, {user?.email}
      </Text>

      <Group>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => toggleColorScheme()}
          size="lg"
        >
          {colorScheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </ActionIcon>

        <ActionIcon variant="subtle" color="gray" size="lg">
          <Bell size={18} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
