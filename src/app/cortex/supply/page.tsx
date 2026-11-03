'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Factory, 
  Layers, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  DollarSign, 
  PackageCheck, 
  Boxes 
} from 'lucide-react';

interface ArtifactSupply {
  id: string;
  name: string;
  category: string;
  pvp: number; // Preço de Venda ao Público
  privateLabel: {
    supplier: string;
    unitCost: number;
    moq: number;
    leadTimeDays: number;
  };
  fractional: {
    fabricCost: number; // Tecido/Malha por peça
    cutAndSew: number;  // Corte e costura por peça
    brandingTags: number; // Transfers refletivos, tags emborrachadas
    packaging: number;  // Embalagem e fita
    moq: number;
    leadTimeDays: number;
  };
}

const ARTIFACTS_SUPPLY: ArtifactSupply[] = [
  {
    id: 'vestigium',
    name: 'VESTIGIUM. (Algodão Boxy)',
    category: 'Lifestyle',
    pvp: 229.90,
    privateLabel: {
      supplier: 'Malharia Sul / Private Label',
      unitCost: 78.00,
      moq: 100,
      leadTimeDays: 35
    },
    fractional: {
      fabricCost: 32.00,
      cutAndSew: 18.00,
      brandingTags: 6.50,
      packaging: 3.50,
      moq: 30,
      leadTimeDays: 20
    }
  },
  {
    id: 'tenax',
    name: 'TENAX. (T-Shirt Poliamida)',
    category: 'Performance',
    pvp: 189.90,
    privateLabel: {
      supplier: 'Confecção Tech / SC',
      unitCost: 65.00,
      moq: 120,
      leadTimeDays: 40
    },
    fractional: {
      fabricCost: 26.00,
      cutAndSew: 16.00,
      brandingTags: 5.00,
      packaging: 3.50,
      moq: 25,
      leadTimeDays: 18
    }
  },
  {
    id: 'libertas',
    name: 'LIBERTAS. (Regata Furadinha)',
    category: 'Performance',
    pvp: 149.90,
    privateLabel: {
      supplier: 'Confecção Tech / SC',
      unitCost: 52.00,
      moq: 100,
      leadTimeDays: 35
    },
    fractional: {
      fabricCost: 19.00,
      cutAndSew: 14.00,
      brandingTags: 4.50,
      packaging: 3.50,
      moq: 25,
      leadTimeDays: 15
    }
  },
  {
    id: 'umbra',
    name: 'UMBRA. (Boné 5-Panel Ripstop)',
    category: 'Performance',
    pvp: 169.90,
    privateLabel: {
      supplier: 'Headwear Especializado / SP',
      unitCost: 58.00,
      moq: 100,
      leadTimeDays: 45
    },
    fractional: {
      fabricCost: 18.00,
      cutAndSew: 24.00,
      brandingTags: 7.00,
      packaging: 4.00,
      moq: 30,
      leadTimeDays: 25
    }
  }
];

export default function CortexSupplyPage() {
  const [selectedId, setSelectedId] = useState<string>('vestigium');
  const [simulatedQty, setSimulatedQty] = useState<number>(50);

  const current = ARTIFACTS_SUPPLY.find(a => a.id === selectedId) || ARTIFACTS_SUPPLY[0];

  // Cálculos Facção Fracionada
  const fractionalUnitCost = 
    current.fractional.fabricCost + 
    current.fractional.cutAndSew + 
    current.fractional.brandingTags + 
    current.fractional.packaging;

  const fractionalTotalCapital = fractionalUnitCost * simulatedQty;
  const fractionalGrossMargin = ((current.pvp - fractionalUnitCost) / current.pvp) * 100;

  // Cálculos Private Label
  const plUnitCost = current.privateLabel.unitCost;
  // Se a quantidade simulada for menor que o MOQ do PL, usamos o MOQ como piso de desembolso
  const plEffectiveQty = Math.max(simulatedQty, current.privateLabel.moq);
  const plTotalCapital = plUnitCost * plEffectiveQty;
  const plGrossMargin = ((current.pvp - plUnitCost) / current.pvp) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                CORTEX OS // MÓDULO INDUSTRIAL
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                SUPPLY HÍBRIDO
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase font-mono">
              Engenharia de Suprimentos & Manufatura
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Benchmark direto: Private Label (Turnkey) vs. Facção Fracionada (Gestão Local Fortaleza).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cortex/financeiro"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              ← Cofres 70/30
            </Link>
            <Link
              href="/cortex/estoque"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              Estoque Físico →
            </Link>
          </div>
        </div>

        {/* Seletor de Artefato */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ARTIFACTS_SUPPLY.map((art) => (
            <button
              key={art.id}
              onClick={() => setSelectedId(art.id)}
              className={`p-3 text-left rounded border transition-all cursor-pointer font-mono ${
                selectedId === art.id
                  ? 'border-white bg-zinc-900/80 text-white'
                  : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="text-[10px] text-zinc-500 uppercase block">{art.category}</span>
              <span className="text-xs font-bold block truncate">{art.name}</span>
              <span className="text-[11px] text-zinc-300 mt-1 block">PVP: R$ {art.pvp.toFixed(2)}</span>
            </button>
          ))}
        </div>

        {/* Barra de Simulação de Lote */}
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">SIMULAÇÃO DE CORTE / LOTE</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">{simulatedQty} peças</span>
              <span className="text-xs text-zinc-400">para o artefato {current.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[25, 50, 100, 200].map(qty => (
              <button
                key={qty}
                onClick={() => setSimulatedQty(qty)}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                  simulatedQty === qty
                    ? 'border-white bg-white text-black font-bold'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {qty} un
              </button>
            ))}
          </div>
        </div>

        {/* Comparativo Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          
          {/* CARD 1: FACÇÃO FRACIONADA (LOCAL) */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Modelo Fracionado (Fortaleza)</span>
                </div>
                <h3 className="text-sm font-bold text-white uppercase">Gestão Desmembrada por Etapa</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Maior margem unitária e liberdade para cortes enxutos.</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 border border-emerald-500/30 text-emerald-400 rounded bg-emerald-950/20">
                LOTE PILOTO
              </span>
            </div>

            {/* Decomposição de Custo Unitário */}
            <div className="space-y-2 text-xs border-y border-zinc-900 py-4">
              <div className="flex justify-between text-zinc-400">
                <span>1. Tecido Base / Fiação:</span>
                <span className="text-white">R$ {current.fractional.fabricCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>2. Mão de Obra (Corte + Costura):</span>
                <span className="text-white">R$ {current.fractional.cutAndSew.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>3. Aviamentos, Transfers & Tags:</span>
                <span className="text-white">R$ {current.fractional.brandingTags.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>4. Embalagem & Acabamento:</span>
                <span className="text-white">R$ {current.fractional.packaging.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-200 font-bold pt-2 border-t border-zinc-900">
                <span>CUSTO UNITÁRIO TOTAL:</span>
                <span className="text-emerald-400 text-sm">R$ {fractionalUnitCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Métricas do Lote */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded">
                <span className="text-[10px] text-zinc-500 block uppercase">Desembolso ({simulatedQty} un)</span>
                <span className="text-base font-bold text-white">R$ {fractionalTotalCapital.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded">
                <span className="text-[10px] text-zinc-500 block uppercase">Margem Bruta Unit.</span>
                <span className="text-base font-bold text-emerald-400">{fractionalGrossMargin.toFixed(1)}%</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 flex justify-between pt-1">
              <span>MOQ Mínimo: {current.fractional.moq} un</span>
              <span>Lead Time: ~{current.fractional.leadTimeDays} dias</span>
            </div>
          </div>

          {/* CARD 2: PRIVATE LABEL (INTEGRAL) */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase mb-1">
                  <Factory className="w-3.5 h-3.5" />
                  <span>Private Label (FOB Fechado)</span>
                </div>
                <h3 className="text-sm font-bold text-white uppercase">Solução Industrial Pronta</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Operação simplificada, porém com maior imobilização de caixa.</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 border border-blue-500/30 text-blue-400 rounded bg-blue-950/20">
                ESCALA
              </span>
            </div>

            {/* Decomposição de Custo Unitário */}
            <div className="space-y-2 text-xs border-y border-zinc-900 py-4">
              <div className="flex justify-between text-zinc-400">
                <span>Fornecedor Homologado:</span>
                <span className="text-white text-[11px] truncate max-w-[200px]">{current.privateLabel.supplier}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Gestão Logística / Insumos:</span>
                <span className="text-zinc-300">Incluso no pacote</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Controle de Qualidade em Linha:</span>
                <span className="text-zinc-300">Por conta do fornecedor</span>
              </div>
              <div className="flex justify-between text-zinc-200 font-bold pt-6 border-t border-zinc-900">
                <span>CUSTO UNITÁRIO TOTAL:</span>
                <span className="text-blue-400 text-sm">R$ {plUnitCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Métricas do Lote */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  Desembolso ({plEffectiveQty} un {simulatedQty < current.privateLabel.moq ? '• MOQ' : ''})
                </span>
                <span className="text-base font-bold text-white">R$ {plTotalCapital.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded">
                <span className="text-[10px] text-zinc-500 block uppercase">Margem Bruta Unit.</span>
                <span className="text-base font-bold text-blue-400">{plGrossMargin.toFixed(1)}%</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 flex justify-between pt-1">
              <span>MOQ Mínimo: {current.privateLabel.moq} un</span>
              <span>Lead Time: ~{current.privateLabel.leadTimeDays} dias</span>
            </div>
          </div>
        </div>

        {/* DIRETRIZ DE DECISÃO CORTEX */}
        <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">RECOMENDAÇÃO OPERACIONAL</span>
              <p className="text-zinc-300 text-xs">
                Para lotes abaixo de <strong>100 unidades</strong>, a <strong>Facção Fracionada</strong> preserva R$ {(plTotalCapital - fractionalTotalCapital).toFixed(2)} de liquidez no cofre de produção (70%).
              </p>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 text-right shrink-0">
            <span>FORTALEZA, CE • 03°43'S 38°32'W</span>
          </div>
        </div>

      </div>
    </div>
  );
}