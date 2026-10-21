'use client';

import React from 'react';

export default function PedidosPage() {
  return (
    <div className="space-y-8 font-sans h-[calc(100vh-6rem)] flex flex-col">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-200 pb-5 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide">ESTEIRA DE FULFILLMENT</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Gestão de Separação e Despacho de Pedidos</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
            Imprimir Picking List
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2">
            <span>Sincronizar MelhorEnvio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* COLUNA 1: PIX PENDENTE (Monitoramento) */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-100/50 flex justify-between items-center shrink-0">
            <h2 className="text-[11px] font-bold text-zinc-700 tracking-widest uppercase">1. PIX Pendente</h2>
            <span className="bg-zinc-200 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
          </div>
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            
            {/* Card de Pedido Pendente */}
            <div className="bg-white border border-zinc-200 rounded p-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">#LR-1049</span>
                <span className="text-[9px] font-mono bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Aguardando Pagto</span>
              </div>
              <div className="mb-3">
                <p className="text-xs font-bold text-zinc-900">Gabriel Almeida</p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">1x TENAX T-SHIRT (M)</p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">1x UMBRA 5-PANEL (TU)</p>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-100 pt-2 mt-2">
                <span className="text-xs font-bold text-zinc-900">R$ 359,80</span>
                <span className="text-[9px] text-amber-500 font-mono">Expira em 14 min</span>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-[10px] text-zinc-400 font-mono max-w-[200px] mx-auto leading-relaxed">
                Reservas não pagas em 30 min serão liberadas automaticamente pelo sistema.
              </p>
            </div>

          </div>
        </div>

        {/* COLUNA 2: PRONTO PARA SEPARAÇÃO (Ação) */}
        <div className="bg-white border-2 border-zinc-200 rounded-lg shadow-sm flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center shrink-0">
            <h2 className="text-[11px] font-bold text-zinc-900 tracking-widest uppercase">2. Em Separação (Ação)</h2>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
          </div>
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            
            {/* Card de Pedido Pago 1 */}
            <div className="bg-white border border-emerald-200 rounded p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold block mb-0.5">#LR-1048</span>
                  <p className="text-sm font-bold text-zinc-900">Lucas M. Silveira</p>
                </div>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider">PIX APROVADO</span>
              </div>
              
              <div className="bg-zinc-50 p-2 rounded border border-zinc-100 mb-3">
                <p className="text-[10px] font-mono font-bold text-zinc-700 mb-1 border-b border-zinc-200 pb-1">ITENS DO PACOTE:</p>
                <ul className="text-[11px] text-zinc-600 font-mono space-y-1">
                  <li className="flex justify-between"><span>1x VESTIGIUM BOXY</span> <span className="font-bold text-black">TAM: G</span></li>
                </ul>
              </div>

              <div className="space-y-1 mb-4 border-b border-zinc-100 pb-3">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Endereço de Entrega</p>
                <p className="text-[11px] text-zinc-600">Rua Visconde de Mauá, 450 - Apto 302</p>
                <p className="text-[11px] text-zinc-600">Aldeota, Fortaleza - CE (60125-160)</p>
              </div>

              <button className="w-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2">
                <span>GERAR ETIQUETA (MELHORENVIO)</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              </button>
            </div>

            {/* Card de Pedido Pago 2 */}
            <div className="bg-white border border-emerald-200 rounded p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold block mb-0.5">#LR-1047</span>
                  <p className="text-sm font-bold text-zinc-900">Camila Fontenelle</p>
                </div>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded uppercase tracking-wider">PIX APROVADO</span>
              </div>
              
              <div className="bg-zinc-50 p-2 rounded border border-zinc-100 mb-3">
                <p className="text-[10px] font-mono font-bold text-zinc-700 mb-1 border-b border-zinc-200 pb-1">ITENS DO PACOTE:</p>
                <ul className="text-[11px] text-zinc-600 font-mono space-y-1">
                  <li className="flex justify-between"><span>1x LIBERTAS REGATA</span> <span className="font-bold text-black">TAM: P</span></li>
                  <li className="flex justify-between"><span>1x UMBRA 5-PANEL</span> <span className="font-bold text-black">TAM: ÚNICO</span></li>
                </ul>
              </div>

              <button className="w-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2">
                <span>GERAR ETIQUETA (MELHORENVIO)</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              </button>
            </div>

          </div>
        </div>

        {/* COLUNA 3: DESPACHADO (Histórico) */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-100/50 flex justify-between items-center shrink-0">
            <h2 className="text-[11px] font-bold text-zinc-700 tracking-widest uppercase">3. Finalizados / Despachados</h2>
            <span className="bg-zinc-200 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">124</span>
          </div>
          <div className="p-4 overflow-y-auto space-y-3 flex-1 opacity-75 hover:opacity-100 transition-opacity">
            
            {/* Card de Pedido Finalizado */}
            <div className="bg-white border border-zinc-200 rounded p-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-400"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">#LR-1046</span>
                <span className="text-[9px] font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Despachado</span>
              </div>
              <p className="text-xs font-bold text-zinc-700">Pedro H. Nogueira</p>
              
              <div className="flex justify-between items-center border-t border-zinc-100 pt-2 mt-2">
                <div className="flex items-center gap-1 text-[9px] font-mono text-blue-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  <span>Ver Rastreio</span>
                </div>
                <span className="text-[9px] text-zinc-400 font-mono">Ontem, 16h42</span>
              </div>
            </div>

            {/* Pedido Cancelado/Expirado */}
            <div className="bg-zinc-100 border border-zinc-200 rounded p-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-zinc-400 line-through">#LR-1045</span>
                <span className="text-[9px] font-mono bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Expirado</span>
              </div>
              <p className="text-xs font-bold text-zinc-500">Matheus Costa</p>
              <div className="flex justify-between items-center border-t border-zinc-200 pt-2 mt-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Estoque Devolvido</span>
                <span className="text-[9px] text-zinc-400 font-mono">Ontem, 03h12</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}