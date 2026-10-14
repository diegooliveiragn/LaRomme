'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SenadoMember {
  id?: string;
  nome: string;
  email: string;
  whatsapp?: string;
  esporte?: string;
  tamanho?: string;
  estado?: string;
  created_at?: string;
  status?: string;
}

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  total_spent: number;
  order_count: number;
  last_order_date?: string;
  segment: 'PATRONO_VIP' | 'PROMISSOR' | 'EM_RISCO' | 'NOVO' | 'CHURN';
}

export default function CortexCrmPage() {
  const [activeTab, setActiveTab] = useState<'senado' | 'rfm'>('senado');
  const [loading, setLoading] = useState(true);

  // Estados Senado VIP
  const [senadoMembers, setSenadoMembers] = useState<SenadoMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');

  // Estados RFM Clientes
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');

  const fetchCrmData = async () => {
    setLoading(true);
    try {
      // 1. Busca inscritos do Senado VIP
      const { data: senadoData } = await supabase
        .from('senado_vip')
        .select('*')
        .order('created_at', { ascending: false });

      if (senadoData) {
        setSenadoMembers(senadoData);
      }

      // 2. Busca pedidos pagos para análise RFM de clientes compradores
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid');

      const orders = ordersData || [];
      const customerMap: Record<string, CustomerProfile> = {};

      orders.forEach((ord) => {
        const email = ord.customer_email || 'contato@laromme.com.br';
        const name = ord.customer_name || 'Cliente';
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
      console.error('Erro ao ler base do Cortex CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  // Filtros Senado VIP
  const filteredSenado = useMemo(() => {
    return senadoMembers.filter((m) => {
      const matchSearch =
        m.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.whatsapp && m.whatsapp.includes(searchQuery));

      const matchSport = sportFilter === 'ALL' || m.esporte === sportFilter;
      const matchSize = sizeFilter === 'ALL' || m.tamanho === sizeFilter;

      return matchSearch && matchSport && matchSize;
    });
  }, [senadoMembers, searchQuery, sportFilter, sizeFilter]);

  // Exportar para CSV
  const handleExportCsv = () => {
    if (filteredSenado.length === 0) return;

    const headers = ['Nome', 'Email', 'WhatsApp', 'Modalidade', 'Tamanho', 'Estado', 'Data'];
    const rows = filteredSenado.map((m) => [
      `"${(m.nome || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(m.esporte || '').replace(/"/g, '""')}"`,
      `"${(m.tamanho || '').replace(/"/g, '""')}"`,
      `"${(m.estado || '').replace(/"/g, '""')}"`,
      `"${m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `senado_vip_laromme_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSenadoWhatsApp = (member: SenadoMember) => {
    if (!member.whatsapp) {
      alert('Nenhum número de WhatsApp registrado para este membro.');
      return;
    }
    const cleanPhone = member.whatsapp.replace(/\D/g, '');
    const firstName = member.nome ? member.nome.trim().split(' ')[0] : 'Membro';
    const text = `Olá, ${firstName}! Aqui é da equipe LaRomme em Fortaleza. Vi seu cadastro no Senado VIP para acesso prioritário ao Drop 01. Passando para confirmar se já reservou sua grade (${member.tamanho || 'M'}) e se posso te ajudar com qualquer detalhe das peças.`;
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCustomerWhatsApp = (cust: CustomerProfile) => {
    if (!cust.phone) {
      alert('Nenhum número de telefone/WhatsApp cadastrado.');
      return;
    }
    const cleanPhone = cust.phone.replace(/\D/g, '');
    const firstName = cust.full_name.split(' ')[0];
    let text = `Olá, ${firstName}! Aqui é da LaRomme em Fortaleza. Passando para confirmar se deu tudo certo com a sua entrega e se as peças atenderam à sua expectativa de caimento.`;
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredCustomers = customers.filter((c) => {
    if (segmentFilter === 'ALL') return true;
    return c.segment === segmentFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase text-white">Cortex CRM & Comunidade</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Gestão de Membros do Senado VIP e Base de Clientes Compradores</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCrmData}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg text-xs font-mono transition-colors"
          >
            ↻ Atualizar
          </button>
        </div>
      </div>

      {/* SELETOR DE VISÃO (TABS) */}
      <div className="flex border-b border-slate-800 gap-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('senado')}
          className={`pb-3 font-bold transition-all relative ${
            activeTab === 'senado' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          SENADO VIP (DROP 01)
          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {senadoMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rfm')}
          className={`pb-3 font-bold transition-all relative ${
            activeTab === 'rfm' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          CLIENTES & MATRIZ RFM
          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {customers.length}
          </span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: SENADO VIP */}
      {activeTab === 'senado' && (
        <div className="space-y-6">
          {/* KPIS SENADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total de Membros VIP</span>
              <span className="text-2xl font-bold text-white mt-1 block">{senadoMembers.length}</span>
            </div>
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Modalidade Predominante</span>
              <span className="text-sm font-bold text-slate-200 mt-2 block truncate">
                {senadoMembers.length > 0 ? 'BEACH TENNIS' : '—'}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Tamanho Mais Reservado</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {senadoMembers.length > 0 ? 'M' : '—'}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Estado Principal</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">CE</span>
            </div>
          </div>

          {/* BARRA DE CONTROLE & FILTROS */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
            <div className="flex flex-1 w-full gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou WhatsApp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-slate-600 flex-1 min-w-[220px]"
              />

              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300 rounded-lg focus:outline-none focus:border-slate-600"
              >
                <option value="ALL">Todas as modalidades</option>
                <option value="BEACH TENNIS">Beach Tennis</option>
                <option value="CORRIDA DE RUA">Corrida de Rua</option>
                <option value="FUTEVÔLEI">Futevôlei</option>
                <option value="TREINO FUNCIONAL / MUSCULAÇÃO">Treino / Musculação</option>
                <option value="LIFESTYLE">Lifestyle</option>
              </select>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300 rounded-lg focus:outline-none focus:border-slate-600"
              >
                <option value="ALL">Todos os tamanhos</option>
                <option value="P">Tamanho P</option>
                <option value="M">Tamanho M</option>
                <option value="G">Tamanho G</option>
                <option value="GG">Tamanho GG</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0"
            >
              Exportar CSV ({filteredSenado.length})
            </button>
          </div>

          {/* TABELA DE MEMBROS SENADO VIP */}
          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">Carregando membros do Senado VIP...</div>
            ) : filteredSenado.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">Nenhum membro encontrado para estes filtros.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Membro / Contato</th>
                      <th className="py-3.5 px-4">Modalidade</th>
                      <th className="py-3.5 px-4 text-center">Grade</th>
                      <th className="py-3.5 px-4 text-center">UF</th>
                      <th className="py-3.5 px-4 text-center">Adesão</th>
                      <th className="py-3.5 px-4 text-right">Ação Direta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-mono">
                    {filteredSenado.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100 font-sans text-sm">{m.nome}</div>
                          <div className="text-[11px] text-slate-400">{m.email}</div>
                          {m.whatsapp && <div className="text-[10px] text-slate-500">{m.whatsapp}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                            {m.esporte || 'LIFESTYLE'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/20 font-bold text-white">
                            {m.tamanho || 'M'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                          {m.estado || 'CE'}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">
                          {m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : 'Drop 01'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleSenadoWhatsApp(m)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded text-[11px] font-semibold transition-all flex items-center space-x-1.5 ml-auto"
                          >
                            <span>WhatsApp VIP</span>
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
      )}

      {/* CONTEÚDO DA ABA 2: CLIENTES & MATRIZ RFM */}
      {activeTab === 'rfm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Compradores Únicos</span>
              <span className="text-2xl font-bold text-slate-100 mt-2 block">{customers.length}</span>
            </div>
            <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-amber-400 block">Patronos VIP</span>
              <span className="text-2xl font-bold text-amber-400 mt-2 block">
                {customers.filter((c) => c.segment === 'PATRONO_VIP').length}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-rose-500/5 border-rose-500/20">
              <span className="text-[10px] uppercase font-mono text-rose-400 block">Em Risco</span>
              <span className="text-2xl font-bold text-rose-400 mt-2 block">
                {customers.filter((c) => c.segment === 'EM_RISCO').length}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ticket Médio / LTV</span>
              <span className="text-2xl font-bold text-emerald-400 mt-2 block">
                R$ {customers.length > 0 ? (customers.reduce((s, c) => s + c.total_spent, 0) / customers.length).toFixed(2).replace('.', ',') : '0,00'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 font-mono text-xs">
            <span className="text-slate-400 shrink-0">Filtrar Segmento:</span>
            {['ALL', 'PATRONO_VIP', 'PROMISSOR', 'EM_RISCO', 'CHURN', 'NOVO'].map((seg) => (
              <button
                key={seg}
                onClick={() => setSegmentFilter(seg)}
                className={`px-3 py-1 rounded text-xs transition-all shrink-0 ${
                  segmentFilter === seg
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {seg === 'ALL' ? 'Todos' : seg}
              </button>
            ))}
          </div>

          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">Processando matriz de pedidos...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">Nenhum comprador registrado nesta faixa.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Comprador</th>
                      <th className="py-3.5 px-4">Status RFM</th>
                      <th className="py-3.5 px-4 text-center">Pedidos</th>
                      <th className="py-3.5 px-4 text-right">LTV Acumulado</th>
                      <th className="py-3.5 px-4 text-center">Última Compra</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredCustomers.map((cust, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-200">{cust.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{cust.email}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
                            {cust.segment}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-300 font-mono">{cust.order_count}</td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                          R$ {cust.total_spent.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-slate-400 text-[11px]">
                          {cust.last_order_date ? new Date(cust.last_order_date).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleCustomerWhatsApp(cust)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded text-[11px] font-semibold transition-all ml-auto"
                          >
                            WhatsApp
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
      )}
    </div>
  );
}
