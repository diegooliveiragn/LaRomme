'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/cortex/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-500 font-mono text-[10px] flex items-center justify-center uppercase tracking-widest">
        <div className="flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>INICIALIZANDO MOTOR CORTEX...</span>
        </div>
      </div>
    );
  }

  if (!authorized && pathname !== '/cortex/login') return null;

  // Se for a tela de login, não mostra a Sidebar
  if (pathname === '/cortex/login') {
    return <div className="min-h-screen bg-[#050505]">{children}</div>;
  }

  const menuItems = [
    { name: 'OLHO DE HÓRUS', path: '/cortex', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { name: 'FULFILLMENT & PEDIDOS', path: '/cortex/pedidos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'WMS & ESTOQUE', path: '/cortex/estoque', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'CATÁLOGO & PIM', path: '/cortex/catalogo', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { name: 'SUPPLY CHAIN', path: '/cortex/supply', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'TESOURARIA & DRE', path: '/cortex/financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'PATRONOS (CRM)', path: '/cortex/crm', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'PARCERIAS (ROI)', path: '/cortex/embaixadores', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-mono selection:bg-zinc-800">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-[#080808]">
        <div className="h-20 flex items-center px-6 border-b border-zinc-900">
          <Link href="/cortex" className="font-serif text-lg tracking-[0.25em] font-bold uppercase text-white">
            CORTEX<span className="text-zinc-600">OS</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 text-[10px] uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-white text-black font-bold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center space-x-3 px-3 py-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SISTEMA ONLINE</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors flex items-center space-x-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>ENCERRAR SESSÃO</span>
          </button>
        </div>
      </aside>

      {/* MOBILE WARNING (Opcional, pois ERP é focado em Desktop) */}
      <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center border-b border-zinc-900 bg-[#080808]">
        <span className="font-serif text-lg tracking-[0.2em] font-bold mb-2">CORTEX OS</span>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
          A interface de gestão otimizada requer acesso via Desktop ou Tablet (Landscape).
        </p>
        <button onClick={handleLogout} className="mt-6 text-[10px] text-zinc-400 border-b border-zinc-800 pb-1">
          Sair do Sistema
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="hidden md:flex flex-1 flex-col h-screen overflow-hidden">
        {/* HEADER SUPERIOR (BREADCRUMBS) */}
        <header className="h-20 flex items-center px-8 border-b border-zinc-900 bg-[#050505]">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-500">
            <span>CORTEX OS</span>
            <span>/</span>
            <span className="text-white">
              {menuItems.find(m => m.path === pathname)?.name || 'MÓDULO'}
            </span>
          </div>
        </header>

        {/* ÁREA DE RENDERIZAÇÃO DAS PÁGINAS */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}