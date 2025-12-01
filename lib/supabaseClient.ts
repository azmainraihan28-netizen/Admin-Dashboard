import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csmkagutmqikgsssjjgo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbWthZ3V0bXFpa2dzc3NqamdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTQ0NDgsImV4cCI6MjA4MDE5MDQ0OH0.x6-trBxsHPO3j3CNS8aZwKFd5RVmxhcNPdr9laC3Ubw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);