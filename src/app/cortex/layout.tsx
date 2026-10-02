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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('laromme_cortex_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('laromme_cortex_theme', nextTheme);
  };

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
      <div className="min-h-screen bg-[#090a0f] text-slate-400 font-sans text-xs flex items-center justify-center font-medium tracking-wide">
        <div className="flex items-center space-x-3 bg-slate-900/80 px-5 py-3 rounded-lg border border-slate-800 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Carregando ambiente executivo Cortex OS...</span>
        </div>
      </div>
    );
  }

  if (!authorized && pathname !== '/cortex/login') return null;

  if (pathname === '/cortex/login') {
    return <div className="min-h-screen bg-[#08090d]">{children}</div>;
  }

  const menuItems = [
    { name: 'Olho de Hórus', path: '/cortex', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
    { name: 'Fulfillment & Pedidos', path: '/cortex/pedidos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'WMS & Estoque', path: '/cortex/estoque', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Catálogo & Product Studio', path: '/cortex/catalogo', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { name: 'Supply Chain & Facções', path: '/cortex/supply', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Tesouraria & DRE', path: '/cortex/financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Patronos (CRM RFM)', path: '/cortex/crm', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Parcerias & Seeding', path: '/cortex/embaixadores', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`flex min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDark ? 'bg-[#0a0b10] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* SIDEBAR ERGONÔMICA */}
      <aside className={`hidden lg:flex flex-col w-64 border-r transition-colors duration-200 ${
        isDark ? 'bg-[#10121a] border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <div className={`h-16 flex items-center px-6 border-b justify-between ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <Link href="/cortex" className="font-serif text-lg tracking-[0.2em] font-bold uppercase">
            CORTEX<span className={isDark ? 'text-amber-500' : 'text-amber-600'}>OS</span>
          </Link>
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${
            isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            v2.0
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  isActive 
                    ? isDark 
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10' 
                      : 'bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CONTROLES DA BASE DA SIDEBAR */}
        <div className={`p-4 border-t space-y-3 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          {/* TOGGLE TEMA LIGHT / DARK */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isDark 
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <span className="flex items-center space-x-2">
              {isDark ? (
                <>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span>Modo Escuro</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  <span>Modo Claro</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-mono opacity-60">ALTERAR</span>
          </button>

          <button
            onClick={handleLogout}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2 ${
              isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* TELA DE AVISO PARA DISPOSITIVOS MÓVEIS */}
      <div className="lg:hidden flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white">
        <span className="font-serif text-xl tracking-widest font-bold mb-2">CORTEX OS</span>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          A suíte executiva requer resolução de Tela Cheia em Desktop ou Tablet para exibição das tabelas contábeis.
        </p>
        <button onClick={handleLogout} className="mt-6 text-xs text-amber-400 underline underline-offset-4">
          Sair do Sistema
        </button>
      </div>

      {/* ÁREA PRINCIPAL EM TELA CHEIA */}
      <main className="hidden lg:flex flex-1 flex-col h-screen overflow-hidden">
        {/* CABEÇALHO SUPERIOR */}
        <header className={`h-16 flex items-center justify-between px-8 border-b transition-colors duration-200 ${
          isDark ? 'bg-[#10121a] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cortex OS</span>
            <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
            <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {menuItems.find(m => m.path === pathname)?.name || 'Módulo'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexão Supabase Direct</span>
            </div>
          </div>
        </header>

        {/* CONTAINER DINÂMICO DAS PÁGINAS */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}