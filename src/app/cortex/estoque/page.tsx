'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Mail, 
  Phone 
} from 'lucide-react';

interface DemandaItem {
  id?: string;
  product_slug: string;
  size: string;
  contact: string;
  created_at: string;
}

const PRODUCT_PRICES: Record<string, { name: string; price: number }> = {
  vestigium: { name: 'VESTIGIUM. (Algodão Boxy)', price: 229.90 },
  tenax: { name: 'TENAX. (T-Shirt Poliamida)', price: 189.90 },
  libertas: { name: 'LIBERTAS. (Regata Furadinha)', price: 149.90 },
  umbra: { name: 'UMBRA. (Boné 5-Panel Ripstop)', price: 169.90 },
};

export default function CortexEstoquePage() {
  const [demands, setDemands] = useState<DemandaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/demanda-reprimida');
      const data = await res.json();
      if (data.success) {
        setDemands(data.demands || []);
      }
    } catch (err) {
      console.error('Erro ao consultar demanda reprimida:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  // Cálculos agregados
  const totalSolicitacoes = demands.length;

  const vgvLatente = demands.reduce((acc, curr) => {
    const info = PRODUCT_PRICES[curr.product_slug] || { price: 180 };
    return acc + info.price;
  }, 0);

  // Agrupamento por produto e grade
  const demandByProduct: Record<string, Record<string, number>> = {};
  demands.forEach((d) => {
    if (!demandByProduct[d.product_slug]) {
      demandByProduct[d.product_slug] = {};
    }
    demandByProduct[d.product_slug][d.size] = (demandByProduct[d.product_slug][d.size] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                CORTEX OS // GESTÃO DE ACERVO
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                WMS & DEMANDA
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase font-mono">
              Demanda Reprimida & Ordens de Produção
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Interesse retido na página de produto para balanceamento de grade no próximo corte.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDemands}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <Link
              href="/cortex/supply"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              ← Supply Híbrido
            </Link>
          </div>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">SOLICITAÇÕES RETIDAS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{totalSolicitacoes}</span>
              <span className="text-xs text-zinc-400">patronos na fila</span>
            </div>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">VGV LATENTE ESTIMADO</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">R$ {vgvLatente.toFixed(2)}</span>
              <span className="text-xs text-zinc-500">receita aguardando corte</span>
            </div>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">DIRETRIZ DE OP</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-400">
                {Object.keys(demandByProduct).length > 0 ? `${Object.keys(demandByProduct).length} SKUs` : 'Grade Equilibrada'}
              </span>
              <span className="text-xs text-zinc-500">com intenção ativa</span>
            </div>
          </div>
        </div>

        {/* Matriz de Recomendação de Corte */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4 font-mono">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Balanço de Grade Sugerido para o Próximo Lote
            </h2>
            <span className="text-[10px] text-zinc-500">FORTALEZA, CE</span>
          </div>

          {Object.keys(demandByProduct).length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              Nenhuma solicitação de grade esgotada registrada no momento. O acervo atende à procura actual.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(demandByProduct).map(([slug, sizes]) => {
                const prod = PRODUCT_PRICES[slug] || { name: slug.toUpperCase(), price: 0 };
                const totalSlug = Object.values(sizes).reduce((a, b) => a + b, 0);

                return (
                  <div key={slug} className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">{slug}</span>
                        <span className="text-xs font-bold text-white">{prod.name}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{totalSlug} un</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-900">
                      {Object.entries(sizes).map(([sz, qty]) => (
                        <div key={sz} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-center">
                          <span className="text-[9px] text-zinc-500 block uppercase">{sz}</span>
                          <span className="text-xs font-bold text-white">{qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Registos de Contacto */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4 font-mono">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Fila de Patronos Aguardando Notificação
            </h2>
            <span className="text-[10px] text-zinc-500">ÚLTIMOS ENVIOS</span>
          </div>

          {demands.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">
              Fila vazia.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] text-zinc-500 border-b border-zinc-900 uppercase">
                    <th className="py-2">Artefato</th>
                    <th className="py-2">Grade</th>
                    <th className="py-2">Canal / Contacto</th>
                    <th className="py-2 text-right">Data de Registo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {demands.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 font-bold text-white">
                        {PRODUCT_PRICES[item.product_slug]?.name || item.product_slug}
                      </td>
                      <td className="py-2.5 text-zinc-400 uppercase">{item.size}</td>
                      <td className="py-2.5 text-zinc-200">{item.contact}</td>
                      <td className="py-2.5 text-right text-zinc-500 text-[11px]">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}