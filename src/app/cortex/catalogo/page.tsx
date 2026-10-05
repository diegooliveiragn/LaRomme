'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  status: string;
}

interface Variant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color_name: string;
  stock_physical: number;
  stock_reserved: number;
  stock_available: number;
  cogs_unit: number;
}

export default function CortexCatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'VITRINE' | 'VARIACOES'>('VITRINE');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pData, error: pErr } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!pErr && pData) {
        setProducts(pData as Product[]);
      }

      const { data: vData, error: vErr } = await supabase
        .from('inventory_variants')
        .select('*')
        .order('sku', { ascending: true });

      if (!vErr && vData) {
        setVariants(vData as Variant[]);
      }
    } catch (err) {
      console.error('Erro ao carregar catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerCacheRevalidation = async (slug?: string) => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
    } catch (e) {
      console.error('Erro ao solicitar revalidação de cache:', e);
    }
  };

  const handleEditClick = (prod: Product) => {
    setSelectedProduct(prod);
    setEditForm({ ...prod });
    setIsEditing(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          status: editForm.status,
          category: editForm.category,
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? ({ ...p, ...editForm } as Product) : p))
      );

      // Revalidação em tempo real
      await triggerCacheRevalidation(selectedProduct.id);

      alert('Artefato atualizado e vitrine pública revalidada em tempo real!');
      setIsEditing(false);
    } catch (e) {
      alert('Falha ao atualizar o produto no banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  const productVariants = selectedProduct
    ? variants.filter((v) => v.product_id === selectedProduct.id)
    : [];

  const handleAddStock = async (variantId: string, currentPhysical: number) => {
    const qty = prompt('Quantas peças novas chegaram do fornecedor? (Apenas números)');
    if (!qty || isNaN(Number(qty))) return;

    setSaving(true);
    const numQty = Number(qty);
    const newPhysical = currentPhysical + numQty;

    const variantInfo = variants.find((v) => v.id === variantId);
    const newAvailable = newPhysical - (variantInfo?.stock_reserved || 0);

    try {
      const { error } = await supabase
        .from('inventory_variants')
        .update({ stock_physical: newPhysical, stock_available: newAvailable })
        .eq('id', variantId);

      if (error) throw error;

      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, stock_physical: newPhysical, stock_available: newAvailable }
            : v
        )
      );

      if (selectedProduct) {
        await triggerCacheRevalidation(selectedProduct.id);
      }
    } catch (e) {
      alert('Falha ao atualizar estoque da variante.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Product Studio & WMS</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Acervo, Precificação e Grade de Estoque Físico</p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
        >
          Sincronizar Banco
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LISTAGEM DE ARTEFATOS (PAINEL ESQUERDO) */}
        <div className="lg:w-1/3 flex flex-col space-y-4">
          <h2 className="text-sm font-semibold tracking-wide border-b border-slate-800/60 pb-2">Acervo da Maison</h2>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Lendo catálogo...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">Nenhum artefato localizado.</div>
            ) : (
              <div className="divide-y divide-slate-800/40">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-slate-800/30 transition-all ${
                      selectedProduct?.id === prod.id ? 'bg-slate-800/50 border-l-2 border-amber-500' : 'border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-200 uppercase text-xs tracking-wider">{prod.name}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        prod.status === 'ACTIVE' || !prod.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {prod.status || 'ACTIVE'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">{prod.id}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PAINEL DE EDIÇÃO E VARIAÇÕES (PAINEL DIREITO) */}
        <div className="lg:w-2/3 flex flex-col">
          {!selectedProduct ? (
            <div className="flex-1 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500 font-medium h-96">
              Selecione um artefato no painel esquerdo para gerenciar.
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
              {/* HEADER DO PRODUTO */}
              <div className="p-6 border-b border-slate-800/60 flex justify-between items-start bg-slate-950/40">
                <div className="flex items-center space-x-4">
                  {selectedProduct.image && (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 object-cover border border-slate-700 rounded shadow-md" />
                  )}
                  <div>
                    <h2 className="text-xl font-serif font-bold uppercase tracking-wide text-slate-100">{selectedProduct.name}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">ID: {selectedProduct.id} • R$ {selectedProduct.price?.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEditClick(selectedProduct)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold transition-colors shadow-sm"
                  >
                    Editar Vitrine
                  </button>
                )}
              </div>

              {/* NAVEGAÇÃO DE ABAS INTERNAS */}
              <div className="flex border-b border-slate-800/60 bg-slate-900/80">
                <button
                  onClick={() => setActiveTab('VITRINE')}
                  className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
                    activeTab === 'VITRINE' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Dados da Vitrine
                </button>
                <button
                  onClick={() => setActiveTab('VARIACOES')}
                  className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
                    activeTab === 'VARIACOES' ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Matriz de Estoque (WMS)
                </button>
              </div>

              {/* CONTEÚDO DAS ABAS */}
              <div className="p-6 flex-1 overflow-y-auto">
                {/* ABA 1: EDIÇÃO DE PRODUTO */}
                {activeTab === 'VITRINE' && (
                  <div className="space-y-6 max-w-2xl">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Nome Público</label>
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Preço Base (R$)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.price || ''}
                              onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Categoria</label>
                            <input
                              type="text"
                              value={editForm.category || ''}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Status no Site</label>
                            <select
                              value={editForm.status || 'ACTIVE'}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                            >
                              <option value="ACTIVE">Ativo (Publicado)</option>
                              <option value="DRAFT">Rascunho (Oculto)</option>
                              <option value="ARCHIVED">Arquivado (Descontinuado)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block">Descrição (Rich Text Suportado)</label>
                          <textarea
                            rows={6}
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="pt-4 flex items-center space-x-3">
                          <button
                            disabled={saving}
                            onClick={handleSaveProduct}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
                          >
                            {saving ? 'Gravando...' : 'Salvar e Revalidar Vitrine'}
                          </button>
                          <button
                            disabled={saving}
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-2.5 bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-semibold uppercase tracking-widest transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 text-slate-300 text-sm">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block mb-1">Descrição Registrada</span>
                          <p className="whitespace-pre-wrap leading-relaxed">{selectedProduct.description || 'Nenhuma descrição fornecida.'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-800/50">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block mb-1">Categoria</span>
                            <span className="font-semibold">{selectedProduct.category || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block mb-1">Preço Atual</span>
                            <span className="font-semibold text-emerald-400">R$ {selectedProduct.price?.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ABA 2: MATRIZ DE VARIAÇÕES E ESTOQUE */}
                {activeTab === 'VARIACOES' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-slate-400">Grade de Tamanhos, Cores e Controle Físico de Prateleira.</p>
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">
                        + Nova Variação
                      </button>
                    </div>

                    {productVariants.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-700 rounded-lg">
                        <p className="text-xs text-slate-400">Nenhuma variação (SKU) registrada para este produto.</p>
                        <p className="text-[10px] text-slate-500 mt-2">Clique em "Nova Variação" para cadastrar Tamanho e Cor.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-widest">
                            <tr>
                              <th className="py-3 px-4">SKU / Especificação</th>
                              <th className="py-3 px-4 text-center">Tamanho</th>
                              <th className="py-3 px-4 text-center">Em Mãos (Físico)</th>
                              <th className="py-3 px-4 text-center">Reservado (Pix)</th>
                              <th className="py-3 px-4 text-center">Disponível (Site)</th>
                              <th className="py-3 px-4 text-right">Ação WMS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40">
                            {productVariants.map((variant) => (
                              <tr key={variant.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="font-mono text-slate-200">{variant.sku}</div>
                                  <div className="text-[10px] text-slate-500">{variant.color_name}</div>
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-slate-300">{variant.size}</td>
                                <td className="py-3 px-4 text-center font-mono text-slate-200">{variant.stock_physical || 0}</td>
                                <td className="py-3 px-4 text-center font-mono text-amber-500/80">{variant.stock_reserved || 0}</td>
                                <td className="py-3 px-4 text-center font-mono">
                                  <span className={`px-2 py-0.5 rounded ${
                                    (variant.stock_available || 0) <= 0
                                      ? 'bg-rose-500/10 text-rose-400'
                                      : 'bg-emerald-500/10 text-emerald-400'
                                  }`}>
                                    {variant.stock_available || 0}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => handleAddStock(variant.id, variant.stock_physical || 0)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-[10px] font-semibold transition-colors"
                                  >
                                    + Entrada
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}