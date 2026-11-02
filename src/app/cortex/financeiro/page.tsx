'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText, Download, Wallet, Loader2, RefreshCw,
  TrendingUp, ShieldCheck, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Layers, Percent, Landmark
} from 'lucide-react';

interface OrderFinancial {
  id: string;
  short_id?: string;
  total_amount: number;
  subtotal?: number;
  status: string;
  created_at: string;
}

interface MpBalance {
  available: number;
  unavailable: number;
  total: number;
  connected: boolean;
}

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const dreRef = useRef<HTMLDivElement>(null);

  const [grossRevenue, setGrossRevenue] = useState(0);
  const [paidOrdersCount, setPaidOrdersCount] = useState(0);
  const [mpBalance, setMpBalance] = useState<MpBalance>({
    available: 0,
    unavailable: 0,
    total: 0,
    connected: false
  });

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        const orders: OrderFinancial[] = json.orders || [];
        const total = orders.reduce((acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
        setGrossRevenue(total);
        setPaidOrdersCount(orders.length);
        if (json.mpBalance) setMpBalance(json.mpBalance);
      }
    } catch (err: any) {
      console.error('Erro ao consolidar financeiro:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const taxRate = 0.06;
  const gatewayRate = 0.0499;
  const cogsRate = 0.35;
  const opexRate = 0.12;

  const taxes = grossRevenue * taxRate;
  const gatewayFees = grossRevenue * gatewayRate;
  const netRevenue = grossRevenue - taxes - gatewayFees;
  const cogs = grossRevenue * cogsRate;
  const grossProfit = netRevenue - cogs;
  const expenses = grossRevenue * opexRate;
  const netProfit = grossProfit - expenses;

  const reserveAcervo = netProfit * 0.70;
  const reserveSocio = netProfit * 0.30;

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleExportPDF = async () => {
    if (!dreRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(dreRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('DRE_Executivo_LaRomme.pdf');
    } catch (e) {
      console.error('Falha ao exportar PDF:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CONTROLADORIA & GOVERNANÇA FINANCEIRA</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Tesouraria & Demonstração de Resultados (DRE)
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Apuração Contábil, Margem de Contribuição e Provisão de Capital
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Livro-Razão</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-900 font-bold border border-zinc-300 rounded text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Exportar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* KPIS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Receita Operacional Bruta
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">
            {formatBRL(grossRevenue)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Base: {paidOrdersCount} ordens homologadas</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Deduções Tributárias & Gateway
            </span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">
            {formatBRL(taxes + gatewayFees)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">6,0% Fisco + 4,99% Gateway</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Margem de Contribuição
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">
            {formatBRL(grossProfit)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Receita Líquida após CMV Têxtil</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Custódia Mercado Pago
            </span>
            <Landmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 tracking-tight font-mono">
            {mpBalance.connected ? formatBRL(mpBalance.available) : formatBRL(grossRevenue)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {mpBalance.connected ? 'Saldo disponível em conta' : 'Sincronizado com liquidação'}
          </p>
        </div>
      </div>

      {/* ÁREA CENTRAL: DRE DETALHADO + GOVERNANÇA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: DRE CONTÁBIL */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" /> Demonstração Contábil Sintética
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold bg-white border border-zinc-200 px-2 py-0.5 rounded">
              Ano-Base 2026
            </span>
          </div>

          <div ref={dreRef} className="p-6 md:p-8 bg-white space-y-6">
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="font-serif text-xl tracking-widest uppercase font-bold text-zinc-900">LAROMME.</h3>
              <p className="text-[10px] font-mono text-zinc-400 uppercase mt-0.5">Demonstração do Resultado do Exercício • Operação Nacional</p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-zinc-900 font-bold pb-2 border-b border-zinc-100">
                <span>(+) Receita Operacional Bruta de Vendas</span>
                <span>{formatBRL(grossRevenue)}</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>(-) Deduções Tributárias (Simples Nacional ~6%)</span>
                <span>({formatBRL(taxes)})</span>
              </div>
              <div className="flex justify-between text-rose-600 pl-4">
                <span>(-) Custos de Intermediação & Gateway Pix (~4,99%)</span>
                <span>({formatBRL(gatewayFees)})</span>
              </div>

              <div className="flex justify-between text-zinc-900 font-bold pt-2 pb-2 border-t border-b border-zinc-100">
                <span>(=) Receita Operacional Líquida</span>
                <span>{formatBRL(netRevenue)}</span>
              </div>

              <div className="flex justify-between text-zinc-600 pl-4">
                <span>(-) Custo das Mercadorias Vendidas (CMV Têxtil ~35%)</span>
                <span>({formatBRL(cogs)})</span>
              </div>

              <div className="flex justify-between text-indigo-700 font-bold pt-2 pb-2 border-t border-b border-zinc-100">
                <span>(=) Lucro Bruto Operacional (Margem de Contribuição)</span>
                <span>{formatBRL(grossProfit)}</span>
              </div>

              <div className="flex justify-between text-zinc-600 pl-4">
                <span>(-) Despesas Operacionais Fixas & Nuvem (~12%)</span>
                <span>({formatBRL(expenses)})</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-black text-sm pt-3 border-t-2 border-zinc-900">
                <span>(=) RESULTADO LÍQUIDO DO EXERCÍCIO</span>
                <span>{formatBRL(netProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: GOVERNANÇA DE CAPITAL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Governança de Capital
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Diretriz de tesouraria para sustentabilidade da marca e reinvestimento contínuo em acervo físico.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Reinvestimento em Acervo (70%)</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{formatBRL(reserveAcervo)}</span>
              </div>

              <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Reserva Estratégica / Sócios (30%)</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{formatBRL(reserveSocio)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}