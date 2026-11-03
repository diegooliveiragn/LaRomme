'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight,
  ShieldCheck, Lock, RefreshCw, PlusCircle, Trash2, Tag, Calendar
} from 'lucide-react';

interface ManualEntry {
  id: string;
  type: 'saida' | 'entrada';
  category: string;
  description: string;
  amount: number;
  date: string;
}

export default function FinanceiroCortex() {
  const [loading, setLoading] = useState(true);
  const [finData, setFinData] = useState<any>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  
  // Form de entrada/saída manual
  const [entryType, setEntryType] = useState<'saida' | 'entrada'>('saida');
  const [category, setCategory] = useState<string>('OPEX');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Carregar dados da API de faturamento e entradas do localStorage
  const loadFinance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setFinData(json);
      }
    } catch (err) {
      console.error('Erro ao carregar finanças:', err);
    } finally {
      setLoading(false);
    }

    const saved = localStorage.getItem('laromme_manual_entries');
    if (saved) {
      try {
        setManualEntries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const saveEntries = (entries: ManualEntry[]) => {
    setManualEntries(entries);
    localStorage.setItem('laromme_manual_entries', JSON.stringify(entries));
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newEntry: ManualEntry = {
      id: Date.now().toString(),
      type: entryType,
      category,
      description,
      amount: parsedAmount,
      date,
    };

    saveEntries([newEntry, ...manualEntries]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteEntry = (id: string) => {
    saveEntries(manualEntries.filter((item) => item.id !== id));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Cálculos DRE
  const paidOrders = finData?.orders || [];
  const autoRevenue = paidOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
  
  const manualRevenue = manualEntries
    .filter((e) => e.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const manualExpenses = manualEntries
    .filter((e) => e.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const grossRevenue = autoRevenue + manualRevenue;
  
  // Deduções automáticas
  const taxesSimples = grossRevenue * 0.06; // Simples Nacional 6%
  const mpFee = autoRevenue * 0.0099; // Pix Mercado Pago 0.99%
  const cpvEstimated = autoRevenue * 0.35; // Custo Têxtil 35%
  
  const contributionMargin = grossRevenue - taxesSimples - mpFee - cpvEstimated;
  const netOperatingProfit = contributionMargin - manualExpenses;

  // Divisão dos Cofres 70/30 (sobre o lucro líquido positivo)
  const safeProfit = Math.max(netOperatingProfit, 0);
  const productionCoffer = safeProfit * 0.70; // 70% Acervo e Matéria-Prima
  const founderCoffer = safeProfit * 0.30;    // 30% Pró-Labore / Distribuição Segura

  return (
    <div className="space-y-6 pb-12 font-sans text-zinc-900 bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">TESOURARIA & CONTROLADORIA • LA ROMME</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Livro-Caixa & DRE Real</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Gestão de Centavos, Lançamentos Manuais e Divisão 70/30</p>
        </div>

        <button
          onClick={loadFinance}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono rounded cursor-pointer transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sincronizar
        </button>
      </div>

      {/* OS DOIS COFRES 70/30 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" /> Cofre de Produção (70%)
            </span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Acervo & Private Label
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-emerald-950">
              {formatBRL(productionCoffer)}
            </span>
            <p className="text-[11px] text-emerald-700 mt-1">
              Fundo blindado exclusivamente para sinal de corte, compra de malha leve e facção.
            </p>
          </div>
          <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-500" /> Cofre do Fundador (30%)
            </span>
            <span className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-bold">
              Retirada Segura
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-zinc-900">
              {formatBRL(founderCoffer)}
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">
              Limite máximo de pró-labore disponível sem descapitalizar o próximo lote da marca.
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div className="bg-zinc-800 h-full rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE LANÇAMENTO MANUAL & DRE EM CASCATA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORMULÁRIO */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-zinc-600" /> Lançamento de Partidas
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono">Registre despesas avulsas (motoboy, amostras) ou receitas extras</p>
          </div>

          <form onSubmit={handleAddEntry} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEntryType('saida')}
                className={`py-2 text-center rounded border cursor-pointer font-bold transition-all ${
                  entryType === 'saida'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}
              >
                [-] Saída / Despesa
              </button>
              <button
                type="button"
                onClick={() => setEntryType('entrada')}
                className={`py-2 text-center rounded border cursor-pointer font-bold transition-all ${
                  entryType === 'entrada'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}
              >
                [+] Entrada / Receita
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-500 font-bold">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs focus:outline-none"
              >
                <option value="OPEX">OpEx Fixo (Assinaturas, Domínio)</option>
                <option value="PRODUCAO">Produção & Matéria-Prima</option>
                <option value="INSUMOS">Insumos de Embalagem & Unboxing</option>
                <option value="MIDIA">Tráfego Pago (Meta/TikTok Ads)</option>
                <option value="LOGISTICA">Logística Local (Motoboy CE)</option>
                <option value="VENDA_DIRETA">Venda Direta / Corporativa</option>
                <option value="APORTE">Aporte de Capital</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-500 font-bold">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Corrida Motoboy Meireles"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Valor (R$)</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded p-2 text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded font-bold uppercase tracking-wider text-[11px] cursor-pointer mt-2 transition-all"
            >
              Lançar no Caixa
            </button>
          </form>
        </div>

        {/* DRE GERENCIAL CONCILIADA */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900">DRE Gerencial Consolidada</h2>
            <p className="text-[10px] text-zinc-400 font-mono">E-commerce Integrado + Lançamentos Manuais</p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
              <span className="font-bold text-zinc-900">1. Receita Bruta Total</span>
              <span className="font-bold text-zinc-900">{formatBRL(grossRevenue)}</span>
            </div>
            <div className="pl-3 text-[11px] text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>↳ Vendas Pix E-commerce</span>
                <span>{formatBRL(autoRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>↳ Receitas Extras / Lançamentos</span>
                <span>{formatBRL(manualRevenue)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span>(-) Imposto Estimado (Simples 6%)</span>
              <span>-{formatBRL(taxesSimples)}</span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span>(-) Intermediação Gateway (Pix 0,99%)</span>
              <span>-{formatBRL(mpFee)}</span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span>(-) Custo da Peça (CPV Têxtil 35%)</span>
              <span>-{formatBRL(cpvEstimated)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-y border-zinc-200 font-bold bg-zinc-50 px-2 rounded">
              <span className="text-zinc-900">2. Margem de Contribuição Bruta</span>
              <span className="text-emerald-700">{formatBRL(contributionMargin)}</span>
            </div>

            <div className="flex justify-between items-center py-1 text-rose-600">
              <span>(-) Despesas Manuais / OpEx Lançado</span>
              <span>-{formatBRL(manualExpenses)}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-t-2 border-zinc-900 font-bold text-sm bg-zinc-900 text-white px-3 rounded">
              <span className="uppercase tracking-wider text-xs">3. Lucro Líquido Operacional</span>
              <span className="font-mono text-emerald-400">{formatBRL(netOperatingProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE LANÇAMENTOS DO LIVRO-CAIXA */}
      <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Histórico de Lançamentos Manuais</h2>
          <span className="text-[10px] font-mono text-zinc-400">{manualEntries.length} registro(s)</span>
        </div>

        {manualEntries.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-400">
            Nenhuma partida manual lançada ainda.
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {manualEntries.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded border border-zinc-100 bg-zinc-50 hover:bg-zinc-100/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === 'entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.type === 'entrada' ? '+' : '-'} {item.category}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-800 block font-sans">{item.description}</span>
                    <span className="text-[10px] text-zinc-400">{item.date.split('-').reverse().join('/')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold font-mono ${
                      item.type === 'entrada' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.type === 'entrada' ? '+' : '-'} {formatBRL(item.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(item.id)}
                    className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                    title="Excluir lançamento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}