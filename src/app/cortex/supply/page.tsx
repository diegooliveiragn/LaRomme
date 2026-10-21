'use client';

import React, { useState } from 'react';
import { 
  Factory, Calculator, Plus, Trash2, Settings2, 
  CheckCircle, ArrowRight, DollarSign 
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  price: number;
  moq: number;
  leadTime: number;
  badge?: string;
  badgeColor?: string;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Confecção Alfa', price: 52.00, moq: 100, leadTime: 25, badge: 'MAIOR MARGEM', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: '2', name: 'Estúdio Beta PL', price: 58.00, moq: 50, leadTime: 12, badge: 'ENTREGA RÁPIDA', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: '3', name: 'Têxtil Gamma', price: 65.00, moq: 30, leadTime: 15, badge: 'BAIXA BARREIRA', badgeColor: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
];

export default function SupplyPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  
  // Estados do Motor de Precificação
  const [cost, setCost] = useState<number>(55.00);
  const [packaging, setPackaging] = useState<number>(6.50);
  const [tax, setTax] = useState<number>(6.00); // 6%
  const [gateway, setGateway] = useState<number>(4.99); // 4.99%
  const [margin, setMargin] = useState<number>(30.00); // 30%

  // Cálculo de Precificação Reversa (Mark-up por margem alvo)
  // Preço de Venda = Custo Total / (1 - (Taxas + Margem em %))
  const totalVariablePercentage = (tax + gateway + margin) / 100;
  const totalCost = cost + packaging;
  const suggestedPrice = totalVariablePercentage < 1 ? totalCost / (1 - totalVariablePercentage) : 0;
  const currentMarkup = totalCost > 0 ? suggestedPrice / totalCost : 0;

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-2">
            Supply & Private Label
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Engenharia de Custos • Reposição de Acervo</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Novo Fornecedor PL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: MATRIZ DE FORNECEDORES (7 COLUNAS) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Factory className="w-4 h-4 text-zinc-500" />
              Matriz Comparativa (Tech Pack)
            </h2>
            <select className="text-[10px] font-mono border border-zinc-200 rounded bg-white px-2 py-1 focus:outline-none">
              <option>PEÇA: TENAX T-SHIRT</option>
              <option>PEÇA: VESTIGIUM BOXY</option>
            </select>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-zinc-200 text-[10px] text-zinc-500 font-mono uppercase tracking-widest bg-white">
                  <th className="py-3 px-5 font-bold">Fornecedor (PL)</th>
                  <th className="py-3 px-5 font-bold">Preço Unit.</th>
                  <th className="py-3 px-5 font-bold">MOQ</th>
                  <th className="py-3 px-5 font-bold">Prazo</th>
                  <th className="py-3 px-5 text-right font-bold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400 font-mono text-[10px] uppercase">
                      Nenhum fornecedor cadastrado.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-3 px-5">
                        <div className="font-bold text-zinc-900">{supplier.name}</div>
                        {supplier.badge && (
                          <span className={`inline-block mt-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${supplier.badgeColor}`}>
                            {supplier.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-5 font-mono text-zinc-700">{formatBRL(supplier.price)}</td>
                      <td className="py-3 px-5 text-zinc-600">{supplier.moq} un.</td>
                      <td className="py-3 px-5 text-zinc-600">{supplier.leadTime} dias</td>
                      <td className="py-3 px-5 text-right">
                        <button 
                          onClick={() => handleDeleteSupplier(supplier.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Remover Fornecedor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-zinc-100 bg-zinc-50 mt-auto">
            <p className="text-[10px] font-mono text-zinc-400">* MOQ = Minimum Order Quantity (Quantidade Mínima).</p>
          </div>
        </div>

        {/* COLUNA DIREITA: MOTOR DE PRECIFICAÇÃO (5 COLUNAS) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Calculator className="w-4 h-4 text-zinc-500" />
              Motor de Precificação
            </h2>
            <span className="text-[9px] font-mono tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase font-bold">
              Simulador
            </span>
          </div>

          <div className="p-5 space-y-6 flex-1">
            
            {/* Bloco 1: Custos Diretos */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" /> 1. Custos Diretos (CPV)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">Custo Confecção (R$)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-zinc-400">R$</span>
                    <input 
                      type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded pl-7 pr-2 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">Embalagem/Tags (R$)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-zinc-400">R$</span>
                    <input 
                      type="number" value={packaging} onChange={(e) => setPackaging(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded pl-7 pr-2 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Variáveis & Margem */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> 2. Variáveis & Margem
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">Imposto (%)</label>
                  <input 
                    type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">Gateway (%)</label>
                  <input 
                    type="number" value={gateway} onChange={(e) => setGateway(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-900 font-bold mb-1">Margem Alvo (%)</label>
                  <input 
                    type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5 text-xs font-mono text-emerald-900 font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RODAPÉ: RESULTADO DA PRECIFICAÇÃO */}
          <div className="bg-zinc-900 p-5 mt-auto text-white flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1">
                Preço Alvo Sugerido
              </span>
              <span className="text-3xl font-bold tracking-tight text-white">
                {formatBRL(suggestedPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1">
                Markup
              </span>
              <span className="text-xl font-bold text-emerald-400">
                {currentMarkup.toFixed(2)}x
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}