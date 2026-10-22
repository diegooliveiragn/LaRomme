'use client';

import React from 'react';
import { Scale, Landmark, Coins, TrendingUp, PiggyBank, ArrowDownToLine, Download } from 'lucide-react';

export default function BalancoPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Valores mockados para a demonstração C-Level
  const assets = {
    caixa: 12845.50,
    recebiveis: 4500.00,
    estoque: 14200.00,
    imobilizado: 2500.00 // Equipamentos, computadores, etc.
  };
  
  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);

  const liabilities = {
    fornecedores: 5800.00,
    impostos: 1250.00,
    emprestimos: 0.00
  };

  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
  
  const netWorth = totalAssets - totalLiabilities;
  
  // Cálculo de preenchimento para as barras visuais
  const getPercentage = (value: number, total: number) => `${Math.round((value / total) * 100)}%`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Balanço Patrimonial</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Raio-X de Riqueza e Posição Financeira Consolidada</p>
        </div>
        <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Exportar Balanço Real
        </button>
      </div>

      {/* KPI PRINCIPAL: PATRIMÔNIO LÍQUIDO */}
      <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-center relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 w-full md:w-auto text-center md:text-left mb-6 md:mb-0">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-2">Patrimônio Líquido (Riqueza do Fundador)</span>
          <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{formatBRL(netWorth)}</span>
          <div className="flex justify-center md:justify-start items-center gap-2 mt-3">
             <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 flex items-center gap-1">
               <TrendingUp className="w-3 h-3" /> Saudável
             </span>
             <span className="text-[10px] font-mono text-zinc-500">Ativos superam Passivos em 4.8x</span>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-1/3 flex items-center justify-center">
           <Scale className="w-24 h-24 text-zinc-800/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUNA: ATIVOS (O que a empresa TEM) */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" /> Ativos
            </h2>
            <span className="text-sm font-black text-zinc-900">{formatBRL(totalAssets)}</span>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* Ativo Circulante */}
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">Ativo Circulante (Liquidez Imediata)</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-zinc-400"/> Caixa e Equivalentes</span>
                    <span>{formatBRL(assets.caixa)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-zinc-800 h-1.5 rounded-full" style={{ width: getPercentage(assets.caixa, totalAssets) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><ArrowDownToLine className="w-3.5 h-3.5 text-zinc-400"/> Contas a Receber (Gateways)</span>
                    <span>{formatBRL(assets.recebiveis)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-zinc-600 h-1.5 rounded-full" style={{ width: getPercentage(assets.recebiveis, totalAssets) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><PiggyBank className="w-3.5 h-3.5 text-zinc-400"/> Estoque (Valor de Custo)</span>
                    <span>{formatBRL(assets.estoque)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-zinc-400 h-1.5 rounded-full" style={{ width: getPercentage(assets.estoque, totalAssets) }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ativo Não Circulante */}
            <div className="pt-4 border-t border-zinc-100">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">Ativo Não Circulante</h3>
              
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                  <span className="flex items-center gap-1.5">Imobilizado (Equipamentos)</span>
                  <span>{formatBRL(assets.imobilizado)}</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5">
                  <div className="bg-zinc-300 h-1.5 rounded-full" style={{ width: getPercentage(assets.imobilizado, totalAssets) }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* COLUNA: PASSIVOS (O que a empresa DEVE) */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-600" /> Passivos
            </h2>
            <span className="text-sm font-black text-rose-600">{formatBRL(totalLiabilities)}</span>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* Passivo Circulante */}
            <div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">Passivo Circulante (Curto Prazo)</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                    <span>Fornecedores a Pagar (Facções)</span>
                    <span className="text-rose-600">{formatBRL(liabilities.fornecedores)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: getPercentage(liabilities.fornecedores, totalLiabilities || 1) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                    <span>Obrigações Fiscais (Impostos)</span>
                    <span className="text-rose-600">{formatBRL(liabilities.impostos)}</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5">
                    <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: getPercentage(liabilities.impostos, totalLiabilities || 1) }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passivo Não Circulante */}
            <div className="pt-4 border-t border-zinc-100">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-4">Passivo Não Circulante (Longo Prazo)</h3>
              
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1.5">
                  <span>Empréstimos e Financiamentos</span>
                  <span className="text-zinc-500">{formatBRL(liabilities.emprestimos)}</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5">
                  <div className="bg-zinc-200 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}