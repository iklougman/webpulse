"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  NavLink,
  Group,
  Text,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Dashboard,
  World,
  Bell,
  Settings,
  Login,
  UserPlus,
  Logout,
} from "tabler-icons-react";
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
  const { user } = useAuthStore();
  const [loginOpened, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [signupOpened, { open: openSignup, close: closeSignup }] =
    useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      // No password validation for login - let server handle it
    },
  });

  const signupForm = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleLogin = async (values: typeof loginForm.values) => {
    if (!supabase) {
      notifications.show({
        title: "Configuration Error",
        message: "Supabase is not configured. Please contact support.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;
      notifications.show({
        title: "Success",
        message: "Logged in successfully",
        color: "green",
      });
      closeLogin();
      loginForm.reset();
      router.push("/dashboard");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: typeof signupForm.values) => {
    if (!supabase) {
      notifications.show({
        title: "Configuration Error",
        message: "Supabase is not configured. Please contact support.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp(values);
      if (error) throw error;
      notifications.show({
        title: "Success",
        message: "Check your email for verification link",
        color: "green",
      });
      closeSignup();
      signupForm.reset();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  if (!user) {
    return (
      <>
        <Group justify="center" mb="xl">
          <Text size="xl" fw={700}>
            Web Checker
          </Text>
        </Group>

        <Stack gap="sm">
          <Button
            leftSection={<Login size={16} />}
            onClick={openLogin}
            fullWidth
          >
            Login
          </Button>
          <Button
            leftSection={<UserPlus size={16} />}
            onClick={openSignup}
            variant="outline"
            fullWidth
          >
            Sign Up
          </Button>
        </Stack>

        <Modal opened={loginOpened} onClose={closeLogin} title="Login">
          <form onSubmit={loginForm.onSubmit(handleLogin)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...loginForm.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...loginForm.getInputProps("password")}
              />
              <Button type="submit" loading={loading}>
                Login
              </Button>
            </Stack>
          </form>
        </Modal>

        <Modal opened={signupOpened} onClose={closeSignup} title="Sign Up">
          <form onSubmit={signupForm.onSubmit(handleSignup)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...signupForm.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...signupForm.getInputProps("password")}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...signupForm.getInputProps("confirmPassword")}
              />
              <Button type="submit" loading={loading}>
                Sign Up
              </Button>
            </Stack>
          </form>
        </Modal>
      </>
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
