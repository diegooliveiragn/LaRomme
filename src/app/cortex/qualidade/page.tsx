'use client';

import React, { useState } from 'react';

export default function QualidadePage() {
  // Simulando Capital Imobilizado
  const capitalPreso = 4500.00; // Custo de aquisição do estoque parado
  const vgvEstoque = 18400.00; // Valor Geral de Vendas (se tudo for vendido)
  const potencialLucro = vgvEstoque - capitalPreso;

  const formatBRL = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">QUALIDADE & DETRATORES</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Análise de Risco, Logística Reversa, NPS e Capital Imobilizado</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-1.5">
            Baixar Relatório (PDF)
          </button>
        </div>
      </div>

      {/* VALUATION DE ESTOQUE (CAPITAL IMOBILIZADO) */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase mb-4">RAIO-X: CAPITAL IMOBILIZADO NO ESTOQUE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-2 border-amber-400 pl-4">
            <span className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">Custo Adquirido (Dinheiro Parado)</span>
            <span className="text-2xl font-bold text-zinc-900">{formatBRL(capitalPreso)}</span>
            <p className="text-[10px] text-zinc-400 mt-1">Gasto real pago a fornecedores</p>
          </div>
          <div className="border-l-2 border-emerald-400 pl-4">
            <span className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">Valor Geral de Vendas (VGV)</span>
            <span className="text-2xl font-bold text-emerald-700">{formatBRL(vgvEstoque)}</span>
            <p className="text-[10px] text-zinc-400 mt-1">Receita bruta potencial de prateleira</p>
          </div>
          <div className="border-l-2 border-blue-400 pl-4 bg-zinc-50 rounded-r-md py-2">
            <span className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">Potencial de Margem Latente</span>
            <span className="text-2xl font-bold text-blue-700">{formatBRL(potencialLucro)}</span>
            <button className="mt-2 text-[9px] font-bold uppercase tracking-widest bg-white border border-zinc-300 text-zinc-700 px-3 py-1 rounded hover:bg-zinc-100">
              Injetar Tráfego P/ Girar Estoque
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUNA ESQUERDA: CARRINHOS ABANDONADOS E DEVOLUÇÕES */}
        <div className="space-y-8">
          
          {/* MÁQUINA DE RECUPERAÇÃO (CARRINHOS) */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 bg-rose-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-rose-900 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Gargalos de Conversão
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Carrinhos Abandonados (Últimas 48h)</p>
              </div>
              <span className="text-xs font-bold font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded">R$ 579,70 Pendentes</span>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {/* Item Abandonado 1 */}
              <div className="p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Thiago Mendes</p>
                  <p className="text-[10px] font-mono text-zinc-500">1x TENAX (G) • Abandonou no Frete</p>
                  <span className="text-[9px] text-zinc-400 font-mono mt-1 block">Há 2 horas</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-900 mb-2">R$ 189,90</p>
                  <button className="bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                    Sondar no WhatsApp
                  </button>
                </div>
              </div>

              {/* Item Abandonado 2 */}
              <div className="p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-zinc-900">Marina Costa</p>
                  <p className="text-[10px] font-mono text-zinc-500">1x VESTIGIUM (M), 1x UMBRA</p>
                  <span className="text-[9px] text-zinc-400 font-mono mt-1 block">Há 1 dia</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-900 mb-2">R$ 399,80</p>
                  <button className="bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors">
                    Sondar no WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOGÍSTICA REVERSA (PERDAS E AVARIAS) */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 bg-amber-50/50">
              <h2 className="text-sm font-bold text-amber-900 tracking-wide uppercase">Ralo Operacional: Devoluções</h2>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Controle de Fretes Reversos e Defeitos</p>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-2">Pedido</th>
                    <th className="py-2">Motivo</th>
                    <th className="py-2 text-right">Custo Reverso (Prejuízo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 font-bold text-zinc-900">#LR-1012</td>
                    <td className="py-3 text-zinc-600">Troca de Tamanho (P por M)</td>
                    <td className="py-3 text-right font-mono text-rose-600 font-bold">-R$ 35,40</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-zinc-900">#LR-0998</td>
                    <td className="py-3 text-zinc-600">Arrependimento</td>
                    <td className="py-3 text-right font-mono text-rose-600 font-bold">-R$ 28,90</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-zinc-900">#LR-0945</td>
                    <td className="py-3 text-zinc-600">Defeito: Costura solta na barra</td>
                    <td className="py-3 text-right font-mono text-rose-600 font-bold">-R$ 32,00</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px] font-mono font-bold text-rose-700">
                <span>TOTAL DE PERDAS NO MÊS:</span>
                <span>R$ 96,30</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: FEEDBACK & NPS (QUALIDADE) */}
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
            <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">Feedback Loop & NPS em Quadra</h2>
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">Avaliações 7 dias após a entrega</p>
          </div>
          
          <div className="p-5 space-y-5">
            
            {/* Indicador Geral NPS */}
            <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded border border-zinc-100">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-white shadow-sm shrink-0">
                <span className="text-xl font-bold text-emerald-600">9.4</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">Score de Satisfação</p>
                <p className="text-xs text-zinc-600 mt-1">A maioria dos clientes considerou as peças como "Superou as Expectativas".</p>
              </div>
            </div>

            {/* Lista de Feedbacks */}
            <div className="space-y-4">
              
              <div className="border border-zinc-200 rounded p-4 relative">
                <span className="absolute top-4 right-4 text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">TECIDO</span>
                <div className="flex items-center gap-1 mb-2 text-amber-400 text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-xs font-bold text-zinc-900">Rodrigo M. (Corrida)</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  "Testei a Tenax hoje num longão de 15km. Impressionante como o suor não pesa a blusa. Secagem excelente."
                </p>
              </div>

              <div className="border border-zinc-200 rounded p-4 relative">
                <span className="absolute top-4 right-4 text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded">MODELAGEM</span>
                <div className="flex items-center gap-1 mb-2 text-amber-400 text-sm">
                  ★ ★ ★ ★ ☆
                </div>
                <p className="text-xs font-bold text-zinc-900">Lucas S. (Beach Tennis)</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  "A Regata Libertas é muito boa, mas achei a cava um pouquinho longa demais nas costas. De resto, perfeita."
                </p>
              </div>

              <div className="border border-zinc-200 rounded p-4 relative">
                <span className="absolute top-4 right-4 text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">EXPERIÊNCIA</span>
                <div className="flex items-center gap-1 mb-2 text-amber-400 text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-xs font-bold text-zinc-900">Camila F. (Futevôlei)</p>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  "A caixa tem um cheiro incrível e a toalhinha de brinde salvou meu treino na areia. Virei fã da marca!"
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}