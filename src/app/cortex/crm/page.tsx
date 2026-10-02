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
  notes?: string;
}

export default function CortexCrmPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const fetchCrmData = async () => {
    setLoading(true);
    try {
      // 1. Busca lista de clientes cadastrados
      const { data: custData } = await supabase.from('customers').select('*');
      
      // 2. Busca todos os pedidos pagos para agregar LTV e Recência em tempo real
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid');

      const orders = ordersData || [];
      const customerMap: Record<string, CustomerProfile> = {};

      // Agregação de Pedidos por E-mail
      orders.forEach((ord) => {
        const email = ord.customer_email || 'anonimo@laromme.com.br';
        const name = ord.customer_name || 'Patrono Anônimo';
        const amount = Number(ord.total_amount || ord.subtotal || 0);
        const orderDate = ord.created_at;

        if (!customerMap[email]) {
          customerMap[email] = {
            id: ord.id,
            email,
            full_name: name,
            phone: ord.customer_phone || '',
            total_spent: 0,
            order_count: 0,
            last_order_date: orderDate,
            segment: 'NOVO',
          };
        }

        customerMap[email].total_spent += amount;
        customerMap[email].order_count += 1;

        if (new Date(orderDate) > new Date(customerMap[email].last_order_date || '2000-01-01')) {
          customerMap[email].last_order_date = orderDate;
        }
      });

      // Cálculo de Segmentação RFM
      const now = new Date();
      const profiles: CustomerProfile[] = Object.values(customerMap).map((cust) => {
        const lastDate = cust.last_order_date ? new Date(cust.last_order_date) : now;
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        let segment: CustomerProfile['segment'] = 'NOVO';

        if (cust.total_spent > 1000 || cust.order_count >= 3) {
          segment = 'PATRONO_VIP';
        } else if (cust.order_count >= 2) {
          segment = 'PROMISSOR';
        } else if (diffDays > 60) {
          segment = 'EM_RISCO';
        } else if (diffDays > 120) {
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

  const filteredCustomers = customers.filter((c) => {
    if (segmentFilter === 'ALL') return true;
    return c.segment === segmentFilter;
  });

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'PATRONO_VIP':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Patrono VIP</span>;
      case 'PROMISSOR':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Promissor</span>;
      case 'EM_RISCO':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Em Risco (&gt;60 dias)</span>;
      case 'CHURN':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Inativo / Churn</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">Novo Patrono</span>;
    }
  };

  const handleOpenWhatsApp = (cust: CustomerProfile) => {
    if (!cust.phone) {
      alert('Nenhum número de telefone/WhatsApp cadastrado para este patrono.');
      return;
    }

    const cleanPhone = cust.phone.replace(/\D/g, '');
    let text = `Olá, ${cust.full_name.split(' ')[0]}! Aqui é o fundador da LaRomme.`;

    if (cust.segment === 'PATRONO_VIP') {
      text += ` Gostaria de agradecer pela sua lealdade à Maison e apresentar em primeira mão o nosso novo acervo reservado.`;
    } else if (cust.segment === 'EM_RISCO') {
      text += ` Notei que faz um tempo desde sua última aquisição no acervo. Preparamos uma atenciosidade exclusiva para o seu próximo pedido.`;
    } else {
      text += ` Passando para confirmar se deu tudo certo com o seu pedido recente e se precisa de algum auxílio no suporte da Maison.`;
    }

    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Patronos & Gestão de CRM</h1>
          <p className="text-xs text-slate-400 mt-1">Matriz RFM, Cálculo de Lifetime Value (LTV) & Concierge Direct</p>
        </div>

        <button
          onClick={fetchCrmData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
        >
          Recalcular Matriz RFM
        </button>
      </div>

      {/* KPIS DE CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Base de Clientes</span>
          <span className="text-2xl font-bold text-slate-100 mt-2 block">{customers.length}</span>
        </div>
        <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
          <span className="text-[10px] uppercase font-mono text-amber-400 block">Patronos VIP</span>
          <span className="text-2xl font-bold text-amber-400 mt-2 block">
            {customers.filter((c) => c.segment === 'PATRONO_VIP').length}
          </span>
        </div>
        <div className="p-4 rounded-xl border bg-rose-500/5 border-rose-500/20">
          <span className="text-[10px] uppercase font-mono text-rose-400 block">Em Risco / Retenção</span>
          <span className="text-2xl font-bold text-rose-400 mt-2 block">
            {customers.filter((c) => c.segment === 'EM_RISCO').length}
          </span>
        </div>
        <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">LTV Médio por Patrono</span>
          <span className="text-2xl font-bold text-emerald-400 mt-2 block">
            R$ {customers.length > 0 ? (customers.reduce((s, c) => s + c.total_spent, 0) / customers.length).toFixed(2).replace('.', ',') : '0,00'}
          </span>
        </div>
      </div>

      {/* FILTROS POR SEGMENTO */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-medium shrink-0">Segmento RFM:</span>
        {['ALL', 'PATRONO_VIP', 'PROMISSOR', 'EM_RISCO', 'CHURN', 'NOVO'].map((seg) => (
          <button
            key={seg}
            onClick={() => setSegmentFilter(seg)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all shrink-0 ${
              segmentFilter === seg
                ? 'bg-slate-800 text-slate-100 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {seg === 'ALL' ? 'Todos' : seg === 'PATRONO_VIP' ? 'VIPs' : seg === 'PROMISSOR' ? 'Promissores' : seg === 'EM_RISCO' ? 'Em Risco' : seg === 'CHURN' ? 'Inativos' : 'Novos'}
          </button>
        ))}
      </div>

      {/* TABELA DE PATRONOS */}
      <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Computando histórico e matriz de atrito...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">Nenhum patrono encontrado neste segmento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Patrono / E-mail</th>
                  <th className="py-3.5 px-4">Segmento RFM</th>
                  <th className="py-3.5 px-4 text-center">Pedidos</th>
                  <th className="py-3.5 px-4 text-right">LTV Acumulado</th>
                  <th className="py-3.5 px-4 text-center">Última Compra</th>
                  <th className="py-3.5 px-4 text-right">Ação Concierge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredCustomers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{cust.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cust.email}</div>
                    </td>
                    <td className="py-4 px-4">{getSegmentBadge(cust.segment)}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-300">{cust.order_count}</td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                      R$ {cust.total_spent.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {cust.last_order_date ? new Date(cust.last_order_date).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenWhatsApp(cust)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded text-[11px] font-semibold transition-all flex items-center space-x-1.5 ml-auto"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
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