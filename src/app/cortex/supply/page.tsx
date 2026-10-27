'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Factory, Calculator, Plus, Edit, Trash2, X, RefreshCw, Loader2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SupplyPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  // Modal de Criação / Edição de Ficha Técnica
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Topwear');
  const [formPrice, setFormPrice] = useState('');
  const [formCost, setFormCost] = useState('');

  // Simulador de Markup
  const [custoMaoObra, setCustoMaoObra] = useState<number>(45);
  const [custoTecido, setCustoTecido] = useState<number>(28);
  const [custoInsumos, setCustoInsumos] = useState<number>(7.5);
  const [margemAlvo, setMargemAlvo] = useState<number>(45);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erro em Supply:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Topwear');
    setFormPrice('');
    setFormCost('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(p);
    setFormName(p.name || '');
    setFormCategory(p.category || 'Topwear');
    setFormPrice(String(p.price || ''));
    setFormCost(String(p.cost_piece || ''));
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice) || 0,
        cost_piece: parseFloat(formCost) || 0,
        stock: 0,
        stock_p: 0,
        stock_m: 0,
        stock_g: 0,
        stock_gg: 0,
        status: 'ATIVO'
      };

      if (editingItem) {
        const res = await fetch('/api/cortex/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Erro ao atualizar');
      } else {
        const res = await fetch('/api/cortex/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku_code: `SKU-${Date.now().toString().slice(-4)}`, ...payload })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Erro ao criar');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    }
  };

  const handleDeleteItem = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Remover "${name}" do acervo de produção?`)) return;
    try {
      const res = await fetch(`/api/cortex/products?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao excluir');

      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedProductId === id && products.length > 1) {
        setSelectedProductId(products.find(p => p.id !== id)?.id || '');
      }
      alert(`"${name}" removido.`);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const custoDiretoTotal = custoMaoObra + custoTecido + custoInsumos;
  const taxaImpostoGateway = 0.06 + 0.0499;
  const precoSugerido = custoDiretoTotal / (1 - (margemAlvo / 100) - taxaImpostoGateway);
  const markupMultiplicador = custoDiretoTotal > 0 ? precoSugerido / custoDiretoTotal : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Engenharia de Produto & Private Label
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Supply & Matriz de Produção
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Composição de CPV, Fichas de Confecção e Simulador de Markup
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Ficha</span>
          </button>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg transition-all shadow-2xs disabled:opacity-50"
            title="Atualizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <Factory className="w-4 h-4 text-zinc-600" /> Acervo em Pré-Produção
            </h2>
            <span className="text-xs font-mono text-zinc-500 font-bold">
              {products.length} modelos configurados
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              Carregando artefatos...
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500">
              Nenhuma ficha cadastrada. Clique em "Adicionar Ficha" acima.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 font-mono text-xs">
              {products.map(p => {
                const isSelected = p.id === selectedProductId;
                const preco = Number(p.price || 0);
                const cpvBase = Number(p.cost_piece || (preco * 0.35));
                const margemBruta = preco - cpvBase;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${
                      isSelected ? 'bg-zinc-100/70 border-l-4 border-zinc-900' : 'hover:bg-zinc-50/60'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-zinc-900 text-sm block font-sans">{p.name}</span>
                      <span className="text-[11px] text-zinc-400 uppercase">{p.category}</span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">CPV Base</span>
                        <span className="font-bold text-zinc-700">{formatBRL(cpvBase)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">Preço Tabela</span>
                        <span className="font-black text-zinc-900">{formatBRL(preco)}</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-zinc-200 pl-3">
                        <button
                          onClick={(e) => openEditModal(p, e)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-200"
                          title="Editar Ficha"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(p.id, p.name, e)}
                          className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          title="Excluir Ficha"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <Calculator className="w-4 h-4 text-zinc-600" /> Motor de Precificação (Markup)
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Simulando: <span className="font-bold text-zinc-900">{selectedProduct?.name || 'Nenhum'}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-zinc-600 block mb-1">Mão de Obra / Facção (R$)</label>
              <input
                type="number"
                value={custoMaoObra}
                onChange={(e) => setCustoMaoObra(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Tecido / Malharia Nobre (R$)</label>
              <input
                type="number"
                value={custoTecido}
                onChange={(e) => setCustoTecido(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Insumos de Unboxing & Aviamentos (R$)</label>
              <input
                type="number"
                value={custoInsumos}
                onChange={(e) => setCustoInsumos(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Margem Líquida Alvo (%)</label>
              <input
                type="number"
                value={margemAlvo}
                onChange={(e) => setMargemAlvo(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Custo Direto Total (CPV):</span>
              <span className="font-bold text-white">{formatBRL(custoDiretoTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Markup Operacional:</span>
              <span className="font-bold text-emerald-400">{markupMultiplicador.toFixed(2)}x</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
              <span className="text-xs uppercase font-mono font-bold text-zinc-300">Preço Sugerido:</span>
              <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                {formatBRL(precoSugerido)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 font-sans">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                {editingItem ? 'Editar Ficha de Confecção' : 'Nova Ficha de Confecção'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-600 block mb-1 font-bold">Nome do Modelo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Camiseta Boxy Heavyweight"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Categoria</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-sans"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Headwear">Headwear</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Preço de Tabela (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 block mb-1 font-bold">Custo de Confecção Base (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold"
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
                  Salvar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}