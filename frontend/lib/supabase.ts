// Development-friendly Supabase client
let supabaseClient: any = null;

export const getSupabaseClient = () => {
  // Only create client in browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  // Only create client if we have valid credentials
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey === 'placeholder-key') {
    console.warn('Supabase not configured. Using development mode.');
    return null;
  }

  try {
    // Dynamic import to avoid SSR issues
    const { createClient } = require('@supabase/supabase-js');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    return null;
  }
};

// For backward compatibility, export a getter that provides helpful messages
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // Return mock functions that show helpful messages
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signInWithPassword: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
          }),
          signUp: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
          }),
          signInWithOAuth: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
          }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        };
      }
      return () => null;
    }
    return client[prop];
  }
});
