import { createClient } from '@supabase/supabase-js';

// Helper function to safely retrieve environment variables
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    console.warn(`Error accessing env var ${key}`, e);
  }
  return '';
};

// Retrieve env vars or use placeholders to prevent initialization crash
// In a real production app, you would want to ensure these are present.
// For this demo/template, we provide placeholders so the UI renders.
let supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
let supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl) {
  console.warn("VITE_SUPABASE_URL not found. Using placeholder URL. Auth and DB features will not work.");
  supabaseUrl = 'https://placeholder-project.supabase.co';
}

if (!supabaseAnonKey) {
  console.warn("VITE_SUPABASE_ANON_KEY not found. Using placeholder Key.");
  supabaseAnonKey = 'public-anon-key-placeholder';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);