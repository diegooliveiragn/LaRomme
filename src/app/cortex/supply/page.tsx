'use client';

import React, { useState } from 'react';

export default function SupplyPage() {
  // Estados da Calculadora de Precificação
  const [costProvider, setCostProvider] = useState<number>(55.00);
  const [costPackaging, setCostPackaging] = useState<number>(6.50);
  const [taxRate, setTaxRate] = useState<number>(6.00); // Simples Nacional
  const [feeGateway, setFeeGateway] = useState<number>(4.99); // Mercado Pago/Cartão
  const [desiredMargin, setDesiredMargin] = useState<number>(30.00); // Margem Líquida Desejada

  // Cálculos Automáticos
  const totalCost = costProvider + costPackaging;
  const totalDeductions = taxRate + feeGateway;
  
  // Break-even: Preço mínimo para não ter prejuízo (Custo / (1 - Deduções))
  const breakEven = totalCost / (1 - (totalDeductions / 100));
  
  // Preço Sugerido (Alvo): (Custo / (1 - (Deduções + Margem Líquida)))
  const suggestedPrice = totalCost / (1 - ((totalDeductions + desiredMargin) / 100));
  
  // Lucro Líquido Real em R$
  const netProfit = suggestedPrice * (desiredMargin / 100);
  
  // Markup Multiplicador
  const markup = suggestedPrice / totalCost;

  // Formatação de Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide">SUPPLY & PRIVATE LABEL</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Engenharia de Custos • Reposição de Acervo</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
            Adicionar Peça (Tech Pack)
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors shadow-sm">
            + Novo Fornecedor PL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: MATRIZ DE FORNECEDORES (7 Colunas) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">MATRIZ COMPARATIVA</h2>
              <select className="bg-white border border-zinc-200 text-xs text-zinc-700 px-3 py-1 rounded font-mono focus:outline-none">
                <option>PEÇA: VESTIGIUM BOXY</option>
                <option>PEÇA: TENAX T-SHIRT</option>
                <option>PEÇA: UMBRA 5-PANEL</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white border-b border-zinc-200 text-zinc-500 font-mono">
                    <th className="py-3 px-5 font-bold uppercase tracking-wider">Fornecedor (PL)</th>
                    <th className="py-3 px-5 font-bold uppercase tracking-wider">Preço Unit.</th>
                    <th className="py-3 px-5 font-bold uppercase tracking-wider">MOQ</th>
                    <th className="py-3 px-5 font-bold uppercase tracking-wider">Prazo</th>
                    <th className="py-3 px-5 font-bold uppercase tracking-wider">Indicador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-zinc-900">Confecção Alfa</td>
                    <td className="py-4 px-5 font-mono text-zinc-700">R$ 52,00</td>
                    <td className="py-4 px-5 font-mono text-zinc-600">100 un.</td>
                    <td className="py-4 px-5 text-zinc-600">25 dias</td>
                    <td className="py-4 px-5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Maior Margem</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-zinc-900">Estúdio Beta PL</td>
                    <td className="py-4 px-5 font-mono text-zinc-700">R$ 58,00</td>
                    <td className="py-4 px-5 font-mono text-zinc-600">50 un.</td>
                    <td className="py-4 px-5 text-zinc-600">12 dias</td>
                    <td className="py-4 px-5">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Entrega Rápida</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-zinc-900">Têxtil Gamma</td>
                    <td className="py-4 px-5 font-mono text-zinc-700">R$ 65,00</td>
                    <td className="py-4 px-5 font-mono text-zinc-600">30 un.</td>
                    <td className="py-4 px-5 text-zinc-600">15 dias</td>
                    <td className="py-4 px-5">
                      <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Baixa Barreira</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 text-[11px] text-zinc-500 font-mono">
              * MOQ = Quantidade Mínima de Pedido (Minimum Order Quantity).
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CALCULADORA DE PRECIFICAÇÃO (5 Colunas) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl overflow-hidden text-white">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-sm font-bold tracking-widest uppercase font-serif">Motor de Precificação</h2>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded">SIMULADOR</span>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Entradas de Custo */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">1. Custos Diretos (CPV)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">CUSTO FORNECEDOR (R$)</label>
                    <input 
                      type="number" 
                      value={costProvider} 
                      onChange={(e) => setCostProvider(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">EMBALAGEM/TAGS (R$)</label>
                    <input 
                      type="number" 
                      value={costPackaging} 
                      onChange={(e) => setCostPackaging(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Entradas de Taxas */}
              <div className="space-y-4 border-t border-zinc-800 pt-5">
                <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">2. Variáveis & Margem</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1.5 font-mono">IMPOSTO (%)</label>
                    <input 
                      type="number" 
                      value={taxRate} 
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1.5 font-mono">GATEWAY (%)</label>
                    <input 
                      type="number" 
                      value={feeGateway} 
                      onChange={(e) => setFeeGateway(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 mb-1.5 font-mono">MARGEM (%)</label>
                    <input 
                      type="number" 
                      value={desiredMargin} 
                      onChange={(e) => setDesiredMargin(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-emerald-900/50 px-2 py-2 text-emerald-400 font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resultados do Motor */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 mt-4 space-y-4">
                
                <div className="flex justify-between items-end border-b border-zinc-900 pb-3">
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono tracking-widest mb-1">PREÇO ALVO SUGERIDO</span>
                    <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(suggestedPrice)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">MARKUP</span>
                    <span className="text-lg font-mono text-zinc-300">{markup.toFixed(2)}x</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">PONTO DE EQUILÍBRIO (BREAK-EVEN):</span>
                  <span className="text-zinc-300 font-bold">{formatCurrency(breakEven)}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono bg-emerald-950/30 p-2.5 rounded border border-emerald-900/30 mt-2">
                  <span className="text-emerald-500 font-bold tracking-widest uppercase">LUCRO LÍQUIDO / PEÇA:</span>
                  <span className="text-emerald-400 font-bold text-sm">{formatCurrency(netProfit)}</span>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}