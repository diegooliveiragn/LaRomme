'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Award, Gift, DollarSign, Plus, RefreshCw,
  Search, ExternalLink, TrendingUp, CheckCircle2, X
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Ambassador {
  id: string;
  name: string;
  instagram_handle: string;
  niche: string;
  coupon_code: string;
  commission_pct: number;
  total_sales_count: number;
  total_revenue_generated: number;
  status: 'ATIVO' | 'PAUSA' | 'EM_ANALISE';
}

export default function CortexEmbaixadoresPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instagram_handle: '',
    niche: 'Vôlei de Praia',
    coupon_code: '',
    commission_pct: 10
  });

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('ambassadors').select('*');
      
      if (data && data.length > 0) {
        setAmbassadors(data);
      } else {
        // Base inicial de embaixadores focada nas modalidades oficiais
        setAmbassadors([
          {
            id: 'amb-001',
            name: 'Atleta Referência • Vôlei de Praia',
            instagram_handle: '@atleta.praia',
            niche: 'Vôlei de Praia',
            coupon_code: 'PRAIA10',
            commission_pct: 10,
            total_sales_count: 1,
            total_revenue_generated: 289.00,
            status: 'ATIVO'
          }
        ]);
      }
    } catch (err) {
      console.error('Erro ao buscar embaixadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAmb = {
        name: formData.name,
        instagram_handle: formData.instagram_handle.startsWith('@') ? formData.instagram_handle : `@${formData.instagram_handle}`,
        niche: formData.niche,
        coupon_code: formData.coupon_code.toUpperCase().trim(),
        commission_pct: Number(formData.commission_pct) || 10,
        total_sales_count: 0,
        total_revenue_generated: 0,
        status: 'ATIVO'
      };

      await supabase.from('ambassadors').insert([newAmb]);
      setIsModalOpen(false);
      fetchAmbassadors();
    } catch (err: any) {
      alert('Erro ao salvar embaixador: ' + err.message);
    }
  };

  const filtered = ambassadors.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.instagram_handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.coupon_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGeneratedRevenue = ambassadors.reduce((acc, curr) => acc + (curr.total_revenue_generated || 0), 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            PARCERIAS & AQUISIÇÃO ORGÂNICA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Microinfluenciadores & Embaixadores
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestão de seeding, cupons oficiais e comissionamento por modalidade
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Parceiro</span>
          </button>

          <button
            onClick={fetchAmbassadors}
            disabled={loading}
            className="px-3.5 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Embaixadores Ativos
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            {ambassadors.length}
          </span>
          <span className="text-[11px] text-zinc-400">Atletas e formadores de opinião</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
            Receita Atribuída
          </span>
          <span className="text-3xl font-bold text-emerald-600 font-mono tracking-tight my-2">
            {formatBRL(totalGeneratedRevenue)}
          </span>
          <span className="text-[11px] text-zinc-400">Vendas via cupons oficiais</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
            Comissão Média
          </span>
          <span className="text-3xl font-bold text-indigo-600 font-mono tracking-tight my-2">
            10%
          </span>
          <span className="text-[11px] text-zinc-400">Repasse líquido por conversão</span>
        </div>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar por nome, Instagram ou cupom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-zinc-200 pl-9 pr-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 rounded-lg focus:outline-none focus:border-zinc-500 font-mono shadow-sm"
        />
      </div>

      {/* TABELA DE EMBAIXADORES */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Parceiro</th>
                <th className="py-3 px-4">Instagram</th>
                <th className="py-3 px-4">Modalidade</th>
                <th className="py-3 px-4">Cupom</th>
                <th className="py-3 px-4">Comissão</th>
                <th className="py-3 px-4">Pedidos</th>
                <th className="py-3 px-4 text-right">Receita Gerada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((amb) => (
                <tr key={amb.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-sans">
                    {amb.name}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">
                    <a
                      href={`https://instagram.com/${amb.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      {amb.instagram_handle}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] uppercase font-bold">
                      {amb.niche}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-mono">
                    {amb.coupon_code}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700">
                    {amb.commission_pct}%
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-800">
                    {amb.total_sales_count}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                    {formatBRL(amb.total_revenue_generated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO PARCEIRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900">
                Cadastrar Novo Embaixador
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do atleta / criador"
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Perfil Instagram:</label>
                <input
                  type="text"
                  required
                  value={formData.instagram_handle}
                  onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                  placeholder="@usuario"
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Modalidade:</label>
                  <select
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 px-2 py-2 rounded text-zinc-900 text-[11px]"
                  >
                    <option value="Vôlei de Praia">Vôlei de Praia</option>
                    <option value="Beach Tennis">Beach Tennis</option>
                    <option value="Futevôlei">Futevôlei</option>
                    <option value="Corrida">Corrida</option>
                    <option value="Musculação / Treino">Musculação</option>
                    <option value="Cotidiano / Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Cupom Exclusivo:</label>
                  <input
                    type="text"
                    required
                    value={formData.coupon_code}
                    onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="EXEMPLO10"
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Comissão (% sobre venda líquida):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.commission_pct}
                  onChange={(e) => setFormData({ ...formData, commission_pct: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Salvar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}