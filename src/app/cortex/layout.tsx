'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase, Box, Factory, Users,
  ChevronDown, ChevronRight, Bell, LogOut, Loader2,
  X, AlertCircle, ArrowRight, CheckCircle2
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
      { name: 'Auditoria de E-mails', path: '/cortex/crm/emails' },
      { name: 'Growth & Analytics', path: '/cortex/growth' },
      { name: 'Gargalos & Abandonos', path: '/cortex/qualidade/abandonos' },
    ]
  }
];

interface OperationalAlert {
  id: string;
  type: 'LOGISTICA' | 'ABANDONO' | 'ESTOQUE';
  title: string;
  description: string;
  link: string;
}

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState<OperationalAlert[]>([]);

  // Monitoramento Operacional em Tempo Real
  const fetchAlerts = async () => {
    try {
      const list: OperationalAlert[] = [];

      // 1. Pedidos pagos aguardando despacho
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('id, short_id, customer_name')
        .eq('status', 'paid')
        .limit(3);

      (paidOrders || []).forEach((o: any) => {
        list.push({
          id: `ord-${o.id}`,
          type: 'LOGISTICA',
          title: `Pedido #${o.short_id || o.id.slice(0, 8)} aguardando separação`,
          description: `${o.customer_name || 'Patrono'} • Pagamento aprovado`,
          link: '/cortex/pedidos'
        });
      });

      // 2. Carrinhos pendentes (reservas Pix)
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('id, short_id, total_amount')
        .eq('status', 'pending')
        .limit(3);

      (pendingOrders || []).forEach((p: any) => {
        list.push({
          id: `pend-${p.id}`,
          type: 'ABANDONO',
          title: `Reserva Pix retida: #${p.short_id || p.id.slice(0, 8)}`,
          description: `R$ ${Number(p.total_amount || 0).toFixed(2)} • Risco de fuga`,
          link: '/cortex/qualidade/abandonos'
        });
      });

      // 3. Ruptura de Estoque
      const { data: prods } = await supabase
        .from('products')
        .select('id, name, stock_p, stock_m, stock_g, stock_gg, stock_tu')
        .limit(6);

      (prods || []).forEach((item: any) => {
        const pStock = item.stock_p ?? 0;
        const mStock = item.stock_m ?? 0;
        const gStock = item.stock_g ?? 0;
        const ggStock = item.stock_gg ?? 0;
        const tuStock = item.stock_tu ?? 0;
        const total = pStock + mStock + gStock + ggStock + tuStock;

        if (total === 0) {
          list.push({
            id: `stk-${item.id}`,
            type: 'ESTOQUE',
            title: `Estoque esgotado: ${item.name}`,
            description: 'Saldo zerado no galpão. Reposição necessária.',
            link: '/cortex/estoque'
          });
        } else if (pStock < 5 || mStock < 5 || gStock < 5 || ggStock < 5) {
          list.push({
            id: `stk-${item.id}`,
            type: 'ESTOQUE',
            title: `Risco de ruptura: ${item.name}`,
            description: 'Uma ou mais grades com saldo abaixo de 5 un.',
            link: '/cortex/estoque'
          });
        }
      });

      setAlerts(list);
    } catch (err) {
      console.error('Erro ao consultar alertas operacionais:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-slate-400">Conectando ao Banco de Dados...</span>
        </div>
      </div>
    );
  }

  if (!authorized && pathname !== '/cortex/login') return null;

  if (pathname === '/cortex/login') {
    return <div className="min-h-screen bg-zinc-950">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-zinc-800">

      {/* SIDEBAR */}
      <aside data-lenis-prevent className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-800/80 shadow-sm z-20 sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/80">
          <Link href="/cortex" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 filter brightness-100 transition-opacity group-hover:opacity-70">
              <Image src={HELMET_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
            </div>
            <div>
              <h1 className="font-serif text-lg tracking-[0.15em] font-bold uppercase text-white leading-none">CORTEX</h1>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Operations Core</span>
            </div>
          </Link>
        </div>

        <nav data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain py-6 px-4 space-y-2 custom-scrollbar">
          {MENU_STRUCTURE.map((section) => {
            const isOpen = openSections.includes(section.title);
            const Icon = section.icon;

            return (
              <div key={section.title} className="flex flex-col">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-colors ${
                    isOpen ? 'bg-slate-900/80' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                      {section.title}
                    </span>
                  </div>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1 py-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`block px-3 py-2 rounded-md text-[11px] font-medium transition-all ${
                            isActive
                              ? 'bg-white text-slate-950 font-black shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
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

        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-md text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER SUPERIOR */}
        <header className="h-20 border-b border-slate-800/80 px-8 flex items-center justify-between bg-slate-950/70 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <span className="text-slate-400">TERMINAL</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">{pathname?.split('/').pop() || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Banco Integrado</span>
            </div>

            {/* BOTÃO DO SININHO INTERATIVO */}
            <button
              onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
              title="Alertas do Sistema"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-2 ring-slate-950 tabular-nums">
                {alerts.length > 0 ? alerts.length : 3}
              </span>
            </button>
          </div>
        </header>

        {/* CONTAINER DINÂMICO DOS MÓDULOS */}
        <div className="flex-1 bg-slate-950 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* GAVETA DE ALERTAS OPERACIONAIS */}
      {isAlertDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAlertDrawerOpen(false)}
          />
          <aside className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300 font-sans">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Centro de Notificações</h2>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {alerts.length} pendência{alerts.length === 1 ? '' : 's'} operacional{alerts.length === 1 ? '' : 'is'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="p-12 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  Nenhuma pendência crítica. Todas as esteiras em dia.
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.link}
                    onClick={() => setIsAlertDrawerOpen(false)}
                    className="block p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        alert.type === 'LOGISTICA' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        alert.type === 'ABANDONO' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                        'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono group-hover:text-white flex items-center gap-1">
                        Resolver <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 group-hover:text-amber-200 transition-colors">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">
                      {alert.description}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>LaRomme Operations Core</span>
              <button
                onClick={fetchAlerts}
                className="text-amber-300 hover:text-amber-200 uppercase font-bold tracking-wider"
              >
                Atualizar Sinais
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}