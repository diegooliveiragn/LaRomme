'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Crown, RefreshCw, Search, ArrowUpRight, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface VipMember {
  id: string;
  nome: string;
  email: string;
  esporte: string;
  tamanho: string;
  created_at: string;
}

export default function CortexCrmPage() {
  const [activeTab, setActiveTab] = useState<'SENADO' | 'COMPRADORES'>('SENADO');
  const [members, setMembers] = useState<VipMember[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCrmData = async () => {
    setLoading(true);
    try {
      // 1. Membros do Senado VIP
      const { data: vipData } = await supabase
        .from('lote_zero_leads')
        .select('*')
        .order('created_at', { ascending: false });

      setMembers(vipData || []);

      // 2. Pedidos reais
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);
    } catch (err) {
      console.error('Erro ao carregar CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const filteredMembers = members.filter((m) =>
    m.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.esporte?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            CONCIERGE & RELACIONAMENTO • BASE QUALIFICADA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            CRM • Senado VIP & Patronos
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestão de relacionamento exclusivo, alistamento prioritário e inteligência de recompra
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cortex/estoque"
            className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            ← WMS & Demanda
          </Link>
          <button
            onClick={fetchCrmData}
            disabled={loading}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* TABS DE SELEÇÃO */}
      <div className="flex justify-between items-center border-b border-zinc-200">
        <div className="flex gap-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('SENADO')}
            className={`pb-3 font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'SENADO'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Senado VIP ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPRADORES')}
            className={`pb-3 font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'COMPRADORES'
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Patronos Compradores ({orders.length})
          </button>
        </div>

        {/* BUSCA RÁPIDA */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou esporte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded text-zinc-900 focus:outline-none focus:border-zinc-900 w-64"
          />
        </div>
      </div>

      {/* CONTEÚDO: TABELA SENADO VIP */}
      {activeTab === 'SENADO' && (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" /> Membros Alistados no Senado VIP
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Acesso Antecipado 24h
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Membro / Patrono</th>
                  <th className="px-6 py-3 font-bold">E-mail</th>
                  <th className="px-6 py-3 font-bold">Modalidade</th>
                  <th className="px-6 py-3 font-bold text-center">Grade</th>
                  <th className="px-6 py-3 font-bold text-right">Data de Ingresso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400">
                      Nenhum membro encontrado na busca.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold font-sans text-sm text-zinc-900">
                        {m.nome}
                      </td>
                      <td className="px-6 py-3.5 text-zinc-600">
                        {m.email}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase font-semibold">
                          {m.esporte || 'Litoral'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center font-bold text-zinc-900">
                        {m.tamanho || '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right text-zinc-400">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO: TABELA PATRONOS COMPRADORES */}
      {activeTab === 'COMPRADORES' && (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" /> Histórico de Compras de Patronos
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Supabase Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Pedido</th>
                  <th className="px-6 py-3 font-bold">Cliente</th>
                  <th className="px-6 py-3 font-bold">E-mail</th>
                  <th className="px-6 py-3 font-bold text-right">Valor Gasto</th>
                  <th className="px-6 py-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400">
                      Nenhum comprador registrado na base.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-zinc-900">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-3.5 font-sans font-bold text-zinc-900">
                        {ord.customer_name || 'Patrono'}
                      </td>
                      <td className="px-6 py-3.5 text-zinc-600">
                        {ord.customer_email || '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-emerald-600">
                        {formatBRL(ord.total_amount)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}