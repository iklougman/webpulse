"use client";

import { useState, useEffect } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Group,
  Button,
  Badge,
  Stack,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Switch,
  Alert,
  LoadingOverlay,
  Table,
  Progress,
  ThemeIcon,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Plus,
  Dots,
  Edit,
  Trash,
  Eye,
  World,
  Clock,
  ChartBar,
  AlertCircle,
  Check,
  X,
  Refresh,
} from "tabler-icons-react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import Joi from "joi";

// Joi validation schema for site creation
const siteSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  url: Joi.string().uri().required(),
  checkInterval: Joi.number().min(1).max(1440).required(), // 1 minute to 24 hours
  thresholds: Joi.object({
    responseTime: Joi.number().min(100).max(10000).required(),
    availability: Joi.number().min(0).max(100).required(),
    seoScore: Joi.number().min(0).max(100).required(),
  }).required(),
  queryParams: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().min(1).max(50).required(),
        value: Joi.string().max(200).required(),
      })
    )
    .max(3)
    .optional(),
  enabled: Joi.boolean().required(),
});

interface Site {
  id: string;
  name: string;
  url: string;
  checkInterval: number;
  thresholds: {
    responseTime: number;
    availability: number;
    seoScore: number;
  };
  queryParams: Array<{
    key: string;
    value: string;
  }>;
  enabled: boolean;
  lastCheck?: {
    status: "UP" | "DOWN";
    responseTime: number;
    timestamp: string;
  };
}

interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalChecks: number;
  averageResponseTime: number;
  uptime: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      checkInterval: 5,
      thresholds: {
        responseTime: 2000,
        availability: 99,
        seoScore: 80,
      },
      queryParams: [{ key: "", value: "" }],
      enabled: true,
    },
    validate: (values) => {
      const { error } = siteSchema.validate(values, { abortEarly: false });
      if (error) {
        const errors: any = {};
        error.details.forEach((detail) => {
          const path = detail.path.join(".");
          errors[path] = detail.message;
        });
        return errors;
      }
      return {};
    },
  });

  useEffect(() => {
    fetchSites();
    fetchStats();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await api.get("/api/sites");
      setSites(response.data);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch sites",
        color: "red",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/sites/stats");
      setStats(response.data);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch stats",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (editingSite) {
        await api.put(`/api/sites/${editingSite.id}`, values);
        notifications.show({
          title: "Success",
          message: "Site updated successfully",
          color: "green",
        });
      } else {
        await api.post("/api/sites", values);
        notifications.show({
          title: "Success",
          message: "Site created successfully",
          color: "green",
        });
      }

      close();
      form.reset();
      setEditingSite(null);
      fetchSites();
      fetchStats();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to save site",
        color: "red",
      });
    }
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    form.setValues({
      name: site.name,
      url: site.url,
      checkInterval: site.checkInterval,
      thresholds: site.thresholds,
      queryParams:
        site.queryParams.length > 0
          ? site.queryParams
          : [{ key: "", value: "" }],
      enabled: site.enabled,
    });
    open();
  };

  const handleDelete = async (siteId: string) => {
    try {
      await api.delete(`/api/sites/${siteId}`);
      notifications.show({
        title: "Success",
        message: "Site deleted successfully",
        color: "green",
      });
      fetchSites();
      fetchStats();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete site",
        color: "red",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UP":
        return "green";
      case "DOWN":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <Check size={16} />;
      case "DOWN":
        return <X size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ProtectedLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={1}>Dashboard</Title>
              <Text c="dimmed">
                Monitor your websites and track performance
              </Text>
            </div>
            <Button
              leftSection={<Plus size={16} />}
              onClick={open}
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Add Site
            </Button>
          </Group>

          {/* Stats Cards */}
          {stats && (
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">
                        Total Sites
                      </Text>
                      <Text size="2rem" fw={700}>
                        {stats.totalSites}
                      </Text>
                    </div>
                    <ThemeIcon
                      size={60}
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      <World size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">
                        Active Sites
                      </Text>
                      <Text size="2rem" fw={700}>
                        {stats.activeSites}
                      </Text>
                    </div>
                    <ThemeIcon
                      size={60}
                      radius="md"
                      variant="light"
                      color="green"
                    >
                      <Check size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">
                        Avg Response Time
                      </Text>
                      <Text size="2rem" fw={700}>
                        {stats.averageResponseTime}ms
                      </Text>
                    </div>
                    <ThemeIcon
                      size={60}
                      radius="md"
                      variant="light"
                      color="orange"
                    >
                      <Clock size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">
                        Uptime
                      </Text>
                      <Text size="2rem" fw={700}>
                        {stats.uptime}%
                      </Text>
                    </div>
                    <ThemeIcon
                      size={60}
                      radius="md"
                      variant="light"
                      color="cyan"
                    >
                      <ChartBar size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>
          )}

          {/* Sites Table */}
          <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Your Sites</Title>
              <ActionIcon variant="subtle" onClick={fetchSites}>
                <Refresh size={16} />
              </ActionIcon>
            </Group>

            {sites.length === 0 ? (
              <Paper p="xl" ta="center">
                <Text c="dimmed" size="lg">
                  No sites added yet
                </Text>
                <Text c="dimmed" size="sm" mt="xs">
                  Click "Add Site" to start monitoring your first website
                </Text>
              </Paper>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Site</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Response Time</Table.Th>
                    <Table.Th>Last Check</Table.Th>
                    <Table.Th>Interval</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {sites.map((site) => (
                    <Table.Tr key={site.id}>
                      <Table.Td>
                        <Stack gap={4}>
                          <Text fw={500}>{site.name}</Text>
                          <Text size="sm" c="dimmed">
                            {site.url}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        {site.lastCheck ? (
                          <Badge
                            color={getStatusColor(site.lastCheck.status)}
                            leftSection={getStatusIcon(site.lastCheck.status)}
                          >
                            {site.lastCheck.status}
                          </Badge>
                        ) : (
                          <Badge color="gray">Never checked</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {site.lastCheck ? (
                          <Text>{site.lastCheck.responseTime}ms</Text>
                        ) : (
                          <Text c="dimmed">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {site.lastCheck ? (
                          <Text size="sm">
                            {new Date(
                              site.lastCheck.timestamp
                            ).toLocaleString()}
                          </Text>
                        ) : (
                          <Text c="dimmed" size="sm">
                            -
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{site.checkInterval} min</Text>
                      </Table.Td>
                      <Table.Td>
                        <Menu>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <Dots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<Eye size={16} />}
                              onClick={() => window.open(site.url, "_blank")}
                            >
                              View Site
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<Edit size={16} />}
                              onClick={() => handleEdit(site)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<Trash size={16} />}
                              color="red"
                              onClick={() => handleDelete(site.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>

          {/* Add/Edit Site Modal */}
          <Modal
            opened={opened}
            onClose={() => {
              close();
              form.reset();
              setEditingSite(null);
            }}
            title={editingSite ? "Edit Site" : "Add New Site"}
            size="lg"
          >
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Site Name"
                  placeholder="My Website"
                  required
                  {...form.getInputProps("name")}
                />

                <TextInput
                  label="URL"
                  placeholder="https://example.com"
                  required
                  {...form.getInputProps("url")}
                />

                <NumberInput
                  label="Check Interval (minutes)"
                  placeholder="5"
                  min={1}
                  max={1440}
                  required
                  {...form.getInputProps("checkInterval")}
                />

                <Title order={4}>Thresholds</Title>

                <NumberInput
                  label="Response Time Threshold (ms)"
                  placeholder="2000"
                  min={100}
                  max={10000}
                  required
                  {...form.getInputProps("thresholds.responseTime")}
                />

                <NumberInput
                  label="Availability Threshold (%)"
                  placeholder="99"
                  min={0}
                  max={100}
                  required
                  {...form.getInputProps("thresholds.availability")}
                />

                <NumberInput
                  label="SEO Score Threshold (%)"
                  placeholder="80"
                  min={0}
                  max={100}
                  required
                  {...form.getInputProps("thresholds.seoScore")}
                />

                <Title order={4}>Query Parameters (Optional)</Title>

                {form.values.queryParams.map((_, index) => (
                  <Group key={index}>
                    <TextInput
                      placeholder="Key"
                      {...form.getInputProps(`queryParams.${index}.key`)}
                    />
                    <TextInput
                      placeholder="Value"
                      {...form.getInputProps(`queryParams.${index}.value`)}
                    />
                  </Group>
                ))}

                <Switch
                  label="Enable monitoring"
                  {...form.getInputProps("enabled")}
                />

                <Group justify="flex-end" mt="md">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan" }}
                  >
                    {editingSite ? "Update Site" : "Add Site"}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Modal>
        </Stack>
      </Container>
    </ProtectedLayout>
  );
}
