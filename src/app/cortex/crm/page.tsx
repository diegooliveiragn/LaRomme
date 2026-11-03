'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  MessageCircle, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Mail, 
  Phone, 
  Download, 
  Filter 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface VipMember {
  id: string;
  name?: string;
  nome?: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  sport?: string;
  esporte?: string;
  size?: string;
  tamanho?: string;
  created_at: string;
}

interface OrderCustomer {
  email: string;
  name: string;
  totalOrders: number;
  ltv: number;
  lastOrderDate: string;
}

export default function CortexCRMPage() {
  const [activeTab, setActiveTab] = useState<'senado' | 'patronos'>('senado');
  const [vipMembers, setVipMembers] = useState<VipMember[]>([]);
  const [customers, setCustomers] = useState<OrderCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Busca inscritos do Senado VIP
        const { data: vipData } = await supabase
          .from('senado_vip')
          .select('*')
          .order('created_at', { ascending: false });

        if (vipData) setVipMembers(vipData);

        // 2. Busca pedidos concluídos para calcular RFM
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'paid');

        if (ordersData) {
          const map: Record<string, OrderCustomer> = {};
          ordersData.forEach((ord: any) => {
            const email = ord.customer_email || ord.email || 'desconhecido';
            const name = ord.customer_name || ord.nome || 'Patrono';
            const val = Number(ord.total_amount || ord.total || 0);
            const date = ord.created_at;

            if (!map[email]) {
              map[email] = {
                email,
                name,
                totalOrders: 0,
                ltv: 0,
                lastOrderDate: date
              };
            }
            map[email].totalOrders += 1;
            map[email].ltv += val;
            if (new Date(date) > new Date(map[email].lastOrderDate)) {
              map[email].lastOrderDate = date;
            }
          });
          setCustomers(Object.values(map));
        }
      } catch (err) {
        console.error('Erro ao consultar CRM:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openWhatsAppConcierge = (phoneRaw?: string, name?: string) => {
    if (!phoneRaw) return;
    const cleanPhone = phoneRaw.replace(/\D/g, '');
    const clientName = name ? name.split(' ')[0] : 'Patrono';
    const message = encodeURIComponent(
      `Olá ${clientName}, saudações da LaRomme. Estamos concluindo a preparação do seu acesso antecipado. Como podemos atendê-lo?`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredVips = vipMembers.filter(m => {
    const nome = (m.nome || m.name || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    const matchSearch = nome.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const esporte = (m.esporte || m.sport || '').toLowerCase();
    const matchSport = selectedSport === 'all' || esporte.includes(selectedSport.toLowerCase());
    return matchSearch && matchSport;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                CORTEX OS // CONCIERGE & RELACIONAMENTO
              </span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                BASE QUALIFICADA
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase font-mono">
              CRM • Senado VIP & Patronos
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Gestão de relacionamento exclusivo, alistamento prioritário e inteligência de recompra.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cortex/estoque"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              ← WMS & Demanda
            </Link>
            <Link
              href="/cortex/financeiro"
              className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
            >
              Cofres 70/30 →
            </Link>
          </div>
        </div>

        {/* Abas e Controles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 w-full md:w-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('senado')}
              className={`pb-3 px-2 border-b-2 font-bold transition-colors ${
                activeTab === 'senado'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              SENADO VIP ({vipMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('patronos')}
              className={`pb-3 px-2 border-b-2 font-bold transition-colors ${
                activeTab === 'patronos'
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              PATRONOS COMPRADORES ({customers.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            {activeTab === 'senado' && (
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none font-mono"
              >
                <option value="all">Todas modalidades</option>
                <option value="beach">Beach Tennis</option>
                <option value="corrida">Corrida</option>
                <option value="futevolei">Futevôlei</option>
                <option value="ciclismo">Ciclismo</option>
              </select>
            )}
          </div>
        </div>

        {/* Tabela do Senado VIP */}
        {activeTab === 'senado' && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4 font-mono">
            {filteredVips.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                {loading ? 'Consultando alistamento...' : 'Nenhum membro encontrado no filtro selecionado.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 border-b border-zinc-900 uppercase">
                      <th className="py-2.5">Membro / Patrono</th>
                      <th className="py-2.5">E-mail</th>
                      <th className="py-2.5">Modalidade</th>
                      <th className="py-2.5">Grade</th>
                      <th className="py-2.5">Data de Ingresso</th>
                      <th className="py-2.5 text-right">Concierge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {filteredVips.map((vip, i) => {
                      const name = vip.nome || vip.name || 'Patrono VIP';
                      const phone = vip.whatsapp || vip.phone;
                      const sport = vip.esporte || vip.sport || 'Litoral';
                      const size = vip.tamanho || vip.size || 'M';

                      return (
                        <tr key={vip.id || i} className="hover:bg-zinc-900/40">
                          <td className="py-3 font-bold text-white uppercase">{name}</td>
                          <td className="py-3 text-zinc-400">{vip.email}</td>
                          <td className="py-3 text-zinc-300 capitalize">{sport}</td>
                          <td className="py-3 uppercase text-zinc-400 font-bold">{size}</td>
                          <td className="py-3 text-zinc-500 text-[11px]">
                            {new Date(vip.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 text-right">
                            {phone ? (
                              <button
                                onClick={() => openWhatsAppConcierge(phone, name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 text-[11px] rounded transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                                Concierge
                              </button>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tabela de Patronos Compradores (RFM) */}
        {activeTab === 'patronos' && (
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4 font-mono">
            {customers.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                {loading ? 'Calculando matriz RFM...' : 'Nenhum pedido concluído localizado no momento.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 border-b border-zinc-900 uppercase">
                      <th className="py-2.5">Patrono</th>
                      <th className="py-2.5">E-mail</th>
                      <th className="py-2.5">Pedidos Pagos</th>
                      <th className="py-2.5">LTV Acumulado</th>
                      <th className="py-2.5 text-right">Último Pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {customers.map((c, i) => (
                      <tr key={i} className="hover:bg-zinc-900/40">
                        <td className="py-3 font-bold text-white uppercase">{c.name}</td>
                        <td className="py-3 text-zinc-400">{c.email}</td>
                        <td className="py-3 text-zinc-300">{c.totalOrders} pedido(s)</td>
                        <td className="py-3 text-emerald-400 font-bold">R$ {c.ltv.toFixed(2)}</td>
                        <td className="py-3 text-right text-zinc-500 text-[11px]">
                          {new Date(c.lastOrderDate).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}