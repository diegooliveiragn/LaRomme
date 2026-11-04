'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Wallet, Plus, Trash2, Edit2, X, Download, FileText, 
  ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign, Scale 
} from 'lucide-react';

interface ManualEntry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  date: string;
}

const INITIAL_ENTRIES: ManualEntry[] = [
  { id: 'FIN-01', type: 'EXPENSE', category: 'INFRAESTRUTURA', description: 'Registro de Marca INPI', amount: 500.00, date: '2026-11-01' },
  { id: 'FIN-02', type: 'EXPENSE', category: 'INFRAESTRUTURA', description: 'Domínios Próprios GoDaddy (.com.br 3 anos)', amount: 394.25, date: '2026-11-01' },
];

export default function CortexFinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [storeGrossRevenue, setStoreGrossRevenue] = useState(0);
  const [entries, setEntries] = useState<ManualEntry[]>([]);
  
  // Modal CRUD Financeiro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryType, setEntryType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [category, setCategory] = useState('TRÁFEGO');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const dreRef = useRef<HTMLDivElement>(null);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        const orders = json.orders || [];
        const rev = orders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
        setStoreGrossRevenue(rev);
      }
    } catch (e) {
      console.error('Erro ao buscar dados financeiros:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('laromme_financeiro_entries_v1');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        setEntries(INITIAL_ENTRIES);
      }
    } else {
      setEntries(INITIAL_ENTRIES);
    }
    fetchFinancialData();
  }, []);

  const saveEntries = (updated: ManualEntry[]) => {
    setEntries(updated);
    localStorage.setItem('laromme_financeiro_entries_v1', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Cálculos Consolidados da DRE
  const manualIncomes = entries.filter(e => e.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGrossRevenue = storeGrossRevenue + manualIncomes;

  // Deduções Operacionais
  const taxesSimples = totalGrossRevenue * 0.06; // 6% Fisco
  const gatewayFees = storeGrossRevenue * 0.0099; // 0,99% Pix Mercado Pago
  const netRevenue = totalGrossRevenue - taxesSimples - gatewayFees;

  // Despesas Operacionais Manuais (Tráfego, Facções, Insumos, Softwares)
  const manualExpenses = entries.filter(e => e.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  
  // CMV Teórico sobre Vendas de Loja (35%)
  const cogsStore = storeGrossRevenue * 0.35;
  const grossProfit = netRevenue - cogsStore;
  const netProfit = grossProfit - manualExpenses;
  const proLaboreSafe = netProfit > 0 ? netProfit * 0.30 : 0; // 30% reserva de pró-labore

  const openCreateModal = () => {
    setEditingId(null);
    setEntryType('EXPENSE');
    setCategory('TRÁFEGO');
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ManualEntry) => {
    setEditingId(item.id);
    setEntryType(item.type);
    setCategory(item.category);
    setDescription(item.description);
    setAmount(item.amount.toString());
    setDate(item.date);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Deseja excluir este lançamento contábil?')) {
      const updated = entries.filter(e => e.id !== id);
      saveEntries(updated);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = Number(amount.replace(',', '.')) || 0;

    if (editingId) {
      const updated = entries.map(item =>
        item.id === editingId
          ? { ...item, type: entryType, category, description, amount: cleanAmount, date }
          : item
      );
      saveEntries(updated);
    } else {
      const newEntry: ManualEntry = {
        id: `FIN-${String(entries.length + 1).padStart(2, '0')}`,
        type: entryType,
        category,
        description,
        amount: cleanAmount,
        date
      };
      saveEntries([newEntry, ...entries]);
    }

    setIsModalOpen(false);
  };

  const handleExportPDF = async () => {
    if (!dreRef.current) return;
    try {
      const canvas = await html2canvas(dreRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('DRE_Executivo_LaRomme.pdf');
    } catch (err) {
      console.error('Erro ao gerar PDF da DRE:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            CONTROLADORIA & DRE GERENCIAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Tesouraria & Demonstração de Resultados
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            DRE Dinâmico, Lançamentos Manuais de Caixa e Governança de Pró-Labore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Lançamento</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* PAINEL C-LEVEL: TERMOSTATO DE PRÓ-LABORE */}
      <div className="p-6 rounded-lg bg-zinc-900 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Governança de Retirada • Pró-Labore Seguro (30% do Lucro Líquido Real)
          </span>
          <div className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
            {formatBRL(proLaboreSafe)}
          </div>
          <p className="text-[11px] font-mono text-zinc-400 mt-1">
            {netProfit > 0 
              ? 'Margem saudável para distribuição após amortização de despesas.' 
              : 'Foco em acúmulo de capital. Nenhuma retirada recomendada neste período.'}
          </p>
        </div>
        <Scale className="w-10 h-10 text-zinc-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: DRE GERENCIAL (MÓDULO PDF - 7 COLUNAS) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" /> DRE Sintética
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Visão Consolidada
            </span>
          </div>

          <div ref={dreRef} className="p-6 bg-white space-y-4 font-mono text-xs flex-1">
            <div className="border-b border-zinc-900 pb-3 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-lg font-bold text-zinc-900 tracking-wider uppercase block">
                  LAROMME.
                </span>
                <span className="text-[9px] text-zinc-400 uppercase">
                  Demonstração do Resultado • 03°44'S 38°31'W
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">MÊS ATUAL</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between py-1.5 font-bold text-zinc-900 border-b border-zinc-100">
                <span>(+) Receita Bruta Total</span>
                <span>{formatBRL(totalGrossRevenue)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-500 pl-4">
                <span>(-) Impostos Fiscais (Simples 6%)</span>
                <span>- {formatBRL(taxesSimples)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-500 pl-4 border-b border-zinc-100 pb-2">
                <span>(-) Gateway Pix Mercado Pago (0,99%)</span>
                <span>- {formatBRL(gatewayFees)}</span>
              </div>

              <div className="flex justify-between py-1.5 font-bold text-zinc-800 bg-zinc-50 px-2 rounded">
                <span>(=) Receita Líquida Operacional</span>
                <span>{formatBRL(netRevenue)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-500 pl-4 border-b border-zinc-100 pb-2">
                <span>(-) CMV Estimado em Produção (35%)</span>
                <span>- {formatBRL(cogsStore)}</span>
              </div>

              <div className="flex justify-between py-1.5 font-bold text-zinc-800 bg-zinc-50 px-2 rounded">
                <span>(=) Lucro Bruto Operacional</span>
                <span className="text-emerald-700">{formatBRL(grossProfit)}</span>
              </div>

              <div className="flex justify-between py-1 text-rose-600 pl-4 border-b border-zinc-100 pb-2">
                <span>(-) Despesas Operacionais & Lançamentos Manuais</span>
                <span>- {formatBRL(manualExpenses)}</span>
              </div>

              <div className="flex justify-between py-3 font-bold bg-zinc-900 text-white px-3 rounded text-sm mt-3">
                <span className="font-sans uppercase tracking-wider">(=) Lucro Líquido Real</span>
                <span className={netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatBRL(netProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: LANÇAMENTOS MANUAIS CRUD (5 COLUNAS) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Wallet className="w-4 h-4 text-zinc-500" /> Lançamentos Manuais
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">
              {entries.length} Registros
            </span>
          </div>

          <div className="overflow-x-auto flex-1 divide-y divide-zinc-100">
            {entries.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-400">
                Nenhum lançamento manual inserido.
              </div>
            ) : (
              entries.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-zinc-50/50 transition-colors text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.type === 'INCOME' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.type === 'INCOME' ? 'Entrada' : 'Saída'}
                      </span>
                      <span className="text-[10px] text-zinc-400">{item.category}</span>
                    </div>
                    <span className="font-bold text-zinc-900 font-sans block mt-1">
                      {item.description}
                    </span>
                    <span className="text-[10px] text-zinc-400">{item.date}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`font-bold block ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                      {item.type === 'INCOME' ? '+' : '-'} {formatBRL(item.amount)}
                    </span>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(item.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* MODAL CRUD DE LANÇAMENTO FINANCEIRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Tipo de Operação:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryType('EXPENSE')}
                    className={`py-2 text-center rounded border font-bold transition-all ${
                      entryType === 'EXPENSE' 
                        ? 'bg-rose-50 text-rose-700 border-rose-300' 
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    (-) Despesa / Saída
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryType('INCOME')}
                    className={`py-2 text-center rounded border font-bold transition-all ${
                      entryType === 'INCOME' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    (+) Receita / Entrada
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Categoria:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="TRÁFEGO">TRÁFEGO / ANÚNCIOS</option>
                  <option value="FACÇÃO">FACÇÃO / CONFECÇÃO</option>
                  <option value="INSUMOS">INSUMOS & EMBALAGEM</option>
                  <option value="INFRAESTRUTURA">INFRAESTRUTURA / DOMÍNIOS</option>
                  <option value="LOGÍSTICA">LOGÍSTICA & FRETES</option>
                  <option value="OUTROS">OUTROS LANÇAMENTOS</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Descrição:</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Anúncios Instagram Meta Ads"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Valor (R$):</label>
                  <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 250.00"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Data:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}