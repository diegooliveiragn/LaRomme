'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, Box, Package, DollarSign, Layers } from 'lucide-react';

interface InsumoItem {
  id: string;
  nome: string;
  categoria: string;
  custoUnit: number;
  estoqueFisico: number;
}

const INITIAL_INSUMOS: InsumoItem[] = [
  { id: 'INS-01', nome: 'Caixa Rígida Gaveta LaRomme', categoria: 'EMBALAGEM', custoUnit: 4.80, estoqueFisico: 0 },
  { id: 'INS-02', nome: 'Papel de Seda Aromatizado (20g)', categoria: 'EMBALAGEM', custoUnit: 0.65, estoqueFisico: 0 },
  { id: 'INS-03', nome: 'Tag Lacre Termocolante com Cordão', categoria: 'AVIAMENTO', custoUnit: 0.90, estoqueFisico: 0 },
  { id: 'INS-04', nome: 'Fita Gomada Kraft Personalizada', categoria: 'LOGÍSTICA', custoUnit: 0.30, estoqueFisico: 0 },
];

export default function GestaoInsumosPage() {
  const [insumos, setInsumos] = useState<InsumoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Campos do Formulário CRUD
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('EMBALAGEM');
  const [custo, setCusto] = useState('');
  const [saldo, setSaldo] = useState('0');

  useEffect(() => {
    const saved = localStorage.getItem('laromme_insumos_v2');
    if (saved) {
      try {
        setInsumos(JSON.parse(saved));
        return;
      } catch (e) {
        console.error('Erro ao ler insumos:', e);
      }
    }
    setInsumos(INITIAL_INSUMOS);
  }, []);

  const saveToStorage = (updated: InsumoItem[]) => {
    setInsumos(updated);
    localStorage.setItem('laromme_insumos_v2', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

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
    setCusto(item.custoUnit.toString());
    setSaldo(item.estoqueFisico.toString());
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este insumo da matriz de embalagens?')) {
      const updated = insumos.filter(i => i.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCusto = Number(custo.replace(',', '.')) || 0;
    const cleanSaldo = parseInt(saldo) || 0;

    if (editingId) {
      // UPDATE
      const updated = insumos.map(item => 
        item.id === editingId 
          ? { ...item, nome, categoria, custoUnit: cleanCusto, estoqueFisico: cleanSaldo }
          : item
      );
      saveToStorage(updated);
    } else {
      // CREATE
      const newItem: InsumoItem = {
        id: `INS-${String(insumos.length + 1).padStart(2, '0')}`,
        nome,
        categoria,
        custoUnit: cleanCusto,
        estoqueFisico: cleanSaldo
      };
      saveToStorage([...insumos, newItem]);
    }

    setIsModalOpen(false);
  };

  // KPIs
  const unboxingCost = insumos.reduce((acc, curr) => acc + curr.custoUnit, 0);
  const totalImobilizado = insumos.reduce((acc, curr) => acc + (curr.custoUnit * curr.estoqueFisico), 0);
  const totalPecasInsumo = insumos.reduce((acc, curr) => acc + curr.estoqueFisico, 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            SUPPLY & MATERIAIS DE EMBALAGEM
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Gestão de Insumos & Unboxing
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cadastro, Edição e Controle de Saldos de Embalagens, Aviamentos e Brindes
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Insumo</span>
        </button>
      </div>

      {/* KPIS DE UNBOXING */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Custo Base de Unboxing (Por Pacote)
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(unboxingCost)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Soma de caixa, seda, tag e fita
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Capital Imobilizado em Insumos
          </span>
          <div className="text-3xl font-bold text-zinc-700 font-mono tracking-tight">
            {formatBRL(totalImobilizado)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {totalPecasInsumo} itens em galpão
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Itens Registrados na Matriz
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {insumos.length} <span className="text-base font-normal text-zinc-400">insumos</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Modo CRUD ativo para gestão
          </p>
        </div>
      </div>

      {/* TABELA CRUD DE INSUMOS */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Package className="w-4 h-4 text-zinc-500" /> Inventário de Insumos Físicos
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Saldos em Galpão
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">Código</th>
                <th className="px-6 py-3 font-bold">Item / Especificação</th>
                <th className="px-6 py-3 font-bold">Categoria</th>
                <th className="px-6 py-3 font-bold text-right">Custo Unitário</th>
                <th className="px-6 py-3 font-bold text-center">Saldo Físico</th>
                <th className="px-6 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {insumos.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-zinc-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-zinc-900 font-sans text-sm">
                    {item.nome}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold text-zinc-800">
                    {formatBRL(item.custoUnit)}
                  </td>
                  <td className="px-6 py-3.5 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.estoqueFisico === 0 ? 'bg-zinc-100 text-zinc-500' : 'bg-emerald-50 text-emerald-700'}`}>
                      {item.estoqueFisico} un.
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-100 transition-colors"
                      title="Editar Insumo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Excluir Insumo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRUD (CADASTRAR OU EDITAR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Insumo' : 'Novo Insumo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Nome do Item:</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Caixa Rígida Gaveta LaRomme"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Categoria:</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="EMBALAGEM">EMBALAGEM</option>
                  <option value="AVIAMENTO">AVIAMENTO</option>
                  <option value="LOGÍSTICA">LOGÍSTICA</option>
                  <option value="BRINDE">BRINDE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Custo Unitário (R$):</label>
                  <input
                    type="text"
                    required
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    placeholder="Ex: 4.80"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Saldo Físico (un):</label>
                  <input
                    type="number"
                    required
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider shadow-sm"
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