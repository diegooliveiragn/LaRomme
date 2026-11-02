'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Crown, Search, RefreshCw, Plus, Edit2, Trash2,
  X, Check, Activity, ShieldAlert, Sparkles
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Member {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  esporte?: string;
  tamanho?: string;
  estado?: string;
  is_founder?: boolean;
  created_at: string;
}

export default function SenadoVipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Modal (Adicionar / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    esporte: 'Vôlei de Praia',
    tamanho: 'M',
    estado: 'CE'
  });

  const fetchSenado = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('senado_vip')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Unifica lista garantindo que o Fundador tenha registro único
      const rawList: Member[] = data || [];
      const founderEmail = 'fundador@laromme.com.br';
      
      const hasFounderInDb = rawList.some(
        (m) => m.email?.toLowerCase() === founderEmail || m.email?.toLowerCase() === 'diegooliveiragn@gmail.com'
      );

      let finalMembers: Member[] = [];

      if (!hasFounderInDb) {
        finalMembers.push({
          id: 'founder-001',
          nome: 'Diego Oliveira Gomes do Nascimento',
          email: founderEmail,
          telefone: '(85) 99124-0000',
          esporte: 'Vôlei de Praia',
          tamanho: 'M',
          estado: 'CE',
          is_founder: true,
          created_at: '2026-10-12T10:00:00Z'
        });
      }

      rawList.forEach((item) => {
        const isDiego =
          item.email?.toLowerCase() === founderEmail ||
          item.email?.toLowerCase() === 'diegooliveiragn@gmail.com';

        finalMembers.push({
          ...item,
          is_founder: isDiego
        });
      });

      // Remove eventuais duplicações de e-mail na visualização
      const uniqueMap = new Map<string, Member>();
      finalMembers.forEach((m) => {
        const key = (m.email || m.id).toLowerCase();
        if (!uniqueMap.has(key) || m.is_founder) {
          uniqueMap.set(key, m);
        }
      });

      setMembers(Array.from(uniqueMap.values()));
    } catch (err: any) {
      console.error('Erro ao buscar senado:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenado();
  }, []);

  // Abrir Modal para Criação
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      esporte: 'Vôlei de Praia',
      tamanho: 'M',
      estado: 'CE'
    });
    setIsModalOpen(true);
  };

  // Abrir Modal para Edição
  const handleOpenEdit = (m: Member) => {
    setEditingId(m.id);
    setFormData({
      nome: m.nome || '',
      email: m.email || '',
      telefone: m.telefone || '',
      esporte: m.esporte || 'Vôlei de Praia',
      tamanho: m.tamanho || 'M',
      estado: m.estado || 'CE'
    });
    setIsModalOpen(true);
  };

  // Salvar (Insert ou Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    try {
      if (editingId && !editingId.startsWith('founder-')) {
        // Update no Supabase
        const { error } = await supabase
          .from('senado_vip')
          .update({
            nome: formData.nome,
            email: formData.email.toLowerCase().trim(),
            telefone: formData.telefone,
            esporte: formData.esporte,
            tamanho: formData.tamanho,
            estado: formData.estado.toUpperCase()
          })
          .eq('id', editingId);

        if (error) throw error;
      } else if (!editingId) {
        // Insert no Supabase
        const { error } = await supabase.from('senado_vip').insert([
          {
            nome: formData.nome,
            email: formData.email.toLowerCase().trim(),
            telefone: formData.telefone,
            esporte: formData.esporte,
            tamanho: formData.tamanho,
            estado: formData.estado.toUpperCase()
          }
        ]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchSenado();
    } catch (err: any) {
      alert('Erro ao salvar membro: ' + err.message);
    }
  };

  // Excluir Membro
  const handleDelete = async (id: string, name: string) => {
    if (id.startsWith('founder-')) {
      alert('O registro do Fundador é protegido contra exclusão.');
      return;
    }
    if (!confirm(`Confirmar exclusão de ${name} do Senado VIP?`)) return;

    try {
      const { error } = await supabase.from('senado_vip').delete().eq('id', id);
      if (error) throw error;
      fetchSenado();
    } catch (err: any) {
      alert('Erro ao excluir membro: ' + err.message);
    }
  };

  const filtered = members.filter(
    (m) =>
      (m.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO COM AÇÃO DE NOVO MEMBRO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            GESTÃO DE EXCLUSIVIDADE & ACESSO ANTECIPADO
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Senado VIP • Drop 01
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Base oficial de patronos com acesso antecipado de 24 horas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Membro</span>
          </button>

          <button
            onClick={fetchSenado}
            disabled={loading}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Total no Senado VIP</span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">{members.length}</span>
          <span className="text-[11px] text-zinc-400">Patronos cadastrados sem duplicatas</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">Aporte Base / LTV</span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">R$ 894,25</span>
          <span className="text-[11px] text-amber-800 font-bold">Custódia & Insumos de Fundação</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">Modalidade Líder</span>
          <span className="text-3xl font-bold text-emerald-600 font-mono tracking-tight my-2">Vôlei de Praia</span>
          <span className="text-[11px] text-zinc-400">Maior afinidade declarada</span>
        </div>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-zinc-200 pl-9 pr-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 rounded-lg focus:outline-none focus:border-zinc-500 font-mono shadow-sm"
        />
      </div>

      {/* TABELA DE MEMBROS COM AÇÕES (EDITAR / EXCLUIR) */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Patrono</th>
                <th className="py-3 px-4">Modalidade</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">UF</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-center">Ações</th>
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {isFounder && <span className="p-1 rounded-full bg-amber-400 text-amber-950 text-xs">👑</span>}
                        <div>
                          <span className={`font-serif text-xs ${isFounder ? 'font-bold text-amber-950' : 'text-zinc-900 font-medium'}`}>
                            {m.nome || 'Patrono'}
                          </span>
                          <span className="text-[10px] text-zinc-500 block">{m.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        isFounder ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}>
                        {m.esporte || 'Vôlei de Praia'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-zinc-800">{m.tamanho || 'M'}</td>
                    <td className="py-3 px-4 font-bold text-zinc-700">{m.estado || 'CE'}</td>

                    <td className="py-3 px-4">
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

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!isFounder && (
                          <button
                            onClick={() => handleDelete(m.id, m.nome)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADICIONAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900">
                {editingId ? 'Editar Membro do Senado' : 'Adicionar Novo Membro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">E-mail Oficial:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">WhatsApp / Telefone:</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(85) 90000-0000"
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded text-zinc-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Modalidade:</label>
                  <select
                    value={formData.esporte}
                    onChange={(e) => setFormData({ ...formData, esporte: e.target.value })}
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
                  <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">Grade:</label>
                  <select
                    value={formData.tamanho}
                    onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 px-2 py-2 rounded text-zinc-900 text-[11px]"
                  >
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 uppercase text-[10px] font-bold mb-1">UF:</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-50 border border-zinc-200 px-2 py-2 rounded text-zinc-900 text-center uppercase"
                  />
                </div>
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}