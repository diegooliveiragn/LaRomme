'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText, Download, Wallet, Loader2, RefreshCw,
  TrendingUp, ShieldCheck, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Layers, Percent
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const dreRef = useRef<HTMLDivElement>(null);

  // Estados Financeiros Derivados do Banco
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [paidOrdersCount, setPaidOrdersCount] = useState(0);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('id, total_amount, subtotal, status, created_at')
        .in('status', ['paid', 'shipped', 'delivered']);

      if (error) throw error;

      const paidOrders = ordersData || [];
      const totalGross = paidOrders.reduce((acc, curr) => {
        return acc + Number(curr.total_amount || curr.subtotal || 0);
      }, 0);

      setGrossRevenue(totalGross);
      setPaidOrdersCount(paidOrders.length);
    } catch (err: any) {
      console.error('Erro ao consolidar livro-razão financeiro:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Parâmetros Contábeis da Maison LaRomme
  const taxRate = 0.06; // Simples Nacional (6%)
  const gatewayRate = 0.0499; // Mercado Pago Pix / Checkout (4.99%)
  const cogsRate = 0.35; // Custo de Confecção & Insumos (~35% da Ficha Técnica de Supply)
  const opexRate = 0.12; // Operação, Embalagens de Envio e Nuvem (~12%)

  // Deduções e Subtotais do DRE
  const taxes = grossRevenue * taxRate;
  const gatewayFees = grossRevenue * gatewayRate;
  const netRevenue = grossRevenue - taxes - gatewayFees;
  const cogs = grossRevenue * cogsRate;
  const grossProfit = netRevenue - cogs;
  const expenses = grossRevenue * opexRate;
  const netProfit = Math.max(0, grossProfit - expenses);

  // Governança de Capital
  const proLaboreReserve = netProfit * 0.30; // 30% Pró-labore
  const reinvestmentReserve = netProfit * 0.70; // 70% Reinvestimento em Lotes e Tração

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleExportPDF = async () => {
    if (!dreRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(dreRef.current, {
        scale: 2,
        backgroundColor: '#090d16',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('DRE_Executivo_LaRomme_2026.pdf');
    } catch (error) {
      console.error('Falha ao exportar PDF contábil:', error);
      alert('Não foi possível gerar o PDF. Verifique os componentes do relatório.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Controladoria & Governança Financeira
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            Tesouraria & Demonstração de Resultados (DRE)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Apuração Contábil, Margem de Contribuição e Provisão de Capital
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFinancialData}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Livro-Razão</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting || loading}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Exportar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* KPIS DE CONTROLADORIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Receita Operacional Bruta
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block font-mono">
            {formatBRL(grossRevenue)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block tabular-nums">
            Base: {paidOrdersCount} pedidos liquidados
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Deduções Tributárias & Gateway
            </span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400 tabular-nums tracking-tight block font-mono">
            {formatBRL(taxes + gatewayFees)}
          </span>
          <span className="text-[11px] font-bold text-slate-400 mt-2 block tabular-nums">
            6,0% Fisco + 4,99% Gateway Pix
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Margem de Contribuição
            </span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block font-mono">
            {formatBRL(grossProfit)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block tabular-nums">
            Receita Líquida após CMV Têxtil
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Lucro Líquido Real
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 tabular-nums tracking-tight block font-mono">
            {formatBRL(netProfit)}
          </span>
          <span className="text-[11px] font-bold text-emerald-300/80 mt-2 block tabular-nums">
            Resultado contábil disponível
          </span>
        </div>

      </div>

      {loading ? (
        <div className="p-16 text-center text-xs font-mono font-bold text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          Consolidando livro-razão contábil do Supabase...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* COLUNA ESQUERDA: DRE CONTÁBIL (Área capturada para o PDF) */}
          <div className="lg:col-span-8 bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Demonstração Contábil Sintética
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                Ano-Base 2026
              </span>
            </div>

            <div ref={dreRef} className="p-6 md:p-8 bg-[#090d16] text-white flex-1 space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-serif text-2xl tracking-[0.15em] uppercase font-bold text-white">
                  LaRomme.
                </h3>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                  Demonstração do Resultado do Exercício • Operação Nacional
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                
                {/* (+) Receita Bruta */}
                <div className="flex justify-between py-2 border-b border-slate-800 font-bold text-white">
                  <span>(+) Receita Operacional Bruta de Vendas</span>
                  <span className="text-sm font-black tabular-nums">{formatBRL(grossRevenue)}</span>
                </div>

                {/* (-) Deduções */}
                <div className="flex justify-between py-1.5 text-rose-400 pl-4">
                  <span>(-) Impostos Fiscais (Simples Nacional - 6,00%)</span>
                  <span className="tabular-nums">- {formatBRL(taxes)}</span>
                </div>

                <div className="flex justify-between py-1.5 text-rose-400 pl-4 border-b border-slate-800/60 pb-2">
                  <span>(-) Taxas de Intermediação (Mercado Pago Pix - 4,99%)</span>
                  <span className="tabular-nums">- {formatBRL(gatewayFees)}</span>
                </div>

                {/* (=) Receita Líquida */}
                <div className="flex justify-between py-2.5 font-bold bg-slate-900/80 border border-slate-800 px-3 rounded text-slate-200">
                  <span className="uppercase tracking-wider">(=) Receita Líquida de Vendas</span>
                  <span className="text-sm font-black text-white tabular-nums">{formatBRL(netRevenue)}</span>
                </div>

                {/* (-) Custo das Mercadorias */}
                <div className="flex justify-between py-2 text-amber-300 pl-4 border-b border-slate-800/60 pb-2">
                  <span>(-) Custo das Mercadorias Vendidas (CMV Ficha Técnica ~35%)</span>
                  <span className="tabular-nums">- {formatBRL(cogs)}</span>
                </div>

                {/* (=) Lucro Bruto */}
                <div className="flex justify-between py-2.5 font-bold bg-slate-900/80 border border-slate-800 px-3 rounded text-slate-200">
                  <span className="uppercase tracking-wider">(=) Lucro Bruto Operacional (Margem de Contribuição)</span>
                  <span className="text-sm font-black text-amber-300 tabular-nums">{formatBRL(grossProfit)}</span>
                </div>

                {/* (-) Despesas Operacionais */}
                <div className="flex justify-between py-2 text-rose-400 pl-4 border-b border-slate-800/60 pb-2">
                  <span>(-) Despesas Operacionais, Fretes Subsidiados & Nuvem (~12%)</span>
                  <span className="tabular-nums">- {formatBRL(expenses)}</span>
                </div>

                {/* (=) Lucro Líquido Real */}
                <div className="flex justify-between py-3.5 mt-4 border border-emerald-500/40 font-bold bg-emerald-500/10 text-white px-4 rounded-lg text-sm">
                  <span className="font-sans uppercase tracking-widest text-emerald-300">(=) Lucro Líquido Real Apurado</span>
                  <span className="font-black text-emerald-400 text-base tabular-nums">{formatBRL(netProfit)}</span>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">
                Documento de Auditoria e Fechamento Executivo • LaRomme Operating System
              </div>

            </div>
          </div>

          {/* COLUNA DIREITA: GOVERNANÇA DE CAPITAL & PROVISÕES */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" /> Governança de Capital
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Diretriz de tesouraria para sustentabilidade da marca e reinvestimento contínuo em acervo físico.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                      Reinvestimento em Acervo (70%)
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums block font-mono">
                    {formatBRL(reinvestmentReserve)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Destinado à compra de tecidos nobres, confecção e tração.
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                      Provisão de Pró-labore (30%)
                    </span>
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-amber-300 tabular-nums block font-mono">
                    {formatBRL(proLaboreReserve)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Remuneração dos sócios fundadores após liquidação tributária.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm p-6 space-y-3">
              <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-slate-400" /> Parâmetros de Eficiência
              </h3>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Regime Tributário:</span>
                  <span className="font-bold text-white">Simples Nacional (6%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Taxa Gateway (Pix):</span>
                  <span className="font-bold text-white">4,99%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Teto CMV Recomendado:</span>
                  <span className="font-bold text-emerald-400">35,0%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Margem Líquida Alvo:</span>
                  <span className="font-bold text-emerald-400">&gt; 35,0%</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}