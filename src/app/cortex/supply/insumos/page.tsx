'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, RefreshCw, Box } from 'lucide-react';

interface InsumoItem {
  id: string;
  nome: string;
  categoria: string;
  custoUnit: number;
  estoqueFisico: number;
}

const DEFAULT_INSUMOS: InsumoItem[] = [
  { id: 'INS-01', nome: 'Caixa Rígida Gaveta LaRomme', categoria: 'EMBALAGEM', custoUnit: 4.80, estoqueFisico: 0 },
  { id: 'INS-02', nome: 'Papel de Seda Aromatizado (20g)', categoria: 'EMBALAGEM', custoUnit: 0.65, estoqueFisico: 0 },
  { id: 'INS-03', nome: 'Tag Lacre Termocolante com Cordão', categoria: 'AVIAMENTO', custoUnit: 0.90, estoqueFisico: 0 },
  { id: 'INS-04', nome: 'Fita Gomada Kraft Personalizada', categoria: 'LOGÍSTICA', custoUnit: 0.30, estoqueFisico: 0 },
];

export default function GestaoInsumosPage() {
  const [insumos, setInsumos] = useState<InsumoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('EMBALAGEM');
  const [custo, setCusto] = useState('');
  const [saldo, setSaldo] = useState('0');

  useEffect(() => {
    const saved = localStorage.getItem('laromme_insumos_v1');
    if (saved) {
      try {
        setInsumos(JSON.parse(saved));
      } catch {
        setInsumos(DEFAULT_INSUMOS);
      }
    } else {
      setInsumos(DEFAULT_INSUMOS);
    }
  }, []);

  const saveToStorage = (updated: InsumoItem[]) => {
    setInsumos(updated);
    localStorage.setItem('laromme_insumos_v1', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const openCreateModal = () => {
    setEditingId(null);
    setNome('');
    setCategoria('EMBALAGEM');
    setCusto('');
    setSaldo('0');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InsumoItem) => {
    setEditingId(item.id);
    setNome(item.nome);
    setCategoria(item.categoria);
    setCusto(String(item.custoUnit));
    setSaldo(String(item.estoqueFisico));
    setIsModalOpen(true);
  };

  const handleSaveInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    const costVal = parseFloat(custo) || 0;
    const stockVal = parseInt(saldo) || 0;

    if (editingId) {
      const updated = insumos.map(i => i.id === editingId ? {
        ...i,
        nome,
        categoria,
        custoUnit: costVal,
        estoqueFisico: stockVal
      } : i);
      saveToStorage(updated);
    } else {
      const newItem: InsumoItem = {
        id: `INS-${String(Date.now()).slice(-4)}`,
        nome,
        categoria,
        custoUnit: costVal,
        estoqueFisico: stockVal
      };
      saveToStorage([...insumos, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteInsumo = (id: string, itemNome: string) => {
    if (!confirm(`Remover "${itemNome}" da gestão de insumos?`)) return;
    const updated = insumos.filter(i => i.id !== id);
    saveToStorage(updated);
  };

  const custoTotalUnboxing = insumos.reduce((acc, curr) => acc + curr.custoUnit, 0);
  const capitalImobilizadoInsumos = insumos.reduce((acc, curr) => acc + (curr.custoUnit * curr.estoqueFisico), 0);
  const totalPecasInsumos = insumos.reduce((acc, curr) => acc + curr.estoqueFisico, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Suprimentos & Experiência de Entrega
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Gestão de Insumos & Unboxing
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Monitoramento de Embalagens, Aviamentos e Cobertura de Lotes
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Insumo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Custo Base por Unboxing
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(custoTotalUnboxing)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Custo composto de embalagem por pedido
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Capital Preso em Insumos
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(capitalImobilizadoInsumos)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            {capitalImobilizadoInsumos === 0 ? 'Nenhum lote físico de insumos armazenado' : 'Total imobilizado'}
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Status de Suprimentos
          </span>
          <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tight block font-mono">
            {totalPecasInsumos} un.
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            {totalPecasInsumos === 0 ? 'Aguardando pedido de compra com gráfica' : 'Insumos disponíveis'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Inventário de Embalagens e Suprimentos
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">{insumos.length} itens</span>
        </div>

        {insumos.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500">
            Nenhum insumo cadastrado.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 font-mono text-xs">
            {insumos.map(item => (
              <div key={item.id} className="p-5 flex justify-between items-center hover:bg-zinc-50/60 transition-colors">
                <div>
                  <span className="font-bold text-zinc-900 text-sm block font-sans">{item.nome}</span>
                  <span className="text-[11px] text-zinc-400 uppercase">{item.id} • {item.categoria}</span>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Custo Unitário</span>
                    <span className="font-bold text-zinc-700">{formatBRL(item.custoUnit)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Saldo Físico</span>
                    <span className="font-black text-zinc-900 text-sm">{item.estoqueFisico} un.</span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                      title="Editar Insumo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInsumo(item.id, item.nome)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 font-sans">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                {editingId ? 'Editar Insumo' : 'Novo Insumo / Embalagem'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInsumo} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-600 block mb-1 font-bold">Descrição do Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Caixa Rígida Gaveta LaRomme"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans"
                  >
                    <option value="EMBALAGEM">Embalagem</option>
                    <option value="AVIAMENTO">Aviamento</option>
                    <option value="LOGÍSTICA">Logística</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="4.80"
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 block mb-1 font-bold">Saldo Físico em Galpão (unidades)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 font-bold"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}