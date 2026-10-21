'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NotificationItem {
  id: string;
  type: 'urgente' | 'operacional' | 'estrategico';
  title: string;
  description: string;
  time: string;
  actionLabel: string;
  actionHref: string;
  read: boolean;
}

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Isolamento da tela de login para não renderizar a navegação administrativa
  if (pathname === '/cortex/login') {
    return <>{children}</>;
  }

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'urgente',
      title: 'Estoque Crítico: TENAX (M)',
      description: 'Restam apenas 2 unidades no WMS. Sugerido acionar reposição de grade.',
      time: 'Há 12 min',
      actionLabel: 'Ver no Supply',
      actionHref: '/cortex/supply',
      read: false,
    },
    {
      id: '2',
      type: 'operacional',
      title: '2 Pedidos Prontos para Despacho',
      description: 'Pagamentos PIX liquidados aguardando conferência e etiqueta.',
      time: 'Há 45 min',
      actionLabel: 'Ir para Pedidos',
      actionHref: '/cortex/pedidos',
      read: false,
    },
    {
      id: '3',
      type: 'estrategico',
      title: 'Reserva Expirada de Lote',
      description: '1 pedido PIX excedeu o tempo limite de 30 minutos sem confirmação.',
      time: 'Há 1h',
      actionLabel: 'Liberar Estoque',
      actionHref: '/cortex/pedidos',
      read: false,
    },
    {
      id: '4',
      type: 'operacional',
      title: 'Novo Membro: Senado VIP',
      description: 'Novo cadastro registrado no portal aguardando recepção Concierge.',
      time: 'Há 2h',
      actionLabel: 'Abrir CRM',
      actionHref: '/cortex/crm',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const NAV_SECTIONS = [
    {
      category: 'ESTRATÉGIA & VISÃO',
      items: [
        { label: 'Cockpit do Fundador', href: '/cortex', icon: '📊' },
        { label: 'Financeiro & Pricing', href: '/cortex/financeiro', icon: '💳' },
      ],
    },
    {
      category: 'OPERAÇÃO & ESTOQUE',
      items: [
        { label: 'Esteira de Pedidos', href: '/cortex/pedidos', icon: '📦' },
        { label: 'Acervo & Produtos', href: '/cortex/catalogo', icon: '🏷️' },
        { label: 'Supply & Private Label', href: '/cortex/supply', icon: '🏭' },
      ],
    },
    {
      category: 'RELACIONAMENTO',
      items: [
        { label: 'CRM & Concierge', href: '/cortex/crm', icon: '👑' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 flex font-sans antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* 1. BARRA LATERAL (SIDEBAR CLARA & CONTRASTADA) */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 hidden md:flex z-20">
        <div>
          {/* Topo da Marca no Cortex */}
          <div className="h-16 px-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-zinc-900 text-white rounded flex items-center justify-center font-bold text-xs font-mono">
                C
              </div>
              <div>
                <span className="font-bold text-sm tracking-wider text-zinc-900 block font-serif">CORTEX OS</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">OPERATIONS CORE</span>
              </div>
            </div>
          </div>

          {/* Menus de Navegação por Área */}
          <nav className="p-4 space-y-6">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-zinc-600 font-bold uppercase px-3 block">
                  {section.category}
                </span>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Status & Versão */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/70">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-600 font-medium">FORTALEZA / BR</span>
            </div>
            <Link href="/" target="_blank" className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 hover:underline">
              Loja ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL DE CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* BARRA SUPERIOR (TOPBAR EXECUTIVO) */}
        <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-zinc-900 text-white rounded flex items-center justify-center font-bold text-xs font-mono">
                C
              </div>
              <span className="font-bold text-sm font-serif">CORTEX</span>
            </div>
            <div className="hidden md:block font-mono text-xs text-zinc-500">
              TERMINAL // <span className="text-zinc-800 font-bold uppercase">{pathname.replace('/cortex', '') || 'COCKPIT GERAL'}</span>
            </div>
          </div>

          {/* SINO DE NOTIFICAÇÕES (ESTILO MENSAGERIA) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors focus:outline-none"
              title="Central de Alertas Operacionais"
              aria-label="Abrir Notificações"
            >
              {/* Ícone Sino SVG */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              
              {/* Badge Contador Vermelho */}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="h-6 w-[1px] bg-zinc-200" />

            {/* Perfil Fundador */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                LR
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-zinc-800 block leading-tight">DIRETORIA</span>
                <span className="text-[10px] font-mono text-zinc-600 block">LaRomme Core</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER DO CONTEÚDO (FUNDO OFF-WHITE CONFORTÁVEL) */}
        <main className="flex-1 p-6 md:p-8 bg-[#f8fafc] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. GAVETA LATERAL DE NOTIFICAÇÕES (SLIDE-OVER) */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200">
            
            {/* Header da Gaveta */}
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-900 font-serif">CENTRAL DE ALERTAS</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">
                    {unreadCount} PENDENTES
                  </span>
                )}
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-zinc-600 hover:text-zinc-900 p-1.5 rounded-md hover:bg-zinc-200 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            {/* Lista de Notificações */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all ${
                    !item.read
                      ? 'bg-white border-zinc-300 shadow-xs'
                      : 'bg-zinc-50/70 border-zinc-200 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.type === 'urgente'
                          ? 'bg-rose-100 text-rose-700'
                          : item.type === 'operacional'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">{item.time}</span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-zinc-600 leading-relaxed mb-3">{item.description}</p>

                  <div className="flex justify-end">
                    <Link
                      href={item.actionHref}
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors"
                    >
                      <span>{item.actionLabel}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer da Gaveta */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center text-xs">
              <button
                onClick={markAllAsRead}
                className="text-zinc-600 hover:text-zinc-900 font-medium text-[11px] underline underline-offset-4"
              >
                Marcar todas como lidas
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 rounded font-medium text-xs hover:bg-zinc-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}