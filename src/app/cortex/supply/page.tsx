'use client';

import React, { useState, useEffect } from 'react';
import { Factory, Calculator, Plus, Trash2, Edit2, X, Settings2, DollarSign } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface Supplier {
  id: string;
  name: string;
  productType: string;
  price: number;
  moq: number;
  leadTime: number;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'SUP-01', name: 'Facção Ceará Têxtil', productType: 'VESTIGIUM (Boxy)', price: 68.00, moq: 50, leadTime: 20 },
  { id: 'SUP-02', name: 'Malharia Performance Sol', productType: 'TENAX (Poliamida)', price: 52.00, moq: 50, leadTime: 15 },
  { id: 'SUP-03', name: 'Oficina Aerodinâmica', productType: 'LIBERTAS (Regata)', price: 42.00, moq: 30, leadTime: 15 },
  { id: 'SUP-04', name: 'Estúdio Headwear 5-Panel', productType: 'UMBRA (Boné)', price: 45.00, moq: 40, leadTime: 25 },
];

export default function SupplyPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulário CRUD Fornecedor
  const [name, setName] = useState('');
  const [productType, setProductType] = useState('VESTIGIUM (Boxy)');
  const [price, setPrice] = useState('68.00');
  const [moq, setMoq] = useState('50');
  const [leadTime, setLeadTime] = useState('20');

  // Simulador de Precificação
  const [cost, setCost] = useState<number>(68.00);
  const [packaging, setPackaging] = useState<number>(6.65);
  const [tax, setTax] = useState<number>(6.00); // 6% Simples
  const [gateway, setGateway] = useState<number>(0.99); // 0.99% Pix Mercado Pago
  const [margin, setMargin] = useState<number>(35.00); // 35% Margem Alvo

  useEffect(() => {
    const saved = localStorage.getItem('laromme_suppliers_v2');
    if (saved) {
      try {
        setSuppliers(JSON.parse(saved));
        return;
      } catch (e) {
        console.error('Erro ao ler fornecedores:', e);
      }
    }
    setSuppliers(INITIAL_SUPPLIERS);
  }, []);

  const saveToStorage = (updated: Supplier[]) => {
    setSuppliers(updated);
    localStorage.setItem('laromme_suppliers_v2', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Cálculo de Precificação Reversa
  const totalVariablePercentage = (tax + gateway + margin) / 100;
  const totalCost = cost + packaging;
  const suggestedPrice = totalVariablePercentage < 1 ? totalCost / (1 - totalVariablePercentage) : 0;
  const currentMarkup = totalCost > 0 ? suggestedPrice / totalCost : 0;

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setProductType('VESTIGIUM (Boxy)');
    setPrice('68.00');
    setMoq('50');
    setLeadTime('20');
    setIsModalOpen(true);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingId(sup.id);
    setName(sup.name);
    setProductType(sup.productType);
    setPrice(sup.price.toString());
    setMoq(sup.moq.toString());
    setLeadTime(sup.leadTime.toString());
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este fornecedor da matriz?')) {
      const updated = suppliers.filter(s => s.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = Number(price.replace(',', '.')) || 0;
    const cleanMoq = parseInt(moq) || 0;
    const cleanLead = parseInt(leadTime) || 0;

    if (editingId) {
      const updated = suppliers.map(s =>
        s.id === editingId
          ? { ...s, name, productType, price: cleanPrice, moq: cleanMoq, leadTime: cleanLead }
          : s
      );
      saveToStorage(updated);
    } else {
      const newSup: Supplier = {
        id: `SUP-${String(suppliers.length + 1).padStart(2, '0')}`,
        name,
        productType,
        price: cleanPrice,
        moq: cleanMoq,
        leadTime: cleanLead
      };
      saveToStorage([...suppliers, newSup]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            SUPPLY CHAIN & ENGENHARIA DE CUSTOS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Fornecedores & Private Label Matrix
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cadastro de Facções, Tech Packs e Motor Dinâmico de Precificação
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TABELA CRUD DE FORNECEDORES (7 COLUNAS) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Factory className="w-4 h-4 text-zinc-500" />
              Matriz de Facções & Fornecedores
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              {suppliers.length} Ativos
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 text-[10px] text-zinc-500 uppercase tracking-widest bg-white">
                  <th className="py-3 px-5 font-bold">Fornecedor</th>
                  <th className="py-3 px-5 font-bold">Artefato</th>
                  <th className="py-3 px-5 font-bold">Custo Unit.</th>
                  <th className="py-3 px-5 font-bold">MOQ</th>
                  <th className="py-3 px-5 font-bold">Prazo</th>
                  <th className="py-3 px-5 text-right font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400 font-mono text-xs">
                      Nenhum fornecedor cadastrado. Clique em Novo Fornecedor para adicionar.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((sup) => (
                    <tr key={sup.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <span className="font-bold font-sans text-sm text-zinc-900 block">{sup.name}</span>
                        <span className="text-[9px] text-zinc-400 font-mono">{sup.id}</span>
                      </td>
                      <td className="py-3 px-5 text-[11px] text-zinc-600">
                        {sup.productType}
                      </td>
                      <td className="py-3 px-5 font-bold text-zinc-900">
                        {formatBRL(sup.price)}
                      </td>
                      <td className="py-3 px-5 text-zinc-600">
                        {sup.moq} un.
                      </td>
                      <td className="py-3 px-5 text-zinc-600">
                        {sup.leadTime} dias
                      </td>
                      <td className="py-3 px-5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-100"
                          title="Editar Fornecedor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sup.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Remover Fornecedor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOTOR DE PRECIFICAÇÃO (5 COLUNAS) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Calculator className="w-4 h-4 text-zinc-500" />
              Motor de Precificação Reversa
            </h2>
            <span className="text-[9px] font-mono tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase font-bold">
              Simulador
            </span>
          </div>

          <div className="p-5 space-y-5 flex-1 font-mono text-xs">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" /> 1. Custos Diretos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">Custo Confecção (R$)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">Unboxing/Tags (R$)</label>
                  <input
                    type="number"
                    value={packaging}
                    onChange={(e) => setPackaging(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs font-bold text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> 2. Taxas & Margem Alvo
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">Simples (%)</label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 mb-1">Gateway Pix (%)</label>
                  <input
                    type="number"
                    value={gateway}
                    onChange={(e) => setGateway(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-900 font-bold mb-1">Margem (%)</label>
                  <input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-emerald-50 border border-emerald-200 rounded p-2 text-xs font-bold text-emerald-900 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-5 mt-auto text-white flex justify-between items-center font-mono">
            <div>
              <span className="block text-[10px] text-zinc-400 tracking-widest uppercase mb-1">
                Preço de Venda Sugerido
              </span>
              <span className="text-3xl font-bold tracking-tight text-white font-sans">
                {formatBRL(suggestedPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-400 tracking-widest uppercase mb-1">
                Markup
              </span>
              <span className="text-xl font-bold text-emerald-400">
                {currentMarkup.toFixed(2)}x
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL CRUD FORNECEDOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Nome da Facção / Fornecedor:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Confecção Ceará Têxtil"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Artefato Produzido:</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="VESTIGIUM (Boxy)">VESTIGIUM (Boxy Bordô)</option>
                  <option value="TENAX (Poliamida)">TENAX (Camiseta Preta)</option>
                  <option value="LIBERTAS (Regata)">LIBERTAS (Regata Preta)</option>
                  <option value="UMBRA (Boné)">UMBRA (Boné 5-Panel)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Custo (R$):</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">MOQ (un):</label>
                  <input
                    type="number"
                    required
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Prazo (dias):</label>
                  <input
                    type="number"
                    required
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
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