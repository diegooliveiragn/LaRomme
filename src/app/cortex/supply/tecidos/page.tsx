'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit2, X, RefreshCw, Scissors, Scale } from 'lucide-react';

interface FabricRoll {
  id: string;
  name: string;
  composition: string;
  supplier: string;
  weightKg: number;
  costTotal: number;
  yieldPerPiece: number; // Ex: 0.35 kg por camisa
}

const INITIAL_FABRICS: FabricRoll[] = [
  { id: 'MAL-01', name: 'Malha Algodão Penteado 26.1 Bordô', composition: '100% Algodão Penteado (260g)', supplier: 'Tecelagem Menegotti', weightKg: 35.0, costTotal: 1850.00, yieldPerPiece: 0.35 },
  { id: 'MAL-02', name: 'Poliamida Tech Preta com Elastano', composition: '90% Poliamida, 10% Elastano', supplier: 'Santaconstancia Têxtil', weightKg: 20.0, costTotal: 1600.00, yieldPerPiece: 0.22 },
  { id: 'MAL-03', name: 'Microfibra Perfurada Preta', composition: '100% Poliéster Microperfurado', supplier: 'Malharia Sol', weightKg: 15.0, costTotal: 890.00, yieldPerPiece: 0.18 },
];

export default function CortexTecidosPage() {
  const [fabrics, setFabrics] = useState<FabricRoll[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [composition, setComposition] = useState('');
  const [supplier, setSupplier] = useState('');
  const [weightKg, setWeightKg] = useState('30');
  const [costTotal, setCostTotal] = useState('1500');
  const [yieldPerPiece, setYieldPerPiece] = useState('0.30');

  useEffect(() => {
    const saved = localStorage.getItem('laromme_tecidos_v1');
    setFabrics(saved ? JSON.parse(saved) : INITIAL_FABRICS);
  }, []);

  const saveFabrics = (updated: FabricRoll[]) => {
    setFabrics(updated);
    localStorage.setItem('laromme_tecidos_v1', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setComposition('100% Algodão 26.1');
    setSupplier('Tecelagem Parceira');
    setWeightKg('30');
    setCostTotal('1500');
    setYieldPerPiece('0.30');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWeight = Number(weightKg) || 0;
    const cleanCost = Number(costTotal) || 0;
    const cleanYield = Number(yieldPerPiece) || 0.30;

    if (editingId) {
      const updated = fabrics.map(f =>
        f.id === editingId
          ? { ...f, name, composition, supplier, weightKg: cleanWeight, costTotal: cleanCost, yieldPerPiece: cleanYield }
          : f
      );
      saveFabrics(updated);
    } else {
      const newRoll: FabricRoll = {
        id: `MAL-${String(fabrics.length + 1).padStart(2, '0')}`,
        name,
        composition,
        supplier,
        weightKg: cleanWeight,
        costTotal: cleanCost,
        yieldPerPiece: cleanYield
      };
      saveFabrics([...fabrics, newRoll]);
    }

    setIsModalOpen(false);
  };

  const totalKg = fabrics.reduce((acc, curr) => acc + curr.weightKg, 0);
  const totalCost = fabrics.reduce((acc, curr) => acc + curr.costTotal, 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            SUPPLY & GESTÃO DE MALHAS E MATÉRIA-PRIMA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Estoque de Rolos de Malha & Rendimento
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Controle de Quilos de Tecido, Rendimento por Corte e Custo Médio por Peça
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Rolo de Malha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Volume de Malha em Galpão
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {totalKg.toFixed(1)} <span className="text-base text-zinc-400 font-normal">kg</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">{fabrics.length} rolos registrados</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Capital em Tecelagem
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(totalCost)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">Custo de matéria-prima pura</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Potencial de Camisetas
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            ~{Math.round(fabrics.reduce((acc, f) => acc + (f.yieldPerPiece > 0 ? f.weightKg / f.yieldPerPiece : 0), 0))} peças
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">Rendimento médio estimado</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-500" /> Matriz de Rolos & Composição
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">CRUD de Tecidos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">Código</th>
                <th className="px-6 py-3 font-bold">Malha / Tecido</th>
                <th className="px-6 py-3 font-bold">Composição</th>
                <th className="px-6 py-3 font-bold text-center">Peso (kg)</th>
                <th className="px-6 py-3 font-bold text-right">Custo do Rolo</th>
                <th className="px-6 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {fabrics.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-zinc-400">{f.id}</td>
                  <td className="px-6 py-3.5 font-bold font-sans text-sm text-zinc-900">{f.name}</td>
                  <td className="px-6 py-3.5 text-zinc-600">{f.composition}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-zinc-900">{f.weightKg} kg</td>
                  <td className="px-6 py-3.5 text-right font-bold text-zinc-900">{formatBRL(f.costTotal)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Excluir este rolo de malha?')) {
                          saveFabrics(fabrics.filter(x => x.id !== f.id));
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">Novo Rolo de Malha</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Descrição da Malha:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Meia Malha Algodão 26.1 Tinto"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900 font-sans"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Peso Total (kg):</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Custo Total (R$):</label>
                  <input
                    type="number"
                    value={costTotal}
                    onChange={(e) => setCostTotal(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-zinc-900 text-white font-bold rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}