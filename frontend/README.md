# Web Checker Frontend

Next.js 14 frontend with Mantine UI and Supabase authentication.

## Features

- **Authentication**: Supabase Auth with email/password and OAuth
- **UI Components**: Mantine UI with dark/light theme support
- **State Management**: Zustand for auth state, TanStack Query for server state
- **Real-time Updates**: Live dashboard with site monitoring data
- **Responsive Design**: Mobile-first design with AppShell layout

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp env.example .env.local
```

3. Fill in your Supabase credentials in `.env.local`

4. Start development server:

```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080)

## Pages

- `/` - Dashboard with overview metrics
- `/sites` - Site management (CRUD operations)
- `/notifications` - Notification rules configuration
- `/settings` - User settings and preferences

## Components

- `Layout` - Main app shell with navigation
- `Navbar` - Side navigation with auth handling
- `Header` - Top header with theme toggle and notifications
- `Dashboard` - Overview metrics and recent activity
- `Sites` - Site management interface

## Authentication

The app uses Supabase Auth with middleware protection:

- Protected routes redirect to login if not authenticated
- Auth state is managed with Zustand and persisted
- JWT tokens are automatically included in API requests
