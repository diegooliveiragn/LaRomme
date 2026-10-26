'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase, Box, Factory, Users,
  ChevronDown, ChevronRight, Bell, LogOut, Loader2,
  X, CheckCircle2, ArrowRight
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HELMET_LOGO_URL = "/logo-preta.png";

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
      { name: 'Auditoria de E-mails', path: '/cortex/crm/emails' },
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
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    try {
      const list: any[] = [];
      // Consulta estrita a pedidos pagos que requerem despacho
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('id, short_id, customer_name')
        .eq('status', 'paid')
        .limit(5);

      (paidOrders || []).forEach((o: any) => {
        list.push({
          id: `ord-${o.id}`,
          type: 'LOGISTICA',
          title: `Pedido #${o.short_id || o.id.slice(0, 8)} aguardando separação`,
          description: `${o.customer_name || 'Patrono'} • Pagamento aprovado`,
          link: '/cortex/pedidos'
        });
      });

      setAlerts(list);
    } catch {
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 font-bold">Carregando Cortex...</span>
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
      
      {/* SIDEBAR */}
      <aside
        data-lenis-prevent="true"
        className="hidden lg:flex flex-col w-72 bg-white border-r border-zinc-200 shadow-sm z-20 sticky top-0 h-screen select-none"
      >
        <div className="h-20 flex items-center px-8 border-b border-zinc-200 shrink-0">
          <Link href="/cortex" className="flex items-center gap-3 group">
            <div className="relative w-7 h-7">
              <Image src={HELMET_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="font-serif text-lg tracking-[0.15em] font-black uppercase text-zinc-900 leading-none">CORTEX</h1>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Operations Core</span>
            </div>
          </Link>
        </div>

        <nav
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y py-6 px-4 space-y-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {MENU_STRUCTURE.map((section) => {
            const isOpen = openSections.includes(section.title);
            const Icon = section.icon;

            return (
              <div key={section.title} className="flex flex-col">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors ${
                    isOpen ? 'bg-zinc-100 text-zinc-900 font-bold' : 'hover:bg-zinc-100/60 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isOpen ? 'text-zinc-900' : 'text-zinc-400'}`} />
                    <span className="text-xs uppercase tracking-wider font-bold">
                      {section.title}
                    </span>
                  </div>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                {isOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-zinc-200 space-y-1 py-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`block px-3 py-2 rounded-md text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-zinc-900 text-white shadow-sm'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
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

        <div className="p-4 border-t border-zinc-200 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50">
        <header className="h-20 border-b border-zinc-200 px-8 flex items-center justify-between bg-white/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <span className="text-zinc-400 font-bold">TERMINAL</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-900 font-black">{pathname?.split('/').pop() || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Banco Integrado</span>
            </div>

            {/* SINO COM BADGE 100% REATIVO (SÓ RENDERIZA SE ALERTS > 0) */}
            <button
              onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
              className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
              title="Alertas da Operação"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white tabular-nums animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* GAVETA DE ALERTAS */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAlertDrawerOpen(false)}
          />
          <aside className="relative w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300 font-sans">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wider">Centro de Alertas</h2>
                  <p className="text-xs font-mono text-zinc-500 font-bold mt-0.5">
                    {alerts.length} pendências ativas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertDrawerOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {alerts.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  Operação em dia. Nenhuma pendência crítica.
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.link}
                    onClick={() => setIsAlertDrawerOpen(false)}
                    className="block p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-400 hover:bg-white transition-all group shadow-2xs"
                  >
                    <h4 className="text-xs font-bold text-zinc-900">{alert.title}</h4>
                    <p className="text-xs text-zinc-600 mt-1">{alert.description}</p>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}