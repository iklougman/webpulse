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
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AlertCircle, ArrowLeft, Check } from "tabler-icons-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
      terms: (value) => (!value ? "You must accept the terms" : null),
    },
  });

  const handleRegister = async (values: typeof form.values) => {
    if (!supabase) {
      notifications.show({
        title: "Supabase Not Configured",
        message:
          "Please set up Supabase credentials in .env.local. See SUPABASE_SETUP.md for instructions.",
        color: "orange",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // Set user in auth store if signup was successful
      if (data.user) {
        setUser(data.user);
      }

      notifications.show({
        title: "Success",
        message:
          "Account created successfully! Check your email for verification.",
        color: "green",
      });

      // Redirect to dashboard after successful signup
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

  const handleGoogleRegister = async () => {
    if (!supabase) {
      notifications.show({
        title: "Supabase Not Configured",
        message:
          "Please set up Supabase credentials in .env.local. See SUPABASE_SETUP.md for instructions.",
        color: "orange",
      });
      return;
    }

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
              Create Account
            </Title>
            <Text c="dimmed" size="lg">
              Start monitoring your websites today
            </Text>
          </Box>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleRegister)}>
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

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                  {...form.getInputProps("confirmPassword")}
                />

                <Checkbox
                  label={
                    <Text size="sm">
                      I agree to the{" "}
                      <Anchor href="/terms" target="_blank">
                        Terms of Service
                      </Anchor>{" "}
                      and{" "}
                      <Anchor href="/privacy" target="_blank">
                        Privacy Policy
                      </Anchor>
                    </Text>
                  }
                  {...form.getInputProps("terms")}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  Create Account
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={handleGoogleRegister}
                  loading={loading}
                >
                  Continue with Google
                </Button>

                <Text ta="center" size="sm" mt="md">
                  Already have an account?{" "}
                  <Anchor component={Link} href="/auth/login">
                    Sign in
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
