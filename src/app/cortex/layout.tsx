'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Briefcase, Box, Factory, Users, 
  ChevronDown, ChevronRight, Bell, LogOut, Loader2 
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HELMET_LOGO_URL = "/logo-branca.png";

type MenuSection = {
  title: string;
  icon: React.ElementType;
  items: { name: string; path: string }[];
};

const MENU_STRUCTURE: MenuSection[] = [
  {
    title: 'Estratégia & Finanças',
    icon: Briefcase,
    items: [
      { name: 'Cockpit C-Level', path: '/cortex' },
      { name: 'DRE & Resultados', path: '/cortex/financeiro' },
      { name: 'Fluxo de Caixa', path: '/cortex/financeiro/fluxo' },
      { name: 'Balanço Patrimonial', path: '/cortex/financeiro/balanco' },
    ]
  },
  {
    title: 'Operação & Logística',
    icon: Box,
    items: [
      { name: 'Esteira de Pedidos', path: '/cortex/pedidos' },
      { name: 'Logística Reversa', path: '/cortex/qualidade/reversa' },
      { name: 'WMS & Estoque', path: '/cortex/estoque' },
          { name: 'Catálogo de Produtos', path: '/cortex/catalogo' },
      { name: 'Motor PIM (Novo)', path: '/cortex/catalogo/novo' },
    ]
  },
  {
    title: 'Supply & Produção',
    icon: Factory,
    items: [
      { name: 'Private Label Matrix', path: '/cortex/supply' },
      { name: 'Gestão de Insumos', path: '/cortex/supply/insumos' },
      { name: 'Valuation de Estoque', path: '/cortex/qualidade' },
    ]
  },
  {
    title: 'Relacionamento (CRM)',
    icon: Users,
    items: [
      { name: 'Base de Patronos', path: '/cortex/crm' },
      { name: 'Senado VIP', path: '/cortex/crm/senado' },
      { name: 'Growth & Analytics', path: '/cortex/growth' },
      { name: 'Gargalos & Abandonos', path: '/cortex/qualidade/abandonos' },
    ]
  }
];

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);

  // Verifica Autenticação
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

  // Abre automaticamente a seção que contém a rota atual
  useEffect(() => {
    MENU_STRUCTURE.forEach(section => {
      if (section.items.some(item => pathname === item.path || pathname?.startsWith(item.path + '/'))) {
        if (!openSections.includes(section.title)) {
          setOpenSections(prev => [...prev, section.title]);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/cortex/login');
  };

  // Telas de Loading e Login mantêm isolamento
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-zinc-900 animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-500">Conectando ao Banco de Dados...</span>
        </div>
      </div>
    );
  }

  if (!authorized && pathname !== '/cortex/login') return null;

  if (pathname === '/cortex/login') {
    return <div className="min-h-screen bg-zinc-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-200">
      
      {/* SIDEBAR (MENU LATERAL) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-zinc-200 shadow-sm z-10 sticky top-0 h-screen overflow-y-auto">
        
        {/* LOGO AREA */}
        <div className="h-20 flex items-center px-8 border-b border-zinc-100">
          <Link href="/cortex" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 filter brightness-0 transition-opacity group-hover:opacity-70">
              <Image src={HELMET_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="font-serif text-lg tracking-[0.15em] font-bold uppercase text-zinc-900 leading-none">CORTEX</h1>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">Operations Core</span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION ACCORDION */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {MENU_STRUCTURE.map((section) => {
            const isOpen = openSections.includes(section.title);
            const Icon = section.icon;
            
            return (
              <div key={section.title} className="flex flex-col">
                <button 
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-colors ${
                    isOpen ? 'bg-zinc-50' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isOpen ? 'text-zinc-900' : 'text-zinc-500'}`} />
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${isOpen ? 'text-zinc-900' : 'text-zinc-600'}`}>
                      {section.title}
                    </span>
                  </div>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
                
                {/* SUB-ABAS */}
                {isOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-zinc-200 space-y-1 py-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link 
                          key={item.path} 
                          href={item.path}
                          className={`block px-3 py-2 rounded-md text-[11px] font-medium transition-all ${
                            isActive 
                              ? 'bg-zinc-900 text-white font-bold shadow-sm' 
                              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* LOGOUT AREA */}
        <div className="p-4 border-t border-zinc-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-md text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DE CONTEÚDO */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER DO CONTEÚDO */}
        <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Terminal</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-900 font-bold">{pathname?.split('/').pop() || 'Dashboard'}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Banco Integrado</span>
            </div>
            
            <button 
              onClick={() => setIsAlertDrawerOpen(true)}
              className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </button>
          </div>
        </header>

        {/* CONTAINER DINÂMICO DOS MÓDULOS */}
        <div className="flex-1 bg-zinc-50/50 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}