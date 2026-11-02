'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Crown, Search, RefreshCw, Mail, Download,
  CheckCircle2, Sparkles, Filter, Activity, Calendar
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SenadoVipPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSenado = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('senado_vip')
        .select('*')
        .order('created_at', { ascending: false });

      // Registro do Fundador fixo
      const founder = {
        id: 'FOUNDER-001',
        nome: 'Diego Oliveira Gomes do Nascimento',
        email: 'fundador@laromme.com.br',
        esporte: 'Vôlei de Praia',
        tamanho: 'M',
        estado: 'CE',
        created_at: '2026-10-12T10:00:00Z',
        is_founder: true
      };

      const list = [founder, ...(data || [])];
      setMembers(list);
    } catch (err: any) {
      console.error('Erro ao buscar membros do senado:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenado();
  }, []);

  const filtered = members.filter((m) =>
    (m.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            GESTAO DE EXCLUSIVIDADE & ACESSO ANTECIPADO
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Senado VIP • Drop 01
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Patronos cadastrados para compra antecipada (24 horas antes da abertura geral)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSenado}
            disabled={loading}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Membros</span>
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Total no Senado VIP
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            {members.length}
          </span>
          <span className="text-[11px] text-zinc-400">Patronos homologados para acesso</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
            Aporte Base / LTV
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            R$ 894,25
          </span>
          <span className="text-[11px] text-amber-800 font-bold">Custódia & Insumos de Fundação</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
            Modalidade Líder
          </span>
          <span className="text-3xl font-bold text-emerald-600 font-mono tracking-tight my-2">
            Vôlei de Praia
          </span>
          <span className="text-[11px] text-zinc-400">Maior afinidade declarada</span>
        </div>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 pl-9 pr-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 rounded-lg focus:outline-none focus:border-zinc-500 font-mono shadow-sm"
          />
        </div>
      </div>

      {/* TABELA DE MEMBROS */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Patrono</th>
                <th className="py-3 px-4">Modalidade Principal</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">UF</th>
                <th className="py-3 px-4">Tier / Categoria</th>
                <th className="py-3 px-4 text-right">Data de Entrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((m) => {
                const isFounder = m.is_founder === true;

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isFounder
                        ? 'bg-gradient-to-r from-amber-50/80 via-yellow-50/40 to-amber-50/80 border-y-2 border-amber-400/80 font-bold shadow-sm'
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isFounder && <span className="p-1 rounded-full bg-amber-400 text-amber-950 text-xs">👑</span>}
                        <div>
                          <span className={`font-serif text-xs ${isFounder ? 'font-bold text-amber-950' : 'text-zinc-900 font-medium'}`}>
                            {m.nome}
                          </span>
                          <span className="text-[10px] text-zinc-500 block">{m.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        isFounder ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}>
                        {m.esporte || 'Vôlei de Praia'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-800">
                      {m.tamanho || 'M'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-700">
                      {m.estado || 'CE'}
                    </td>

                    <td className="py-3.5 px-4">
                      {isFounder ? (
                        <span className="px-2 py-0.5 rounded bg-amber-200/80 border border-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                          🌿 FOUNDER 🌿
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] uppercase">
                          SENADOR VIP
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-zinc-500">
                      {new Date(m.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}