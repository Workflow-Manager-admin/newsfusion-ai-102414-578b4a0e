// PUBLIC_INTERFACE
/**
 * Supabase client initialization for NewsFusion AI React app.
 * Exports the configured Supabase client.
 * 
 * - Uses Vite/Cra/React env vars: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
 * - Access keys via process.env in React (must be prefixed with REACT_APP_ for Create React App)
 * - Usage:
 *    import supabase from "./client";
 *    // supabase.auth, supabase.from('bookmarks'), etc.
 */

import { createClient } from "@supabase/supabase-js";

// -- Environment variables (set in .env file at project root):
// REACT_APP_SUPABASE_URL=your-project-url
// REACT_APP_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Best practice: throw if keys are missing (dev feedback)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration: Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file"
  );
}

// Export initialized client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
