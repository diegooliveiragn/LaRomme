'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Layers, CheckCircle2, Box } from 'lucide-react';

export default function MotorPIMPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Topwear');
  const [price, setPrice] = useState('289.00');

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* VOLTAR & CABEÇALHO */}
      <div>
        <Link
          href="/cortex/catalogo"
          className="text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1.5 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Acervo
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              CADASTRO DE NOVOS ARTEFATOS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
              Motor PIM • Lançamento de Peça
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Gestão de Informações de Produto, Engenharia de Ficha Técnica e Matriz de Supply
            </p>
          </div>

          <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Artefato</span>
          </button>
        </div>
      </div>

      {/* FORMULÁRIO EM CARDS BRANCOS COM BORDAS SUAVES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IDENTIDADE DO PRODUTO */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-zinc-500" /> Identidade do Artefato
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-zinc-500 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Nome do Artefato:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Camiseta Vestigium Heavyweight"
                className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 rounded text-zinc-900 focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-zinc-500 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Família / Categoria Arquitetural:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 rounded text-zinc-900 focus:outline-none focus:border-zinc-500 font-sans cursor-pointer"
              >
                <option value="Topwear">Topwear (Camisetas & Regatas)</option>
                <option value="Bottomwear">Bottomwear (Shorts Performance)</option>
                <option value="Headwear">Headwear (Bonés Técnicos)</option>
                <option value="Acessorios">Acessórios de Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-500 uppercase tracking-wider text-[10px] font-bold mb-1.5">
                Preço de Venda Sugerido (R$):
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 rounded text-zinc-900 focus:outline-none focus:border-zinc-500 font-sans"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Valor que será exposto na vitrine pública.</span>
            </div>
          </div>
        </div>

        {/* ENGENHARIA FISCAL & SUPPLY */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Engenharia Fiscal & Insumos
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              A precificação contábil da LaRomme consolida facção têxtil, malharia nobre, impostos e gateway real.
            </p>

            <div className="space-y-2.5 mt-4 font-mono text-xs">
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded flex justify-between">
                <span className="text-zinc-600">Padrão Fiscal:</span>
                <span className="font-bold text-zinc-900">Simples Nacional (6,0%)</span>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded flex justify-between">
                <span className="text-zinc-600">Gateway Pix:</span>
                <span className="font-bold text-emerald-600">0,99% Mercado Pago</span>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded flex justify-between">
                <span className="text-zinc-600">Margem Alvo:</span>
                <span className="font-bold text-indigo-600">46% Líquida</span>
              </div>
            </div>
          </div>

          <div className="p-3 border border-zinc-100 bg-zinc-50 rounded text-[11px] font-mono text-zinc-500 text-center">
            Curva de Corte Recomendada: 15% P • 35% M • 35% G • 15% GG.
          </div>
        </div>
      </div>
    </div>
  );
}