'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Crown, Search, RefreshCw, Filter, Sparkles,
  Phone, Mail, Calendar, Activity, ShieldCheck
} from 'lucide-react';

export default function BasePatronosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('ALL');

  // Registro Oficial do Fundador (Exclusivo e Imutável)
  const founderMember = {
    id: 'FOUNDER-001',
    name: 'Diego Oliveira Gomes do Nascimento',
    email: 'fundador@laromme.com.br',
    phone: '(85) 99124-0000',
    cpf: '024.771.053-96',
    birthDate: '26/07/2000',
    sport: 'Vôlei de Praia',
    tier: 'FOUNDER',
    role: 'Fundador & Diretor Criativo',
    status: 'Custódia Permanente',
    totalSpent: 894.25
  };

  // Base de Patronos
  const members = [
    founderMember
  ];

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cpf.includes(searchTerm);
    const matchesSport = selectedSport === 'ALL' || m.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            RELACIONAMENTO & INTELIGÊNCIA DE AUDIÊNCIA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Base de Patronos & VIP
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestão de membros, perfil esportivo e preferências de compra para drops exclusivos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> 1 Registro Fundador
          </span>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 pl-9 pr-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 rounded-lg focus:outline-none focus:border-zinc-500 font-mono shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-white border border-zinc-200 px-3 py-2.5 text-xs font-mono text-zinc-700 rounded-lg focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="ALL">Todas as Modalidades</option>
            <option value="Vôlei de Praia">Vôlei de Praia</option>
            <option value="Beach Tennis">Beach Tennis</option>
            <option value="Futevôlei">Futevôlei</option>
            <option value="Corrida">Corrida</option>
            <option value="Musculação / Treino">Musculação / Treino</option>
            <option value="Cotidiano / Lifestyle">Cotidiano / Lifestyle</option>
          </select>
        </div>
      </div>

      {/* TABELA DE PATRONOS */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Patrono</th>
                <th className="py-3 px-4">Esporte Principal</th>
                <th className="py-3 px-4">Nascimento</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Tier / Cargo</th>
                <th className="py-3 px-4 text-right">Aportes / LTV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMembers.map((member) => {
                const isFounder = member.tier === 'FOUNDER';

                return (
                  <tr
                    key={member.id}
                    className={`transition-colors ${
                      isFounder
                        ? 'bg-gradient-to-r from-amber-50/80 via-yellow-50/40 to-amber-50/80 border-y-2 border-amber-400/80 font-bold shadow-sm'
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    {/* NOME E STATUS */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isFounder && (
                          <span
                            className="p-1 rounded-full bg-amber-400 text-amber-950 shadow-sm flex items-center justify-center text-xs"
                            title="Founder • Coroa de Louros LaRomme"
                          >
                            👑
                          </span>
                        )}
                        <div>
                          <div className={`font-serif tracking-wide text-xs ${isFounder ? 'text-amber-950 font-bold' : 'text-zinc-900 font-medium'}`}>
                            {member.name}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono block">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ESPORTE */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5 border ${
                          isFounder
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <Activity className="w-3 h-3 text-amber-600" />
                        {member.sport}
                      </span>
                    </td>

                    {/* DATA DE NASCIMENTO */}
                    <td className="py-3.5 px-4 text-zinc-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{member.birthDate}</span>
                      </div>
                    </td>

                    {/* CPF */}
                    <td className="py-3.5 px-4 text-zinc-600">
                      {member.cpf}
                    </td>

                    {/* TIER COM LOUROS */}
                    <td className="py-3.5 px-4">
                      {isFounder ? (
                        <span className="px-2.5 py-1 rounded bg-amber-200/80 border border-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit shadow-xs">
                          <span>🌿</span> FOUNDER <span>🌿</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] uppercase">
                          PATRONO
                        </span>
                      )}
                    </td>

                    {/* LTV */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-mono font-bold ${isFounder ? 'text-amber-950 text-sm' : 'text-zinc-900'}`}>
                        {formatBRL(member.totalSpent)}
                      </span>
                      {isFounder && (
                        <span className="text-[9px] text-amber-700 block uppercase font-mono">
                          Custódia de Fundação
                        </span>
                      )}
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