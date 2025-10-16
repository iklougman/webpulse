# Supabase Setup Guide

## Quick Setup

To enable authentication in the Web Checker app, you need to set up a Supabase project and configure the environment variables.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `web-checker` (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Configure Environment Variables

1. In the `frontend/` directory, create a `.env.local` file:
   ```bash
   cd frontend
   cp env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key-here
   
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8080
   
   # Enable debug mode for development
   NEXT_PUBLIC_DEBUG=true
   ```

### 4. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

   **Site URL**: `http://localhost:3000` (for development)
   
   **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

3. **Enable Email Authentication**:
   - Go to **Authentication** → **Providers**
   - Make sure **Email** is enabled
   - Configure email templates if needed

4. **Optional: Enable Google OAuth**:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Add your Google OAuth credentials

### 5. Restart the Development Server

After setting up the environment variables:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
cd frontend
npm run dev
```

### 6. Test Authentication

1. Go to `http://localhost:3000`
2. Click "Sign In" or "Get Started Free"
3. Try creating an account or signing in
4. You should now see proper authentication instead of "Supabase not configured" errors

## Troubleshooting

### "Supabase not configured" Error
- Make sure `.env.local` exists in the `frontend/` directory
- Check that the environment variables are correctly set
- Restart the development server after making changes

### Authentication Not Working
- Verify your Supabase project URL and anon key are correct
- Check that email authentication is enabled in Supabase dashboard
- Make sure redirect URLs are configured properly

### Development vs Production
- For production deployment, update the Site URL and Redirect URLs in Supabase
- Use production environment variables in your deployment platform

## Database Schema

The app expects the following Supabase tables (these will be created automatically by the backend):

- `sites` - Website monitoring configurations
- `check_results` - Monitoring results and metrics
- `incidents` - Alert and incident tracking

The backend will handle database migrations when you set up the full stack.
