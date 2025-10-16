"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Anchor,
  Alert,
  Center,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AlertCircle, ArrowLeft } from "tabler-icons-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;

      notifications.show({
        title: "Success",
        message: "Logged in successfully",
        color: "green",
      });

      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center>
        <Stack gap="md" w="100%">
          <Box ta="center">
            <Title order={1} size="2.5rem" fw={900} mb="xs">
              Welcome Back
            </Title>
            <Text c="dimmed" size="lg">
              Sign in to your Web Checker account
            </Text>
          </Box>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleLogin)}>
              <Stack gap="md">
                {error && (
                  <Alert icon={<AlertCircle size={16} />} color="red">
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  required
                  {...form.getInputProps("email")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  {...form.getInputProps("password")}
                />

                <Group justify="space-between" mt="md">
                  <Anchor
                    component={Link}
                    href="/auth/forgot-password"
                    size="sm"
                  >
                    Forgot password?
                  </Anchor>
                </Group>

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  Sign In
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleGoogleLogin}
                  loading={loading}
                >
                  Continue with Google
                </Button>

                <Text ta="center" size="sm" mt="md">
                  Don't have an account?{" "}
                  <Anchor component={Link} href="/auth/register">
                    Sign up
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </Paper>

          <Group justify="center" mt="md">
            <Anchor component={Link} href="/" size="sm" c="dimmed">
              <Group gap={4}>
                <ArrowLeft size={16} />
                Back to Home
              </Group>
            </Anchor>
          </Group>
        </Stack>
      </Center>
    </Container>
  );
}
