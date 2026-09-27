import { createClient } from '@supabase/supabase-js';

const sanitizeUrl = (url?: string) => {
  if (!url || url.trim() === '') return 'https://ekljqqdhrltlydomfeua.supabase.co';
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  return `https://${cleanUrl}`;
};

const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20)
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbGpxcWRocmx0bHlkb21mZXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzkzNjAsImV4cCI6MjEwNTkxNTM2MH0.g6z7z2RqbkiTBcDNAgEZmS4h9kbKY69JEf0F6rypTA0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);