'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Crown, Star, Mail, ArrowUpRight, Trophy, ShieldCheck, RefreshCw } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PatronVIP {
  id: string;
  email: string;
  full_name: string;
  total_spent: number;
  order_count: number;
  last_order_date?: string;
  categoria: 'CÔNSUL' | 'SENADOR' | 'PATRONO';
}

export default function SenadoVipPage() {
  const [members, setMembers] = useState<PatronVIP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVipData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['paid', 'shipped', 'delivered']);

      const orders = ordersData || [];
      const customerMap: Record<string, PatronVIP> = {};

      orders.forEach((ord: any) => {
        const email = (ord.customer_email || 'anonimo@laromme.com.br').toLowerCase().trim();
        const amount = Number(ord.total_amount || ord.subtotal || 0);
        const orderDate = ord.created_at;

        if (!customerMap[email]) {
          customerMap[email] = {
            id: ord.id,
            email,
            full_name: ord.customer_name || 'Patrono Anônimo',
            total_spent: 0,
            order_count: 0,
            last_order_date: orderDate,
            categoria: 'PATRONO',
          };
        }

        customerMap[email].total_spent += amount;
        customerMap[email].order_count += 1;
        
        if (new Date(orderDate) > new Date(customerMap[email].last_order_date!)) {
          customerMap[email].last_order_date = orderDate;
        }
      });

      // Filtra apenas membros elegíveis (gastaram >= 1000 OU têm >= 3 pedidos)
      const vipProfiles: PatronVIP[] = Object.values(customerMap)
        .filter((cust) => cust.total_spent >= 1000 || cust.order_count >= 3)
        .map((cust) => {
          let categoria: PatronVIP['categoria'] = 'PATRONO';
          if (cust.total_spent >= 3000) categoria = 'CÔNSUL';
          else if (cust.total_spent >= 1500) categoria = 'SENADOR';
          
          return { ...cust, categoria };
        })
        .sort((a, b) => b.total_spent - a.total_spent); // Ordena por maior LTV

      setMembers(vipProfiles);
    } catch (error) {
      console.error('Erro ao buscar dados VIP:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVipData();
  }, []);

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalMembers = members.length;
  const totalRevenue = members.reduce((acc, curr) => acc + curr.total_spent, 0);
  const avgLtv = totalMembers > 0 ? totalRevenue / totalMembers : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">

      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Gestão de Exclusividade
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            Senado VIP
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-2 font-bold">Gestão de Patronos, Valor Vitalício e Acesso Antecipado</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 shadow-sm">
            <Mail className="w-3.5 h-3.5" /> Exportar Lista
          </button>
          <button className="px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-amber-950 bg-amber-400 rounded hover:bg-amber-300 transition-colors flex items-center gap-2 shadow-sm">
            <Crown className="w-4 h-4" /> Conceder Acesso Antecipado
          </button>
        </div>
      </div>

      {/* KPIs DO SENADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Total de Membros</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-4xl font-black text-white tracking-tight tabular-nums">{loading ? '...' : totalMembers}</span>
            <p className="text-[11px] font-mono text-emerald-400 mt-2 font-bold">Membros ativos</p>
          </div>
        </div>

        <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">Valor Vitalício Médio</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="relative z-10">
            <span className="text-4xl font-black text-amber-400 tracking-tight tabular-nums font-mono">{loading ? '...' : formatBRL(avgLtv)}</span>
            <p className="text-[11px] font-mono text-amber-300/80 mt-2 font-bold">Média gasta por VIP</p>
          </div>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">Receita Retida do Clube</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400 tracking-tight block tabular-nums font-mono">{loading ? '...' : formatBRL(totalRevenue)}</span>
            <p className="text-[11px] font-mono text-emerald-300/80 mt-2 font-bold">Volume financeiro acumulado</p>
          </div>
        </div>

      </div>

      {/* TABELA DE MEMBROS VIP */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Ranking de Exclusividade
          </h2>
          <button onClick={fetchVipData} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-500">
            Processando matriz relacional do Senado...
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-500">
            Nenhum membro elegível no momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-bold">Patrono</th>
                  <th className="px-6 py-4 font-bold text-center">Categoria</th>
                  <th className="px-6 py-4 font-bold text-center">Pedidos</th>
                  <th className="px-6 py-4 font-bold text-right">Valor Vitalício Acumulado</th>
                  <th className="px-6 py-4 font-bold text-right">Última Aquisição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-bold text-white block font-sans text-sm">{member.full_name}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">{member.email}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 w-fit ${
                          member.categoria === 'CÔNSUL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          member.categoria === 'SENADOR' ? 'bg-slate-100 text-slate-900 border border-slate-300' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {member.categoria === 'CÔNSUL' && <Crown className="w-3.5 h-3.5" />}
                          {member.categoria}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-black text-sm text-white tabular-nums">
                      {member.order_count}
                    </td>
                    <td className="px-6 py-5 text-right font-black text-sm text-emerald-400 tabular-nums">
                      {formatBRL(member.total_spent)}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-[11px] text-slate-400">
                      {member.last_order_date ? new Date(member.last_order_date).toLocaleDateString('pt-BR') : '—'}
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