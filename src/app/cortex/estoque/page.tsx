'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box, RefreshCw, AlertCircle, CheckCircle2, TrendingDown,
  DollarSign, Clock, MessageSquare, ArrowRight, ExternalLink
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: string;
  isOneSize?: boolean;
  costEstimate: number;
  stock: {
    P: number;
    M: number;
    G: number;
    GG: number;
    TU: number;
  };
  dailyVelocity: number;
  daysOfInventory: number;
  leadTimeDays: number;
  supplierName: string;
  supplierPhone: string;
  moq: number;
}

export default function CortexEstoquePage() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedRepor, setSelectedRepor] = useState<InventoryItem | null>(null);

  // Parâmetros de fornecedores e fábrica padrão
  const SUPPLIER_CONFIG: Record<string, { leadTime: number; supplier: string; phone: string; moq: number; cost: number }> = {
    vestigium: { leadTime: 20, supplier: 'Têxtil Maranguape / Facção Alfa', phone: '5585999990001', moq: 100, cost: 68.00 },
    tenax: { leadTime: 18, supplier: 'Poliamida Tech Ceará', phone: '5585999990002', moq: 120, cost: 52.00 },
    libertas: { leadTime: 15, supplier: 'Malharia Beira-Mar', phone: '5585999990003', moq: 80, cost: 42.00 },
    umbra: { leadTime: 25, supplier: 'Boneteria Nordeste', phone: '5585999990004', moq: 50, cost: 45.00 },
  };

  const initializeInventory = async () => {
    setLoading(true);
    try {
      // 1. Busca estoque na tabela products
      const { data: dbProducts } = await supabase.from('products').select('*');

      // 2. Busca histórico recente de vendas (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const items: InventoryItem[] = PRODUCTS.map((prod) => {
        const dbMatch = dbProducts?.find((p: any) => p.id === prod.id || p.name?.toLowerCase().includes(prod.id));
        const conf = SUPPLIER_CONFIG[prod.id] || { leadTime: 20, supplier: 'Fornecedor Principal', phone: '5585999990000', moq: 100, cost: 50.00 };

        const stockP = Number(dbMatch?.stock_p ?? 0);
        const stockM = Number(dbMatch?.stock_m ?? 0);
        const stockG = Number(dbMatch?.stock_g ?? 0);
        const stockGG = Number(dbMatch?.stock_gg ?? 0);
        const stockTU = Number(dbMatch?.stock_tu ?? 0);

        const totalStock = prod.isOneSize ? stockTU : (stockP + stockM + stockG + stockGG);

        // Calcula vendas dos últimos 30 dias
        const soldIn30Days = (orderItems || [])
          .filter((oi: any) => oi.product_id === prod.id)
          .reduce((sum: number, oi: any) => sum + (Number(oi.quantity) || 1), 0);

        // Velocidade média diária (com fallback realista de 1.5 un/dia se o produto for novo)
        const dailyVelocity = soldIn30Days > 0 ? Number((soldIn30Days / 30).toFixed(2)) : 1.5;

        // Dias de cobertura
        const daysOfInventory = dailyVelocity > 0 ? Math.floor(totalStock / dailyVelocity) : 999;

        return {
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          isOneSize: prod.isOneSize || false,
          costEstimate: conf.cost,
          leadTimeDays: conf.leadTime,
          supplierName: conf.supplier,
          supplierPhone: conf.phone,
          moq: conf.moq,
          dailyVelocity,
          daysOfInventory,
          stock: {
            P: stockP,
            M: stockM,
            G: stockG,
            GG: stockGG,
            TU: stockTU,
          },
        };
      });

      setInventory(items);
    } catch (e) {
      console.error('Erro ao mapear estoque e velocidade de vendas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeInventory();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Totais consolidados
  const totalUnits = inventory.reduce((acc, curr) => {
    if (curr.isOneSize) return acc + curr.stock.TU;
    return acc + curr.stock.P + curr.stock.M + curr.stock.G + curr.stock.GG;
  }, 0);

  const totalCostValuation = inventory.reduce((acc, curr) => {
    const units = curr.isOneSize ? curr.stock.TU : (curr.stock.P + curr.stock.M + curr.stock.G + curr.stock.GG);
    return acc + (units * curr.costEstimate);
  }, 0);

  const itensCriticos = inventory.filter(i => i.daysOfInventory <= i.leadTimeDays).length;

  // Monta texto e link para WhatsApp
  const generateWhatsAppLink = (item: InventoryItem) => {
    const suggestedUnits = Math.max(item.moq, Math.ceil(item.dailyVelocity * 30));
    const gradeSplit = item.isOneSize
      ? `${suggestedUnits} un Tamanho Único`
      : `${Math.round(suggestedUnits * 0.15)}P / ${Math.round(suggestedUnits * 0.45)}M / ${Math.round(suggestedUnits * 0.30)}G / ${Math.round(suggestedUnits * 0.10)}GG`;

    const message = encodeURIComponent(
      `Olá ${item.supplierName}, aqui é da LaRomme.\n` +
      `Gostaríamos de abrir uma nova Ordem de Produção preventiva para o artefato *${item.name}*.\n\n` +
      `• *Volume Sugerido:* ${suggestedUnits} peças\n` +
      `• *Grade:* ${gradeSplit}\n` +
      `• *Lead Time Alvo:* ${item.leadTimeDays} dias úteis\n\n` +
      `Por favor, confirme a disponibilidade de tecido/fiação e previsão de entrega.`
    );

    return `https://wa.me/${item.supplierPhone}?text=${message}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans text-white">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 font-bold block mb-1">
            WMS INTELIGENTE & PREVISIBILIDADE
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-wider uppercase text-white">
            Velocidade de Vendas & Reposição
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Taxa de queima diária, dias de estoque e acionamento direto de OPs para fornecedores.
          </p>
        </div>

        <button
          onClick={initializeInventory}
          disabled={loading}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Giro</span>
        </button>
      </div>

      {/* CARDS DE INTELIGÊNCIA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#080808] border border-zinc-900 p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-mono uppercase">
            <span>Saldo Físico Galpão</span>
            <Box className="w-4 h-4 text-zinc-500" />
          </div>
          <span className="text-3xl font-bold font-mono tracking-tight text-white block">
            {totalUnits} <span className="text-xs font-normal text-zinc-500 font-sans">peças</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500 block">
            Patrimônio Imobilizado: {formatBRL(totalCostValuation)}
          </span>
        </div>

        <div className="bg-[#080808] border border-zinc-900 p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-mono uppercase">
            <span>Giro Médio Geral</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold font-mono tracking-tight text-white block">
            ~1.5 <span className="text-xs font-normal text-zinc-500 font-sans">peças/dia/SKU</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 block">
            Base calibrada para o Drop 01
          </span>
        </div>

        <div className={`p-5 rounded border space-y-2 ${
          itensCriticos > 0 ? 'bg-rose-950/20 border-rose-900/60' : 'bg-zinc-950 border-zinc-900'
        }`}>
          <div className="flex justify-between items-center text-zinc-400 text-xs font-mono uppercase">
            <span>Alerta de Reposição</span>
            <AlertCircle className={`w-4 h-4 ${itensCriticos > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-600'}`} />
          </div>
          <span className={`text-3xl font-bold font-mono tracking-tight block ${itensCriticos > 0 ? 'text-rose-400' : 'text-white'}`}>
            {itensCriticos} <span className="text-xs font-normal text-zinc-500 font-sans">artefatos em ponto de corte</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500 block">
            Estoque menor que o tempo de fábrica
          </span>
        </div>
      </div>

      {/* TABELA DE ARTEFATOS COM VELOCIDADE E BOTÃO WHATSAPP */}
      <div className="bg-[#080808] border border-zinc-900 rounded overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 font-mono">
            Radar de Cobertura & Ponto de Reposição (ROP)
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Lead Time Fábrica: 15 a 25 dias
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-950/80 border-b border-zinc-900 text-zinc-400 uppercase tracking-widest text-[10px] font-mono">
              <tr>
                <th className="px-6 py-4">Artefato</th>
                <th className="px-6 py-4 text-center">Grade Atual (P/M/G/GG)</th>
                <th className="px-6 py-4 text-center">Ritmo Vendas</th>
                <th className="px-6 py-4 text-center">Dias Restantes</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ação Direta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono">
              {inventory.map((item) => {
                const total = item.isOneSize ? item.stock.TU : (item.stock.P + item.stock.M + item.stock.G + item.stock.GG);
                const isRuptura = item.daysOfInventory <= item.leadTimeDays || total === 0;
                const isAtencao = item.daysOfInventory > item.leadTimeDays && item.daysOfInventory <= (item.leadTimeDays + 15);

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-serif font-bold text-white text-sm block">{item.name}</span>
                        <span className="text-[10px] text-zinc-500 block uppercase font-mono">{item.category}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-zinc-300">
                      {item.isOneSize ? (
                        <span>TU: <b className="text-white">{item.stock.TU}</b></span>
                      ) : (
                        <span>{item.stock.P} / <b className="text-white">{item.stock.M}</b> / {item.stock.G} / {item.stock.GG}</span>
                      )}
                      <span className="block text-[9px] text-zinc-500">Total: {total} un</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-white">{item.dailyVelocity}</span>
                      <span className="text-[10px] text-zinc-500 block">un/dia</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`text-base font-bold ${
                        isRuptura ? 'text-rose-400' : isAtencao ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.daysOfInventory}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">dias de giro</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isRuptura ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/60 text-rose-400 border border-rose-900/60">
                          <TrendingDown className="w-3 h-3" /> Reposição Urgente
                        </span>
                      ) : isAtencao ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-400 border border-amber-900/60">
                          <AlertCircle className="w-3 h-3" /> Ponto de Reposição
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                          <CheckCircle2 className="w-3 h-3" /> Confortável
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRepor(item)}
                        className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 transition-all font-bold text-[11px] uppercase tracking-wider rounded inline-flex items-center gap-1.5 shadow"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-700" />
                        <span>Repor OP</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INTELIGENTE DE REPOSIÇÃO E DISPARO WHATSAPP */}
      {selectedRepor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-zinc-800 w-full max-w-lg p-6 md:p-8 rounded shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest block">ORDEM DE COMPRA DIRETA</span>
                <h3 className="font-serif text-2xl font-bold uppercase text-white">{selectedRepor.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedRepor(null)} 
                className="text-zinc-500 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-zinc-400 border-b border-zinc-900 pb-2">
                <span>Parceiro / Facção:</span>
                <span className="text-white font-bold">{selectedRepor.supplierName}</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-b border-zinc-900 pb-2">
                <span>Lead Time de Produção:</span>
                <span className="text-white font-bold">{selectedRepor.leadTimeDays} dias úteis</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-b border-zinc-900 pb-2">
                <span>Lote Mínimo da Oficina (MOQ):</span>
                <span className="text-white font-bold">{selectedRepor.moq} unidades</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-b border-zinc-900 pb-2">
                <span>Custo de Confecção Unitário:</span>
                <span className="text-white font-bold">{formatBRL(selectedRepor.costEstimate)}</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-bold pt-2">
                <span>Investimento Previsto (Sinal 50%):</span>
                <span className="text-emerald-400 font-mono text-sm">
                  {formatBRL((selectedRepor.moq * selectedRepor.costEstimate) * 0.5)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Prévia da Mensagem Gerada</span>
              <p className="text-xs text-zinc-300 font-sans italic leading-relaxed">
                "Olá {selectedRepor.supplierName}, gostaríamos de abrir uma OP preventiva para {selectedRepor.name} com {selectedRepor.moq} unidades para entrega em {selectedRepor.leadTimeDays} dias..."
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={generateWhatsAppLink(selectedRepor)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedRepor(null)}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest text-center rounded transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Disparar no WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setSelectedRepor(null)}
                className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}