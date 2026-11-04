'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, Percent, RefreshCw, Layers } from 'lucide-react';

export default function CortexSimuladorMargemPage() {
  const [pvp, setPvp] = useState<number>(229.90); // Preço de Venda
  const [cmv, setCmv] = useState<number>(68.00);   // Custo de Confecção
  const [unboxing, setUnboxing] = useState<number>(6.65); // Embalagem/Brindes
  const [taxPercent, setTaxPercent] = useState<number>(6.0); // Simples
  const [gatewayPercent, setGatewayPercent] = useState<number>(0.99); // Pix MP
  const [freeShippingCost, setFreeShippingCost] = useState<number>(0.00); // Frete subsidiado

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Cálculos de Unit Economics
  const taxValue = pvp * (taxPercent / 100);
  const gatewayValue = pvp * (gatewayPercent / 100);
  const totalVariableDeductions = taxValue + gatewayValue + freeShippingCost;
  const netRevenue = pvp - totalVariableDeductions;
  
  const directCosts = cmv + unboxing;
  const contributionMarginBRL = netRevenue - directCosts;
  const contributionMarginPercent = pvp > 0 ? (contributionMarginBRL / pvp) * 100 : 0;
  const markup = directCosts > 0 ? pvp / directCosts : 0;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            CONTROLADORIA & UNIT ECONOMICS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Simulador de Margem de Contribuição
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Sensibilidade de Lucro Líquido por Peça, Descontos de Campanha e Subsídio de Frete
          </p>
        </div>
      </div>

      {/* KPIS DE RESULTADO UNITÁRIO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Margem de Contribuição Líquida (R$)
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {formatBRL(contributionMarginBRL)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {contributionMarginPercent.toFixed(1)}% do preço bruto de vitrine
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Markup Efetivo
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {markup.toFixed(2)}x
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            PVP sobre Custos Diretos ({formatBRL(directCosts)})
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Ponto de Equilíbrio em Mídia (ROAS Mínimo)
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {contributionMarginPercent > 0 ? (100 / contributionMarginPercent).toFixed(2) : '—'}x
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            ROAS mínimo necessário para não ter prejuízo
          </p>
        </div>
      </div>

      {/* FORMULÁRIO DE SIMULAÇÃO */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 font-mono text-xs">
          <h2 className="text-xs font-bold font-sans text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
            1. Precificação & Deduções Variáveis
          </h2>
          <div>
            <label className="block text-zinc-600 mb-1 font-bold uppercase">Preço de Venda ao Público (R$):</label>
            <input
              type="number"
              value={pvp}
              onChange={(e) => setPvp(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-bold text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-600 mb-1 font-bold uppercase">Imposto Simples (%):</label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-zinc-600 mb-1 font-bold uppercase">Gateway Pix (%):</label>
              <input
                type="number"
                value={gatewayPercent}
                onChange={(e) => setGatewayPercent(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-600 mb-1 font-bold uppercase">Subsídio de Frete Grátis (R$ por peça):</label>
            <input
              type="number"
              value={freeShippingCost}
              onChange={(e) => setFreeShippingCost(Number(e.target.value))}
              placeholder="0.00"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <h2 className="text-xs font-bold font-sans text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
            2. Custos Diretos de Produto
          </h2>
          <div>
            <label className="block text-zinc-600 mb-1 font-bold uppercase">Custo Confecção / Facção (R$):</label>
            <input
              type="number"
              value={cmv}
              onChange={(e) => setCmv(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-bold text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-zinc-600 mb-1 font-bold uppercase">Unboxing & Tags (R$):</label>
            <input
              type="number"
              value={unboxing}
              onChange={(e) => setUnboxing(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 bg-zinc-50/60 p-4 rounded text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Receita Líquida pós-taxas:</span>
              <span className="font-bold text-zinc-900">{formatBRL(netRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Custos Totais Diretos:</span>
              <span className="font-bold text-rose-600">- {formatBRL(directCosts)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-200 font-bold text-xs">
              <span className="text-zinc-900">Margem Limpa no Bolso:</span>
              <span className="text-emerald-600">{formatBRL(contributionMarginBRL)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}