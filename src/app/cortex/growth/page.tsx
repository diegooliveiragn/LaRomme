'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, Users, Target, Activity, RefreshCw, 
  Plus, Edit2, Trash2, X, Compass, ArrowUpRight, DollarSign, CheckCircle2 
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CampaignItem {
  id: string;
  name: string;
  channel: 'META_ADS' | 'GOOGLE' | 'TIKTOK' | 'INFLUENCER' | 'DIRETO';
  budget: number;
  clicks: number;
  conversions: number;
  status: 'ATIVA' | 'PAUSADA' | 'CONCLUIDA';
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  { id: 'CMP-01', name: 'Lançamento Drop 01 (Fortaleza & Litoral)', channel: 'META_ADS', budget: 150.00, clicks: 380, conversions: 1, status: 'ATIVA' },
  { id: 'CMP-02', name: 'Parcerias & Quadras de Beach Tennis', channel: 'INFLUENCER', budget: 0.00, clicks: 120, conversions: 0, status: 'ATIVA' }
];

export default function CortexGrowthPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  
  // Modal CRUD Campanha
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [campName, setCampName] = useState('');
  const [channel, setChannel] = useState<'META_ADS' | 'GOOGLE' | 'TIKTOK' | 'INFLUENCER' | 'DIRETO'>('META_ADS');
  const [budget, setBudget] = useState('150.00');
  const [clicks, setClicks] = useState('0');
  const [conversions, setConversions] = useState('0');
  const [status, setStatus] = useState<'ATIVA' | 'PAUSADA' | 'CONCLUIDA'>('ATIVA');

  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);

      const saved = localStorage.getItem('laromme_growth_campaigns_v1');
      if (saved) {
        setCampaigns(JSON.parse(saved));
      } else {
        setCampaigns(INITIAL_CAMPAIGNS);
      }
    } catch (e) {
      console.error('Erro ao buscar telemetria de Growth:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const saveCampaigns = (updated: CampaignItem[]) => {
    setCampaigns(updated);
    localStorage.setItem('laromme_growth_campaigns_v1', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Análise Real da Base de Compradores
  const paidOrders = orders.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  
  // Clientes Únicos
  const uniqueEmails = new Set(paidOrders.map(o => o.customer_email || 'anonimo'));
  const totalCustomers = uniqueEmails.size;

  // Total Investido em Mídia
  const totalAdSpend = campaigns.reduce((acc, curr) => acc + curr.budget, 0);
  const realCAC = totalCustomers > 0 ? totalAdSpend / totalCustomers : 0;
  const blendedROAS = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : '0.00';

  const openCreateModal = () => {
    setEditingId(null);
    setCampName('');
    setChannel('META_ADS');
    setBudget('150.00');
    setClicks('0');
    setConversions('0');
    setStatus('ATIVA');
    setIsModalOpen(true);
  };

  const openEditModal = (camp: CampaignItem) => {
    setEditingId(camp.id);
    setCampName(camp.name);
    setChannel(camp.channel);
    setBudget(camp.budget.toString());
    setClicks(camp.clicks.toString());
    setConversions(camp.conversions.toString());
    setStatus(camp.status);
    setIsModalOpen(true);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Deseja excluir esta campanha de aquisição?')) {
      const updated = campaigns.filter(c => c.id !== id);
      saveCampaigns(updated);
    }
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBudget = Number(budget.replace(',', '.')) || 0;
    const cleanClicks = parseInt(clicks) || 0;
    const cleanConversions = parseInt(conversions) || 0;

    if (editingId) {
      const updated = campaigns.map(c =>
        c.id === editingId
          ? { ...c, name: campName, channel, budget: cleanBudget, clicks: cleanClicks, conversions: cleanConversions, status }
          : c
      );
      saveCampaigns(updated);
    } else {
      const newCamp: CampaignItem = {
        id: `CMP-${String(campaigns.length + 1).padStart(2, '0')}`,
        name: campName,
        channel,
        budget: cleanBudget,
        clicks: cleanClicks,
        conversions: cleanConversions,
        status
      };
      saveCampaigns([...campaigns, newCamp]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            AQUISIÇÃO, CAC & INTELIGÊNCIA DE AUDIÊNCIA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Growth & Tração de Mídia
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitoramento de Tráfego Pago, CAC Blended, Campanhas Ativas e Retenção
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Campanha</span>
          </button>
          <button
            onClick={fetchGrowthData}
            disabled={loading}
            className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* KPIS REAIS DE AQUISIÇÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Investimento em Mídia
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(totalAdSpend)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {campaigns.length} campanhas registradas
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            CAC Real (Custo por Cliente)
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(realCAC)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {totalCustomers} {totalCustomers === 1 ? 'cliente convertido' : 'clientes convertidos'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            ROAS Blended de Mídia
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {blendedROAS}x
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Ponto de Equilíbrio: 1.72x
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Base de Patronos Ativos
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {totalCustomers}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Registrados via pedidos Supabase
          </p>
        </div>

      </div>

      {/* TABELA CRUD DE CAMPANHAS DE AQUISIÇÃO */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-500" /> Campanhas Ativas & Rastreamento UTM
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Modo CRUD Operacional
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">Código</th>
                <th className="px-6 py-3 font-bold">Campanha / Ação</th>
                <th className="px-6 py-3 font-bold">Canal</th>
                <th className="px-6 py-3 font-bold text-right">Orçamento</th>
                <th className="px-6 py-3 font-bold text-center">Cliques</th>
                <th className="px-6 py-3 font-bold text-center">Vendas</th>
                <th className="px-6 py-3 font-bold text-center">Status</th>
                <th className="px-6 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400 text-xs">
                    Nenhuma campanha de mídia cadastrada.
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-zinc-400">{camp.id}</td>
                    <td className="px-6 py-3.5 font-bold font-sans text-sm text-zinc-900">{camp.name}</td>
                    <td className="px-6 py-3.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {camp.channel.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-zinc-900">{formatBRL(camp.budget)}</td>
                    <td className="px-6 py-3.5 text-center text-zinc-600">{camp.clicks}</td>
                    <td className="px-6 py-3.5 text-center font-bold text-emerald-600">{camp.conversions}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        camp.status === 'ATIVA' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(camp)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRUD CAMPANHA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Campanha' : 'Nova Campanha de Tráfego'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Nome da Campanha:</label>
                <input
                  type="text"
                  required
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="Ex: Anúncios Instagram Stories Drop 01"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Canal de Origem:</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="META_ADS">META ADS (INSTAGRAM / FB)</option>
                  <option value="GOOGLE">GOOGLE ADS</option>
                  <option value="TIKTOK">TIKTOK ADS</option>
                  <option value="INFLUENCER">INFLUENCER / PARCERIA</option>
                  <option value="DIRETO">DIRETO / ORGÂNICO</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Orçamento (R$):</label>
                  <input
                    type="text"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Cliques:</label>
                  <input
                    type="number"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Vendas:</label>
                  <input
                    type="number"
                    value={conversions}
                    onChange={(e) => setConversions(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="ATIVA">ATIVA</option>
                  <option value="PAUSADA">PAUSADA</option>
                  <option value="CONCLUIDA">CONCLUÍDA</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Salvar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}