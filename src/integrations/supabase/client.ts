import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zyqbrappruwxvkrojplo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cWJyYXBwcnV3eHZrcm9qcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTAyMjcsImV4cCI6MjA5MDc4NjIyN30.38AZBnJwpifr4lvMMQEASO6_n5DYQJeMNZ38e33Hn5g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
