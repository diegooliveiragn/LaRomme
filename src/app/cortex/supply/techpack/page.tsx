'use client';

import React, { useState } from 'react';
import { Layers, Scissors, Ruler, Download, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

export default function CortexTechPackPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('vestigium');

  const selectedProduct = PRODUCTS.find(p => p.id === selectedSlug) || PRODUCTS[0];

  const TECH_SPECS: Record<string, any> = {
    'vestigium': {
      fio: 'Algodão Penteado 26.1 (260 g/m²)',
      modelagem: 'Boxy Utilitária (Ombro deslocado, gola canelada 3.0cm pespontada)',
      toque: 'Toque frio, pré-encolhido em lavanderia industrial',
      acabamentos: 'Etiqueta interna em termocolante flat (zero atrito com a nuca)',
      tabelaMedidas: [
        { tamanho: 'P', torax: '56 cm', comprimento: '70 cm', manga: '22 cm' },
        { tamanho: 'M', torax: '58 cm', comprimento: '72 cm', manga: '23 cm' },
        { tamanho: 'G', torax: '61 cm', comprimento: '74 cm', manga: '24 cm' },
        { tamanho: 'GG', torax: '64 cm', comprimento: '76 cm', manga: '25 cm' },
      ]
    },
    'tenax': {
      fio: 'Poliamida Náutica c/ Elastano (180 g/m²)',
      modelagem: 'Athletic Aerodinâmica (Corte rente ao corpo para mobilidade)',
      toque: 'Efeito gelado instantâneo com secagem rápida (Quick-Dry)',
      acabamentos: 'Logo refletivo 3M no peito e costura flatlock anti-assadura',
      tabelaMedidas: [
        { tamanho: 'P', torax: '50 cm', comprimento: '69 cm', manga: '20 cm' },
        { tamanho: 'M', torax: '53 cm', comprimento: '71 cm', manga: '21 cm' },
        { tamanho: 'G', torax: '56 cm', comprimento: '73 cm', manga: '22 cm' },
        { tamanho: 'GG', torax: '59 cm', comprimento: '75 cm', manga: '23 cm' },
      ]
    },
    'libertas': {
      fio: 'Microfibra Perfurada (140 g/m²)',
      modelagem: 'Tank Esportiva (Cava profunda anatômica)',
      toque: 'Ventilação contínua para quadras de areia e corrida',
      acabamentos: 'Gola estreita e acabamento em viés duplo',
      tabelaMedidas: [
        { tamanho: 'P', torax: '48 cm', comprimento: '68 cm', manga: '—' },
        { tamanho: 'M', torax: '51 cm', comprimento: '70 cm', manga: '—' },
        { tamanho: 'G', torax: '54 cm', comprimento: '72 cm', manga: '—' },
        { tamanho: 'GG', torax: '57 cm', comprimento: '74 cm', manga: '—' },
      ]
    },
    'umbra': {
      fio: 'Ripstop Técnico Resistente à Água',
      modelagem: '5-Panel Estruturado com aba semi-curva',
      toque: 'Leveza total com fecho traseiro em fita de nylon e presilha fosca',
      acabamentos: 'Carimbo lateral termocolante e ilhoses bordados de respiro',
      tabelaMedidas: [
        { tamanho: 'TU', torax: 'Circunferência Ajustável (54 a 61 cm)', comprimento: 'Profundidade 16 cm', manga: '—' },
      ]
    }
  };

  const spec = TECH_SPECS[selectedSlug] || TECH_SPECS['vestigium'];

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ENGENHARIA TÊXTIL & MODELAGEM INDUSTRIAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Tech Pack & Fichas Técnicas
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Especificações Milimétricas de Corte, Fiação, Tolerâncias e Acabamentos para Facções
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Imprimir Ficha</span>
        </button>
      </div>

      {/* SELETOR DE ARTEFATO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            onClick={() => setSelectedSlug(prod.id)}
            className={`p-4 rounded-lg border text-left transition-all font-mono text-xs ${
              selectedSlug === prod.id
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <span className="block text-[10px] text-zinc-400 uppercase tracking-widest">{prod.category}</span>
            <span className="font-bold text-sm block mt-1">{prod.name}</span>
          </button>
        ))}
      </div>

      {/* DETALHES TÉCNICOS DA PEÇA SELECIONADA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-lg border border-zinc-200 p-6 shadow-sm space-y-4 font-mono text-xs">
          <h2 className="text-xs font-bold font-sans text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
            Materialidade & Construção
          </h2>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Fiação / Gramatura:</span>
            <p className="font-bold text-zinc-900 text-sm mt-0.5">{spec.fio}</p>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Diretriz de Modelagem:</span>
            <p className="text-zinc-700 leading-relaxed mt-0.5">{spec.modelagem}</p>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Toque Térmico (Fortaleza):</span>
            <p className="text-zinc-700 leading-relaxed mt-0.5">{spec.toque}</p>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase">Acabamentos Especiais:</span>
            <p className="text-zinc-700 leading-relaxed mt-0.5">{spec.acabamentos}</p>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase">
              Tabela de Medidas Industriais (cm)
            </h2>
            <span className="text-[10px] font-mono text-zinc-400">Tolerância: ± 1.0 cm</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3 font-bold">Grade</th>
                  <th className="px-5 py-3 font-bold">Tórax / Largura</th>
                  <th className="px-5 py-3 font-bold">Comprimento</th>
                  <th className="px-5 py-3 font-bold">Manga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {spec.tabelaMedidas.map((row: any) => (
                  <tr key={row.tamanho} className="hover:bg-zinc-50">
                    <td className="px-5 py-3 font-bold text-zinc-900">{row.tamanho}</td>
                    <td className="px-5 py-3 text-zinc-700">{row.torax}</td>
                    <td className="px-5 py-3 text-zinc-700">{row.comprimento}</td>
                    <td className="px-5 py-3 text-zinc-700">{row.manga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}