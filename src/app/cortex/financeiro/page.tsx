'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileText, Download, DollarSign, TrendingUp, Wallet, 
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const dreRef = useRef<HTMLDivElement>(null);
  
  // Valores da DRE
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [gatewayFees, setGatewayFees] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [expenses, setExpenses] = useState(0);
  
  useEffect(() => {
    // Simulação temporária até a conexão total com supabase
    setTimeout(() => {
      setGrossRevenue(18450.00);
      setTaxes(1107.00); // 6%
      setGatewayFees(920.65); // 4.99%
      setCogs(6450.00); // Custos
      setExpenses(1800.00); // Tráfego, Software, etc
      setLoading(false);
    }, 1000);
  }, []);

  const netRevenue = grossRevenue - taxes - gatewayFees;
  const grossProfit = netRevenue - cogs;
  const netProfit = grossProfit - expenses;
  const proLaboreReserve = netProfit * 0.30; // Sugestão: 30% do lucro líquido

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleExportPDF = async () => {
    if (!dreRef.current) return;
    
    const canvas = await html2canvas(dreRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('DRE_Executivo_LaRomme.pdf');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-2">
            <Wallet className="w-6 h-6 text-zinc-900" /> Tesouraria & DRE
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Demonstração de Resultados e Reserva de Capital</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" /> Exportar PDF
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest">Sincronizando livro razão...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUNA ESQUERDA: DRE CONTÁBIL (Módulo PDF) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                DRE Sintético (Visão Mensal)
              </h2>
            </div>
            
            {/* AREA CAPTURADA PELO PDF */}
            <div ref={dreRef} className="p-6 md:p-8 bg-white">
              <div className="mb-8 border-b border-zinc-900 pb-4">
                <h3 className="font-serif text-xl tracking-widest uppercase font-bold text-zinc-900">LaRomme.</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Demonstração do Resultado do Exercício - 2026</p>
              </div>

              <div className="space-y-1 text-sm font-mono text-zinc-700">
                <div className="flex justify-between py-2 border-b border-zinc-100 font-bold text-zinc-900">
                  <span>(+) Receita Bruta de Vendas</span>
                  <span>{formatBRL(grossRevenue)}</span>
                </div>
                
                <div className="flex justify-between py-2 text-rose-600 pl-4">
                  <span>(-) Impostos Fiscais (Simples Nacional)</span>
                  <span>- {formatBRL(taxes)}</span>
                </div>
                <div className="flex justify-between py-2 text-rose-600 pl-4 border-b border-zinc-100">
                  <span>(-) Taxas de Gateway & Pix</span>
                  <span>- {formatBRL(gatewayFees)}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-zinc-100 font-bold bg-zinc-50 px-2 rounded">
                  <span>(=) Receita Líquida</span>
                  <span className="text-emerald-700">{formatBRL(netRevenue)}</span>
                </div>

                <div className="flex justify-between py-2 text-rose-600 pl-4 border-b border-zinc-100">
                  <span>(-) CPV (Custo do Produto Vendido)</span>
                  <span>- {formatBRL(cogs)}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-zinc-100 font-bold bg-zinc-50 px-2 rounded">
                  <span>(=) Lucro Bruto Operacional</span>
                  <span className="text-emerald-700">{formatBRL(grossProfit)}</span>
                </div>

                <div className="flex justify-between py-2 text-rose-600 pl-4 border-b border-zinc-100">
                  <span>(-) Despesas Operacionais (Marketing, Fixo, Outros)</span>
                  <span>- {formatBRL(expenses)}</span>
                </div>

                <div className="flex justify-between py-4 mt-4 border border-zinc-900 font-bold bg-zinc-900 text-white px-4 rounded text-base">
                  <span className="font-sans uppercase tracking-widest">(=) Lucro Líquido Real</span>
                  <span>{formatBRL(netProfit)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: GESTÃO DO PRÓ-LABORE */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
              <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase mb-6 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Reserva de Fundador (Pró-Labore)
              </h2>
              <div className="text-center bg-emerald-50 border border-emerald-100 rounded-lg p-6">
                <span className="block text-[10px] font-mono text-emerald-800 uppercase tracking-widest mb-2">
                  Saldo Disponível (Base 30%)
                </span>
                <span className="text-4xl font-bold tracking-tighter text-emerald-700 block">
                  {formatBRL(proLaboreReserve)}
                </span>
                <button className="mt-6 w-full text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white py-2 rounded hover:bg-emerald-800 transition-colors">
                  Registrar Retirada
                </button>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 mt-4 leading-relaxed text-center">
                A diretriz executiva sugere reter 70% do lucro líquido para reinvestimento em estoque e marketing.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
              <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase mb-4">Saúde do Caixa</h2>
              <div className="space-y-4">
                 <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                   <span className="text-[11px] font-mono text-zinc-500 uppercase">Margem Líquida</span>
                   <span className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                     {((netProfit / grossRevenue) * 100).toFixed(1)}%
                     <TrendingUp className="w-3 h-3 text-emerald-500" />
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-mono text-zinc-500 uppercase">Gasto com Ads (ROAS Base)</span>
                   <span className="text-sm font-bold text-rose-600 flex items-center gap-1">
                     R$ 800,00
                     <ArrowDownRight className="w-3 h-3 text-rose-500" />
                   </span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}