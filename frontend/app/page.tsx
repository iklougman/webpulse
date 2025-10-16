"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Grid,
  ThemeIcon,
  Badge,
  Center,
  Box,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  World,
  Clock,
  ChartBar,
  Bell,
  Shield,
  Rocket,
  Check,
} from "tabler-icons-react";

const features = [
  {
    icon: World,
    title: "Multi-Site Monitoring",
    description:
      "Monitor unlimited websites with real-time availability checks",
  },
  {
    icon: Clock,
    title: "Scheduled Checks",
    description: "Set up custom schedules for 3G/4G performance monitoring",
  },
  {
    icon: ChartBar,
    title: "Performance Analytics",
    description: "Track response times, SEO scores, and health metrics",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get instant alerts via email, Slack, or webhooks",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with Supabase authentication",
  },
  {
    icon: Rocket,
    title: "Easy Setup",
    description: "Get started in minutes with our intuitive dashboard",
  },
];

const stats = [
  { label: "Sites Monitored", value: "10,000+" },
  { label: "Uptime", value: "99.9%" },
  { label: "Response Time", value: "< 100ms" },
  { label: "Happy Users", value: "5,000+" },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <Box>
      {/* Hero Section */}
      <Container size="lg" py={80}>
        <Center>
          <Stack align="center" gap="xl" style={{ textAlign: "center" }}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Web Monitoring Made Simple
            </Badge>

            <Title order={1} size="3.5rem" fw={900} style={{ lineHeight: 1.2 }}>
              Monitor Your Websites
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                {" "}
                24/7
              </Text>
            </Title>

            <Text size="xl" c="dimmed" maw={600}>
              Track website availability, performance metrics, and SEO scores
              with our powerful monitoring platform. Get instant notifications
              when issues arise.
            </Text>

            <Group gap="md">
              <Button
                size="lg"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                onClick={() => router.push("/auth/register")}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/auth/login")}
              >
                Sign In
              </Button>
            </Group>
          </Stack>
        </Center>
      </Container>

      {/* Stats Section */}
      <Container size="lg" py={60}>
        <Grid>
          {stats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 6, sm: 3 }}>
              <Card padding="lg" radius="md" withBorder>
                <Stack align="center" gap="xs">
                  <Text size="2rem" fw={700} c="blue">
                    {stat.value}
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    {stat.label}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl" mb={60}>
          <Title order={2} size="2.5rem" ta="center">
            Everything You Need to Monitor Your Sites
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            Our comprehensive monitoring platform provides all the tools you
            need to ensure your websites are running smoothly.
          </Text>
        </Stack>

        <Grid>
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Card padding="xl" radius="md" withBorder h="100%">
                <Stack gap="md">
                  <ThemeIcon
                    size={60}
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                  >
                    <feature.icon size={30} />
                  </ThemeIcon>
                  <Title order={3} size="h4">
                    {feature.title}
                  </Title>
                  <Text c="dimmed">{feature.description}</Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container size="lg" py={80}>
        <Card
          padding="xl"
          radius="md"
          withBorder
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Stack align="center" gap="lg" style={{ textAlign: "center" }}>
            <Title order={2} size="2rem" c="white">
              Ready to Start Monitoring?
            </Title>
            <Text size="lg" c="white" maw={500}>
              Join thousands of developers and businesses who trust Web Checker
              to keep their sites running smoothly.
            </Text>
            <Group gap="md">
              <Button
                size="lg"
                variant="white"
                color="dark"
                onClick={() => router.push("/auth/register")}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                c="white"
                onClick={() => router.push("/auth/login")}
              >
                Sign In
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
