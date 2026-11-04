'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle, Plus, Trash2, Edit2, X, Truck, CheckCircle2 } from 'lucide-react';

interface ReverseItem {
  id: string;
  orderNumber: string;
  productName: string;
  size: string;
  reason: string;
  cost: number;
  status: 'EM_TRIAGEM' | 'CONCLUIDO' | 'RECUSADO';
  action: string;
}

export default function ReversaPage() {
  const [items, setItems] = useState<ReverseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form CRUD
  const [orderNumber, setOrderNumber] = useState('');
  const [productName, setProductName] = useState('TENAX T-SHIRT');
  const [size, setSize] = useState('M');
  const [reason, setReason] = useState('Troca de Tamanho');
  const [cost, setCost] = useState('32.00');
  const [status, setStatus] = useState<'EM_TRIAGEM' | 'CONCLUIDO' | 'RECUSADO'>('EM_TRIAGEM');
  const [action, setAction] = useState('Ajuste de Grade');

  useEffect(() => {
    const saved = localStorage.getItem('laromme_reversa_v2');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems([]);
      }
    } else {
      setItems([]); // Sem mocks: estado zero inicial limpo
    }
  }, []);

  const saveToStorage = (updated: ReverseItem[]) => {
    setItems(updated);
    localStorage.setItem('laromme_reversa_v2', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const openCreateModal = () => {
    setEditingId(null);
    setOrderNumber('');
    setProductName('TENAX T-SHIRT');
    setSize('M');
    setReason('Troca de Tamanho');
    setCost('32.00');
    setStatus('EM_TRIAGEM');
    setAction('Ajuste de Grade');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ReverseItem) => {
    setEditingId(item.id);
    setOrderNumber(item.orderNumber);
    setProductName(item.productName);
    setSize(item.size);
    setReason(item.reason);
    setCost(item.cost.toString());
    setStatus(item.status);
    setAction(item.action);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta ocorrência de logística reversa?')) {
      const updated = items.filter(i => i.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCost = Number(cost.replace(',', '.')) || 0;

    if (editingId) {
      const updated = items.map(i =>
        i.id === editingId
          ? { ...i, orderNumber, productName, size, reason, cost: cleanCost, status, action }
          : i
      );
      saveToStorage(updated);
    } else {
      const newItem: ReverseItem = {
        id: `REV-${String(items.length + 1).padStart(2, '0')}`,
        orderNumber,
        productName,
        size,
        reason,
        cost: cleanCost,
        status,
        action
      };
      saveToStorage([...items, newItem]);
    }

    setIsModalOpen(false);
  };

  const totalReverseCost = items.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            PÓS-VENDA & CONTROLE DE FRICÇÃO
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Logística Reversa & Trocas
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Registro de Chamados, Fretes de Devolução e Aprimoramento de Modelagem
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Ocorrência</span>
        </button>
      </div>

      {/* KPIS DE REVERSA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Chamados Registrados
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {items.length} <span className="text-base font-normal text-zinc-400">ocorrências</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {items.length === 0 ? 'Zero devoluções pendentes' : 'Controle ativo de pós-venda'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 block mb-2">
            Custo Total em Fretes Reversos
          </span>
          <div className="text-3xl font-bold text-rose-600 font-mono tracking-tight">
            {formatBRL(totalReverseCost)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Gastos com retorno e substituição
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Status Operacional
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            Saudável
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Sem padrões críticos de defeito têxtil
          </p>
        </div>

      </div>

      {/* TABELA CRUD DE LOGÍSTICA REVERSA */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Truck className="w-4 h-4 text-zinc-500" /> Histórico de Devoluções & Trocas
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Modo CRUD Ativo
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-xs font-mono text-zinc-400 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-bold text-zinc-700">Nenhum chamado de logística reversa registrado.</p>
            <p className="text-[11px]">Quando um cliente solicitar troca ou devolução, clique em "Registrar Ocorrência".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Protocolo</th>
                  <th className="px-6 py-3 font-bold">Pedido</th>
                  <th className="px-6 py-3 font-bold">Artefato</th>
                  <th className="px-6 py-3 font-bold">Motivo</th>
                  <th className="px-6 py-3 font-bold text-right">Custo Reverso</th>
                  <th className="px-6 py-3 font-bold text-center">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-zinc-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-600">
                      #{item.orderNumber}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold font-sans text-zinc-900 block">{item.productName}</span>
                      <span className="text-[10px] text-zinc-400">Grade: {item.size}</span>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-600">
                      {item.reason}
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-rose-600">
                      - {formatBRL(item.cost)}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.status === 'CONCLUIDO' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : item.status === 'RECUSADO' 
                          ? 'bg-zinc-100 text-zinc-600' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CRUD DE OCORRÊNCIA REVERSA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Chamado' : 'Registrar Logística Reversa'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Número do Pedido:</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: 1042"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Artefato:</label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  >
                    <option value="VESTIGIUM BOXY">VESTIGIUM BOXY</option>
                    <option value="TENAX T-SHIRT">TENAX T-SHIRT</option>
                    <option value="LIBERTAS REGATA">LIBERTAS REGATA</option>
                    <option value="UMBRA 5-PANEL">UMBRA 5-PANEL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Tamanho:</label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Motivo da Devolução / Troca:</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Troca de tamanho (P por M)"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Custo do Frete Reverso (R$):</label>
                  <input
                    type="text"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Status do Chamado:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  >
                    <option value="EM_TRIAGEM">EM TRIAGEM</option>
                    <option value="CONCLUIDO">CONCLUÍDO</option>
                    <option value="RECUSADO">RECUSADO</option>
                  </select>
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
                  Confirmar Ocorrência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}