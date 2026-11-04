'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Factory, Plus, Trash2, X, RefreshCw } from 'lucide-react';

interface ProductionBatch {
  id: string;
  opCode: string;
  productName: string;
  stage: 'CORTE' | 'COSTURA' | 'ESTAMPARIA' | 'REVISAO' | 'ENTRADA_WMS';
  targetDate: string;
  units: number;
}

const INITIAL_BATCHES: ProductionBatch[] = [
  { id: '1', opCode: 'OP-2026-001', productName: 'VESTIGIUM BOXY (Algodão 260g)', stage: 'COSTURA', targetDate: '2026-11-20', units: 50 },
  { id: '2', opCode: 'OP-2026-002', productName: 'TENAX T-SHIRT (Poliamida Náutica)', stage: 'ESTAMPARIA', targetDate: '2026-11-25', units: 40 },
  { id: '3', opCode: 'OP-2026-003', productName: 'UMBRA 5-PANEL (Ripstop)', stage: 'REVISAO', targetDate: '2026-11-15', units: 30 },
];

export default function CortexCronogramaPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('laromme_cronograma_v1');
    setBatches(saved ? JSON.parse(saved) : INITIAL_BATCHES);
  }, []);

  const saveBatches = (updated: ProductionBatch[]) => {
    setBatches(updated);
    localStorage.setItem('laromme_cronograma_v1', JSON.stringify(updated));
  };

  const advanceStage = (id: string) => {
    const stages: ProductionBatch['stage'][] = ['CORTE', 'COSTURA', 'ESTAMPARIA', 'REVISAO', 'ENTRADA_WMS'];
    const updated = batches.map(b => {
      if (b.id === id) {
        const currentIndex = stages.indexOf(b.stage);
        const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
        return { ...b, stage: nextStage };
      }
      return b;
    });
    saveBatches(updated);
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ESTEIRA FABRIL & CONTROLE DE PRAZOS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Cronograma de Produção & OPs
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Linha do Tempo Visual dos Lotes em Confecção nas Facções de Fortaleza
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
        {['CORTE', 'COSTURA', 'ESTAMPARIA', 'REVISAO', 'ENTRADA_WMS'].map((stg) => {
          const inThisStage = batches.filter(b => b.stage === stg);
          return (
            <div key={stg} className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-3">
                <span className="font-bold text-[10px] text-zinc-900 tracking-wider">{stg.replace('_', ' ')}</span>
                <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-zinc-600">{inThisStage.length}</span>
              </div>

              <div className="space-y-3 flex-1">
                {inThisStage.map(b => (
                  <div key={b.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded space-y-2">
                    <span className="text-[9px] font-bold text-zinc-400 block">{b.opCode}</span>
                    <p className="font-bold font-sans text-xs text-zinc-900 leading-tight">{b.productName}</p>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-200">
                      <span>{b.units} peças</span>
                      <span>Meta: {b.targetDate}</span>
                    </div>
                    {b.stage !== 'ENTRADA_WMS' && (
                      <button
                        onClick={() => advanceStage(b.id)}
                        className="w-full mt-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Avançar Etapa ➔
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}