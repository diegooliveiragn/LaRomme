'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  total_spent: number;
  order_count: number;
  last_order_date?: string;
  segment: 'PATRONO_VIP' | 'PROMISSOR' | 'EM_RISCO' | 'NOVO' | 'CHURN';
  pending_order_id?: string;
  pending_order_short_id?: string;
}

export default function CortexCrmPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCrmData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      const orders = ordersData || [];
      const customerMap: Record<string, CustomerProfile> = {};

      orders.forEach((ord: any) => {
        const email = (ord.customer_email || 'anonimo@laromme.com.br').toLowerCase().trim();
        const name = ord.customer_name || 'Patrono Anônimo';
        const amount = Number(ord.total_amount || ord.subtotal || 0);
        const orderDate = ord.created_at;
        const isPaid = ord.status === 'paid' || ord.status === 'shipped' || ord.status === 'delivered';
        const isPending = ord.status === 'pending';

        if (!customerMap[email]) {
          customerMap[email] = {
            id: ord.id,
            email,
            full_name: name,
            phone: ord.customer_phone || '',
            total_spent: 0,
            order_count: 0,
            last_order_date: isPaid ? orderDate : undefined,
            segment: 'NOVO',
          };
        }

        if (isPaid) {
          customerMap[email].total_spent += amount;
          customerMap[email].order_count += 1;
          if (!customerMap[email].last_order_date || new Date(orderDate) > new Date(customerMap[email].last_order_date!)) {
            customerMap[email].last_order_date = orderDate;
          }
        }

        if (isPending && !customerMap[email].pending_order_id) {
          customerMap[email].pending_order_id = ord.id;
          customerMap[email].pending_order_short_id = ord.short_id || ord.id;
        }
      });

      const now = new Date();
      const profiles: CustomerProfile[] = Object.values(customerMap).map((cust) => {
        const lastDate = cust.last_order_date ? new Date(cust.last_order_date) : now;
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        let segment: CustomerProfile['segment'] = 'NOVO';

        if (cust.total_spent >= 1000 || cust.order_count >= 3) {
          segment = 'PATRONO_VIP';
        } else if (cust.order_count >= 2) {
          segment = 'PROMISSOR';
        } else if (cust.order_count > 0 && diffDays > 60) {
          segment = 'EM_RISCO';
        } else if (cust.order_count > 0 && diffDays > 120) {
          segment = 'CHURN';
        }

        return { ...cust, segment };
      });

      setCustomers(profiles);
    } catch (err) {
      console.error('Erro ao processar dados de CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  const handleTriggerRecoverySingle = async (orderId: string, email: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActionStatus(`Enviando recuperação para ${email}...`);

    try {
      const res = await fetch('/api/crm/recuperacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Recuperação enviada com sucesso para ${email}.`);
      } else {
        setActionStatus(`Falha: ${data.error || 'Não foi possível disparar.'}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  const handleTriggerRecoveryBatch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActionStatus('Processando recuperação em lote (pedidos > 45min)...');

    try {
      const res = await fetch('/api/crm/recuperacao', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Concluído: ${data.processed ?? data.sent ?? 0} comunicações processadas.`);
      } else {
        setActionStatus(`Erro: ${data.error}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  const handleTriggerBirthday = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActionStatus('Checando aniversariantes do dia no fuso de Brasília...');

    try {
      const res = await fetch('/api/crm/aniversario', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Concluído: ${data.processados ?? 0} comunicações enviadas hoje (${data.dataReferencia || ''}).`);
      } else {
        setActionStatus(`Erro: ${data.error}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (segmentFilter === 'ALL') return true;
    return c.segment === segmentFilter;
  });

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'PATRONO_VIP':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">Patrono VIP</span>;
      case 'PROMISSOR':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Promissor</span>;
      case 'EM_RISCO':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30">Em Risco (&gt;60d)</span>;
      case 'CHURN':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">Inativo</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30">Novo Patrono</span>;
    }
  };

  const handleOpenWhatsApp = (cust: CustomerProfile) => {
    if (!cust.phone) {
      alert('Nenhum número de telefone registrado para este patrono.');
      return;
    }

    const cleanPhone = cust.phone.replace(/\D/g, '');
    let text = `Olá, ${cust.full_name.split(' ')[0]}. Aqui é da equipe LaRomme.`;

    if (cust.segment === 'PATRONO_VIP') {
      text += ' Gostaríamos de manifestar nossa deferência à sua permanência na LaRomme e apresentar com prioridade as novas adições ao acervo.';
    } else if (cust.segment === 'EM_RISCO') {
      text += ' Notamos um intervalo desde a sua última seleção no acervo. Caso deseje suporte para sua próxima reserva, estamos à disposição.';
    } else {
      text += ' Entramos em contato para verificar a conformidade do seu pedido recente e prestar o suporte necessário.';
    }

    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const totalBase = customers.length;
  const vipCount = customers.filter((c) => c.segment === 'PATRONO_VIP').length;
  const riskCount = customers.filter((c) => c.segment === 'EM_RISCO').length;
  const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
  const avgLtv = totalBase > 0 ? totalRevenue / totalBase : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Módulo Administrativo • CRM
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            Patronos & Gestão de Relacionamento
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleTriggerRecoveryBatch}
            disabled={isProcessing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Recuperar Lote (45m+)
          </button>

          <button
            onClick={handleTriggerBirthday}
            disabled={isProcessing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Concierge Aniversário
          </button>

          <button
            onClick={fetchCrmData}
            disabled={isProcessing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Recalcular Base
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS BAR */}
      {actionStatus && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-100 flex items-center justify-between">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* KPIS DE ALTO IMPACTO VISUAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold block">
            Base de Clientes
          </span>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight mt-2 block">
            {totalBase}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">
            Cadastros consolidados
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-amber-500/10 border-amber-500/30 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold block">
            Patronos VIP
          </span>
          <span className="text-3xl font-black text-amber-400 tabular-nums tracking-tight mt-2 block">
            {vipCount}
          </span>
          <span className="text-[11px] font-bold text-amber-300/80 mt-1 block tabular-nums">
            {totalBase > 0 ? ((vipCount / totalBase) * 100).toFixed(1).replace('.', ',') : '0,0'}% da base ativa
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-rose-500/10 border-rose-500/30 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-rose-300 font-bold block">
            Em Risco / Retenção
          </span>
          <span className="text-3xl font-black text-rose-400 tabular-nums tracking-tight mt-2 block">
            {riskCount}
          </span>
          <span className="text-[11px] font-bold text-rose-300/80 mt-1 block tabular-nums">
            {totalBase > 0 ? ((riskCount / totalBase) * 100).toFixed(1).replace('.', ',') : '0,0'}% em inatividade (&gt;60d)
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold block">
            LTV Médio por Patrono
          </span>
          <span className="text-3xl font-black text-emerald-400 tabular-nums tracking-tight mt-2 block font-mono">
            R$ {avgLtv.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block tabular-nums">
            Receita total: R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* FILTROS POR SEGMENTO */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-bold shrink-0 uppercase tracking-wider mr-1">
          Segmento:
        </span>
        {['ALL', 'PATRONO_VIP', 'PROMISSOR', 'EM_RISCO', 'CHURN', 'NOVO'].map((seg) => (
          <button
            key={seg}
            onClick={() => setSegmentFilter(seg)}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
              segmentFilter === seg
                ? 'bg-slate-100 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            {seg === 'ALL' ? 'Todos' : seg === 'PATRONO_VIP' ? 'VIPs' : seg === 'PROMISSOR' ? 'Promissores' : seg === 'EM_RISCO' ? 'Em Risco' : seg === 'CHURN' ? 'Inativos' : 'Novos'}
          </button>
        ))}
      </div>

      {/* TABELA DE PATRONOS */}
      <div className="rounded-xl border bg-slate-950/60 border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-400">
            Computando matriz relacional e métricas financeiras...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-400">
            Nenhum patrono encontrado neste segmento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-4">Patrono / Contato</th>
                  <th className="py-4 px-4">Segmentação</th>
                  <th className="py-4 px-4 text-center">Pedidos</th>
                  <th className="py-4 px-4 text-right">LTV Acumulado</th>
                  <th className="py-4 px-4 text-center">Última Aquisição</th>
                  <th className="py-4 px-4 text-right">Ações de Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-white">{cust.full_name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{cust.email}</div>
                    </td>
                    <td className="py-4 px-4">{getSegmentBadge(cust.segment)}</td>
                    <td className="py-4 px-4 text-center font-black text-sm text-white tabular-nums">
                      {cust.order_count}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-emerald-400 tabular-nums">
                      R$ {cust.total_spent.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-slate-300 font-medium text-xs">
                      {cust.last_order_date ? new Date(cust.last_order_date).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cust.pending_order_id && (
                          <button
                            onClick={() => handleTriggerRecoverySingle(cust.pending_order_id!, cust.email)}
                            disabled={isProcessing}
                            title="Disparar e-mail de recuperação de reserva"
                            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            Recuperar
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenWhatsApp(cust)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded text-[11px] font-bold transition-all flex items-center space-x-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}