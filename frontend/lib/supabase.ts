// Dynamic Supabase client that only loads when needed
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
  if (supabaseUrl.includes('placeholder')) {
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

// For backward compatibility, export a getter
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      return () => null;
    }
    return client[prop];
  }
});
