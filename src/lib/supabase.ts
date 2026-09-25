import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekljqqdhrltlydomfeua.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbGpxcWRocmx0bHlkb21mZXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzkzNjAsImV4cCI6MjEwNTkxNTM2MH0.g6z7z2RqbkiTBcDNAgEZmS4h9kbKY69JEf0F6rypTA0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);