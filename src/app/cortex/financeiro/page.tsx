'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FinancialTransaction {
  id: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  due_date?: string;
  payment_date?: string;
  status: string;
  description?: string;
  created_at: string;
}

interface Order {
  id: string;
  subtotal?: number;
  total_amount?: number;
  cogs_total?: number;
  gateway_fee?: number;
  status: string;
  created_at: string;
}

export default function CortexFinanceiroPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'DRE' | 'TRANSACOES'>('DRE');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [typeInput, setTypeInput] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [categoryInput, setCategoryInput] = useState('TRAFEGO_PAGO');
  const [amountInput, setAmountInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const { data: txData, error: txErr } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!txErr && txData) {
        setTransactions(txData as FinancialTransaction[]);
      }

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid');

      if (!orderErr && orderData) {
        setOrders(orderData as Order[]);
      }
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || isNaN(Number(amountInput))) return;

    setSaving(true);
    try {
      const numAmount = parseFloat(amountInput);
      const newTx = {
        transaction_type: typeInput,
        category: categoryInput,
        amount: numAmount,
        description: descriptionInput,
        status: 'LIQUIDATED',
        payment_date: new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([newTx])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setTransactions((prev) => [data[0] as FinancialTransaction, ...prev]);
      }

      setShowModal(false);
      setAmountInput('');
      setDescriptionInput('');
      alert('Lançamento registrado e DRE recalculado!');
    } catch (err) {
      alert('Falha ao registrar transação no banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  // CÁLCULOS AUTOMÁTICOS DO DRE
  const grossRevenue = orders.reduce((sum, o) => sum + (o.total_amount || o.subtotal || 0), 0);
  const totalCogs = orders.reduce((sum, o) => sum + (o.cogs_total || 0), 0);
  const totalGatewayFees = orders.reduce((sum, o) => sum + (o.gateway_fee || 0), 0);
  
  // Impostos Estimados (Ex: 6% Simples Nacional)
  const estimatedTaxes = grossRevenue * 0.06;
  const netRevenue = grossRevenue - estimatedTaxes - totalGatewayFees;
  const grossProfit = netRevenue - totalCogs;

  const totalOperatingExpenses = transactions
    .filter((t) => t.transaction_type === 'EXPENSE' && t.status === 'LIQUIDATED')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const ebitda = grossProfit - totalOperatingExpenses;
  const netProfit = ebitda; // Simplificado antes de amortização/IR

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Tesouraria & DRE Contábil</h1>
          <p className="text-xs text-slate-400 mt-1">Demonstração do Resultado do Exercício e Gestão do Fluxo de Caixa</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            + Novo Lançamento
          </button>
          <button
            onClick={fetchFinancialData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Sincronizar
          </button>
        </div>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex border-b border-slate-800/60 bg-slate-900/40 rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('DRE')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'DRE'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Estrutura DRE (DRE Sintético)
        </button>
        <button
          onClick={() => setActiveTab('TRANSACOES')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'TRANSACOES'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Livro Razão & Lançamentos ({transactions.length})
        </button>
      </div>

      {/* ABA 1: ESTRUTURA CONTÁBIL DRE */}
      {activeTab === 'DRE' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 shadow-sm max-w-4xl space-y-4">
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/60 pb-3">
              Demonstração de Resultado Consolidada
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Calculando indicadores financeiros...</div>
            ) : (
              <div className="divide-y divide-slate-800/40 text-xs font-mono">
                {/* RECEITA BRUTA */}
                <div className="py-3 flex justify-between items-center">
                  <span className="text-slate-300 font-bold font-sans">1. RECEITA BRUTA DE VENDAS</span>
                  <span className="text-slate-100 font-bold text-sm">R$ {grossRevenue.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* DEDUÇÕES */}
                <div className="py-2 pl-4 flex justify-between items-center text-slate-400">
                  <span>(-) Impostos Fiscais Estimados (6% Simples)</span>
                  <span className="text-rose-400/80">- R$ {estimatedTaxes.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="py-2 pl-4 flex justify-between items-center text-slate-400">
                  <span>(-) Taxas de Gateway (Mercado Pago)</span>
                  <span className="text-rose-400/80">- R$ {totalGatewayFees.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* RECEITA LÍQUIDA */}
                <div className="py-3 flex justify-between items-center bg-slate-950/40 px-3 rounded font-bold">
                  <span className="text-slate-200 font-sans">(=) RECEITA LÍQUIDA DE VENDAS</span>
                  <span className="text-emerald-400">R$ {netRevenue.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* CPV */}
                <div className="py-2 pl-4 flex justify-between items-center text-slate-400">
                  <span>(-) CPV (Custo de Fabricação dos Produtos Vendidos)</span>
                  <span className="text-rose-400/80">- R$ {totalCogs.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* LUCRO BRUTO */}
                <div className="py-3 flex justify-between items-center bg-slate-950/40 px-3 rounded font-bold">
                  <span className="text-slate-200 font-sans">(=) LUCRO BRUTO OPERACIONAL</span>
                  <span className="text-emerald-400">R$ {grossProfit.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* DESPESAS OPERACIONAIS */}
                <div className="py-2 pl-4 flex justify-between items-center text-slate-400">
                  <span>(-) Despesas Operacionais (Marketing + Software + Fixos)</span>
                  <span className="text-rose-400/80">- R$ {totalOperatingExpenses.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* EBITDA / LUCRO LÍQUIDO */}
                <div className="py-4 flex justify-between items-center bg-amber-500/10 border border-amber-500/20 px-4 rounded-lg font-bold text-sm">
                  <span className="text-amber-400 font-sans uppercase tracking-wider">(=) LUCRO LÍQUIDO REAL (EBITDA)</span>
                  <span className={ebitda >= 0 ? 'text-emerald-400 font-serif text-base' : 'text-rose-400 font-serif text-base'}>
                    R$ {ebitda.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: LIVRO RAZÃO & LANÇAMENTOS */}
      {activeTab === 'TRANSACOES' && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Histórico de Despesas e Entradas</h2>
              <span className="text-[10px] text-slate-500 font-mono">Status: Liquidado</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Lendo histórico financeiro...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">Nenhuma transação manual cadastrada. Clique em "+ Novo Lançamento".</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Descrição</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">{tx.payment_date || new Date(tx.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.transaction_type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {tx.transaction_type === 'INCOME' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{tx.category}</td>
                        <td className="py-3 px-4 text-slate-300">{tx.description || '-'}</td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${
                          tx.transaction_type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {tx.transaction_type === 'EXPENSE' ? '-' : '+'} R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE NOVO LANÇAMENTO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="font-serif text-lg font-bold">Novo Lançamento Financeiro</h2>
              <button onClick={() => setShowModal(false)} className="text-xs text-slate-500 hover:text-slate-200">
                [ Fechar ]
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Tipo de Movimentação</label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value as 'INCOME' | 'EXPENSE')}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="EXPENSE">Saída / Despesa Operacional</option>
                  <option value="INCOME">Entrada / Outras Receitas</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Categoria Contábil</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="TRAFEGO_PAGO">Tráfego Pago (Meta/Google Ads)</option>
                  <option value="SOFTWARE_VERCEL">Softwares & Infraestrutura</option>
                  <option value="FORNECEDOR_PRODUCAO">Insumos & Tecidos</option>
                  <option value="EMBALAGENS">Embalagens & Papelaria</option>
                  <option value="PRO_LABORE">Pro-labore & Pessoal</option>
                  <option value="SINISTRO_AVARIA">Perdas & Avarias</option>
                  <option value="OUTROS">Outras Despesas</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Valor Financeiro (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Anúncios Campanha Drop Outubro"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded text-xs uppercase tracking-widest transition-colors mt-4"
              >
                {saving ? 'Gravando...' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}