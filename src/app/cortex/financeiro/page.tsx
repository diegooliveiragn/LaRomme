'use client';

import React, { useState } from 'react';

export default function FinanceiroPage() {
  // Simulando dados do mês atual para a DRE
  const [adSpend, setAdSpend] = useState<number>(1250.00); // Gasto em Mídia
  const [fixedCosts, setFixedCosts] = useState<number>(450.00); // Vercel, Supabase, Domínio, etc.
  const [reserveGoal] = useState<number>(3); // Meta de Reserva: 3 meses de custo fixo
  
  const grossRevenue = 18450.00;
  const taxes = grossRevenue * 0.06; // 6% Simples
  const gatewayFees = grossRevenue * 0.0299; // ~3% Mercado Pago
  const cogs = 4800.00; // Custo dos Produtos Vendidos (Private Label)
  const packagingCosts = 320.00; // Caixas, tags, seda
  const giftCosts = 450.00; // Toalhas, flanelas (Mimos)
  const returnsLoss = 180.00; // Logística Reversa

  // Cascata da DRE
  const netRevenue = grossRevenue - taxes - gatewayFees;
  const grossProfit = netRevenue - cogs - packagingCosts - giftCosts - returnsLoss;
  const ebitda = grossProfit - adSpend;
  const netProfit = ebitda - fixedCosts;

  // Análise de Pró-labore e Caixa Livre
  const currentCash = 8500.00; // Saldo real na conta
  const safetyReserveTarget = fixedCosts * reserveGoal; // R$ 1.350
  const availableForDistribution = Math.max(0, currentCash - safetyReserveTarget);
  const isHealthy = currentCash >= safetyReserveTarget;

  const formatBRL = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">CFO Digital & DRE</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Gestão de Caixa, Pró-labore e Blindagem de Centavos</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Exportar PDF
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 rounded hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: DRE & GRÁFICO (8 Colunas) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* GRÁFICO DE LINHA DO TEMPO (Placeholder Estrutural) */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">EVOLUÇÃO DO CAIXA (YTD)</h2>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">MÊS ATUAL</span>
            </div>
            <div className="h-48 border-b border-l border-zinc-200 relative flex items-end justify-between pt-4 px-2">
              {/* Representação visual simplificada para a UI */}
              <div className="w-full h-full flex items-end gap-2 px-2 pb-1 opacity-70">
                {[30, 45, 20, 60, 80, 50, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                    <div className="w-full bg-zinc-200 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    <div className="w-full bg-emerald-200 rounded-t-sm group-hover:bg-emerald-300 transition-colors" style={{ height: `${h * 0.4}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-mono text-zinc-500 uppercase px-2">
              <span>Faturamento Bruto (Cinza)</span>
              <span>Lucro Líquido (Verde)</span>
            </div>
          </div>

          {/* DRE GERENCIAL CASCATA */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">DEMONSTRATIVO DE RESULTADOS (DRE)</h2>
            </div>
            
            <div className="p-5 font-mono text-xs">
              <div className="space-y-2">
                {/* Receita Bruta */}
                <div className="flex justify-between items-center bg-zinc-100 p-2 rounded">
                  <span className="font-bold text-zinc-800 uppercase">1. Receita Bruta Total</span>
                  <span className="font-bold text-zinc-900">{formatBRL(grossRevenue)}</span>
                </div>
                
                {/* Deduções */}
                <div className="pl-4 space-y-1 py-1 border-l-2 border-rose-100 ml-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Impostos Incidentes (DAS)</span>
                    <span className="text-rose-600">-{formatBRL(taxes)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Taxas de Gateway / Cartão</span>
                    <span className="text-rose-600">-{formatBRL(gatewayFees)}</span>
                  </div>
                </div>

                {/* Receita Líquida */}
                <div className="flex justify-between items-center border-t border-zinc-200 pt-2 mt-2">
                  <span className="font-bold text-zinc-700 uppercase">2. Receita Líquida</span>
                  <span className="font-bold text-zinc-800">{formatBRL(netRevenue)}</span>
                </div>

                {/* CMV e Custos Variáveis */}
                <div className="pl-4 space-y-1 py-1 border-l-2 border-rose-100 ml-2">
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) CMV (Custo de Fabricação PL)</span>
                    <span className="text-rose-600">-{formatBRL(cogs)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Embalagens & Frete Subsidiado</span>
                    <span className="text-rose-600">-{formatBRL(packagingCosts)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Brindes Direcionados (CAC Extra)</span>
                    <span className="text-rose-600">-{formatBRL(giftCosts)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Perdas (Devoluções / Avarias)</span>
                    <span className="text-rose-600">-{formatBRL(returnsLoss)}</span>
                  </div>
                </div>

                {/* Margem de Contribuição */}
                <div className="flex justify-between items-center border-t border-zinc-200 pt-2 mt-2">
                  <span className="font-bold text-zinc-700 uppercase">3. Margem de Contribuição Bruta</span>
                  <span className="font-bold text-zinc-800">{formatBRL(grossProfit)}</span>
                </div>

                {/* CAC de Mídia */}
                <div className="pl-4 py-1 border-l-2 border-rose-100 ml-2 mt-1">
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Tráfego & Meta Ads (CAC Mídia)</span>
                    <span className="text-rose-600">-{formatBRL(adSpend)}</span>
                  </div>
                </div>

                {/* Lucro Operacional */}
                <div className="flex justify-between items-center border-t border-zinc-200 pt-2 mt-2">
                  <span className="font-bold text-zinc-700 uppercase">4. Lucro Operacional (EBITDA)</span>
                  <span className="font-bold text-zinc-800">{formatBRL(ebitda)}</span>
                </div>

                {/* Custos Fixos */}
                <div className="pl-4 py-1 border-l-2 border-rose-100 ml-2 mt-1">
                  <div className="flex justify-between text-zinc-500">
                    <span>(-) Custos Fixos (Softwares, Domínio)</span>
                    <span className="text-rose-600">-{formatBRL(fixedCosts)}</span>
                  </div>
                </div>

                {/* RESULTADO FINAL (LUCRO LÍQUIDO) */}
                <div className="flex justify-between items-center border border-emerald-200 bg-emerald-50 p-3 mt-4 rounded shadow-sm">
                  <div>
                    <span className="font-bold text-emerald-900 uppercase tracking-widest text-sm block">LUCRO LÍQUIDO REAL</span>
                    <span className="text-[10px] text-emerald-700">Margem líquida do período: {((netProfit / grossRevenue) * 100).toFixed(1)}%</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700 tracking-tight">{formatBRL(netProfit)}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PRÓ-LABORE & INSUMOS (4 Colunas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TERMÔMETRO DE PRÓ-LABORE */}
          <div className={`rounded-lg border shadow-sm p-6 space-y-5 ${isHealthy ? 'bg-white border-emerald-200' : 'bg-white border-rose-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">RESERVA & PRÓ-LABORE</h2>
                <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Indicador de Saúde de Caixa</p>
              </div>
              <span className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}></span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Saldo Atual em Conta:</span>
                <span className="font-bold text-zinc-900">{formatBRL(currentCash)}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Reserva de Segurança (3x Custo Fixo):</span>
                <span className="text-zinc-700">{formatBRL(safetyReserveTarget)}</span>
              </div>
              <div className="pt-2">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">DISPONÍVEL P/ DISTRIBUIÇÃO</span>
                <span className={`text-2xl font-bold tracking-tight ${isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatBRL(availableForDistribution)}
                </span>
              </div>
            </div>

            {!isHealthy ? (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 text-[10px] p-3 rounded font-mono leading-relaxed">
                <strong>ATENÇÃO:</strong> Caixa operando abaixo da margem de segurança. Não é recomendada a retirada de lucros ou pró-labore até a recomposição da reserva.
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] p-3 rounded font-mono leading-relaxed">
                Caixa blindado. O valor disponível pode ser retirado como pró-labore ou reinvestido em estoque para alavancagem.
              </div>
            )}
          </div>

          {/* PAINEL DE INSERÇÃO DE CUSTOS GLOBAIS */}
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl overflow-hidden text-white">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-bold tracking-widest uppercase font-serif">Ajuste de Variáveis</h2>
              <p className="text-[10px] font-mono text-zinc-400 mt-1">Alimentação do Motor DRE</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-zinc-400 mb-1.5 uppercase">Mídia / Ad Spend (Mês)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-zinc-500">R$</span>
                  <input 
                    type="number" 
                    value={adSpend} 
                    onChange={(e) => setAdSpend(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 pl-8 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest text-zinc-400 mb-1.5 uppercase">Custos Fixos (Mês)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-zinc-500">R$</span>
                  <input 
                    type="number" 
                    value={fixedCosts} 
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 pl-8 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <button className="w-full bg-white text-black font-bold text-[10px] tracking-widest uppercase py-2.5 hover:bg-zinc-200 transition-colors">
                  Atualizar Motor DRE
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}