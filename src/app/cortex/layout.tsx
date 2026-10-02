'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/cortex/login') {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/cortex/login');
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-500 font-mono text-xs flex items-center justify-center uppercase tracking-widest">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>VERIFICANDO CREDENCIAIS CORTEX...</span>
        </div>
      </div>
    );
  }

  if (!authorized && pathname !== '/cortex/login') {
    return null;
  }

  return <div className="min-h-screen bg-[#050505] text-white">{children}</div>;
}